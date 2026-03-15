{
  description = "tempo-keeper flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in {
      devShells.${system}.default = pkgs.mkShell {
        name = "nodejs";
        buildInputs = with pkgs; [
          nodejs_24
          pnpm
          typescript-language-server
        ];
        # For Claude Code sandbox
        shellHook = ''
          export NPM_CONFIG_PREFIX="$HOME/.npm-nix-global"
          export PATH="$HOME/.npm-nix-global/bin:$PATH"
          npm install -g @anthropic-ai/sandbox-runtime --silent
        '';
      };
    };
}
