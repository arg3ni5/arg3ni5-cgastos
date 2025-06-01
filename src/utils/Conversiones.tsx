
export const ConvertirCapitalize = (input: string): string => {
  return (input.charAt(0).toUpperCase() + input.slice(1).toLowerCase());
};
export const hexToRgba = (hex: string, alpha: number): string => {
  const cleanHex = hex.replace('#', '');

  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
