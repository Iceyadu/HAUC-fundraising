export const CHURCH_NAME = "Halwot Emmanuel United Church";
export const CHURCH_SHORT_NAME = "Halwot Emmanuel";
export const CHURCH_LOGO = "/church-logo.png";
export const CHURCH_LOGO_ALT = `${CHURCH_NAME} logo`;
export const CAMPAIGN_TITLE = "52-Day Building Campaign";
export const CAMPAIGN_PURPOSE = "Church Building Project";
export const FIXED_CONTRIBUTION_ETB = 52_000;

export const BUILDING_PROJECT_IMAGE = "/church-building-project.png";
export const BUILDING_PROJECT_ALT =
  "Architectural rendering of the new Halwot Emmanuel United Church building";

export const CAMPAIGN_GOAL_ETB = 52_000_000;
export const AMOUNT_RAISED_ETB = 10_920_000;
export const CONTRIBUTOR_COUNT = 210;

export const CONTACT = {
  email: "info@halwotemmanuel.org",
  phone: "+251 11 000 0000",
  address: "Addis Ababa, Ethiopia",
};

export const PAYMENT_METHODS = [
  { value: "telebirr", label: "Telebirr" },
  { value: "cbe", label: "CBE" },
  { value: "dashen", label: "Dashen" },
  { value: "awash", label: "Awash" },
  { value: "cash", label: "Cash" },
] as const;

export function formatEtb(amount: number) {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCampaignProgress() {
  const remaining = Math.max(CAMPAIGN_GOAL_ETB - AMOUNT_RAISED_ETB, 0);
  const progress = Math.min((AMOUNT_RAISED_ETB / CAMPAIGN_GOAL_ETB) * 100, 100);

  return {
    goal: CAMPAIGN_GOAL_ETB,
    raised: AMOUNT_RAISED_ETB,
    remaining,
    progress,
    contributors: CONTRIBUTOR_COUNT,
  };
}
