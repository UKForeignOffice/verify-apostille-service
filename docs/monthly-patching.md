# Monthly patching

Add a dated section after each month's dependency review. Record resolved versions, the reason for each change, and any findings left for follow-up.

## 2026-10-27

| Dependency | From | To | Why |
| --- | --- | --- | --- |
| `body-parser` | 1.20.6 | 1.20.9 | Fix denial of service from trailing bytes after compressed request bodies. |
| `brace-expansion` | 2.1.4 | 2.1.7 | Fix denial-of-service vulnerabilities involving quadratic expansion and uncontrolled recursion. |
| `compression` | 1.8.1 | 1.8.2 | Fix denial of service caused by a memory leak when a response closes prematurely. |
| `moment` | 2.30.1 | 2.31.0 | Fix path traversal via a crafted non-string locale name. |
| `proxy-addr` (lockfile) | 2.0.7 | 2.0.8 | Fix IP spoofing via IPv4-mapped IPv6 trust subnets. |
| `serialize-javascript` | 7.0.7 | 7.1.4 | Fix XSS via an unescaped closing script tag in a serialized function body. |
| `source-map-js` (lockfile) | 1.0.2 | 1.2.2 | Fix event-loop denial of service through indexed source-map section offsets. |

The initial full audit reported 10 findings (1 critical, 6 high, 1 moderate, 2 low). After compatible updates, full and production audits both report zero findings. Existing Mocha 10 was retained; no major upgrade or Sails downgrade was needed.

`npm ci --ignore-scripts` passed. The targeted Biome check for `package.json` and `git diff --check` passed. `npm run quality` exited 1 because its `--changed --since=develop` comparison processed zero files; it does not include these uncommitted changes.

The six existing Mocha tests passed with `NODE_ENV=test` and `APPLICATIONDATABASE` pointing to a disposable PostgreSQL 18.4 container. Only the development database schema was copied into that container, with no development records. This isolates the controller tests' IP rate-limit writes from the existing development database. The temporary container was removed afterward. Future test runs must also use an isolated datastore; the default configuration is not isolated.

The full local Docker stack was rebuilt with the patched dependencies. App and verify returned HTTP 200, all five internal service checks passed, and PostgreSQL, Redis, ClamAV and pgAdmin responded. Running service dependency versions matched the patched lockfiles. Existing databases and Orbit stub state were retained; live payment, email and address-provider transactions were not exercised.
