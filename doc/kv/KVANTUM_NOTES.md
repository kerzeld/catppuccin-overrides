# Kvantum / KvLibadwaita notes

Everything learned while theming KvLibadwaitaDark for Kvantum.

## Pipeline

- Templates: `templates/whiskers/KvLibadwaita-kerzeld/` and
  `templates/whiskers/KvArcDark-kerzeld/` (mustache; no Tera/whiskers CLI
  anymore).
- Computed palette tokens are produced in `src/whiskersView.ts` under the
  `// KvLibadwaita computed colors` section and exposed as `{{whiskers.<name>}}`.
  The `whiskers` view is merged into the render context for **all** templates,
  so non-Kvantum templates can use these tokens too.
- Theme generation: `nix-shell --run "node src/index.ts pink"` → `out/pink/`.
- Copy into the flake: `./update-themes.sh pink` (in the nixos repo).

## How Kvantum draws a widget

A Kvantum widget is painted from SVG elements that are looked up **by name**.
Only elements Kvantum actually references are drawn; extra shapes in the SVG
are ignored. This matters: you cannot "cheat" by adding an overlay rect.

- `frame.element=<name>` + state suffix. States: `-normal`, `-focused`,
  `-pressed`, `-toggled`, `-disabled`.
- `interior.element=<name>` + state suffix, same rules.
- Per-side/corner parts are picked up automatically when present:
  `<name>-<state>-top/bottom/left/right/topleft/topright/bottomleft/bottomright`.
  If the corner/top parts are missing, the whole frame falls back to the
  single `<name>-<state>` element.
- `focusFrame=true` uses **`<frame.element>-focus`** for the keyboard-focus
  ring (e.g. `lineedit-focus`), not a separate element name.
- Colors come exclusively from the SVG (`fill=`/`style=`). There is **no**
  `frame.color` key. `GeneralColors` `mid.light.color` is only for plain
  `QFrame` boxes.
- `frame.expansion` + `border-*` objects are only needed for fully rounded
  corners; a plain 1px border does not need them.

## Gotcha: invisible text fields

`[LineEdit]`, `[ToolbarLineEdit]` and `[ComboBox]` in the original theme fill
both the frame ring **and** the interior with the same color as the toolbar
(`kv_main_widget_bg`). Against a toolbar of that same color the field
disappears — e.g. the Dolphin search box or a combo in a header/toolbar.

Fix (applied):

- interior/center (`lineedit-normal`, `lineedit-focused`, `combo-normal`,
  `combo-focused`) → `kv_input_bg` (= `base`), so the field recedes.
- frame ring (`*-left/top/right/bottom/corners`) → `kv_input_border`
  (= `surface1`) normally and `kv_input_border_focus` (= `accent`) when
  focused.
- In the focused variants the old inner highlight strip (`kv_titlebar_inactive`)
  is also collapsed onto `kv_input_border_focus` so the ring reads as one
  clean accent line.

New tokens (`src/whiskersView.ts`):

| token | value | purpose |
|---|---|---|
| `kv_input_bg` | `base` | field interior |
| `kv_input_border` | `surface1` | unfocused border ring |
| `kv_input_border_focus` | `accent` | focused border ring |

## Testing visually (the important part)

Kvantum ships a preview app that renders every widget state and is the ground
truth. It can be run headless with Xvfb:

```sh
nix-shell -p xvfb-run xorgserver xdotool imagemagick --run \
  'xvfb-run -a --server-args="-screen 0 1400x1000x24" bash preview.sh THEME_DIR TAB OUT'
```

`preview.sh` copies the theme's `*.kvconfig`/`*.svg` into
`$HOME/.config/Kvantum/<name>/` (renaming both files to `<name>.kvconfig` /
`<name>.svg` — the filenames must match the theme directory name) and points
`$HOME/.config/Kvantum/kvantum.kvconfig` at it. Tabs: `1` Push buttons,
`4` Combos/Spins/Inputs, `6` Containers. Click a tab with
`xdotool mousemove X 158 click 1`.

Notes:
- Set `HOME` to a writable scratch dir; the real `~/.config/Kvantum` may be
  sandbox-blocked.
- The preview binary lives at
  `/nix/store/*-qtstyleplugin-kvantum-*/bin/kvantumpreview`.
- A quick static check without Kvantum: render the SVG with `rsvg-convert`
  (available via ImageMagick's `svg` delegate) and inspect regions, but the
  Kvantum preview is the reliable check because it exercises element lookup
  and per-state drawing.

## Debug tip

To find which SVG element paints a given pixel, recolor a token in the
**rendered** SVG (the `out/` copy already has literals, not `{{...}}`
placeholders) and re-run the preview, e.g. replace `#4F474A` (`
kv_main_widget_bg`) with a loud color. Whole groups can be recolored
differently to separate interior from frame ring.

## Other things fixed / known

- The `LineEditFocusFrame` border from commit `dc65ac9` was lost during the
  later full color remap; the field-visibility fix above supersedes it.
- `menu-normal` (the popup background) is intentionally `kv_main_widget_bg`;
  do not let a frame-ring recolor script bleed into the `menu` group (the
  group regex must be anchored to `lineedit`/`combo`).
