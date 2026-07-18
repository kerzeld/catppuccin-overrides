import Color, { type ColorInstance } from "color";
import type { IThemeView } from "./interfaces.ts";

function mix(a: ColorInstance, b: ColorInstance, amount: number): ColorInstance {
  return a.mix(b, 1 - amount);
}

export function buildWhiskersView(view: IThemeView): Record<string, string> {
  const c = view.colors;
  const accent = c.accent.color;
  const text = c.text.color;
  const surface0 = c.surface0.color;
  const surface1 = c.surface1.color;
  const surface2 = c.surface2.color;
  const overlay0 = c.overlay0.color;
  const overlay1 = c.overlay1.color;
  const overlay2 = c.overlay2.color;
  const subtext0 = c.subtext0.color;
  const mantle = c.mantle.color;
  const crust = c.crust.color;
  const base = c.base.color;
  const teal = c.teal.color;
  const green = c.green.color;
  const red = c.red.color;
  const yellow = c.yellow.color;
  const peach = c.peach.color;
  const sapphire = c.sapphire.color;
  const blue = c.blue.color;
  const lavender = c.lavender.color;
  const mauve = c.mauve.color;

  const rainbow = [
    mix(c.red.color, text, 0.8),
    mix(c.peach.color, text, 0.8),
    mix(c.yellow.color, text, 0.8),
    mix(c.green.color, text, 0.8),
    mix(c.sapphire.color, text, 0.8),
    mix(c.lavender.color, text, 0.8),
    mix(c.mauve.color, text, 0.8),
  ];

  const result: Record<string, string> = {};

  for (let i = 0; i < rainbow.length; i++) {
    result[`rainbow_${i}`] = rainbow[i].hex();
    result[`rainbow_opacity_${i}`] = rainbow[i].alpha(0.4).hexa();
  }

  result.border_variant = mix(accent, surface0, 0.8).hex();
  result.element_active = surface2.alpha(0.3).hexa();
  result.element_selected = surface0.alpha(0.3).hexa();
  result.drop_target_background = surface0.alpha(0.4).hexa();
  result.ghost_element_hover = surface1.alpha(0.3).hexa();
  result.ghost_element_active = surface2.alpha(0.6).hexa();
  result.ghost_element_selected = new Color(surface2).lightness(surface2.lightness() + 10).alpha(0.4).hexa();
  result.search_match_background = teal.alpha(0.2).hexa();
  result.panel_indent_guide = surface0.alpha(0.6).hexa();
  result.scrollbar_thumb_background = surface2.alpha(0.5).hexa();
  result.scrollbar_track_border = text.alpha(0.07).hexa();
  result.minimap_thumb_background = accent.alpha(0.2).hexa();
  result.minimap_thumb_hover_background = accent.alpha(0.4).hexa();
  result.minimap_thumb_active_background = accent.alpha(0.6).hexa();
  result.editor_active_line_background = text.alpha(0.07).hexa();
  result.editor_invisible = overlay2.alpha(0.4).hexa();
  result.editor_document_highlight_bracket_background = accent.alpha(0.09).hexa();
  result.editor_document_highlight_read_background = subtext0.alpha(0.16).hexa();
  result.editor_document_highlight_write_background = subtext0.alpha(0.16).hexa();
  result.editor_indent_guide = surface0.alpha(0.6).hexa();
  result.background_elevated = new Color(mantle).lightness(mantle.lightness() + 7).hex();
  result.conflict_background = peach.alpha(0.15).hexa();
  result.created_background = green.alpha(0.15).hexa();
  result.deleted_background = red.alpha(0.15).hexa();
  result.ignored_background = overlay0.alpha(0.15).hexa();
  result.modified_background = yellow.alpha(0.15).hexa();
  result.renamed_background = sapphire.alpha(0.15).hexa();
  result.info_background = overlay2.alpha(0.2).hexa();
  result.warning_background = yellow.alpha(0.12).hexa();
  result.error_background = red.alpha(0.12).hexa();
  result.success_background = green.alpha(0.12).hexa();
  result.unreachable_background = red.alpha(0.12).hexa();
  result.player0_selection = overlay2.alpha(0.25).hexa();
  for (let i = 0; i < rainbow.length; i++) {
    result[`player${i + 1}_selection`] = rainbow[i].alpha(0.25).hexa();
  }
  result.version_control_conflict_marker_ours = green.alpha(0.2).hexa();
  result.version_control_conflict_marker_theirs = blue.alpha(0.2).hexa();
  result.editor_debugger_active_line_background = peach.alpha(0.07).hexa();
  result.tab_inactive_background = new Color(crust).lightness(crust.lightness() - 3).hex();

  const opacityFloat = parseFloat(view.opacity.float);

  result.glassy_border = mix(surface0, accent, 0.8).hex();
  result.glassy_surface_background = mantle.alpha(opacityFloat).hexa();
  result.glassy_background = crust.alpha(opacityFloat).hexa();
  result.glassy_status_bar_background = crust.alpha(opacityFloat).hexa();
  result.glassy_title_bar_background = crust.alpha(opacityFloat).hexa();
  result.glassy_title_bar_inactive_background = crust.alpha(opacityFloat).hexa();
  result.glassy_toolbar_background = mix(crust, accent, 0.8).alpha(0.4).hexa();
  result.glassy_tab_active_background = mix(crust, accent, 0.8).alpha(0.4).hexa();
  result.glassy_search_match_background = new Color(surface2).lightness(surface2.lightness() - 16).alpha(0.8).hexa();
  result.glassy_panel_overlay_background = new Color(base).lightness(base.lightness() + 4).hex();
  result.glassy_editor_document_highlight_bracket_background = new Color(accent).lightness(accent.lightness() - 4).alpha(0.3).hexa();
  result.glassy_player0_selection = new Color(surface2).lightness(surface2.lightness() - 16).alpha(0.8).hexa();
  result.glassy_ignored_background = mix(overlay0, mantle, 0.1).hex();
  result.glassy_modified_background = mix(yellow, mantle, 0.1).hex();
  result.glassy_renamed_background = mix(sapphire, mantle, 0.1).hex();
  result.glassy_info_background = mix(overlay2, mantle, 0.1).hex();
  result.glassy_warning_background = mix(yellow, mantle, 0.1).hex();
  result.glassy_error_background = mix(red, mantle, 0.1).hex();
  result.glassy_success_background = mix(green, mantle, 0.1).hex();
  result.glassy_unreachable_background = mix(red, mantle, 0.1).hex();

  result.kvantum_highlight_color = accent.alpha(0.3).hexa();
  result.kvantum_link_visited_color = mix(accent, text, 0.8).hex();
  result.kvantum_base_accent_mix = mix(base, accent, 0.1).hex();

  // KvLibadwaita computed colors
  result.kv_main_widget_bg = mix(base, surface0, 0.5).hex();
  result.kv_scrollbar_slider = surface1.hex();
  result.kv_menu_tearoff = surface2.hex();
  result.kv_button_hover = mix(accent, surface0, 0.6).hex();
  result.kv_button_pressed = mix(accent, surface0, 0.4).hex();
  result.kv_button_focus = mix(accent, surface0, 0.3).hex();
  result.kv_hover_stop = mix(accent, overlay0, 0.5).hex();
  result.kv_progress_pattern = mix(accent, text, 0.92).hex();
  result.kv_view_hover = mix(accent, text, 0.8).hex();
  result.kv_titlebar_inactive = mix(overlay0, base, 0.5).hex();
  result.kv_progress_indicator_text = mix(overlay0, surface0, 0.5).hex();
  result.kv_menu_indicator = mix(overlay0, surface1, 0.5).hex();
  result.kv_toolbar_indicator = mix(overlay0, surface2, 0.5).hex();
  result.kv_dial_notches = mix(overlay0, surface0, 0.3).hex();
  result.kv_pagecolor = mix(overlay0, surface1, 0.3).hex();
  result.kv_border_color = mix(overlay0, surface2, 0.3).hex();
  result.kv_tooltip_border = mix(overlay1, surface0, 0.3).hex();
  result.kv_size_grip = mix(overlay1, overlay2, 0.5).hex();
  result.kv_tree_expander = mix(overlay2, subtext0, 0.5).hex();
  result.kv_background_light = mix(base, text, 0.95).hex();
  result.kv_background_brighter = mix(base, text, 0.9).hex();
  result.kv_view_text = mix(text, base, 0.7).hex();
  result.kv_alt_base = mix(base, text, 0.98).hex();
  result.kv_mid_light = mix(surface0, mantle, 0.5).hex();
  result.kv_mid = mix(mantle, base, 0.5).hex();
  result.kv_progress_indicator = mix(text, overlay0, 0.5).hex();
  result.kv_menu_text = mix(text, subtext0, 0.5).hex();
  result.kv_link_visited = mix(accent, text, 0.85).hex();

  return result;
}
