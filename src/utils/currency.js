// Currency formatting utilities for ZenSpend
// All monetary values are displayed in Moroccan Dirham (MAD)

/**
 * Format a number as MAD currency
 * @param {number} amount - The amount to format
 * @param {boolean} showDecimals - Whether to show decimal places (default: false)
 * @returns {string} Formatted currency string (e.g., "1 200 MAD")
 */
export const formatCurrency = (amount, showDecimals = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 MAD'
  }

  const num = parseFloat(amount)
  
  // Format with space as thousand separator
  const formatted = new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
    useGrouping: true,
  }).format(num)

  return `${formatted} MAD`
}

/**
 * Format currency for compact display (used in charts)
 * @param {number} amount - The amount to format
 * @returns {string} Compact currency string (e.g., "1.2K MAD")
 */
export const formatCurrencyCompact = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 MAD'
  }

  const num = parseFloat(amount)

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M MAD`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K MAD`
  }

  return `${Math.round(num)} MAD`
}

/**
 * Parse a currency input string to a number
 * Handles various input formats and returns a clean number
 * @param {string} input - The input string
 * @returns {number} The parsed number
 */
export const parseCurrencyInput = (input) => {
  if (!input) return 0
  
  // Remove spaces, MAD text, and any non-numeric characters except decimal point
  const cleaned = input.toString().replace(/[^\d.]/g, '')
  const parsed = parseFloat(cleaned)
  
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Currency symbol constant
 */
export const CURRENCY_SYMBOL = 'MAD'

/**
 * Currency display name
 */
export const CURRENCY_NAME = 'Dirham Marocain'

