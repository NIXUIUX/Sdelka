// Выпуск версии: node scripts/release.mjs patch|minor|major
// 1) поднимает версию в package.json  2) проверяет, что в CHANGELOG.md есть раздел этой версии
// 3) коммит + тег vX.Y.Z. После `git push --follow-tags` GitHub Actions опубликует пакет.
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
const kind = process.argv[2] ?? 'patch';
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const [ma, mi, pa] = pkg.version.split('.').map(Number);
const next = kind === 'major' ? `${ma + 1}.0.0` : kind === 'minor' ? `${ma}.${mi + 1}.0` : `${ma}.${mi}.${pa + 1}`;
const log = readFileSync('CHANGELOG.md', 'utf8');
if (!log.includes(`## ${next}`)) {
  console.error(`В CHANGELOG.md нет раздела «## ${next}». Опишите изменения и запустите снова.`);
  process.exit(1);
}
pkg.version = next;
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
execSync('npm install --package-lock-only --ignore-scripts', { stdio: 'inherit' });
execSync(`git add package.json package-lock.json CHANGELOG.md && git commit -m "Выпуск ${next}" && git tag v${next}`, { stdio: 'inherit' });
console.log(`Готово: v${next}. Отправьте: git push --follow-tags`);
