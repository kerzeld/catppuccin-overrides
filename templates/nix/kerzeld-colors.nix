# Generated from catppuccin-overrides — do not edit directly.
# Kerzeld palette ({{name}}), for use in Nix modules.
{
  crust = "#{{colors.crust.hex}}";
  mantle = "#{{colors.mantle.hex}}";
  base = "#{{colors.base.hex}}";
  surface0 = "#{{colors.surface0.hex}}";
  surface1 = "#{{colors.surface1.hex}}";
  surface2 = "#{{colors.surface2.hex}}";
  overlay0 = "#{{colors.overlay0.hex}}";
  overlay1 = "#{{colors.overlay1.hex}}";
  overlay2 = "#{{colors.overlay2.hex}}";
  subtext0 = "#{{colors.subtext0.hex}}";
  subtext1 = "#{{colors.subtext1.hex}}";
  text = "#{{colors.text.hex}}";

  red = "#{{colors.red.hex}}";
  peach = "#{{colors.peach.hex}}";
  yellow = "#{{colors.yellow.hex}}";
  green = "#{{colors.green.hex}}";
  teal = "#{{colors.teal.hex}}";
  sky = "#{{colors.sky.hex}}";
  blue = "#{{colors.blue.hex}}";
  mauve = "#{{colors.mauve.hex}}";
  pink = "#{{colors.pink.hex}}";

  accent = "#{{colors.accent.hex}}";

  # Text selection. `selectionBackground` and `selectionBackgroundDisabled`
  # must differ (Firefox inverts the disabled one when they are equal — see
  # EnsureDifferentColors in layout/generic/nsTextPaintStyle.cpp); the disabled
  # one is the darker of the two.
  selectionForeground = "{{whiskers.selection_text}}";
  selectionBackground = "{{whiskers.selection_bg}}";
  selectionBackgroundDisabled = "{{whiskers.selection_bg_disabled}}";
}
