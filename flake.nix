{
  description = "A website for a bunch of friends all around the world cherishing moments spent together in form of albums";
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-25.11";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    supportedSystems = ["x86_64-linux"];
    forEachSystem = nixpkgs.lib.genAttrs supportedSystems;
    overlayList = [self.overlays.default];
    pkgsBySystem = forEachSystem (
      system:
        import nixpkgs {
          inherit system;
          overlays = overlayList;
        }
    );
  in {
    overlays.default = final: prev: {
      hivefriends-web = final.callPackage ./nix/frontend/package.nix {};
      hivefriends-api = final.callPackage ./nix/backend/package.nix {};
    };

    packages = forEachSystem (system: let
      pkgs = pkgsBySystem.${system};
    in rec {
      hivefriends-web = pkgs.callPackage ./nix/frontend/package.nix {};
      hivefriends-api = pkgs.callPackage ./nix/backend/package.nix {};

      default = pkgs.symlinkJoin {
        name = "hivefriends";
        paths = [
          hivefriends-api
          hivefriends-web
        ];
      };
    });

    devShells = forEachSystem (system: let
      pkgs = pkgsBySystem.${system};
    in rec {
      frontend = pkgs.callPackage ./nix/frontend/shell.nix {};
      backend = pkgs.callPackage ./nix/backend/shell.nix {};
      default = pkgs.mkShell {
        inputsFrom = [
          frontend
          backend
        ];
      };
    });

    nixosModules.default = import ./nix/nixos-modules/hivefriends-service.nix;
  };
}
