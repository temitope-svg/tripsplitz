/**
 * Formats a number or string as currency with $ symbol and 2 decimal places
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: string | number): string => {
  // Convert to number and handle invalid inputs
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return '$0.00';
  }

  // Format with $ symbol, commas, and 2 decimal places
  return `$${numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};