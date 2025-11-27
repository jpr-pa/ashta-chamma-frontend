// src/utils/gameConstants.js

// The 7x7 Grid coordinates
export const SAFE_POSITIONS = [
  {x: 3, y: 0}, {x: 1, y: 1}, {x: 5, y: 1}, {x: 3, y: 2},
  {x: 0, y: 3}, {x: 2, y: 3}, {x: 4, y: 3}, {x: 6, y: 3},
  {x: 3, y: 4}, {x: 1, y: 5}, {x: 5, y: 5}, {x: 3, y: 6}
];

// Defined spiral paths for each player color (0 to Home)
// This maps the linear step index (0, 1, 2...) to actual grid coordinates (x, y)
// NOTE: These need to be meticulously mapped to your specific 7x7 spiral.
// Below is a generated approximation of the Red Player path (Bottom Start) based on your description.

const RED_PATH = [
  // Outer Ring (CCW)
  {x:3, y:6}, {x:4, y:6}, {x:5, y:6}, {x:6, y:6}, // Bottom Right
  {x:6, y:5}, {x:6, y:4}, {x:6, y:3}, {x:6, y:2}, {x:6, y:1}, {x:6, y:0}, // Right Edge
  {x:5, y:0}, {x:4, y:0}, {x:3, y:0}, {x:2, y:0}, {x:1, y:0}, {x:0, y:0}, // Top Edge
  {x:0, y:1}, {x:0, y:2}, {x:0, y:3}, {x:0, y:4}, {x:0, y:5}, {x:0, y:6}, // Left Edge
  {x:1, y:6}, {x:2, y:6}, // Bottom Left return
  
  // Gate to Inner (at 5,0 for Red? Adjust as needed based on board rotation)
  // Inner Ring (CW) - Reverses direction!
  {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}, // Left Inner
  {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:5, y:1}, // Top Inner
  {x:5, y:2}, {x:5, y:3}, {x:5, y:4}, {x:5, y:5}, // Right Inner
  {x:4, y:5}, {x:3, y:5}, {x:2, y:5}, // Bottom Inner
  
  // Middle Ring (CCW)
  {x:2, y:4}, {x:2, y:3}, {x:2, y:2},
  {x:3, y:2}, {x:4, y:2},
  {x:4, y:3}, {x:4, y:4},
  {x:3, y:4},
  
  // HOME
  {x:3, y:3} 
];

// Helper to rotate coordinates for other players (90, 180, 270 degrees)
const rotatePath = (path, angle) => {
  return path.map(p => {
    // Center is 3,3. Rotate around it.
    const cx = 3, cy = 3;
    const dx = p.x - cx;
    const dy = p.y - cy;
    let nx, ny;
    
    if (angle === 90) { nx = -dy; ny = dx; }
    if (angle === 180) { nx = -dx; ny = -dy; }
    if (angle === 270) { nx = dy; ny = -dx; }
    
    return { x: nx + cx, y: ny + cy };
  });
};

export const PATHS = {
  red: RED_PATH,
  blue: rotatePath(RED_PATH, 90),
  green: rotatePath(RED_PATH, 180),
  yellow: rotatePath(RED_PATH, 270)
};
