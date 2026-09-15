# Kvantum / KvLibadwaita notes

Everything learned while theming KvLibadwaitaDark for Kvantum.

## Pipeline

- Templates: `templates/whiskers/KvLibadwaita-kerzeld/` and
  `templates/whiskers/KvArcDark-kerzeld/` (mustache; no Tera/whiskers CLI
  anymore).
- Computed palette tokens are produced in `src/computedView.ts` under the
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

## Gotcha: accent-tinted "normal" buttons

`[PanelButtonCommand]` / `[ToolbarButton]` `button-<state>` elements define the
default look of every push button and toolbar button (and VLC's transport bar).
The `dd80d54` full remap accidentally filled the **normal** (default) state with
the accent-tinted `kv_button_hover`/`kv_button_pressed`/`kv_button_focus`
tokens, so every button looked permanently pressed/pink.

Rule of thumb: the `-normal` state must be a neutral surface; only
`-hover`/`-pressed`/`-toggled`/`-focused` should carry accent tints.

- `button-normal` → `kv_button_normal` (= `surface0`)
- `button-hover` → `kv_button_hover` (accent × surface0)
- `button-pressed` → `kv_button_pressed`
- `button-toggled`/`-focused` → existing accent/overlay tokens

`tbutton-normal` (ToolbarButton) already used a neutral fill.

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

## VLC transport-bar icons (known, not fixable from the theme)

VLC 3.x **hardcodes its toolbar icon SVGs to `#747474`** (a fixed mid-grey).
This is compiled into `lib/vlc/plugins/gui/libqt_plugin.so` (94+ `fill:#747474`
occurrences for play/pause/stop/seek/fullscreen/...); it does not use
`currentColor` or the Qt/Kvantum palette. Confirmed empirically: forcing every
Kvantum text color to pure red changes only labels/time text, never the icons;
the icons are `#747474` under stock KvArcDark, this theme, and Fusion alike.
See also the VLC patch "qml: change default icon color" and the long-standing
"Play Buttons too Dark/Dim on Dark Mode (Qt5)" reports.

Consequence: on a dark button the icons are inherently low contrast, and no
`.kvconfig`/SVG change can recolor them. We do the only thing the theme
controls — keep the default button background dark so the fixed grey icon has
the most contrast available (`button-normal` = `kv_button_normal` =
`kv_main_widget_bg`, 1.93:1 vs 1.38:1 on the old `surface0`).

If the transport bar bothers you again, options (in order):

1. **Switch VLC to the skinnable interface** — Preferences → Interface →
   "Use custom skin". VLC then draws its own controls with proper contrast.
   (Skins live in `~/.local/share/vlc/skins2/`.)
2. **Use a VLC 4.x / Qt6 build**, where the icon color is palette-aware.
3. **Darken the button further** (`kv_button_normal` toward `mantle`/`crust`,
   up to ~2.9:1) — cheap, but flattens buttons elsewhere.
4. **Patch the embedded icons** (`fill:#747474` → lighter) in `libqt_plugin.so`
   — fragile, breaks on every VLC update; not recommended.
