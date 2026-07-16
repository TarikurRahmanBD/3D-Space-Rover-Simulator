# 3D Robot Simulator

A polished, interactive 3D robot simulation built with Three.js that lets you explore a simple rover environment with movement controls, telemetry, collision detection, and a cinematic third-person camera experience.

This project is designed as a modern front-end showcase for 3D graphics, interactive UI, and real-time scene logic in the browser.

![Project Demo](https://via.placeholder.com/1200x600.png?text=3D+Robot+Simulator+Demo)

## Features

- Immersive 3D scene with a full-screen canvas and animated rover chassis
- Live telemetry panel showing rover position, current speed, and nearest obstacle distance
- Basic collision detection using Three.js bounding boxes
- Third-person camera follow mode with manual OrbitControls fallback
- Dynamic headlight effect mounted on the rover
- Dust/smoke particle effects that appear while the rover is moving
- Responsive on-screen controls for movement and speed adjustment

## Technologies Used

- JavaScript
  - Three.js for rendering, lighting, camera controls, geometry, and animation
- HTML5
  - Structure for the scene canvas, UI overlay, and telemetry dashboard
- CSS3
  - Modern visual styling, glassmorphism-inspired panels, and responsive layout

## Installation & How to Run

1. Open the project folder in VS Code.
2. Install the Live Server extension if you do not already have it.
3. Right-click on [index.html](index.html) and select "Open with Live Server".
4. The simulator will open in your browser and load the 3D scene automatically.

Alternatively, you can open the project directly in a browser by launching [index.html](index.html).

## Controls

### Keyboard Controls
- Arrow Up / W: Move forward
- Arrow Down / S: Move backward
- Arrow Left / A: Turn left
- Arrow Right / D: Turn right

### On-Screen UI Controls
- Forward, Backward, Left, Right, Stop buttons
- Speed slider to adjust movement speed
- Camera Follow toggle to switch between third-person follow mode and manual camera control

## Project Structure

- [index.html](index.html) — Main page structure and UI layout
- [styles.css](styles.css) — Styling for the full-screen scene and control panels
- [script.js](script.js) — Three.js scene setup, rover logic, telemetry, collisions, camera, and particle effects

## Demo

A short demo GIF or screenshot can be added here to showcase the simulator visually.

## Future Enhancements

- Add terrain textures and environmental effects
- Introduce autonomous pathfinding or waypoint navigation
- Support multiple robot models and different obstacle types
- Add sound effects and richer lighting

## License

This project is open for educational and personal use.
