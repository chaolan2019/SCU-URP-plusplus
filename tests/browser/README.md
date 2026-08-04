# Browser regression tests

The browser suite injects the generated `urppp.user.js` into sanitized URP fixtures. It never connects to the authenticated university system and must not contain real names, student IDs, credentials, cookies, or private course data.

## Commands

```powershell
npm run build
npm run test:browser
npm run test:visual
```

- `test:browser` covers page initialization, native PDF isolation, repeated export, PJAX root replacement, duplicate UI prevention, global listener stability, and detached observer cleanup.
- `test:visual` covers all six schedule skins plus representative dark and mobile states.

## Fixtures

```text
tests/fixtures/
├── home.html
├── schedule.html
├── grades.html
├── evaluation.html
└── free-classroom.html
```

The shared harness in `support/urp-fixture.js` provides GM API mocks, blocks fixture network access, collects page errors, and instruments listeners and `MutationObserver` instances for lifecycle assertions.

## Visual baselines

Playwright screenshots are operating-system specific. Windows baselines can be reviewed locally, but they must not be treated as Ubuntu CI baselines.

Generate the initial Ubuntu baselines only in a fixed Ubuntu environment with the repository's locked dependencies:

```bash
npm ci
npx playwright install --with-deps chromium
npm run build
npm run test:visual -- --update-snapshots
npm run test:visual
```

Review every generated `*-linux.png` before committing it. Add `npm run test:visual` to CI only after those Linux baselines exist and pass unchanged on a second run. Do not generate expected images during normal CI because that turns regressions into new baselines.

Authenticated URP acceptance remains mandatory before release; fixtures are a regression guard, not a replacement for real-site verification.
