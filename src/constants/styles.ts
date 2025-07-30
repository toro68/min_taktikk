export const TOOLTIP_STYLES = {
  default: "py-0.5 px-1.5 bg-black/90 text-white border-0",
  small: "py-0.5 px-1 bg-black/90 text-white border-0 text-xs"
} as const;

export const BUTTON_STYLES = {
  active: "bg-blue-600 text-white font-bold border-2 border-blue-700 shadow-md shadow-blue-300",
  inactive: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  success: "bg-green-600 text-white hover:bg-green-700"
} as const;