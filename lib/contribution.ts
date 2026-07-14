import { FIXED_CONTRIBUTION_ETB } from "@/lib/branding";

export const MIN_CONTRIBUTION_UNITS = 1;
export const MAX_CONTRIBUTION_UNITS = 20;

export const CONTRIBUTION_UNIT_OPTIONS = Array.from(
  { length: MAX_CONTRIBUTION_UNITS },
  (_, index) => index + 1,
);

export function calculateContributionAmount(units: number): number {
  return units * FIXED_CONTRIBUTION_ETB;
}

export function getContributionUnitsFromAmount(amount: number): number {
  return Math.round(amount / FIXED_CONTRIBUTION_ETB);
}

export function isValidContributionAmount(amount: number): boolean {
  if (!Number.isFinite(amount) || amount <= 0) {
    return false;
  }

  return amount % FIXED_CONTRIBUTION_ETB === 0;
}

export function isValidContributionUnits(units: number): boolean {
  return (
    Number.isInteger(units) &&
    units >= MIN_CONTRIBUTION_UNITS &&
    units <= MAX_CONTRIBUTION_UNITS
  );
}
