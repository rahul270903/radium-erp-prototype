export const formatCurrency = (value: number, compact = false) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? 'compact' : 'standard',
  });
  return formatter.format(value);
};

export const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', {
  month: 'short', day: '2-digit', year: 'numeric',
}).format(new Date(`${value}T12:00:00`));

export const todayLabel = () => new Intl.DateTimeFormat('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
}).format(new Date());
