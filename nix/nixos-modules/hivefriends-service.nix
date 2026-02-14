{
  config,
  pkgs,
  lib,
  ...
}:
with lib; let
  cfg = config.services.hivefriends;
in {
  options = {
    services.hivefriends = {
      enable = mkOption {
        type = types.bool;
        default = false;
        description = ''
          Whether to run hivefriends.
        '';
      };
      api = {
        package = mkOption {
          type = types.package;
          default = pkgs.callPackage ../backend/package.nix {};
          description = "Hivefriends API package";
        };

        port = mkOption {
          type = types.port;
          default = 4774;
          description = ''
            Port the API runs on.
          '';
        };

        logLevel = mkOption {
          type = types.str;
          default = "debug";
          description = ''
            Rust log level: https://docs.rs/env_logger/latest/env_logger/#enabling-logging
          '';
        };
      };
      web = {
        package = mkOption {
          type = types.package;
          default = pkgs.callPackage ../frontend/package.nix {};
          description = "Hivefriends web package";
        };
      };
    };
  };

  config = mkIf cfg.enable {
    systemd.services.hivefriends = {
      description = "A website for a bunch of friends all around the world cherishing moments spent together";
      wantedBy = ["multi-user.target"];
      after = ["network-online.target"];
      wants = ["network-online.target"];
      environment = {
        BIND_ADDRESS = "127.0.0.1:${builtins.toString cfg.api.port}";
        DB_PATH = "/var/lib/hivefriends/prod.db";
        DATA_PATH = "/var/lib/hivefriends/data";
        RUST_LOG = cfg.api.logLevel;
        RUST_BACKTRACE = "1";
      };
      serviceConfig = {
        DynamicUser = true;
        StateDirectory = "hivefriends";
        ExecStart = "${lib.getExe cfg.api.package}";
        Restart = "always";
        RestartSec = 30;

        # Hardening - look into adding more
        CapabilityBoundingSet = [""];
        AmbientCapabilities = [""];
        NoNewPrivileges = true;
        ProtectSystem = "full";
        ProtectClock = true;
        ProtectControlGroups = true;
        ProtectHome = true;
        ProtectHostname = true;
        ProtectKernelLogs = true;
        ProtectKernelModules = true;
        ProtectKernelTunables = true;
        PrivateTmp = true;
        LockPersonality = true;
        RestrictAddressFamilies = [
          "AF_INET"
          "AF_INET6"
          "AF_UNIX"
        ];
        RestrictNamespaces = true;
        RestrictRealtime = true;
        RestrictSUIDSGID = true;
      };
    };

    services.nginx = {
      enable = true;
      virtualHosts = {
        "friends.hivecom.net" = {
          root = "${cfg.web.package}/share/hivefriends";

          locations = {
            "/" = {
              tryFiles = "$uri $uri/ /index.html index.htm";
            };

            "~ /(api|data)/" = rec {
              proxyPass = "http://127.0.0.1:${builtins.toString cfg.api.port}";
              recommendedProxySettings = true;
              # TODO: is the inner proxy_pass needed?
              extraConfig = ''
                location ~ /api/images {
                  client_max_body_size 100M;
                  proxy_request_buffering off;
                  proxy_pass ${proxyPass};
                }
              '';
            };
          };
        };
      };
    };
  };
}
