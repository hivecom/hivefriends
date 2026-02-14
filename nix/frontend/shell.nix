# FIXME: this was pasted from another project
{pkgs}:
pkgs.mkShell {
  inputsFrom = [(pkgs.callPackage ./package.nix {})];
  buildInputs = with pkgs; [
    nodePackages.prettier
    vtsls
    vscode-langservers-extracted
  ];
}
