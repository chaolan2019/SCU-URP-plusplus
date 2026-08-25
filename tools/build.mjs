import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK_ONLY = process.argv.includes('--check');
const MAX_GREASY_FORK_BYTES = 2 * 1024 * 1024;
const HEADER_ORDER = [
  'name',
  'namespace',
  'version',
  'description',
  'author',
  'license',
  'icon',
  'updateURL',
  'downloadURL',
  'match',
  'exclude',
  'grant',
  'connect',
  'run-at',
];

const TARGETS = [
  {
    name: 'urppp',
    entry: 'src/userscripts/urppp.entry.js',
    metadata: 'src/metadata/urppp.json',
    outfile: 'urppp.user.js',
    versionConstant: 'URPPP_VERSION',
  },
  {
    name: 'urpppp',
    entry: 'src/userscripts/urpppp.entry.js',
    metadata: 'src/metadata/urpppp.json',
    outfile: 'urpppp.user.js',
    versionConstant: 'URPPPP_VERSION',
  },
  {
    // 插件产物：无 UserScript 头，供主插件「下载→注入」装载，不经油猴安装
    name: 'urpppp-plugin',
    entry: 'src/userscripts/urpppp.entry.js',
    outfile: 'urpppp.plugin.js',
    versionConstant: 'URPPPP_VERSION',
    noBanner: true,
    plugin: true,
  },
];

async function readJson(relativePath) {
  const text = await readFile(path.join(ROOT, relativePath), 'utf8');
  return JSON.parse(text);
}

function metadataLines(metadata) {
  return HEADER_ORDER.flatMap((key) => {
    const value = metadata[key];
    if (value == null) return [];
    const values = Array.isArray(value) ? value : [value];
    return values.map((item) => `// @${key.padEnd(13, ' ')}${item}`);
  });
}

function userscriptBanner(metadata) {
  return [
    '// ==UserScript==',
    ...metadataLines(metadata),
    '// ==/UserScript==',
    '',
    `// SPDX-License-Identifier: ${metadata.license}`,
    `// ${metadata.copyright}`,
  ].join('\n');
}

function sourceVersion(source, constantName) {
  const pattern = new RegExp(`const\\s+${constantName}\\s*=\\s*['\"]([^'\"]+)['\"]`);
  return source.match(pattern)?.[1] || '';
}

function firstDifference(current, expected) {
  const limit = Math.min(current.length, expected.length);
  for (let index = 0; index < limit; index += 1) {
    if (current[index] !== expected[index]) return index;
  }
  return current.length === expected.length ? -1 : limit;
}

const readableCssPlugin = {
  name: 'readable-css',
  setup(context) {
    context.onLoad({ filter: /\.css$/ }, async ({ path: cssPath }) => {
      const css = await readFile(cssPath, 'utf8');
      const escaped = css
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$\{/g, '\\${');
      return {
        contents: `export default \`${escaped}\`;`,
        loader: 'js',
      };
    });
  },
};

async function compileTarget(target, commonMetadata) {
  const entryPath = path.join(ROOT, target.entry);
  const outfilePath = path.join(ROOT, target.outfile);
  const source = await readFile(entryPath, 'utf8');
  const runtimeVersion = sourceVersion(source, target.versionConstant);
  if (!runtimeVersion) {
    throw new Error(`${target.name}: cannot resolve ${target.versionConstant} from entry`);
  }

  let metadata = null;
  if (!target.noBanner) {
    const targetMetadata = await readJson(target.metadata);
    metadata = { ...commonMetadata, ...targetMetadata };
    if (runtimeVersion !== metadata.version) {
      throw new Error(
        `${target.name}: metadata version ${metadata.version} does not match ${target.versionConstant} ${runtimeVersion}`,
      );
    }
  }

  const banner = target.noBanner ? '' : `${userscriptBanner(metadata)}\n`;

  const result = await build({
    absWorkingDir: ROOT,
    entryPoints: [target.entry],
    outfile: target.outfile,
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'esnext',
    charset: 'utf8',
    minify: true,
    keepNames: true,
    legalComments: 'inline',
    treeShaking: true,
    sourcemap: false,
    write: false,
    metafile: true,
    plugins: [readableCssPlugin],
    banner: { js: banner },
    logLevel: 'silent',
  });
  const contents = result.outputFiles[0].contents;
  if (contents.length > MAX_GREASY_FORK_BYTES) {
    throw new Error(`${target.name}: ${contents.length} bytes exceeds the 2 MiB release limit`);
  }

  if (CHECK_ONLY) {
    const current = await readFile(outfilePath);
    if (!current.equals(contents)) {
      const offset = firstDifference(current, contents);
      throw new Error(
        `${target.outfile} is stale (current ${current.length} bytes, expected ${contents.length} bytes, first difference ${offset})`,
      );
    }
  } else {
    await writeFile(outfilePath, contents);
  }

  return {
    name: target.name,
    bytes: contents.length,
    inputs: Object.keys(result.metafile.inputs).length,
  };
}

async function main() {
  const [commonMetadata, packageMetadata] = await Promise.all([
    readJson('src/metadata/common.json'),
    readJson('package.json'),
  ]);
  const mainMetadata = await readJson('src/metadata/urppp.json');
  if (packageMetadata.version !== mainMetadata.version) {
    throw new Error(`package version ${packageMetadata.version} does not match main userscript ${mainMetadata.version}`);
  }

  const reports = [];
  for (const target of TARGETS) {
    reports.push(await compileTarget(target, commonMetadata));
  }
  reports.forEach((report) => {
    console.log(`${CHECK_ONLY ? 'verified' : 'built'} ${report.name}: ${report.bytes} bytes from ${report.inputs} source files`);
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
