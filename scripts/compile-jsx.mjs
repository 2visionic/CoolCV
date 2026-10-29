/**
 * CoolCV – Kompilátor React 18 + TypeScript (.ts / .tsx) ze složky `src/` do `dist/bundle.js`
 * -------------------------------------------------------------------------------------------
 * Umožňuje psát striktně typované React 18 TypeScript komponenty v `src/` (`src/App.tsx`, `src/components/*.tsx`, `src/types/cv.ts`)
 * a zkompilovat je do `dist/bundle.js` jak pro lokální vývoj (`npm run dev`),
 * tak pro přímé nasazení na PHP Freehosting bez nutnosti Node.js na produkčním serveru.
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

/**
 * Odstraní bloky `interface ... { ... }` a `declare global { ... }` s respektem k vnořeným složeným závorkám
 */
function stripBalancedBracedConstructs(code, headerPattern) {
  let result = code;
  while (true) {
    const match = headerPattern.exec(result);
    if (!match) break;
    const startIdx = match.index;
    let i = startIdx + match[0].length - 1; // pozice otevírací '{'
    let depth = 1;
    i++;
    while (i < result.length && depth > 0) {
      if (result[i] === '{') depth++;
      else if (result[i] === '}') depth--;
      i++;
    }
    result = result.slice(0, startIdx) + result.slice(i);
  }
  return result;
}

/**
 * Odstraní generické typové parametry u volání hooků (např. useState<...>( -> useState()
 */
function stripHookGenerics(code) {
  const hookPattern = /\b(useState|useRef|useMemo|useCallback)<(?=[^>()]*[A-Za-z_{[])/g;
  let out = '';
  let lastIdx = 0;
  let match;
  while ((match = hookPattern.exec(code)) !== null) {
    out += code.slice(lastIdx, match.index) + match[1];
    let i = match.index + match[0].length; // za '<'
    let depth = 1;
    while (i < code.length && depth > 0) {
      if (code[i] === '<') depth++;
      else if (code[i] === '>') depth--;
      i++;
    }
    lastIdx = i;
    hookPattern.lastIndex = i;
  }
  out += code.slice(lastIdx);
  return out;
}

/**
 * Odstraní TypeScript typové anotace ze zdrojového kódu před JSX transpilací
 */
export function stripTypeScriptSyntax(raw) {
  let code = raw;

  // 1. Odstranění ES importů (včetně `import type { ... } from '...'`)
  code = code.replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '');
  code = code.replace(/^\s*import\s+['"][^'"]+['"];?\s*$/gm, '');

  // 2. Odstranění `export interface ... { ... }`, `interface ... { ... }`, `declare global { ... }`
  code = stripBalancedBracedConstructs(code, /(?:export\s+)?interface\s+[A-Za-z0-9_]+(?:<[^>]*>)?\s*\{/);
  code = stripBalancedBracedConstructs(code, /declare\s+global\s*\{/);

  // 3. Odstranění `export type ... = ...;`
  code = code.replace(/^\s*(?:export\s+)?type\s+[A-Za-z0-9_]+\s*=[^;]+;\s*$/gm, '');

  // 4. Odstranění generik u React hooků (useState<...>(, useRef<...>(, useMemo<...> varying complexity)
  code = stripHookGenerics(code);

  // 5. Odstranění typů destrukturovaných props a návratového typu komponent: `}: SomeProps): React.ReactElement {` -> `}) {`
  code = code.replace(/\}:\s*[A-Za-z0-9_]+Props\s*\)(?:\s*:\s*React\.ReactElement)?\s*\{/g, '}) {');

  // 6. Odstranění návratového typu bez parametrů: `function App(): React.ReactElement {` -> `function App() {`
  code = code.replace(/\)\s*:\s*(?:React\.ReactElement|Promise<[^>]+>|string|void|boolean)\s*\{/g, ') {');

  // 7. Odstranění typů u arrow funkcí: `(key: string): string =>` nebo `(row: any, base: string): string =>`
  code = code.replace(/\(key:\s*string\):\s*string\s*=>/g, '(key) =>');
  code = code.replace(/\(row:\s*any,\s*base:\s*string\):\s*string\s*=>/g, '(row, base) =>');

  // 8. Odstranění typů parametrů v běžných funkcích a event handlerech
  code = code.replace(/\((e):\s*React\.[A-Za-z]+Event<[^>]+>\)/g, '($1)');
  code = code.replace(/\(entity:\s*string,\s*e:\s*React\.[A-Za-z]+Event<[^>]+>\)/g, '(entity, e)');
  code = code.replace(/\(entity:\s*string,\s*id:\s*number\)/g, '(entity, id)');
  code = code.replace(/\(slug:\s*string\)/g, '(slug)');
  code = code.replace(/\(rawUrl:\s*string\)/g, '(rawUrl)');
  code = code.replace(/\(clonedDoc:\s*Document\)/g, '(clonedDoc)');
  code = code.replace(/\(msg:\s*string,\s*isError:\s*boolean\s*=\s*false\)/g, '(msg, isError = false)');
  code = code.replace(
    /route:\s*string,\s*method:\s*string\s*=\s*'GET',\s*body:\s*any\s*=\s*null,\s*tokenOverride:\s*string\s*\|\s*null\s*=\s*null/g,
    "route, method = 'GET', body = null, tokenOverride = null"
  );
  code = code.replace(/catch\s*\(\s*([A-Za-z0-9_]+)\s*:\s*any\s*\)/g, 'catch ($1)');

  // 9. Odstranění typových asercí `as ProfileData`, `as BackofficeTab`, `as Record<string, any>`
  code = code.replace(/\s+as\s+(?:ProfileData|BackofficeTab|Record<string,\s*any>)/g, '');

  // 10. Odstranění typových anotací u proměnných (`const x: Type =` / `let x: Type =`)
  code = code.replace(
    /\b(const|let)\s+([A-Za-z0-9_]+)\s*:\s*(?:Record<LangCode,\s*Record<string,\s*string>>|Record<string,\s*Array<\[string,\s*string,\s*string\]>>|Record<string,\s*[A-Za-z0-9_]+>|Array<\{[^}]+\}>|Array<\[string,\s*string\]>|[A-Za-z0-9_]+(?:\[\])?(?:\s*\|\s*null)?)\s*=/g,
    '$1 $2 ='
  );

  // 11. Odstranění klíčového slova export
  code = code.replace(/export\s+default\s+function\s+/g, 'function ');
  code = code.replace(/export\s+const\s+/g, 'const ');

  return code;
}

/**
 * Rekurzivní parser a transpilér TSX/JSX -> React.createElement(...)
 */
export function transpileJsxCode(source) {
  let out = '';
  let i = 0;
  const len = source.length;

  function skipWhitespace() {
    while (i < len && /\s/.test(source[i])) i++;
  }

  function readBalancedBraces() {
    i++; // přeskočit '{'
    let depth = 1;
    let expr = '';
    while (i < len && depth > 0) {
      const ch = source[i];
      if (ch === "'" || ch === '"' || ch === '`') {
        expr += readStringLiteral();
        continue;
      }
      if (ch === '/' && source[i + 1] === '*') {
        i += 2;
        while (i < len && !(source[i] === '*' && source[i + 1] === '/')) i++;
        i += 2;
        continue;
      }
      if (ch === '/' && source[i + 1] === '/') {
        while (i < len && source[i] !== '\n') {
          expr += source[i++];
        }
        continue;
      }
      if (ch === '{') {
        depth++;
        expr += source[i++];
        continue;
      }
      if (ch === '}') {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
        expr += source[i++];
        continue;
      }
      expr += source[i++];
    }
    return transpileJsxCode(expr.trim());
  }

  function readStringLiteral() {
    const quote = source[i++];
    let str = quote;
    while (i < len) {
      const ch = source[i++];
      str += ch;
      if (ch === '\\' && i < len) {
        str += source[i++];
        continue;
      }
      if (ch === quote) break;
    }
    return str;
  }

  function isJsxStart() {
    if (source[i] !== '<') return false;
    const next = source[i + 1] || '';
    if (next === '>') return true;
    if (!/[A-Za-z_]/.test(next)) return false;

    let p = out.length - 1;
    while (p >= 0 && /\s/.test(out[p])) p--;
    if (p < 0) return true;
    const prevChar = out[p];
    if (/[=(,:?[&|!{;>\n]/.test(prevChar)) return true;
    const tail = out.slice(Math.max(0, p - 10), p + 1);
    if (/\b(return|case|else)\s*$/.test(tail)) return true;
    return false;
  }

  function parseJsxElement() {
    i++; // přeskočit '<'
    if (source[i] === '>') {
      i++;
      const children = parseJsxChildren();
      return `React.createElement(React.Fragment, null${children.length ? ', ' + children.join(', ') : ''})`;
    }

    let tagName = '';
    while (i < len && /[A-Za-z0-9_$.-]/.test(source[i])) {
      tagName += source[i++];
    }
    const isComponent = /^[A-Z]/.test(tagName);
    const tagArg = isComponent ? tagName : JSON.stringify(tagName);

    const props = [];
    while (i < len) {
      skipWhitespace();
      if (source[i] === '/' && source[i + 1] === '>') {
        i += 2;
        const propsArg = props.length ? `{ ${props.join(', ')} }` : 'null';
        return `React.createElement(${tagArg}, ${propsArg})`;
      }
      if (source[i] === '>') {
        i++;
        break;
      }

      if (source[i] === '{' && source.slice(i, i + 4) === '{...') {
        const spreadExpr = readBalancedBraces();
        props.push(spreadExpr);
        continue;
      }

      let attrName = '';
      while (i < len && /[A-Za-z0-9_:-]/.test(source[i])) {
        attrName += source[i++];
      }
      if (!attrName) {
        i++;
        continue;
      }
      const propKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(attrName) ? attrName : JSON.stringify(attrName);

      skipWhitespace();
      if (source[i] === '=') {
        i++;
        skipWhitespace();
        if (source[i] === '"' || source[i] === "'") {
          const rawStr = readStringLiteral();
          props.push(`${propKey}: ${rawStr}`);
        } else if (source[i] === '{') {
          const valExpr = readBalancedBraces();
          props.push(`${propKey}: ${valExpr}`);
        }
      } else {
        props.push(`${propKey}: true`);
      }
    }

    const propsArg = props.length ? `{ ${props.join(', ')} }` : 'null';
    const children = parseJsxChildren();
    return `React.createElement(${tagArg}, ${propsArg}${children.length ? ', ' + children.join(', ') : ''})`;
  }

  function decodeHtmlEntities(text) {
    return text
      .replace(/&nbsp;/gi, '\u00A0')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  }

  function parseJsxChildren() {
    const children = [];
    let textBuf = '';

    function flushText() {
      if (!textBuf) return;
      const cleaned = textBuf
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((line, idx, arr) => {
          if (arr.length === 1) return line;
          if (idx === 0) return line.trimEnd();
          if (idx === arr.length - 1) return line.trimStart();
          return line.trim();
        })
        .filter((line) => line.length > 0)
        .join(' ');
      textBuf = '';
      if (cleaned) {
        children.push(JSON.stringify(decodeHtmlEntities(cleaned)));
      }
    }

    while (i < len) {
      if (source[i] === '<' && source[i + 1] === '/') {
        flushText();
        i += 2;
        while (i < len && source[i] !== '>') i++;
        i++;
        break;
      }

      if (source[i] === '<' && (source[i + 1] === '>' || /[A-Za-z_]/.test(source[i + 1] || ''))) {
        flushText();
        children.push(parseJsxElement());
        continue;
      }

      if (source[i] === '{') {
        flushText();
        const expr = readBalancedBraces();
        if (expr.trim() !== '') {
          children.push(expr);
        }
        continue;
      }

      textBuf += source[i++];
    }

    return children;
  }

  while (i < len) {
    const ch = source[i];
    if (ch === "'" || ch === '"' || ch === '`') {
      out += readStringLiteral();
      continue;
    }
    if (ch === '/' && source[i + 1] === '/') {
      while (i < len && source[i] !== '\n') out += source[i++];
      continue;
    }
    if (ch === '/' && source[i + 1] === '*') {
      out += '/*';
      i += 2;
      while (i < len && !(source[i] === '*' && source[i + 1] === '/')) out += source[i++];
      if (i < len) {
        out += '*/';
        i += 2;
      }
      continue;
    }
    if (isJsxStart()) {
      out += parseJsxElement();
      continue;
    }
    out += source[i++];
  }

  return out;
}

/**
 * Zkompiluje všechny TypeScript (.ts / .tsx) soubory v `src/` do `dist/bundle.js`
 */
export function buildReactBundle() {
  const filesOrder = [
    'src/types/cv.ts',
    'src/i18n/translations.ts',
    'src/components/Icon.tsx',
    'src/components/Sidebar.tsx',
    'src/components/Topbar.tsx',
    'src/components/HeroSection.tsx',
    'src/components/ServicesPillars.tsx',
    'src/components/StructuredResume.tsx',
    'src/components/FeaturedProjects.tsx',
    'src/components/CryptoShowcase.tsx',
    'src/components/PdfResumeTemplate.tsx',
    'src/components/Backoffice.tsx',
    'src/App.tsx',
    'src/main.tsx',
  ];

  let combined = `(function () {\n  'use strict';\n  const { useState, useEffect, useMemo, useRef } = React;\n\n`;

  for (const relPath of filesOrder) {
    const absPath = path.join(ROOT_DIR, relPath);
    const raw = fs.readFileSync(absPath, 'utf-8');
    const jsWithoutTypes = stripTypeScriptSyntax(raw);
    const transpiled = transpileJsxCode(jsWithoutTypes);
    combined += `\n  // --- ${relPath} ---\n` + transpiled + '\n';
  }

  combined += `\n})();\n`;

  // Ověření syntaktické správnosti výsledného JS bundlu přes Node VM
  new vm.Script(combined, { filename: 'dist/bundle.js' });

  const distDir = path.join(ROOT_DIR, 'dist');
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
  const bundlePath = path.join(distDir, 'bundle.js');
  fs.writeFileSync(bundlePath, combined, 'utf-8');
  return bundlePath;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const outPath = buildReactBundle();
  console.log(`✅ React 18 TypeScript (.tsx) bundle úspěšně zkompilován ze src/**/*.{ts,tsx} -> ${outPath}`);
}
