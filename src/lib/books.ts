import type { CenturyFolder } from '@/types';

// ============================================================================
// CENTURY TO ROMAN NUMERAL CONVERSION
// ============================================================================

function toRomanNumeral(num: number): string {
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  
  const romanNumerals: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  
  let result = '';
  let remaining = absNum;
  
  for (const [value, numeral] of romanNumerals) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  
  return isNegative ? `-${result}` : result;
}

// ============================================================================
// BOOK IDS BY CENTURY
// Maps century numbers to arrays of book IDs from the database
// Century -4 = 4th century BC, Century 19 = 19th century AD
// ============================================================================

export const BOOKS_BY_CENTURY: Record<number, string[]> = {
  // 4th Century BC - Ancient Greece
  [-4]: [
    // Example: The Republic by Plato
    // 'uuid-of-the-republic',
  ],
  
  // 1st Century BC - Late Roman Republic
  [-1]: [
    // Example: Works by Cicero
  ],
  
  // 1st Century AD - Early Roman Empire
  [1]: [
    // Example: Works by Seneca
  ],
  
  // 2nd Century AD
  [2]: [
    // Example: Meditations by Marcus Aurelius
  ],
  
  // 4th Century AD
  [4]: [
    // Example: Confessions by Augustine
  ],
  
  // 13th Century
  [13]: [
    // Example: Divine Comedy by Dante
  ],
  
  // 16th Century - Renaissance
  [16]: [
    // Example: Works by Shakespeare
  ],
  
  // 17th Century
  [17]: [
    // Example: Works by Spinoza
  ],
  
  // 18th Century - Enlightenment
  [18]: [
    // Example: Works by Voltaire, Rousseau
  ],
  
  // 19th Century
  [19]: [
    // Example: Works by Dostoevsky, Tolstoy, Nietzsche
  ],
  
  // 20th Century (before 1929 for public domain)
  [20]: [
    // Example: Works by Kafka, early Joyce
  ],
};

// ============================================================================
// GENERATE CENTURY FOLDERS
// ============================================================================

export function getCenturyFolders(): CenturyFolder[] {
  return Object.entries(BOOKS_BY_CENTURY)
    .filter(([_, bookIds]) => bookIds.length > 0)
    .map(([century, bookIds]) => ({
      century: parseInt(century),
      romanNumeral: toRomanNumeral(parseInt(century)),
      bookIds,
    }))
    .sort((a, b) => a.century - b.century);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getCenturyForBook(bookId: string): number | null {
  for (const [century, bookIds] of Object.entries(BOOKS_BY_CENTURY)) {
    if (bookIds.includes(bookId)) {
      return parseInt(century);
    }
  }
  return null;
}

export function getRomanNumeralForCentury(century: number): string {
  return toRomanNumeral(century);
}

export function getBooksInCentury(century: number): string[] {
  return BOOKS_BY_CENTURY[century] || [];
}

// Format century display with era suffix
export function formatCenturyLabel(century: number): string {
  const roman = toRomanNumeral(Math.abs(century));
  if (century < 0) {
    return `${roman} BC`;
  }
  return `${roman} AD`;
}
