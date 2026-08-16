fn main() {
    if std::env::var("CARGO_CFG_TARGET_ENV").as_deref() == Ok("msvc") {
        println!("cargo:rustc-link-arg-bin=pulsar-port=/IGNORE:4099");
        println!("cargo:rustc-link-arg-cdylib=/IGNORE:4099");

        let static_crt = if std::env::var("PROFILE").as_deref() == Ok("release") {
            "LIBCMT"
        } else {
            "LIBCMTD"
        };
        println!("cargo:rustc-link-arg-bin=pulsar-port=/NODEFAULTLIB:{static_crt}");
        println!("cargo:rustc-link-arg-cdylib=/NODEFAULTLIB:{static_crt}");
    }

    tauri_build::build()
}
