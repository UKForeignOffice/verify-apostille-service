# Monthly patching

Insert each new `## YYYY-MM-DD` entry immediately below these instructions,
before older entries (reverse date order, newest first). Include only a
**Dependency / From / To / Why** table listing patched dependencies or override
changes, actual old/new versions and one short reason each. Preserve earlier
entries; do not copy their verbose sections. Keep audits, test output,
commands, hashes and artifact details in separate review evidence; report
unresolved findings in the handoff, not extra log sections.

## 2026-11-16

| Dependency | From | To | Why |
| --- | --- | --- | --- |
| `qs` | 6.16.0 | 6.17.1 | Fix denial of service when serializing comma-separated arrays. |
| `minimatch` global override | ^3.1.5 | Removed | Resolve dependency conflicts so Mocha and its glob dependency use compatible patched versions. |

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
