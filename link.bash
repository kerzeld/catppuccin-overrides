#!/bin/bash

SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# kde plasma
rm ~/.local/share/konsole/kerzeld-konsole.colorscheme || true
ln -s $SCRIPT_PATH/out/plasma/kerzeld-konsole.colorscheme /home/dom/.local/share/konsole/kerzeld-konsole.colorscheme

rm ~/.local/share/color-schemes/kerzeld.colors || true
ln -s $SCRIPT_PATH/out/plasma/kerzeld.colors ~/.local/share/color-schemes/kerzeld.colors

rm ~/.local/share/color-schemes/kerzeld-glassy.colors || true
ln -s $SCRIPT_PATH/out/plasma/kerzeld-glassy.colors ~/.local/share/color-schemes/kerzeld-glassy.colors

# firefox
rm ~/.mozilla/firefox/default/chrome/userChrome.css || true
ln -s $SCRIPT_PATH/out/firefox/userChrome.css ~/.mozilla/firefox/default/chrome/userChrome.css

# oh my posh
rm ~/.config/oh-my-posh/template.omp.json || true
mkdir -p ~/.config/oh-my-posh
ln -s $SCRIPT_PATH/out/template.omp.json ~/.config/oh-my-posh/template.omp.json

# Zed themes
rm ~/.config/zed/themes/catppuccin-kerzeld.json || true
ln -s $SCRIPT_PATH/out/whiskers/zed/catppuccin-kerzeld.json ~/.config/zed/themes/catppuccin-kerzeld.json
rm ~/.config/zed/themes/catppuccin-kerzeld-no-italics.json || true
ln -s $SCRIPT_PATH/out/whiskers/zed/catppuccin-kerzeld-no-italics.json ~/.config/zed/themes/catppuccin-kerzeld-no-italics.json

rm ~/.config/zed/themes/catppuccin-glassy-kerzeld.json || true
ln -s $SCRIPT_PATH/out/whiskers/zed-glassy/catppuccin-kerzeld.json ~/.config/zed/themes/catppuccin-glassy-kerzeld.json
rm ~/.config/zed/themes/catppuccin-glassy-kerzeld-no-italics.json || true
ln -s $SCRIPT_PATH/out/whiskers/zed-glassy/catppuccin-kerzeld-no-italics.json ~/.config/zed/themes/catppuccin-kerzeld-glassy-no-italics.json

# Reload plasma colors
# plasma-apply-colorscheme BreezeDark
# plasma-apply-colorscheme kerzeld
