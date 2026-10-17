# Zen Browser

`templates/zen-browser/` produces the Zen theme consumed by the nixos flake
(`modules/home-manager/apps/zen-browser/dotfiles/`): fully generated
`userChrome.css` and `userContent.css`, plus `zen-theme.css` with the
`--kerzeld-*` custom properties the transparency layer imports.

## Attribution

The chrome/content theme is adapted from the "Zen Browser" community template by
**Foresteam**:
<https://github.com/Foresteam/noctalia-community-templates/tree/main/zen-browser>

It originally targets Noctalia's template engine and uses per-role color
placeholders (`colors.<material-role>.<mode>.hex`). Here it is recolored to this
repo's `{{colors.<shade>.hex}}` Catppuccin tokens and merged with a transparency
layer, so it no longer depends on Noctalia at runtime.

## Merge layout

`userChrome.css` / `userContent.css` are, in order:

1. `@import url("zen-theme.css")` — the `--kerzeld-*` vars.
2. The recolored Foresteam theme (dark mode block only; the light block is
   dropped).
3. A transparency layer appended last so it wins the cascade: it zeros the
   window background variables and the chrome surfaces stay transparent, while
   Foresteam still supplies text/icons/tabs/panels/downloads styling.

## Role mapping (dark)

| Foresteam role | Catppuccin shade |
| --- | --- |
| `background` | `crust` |
| `surface_container_low` | `mantle` |
| `surface_container` | `base` |
| `surface_container_high` | `surface0` |
| `surface_container_highest` | `surface1` |
| `surface_bright` | `surface2` |
| `outline_variant` | `overlay0` |
| `outline` | `overlay1` |
| `on_surface_variant` | `subtext0` |
| `on_surface` | `text` |
| `primary` | `accent` |
| `secondary` | `peach` |
| `tertiary` | `teal` |
| `error` | `red` |

To retarget a color, edit the role→shade tokens in `templates/zen-browser/`,
regenerate, then copy with `./update-themes.sh pink` from the nixos flake.
