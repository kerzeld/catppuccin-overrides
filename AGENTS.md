# AGENTS.md

Guidance for AI agents working in this repository.

## Working style

- Always minimize output tokens while preserving correctness. Prefer concise answers, small diffs, and targeted edits over verbose explanations or rewrites.
- Do not add comments to code unless explicitly requested.
- Do not commit changes unless explicitly asked.

## Repository structure

This repo generates themed overrides (Zed, Plasma, GTK, Firefox, Ghostty, oh-my-posh, noctalia) from Catppuccin color palettes.

```
src/                Source: color palettes (colors.ts), HSV theme overrides (themes.ts), generators
templates/          Mustache templates per target (noctalia/, plasma/, gtk/, firefox/, ghostty/, zed via whiskers)
out/                Generated output per color (out/pink, out/yellow, ...)
update-themes.sh    (in the nixos repo) copies generated files from out/ into the nixos flake dotfiles
```

## Theme generation

Themes are generated with:

```sh
nix-shell --run "node src/index.ts pink"
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