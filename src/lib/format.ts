export function formatCurrency(amount: number) {
  const safeAmount = isNaN(amount) || amount === undefined ? 0 : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(safeAmount);
}
