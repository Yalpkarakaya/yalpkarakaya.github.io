const fs = require('fs');
const path = require('path');

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

(function main() {
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

  // Remove any Tailwind CDN script if present
  html = removeAll(html, `<script[^>]*src=\"https://cdn\.tailwindcss\.com\"[^>]*>\s*<\/script>`);

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
