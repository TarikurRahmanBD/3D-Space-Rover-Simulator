# 🚀 3D Space Rover & Exploration Simulator

A polished, interactive 3D space rover simulation built with Three.js that lets you explore a stylized rocky valley environment. This project features robust movement physics, real-time telemetry tracking, collision detection, and a cinematic third-person camera experience, representing a modern front-end showcase for WebGL graphics.

👤 Developer & Creator
---------------------
*   **Lead Developer & Inventor:** Tarikur Rahman
*   **GitHub:** [@tarikurrahmanbd](https://github.com/tarikurrahmanbd)
*   **Portfolio:** [yourtarikur.netlify.app](https://yourtarikur.netlify.app)

🚀 Features
----------
*   **Next-Gen 3D Rendering:** Immersive, full-screen canvas displaying procedurally generated low-polygon rock formations, customized shadows, and atmospheric sunset fog.
*   **Dual-Control Systems:** Smooth driving physics (acceleration/deceleration) controllable via keyboard (`W, A, S, D` / Arrow Keys) or the compact, responsive on-screen D-Pad.
*   **Live Telemetry Dashboard:** Tracks real-time simulation metrics including current Rover X/Z coordinates, velocity, and a dynamic distance sensor for the nearest obstacle.
*   **Smart Orbit Camera:** Seamless third-person follow camera tracking that allows manual mouse rotation (drag to orbit, scroll to zoom) without breaking the follow lock.
*   **Optimized HUD Layout:** Modern glassmorphism-inspired overlays strategically split into corners to maximize the 3D canvas viewport.

🛠️ Tech Stack & Tools
---------------------
*   **3D Graphics & Engine:** JavaScript, Three.js (WebGL), OrbitControls
*   **UI Structure & Layout:** HTML5, CSS3 (Custom Glassmorphism Panels)
*   **Physics & Animation:** JavaScript ES6 Event Listeners, Custom Delta-Time Render Loop

📂 Repository Structure
----------------------
```text
├── index.html                     # Main page structure and user interface (HUD)
├── styles.css                     # Responsive glassmorphic panels and full-screen canvas layout
├── script.js                     # Three.js scene setup, rover physics, cameras, and collision logic
└── README.md                      # Project documentation and setup guide
