{
  lib,
  rustPlatform,
  pkg-config,
  openssl,
}:
rustPlatform.buildRustPackage {
  pname = "hivefriends-api";
  version = "0.1.0";

  cargoLock = {
    lockFile = ../../backend/Cargo.lock;
    outputHashes = {
      "rusqlite_migration-1.1.0-alpha.2" = "sha256-u4oxD802nJS797TKfskQEtkRNMY/f/jVj91yPiJF5RA=";
    };
  };
  src = lib.cleanSource ../../backend;

  nativeBuildInputs = [pkg-config];
  buildInputs = [
    openssl
  ];

  meta = {
    description = "A website for a bunch of friends all around the world cherishing moments spent together in form of albums ";
    mainProgram = "hivefriends";
    maintainers = with lib.maintainers; [jokler];
    license = lib.licenses.agpl3Only;
  };
}
