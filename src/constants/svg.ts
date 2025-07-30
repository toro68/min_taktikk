// SVG attribute constants to avoid repetition
export const SVG_ATTRIBUTES = {
  strokeWidth: {
    thin: "1",
    normal: "2", 
    thick: "3" // Sørg for at denne finnes
  },
  stroke: {
    black: "#000000",
    white: "#ffffff",
    red: "#ff0000",
    blue: "#0000ff",
    green: "#008000",
    orange: "#ffa500",
    purple: "#800080"
  },
  fill: {
    none: "none",
    white: "#ffffff",
    black: "#000000"
  }
} as const;

// Common SVG style combinations
export const SVG_STYLES = {
  defaultLine: {
    stroke: SVG_ATTRIBUTES.stroke.black,
    strokeWidth: SVG_ATTRIBUTES.strokeWidth.normal,
    fill: SVG_ATTRIBUTES.fill.none
  },
  pitchLine: {
    stroke: SVG_ATTRIBUTES.stroke.black,
    strokeWidth: SVG_ATTRIBUTES.strokeWidth.normal,
    fill: SVG_ATTRIBUTES.fill.none
  },
  defaultShape: {
    stroke: SVG_ATTRIBUTES.stroke.black,
    strokeWidth: SVG_ATTRIBUTES.strokeWidth.normal,
    fill: SVG_ATTRIBUTES.fill.black
  }
} as const;