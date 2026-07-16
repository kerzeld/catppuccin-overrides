{
  pkgs ? import <nixpkgs> { },
}:

pkgs.mkShell {
  packages = [
    pkgs.nodejs-slim_24
    pkgs.pnpm
    pkgs.catppuccin-whiskers
  ];
}
