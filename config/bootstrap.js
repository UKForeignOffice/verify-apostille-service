const path = require('path');
const fs = require('fs');
const fsp = fs.promises;

module.exports.bootstrap = function (cb) {
    const appPath = sails.config.appPath;

    // Source: precompiled files in node_modules
    const srcDist   = path.join(appPath, 'node_modules', 'govuk-frontend', 'dist', 'govuk');
    const srcAssets = path.join(srcDist, 'assets');
    const srcCss    = path.join(srcDist, 'govuk-frontend.min.css');
    const srcJs     = path.join(srcDist, 'govuk-frontend.min.js');

    // Destination: Sails assets folder (served via .tmp/public/)
    const assetsRoot   = path.join(appPath, 'assets');
    const destFonts    = path.join(assetsRoot, 'assets', 'fonts');
    const destImages   = path.join(assetsRoot, 'assets', 'images');
    const destCss      = path.join(assetsRoot, 'stylesheets', 'govuk-frontend.min.css');
    const destJs       = path.join(assetsRoot, 'javascripts', 'govuk-frontend.min.js');

    (async () => {
        try {
            // Ensure folders exist
            await fsp.mkdir(destFonts, { recursive: true });
            await fsp.mkdir(destImages, { recursive: true });
            await fsp.mkdir(path.dirname(destCss), { recursive: true });
            await fsp.mkdir(path.dirname(destJs), { recursive: true });

            // 1) Copy fonts/ and images/ only
            await ensureLinkOrCopy(path.join(srcAssets, 'fonts'), destFonts);
            await ensureLinkOrCopy(path.join(srcAssets, 'images'), destImages);

            // 2) Copy JS
            await copyFile(srcJs, destJs);

            // 3) Copy and rewrite CSS asset URLs to /assets/
            await copyCssWithRewrittenAssetUrls(srcCss, destCss, '/assets/');

            sails.log.verbose('✅ GOV.UK Frontend static ready in /assets/, /stylesheets/, /javascripts/');
        } catch (e) {
            sails.log.warn('⚠️ Failed to prepare GOV.UK Frontend static:', e);
        } finally {
            cb(); // Allow app to continue loading
        }
    })();

    // --- helpers ---

    async function ensureLinkOrCopy(src, dest) {
        try {
            const st = await fsp.lstat(dest).catch(() => null);
            if (st) return; // already exists
            try {
                await fsp.symlink(src, dest, 'junction');
            } catch {
                await copyRecursive(src, dest);
            }
        } catch (err) {
            sails.log.warn(`⚠️ Static prep error for ${dest}:`, err);
            await copyRecursive(src, dest);
        }
    }

    async function copyRecursive(src, dest) {
        await fsp.mkdir(dest, { recursive: true });
        const entries = await fsp.readdir(src, { withFileTypes: true });
        for (const e of entries) {
            const s = path.join(src, e.name);
            const d = path.join(dest, e.name);
            if (e.isDirectory()) await copyRecursive(s, d);
            else await fsp.copyFile(s, d);
        }
    }

    async function copyFile(src, dest) {
        await fsp.copyFile(src, dest);
    }

    async function copyCssWithRewrittenAssetUrls(srcCssPath, destCssPath, assetPrefix) {
        let css = await fsp.readFile(srcCssPath, 'utf8');
        css = css.replace(/url\(\s*(['"]?)(\.\.\/)?assets\//g, `url($1${assetPrefix}`);
        await fsp.writeFile(destCssPath, css, 'utf8');
    }
};