/**
 * scope-kenzo.cjs
 * Reads kenzo.css and outputs kenzo-scoped.css where every rule
 * is prefixed with ".kenzo-wrapper" so it only affects the Home page.
 */
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'kenzo.css');
const outputPath = path.join(__dirname, 'kenzo-scoped.css');

const css = fs.readFileSync(inputPath, 'utf8');

function scopeSelector(sel) {
  sel = sel.trim();
  if (!sel) return sel;
  // :root, html, body → .kenzo-wrapper (they become the wrapper itself)
  if (sel === ':root' || sel === 'html' || sel === 'body') return '.kenzo-wrapper';
  // html body, body *, etc.
  if (/^(html|body)\s/.test(sel)) return '.kenzo-wrapper ' + sel.replace(/^(html|body)\s*/, '');
  if (sel.startsWith(':root ')) return '.kenzo-wrapper ' + sel.slice(6);
  // Already scoped
  if (sel.startsWith('.kenzo-wrapper')) return sel;
  return '.kenzo-wrapper ' + sel;
}

function scopeSelectors(selectorStr) {
  return selectorStr
    .split(',')
    .map(s => scopeSelector(s.trim()))
    .join(',\n');
}

function process(input) {
  let out = '';
  let i = 0;
  const len = input.length;

  while (i < len) {
    // Skip whitespace
    if (/\s/.test(input[i])) {
      out += input[i++];
      continue;
    }

    // Comments
    if (input[i] === '/' && input[i + 1] === '*') {
      const end = input.indexOf('*/', i + 2);
      const closeIdx = end === -1 ? len : end + 2;
      out += input.slice(i, closeIdx);
      i = closeIdx;
      continue;
    }

    // @keyframes — copy verbatim (no scoping needed)
    if (input.slice(i, i + 10) === '@keyframes' || input.slice(i, i + 11) === '@-webkit-ke') {
      const braceOpen = input.indexOf('{', i);
      let depth = 1;
      let j = braceOpen + 1;
      while (j < len && depth > 0) {
        if (input[j] === '{') depth++;
        else if (input[j] === '}') depth--;
        j++;
      }
      out += input.slice(i, j);
      i = j;
      continue;
    }

    // @media / @supports — scope the inner rules recursively
    if (input[i] === '@') {
      const braceOpen = input.indexOf('{', i);
      if (braceOpen === -1) { out += input[i++]; continue; }

      const atRule = input.slice(i, braceOpen);
      out += atRule + '{\n';
      i = braceOpen + 1;

      // Collect inner block
      let depth = 1;
      const innerStart = i;
      while (i < len && depth > 0) {
        if (input[i] === '{') depth++;
        else if (input[i] === '}') depth--;
        i++;
      }
      const inner = input.slice(innerStart, i - 1);
      out += process(inner);
      out += '}\n';
      continue;
    }

    // Regular rule: find selector + block
    const braceOpen = input.indexOf('{', i);
    if (braceOpen === -1) { out += input.slice(i); break; }

    const selectorRaw = input.slice(i, braceOpen);
    const scoped = scopeSelectors(selectorRaw);
    out += scoped + ' {\n';
    i = braceOpen + 1;

    let depth = 1;
    const blockStart = i;
    while (i < len && depth > 0) {
      if (input[i] === '{') depth++;
      else if (input[i] === '}') depth--;
      i++;
    }
    const block = input.slice(blockStart, i - 1);
    out += block;
    out += '}\n';
  }

  return out;
}

const scoped = process(css);
fs.writeFileSync(outputPath, scoped, 'utf8');
console.log('✅ kenzo-scoped.css written to', outputPath);
