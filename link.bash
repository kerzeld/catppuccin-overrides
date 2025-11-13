#!/bin/bash

SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

rm ~/.local/share/konsole/kerzeld-konsole.colorscheme
ln -s $SCRIPT_PATH/out/plasma/kerzeld-konsole.colorscheme /home/dom/.local/share/konsole/kerzeld-konsole.colorscheme

rm ~/.local/share/color-schemes/kerzeld.colors
ln -s $SCRIPT_PATH/out/plasma/kerzeld.colors ~/.local/share/color-schemes/kerzeld.colors

rm ~/.config/zed/themes/catppuccin-kerzeld.json
ln -s $SCRIPT_PATH/out/whiskers/themes/catppuccin-kerzeld.json ~/.config/zed/themes/catppuccin-kerzeld.json
rm ~/.config/zed/themes
ln -s $SCRIPT_PATH/out/whiskers/themes/catppuccin-kerzeld-no-italics.json ~/.config/zed/themes/catppuccin-kerzeld-no-italics.json

# Reload plasma colors
plasma-apply-colorscheme BreezeDark
plasma-apply-colorscheme kerzeld
