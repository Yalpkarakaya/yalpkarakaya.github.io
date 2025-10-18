const fs = require('fs');
const path = require('path');
const https = require('https');

function readSafe(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch { return ''; }
}

function inlineCss(html, hrefPattern, cssContent) {
  const styleTag = `\n<style>\n${cssContent}\n</style>\n`;
  const linkRegex = new RegExp(`<link[^>]+href=["']${hrefPattern}["'][^>]*>`, 'i');
  if (linkRegex.test(html)) return html.replace(linkRegex, styleTag);
  // If not found, inject before </head>
  return html.replace(/<\/head>/i, `${styleTag}</head>`);
}

function removeAll(html, pattern) {
  const re = new RegExp(pattern, 'gi');
  return html.replace(re, '');
}

(async function main() {
  const root = process.cwd();
  const outDir = path.join(root, 'AEK APK');
  fs.mkdirSync(outDir, { recursive: true });

  let html = readSafe(path.join(root, 'index.html'));

  // Inline Tailwind generated CSS
  const twCss = readSafe(path.join(root, 'assets/css/tailwind.generated.css'));
  html = inlineCss(html, '(/)?assets/css/tailwind\.generated\.css', twCss);

  // Inline site CSS
  const siteCss = readSafe(path.join(root, 'assets/css/akilli-eldiven.css'));
  html = inlineCss(html, '(/)?assets/css/akilli\-eldiven\.css', siteCss);

  // Inline remote stylesheets
  const remoteCssMarkers = [];
  html = html.replace(/<link[^>]+rel=["']stylesheet["'][^>]*href=["'](https?:[^"']+)["'][^>]*>/gi, (m, href) => {
    const marker = `<!-- inlined-css:${href} -->`;
    remoteCssMarkers.push({ href, marker });
    return marker;
  });
  for (const { href, marker } of remoteCssMarkers) {
    const css = await new Promise(resolve => {
      https.get(href, res => {
        if (res.statusCode !== 200) return resolve('');
        let data = '';
        res.setEncoding('utf8');
        res.on('data', c => (data += c));
        res.on('end', () => resolve(data));
      }).on('error', () => resolve(''));
    });
    if (css) {
      html = html.replace(marker, `\n<style>\n${css}\n</style>\n`);
    }
  }

  // Inline remote scripts
  const remoteJsMarkers = [];
  html = html.replace(/<script[^>]+src=["'](https?:[^"']+)["'][^>]*>\s*<\/script>/gi, (m, src) => {
    const marker = `<!-- inlined-js:${src} -->`;
    remoteJsMarkers.push({ src, marker });
    return marker;
  });
  for (const { src, marker } of remoteJsMarkers) {
    const js = await new Promise(resolve => {
      https.get(src, res => {
        if (res.statusCode !== 200) return resolve('');
        let data = '';
        res.setEncoding('utf8');
        res.on('data', c => (data += c));
        res.on('end', () => resolve(data));
      }).on('error', () => resolve(''));
    });
    if (js) {
      html = html.replace(marker, `\n<script>\n${js}\n</script>\n`);
    }
  }

  // Remove all existing app module script tags and re-inject inline at end of body
  html = removeAll(html, `<script[^>]*type=\"module\"[^>]*src=\"(/)?assets/js/akilli\-eldiven\.js\"[^>]*>\s*<\/script>`);

  const appJs = readSafe(path.join(root, 'assets/js/akilli-eldiven.js'));
  const inlineModule = `\n<script type="module">\n${appJs}\n</script>\n`;
  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, `${inlineModule}</body>`);
  } else {
    html += inlineModule;
  }

  // Clean stray artifacts like 'v>'
  html = html.replace(/>v>/g, '>');

  // Ensure a single closing html/body (best effort)
  html = html.replace(/<\/html>[\s\S]*$/i, '</html>');

  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
  console.log('Bundled to AEK APK/index.html');
})();
