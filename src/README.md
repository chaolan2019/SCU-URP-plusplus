# Source layout

The root `urppp.user.js` and `urpppp.user.js` files are generated release artifacts. Edit source files under `src/`, then run `npm run build`.

```text
src/
├── features/        Pure feature modules that can be tested without a page
├── metadata/        Userscript metadata merged into generated headers
└── userscripts/     Browser entry points and page integration code
```

Build rules:

- Both installable artifacts remain single userscript files in the repository root.
- Production output stays readable: no identifier mangling, minification, or obfuscation.
- Userscript metadata and runtime version constants must remain synchronized.
- Generated artifacts are committed and verified with `npm run build:check`.
