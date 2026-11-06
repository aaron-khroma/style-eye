// Installs the packaged VSIX into VS Code. Run: npm run vsix:install (which builds and packages first)
//
// The VS Code CLI is found from $CODE_CLI, then `code` on the PATH, then the default macOS app bundle.
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const { name, version } = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
const vsix = fileURLToPath(new URL(`dist/${name}-${version}.vsix`, root));
if (!existsSync(vsix)) {
  console.error(`${vsix} not found. Run \`npm run package\` first.`);
  process.exit(1);
}

const candidates = [
  process.env.CODE_CLI,
  'code',
  '/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code',
].filter(Boolean);
const cli = candidates.find((c) => !spawnSync(c, ['--version'], { stdio: 'ignore' }).error);
if (!cli) {
  console.error(`VS Code CLI not found (tried: ${candidates.join(', ')}). Set CODE_CLI to its path.`);
  process.exit(1);
}

const { status } = spawnSync(cli, ['--install-extension', vsix, '--force'], { stdio: 'inherit' });
if (status === 0) console.log('Installed. Pick it with "Preferences: Color Theme → Style Eye" (reload the window if it isn\'t listed).');
process.exit(status ?? 1);
