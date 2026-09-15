# AGENTS.md

Guidance for AI agents working in this repository.

## Working style

- Always minimize output tokens while preserving correctness. Prefer concise answers, small diffs, and targeted edits over verbose explanations or rewrites.
- Do not add comments to code unless explicitly requested.
- Do not commit changes unless explicitly asked.

## Repository structure

This repo generates themed overrides (Zed, Plasma, GTK, Firefox, Ghostty, oh-my-posh, noctalia, rmpc, niri, Zen) from Catppuccin color palettes.

```
src/                Source: color palettes (colors.ts), HSV theme overrides (themes.ts), generators
templates/          Mustache templates per target (noctalia/, plasma/, gtk/, firefox/, ghostty/, whiskers/, rmpc/, niri/, zen-browser/)
out/                Generated output per color (out/pink, out/yellow, ...)
doc/                Per-target notes (firefox.md, plasma.md, kv/KVANTUM_NOTES.md)
update-themes.sh    (in the nixos repo) copies generated files from out/ into the nixos flake dotfiles
```

All templates are rendered with mustache, including the `whiskers/` ones (Zed, Kvantum). There is no Tera/whiskers-CLI step.

### Template vs. include

Prefer the target's own include mechanism over templating a large file for a
few colors:

- **Full theme files** → generate whole (e.g. `rmpc/noctalia.ron`,
  `gtk/gtk-3.0/gtk.css`, `firefox/userChrome-menu.css`).
- **Large mostly-non-theme files** → keep hand-maintained, generate a small
  fragment, pull it in natively:
  - niri: top-level `include "niri-theme.kdl"` (since 25.11; section values
    merge, multipart sections do not; relative includes resolve against the
    *symlink target's* directory, so the fragment must sit next to
    `niri-config.kdl` in the dotfiles dir).
  - Zen/Firefox CSS: `@import url("zen-theme.css")` defining `--kerzeld-*`
    custom properties.


## Theme generation

Themes are generated with:

```sh
nix-shell --run "node src/index.ts pink"
```

Type-check with:

```sh
./node_modules/.bin/tsc --noEmit
```

Available colors: `pink`, `yellow`, `orange`, `green`, `lemon`, `red`.

The output is written to `out/<color>/`.

## Applying themes to the nixos flake

From the nixos flake repo, run:

```sh
./update-themes.sh pink
```

This copies the generated files from `out/pink/` into the nixos flake dotfiles.

## Conventions

- Color tokens (e.g. `mSurface`, `mSurfaceVariant`) are mapped in the Mustache templates under `templates/` to Catppuccin shade names (e.g. `base`, `mantle`, `surface0`).
- HSV theme overrides live in `src/themes.ts` (`baseHSVOverrides` controls per-shade saturation/value).
- To change which Catppuccin shade a token maps to, edit the relevant template file — do NOT edit generated output in `out/` or in the nixos flake, as those are overwritten on regeneration.
- Computed theme tokens live in `src/computedView.ts` and are exposed as `{{whiskers.<name>}}` (the `whiskers` view is merged into the render context for every template, despite the name).
- `{{colors.<name>.hex}}` has the leading `#` stripped; `{{whiskers.<name>}}` values already include it. Add `#` manually for `colors.*`.

## Kvantum

See `doc/kv/KVANTUM_NOTES.md` for how Kvantum resolves SVG elements by name,
the known invisible-text-field issue and its fix, and how to preview a theme
headlessly with `kvantumpreview` under Xvfb.
