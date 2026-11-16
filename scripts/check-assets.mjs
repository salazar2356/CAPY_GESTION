import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [];
function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) visit(file);
        else files.push(file);
    }
}
visit(path.join(root, 'src'));
let references = 0;
const errors = [];
for (const file of files.filter(file => /\.(tsx?|jsx?|css)$/.test(file))) {
    const source = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    const patterns = [/\bfrom\s*['"]([^'"]+)['"]/g, /\bimport\s*(?:\(\s*)?['"]([^'"]+)['"]/g, /url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/g];
    for (const pattern of patterns) for (const match of source.matchAll(pattern)) {
        const specifier = match[1];
        if (!specifier.startsWith('.') && !specifier.startsWith('/src/') && !specifier.startsWith('@/')) continue;
        references++;
        const base = specifier.startsWith('/src/') ? path.join(root, specifier.slice(1))
            : specifier.startsWith('@/') ? path.join(root, 'src', specifier.slice(2))
                : path.resolve(path.dirname(file), specifier);
        const target = [base, ...['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'].map(ext => base + ext)].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
        if (!target) { errors.push(`${path.relative(root, file)}: missing ${specifier}`); continue; }
        const normalized = path.normalize(target);
        let current = path.parse(normalized).root;
        for (const segment of normalized.slice(current.length).split(path.sep)) {
            const actual = fs.readdirSync(current).find(entry => entry.toLowerCase() === segment.toLowerCase());
            if (actual !== segment) { errors.push(`${path.relative(root, file)}: case mismatch ${specifier} (actual ${actual})`); break; }
            current = path.join(current, segment);
        }
    }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`PASS: ${files.length} source files scanned; ${references} local imports and assets resolve with exact case.`);
