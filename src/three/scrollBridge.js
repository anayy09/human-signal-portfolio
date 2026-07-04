// Mutable bridge between the DOM scroll world and the WebGL scene.
// React writes; useFrame reads. No context, no re-renders.
export const scrollBridge = {
  progress: 0,          // 0..1 through the whole document
  accent: '#5B8DEF',    // accent of the section currently in view
  reducedMotion: false, // set once at boot from the media query
};

export function setSectionAccent(color) {
  if (color) scrollBridge.accent = color;
}
