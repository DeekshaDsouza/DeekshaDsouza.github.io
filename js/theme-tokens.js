const palette = Object.freeze({
  base: 192,
  accent: 11,
  warm: 36,
  cool: 204,
  danger: 4,
});

const root = document.documentElement;

for (const [name, hue] of Object.entries(palette)) {
  root.style.setProperty(`--hue-${name}`, String(hue));
}

root.dataset.theme = "deeksha";
