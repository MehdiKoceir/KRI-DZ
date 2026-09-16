export function formatDZD(amount: number, frequency: string = 'mois'): string {
  // Format with space as thousands separator
  const formatted = new Intl.NumberFormat('fr-DZ', {
    maximumFractionDigits: 0
  }).format(amount).replace(/,/g, ' ');

  return `${formatted} DZD / ${frequency}`;
}

export function formatPriceOnly(amount: number): string {
  return new Intl.NumberFormat('fr-DZ', {
    maximumFractionDigits: 0
  }).format(amount).replace(/,/g, ' ') + ' DZD';
}

export function formatShortDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}
