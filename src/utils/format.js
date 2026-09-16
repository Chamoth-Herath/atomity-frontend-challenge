const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const wholeDollars = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
});

export function money(cents, compact = false) {
  return (compact ? wholeDollars : dollars).format(cents / 100);
}

export function percent(part, whole) {
  return whole > 0 ? Math.round(part / whole * 100) : 0;
}
