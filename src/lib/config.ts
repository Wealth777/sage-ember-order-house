// Brand + business settings for the demo. Change these in one place.
export const RESTAURANT = {
  name: "Sage & Ember",
  shortCode: "SE",
  tagline: "Seasonal plates, wood-fired and made to order.",
};

export const CURRENCY = { code: "NGN", locale: "en-NG" };

const moneyFormatter = new Intl.NumberFormat(CURRENCY.locale, {
  style: "currency",
  currency: CURRENCY.code,
  maximumFractionDigits: 0,
});

export function formatMoney(amount: number) {
  return moneyFormatter.format(amount);
}
