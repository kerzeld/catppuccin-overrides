#!/bin/bash

SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

rm ~/.local/share/konsole/kerzeld-konsole.colorscheme
ln -s $SCRIPT_PATH/out/plasma/kerzeld-konsole.colorscheme /home/dom/.local/share/konsole/kerzeld-konsole.colorscheme

rm ~/.local/share/color-schemes/kerzeld.colors
ln -s $SCRIPT_PATH/out/plasma/kerzeld.colors ~/.local/share/color-schemes/kerzeld.colors

# Reload plasma colors
plasma-apply-colorscheme BreezeDark
plasma-apply-colorscheme kerzeld
