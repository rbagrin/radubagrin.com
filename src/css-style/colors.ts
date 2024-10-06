export const Colors = {
  White: "#FFFFFF",
  Black: "#000000",
  Purple: "#5e35b1",
  NavyBlue: "#2C3E50",
  LightGray: "#ECF0F1",
  StrongGreen: "#27AE60",
  MediumGreen: "#2ECC71",
  LightGreen: "#58D68D",
  DarkOrange: "#F39C12",
  MediumOrange: "#F5B041",
  GoldenYellow: "#F7DC6F",
  GreenishYellow: "#cafc03",
  DarkRed: "#E74C3C",
  MediumRed: "#EC7063",
  LightRed: "#F1948A",
  BlueLight: "#2196F3",
};

export type ColorType = typeof Colors[keyof typeof Colors];

// Darken color utility function (simple approach)
export const darkenColor = (hex: string, amount: number = 0.05): string => {
  let color = hex.replace("#", "");
  let num = parseInt(color, 16);

  let r = (num >> 16) + amount * 255;
  let g = ((num >> 8) & 0x00ff) + amount * 255;
  let b = (num & 0x0000ff) + amount * 255;

  r = r < 255 ? (r < 0 ? 0 : r) : 255;
  g = g < 255 ? (g < 0 ? 0 : g) : 255;
  b = b < 255 ? (b < 0 ? 0 : b) : 255;

  return `#${(b | (g << 8) | (r << 16)).toString(16)}`;
};
