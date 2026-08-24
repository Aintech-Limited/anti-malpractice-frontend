import { IOfficeRevenue } from "../interface";

/**
 * Formats a number into a compact string with metric suffixes (K, M, B, etc.)
 * @param num The number to format
 * @param decimals Number of decimal places to keep for fractional values (default: 1)
 * @returns A formatted string
 */
export function formatCompactNumber(num: number, decimals: number = 1): string {
  if (num === 0) return "0";

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  const lookups = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
  ];

  // Find the highest matching scale matching the number value
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookups
    .slice()
    .reverse()
    .find((item) => absNum >= item.value);

  if (!item) return num.toString();

  // Divide by the unit tier and format decimal points
  const formatted = (absNum / item.value).toFixed(decimals).replace(rx, "$1");

  return `${sign}${formatted}${item.symbol}`;
}

export const getTopEaraning = (data: IOfficeRevenue[]) => {
  let topPerforming = 0;

  Object.values(data).map((obj) => {
    if (obj.amount > topPerforming) topPerforming = obj.amount;
  });

  return topPerforming;
};
