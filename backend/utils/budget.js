const MILLION = 1000000;

const BUDGET_RANGES = {
  'under-10': { min: 0, max: 10 },
  '<10': { min: 0, max: 10 },
  '10-15': { min: 10, max: 15 },
  'under-15': { min: 0, max: 15 },
  '<15': { min: 0, max: 15 },
  '15-20': { min: 15, max: 20 },
  '20-25': { min: 20, max: 25 },
  '25-30': { min: 25, max: 30 },
  '20-30': { min: 20, max: 30 },
  'over-30': { min: 30, max: null },
  '>30': { min: 30, max: null }
};

function parseBudgetRange(budget) {
  if (budget === undefined || budget === null || budget === '') return null;

  const key = String(budget).trim();
  if (BUDGET_RANGES[key]) {
    const range = BUDGET_RANGES[key];
    return {
      minMillion: range.min,
      maxMillion: range.max,
      minVnd: range.min * MILLION,
      maxVnd: range.max === null ? null : range.max * MILLION
    };
  }

  const numericMax = Number(key);
  if (Number.isFinite(numericMax) && numericMax > 0) {
    return {
      minMillion: 0,
      maxMillion: numericMax,
      minVnd: 0,
      maxVnd: numericMax * MILLION
    };
  }

  return null;
}

function isPriceInBudget(price, budget) {
  const range = parseBudgetRange(budget);
  if (!range) return true;

  const priceNumber = Number(price);
  if (!Number.isFinite(priceNumber)) return false;
  if (priceNumber < range.minVnd) return false;
  if (range.maxVnd !== null && priceNumber > range.maxVnd) return false;
  return true;
}

module.exports = {
  MILLION,
  BUDGET_RANGES,
  parseBudgetRange,
  isPriceInBudget
};
