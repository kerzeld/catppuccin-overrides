# catppuccin-overrides

Catppuccin themes are among the most accessible and easiest to customize themes available. So here are some overrides for my own styles.

Generates theme files for: Zed, Plasma, Konsole, GTK 3/4, Firefox, Ghostty, oh-my-posh, Noctalia, Kvantum (KvLibadwaita / KvArcDark), niri, rmpc, Zen Browser and Stylus (catppuccin/userstyles).

## Usage

Enter the dev shell with `nix-shell`, then run the generator with a theme name:

```sh
nix-shell
node src/index.ts pink
```

Output is written to `out/<color>/`.

Available themes: `pink`, `yellow`, `orange`, `green`, `lemon`, `red`.

### Flags

`--firefoxTheme`\
Also write a Firefox theme manifest to `out/<color>/firefox/manifest.json`.

`--release`\
Generate every available theme (into `out/<color>/` for each).

`--link`\
Symlink some of the generated files to their predefined config paths. Only
works when a single theme is specified.

## Applying themes

From the nixos flake (which consumes this repo), run `./update-themes.sh pink`
to copy the generated files into the flake's dotfiles.

### Stylus (catppuccin/userstyles)

Each run also writes `out/<color>/userStyles.json`: the
[catppuccin/userstyles](https://github.com/catppuccin/userstyles) export with the
shared Less library replaced by this palette (`templates/stylus.less`) and the
accent pinned to the theme. Import it in Stylus via **Import** (or drop it into
Stylus' backup folder). This step downloads ~2.6 MB from GitHub, so it is skipped
with a warning when offline.

## Layout

```
src/          colors, HSV overrides, generators
templates/    mustache templates per target (all targets, incl. whiskers/)
out/          generated output per color
doc/          per-target notes
```

## Development

```sh
pnpm install
pnpm typecheck
pnpm lint
pnpm format
```
