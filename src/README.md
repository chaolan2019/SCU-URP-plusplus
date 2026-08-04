# Source layout

The root `urppp.user.js` and `urpppp.user.js` files are generated release artifacts. Edit source files under `src/`, then run `npm run build`.

```text
src/
├── assist/          Assistant storage, configuration, OCR, and form helpers
├── core/            Shared utilities and route-aware feature lifecycle runtime
├── features/        Main userscript feature modules testable without a page
├── metadata/        Userscript metadata merged into generated headers
├── styles/          Readable CSS inlined into the generated userscripts
└── userscripts/     Browser entry points and remaining page orchestration
```

Build rules:

- Both installable artifacts remain single userscript files in the repository root.
- Production output stays readable: no identifier mangling, minification, or obfuscation.
- Userscript metadata and runtime version constants must remain synchronized.
- Generated artifacts are committed and verified with `npm run build:check`.
