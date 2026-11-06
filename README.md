# Style Eye

A dark VS Code theme in the Style Eyes Creative brand palette, built on
[carlos18mz/Cyberpunk-2077-rebuild](https://github.com/carlos18mz/Cyberpunk-2077-rebuild) (MIT).

## Layout

| File | What it is |
|---|---|
| `src/theme.json` | **The theme source. Edit this.** Every color is a palette token, never a hex code. |
| `src/sec-colors.dtcg.json` | The brand palette, exported unchanged from the HSLuv color picker (DTCG format). |
| `scripts/build.mjs` | Compiles the source into `themes/theme.json`. |
| `scripts/install.mjs` | Installs the packaged VSIX into VS Code. |
| `themes/theme.json` | Generated output that VS Code loads. Don't edit it. Rebuild instead. |

## Scripts

| Command | What it does |
|---|---|
| `npm install` | Installs `@vscode/vsce` for packaging. Run once. |
| `npm run build` | Compiles `src/theme.json` into `themes/theme.json`. |
| `npm run package` | Builds, then packages `dist/style-eye-theme-<version>.vsix`. |
| `npm run vsix:install` | Builds, packages and installs the VSIX into VS Code. |

`vsix:install` finds the VS Code CLI from `$CODE_CLI`, then `code` on the `PATH`, then the default
macOS app location. (It isn't named `install` because npm runs a script with that name after every
`npm install`.)

## Color tokens

A color is `"<family>-<step>"`. Add `/<percent>` for opacity:

```json
"editor.foreground": "emerald-300",
"editor.lineHighlightBackground": "sapphire-800/30",
"terminal.ansiCyan": "aquamarine-400"
```

- **Families:** `emerald` (the brand), `neutral`, and the seven other saturated families `aquamarine`,
  `sapphire`, `amethyst`, `spinel`, `ruby`, `amber` and `peridot`. The steps run from `100` to `900`.
- **`neutral-50` and `neutral-950`** are the lightest and darkest colors for every family. The `50`
  and `950` steps of the other families are off limits.
- **The build fails** on an unknown or off-limits step, a malformed token, an opacity over 100, or a
  raw hex code in the source.

## Roles

Emerald is the brand family. Its `300`, `500`, `700` and `800` steps carry the theme.

| Step | Used for |
|---|---|
| `emerald-300` | UI and code body text, active tab, activity-bar and focus indicators, the cursor, the terminal |
| `emerald-500` | Buttons, badges, the status bar and title bar, panel and dropdown borders, list highlights |
| `emerald-700` | Ordinary borders (editor groups, the activity bar, widgets, find matches, diffs), inactive tab text, tab hover |
| `emerald-800` | Selections: lists, menus, input text, the suggest widget, peek results |
| `emerald-900` | Inputs, widgets, hover and suggest backgrounds, peek views |
| `emerald-200` | Classes, types and CSS classes in code |
| `neutral-950` | Editor, sidebar, panel and tab surfaces |
| `neutral-100` | Variables and markdown text |
| `sapphire-*` | Comments; editor selections; word, find and line highlights |
| `aquamarine-*` | Strings, functions and operators, inputs and the suggest widget, descriptions, the progress bar |
| `amethyst-*` | Keywords, attributes |
| `ruby-*` / `spinel-*` | Errors, deletions, tags; ANSI reds and magentas |
| `peridot-*` / `amber-*` | Numbers and constants, line numbers, warnings, JSON keys |

## Updating

- **New palette export:** replace `src/sec-colors.dtcg.json`, then run `npm run build`.
- **Theme change:** edit `src/theme.json`, then run `npm run build`.
- **Commit `themes/` too:** VS Code reads the compiled file, not the source.

## Try it locally

- **Without installing:** open this folder in VS Code, press F5, then in the new window pick
  **Preferences: Color Theme → Style Eye**.
- **Installed:** run `npm run vsix:install`, then pick **Style Eye** the same way.
