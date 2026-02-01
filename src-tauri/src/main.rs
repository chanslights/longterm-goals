#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri::window::WindowBuilder;
use tauri::WindowUrl;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = WindowBuilder::new(
                app,
                "main",
                WindowUrl::App("index.html".into())
            )
            .title("长期目标")
            .inner_size(400.0, 600.0)
            .resizable(false)
            .decorations(true)
            .transparent(false)
            .center()
            .always_on_top(false)
            .build()?;
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
