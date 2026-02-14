{
  lib,
  stdenv,
  buildNpmPackage,
}:
stdenv.mkDerivation rec {
  pname = "hivefriends-web";
  version = "1.0.0";

  src = buildNpmPackage {
    inherit version;
    pname = "hivefriends-web-source";
    src = lib.cleanSource ../../frontend;
    npmDepsHash = "sha256-1D9r4a2zgPVSmoY+Veg9wP3/POkykA77UYVDAIuGI2Q=";
    makeCacheWritable = true;
  };

  installPhase = ''
    runHook preInstall
    mkdir -p $out/share/hivefriends
    mv lib/node_modules/hi-friends/dist/* $out/share/hivefriends
    runHook postInstall
  '';

  meta = {
    description = "A website for a bunch of friends all around the world cherishing moments spent together in form of albums";
    maintainers = with lib.maintainers; [jokler];
    license = lib.licenses.agpl3Only;
  };
}
