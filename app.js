/* =========================================================
   TAX SAVINGS ADVISOR — CALCULATION ENGINE
   Tax Years 2024, 2025, 2026
   ========================================================= */

'use strict';

/* ---- TAX CONSTANTS (2024 / 2025-OBBB / 2026-OBBB official IRS figures) ---- */
const TAX_DATA = {
  2024: {
    brackets: {
      single: [
        { min: 0,       max: 11600,  rate: 0.10 },
        { min: 11600,   max: 47150,  rate: 0.12 },
        { min: 47150,   max: 100525, rate: 0.22 },
        { min: 100525,  max: 191950, rate: 0.24 },
        { min: 191950,  max: 243725, rate: 0.32 },
        { min: 243725,  max: 609350, rate: 0.35 },
        { min: 609350,  max: Infinity, rate: 0.37 }
      ],
      mfj: [
        { min: 0,       max: 23200,  rate: 0.10 },
        { min: 23200,   max: 94300,  rate: 0.12 },
        { min: 94300,   max: 201050, rate: 0.22 },
        { min: 201050,  max: 383900, rate: 0.24 },
        { min: 383900,  max: 487450, rate: 0.32 },
        { min: 487450,  max: 731200, rate: 0.35 },
        { min: 731200,  max: Infinity, rate: 0.37 }
      ],
      mfs: [
        { min: 0,       max: 11600,  rate: 0.10 },
        { min: 11600,   max: 47150,  rate: 0.12 },
        { min: 47150,   max: 100525, rate: 0.22 },
        { min: 100525,  max: 191950, rate: 0.24 },
        { min: 191950,  max: 243725, rate: 0.32 },
        { min: 243725,  max: 365600, rate: 0.35 },
        { min: 365600,  max: Infinity, rate: 0.37 }
      ],
      hoh: [
        { min: 0,       max: 16550,  rate: 0.10 },
        { min: 16550,   max: 63100,  rate: 0.12 },
        { min: 63100,   max: 100500, rate: 0.22 },
        { min: 100500,  max: 191950, rate: 0.24 },
        { min: 191950,  max: 243700, rate: 0.32 },
        { min: 243700,  max: 609350, rate: 0.35 },
        { min: 609350,  max: Infinity, rate: 0.37 }
      ]
    },
    standardDeduction: {
      single: 14600,
      mfj:    29200,
      mfs:    14600,
      hoh:    21900
    },
    ltcgBrackets: {
      single: [
        { min: 0,       max: 47025,  rate: 0.00 },
        { min: 47025,   max: 518900, rate: 0.15 },
        { min: 518900,  max: Infinity, rate: 0.20 }
      ],
      mfj: [
        { min: 0,       max: 94050,  rate: 0.00 },
        { min: 94050,   max: 583750, rate: 0.15 },
        { min: 583750,  max: Infinity, rate: 0.20 }
      ],
      hoh: [
        { min: 0,       max: 63000,  rate: 0.00 },
        { min: 63000,   max: 551350, rate: 0.15 },
        { min: 551350,  max: Infinity, rate: 0.20 }
      ],
      mfs: [
        { min: 0,       max: 47025,  rate: 0.00 },
        { min: 47025,   max: 291850, rate: 0.15 },
        { min: 291850,  max: Infinity, rate: 0.20 }
      ]
    },
    limits: {
      k401: { under50: 23000, over50: 30500 },
      ira:  { under50: 7000,  over50: 8000  },
      sep:  { max: 69000, pct: 0.25 },
      hsa:  { self: 4150, family: 8300 },
      fsa:  { healthcare: 3200, dependentCare: 5000 },
      studentLoanInterest: 2500,
      saltCap: 10000,
      childTaxCredit: 2000,
      otherDependentCredit: 500,
      childCareExpenseCap1: 3000,
      childCareExpenseCap2: 6000,
      childCareCreditPct: 0.20,
      aoCredit: 2500,
      llCredit: 2000,
      educatorExpenses: 300,
      adoptionCreditMax: 16810,
      capitalLossLimit: 3000,
      energyCreditPct: 0.30
    }
  },
  2025: {
    brackets: {
      single: [
        { min: 0,       max: 11925,  rate: 0.10 },
        { min: 11925,   max: 48475,  rate: 0.12 },
        { min: 48475,   max: 103350, rate: 0.22 },
        { min: 103350,  max: 197300, rate: 0.24 },
        { min: 197300,  max: 250525, rate: 0.32 },
        { min: 250525,  max: 626350, rate: 0.35 },
        { min: 626350,  max: Infinity, rate: 0.37 }
      ],
      mfj: [
        { min: 0,       max: 23850,  rate: 0.10 },
        { min: 23850,   max: 96950,  rate: 0.12 },
        { min: 96950,   max: 206700, rate: 0.22 },
        { min: 206700,  max: 394600, rate: 0.24 },
        { min: 394600,  max: 501050, rate: 0.32 },
        { min: 501050,  max: 751600, rate: 0.35 },
        { min: 751600,  max: Infinity, rate: 0.37 }
      ],
      mfs: [
        { min: 0,       max: 11925,  rate: 0.10 },
        { min: 11925,   max: 48475,  rate: 0.12 },
        { min: 48475,   max: 103350, rate: 0.22 },
        { min: 103350,  max: 197300, rate: 0.24 },
        { min: 197300,  max: 250525, rate: 0.32 },
        { min: 250525,  max: 375800, rate: 0.35 },
        { min: 375800,  max: Infinity, rate: 0.37 }
      ],
      hoh: [
        { min: 0,       max: 17000,  rate: 0.10 },
        { min: 17000,   max: 64850,  rate: 0.12 },
        { min: 64850,   max: 103350, rate: 0.22 },
        { min: 103350,  max: 197300, rate: 0.24 },
        { min: 197300,  max: 250500, rate: 0.32 },
        { min: 250500,  max: 626350, rate: 0.35 },
        { min: 626350,  max: Infinity, rate: 0.37 }
      ]
    },
    // OBBB raised 2025 standard deductions by $750/$1,500/$1,125
    standardDeduction: {
      single: 15750,
      mfj:    31500,
      mfs:    15750,
      hoh:    23625
    },
    ltcgBrackets: {
      single: [
        { min: 0,       max: 48350,  rate: 0.00 },
        { min: 48350,   max: 533400, rate: 0.15 },
        { min: 533400,  max: Infinity, rate: 0.20 }
      ],
      mfj: [
        { min: 0,       max: 96700,  rate: 0.00 },
        { min: 96700,   max: 600050, rate: 0.15 },
        { min: 600050,  max: Infinity, rate: 0.20 }
      ],
      hoh: [
        { min: 0,       max: 64750,  rate: 0.00 },
        { min: 64750,   max: 566700, rate: 0.15 },
        { min: 566700,  max: Infinity, rate: 0.20 }
      ],
      mfs: [
        { min: 0,       max: 48350,  rate: 0.00 },
        { min: 48350,   max: 300000, rate: 0.15 },
        { min: 300000,  max: Infinity, rate: 0.20 }
      ]
    },
    limits: {
      k401: { under50: 23500, over50: 31000 },
      ira:  { under50: 7000,  over50: 8000  },
      sep:  { max: 70000, pct: 0.25 },
      hsa:  { self: 4300, family: 8550 },
      fsa:  { healthcare: 3300, dependentCare: 5000 },
      studentLoanInterest: 2500,
      saltCap: 10000,
      childTaxCredit: 2000,
      otherDependentCredit: 500,
      childCareExpenseCap1: 3000,
      childCareExpenseCap2: 6000,
      childCareCreditPct: 0.20,
      aoCredit: 2500,
      llCredit: 2000,
      educatorExpenses: 300,
      adoptionCreditMax: 17280,
      capitalLossLimit: 3000,
      energyCreditPct: 0.30
    }
  },
  // 2026 — Official IRS figures per OBBB (IR 2025-103, Public Law 119-21)
  2026: {
    brackets: {
      single: [
        { min: 0,       max: 12400,  rate: 0.10 },
        { min: 12400,   max: 50400,  rate: 0.12 },
        { min: 50400,   max: 105700, rate: 0.22 },
        { min: 105700,  max: 201775, rate: 0.24 },
        { min: 201775,  max: 256225, rate: 0.32 },
        { min: 256225,  max: 640600, rate: 0.35 },
        { min: 640600,  max: Infinity, rate: 0.37 }
      ],
      mfj: [
        { min: 0,       max: 24800,  rate: 0.10 },
        { min: 24800,   max: 100800, rate: 0.12 },
        { min: 100800,  max: 211400, rate: 0.22 },
        { min: 211400,  max: 403550, rate: 0.24 },
        { min: 403550,  max: 512450, rate: 0.32 },
        { min: 512450,  max: 768700, rate: 0.35 },
        { min: 768700,  max: Infinity, rate: 0.37 }
      ],
      mfs: [
        { min: 0,       max: 12400,  rate: 0.10 },
        { min: 12400,   max: 50400,  rate: 0.12 },
        { min: 50400,   max: 105700, rate: 0.22 },
        { min: 105700,  max: 201775, rate: 0.24 },
        { min: 201775,  max: 256225, rate: 0.32 },
        { min: 256225,  max: 384350, rate: 0.35 },
        { min: 384350,  max: Infinity, rate: 0.37 }
      ],
      hoh: [
        { min: 0,       max: 17700,  rate: 0.10 },
        { min: 17700,   max: 67300,  rate: 0.12 },
        { min: 67300,   max: 107550, rate: 0.22 },
        { min: 107550,  max: 201775, rate: 0.24 },
        { min: 201775,  max: 256225, rate: 0.32 },
        { min: 256225,  max: 640600, rate: 0.35 },
        { min: 640600,  max: Infinity, rate: 0.37 }
      ]
    },
    // OBBB official 2026 standard deductions (IRS IR 2025-103)
    standardDeduction: {
      single: 16100,
      mfj:    32200,
      mfs:    16100,
      hoh:    24150
    },
    ltcgBrackets: {
      single: [
        { min: 0,       max: 49550,  rate: 0.00 },
        { min: 49550,   max: 547050, rate: 0.15 },
        { min: 547050,  max: Infinity, rate: 0.20 }
      ],
      mfj: [
        { min: 0,       max: 99100,  rate: 0.00 },
        { min: 99100,   max: 615050, rate: 0.15 },
        { min: 615050,  max: Infinity, rate: 0.20 }
      ],
      hoh: [
        { min: 0,       max: 66350,  rate: 0.00 },
        { min: 66350,   max: 581050, rate: 0.15 },
        { min: 581050,  max: Infinity, rate: 0.20 }
      ],
      mfs: [
        { min: 0,       max: 49550,  rate: 0.00 },
        { min: 49550,   max: 307525, rate: 0.15 },
        { min: 307525,  max: Infinity, rate: 0.20 }
      ]
    },
    limits: {
      k401: { under50: 24000, over50: 31500 },
      ira:  { under50: 7500,  over50: 8500  },
      sep:  { max: 71000, pct: 0.25 },
      hsa:  { self: 4400, family: 8750 },
      fsa:  { healthcare: 3350, dependentCare: 5000 },
      studentLoanInterest: 2500,
      saltCap: 10000,
      childTaxCredit: 2000,
      otherDependentCredit: 500,
      childCareExpenseCap1: 3000,
      childCareExpenseCap2: 6000,
      childCareCreditPct: 0.20,
      aoCredit: 2500,
      llCredit: 2000,
      educatorExpenses: 300,
      adoptionCreditMax: 17670,
      capitalLossLimit: 3000,
      energyCreditPct: 0.30
    }
  }
};

/* ---- EARNED INCOME TAX CREDIT (EITC) DATA ---- */
// Source: IRS Rev. Proc. 2023-34 (2024), Rev. Proc. 2024-40 (2025), estimated 2026
const EITC_DATA = {
  2024: {
    investmentLimit: 11600,
    // children[0]=no children, [1]=1 child, [2]=2 children, [3]=3+ children
    children: [
      { max: 632,  earnedIncomeAmt: 8260,  phaseoutSingle: 9524,  phaseoutMFJ: 17024, limitSingle: 18591, limitMFJ: 25511 },
      { max: 4213, earnedIncomeAmt: 12220, phaseoutSingle: 21560, phaseoutMFJ: 29640, limitSingle: 49084, limitMFJ: 56004 },
      { max: 6960, earnedIncomeAmt: 17400, phaseoutSingle: 21560, phaseoutMFJ: 29640, limitSingle: 55768, limitMFJ: 62688 },
      { max: 7830, earnedIncomeAmt: 17400, phaseoutSingle: 21560, phaseoutMFJ: 29640, limitSingle: 59899, limitMFJ: 66819 }
    ]
  },
  2025: {
    investmentLimit: 11950,
    children: [
      { max: 649,  earnedIncomeAmt: 8490,  phaseoutSingle: 10820, phaseoutMFJ: 18320, limitSingle: 19104, limitMFJ: 26214 },
      { max: 4328, earnedIncomeAmt: 12570, phaseoutSingle: 23511, phaseoutMFJ: 31611, limitSingle: 50434, limitMFJ: 57554 },
      { max: 7152, earnedIncomeAmt: 17920, phaseoutSingle: 23511, phaseoutMFJ: 31611, limitSingle: 57310, limitMFJ: 64430 },
      { max: 8046, earnedIncomeAmt: 17920, phaseoutSingle: 23511, phaseoutMFJ: 31611, limitSingle: 61555, limitMFJ: 68675 }
    ]
  },
  2026: {
    investmentLimit: 12300,
    children: [
      { max: 669,  earnedIncomeAmt: 8745,  phaseoutSingle: 11145, phaseoutMFJ: 18870, limitSingle: 19677, limitMFJ: 27000  },
      { max: 4458, earnedIncomeAmt: 12947, phaseoutSingle: 24216, phaseoutMFJ: 32559, limitSingle: 51947, limitMFJ: 59281  },
      { max: 7367, earnedIncomeAmt: 18458, phaseoutSingle: 24216, phaseoutMFJ: 32559, limitSingle: 59029, limitMFJ: 66363  },
      { max: 8287, earnedIncomeAmt: 18458, phaseoutSingle: 24216, phaseoutMFJ: 32559, limitSingle: 63402, limitMFJ: 70735  }
    ]
  }
};

/* ---- SAVER'S CREDIT (Form 8880) DATA ---- */
// Thresholds: [50% rate cutoff, 20% rate cutoff, 10% rate cutoff]
// Source: IRS Rev. Proc. 2023-34 (2024), Rev. Proc. 2024-40 (2025), estimated 2026
const SAVERS_CREDIT_DATA = {
  2024: { single: [23000, 25000, 38250], hoh: [34500, 37500, 57375], mfj: [46000, 50000, 76500] },
  2025: { single: [23750, 25750, 39500], hoh: [35625, 38625, 59250], mfj: [47500, 51500, 79000] },
  2026: { single: [24450, 26500, 40700], hoh: [36700, 39750, 61050], mfj: [48900, 53000, 81400] }
};

/* ---- UTILITY ---- */
const fmt = (n) => '$' + Math.round(Math.abs(n)).toLocaleString();
const fmtPct = (n) => (n * 100).toFixed(1) + '%';
const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);
const n = (id) => parseFloat(document.getElementById(id)?.value) || 0;

/* ---- OBBB PHASE-OUT CALCULATOR ---- */
function obbbPhaseout(deduction, agi, filingStatus, phaseoutStartSingle, phaseoutStartJoint) {
  const phaseoutStart = (filingStatus === 'mfj') ? phaseoutStartJoint : phaseoutStartSingle;
  const phaseoutEnd   = phaseoutStart + 75000;
  if (agi <= phaseoutStart) return deduction;
  if (agi >= phaseoutEnd)   return 0;
  return deduction * (1 - (agi - phaseoutStart) / 75000);
}

/* Show/hide senior banner based on age input */
function updateSeniorBanner() {
  const age = parseFloat(document.getElementById('taxpayerAge')?.value) || 0;
  const spouseAge = parseFloat(document.getElementById('spouseAge')?.value) || 0;
  const banner = document.getElementById('senior-banner');
  if (banner) banner.style.display = (age >= 65 || spouseAge >= 65) ? '' : 'none';
}
const radio = (name) => document.querySelector(`input[name="${name}"]:checked`)?.value || '';

/* ---- STEP NAVIGATION ---- */
let currentStep = 1;
let highestStep  = 1;   // furthest step ever reached — keeps tabs green on back-navigation
const totalSteps = 7;

function goToStep(step) {
  document.getElementById(`section-${currentStep}`)?.classList.remove('active-section');
  if (step > highestStep) highestStep = step;

  document.querySelectorAll('.step').forEach((el, i) => {
    const s = i + 1;
    el.classList.remove('active', 'completed');
    // Mark as completed if it's before the destination OR already visited but not the current destination
    if (s < step || (s <= highestStep && s !== step)) el.classList.add('completed');
    if (s === step) el.classList.add('active');
  });

  currentStep = step;
  const next = document.getElementById(`section-${step}`);
  if (next) {
    next.classList.add('active-section');
    next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function editForm() {
  highestStep = 1;
  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('form-section').style.display = '';
  goToStep(1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- STEP TAB NAVIGATION ---- */
document.querySelectorAll('.step').forEach(stepEl => {
  stepEl.addEventListener('click', () => {
    const target = parseInt(stepEl.dataset.step);
    if (target && target !== currentStep) goToStep(target);
  });
});

/* ---- RADIO CARD SELECTION ---- */
document.querySelectorAll('.radio-card').forEach(card => {
  card.addEventListener('click', () => {
    const name = card.querySelector('input')?.name;
    if (name) {
      document.querySelectorAll(`.radio-card input[name="${name}"]`).forEach(inp => {
        inp.closest('.radio-card')?.classList.remove('selected');
      });
      card.classList.add('selected');
      card.querySelector('input').checked = true;
    }
  });
});

/* ---- TAX CALCULATION FUNCTIONS ---- */

function calcTax(taxableIncome, brackets) {
  let tax = 0;
  for (const b of brackets) {
    if (taxableIncome <= b.min) break;
    const taxableInBracket = Math.min(taxableIncome, b.max) - b.min;
    tax += taxableInBracket * b.rate;
  }
  return Math.max(0, tax);
}

function getMarginalRate(taxableIncome, brackets) {
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (taxableIncome > brackets[i].min) return brackets[i].rate;
  }
  return brackets[0].rate;
}

function calcSETax(netSEIncome) {
  if (netSEIncome <= 0) return { seTax: 0, deductible: 0 };
  const seTax = netSEIncome * 0.9235 * 0.153;
  return { seTax, deductible: seTax / 2 };
}

function calcStudentLoanDeduction(studentLoanInterest, agi, filingStatus, lim) {
  const maxDeduct = Math.min(studentLoanInterest, lim.studentLoanInterest);
  const phaseoutStart  = filingStatus === 'mfj' ? 165000 : 80000;
  const phaseoutEnd    = filingStatus === 'mfj' ? 195000 : 95000;
  if (agi >= phaseoutEnd) return 0;
  if (agi <= phaseoutStart) return maxDeduct;
  const phaseoutRatio = (agi - phaseoutStart) / (phaseoutEnd - phaseoutStart);
  return Math.max(0, maxDeduct * (1 - phaseoutRatio));
}

function calcChildTaxCredit(numChildren, agi, filingStatus, lim) {
  const gross = numChildren * lim.childTaxCredit;
  const phaseoutStart = filingStatus === 'mfj' ? 400000 : 200000;
  if (agi <= phaseoutStart) return gross;
  const reduction = Math.ceil((agi - phaseoutStart) / 1000) * 50;
  return Math.max(0, gross - reduction);
}

function calcChildCareCredit(childcareExpenses, numChildrenUnder13, dependentCareFSA, lim) {
  if (numChildrenUnder13 === 0) return 0;
  const cap = numChildrenUnder13 >= 2 ? lim.childCareExpenseCap2 : lim.childCareExpenseCap1;
  const fsaOffset = Math.min(dependentCareFSA, cap);
  const eligibleExpenses = Math.max(0, Math.min(childcareExpenses, cap) - fsaOffset);
  return eligibleExpenses * lim.childCareCreditPct;
}

function calcAOCredit(tuitionPaid, numCollegeKids, lim) {
  if (numCollegeKids === 0) return 0;
  const perStudentExpenses = Math.min(tuitionPaid / Math.max(numCollegeKids, 1), 4000);
  const creditPerStudent = Math.min(perStudentExpenses, 2000) + Math.min(Math.max(perStudentExpenses - 2000, 0), 2000) * 0.25;
  return Math.min(creditPerStudent * numCollegeKids, lim.aoCredit * numCollegeKids);
}

function calcHomeOfficeDeduction(homeOfficeSqft, totalSqft, selfEmploymentNetIncome) {
  if (homeOfficeSqft <= 0 || totalSqft <= 0 || selfEmploymentNetIncome <= 0) return 0;
  const simplifiedMethod = homeOfficeSqft * 5;
  return Math.min(simplifiedMethod, selfEmploymentNetIncome);
}

/* ---- EARNED INCOME TAX CREDIT (EITC / Form EIC) ---- */
// MFS filers and those with investment income above the limit are ineligible.
// Phase-in: credit grows with earned income up to earnedIncomeAmt.
// Phase-out: credit shrinks above the threshold based on higher of AGI or earned income.
function calcEITC(earnedIncome, agi, filingStatus, numChildren, investmentIncome, taxYear) {
  if (filingStatus === 'mfs') return 0;
  if (earnedIncome <= 0) return 0;
  const data = EITC_DATA[taxYear] || EITC_DATA[2025];
  if (investmentIncome > data.investmentLimit) return 0;

  const childIdx = Math.min(numChildren, 3);
  const d = data.children[childIdx];
  const isMFJ = filingStatus === 'mfj';
  const phaseoutStart = isMFJ ? d.phaseoutMFJ   : d.phaseoutSingle;
  const incomeLimit   = isMFJ ? d.limitMFJ       : d.limitSingle;

  // Phase-out uses the higher of AGI or earned income
  const limitIncome = Math.max(earnedIncome, agi);
  if (limitIncome >= incomeLimit) return 0;

  // Phase-in: credit grows proportionally up to max
  const phaseInRate = d.max / d.earnedIncomeAmt;
  let credit = Math.min(earnedIncome * phaseInRate, d.max);

  // Phase-out: credit shrinks linearly to $0 at income limit
  if (limitIncome > phaseoutStart) {
    const phaseoutRange = incomeLimit - phaseoutStart;
    const phaseoutRate  = d.max / phaseoutRange;
    credit = Math.max(0, credit - (limitIncome - phaseoutStart) * phaseoutRate);
  }

  return Math.round(credit);
}

/* ---- SAVER'S CREDIT (Retirement Savings Contributions Credit, Form 8880) ---- */
// 50% / 20% / 10% of up to $2,000 per person ($4,000 MFJ) in retirement contributions.
// MFS filers cannot claim. Students and dependents are ineligible (not checked here).
function calcSaversCredit(retirementContribs, agi, filingStatus, taxYear) {
  if (filingStatus === 'mfs') return 0;
  if (retirementContribs <= 0) return 0;
  const data = SAVERS_CREDIT_DATA[taxYear] || SAVERS_CREDIT_DATA[2025];
  const thresholds = filingStatus === 'mfj' ? data.mfj
                   : filingStatus === 'hoh' ? data.hoh
                   : data.single;

  let creditRate = 0;
  if      (agi <= thresholds[0]) creditRate = 0.50;
  else if (agi <= thresholds[1]) creditRate = 0.20;
  else if (agi <= thresholds[2]) creditRate = 0.10;
  if (creditRate === 0) return 0;

  // Max eligible contribution: $2,000 per person; $4,000 for MFJ (both spouses)
  const maxContrib = filingStatus === 'mfj' ? 4000 : 2000;
  return Math.round(Math.min(retirementContribs, maxContrib) * creditRate);
}

/* ---- MAIN CALCULATION ---- */
function calculateTaxes(opts) {
  const filingStatus  = radio('filingStatus') || 'single';
  const taxYear       = parseInt(document.getElementById('taxYear').value) || 2024;
  const taxpayerAge   = n('taxpayerAge');
  const spouseAge     = n('spouseAge');
  const data          = TAX_DATA[taxYear];
  const lim           = data.limits;
  const brackets      = data.brackets[filingStatus];
  const ltcgBrackets  = data.ltcgBrackets[filingStatus];

  // --- INCOME ---
  const w2Income              = n('w2Income');
  const spouseW2              = n('spouseW2');
  const seGross               = n('selfEmploymentIncome');
  const seExpenses            = n('selfEmploymentExpenses');
  const rentalIncome          = n('rentalIncome');
  const rentalExpenses        = n('rentalExpenses');
  const ltcg                  = n('longTermCapGains');
  const stcg                  = n('shortTermCapGains');
  const dividends             = n('dividends');
  const otherIncome           = n('otherIncome');
  const federalWithheld       = n('federalWithheld');

  const seNet = Math.max(0, seGross - seExpenses);
  const rentalNet = rentalIncome - rentalExpenses;
  const { seTax, deductible: seDeduction } = calcSETax(seNet);
  const investmentLossLimit = Math.min(n('investmentLosses'), lim.capitalLossLimit);

  // --- DEPENDENTS ---
  const numChildrenUnder17  = n('numChildrenUnder17');
  const numChildrenCollege  = n('numChildrenCollege');
  const numOtherDependents  = n('numOtherDependents');
  const childcareExpenses   = n('childcareExpenses');
  const dependentCareFSA    = n('dependentCarefsaContrib');
  const tuitionPaid         = n('tuitionPaid');

  // --- HOME ---
  const mortgageInterest    = n('mortgageInterest');
  const propertyTax         = n('propertyTax');
  const stateTaxPaid        = n('stateTaxPaid');
  const homeEquityInterest  = n('homeEquityInterest');
  const homeOfficeSqft      = n('homeOfficesqft');
  const totalHomeSqft       = n('totalHomeSqft');
  const saltDeduction       = Math.min(propertyTax + stateTaxPaid, lim.saltCap);

  // --- RETIREMENT ---
  const k401Contrib         = n('k401Contrib');
  const spouseK401Contrib   = n('spouseK401Contrib');
  const traditionalIRA      = n('traditionalIRAContrib');
  const sepIRA              = n('sepIRAContrib');

  // --- HEALTH ---
  const hsaContrib          = n('hsaContrib');
  const fsaContrib          = n('fsaContrib');
  const selfEmpHealthIns    = n('selfEmployedHealthIns');
  const studentLoanInterest = n('studentLoanInterest');
  const educatorExpenses    = Math.min(n('educatorExpenses'), lim.educatorExpenses);

  // --- OTHER ---
  const charitableCash      = n('charitableCash');
  const charitableNonCash   = n('charitableNonCash');
  const alimonyPaid         = n('alimonyPaid');
  const energyImprovement   = n('energyCredits');
  const evPurchased         = radio('evPurchase') === 'yes';
  const adoptionExpenses    = n('adoptionExpenses');

  // --- OBBB NEW DEDUCTIONS (2025–2028) ---
  const tipIncome           = n('tipIncome');
  const overtimePay         = n('overtimePay');
  const autoLoanInterest    = n('autoLoanInterest');

  // --- GROSS INCOME ---
  const ordinaryIncome = w2Income + spouseW2 + seNet + stcg + Math.max(0, rentalNet) + otherIncome - investmentLossLimit;

  // --- ABOVE THE LINE DEDUCTIONS (reduce AGI) ---
  const homeOfficeDeduction = calcHomeOfficeDeduction(homeOfficeSqft, totalHomeSqft, seNet);
  const aboveLineDeductions = (
    k401Contrib +
    spouseK401Contrib +
    (filingStatus === 'mfj' || traditionalIRA > 0 ? traditionalIRA : 0) +
    sepIRA +
    seDeduction +
    selfEmpHealthIns +
    hsaContrib +
    educatorExpenses +
    alimonyPaid +
    homeOfficeDeduction +
    dependentCareFSA
  );

  const agi = Math.max(0, ordinaryIncome + ltcg + dividends - aboveLineDeductions);
  const agiNoLTCG = Math.max(0, ordinaryIncome - aboveLineDeductions);

  // --- STUDENT LOAN (depends on AGI) ---
  const studentLoanDeduct = calcStudentLoanDeduction(studentLoanInterest, agi, filingStatus, lim);

  // --- OBBB DEDUCTIONS (Schedule 1-A, 2025–2028 only, phase out with MAGI) ---
  const obbbApplies = taxYear >= 2025 && taxYear <= 2028;

  // Tips deduction — max $25,000, phase-out $150K single / $300K joint
  const rawTipDeduction = obbbApplies ? Math.min(tipIncome, 25000) : 0;
  const tipDeduction = obbbApplies ? obbbPhaseout(rawTipDeduction, agi, filingStatus, 150000, 300000) : 0;

  // Overtime deduction — max $12,500 single / $25,000 joint, phase-out $150K/$300K
  const overtimeMax = (filingStatus === 'mfj') ? 25000 : 12500;
  const rawOvertimeDeduction = obbbApplies ? Math.min(overtimePay, overtimeMax) : 0;
  const overtimeDeduction = obbbApplies ? obbbPhaseout(rawOvertimeDeduction, agi, filingStatus, 150000, 300000) : 0;

  // Auto loan interest deduction — max $10,000, phase-out $100K single / $200K joint
  const rawAutoDeduction = obbbApplies ? Math.min(autoLoanInterest, 10000) : 0;
  const autoLoanDeduction = obbbApplies ? obbbPhaseout(rawAutoDeduction, agi, filingStatus, 100000, 200000) : 0;

  // Senior bonus deduction — $6,000/person age 65+, phase-out $75K single / $150K joint
  let seniorBonusGross = 0;
  if (obbbApplies) {
    if (taxpayerAge >= 65) seniorBonusGross += 6000;
    if (spouseAge >= 65 && (filingStatus === 'mfj')) seniorBonusGross += 6000;
  }
  const seniorDeduction = obbbApplies ? obbbPhaseout(seniorBonusGross, agi, filingStatus, 75000, 150000) : 0;

  const totalOBBBDeductions = tipDeduction + overtimeDeduction + autoLoanDeduction + seniorDeduction;

  // --- ITEMIZED DEDUCTIONS ---
  const medicalThreshold  = agi * 0.075;
  const medicalDeductible = Math.max(0, n('medicalExpenses') - medicalThreshold);
  const itemizedTotal = (
    saltDeduction +
    mortgageInterest +
    homeEquityInterest +
    charitableCash +
    charitableNonCash +
    medicalDeductible
  );

  const standardDeduction = data.standardDeduction[filingStatus];
  const useItemized       = itemizedTotal > standardDeduction;
  const chosenDeduction   = Math.max(standardDeduction, itemizedTotal);

  // --- TAXABLE INCOME ---
  // OBBB deductions reduce taxable income after the standard/itemized deduction
  const taxableIncomeFull = Math.max(0, agi - chosenDeduction - studentLoanDeduct - totalOBBBDeductions + (ltcg + dividends));
  const taxableOrdinary   = Math.max(0, agiNoLTCG - chosenDeduction - studentLoanDeduct - totalOBBBDeductions);
  const taxableLTCG       = ltcg + dividends;

  // --- ORDINARY TAX ---
  const ordinaryTax = calcTax(taxableOrdinary, brackets);

  // --- LTCG TAX ---
  let ltcgTax = 0;
  if (taxableLTCG > 0) {
    for (const b of ltcgBrackets) {
      const base = taxableOrdinary + (taxableLTCG - Math.max(0, b.max - taxableOrdinary));
      const inBracket = Math.max(0, Math.min(taxableLTCG, b.max - b.min) - Math.max(0, b.min - taxableOrdinary));
      ltcgTax += Math.max(0, inBracket) * b.rate;
    }
    // Simplified LTCG calc
    ltcgTax = 0;
    let ltcgIncome = taxableOrdinary;
    for (const b of ltcgBrackets) {
      if (ltcgIncome >= b.max) continue;
      const roomInBracket = b.max - Math.max(ltcgIncome, b.min);
      const taxableHere = Math.min(taxableLTCG, roomInBracket);
      ltcgTax += taxableHere * b.rate;
      ltcgIncome += taxableHere;
      if (ltcgIncome >= ltcgIncome + taxableHere) break;
    }
  }

  // --- CREDITS ---
  // Earned income = W-2 + self-employment net (used for EITC and Saver's Credit eligibility)
  const earnedIncome = w2Income + spouseW2 + seNet;
  // Investment income = passive income not eligible for EITC (LTCG + dividends + rental net if positive)
  const investmentIncome = ltcg + dividends + Math.max(0, rentalNet);

  const childTaxCredit      = calcChildTaxCredit(numChildrenUnder17, agi, filingStatus, lim);
  const otherDepCredit      = numOtherDependents * lim.otherDependentCredit;
  const childCareCredit     = calcChildCareCredit(childcareExpenses, numChildrenUnder17, dependentCareFSA, lim);
  const aoCredit            = calcAOCredit(tuitionPaid, numChildrenCollege, lim);
  const energyCredit        = energyImprovement * lim.energyCreditPct;
  const evCredit            = evPurchased ? 7500 : 0;
  const adoptionCredit      = Math.min(adoptionExpenses, lim.adoptionCreditMax);

  // EITC — fully calculated (was missing before)
  const eitcCredit          = calcEITC(earnedIncome, agi, filingStatus, numChildrenUnder17, investmentIncome, taxYear);

  // Saver's Credit (Form 8880) — retirement contributions credit
  const totalRetirementContribs = k401Contrib + spouseK401Contrib + traditionalIRA + sepIRA;
  const saversCredit        = calcSaversCredit(totalRetirementContribs, agi, filingStatus, taxYear);

  const totalCredits = childTaxCredit + otherDepCredit + childCareCredit + aoCredit + energyCredit + evCredit + adoptionCredit + eitcCredit + saversCredit;

  // --- TOTAL TAX ---
  const grossTax    = ordinaryTax + ltcgTax + seTax;
  const totalTax    = Math.max(0, grossTax - totalCredits);
  const netTaxDue   = totalTax - federalWithheld;
  const marginalRate = getMarginalRate(taxableOrdinary, brackets);
  const effectiveRate = agi > 0 ? totalTax / agi : 0;

  window.__lastTaxCompute = {
    agi, totalTax, netTaxDue, marginalRate, effectiveRate, taxYear, filingStatus,
    w2Income, spouseW2, k401Contrib, spouseK401Contrib, traditionalIRA, sepIRA, hsaContrib,
    childcareExpenses, tuitionPaid, numChildrenUnder17, numChildrenCollege,
    mortgageInterest, propertyTax, stateTaxPaid, charitableCash, charitableNonCash,
    dividends, ltcg, stcg, tipIncome, overtimePay, autoLoanInterest,
    studentLoanInterest, selfEmploymentIncome: seGross, seNet, rentalNet,
    federalWithheld, childTaxCredit, totalCredits, grossTax, ordinaryTax, seTax,
    totalOBBBDeductions, useItemized, standardDeduction, itemizedTotal
  };

  if (opts && opts.previewOnly) {
    updateLiveYoYBar();
    return;
  }

  // =====================================================
  //  RENDER RESULTS
  // =====================================================

  document.getElementById('form-section').style.display = 'none';
  const resultsEl = document.getElementById('results-section');
  resultsEl.classList.remove('hidden');
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Update results title to reflect selected tax year
  const titleEl = document.getElementById('results-title');
  if (titleEl) {
    const yearLabel = taxYear === 2026 ? `${taxYear} Tax Savings Plan (Estimated)` : `${taxYear} Tax Savings Analysis`;
    titleEl.textContent = `Your ${yearLabel}`;
  }

  // Render prior year comparison if data was loaded
  renderPriorYearComparison(agi, totalTax, netTaxDue, marginalRate, taxYear);

  // --- SUMMARY CARDS ---
  document.getElementById('summary-cards').innerHTML = `
    <div class="summary-card blue">
      <div class="card-val">${fmt(agi)}</div>
      <div class="card-label">Adjusted Gross Income (AGI)</div>
    </div>
    <div class="summary-card ${totalTax > 0 ? 'red' : 'green'}">
      <div class="card-val">${fmt(totalTax)}</div>
      <div class="card-label">Estimated Federal Tax</div>
    </div>
    <div class="summary-card ${netTaxDue > 0 ? 'amber' : 'green'}">
      <div class="card-val">${netTaxDue > 0 ? fmt(netTaxDue) : fmt(-netTaxDue)}</div>
      <div class="card-label">${netTaxDue > 0 ? 'Amount You Owe' : 'Estimated Refund'}</div>
    </div>
    <div class="summary-card amber">
      <div class="card-val">${fmtPct(marginalRate)}</div>
      <div class="card-label">Marginal Tax Rate (${fmtPct(effectiveRate)} effective)</div>
    </div>
  `;

  // --- DEDUCTION COMPARISON ---
  const deductionHTML = `
    <div class="deduction-comparison">
      <div class="deduction-option ${!useItemized ? 'winner' : ''}">
        <div class="type-label">Standard Deduction ${!useItemized ? '✓ Best for You' : ''}</div>
        <div class="amount">${fmt(standardDeduction)}</div>
        ${!useItemized ? `<span class="savings-badge">Saves more — use this</span>` : ''}
        <div style="margin-top:12px">
          <div class="deduction-line"><span>Filing Status: ${filingStatus.toUpperCase()}</span><strong>${fmt(standardDeduction)}</strong></div>
        </div>
      </div>
      <div class="deduction-option ${useItemized ? 'winner' : ''}">
        <div class="type-label">Itemized Deduction ${useItemized ? '✓ Best for You' : ''}</div>
        <div class="amount">${fmt(itemizedTotal)}</div>
        ${useItemized ? `<span class="savings-badge">Saves ${fmt(itemizedTotal - standardDeduction)} more</span>` : ''}
        <div style="margin-top:12px">
          ${mortgageInterest > 0 ? `<div class="deduction-line"><span>Mortgage Interest</span><strong>${fmt(mortgageInterest)}</strong></div>` : ''}
          ${saltDeduction > 0 ? `<div class="deduction-line"><span>State &amp; Local Taxes (SALT)</span><strong>${fmt(saltDeduction)}</strong></div>` : ''}
          ${charitableCash + charitableNonCash > 0 ? `<div class="deduction-line"><span>Charitable Contributions</span><strong>${fmt(charitableCash + charitableNonCash)}</strong></div>` : ''}
          ${medicalDeductible > 0 ? `<div class="deduction-line"><span>Medical Expenses</span><strong>${fmt(medicalDeductible)}</strong></div>` : ''}
          ${homeEquityInterest > 0 ? `<div class="deduction-line"><span>Home Equity Interest</span><strong>${fmt(homeEquityInterest)}</strong></div>` : ''}
        </div>
      </div>
    </div>
    ${!useItemized && itemizedTotal > 0 ? `
      <div style="margin-top:14px;padding:12px 16px;background:#fef3c7;border-radius:8px;font-size:0.82rem;color:#92400e;">
        💡 Your itemized deductions (${fmt(itemizedTotal)}) are less than the standard deduction. You're already taking the better option automatically.
      </div>
    ` : ''}
    ${useItemized && itemizedTotal < standardDeduction * 1.1 ? `
      <div style="margin-top:14px;padding:12px 16px;background:#eff6ff;border-radius:8px;font-size:0.82rem;color:#1d4ed8;">
        💡 You are close to the standard deduction threshold. Consider "bunching" deductions every other year for maximum savings.
      </div>
    ` : ''}
  `;
  document.getElementById('deduction-comparison').innerHTML = deductionHTML;

  // --- SAVINGS OPPORTUNITIES (what you ARE using) ---
  const savingsItems = [];

  if (k401Contrib + spouseK401Contrib > 0) {
    const taxSaved = (k401Contrib + spouseK401Contrib) * marginalRate;
    savingsItems.push({ icon: '🏦', title: '401(k) / 403(b) Contributions', desc: `${fmt(k401Contrib + spouseK401Contrib)} contributed — reduces your taxable income dollar for dollar`, amount: fmt(taxSaved) + ' saved', type: 'used' });
  }
  if (hsaContrib > 0) {
    const taxSaved = hsaContrib * marginalRate;
    savingsItems.push({ icon: '🏥', title: 'HSA Contributions', desc: `${fmt(hsaContrib)} in triple-tax-advantaged savings`, amount: fmt(taxSaved) + ' saved', type: 'used' });
  }
  if (traditionalIRA > 0) {
    const taxSaved = traditionalIRA * marginalRate;
    savingsItems.push({ icon: '💼', title: 'Traditional IRA Deduction', desc: `${fmt(traditionalIRA)} contributed pre-tax`, amount: fmt(taxSaved) + ' saved', type: 'used' });
  }
  if (sepIRA > 0) {
    const taxSaved = sepIRA * marginalRate;
    savingsItems.push({ icon: '🏢', title: 'SEP-IRA / Solo 401(k)', desc: `${fmt(sepIRA)} self-employed retirement savings`, amount: fmt(taxSaved) + ' saved', type: 'used' });
  }
  if (seDeduction > 0) {
    const taxSaved = seDeduction * marginalRate;
    savingsItems.push({ icon: '💸', title: 'Self-Employment Tax Deduction', desc: `Half of SE tax (${fmt(seDeduction)}) is deductible`, amount: fmt(taxSaved) + ' saved', type: 'used' });
  }
  if (selfEmpHealthIns > 0) {
    const taxSaved = selfEmpHealthIns * marginalRate;
    savingsItems.push({ icon: '🩺', title: 'Self-Employed Health Insurance', desc: `${fmt(selfEmpHealthIns)} in premiums — fully deductible`, amount: fmt(taxSaved) + ' saved', type: 'used' });
  }
  if (homeOfficeDeduction > 0) {
    const taxSaved = homeOfficeDeduction * marginalRate;
    savingsItems.push({ icon: '🏠', title: 'Home Office Deduction', desc: `${fmt(homeOfficeDeduction)} based on ${homeOfficeSqft} sqft`, amount: fmt(taxSaved) + ' saved', type: 'used' });
  }
  if (studentLoanDeduct > 0) {
    const taxSaved = studentLoanDeduct * marginalRate;
    savingsItems.push({ icon: '🎓', title: 'Student Loan Interest', desc: `${fmt(studentLoanDeduct)} deducted above the line`, amount: fmt(taxSaved) + ' saved', type: 'used' });
  }
  if (childTaxCredit > 0) {
    savingsItems.push({ icon: '👶', title: 'Child Tax Credit', desc: `${numChildrenUnder17} child(ren) × up to ${fmt(lim.childTaxCredit)} each`, amount: fmt(childTaxCredit) + ' credit', type: 'used' });
  }
  if (otherDepCredit > 0) {
    savingsItems.push({ icon: '👴', title: 'Other Dependent Credit', desc: `${numOtherDependents} other dependent(s) × $500`, amount: fmt(otherDepCredit) + ' credit', type: 'used' });
  }
  if (childCareCredit > 0) {
    savingsItems.push({ icon: '🧒', title: 'Child &amp; Dependent Care Credit', desc: `20% of qualifying childcare expenses`, amount: fmt(childCareCredit) + ' credit', type: 'used' });
  }
  if (aoCredit > 0) {
    savingsItems.push({ icon: '📚', title: 'American Opportunity Credit', desc: `${numChildrenCollege} student(s) — up to $2,500 per student`, amount: fmt(aoCredit) + ' credit', type: 'used' });
  }
  if (evCredit > 0) {
    savingsItems.push({ icon: '🚗', title: 'Electric Vehicle Tax Credit', desc: `Clean vehicle credit for new EV purchase`, amount: fmt(evCredit) + ' credit', type: 'used' });
  }
  if (energyCredit > 0) {
    savingsItems.push({ icon: '⚡', title: 'Energy Efficient Home Credit', desc: `30% of ${fmt(energyImprovement)} in qualifying improvements`, amount: fmt(energyCredit) + ' credit', type: 'used' });
  }
  if (adoptionCredit > 0) {
    savingsItems.push({ icon: '❤️', title: 'Adoption Tax Credit', desc: `Qualifying adoption expenses credit`, amount: fmt(adoptionCredit) + ' credit', type: 'used' });
  }
  if (useItemized && mortgageInterest > 0) {
    savingsItems.push({ icon: '🏡', title: 'Mortgage Interest Deduction', desc: `${fmt(mortgageInterest)} in interest — itemized`, amount: fmt(mortgageInterest * marginalRate) + ' saved', type: 'used' });
  }
  if (useItemized && saltDeduction > 0) {
    savingsItems.push({ icon: '🏛️', title: 'SALT Deduction', desc: `State &amp; local taxes up to $10,000 cap`, amount: fmt(saltDeduction * marginalRate) + ' saved', type: 'used' });
  }
  if (useItemized && (charitableCash + charitableNonCash) > 0) {
    savingsItems.push({ icon: '❤️', title: 'Charitable Contributions', desc: `${fmt(charitableCash + charitableNonCash)} donated (itemized)`, amount: fmt((charitableCash + charitableNonCash) * marginalRate) + ' saved', type: 'used' });
  }
  if (investmentLossLimit > 0) {
    const rawLoss = n('investmentLosses');
    const carryforward = rawLoss > lim.capitalLossLimit ? rawLoss - lim.capitalLossLimit : 0;
    const carryNote = carryforward > 0 ? ` (${fmt(carryforward)} carries forward to next year automatically)` : '';
    savingsItems.push({ icon: '📉', title: 'Capital Loss Deduction', desc: `${fmt(investmentLossLimit)} of investment losses offset ordinary income (IRS $3,000/yr cap)${carryNote}`, amount: fmt(investmentLossLimit * marginalRate) + ' saved', type: 'used' });
  }
  if (dependentCareFSA > 0) {
    savingsItems.push({ icon: '🏫', title: 'Dependent Care FSA', desc: `${fmt(dependentCareFSA)} pre-tax for childcare`, amount: fmt(dependentCareFSA * marginalRate) + ' saved', type: 'used' });
  }
  if (fsaContrib > 0) {
    savingsItems.push({ icon: '💊', title: 'Healthcare FSA', desc: `${fmt(fsaContrib)} pre-tax for medical expenses`, amount: fmt(fsaContrib * marginalRate) + ' saved', type: 'used' });
  }
  if (seExpenses > 0) {
    savingsItems.push({ icon: '🧾', title: 'Business Expense Deductions', desc: `${fmt(seExpenses)} in self-employment expenses`, amount: fmt(seExpenses * marginalRate) + ' saved', type: 'used' });
  }
  if (eitcCredit > 0) {
    const childLabel = numChildrenUnder17 === 0 ? 'no qualifying children' : `${numChildrenUnder17} qualifying child${numChildrenUnder17 > 1 ? 'ren' : ''}`;
    savingsItems.push({ icon: '💚', title: 'Earned Income Tax Credit (EITC)', desc: `Refundable credit for earned income with ${childLabel}. Up to 40% refundable even if you owe $0 tax.`, amount: fmt(eitcCredit) + ' credit', type: 'used' });
  }
  if (saversCredit > 0) {
    const saversRate = agi <= (SAVERS_CREDIT_DATA[taxYear]?.[filingStatus === 'mfj' ? 'mfj' : filingStatus === 'hoh' ? 'hoh' : 'single']?.[0] ?? 0) ? '50%' : agi <= (SAVERS_CREDIT_DATA[taxYear]?.[filingStatus === 'mfj' ? 'mfj' : filingStatus === 'hoh' ? 'hoh' : 'single']?.[1] ?? 0) ? '20%' : '10%';
    savingsItems.push({ icon: '🌟', title: "Saver's Credit (Form 8880)", desc: `${saversRate} credit on retirement contributions — rewards low/moderate income savers`, amount: fmt(saversCredit) + ' credit', type: 'used' });
  }

  // --- OBBB SAVINGS ITEMS ---
  if (obbbApplies) {
    if (tipDeduction > 0) {
      savingsItems.push({ icon: '🏛️', title: 'OBBB: No Tax on Tips (Schedule 1-A)', desc: `${fmt(tipDeduction)} in qualified tip income deducted. Signed into law July 4, 2025.`, amount: fmt(tipDeduction * marginalRate) + ' saved', type: 'used' });
    }
    if (overtimeDeduction > 0) {
      savingsItems.push({ icon: '⏰', title: 'OBBB: No Tax on Overtime (Schedule 1-A)', desc: `${fmt(overtimeDeduction)} overtime "half-pay" deducted. Max $12,500 single / $25,000 MFJ.`, amount: fmt(overtimeDeduction * marginalRate) + ' saved', type: 'used' });
    }
    if (autoLoanDeduction > 0) {
      savingsItems.push({ icon: '🚗', title: 'OBBB: Car Loan Interest (Schedule 1-A)', desc: `${fmt(autoLoanDeduction)} deducted on US-assembled vehicle loan (max $10,000).`, amount: fmt(autoLoanDeduction * marginalRate) + ' saved', type: 'used' });
    }
    if (seniorDeduction > 0) {
      savingsItems.push({ icon: '👴', title: 'OBBB: Senior Bonus Deduction (Schedule 1-A)', desc: `${fmt(seniorDeduction)} extra deduction for age 65+ taxpayer(s). Valid 2025–2028.`, amount: fmt(seniorDeduction * marginalRate) + ' saved', type: 'used' });
    }
  }

  const savingsContainer = document.getElementById('savings-opportunities');
  if (savingsItems.length > 0) {
    savingsContainer.innerHTML = `<div class="savings-grid">${savingsItems.map(item => `
      <div class="saving-item ${item.type}">
        <div class="icon">${item.icon}</div>
        <div class="info">
          <div class="title">${item.title}</div>
          <div class="desc">${item.desc}</div>
          <span class="amount-badge">${item.amount}</span>
        </div>
      </div>
    `).join('')}</div>`;
  } else {
    savingsContainer.innerHTML = `<p style="color:var(--gray-500);font-size:0.85rem;">No savings identified — fill in more details for a complete picture.</p>`;
  }

  // --- UNTAPPED SAVINGS ---
  const untapped = [];
  const k401Limit = taxpayerAge >= 50 ? lim.k401.over50 : lim.k401.under50;
  const iraLimit  = taxpayerAge >= 50 ? lim.ira.over50  : lim.ira.under50;

  if (k401Contrib < k401Limit && (w2Income + spouseW2) > 0) {
    const room = k401Limit - k401Contrib - spouseK401Contrib;
    if (room > 0) untapped.push({ icon: '🏦', title: `Max Out Your 401(k)`, desc: `You have ${fmt(room)} more room in your 401(k) this year (${taxpayerAge >= 50 ? 'catch-up limit applies' : `${taxYear} limit: ${fmt(k401Limit)}`}). Contributing the max could save you ${fmt(room * marginalRate)} in federal taxes.`, save: fmt(room * marginalRate) + ' potential savings' });
  }
  if (traditionalIRA < iraLimit && agi < 87000) {
    const room = iraLimit - traditionalIRA;
    untapped.push({ icon: '💰', title: `Contribute to Traditional IRA`, desc: `You can contribute up to ${fmt(room)} more to a Traditional IRA (deductible if under income limits). ${taxpayerAge >= 50 ? 'Catch-up contribution limit applies.' : ''} Saves you ${fmt(room * marginalRate)} in taxes.`, save: fmt(room * marginalRate) + ' potential' });
  }
  if (hsaContrib === 0 && seGross === 0) {
    untapped.push({ icon: '🏥', title: `Open an HSA (Triple Tax-Free)`, desc: `If you have a high-deductible health plan (HDHP), an HSA saves you taxes 3 ways: contributions are pre-tax, growth is tax-free, and withdrawals for medical are tax-free. Contribute ${fmt(lim.hsa.self)} (self) or ${fmt(lim.hsa.family)} (family) to save ${fmt(lim.hsa.self * marginalRate)}–${fmt(lim.hsa.family * marginalRate)}.`, save: `${fmt(lim.hsa.self * marginalRate)}–${fmt(lim.hsa.family * marginalRate)} savings` });
  }
  if (dependentCareFSA < lim.fsa.dependentCare && numChildrenUnder17 > 0 && childcareExpenses > 0) {
    const room = lim.fsa.dependentCare - dependentCareFSA;
    untapped.push({ icon: '🏫', title: `Dependent Care FSA Not Maxed`, desc: `You're paying for childcare but haven't maxed your Dependent Care FSA ($5,000 max). The ${fmt(room)} gap could save you ${fmt(room * marginalRate)} pre-tax.`, save: fmt(room * marginalRate) + ' savings' });
  }
  if (seNet > 0 && sepIRA === 0 && k401Contrib < k401Limit) {
    const maxSEP = Math.min(seNet * lim.sep.pct, lim.sep.max);
    untapped.push({ icon: '🏢', title: `Open a SEP-IRA or Solo 401(k)`, desc: `As a self-employed individual, you can shelter up to ${fmt(maxSEP)} in a SEP-IRA or Solo 401(k). This is one of the biggest tax shelters available — saves you ${fmt(maxSEP * marginalRate)}.`, save: fmt(maxSEP * marginalRate) + ' potential savings' });
  }
  if (ltcg > 0 && taxableOrdinary < (ltcgBrackets[0].max || 47025)) {
    untapped.push({ icon: '📈', title: `0% Capital Gains Rate`, desc: `Some of your long-term capital gains may qualify for the 0% rate! Review which assets you could sell this year to harvest gains tax-free while in a lower bracket.`, save: 'Potentially $0 in LTCG tax' });
  }
  if (seNet > 0 && homeOfficeSqft === 0) {
    untapped.push({ icon: '🏠', title: `Claim Home Office Deduction`, desc: `As a self-employed worker, if you have a dedicated workspace at home, you can deduct $5/sqft (up to 300 sqft = $1,500 simplified method) or actual expenses. Enter your home office size.`, save: `${fmt(300 * 5 * marginalRate)} at 300 sqft` });
  }
  if (numChildrenUnder17 > 0 && childcareExpenses === 0) {
    untapped.push({ icon: '🧒', title: `Child &amp; Dependent Care Credit`, desc: `If you paid for childcare (daycare, after-school, summer camp) while you and your spouse worked, you may qualify for the Child &amp; Dependent Care Credit. Enter those expenses to see your savings.`, save: 'Up to $600–$1,200 credit' });
  }
  if (numChildrenCollege > 0 && tuitionPaid === 0) {
    untapped.push({ icon: '📚', title: `American Opportunity Credit`, desc: `You have children in college but entered $0 in tuition. Enter qualified tuition to claim up to $2,500/student per year (first 4 years of college). Up to 40% is refundable!`, save: 'Up to $2,500/student' });
  }
  if (!evPurchased) {
    untapped.push({ icon: '🚗', title: `Electric Vehicle Tax Credit`, desc: `New EVs from qualifying manufacturers can receive up to a $7,500 federal tax credit (Clean Vehicle Credit). Used EVs qualify for up to $4,000. Income limits apply.`, save: 'Up to $7,500 credit' });
  }
  if (energyImprovement === 0) {
    untapped.push({ icon: '☀️', title: `Energy-Efficient Home Improvements`, desc: `Install solar panels, heat pumps, insulation, windows, or doors to claim 30% back as a tax credit (Residential Clean Energy Credit). No cap on solar. Annual cap on other improvements.`, save: '30% of improvement cost' });
  }
  if (investmentLossLimit === 0 && ltcg > 0) {
    untapped.push({ icon: '📉', title: `Tax-Loss Harvesting`, desc: `Do you have any losing investments? Selling them to realize losses can offset your ${fmt(ltcg)} in capital gains dollar for dollar, potentially saving you ${fmt(ltcg * 0.15)}.`, save: `~${fmt(ltcg * 0.15)} potential savings` });
  }
  // EITC — show if eligible but not receiving (e.g., investmentIncome too high, or just unaware)
  const eitcData = EITC_DATA[taxYear] || EITC_DATA[2025];
  const eitcChildIdx = Math.min(numChildrenUnder17, 3);
  const eitcLimit = filingStatus === 'mfj' ? eitcData.children[eitcChildIdx].limitMFJ : eitcData.children[eitcChildIdx].limitSingle;
  if (eitcCredit === 0 && filingStatus !== 'mfs' && agi < eitcLimit && earnedIncome > 0) {
    if (investmentIncome > eitcData.investmentLimit) {
      untapped.push({ icon: '💚', title: `EITC Blocked by Investment Income`, desc: `You'd otherwise qualify for the Earned Income Tax Credit, but investment income above ${fmt(eitcData.investmentLimit)} disqualifies you. Consider tax-loss harvesting or deferring investment income.`, save: 'Potentially ' + fmt(eitcData.children[eitcChildIdx].max) + ' credit' });
    } else if (earnedIncome < eitcData.children[eitcChildIdx].earnedIncomeAmt * 0.5) {
      untapped.push({ icon: '💚', title: `Earned Income Tax Credit (EITC)`, desc: `If you increase earned income (W-2 or self-employment) you may qualify for the EITC — a refundable credit worth up to ${fmt(eitcData.children[eitcChildIdx].max)}. Even with $0 tax owed, a refundable credit pays you directly.`, save: 'Up to ' + fmt(eitcData.children[eitcChildIdx].max) + ' refundable credit' });
    }
  }

  // Saver's Credit — show if they have retirement contributions but didn't qualify (close to threshold)
  const saverThresholds = SAVERS_CREDIT_DATA[taxYear]?.[filingStatus === 'mfj' ? 'mfj' : filingStatus === 'hoh' ? 'hoh' : 'single'];
  if (saversCredit === 0 && saverThresholds && totalRetirementContribs > 0 && agi < saverThresholds[2] * 1.15) {
    const room = saverThresholds[2] - agi;
    if (room > 0 && room < 15000) {
      untapped.push({ icon: '🌟', title: `Lower AGI ${fmt(room)} to Unlock Saver's Credit`, desc: `Your income is just above the Saver's Credit threshold. Contributing an extra ${fmt(room)} to a 401(k) or IRA could reduce your AGI enough to qualify for a 10–50% credit on retirement savings (Form 8880, up to $1,000 per person).`, save: 'Up to $1,000–$2,000 credit' });
    }
  } else if (saversCredit === 0 && saverThresholds && totalRetirementContribs === 0 && agi < saverThresholds[2]) {
    untapped.push({ icon: '🌟', title: `Saver's Credit — Earn a Credit Just for Saving`, desc: `At your income level you qualify for the Saver's Credit (Form 8880) — 10–50% back on retirement contributions to a 401(k), IRA, or SIMPLE plan. Contribute ${fmt(filingStatus === 'mfj' ? 4000 : 2000)} to earn up to ${fmt(filingStatus === 'mfj' ? 2000 : 1000)} in tax credits.`, save: 'Up to ' + fmt(filingStatus === 'mfj' ? 2000 : 1000) + ' credit' });
  }

  // --- OBBB UNTAPPED OPPORTUNITIES ---
  if (obbbApplies) {
    if (tipIncome === 0) {
      untapped.push({ icon: '🏛️', title: `OBBB: Did You Receive Tips? Deduct Up to $25,000`, desc: `The One Big Beautiful Bill (signed July 4, 2025) lets service workers — servers, bartenders, drivers, salon workers, valets and more — deduct up to $25,000 in tip income via Schedule 1-A. Enter your tip income to calculate savings.`, save: 'Up to ' + fmt(25000 * marginalRate) + ' savings' });
    }
    if (overtimePay === 0 && (w2Income + spouseW2) > 50000) {
      untapped.push({ icon: '⏰', title: `OBBB: Did You Work Overtime? Deduct Up to $12,500`, desc: `If you were paid time-and-a-half for overtime in 2025–2028, the extra "half" portion is deductible — up to $12,500 (or $25,000 if married filing jointly) via Schedule 1-A. Enter your overtime amount.`, save: 'Up to ' + fmt(12500 * marginalRate) + ' savings' });
    }
    if (autoLoanInterest === 0) {
      untapped.push({ icon: '🚗', title: `OBBB: New Car Loan? Deduct Up to $10,000 in Interest`, desc: `Purchased a new US-assembled vehicle after Dec 31, 2024? Interest on the loan is now deductible (up to $10,000) via Schedule 1-A — whether you itemize or not. Phases out above $100K MAGI ($200K joint). Include your VIN on the return.`, save: 'Up to ' + fmt(10000 * marginalRate) + ' savings' });
    }
    if (seniorBonusGross === 0 && (taxpayerAge >= 60 || spouseAge >= 60)) {
      const approaching = taxpayerAge >= 60 || spouseAge >= 60;
      if (approaching && (taxpayerAge < 65 && (spouseAge < 65 || !spouseAge))) {
        untapped.push({ icon: '🎂', title: `Turning 65? Senior Bonus Deduction Worth $6,000 Awaits`, desc: `Once you or your spouse turns 65, you qualify for an extra $6,000 deduction per eligible senior ($12,000 if both qualify) — valid 2025–2028 via Schedule 1-A. Plan ahead so you don't miss it.`, save: fmt(6000 * marginalRate) + ' savings at 65' });
      }
    }
    if (seniorBonusGross > 0 && seniorDeduction < seniorBonusGross) {
      untapped.push({ icon: '⚠️', title: `Senior Deduction Partially Phased Out`, desc: `Your income is partially above the $75,000 ($150,000 joint) threshold for the Senior Bonus Deduction. Consider reducing MAGI before year-end via 401(k) or IRA contributions to maximize this deduction.`, save: fmt((seniorBonusGross - seniorDeduction) * marginalRate) + ' recoverable' });
    }
    if (tipIncome > 0 && tipDeduction < rawTipDeduction) {
      untapped.push({ icon: '⚠️', title: `Tip Deduction Partially Phased Out`, desc: `Your income exceeds the $150,000 ($300,000 joint) threshold, reducing your tip deduction. Lower your MAGI via 401(k), HSA, or IRA contributions to recover the full ${fmt(rawTipDeduction)} deduction.`, save: fmt((rawTipDeduction - tipDeduction) * marginalRate) + ' recoverable' });
    }
  }

  const untappedContainer = document.getElementById('untapped-savings');
  if (untapped.length > 0) {
    untappedContainer.innerHTML = `<div class="untapped-list">${untapped.map(item => `
      <div class="untapped-item">
        <div class="u-icon">${item.icon}</div>
        <div class="u-content">
          <div class="u-title">${item.title}</div>
          <div class="u-desc">${item.desc}</div>
        </div>
        <div class="u-save">${item.save}</div>
      </div>
    `).join('')}</div>`;
  } else {
    untappedContainer.innerHTML = `<p style="color:var(--success);font-weight:600;font-size:0.9rem;">🎉 You appear to be utilizing all major savings opportunities for your situation. Great job!</p>`;
  }

  // --- NEXT YEAR ACTION PLAN ---
  const actions = [];
  const nextYear = taxYear + 1;
  const nextData = TAX_DATA[Math.min(nextYear, 2026)];
  const nextLim  = nextData.limits;
  const nextK401 = taxpayerAge >= 49 ? nextLim.k401.over50 : nextLim.k401.under50;
  const nextIRA  = taxpayerAge >= 49 ? nextLim.ira.over50  : nextLim.ira.under50;

  actions.push({ num: 1, icon: '📅', title: `Adjust W-4 Withholding`, desc: `${netTaxDue > 2000 ? 'You owe a significant amount. Increase your W-4 withholding to avoid underpayment penalties in ' + nextYear + '.' : netTaxDue < -2000 ? 'You have a large refund. Consider reducing withholding to get more money in each paycheck instead of giving the IRS an interest-free loan.' : 'Your withholding is roughly on track. Review your W-4 each January.'}`, deadline: 'January ' + nextYear, save: 'Avoid penalties / optimize cash flow' });

  // Quarterly Estimated Tax — shown when self-employed or when total tax > withholding by $1,000+
  const quarterlyTax = Math.max(0, totalTax - federalWithheld);
  const quarterlyPayment = Math.round(quarterlyTax / 4);
  if (seNet > 0 || quarterlyTax > 1000) {
    const selfEmpNote = seNet > 0 ? `Self-employed taxpayers must pay quarterly — no employer withholds for you. ` : '';
    actions.push({ num: 2, icon: '📆', title: `Pay ${nextYear} Quarterly Estimated Taxes`, desc: `${selfEmpNote}Based on this year's liability of ${fmt(totalTax)}, pay approximately ${fmt(quarterlyPayment)} per quarter to avoid the ~7% underpayment penalty. Due dates: April 15, June 16, Sep 15 ${nextYear}, and Jan 15 ${nextYear + 1}. Use IRS Direct Pay or EFTPS (free).`, deadline: `April 15, ${nextYear} (first payment)`, save: `Avoid ~${fmt(quarterlyTax * 0.07)} underpayment penalty` });
  }

  actions.push({ num: 2, icon: '🏦', title: `Set ${nextYear} 401(k) Contribution at Maximum`, desc: `On Jan 1, set your paycheck contribution to reach the ${nextYear} limit of ${fmt(nextK401)} (${taxpayerAge >= 50 ? 'including catch-up' : 'or higher if you turn 50 this year'}). This is the single most powerful tax reduction move you can make.`, deadline: 'January 1, ' + nextYear, save: fmt(nextK401 * marginalRate) + ' federal tax savings' });

  actions.push({ num: 3, icon: '💰', title: `Fund Your IRA Early in the Year`, desc: `Contribute ${fmt(nextIRA)} to a Traditional or Roth IRA by April 15, ${nextYear + 1}. But funding early — January ${nextYear} — maximizes the investment growth period. Traditional = tax now saved, Roth = tax-free later.`, deadline: 'April 15, ' + (nextYear + 1) + ' (or Jan ' + nextYear + ' to invest sooner)', save: fmt(nextIRA * marginalRate) + ' potential deduction' });

  if (hsaContrib < lim.hsa.family) {
    actions.push({ num: 4, icon: '🏥', title: `Switch to HDHP + Max HSA`, desc: `If your employer offers a High-Deductible Health Plan, switching can let you contribute ${fmt(nextLim.hsa.family)} to an HSA — saving taxes on contributions, growth, AND withdrawals. The triple tax advantage is unmatched.`, deadline: 'Open enrollment (typically Nov–Dec)', save: fmt(nextLim.hsa.family * marginalRate) + ' tax savings' });
  }

  if (seNet > 0) {
    actions.push({ num: 5, icon: '🧾', title: `Track All Business Expenses Diligently`, desc: `Keep records of all self-employment expenses: home office, phone (business %), internet, equipment, mileage (67 cents/mile in 2024), professional development, software subscriptions. Use a dedicated business account.`, deadline: 'Ongoing — start January ' + nextYear, save: 'Every $1,000 saves ~' + fmt(1000 * marginalRate) });
  }

  if (!useItemized && mortgageInterest > 0) {
    const room = standardDeduction - itemizedTotal;
    actions.push({ num: 6, icon: '📦', title: `Deduction Bunching Strategy`, desc: `Your itemized deductions (${fmt(itemizedTotal)}) are ${fmt(room)} below the standard deduction. Consider bunching 2 years of charitable donations into a single year — crossing the threshold lets you itemize one year, take the standard deduction the next.`, deadline: 'Plan by October ' + nextYear, save: fmt((itemizedTotal + room) * marginalRate - standardDeduction * marginalRate) + ' potential' });
  }

  if (numChildrenUnder17 > 0) {
    actions.push({ num: 7, icon: '📈', title: `Open 529 College Savings Plans`, desc: `529 accounts grow tax-free and withdrawals for education are tax-free. Some states offer a state tax deduction on contributions. Starting early maximizes compound growth. Superfunding allowed: up to $90,000 ($180,000 married) lump sum.`, deadline: 'Open within ' + nextYear, save: 'State tax deduction + tax-free growth' });
  }

  if (ltcg > 0) {
    actions.push({ num: 8, icon: '⏳', title: `Hold Investments 1+ Year (Long-Term)`, desc: `Assets sold after more than 12 months qualify for long-term capital gains rates (0%, 15%, or 20%) vs. ordinary income rates (up to 37%) for short-term gains. Your marginal rate is ${fmtPct(marginalRate)} — plan your sales carefully.`, deadline: 'Ongoing', save: `Rate difference: ${fmtPct(marginalRate)} vs. 15–20%` });
  }

  // OBBB-specific next-year actions
  if (obbbApplies) {
    actions.push({ num: actions.length + 1, icon: '🏛️', title: `File Schedule 1-A to Claim OBBB Deductions`, desc: `The One Big Beautiful Bill created a brand-new IRS form — Schedule 1-A — required to claim tips, overtime, car loan interest, and senior deductions. Without this form you forfeit these savings. Ensure your tax software includes it.`, deadline: 'Required for ' + nextYear + ' filing', save: 'Up to ' + fmt((25000 + overtimeMax + 10000) * marginalRate) + ' in new deductions' });
    if (autoLoanInterest === 0) {
      actions.push({ num: actions.length + 1, icon: '🚘', title: `Buy a US-Assembled Vehicle — Deduct the Interest`, desc: `If you plan to buy a car, choose a US-assembled model (check VIN at NHTSA) and finance it — the interest on a new personal-use vehicle loan is deductible up to $10,000/year through 2028 (OBBB Section 70203). Buy before Dec 31, ${nextYear}.`, deadline: 'By Dec 31, ' + nextYear, save: 'Up to ' + fmt(10000 * marginalRate) + ' per year' });
    }
  }

  actions.push({ num: actions.length + 1, icon: '👩‍💼', title: `Schedule a CPA Review in Q4 ${nextYear}`, desc: `Meet with a tax professional in October–November ${nextYear} — before the year ends — when you still have time to act on strategies. Year-end tax planning can reduce your bill by thousands. Don't wait until April.`, deadline: 'October/November ' + nextYear, save: 'Proactive savings opportunity' });

  document.getElementById('next-year-plan').innerHTML = `
    <div class="action-items">
      ${actions.map((a, i) => `
        <div class="action-item">
          <div class="a-num">${i + 1}</div>
          <div class="a-content">
            <div class="a-title">${a.icon} ${a.title}</div>
            <div class="a-desc">${a.desc}</div>
            <div class="a-deadline">⏰ ${a.deadline}</div>
          </div>
          <div class="a-saving">${a.save}</div>
        </div>
      `).join('')}
    </div>
  `;

  // --- TAX BRACKET BREAKDOWN ---
  const bracketRows = brackets.map((b, i) => {
    const inBracket = Math.min(Math.max(0, taxableOrdinary - b.min), b.max - b.min);
    const taxInBracket = inBracket * b.rate;
    const isCurrent = taxableOrdinary > b.min && taxableOrdinary <= b.max;
    const barPct = inBracket > 0 ? Math.min(100, (inBracket / (b.max - b.min)) * 100).toFixed(0) : 0;
    const maxDisplay = b.max === Infinity ? '∞' : '$' + b.max.toLocaleString();
    return `
      <tr class="${isCurrent ? 'current-bracket' : ''}">
        <td>${fmtPct(b.rate)}</td>
        <td>$${b.min.toLocaleString()} – ${maxDisplay}</td>
        <td>${fmt(inBracket)}</td>
        <td>${fmt(taxInBracket)}</td>
        <td style="width:120px"><div class="bracket-bar"><div class="bracket-bar-fill" style="width:${barPct}%"></div></div></td>
      </tr>
    `;
  }).join('');

  document.getElementById('tax-bracket-breakdown').innerHTML = `
    <table class="bracket-table">
      <thead>
        <tr>
          <th>Rate</th>
          <th>Bracket Range</th>
          <th>Income in Bracket</th>
          <th>Tax in Bracket</th>
          <th>Fill</th>
        </tr>
      </thead>
      <tbody>${bracketRows}</tbody>
    </table>
    <div style="margin-top:14px;padding:14px;background:var(--gray-50);border-radius:8px;font-size:0.82rem;color:var(--gray-600);">
      <strong>Taxable Ordinary Income:</strong> ${fmt(taxableOrdinary)} &nbsp;|&nbsp;
      <strong>LTCG/Qualified Dividends:</strong> ${fmt(taxableLTCG)} &nbsp;|&nbsp;
      <strong>Self-Employment Tax:</strong> ${fmt(seTax)} &nbsp;|&nbsp;
      <strong>Total Credits Applied:</strong> ${fmt(totalCredits)}
      ${taxYear === 2026 ? '<br><span style="color:var(--success);font-weight:600;">✓ 2026 brackets per official IRS IR 2025-103 (OBBB, Public Law 119-21)</span>' : ''}
    </div>
  `;
}

/* ==========================================================
   PRIOR YEAR RETURN ANALYSIS ENGINE
   ========================================================== */

// Global store for prior year data (set by PDF parser or manual entry)
let priorYearData = null;

/** Merge partial prior-year objects with defaults so all provision logic can rely on keys. */
function normalizePriorYearData(raw) {
  const z = (v) => (typeof v === 'number' && !isNaN(v) ? v : 0);
  return {
    taxYear:               parseInt(raw.taxYear, 10) || 2024,
    filingStatus:          raw.filingStatus || 'single',
    wages:                 z(raw.wages),
    agi:                   z(raw.agi),
    taxableIncome:         z(raw.taxableIncome),
    totalTax:              z(raw.totalTax),
    federalWithheld:       z(raw.federalWithheld),
    refund:                z(raw.refund),
    deductionType:         raw.deductionType || 'standard',
    deductionAmount:       z(raw.deductionAmount),
    standardDeduction:     z(raw.standardDeduction),
    itemizedDeduction:     z(raw.itemizedDeduction),
    studentLoan:           z(raw.studentLoan),
    selfEmployed:          z(raw.selfEmployed),
    iraDeduction:          z(raw.iraDeduction),
    mortgageInterest:      z(raw.mortgageInterest),
    charitableDeduct:      z(raw.charitableDeduct),
    saltDeduct:            z(raw.saltDeduct),
    k401:                  z(raw.k401),
    hsa:                   z(raw.hsa),
    ctc:                   z(raw.ctc),
    numDependents:         z(raw.numDependents),
    numUnder17:            z(raw.numUnder17),
    numCollege:            z(raw.numCollege),
    childcareExpenses:     z(raw.childcareExpenses),
    educationCredit:       z(raw.educationCredit),
    eitc:                  z(raw.eitc),
    dividends:             z(raw.dividends),
    ltcg:                  z(raw.ltcg),
    stcg:                  z(raw.stcg),
    rentalNet:             z(raw.rentalNet),
    medicalSchA:           z(raw.medicalSchA),
    propertyTax:           z(raw.propertyTax),
    stateIncomeTax:        z(raw.stateIncomeTax),
    investmentInterest:    z(raw.investmentInterest),
    educatorExpenses:      z(raw.educatorExpenses),
    sepSimple:             z(raw.sepSimple),
    dependentCareFSA:      z(raw.dependentCareFSA),
    stateRefundTaxable:    z(raw.stateRefundTaxable),
    obbbTips:              z(raw.obbbTips),
    obbbOvertime:          z(raw.obbbOvertime),
    obbbAutoLoan:          z(raw.obbbAutoLoan),
    rothIRA:               z(raw.rothIRA)
  };
}

/* ---- PDF.js SETUP ---- */
function getPDFLib() {
  const lib = window['pdfjs-dist/build/pdf'];
  if (lib) {
    lib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
  return lib;
}

/* ---- DRAG & DROP WIRING ---- */
function initDropZone() {
  const zone = document.getElementById('upload-zone');
  if (!zone) return;
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') handlePDFUpload(file);
  });
}

/* ---- PDF UPLOAD HANDLER ---- */
async function handlePDFUpload(file) {
  if (!file) return;
  const status  = document.getElementById('parse-status');
  const spinner = document.getElementById('parse-spinner');
  const results = document.getElementById('parse-results');
  status.classList.remove('hidden');
  spinner.classList.remove('hidden');
  results.classList.add('hidden');
  results.innerHTML = '';

  try {
    const pdfjsLib = getPDFLib();
    if (!pdfjsLib) throw new Error('PDF library not loaded yet. Please wait a moment and try again.');

    const arrayBuffer = await file.arrayBuffer();
    const pdf  = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let p = 1; p <= Math.min(pdf.numPages, 14); p++) {
      const page    = await pdf.getPage(p);
      const content = await page.getTextContent();
      // Keep items in rough Y-order for number extraction
      const items = content.items.sort((a, b) => {
        const yDiff = Math.round(b.transform[5] / 5) - Math.round(a.transform[5] / 5);
        return yDiff !== 0 ? yDiff : a.transform[4] - b.transform[4];
      });
      fullText += items.map(i => i.str).join(' ') + '\n';
    }

    const extracted = extract1040Fields(fullText);
    spinner.classList.add('hidden');
    showParseResults(extracted, results);
  } catch (err) {
    spinner.classList.add('hidden');
    results.classList.remove('hidden');
    results.innerHTML = `<div class="parse-error">❌ Could not parse PDF: ${err.message}<br>
      <small>Try "Enter Manually" instead, or make sure you're uploading a text-based PDF (not a scanned image).</small></div>`;
  }
}

/* ---- 1040 TEXT EXTRACTOR ---- */
function extract1040Fields(text) {
  // Normalise the text: strip multiple spaces, make it easier to match
  const t = text.replace(/\s+/g, ' ').replace(/,/g, '');

  const grab = (patterns) => {
    for (const pat of patterns) {
      const m = t.match(pat);
      if (m) {
        // Support both negative (losses shown in parentheses or with minus sign) and positive values
        const raw = m[1].replace(/[^0-9.\-]/g, '');
        const val = parseFloat(raw);
        if (!isNaN(val) && val !== 0) return val;
      }
    }
    return 0;
  };

  // Detect tax year from the document
  const yearM = t.match(/(?:Form 1040|U\.S\. Individual).*?(20\d\d)/i)
              || t.match(/Tax Year (20\d\d)/i)
              || t.match(/\b(202[0-6])\b/);
  const taxYear = yearM ? parseInt(yearM[1], 10) : 2024;

  // Filing status detection
  let filingStatus = 'single';
  if (/married filing jointly/i.test(t))           filingStatus = 'mfj';
  else if (/married filing separately/i.test(t))   filingStatus = 'mfs';
  else if (/head of household/i.test(t))           filingStatus = 'hoh';

  // Key line items — try multiple pattern variants across different tax software
  const wages = grab([
    /(?:1a|wages[, ]+salaries)[^0-9]+([\d]+)/i,
    /Total wages.*?([\d]{3,})/i,
    /W-2.*?box 1.*?([\d]{3,})/i
  ]);

  const agi = grab([
    /(?:11|adjusted gross income)[^0-9]+([\d]+)/i,
    /AGI[^0-9]+([\d]{3,})/i,
    /Adjusted Gross[^0-9]+([\d]{3,})/i
  ]);

  const standardDeduction = grab([
    /(?:12a?|standard deduction)[^0-9]+([\d]+)/i,
    /Standard deduction[^0-9]+([\d]{3,})/i
  ]);

  const itemizedDeduction = grab([
    /Schedule A[^0-9]+([\d]{3,})/i,
    /Itemized deductions[^0-9]+([\d]{3,})/i
  ]);

  const taxableIncome = grab([
    /(?:15|taxable income)[^0-9]+([\d]+)/i,
    /Taxable income[^0-9]+([\d]{3,})/i
  ]);

  const totalTax = grab([
    /(?:24|total tax)[^0-9]+([\d]+)/i,
    /Total tax[^0-9]+([\d]{3,})/i
  ]);

  const federalWithheld = grab([
    /(?:25a?|federal income tax withheld)[^0-9]+([\d]+)/i,
    /W-2[^0-9]+box 2[^0-9]+([\d]{3,})/i,
    /Federal tax withheld[^0-9]+([\d]{3,})/i
  ]);

  const refundRaw = grab([/(?:35a?|refund)[^0-9]+([\d]+)/i, /Amount refunded[^0-9]+([\d]{3,})/i]);
  const owedRaw   = grab([/(?:37|amount owed|amount you owe)[^0-9]+([\d]+)/i]);
  const refund    = refundRaw > 0 ? refundRaw : (owedRaw > 0 ? -owedRaw : 0);

  // Schedule 1 items
  const studentLoan = grab([/student loan interest[^0-9]+([\d]{2,})/i, /21[^0-9]+([\d]{2,})/i]);
  const selfEmployed = grab([/self.?employment[^0-9]+([\d]{3,})/i, /schedule c[^0-9]+([\d]{3,})/i]);

  // Retirement (Schedule 1 line 20)
  const iraDeduction = grab([/IRA deduction[^0-9]+([\d]{2,})/i, /(?:line 20|traditional IRA)[^0-9]+([\d]{2,})/i]);

  // Schedule A
  const mortgageInterest = grab([/mortgage interest[^0-9]+([\d]{3,})/i, /home mortgage[^0-9]+([\d]{3,})/i]);
  const charitableDeduct = grab([/charitable[^0-9]+([\d]{2,})/i, /gifts to charity[^0-9]+([\d]{2,})/i]);
  const saltDeduct       = grab([/state.*?local.*?taxes[^0-9]+([\d]{2,})/i, /SALT[^0-9]+([\d]{2,})/i]);

  // W-2 Box 12 — 401k (code D)
  const k401 = grab([/401.?k[^0-9]+([\d]{2,})/i, /box 12.*?code d[^0-9]+([\d]{2,})/i, /elective deferrals[^0-9]+([\d]{2,})/i]);

  // HSA (Form 8889)
  const hsa = grab([/HSA[^0-9]+([\d]{2,})/i, /health savings[^0-9]+([\d]{2,})/i]);

  // Child Tax Credit
  const ctc = grab([/child tax credit[^0-9]+([\d]{2,})/i, /(?:8812|additional child)[^0-9]+([\d]{2,})/i]);

  // Number of dependents / children
  const dependentsM = t.match(/(?:number of|qualifying) (?:dependents|children)[^\d]*([\d]{1,2})/i);
  const numDependents = dependentsM ? parseInt(dependentsM[1], 10) : 0;
  const ctcChildrenM = t.match(/(?:children|dependents).*?(?:under|age).*?17[^\d]*([\d]{1,2})/i);
  const numUnder17 = ctcChildrenM ? parseInt(ctcChildrenM[1], 10) : (numDependents > 0 ? numDependents : 0);

  // Credits & other schedules
  const educationCredit = grab([
    /(?:american opportunity|education credit|Form 8863)[^0-9]+([\d]{2,})/i,
    /(?:AOTC|LLC)[^0-9]+([\d]{2,})/i
  ]);
  const childcareExpenses = grab([
    /(?:Form 2441|dependent care|child.?care credit)[^0-9]+([\d]{3,})/i,
    /care expenses[^0-9]+([\d]{3,})/i
  ]);
  const eitc = grab([/earned income credit[^0-9]+([\d]{2,})/i, /EIC[^0-9]+([\d]{2,})/i, /EITC[^0-9]+([\d]{2,})/i]);
  const dividends = grab([/qualified dividends[^0-9]+([\d]{2,})/i, /ordinary dividends[^0-9]+([\d]{2,})/i]);
  const ltcgAmt = grab([/(?:net )?long.?term capital gain[^0-9]+([\d]{2,})/i, /Schedule D[^0-9]+([\d]{3,})/i]);
  const stcgAmt = grab([/short.?term capital gain[^0-9]+([\d]{2,})/i]);
  const rentalNet = grab([/(?:Schedule E|rental).*?(?:income|net)[^0-9]+([\d]{2,})/i, /rental real estate[^0-9]+([\d]{2,})/i]);
  const medicalSchA = grab([/(?:medical|dental).*?(?:expenses|deduction)[^0-9]+([\d]{3,})/i]);
  const propertyTax = grab([/real estate taxes[^0-9]+([\d]{2,})/i, /property taxes[^0-9]+([\d]{2,})/i]);
  const stateIncomeTax = grab([/state and local income taxes[^0-9]+([\d]{2,})/i, /state income tax[^0-9]+([\d]{2,})/i]);
  const investmentInterest = grab([/investment interest[^0-9]+([\d]{2,})/i]);
  const educatorExpenses = grab([/educator expenses[^0-9]+([\d]{1,4})/i]);
  const sepSimple = grab([/(?:SEP|SIMPLE)[^0-9]+([\d]{2,})/i, /self.?employed.*?401[^0-9]+([\d]{2,})/i]);

  const stateRefundTaxable = grab([/(?:state|local).*?refund[^0-9]+([\d]{2,})/i, /taxable.*?state.*?refund[^0-9]+([\d]{2,})/i]);

  let obbbTips = 0;
  let obbbOvertime = 0;
  let obbbAutoLoan = 0;
  if (taxYear >= 2025) {
    obbbTips = grab([/(?:qualified )?tips[^0-9]+([\d]{2,})/i, /no tax on tips[^0-9]+([\d]{2,})/i]);
    obbbOvertime = grab([/(?:qualified )?overtime[^0-9]+([\d]{2,})/i]);
    obbbAutoLoan = grab([/(?:vehicle|car|auto).*?loan interest[^0-9]+([\d]{2,})/i, /passenger vehicle[^0-9]+([\d]{2,})/i]);
  }

  const numCollege = educationCredit > 500 ? Math.min(4, Math.max(1, Math.round(educationCredit / 2000))) : 0;

  const deductionType   = itemizedDeduction > standardDeduction ? 'itemized' : 'standard';
  const deductionAmount = Math.max(standardDeduction, itemizedDeduction);

  return normalizePriorYearData({
    taxYear, filingStatus, wages, agi, taxableIncome,
    totalTax, federalWithheld, refund,
    deductionType, deductionAmount, standardDeduction, itemizedDeduction,
    studentLoan, selfEmployed, iraDeduction,
    mortgageInterest, charitableDeduct, saltDeduct,
    k401, hsa, ctc,
    numDependents,
    numUnder17,
    numCollege,
    childcareExpenses,
    educationCredit,
    eitc,
    dividends,
    ltcg: ltcgAmt,
    stcg: stcgAmt,
    rentalNet,
    medicalSchA,
    propertyTax,
    stateIncomeTax,
    investmentInterest,
    educatorExpenses,
    sepSimple,
    dependentCareFSA: 0,
    stateRefundTaxable,
    obbbTips,
    obbbOvertime,
    obbbAutoLoan,
    rothIRA: 0
  });
}

/* ---- SHOW PARSE RESULTS IN MODAL ---- */
function showParseResults(data, container) {
  container.classList.remove('hidden');
  const d = data;
  const rows = [
    ['Tax Year Detected',   d.taxYear],
    ['Filing Status',       d.filingStatus.toUpperCase()],
    ['Total Wages',         fmt(d.wages)],
    ['Adjusted Gross Income', fmt(d.agi)],
    ['Taxable Income',      fmt(d.taxableIncome)],
    ['Total Federal Tax',   fmt(d.totalTax)],
    ['Federal Withheld',    fmt(d.federalWithheld)],
    ['Refund / (Owed)',     d.refund >= 0 ? fmt(d.refund) + ' refund' : fmt(-d.refund) + ' owed'],
    ['Deduction Used',      d.deductionType === 'itemized' ? 'Itemized — ' + fmt(d.deductionAmount) : 'Standard — ' + fmt(d.deductionAmount)],
    d.k401 ? ['401(k) Contribution', fmt(d.k401)] : null,
    d.iraDeduction ? ['IRA Deduction', fmt(d.iraDeduction)] : null,
    d.hsa ? ['HSA Contribution', fmt(d.hsa)] : null,
    d.mortgageInterest ? ['Mortgage Interest', fmt(d.mortgageInterest)] : null,
    d.charitableDeduct ? ['Charitable Donations', fmt(d.charitableDeduct)] : null,
    d.ctc ? ['Child Tax Credit', fmt(d.ctc)] : null,
    d.childcareExpenses ? ['Dependent Care (2441)', fmt(d.childcareExpenses)] : null,
    d.educationCredit ? ['Education Credits (8863)', fmt(d.educationCredit)] : null,
    d.eitc ? ['Earned Income Credit', fmt(d.eitc)] : null,
    d.dividends ? ['Dividends', fmt(d.dividends)] : null,
    d.ltcg ? ['Long-Term Capital Gains', fmt(d.ltcg)] : null,
    d.rentalNet ? ['Net Rental (Sch E)', fmt(d.rentalNet)] : null,
    d.selfEmployed ? ['Self-Employment (Sch C)', fmt(d.selfEmployed)] : null,
    d.taxYear >= 2025 && (d.obbbTips || d.obbbOvertime || d.obbbAutoLoan) ? ['OBBB (tips/OT/auto)', [d.obbbTips, d.obbbOvertime, d.obbbAutoLoan].map((x, i) => ['T', 'OT', 'A'][i] + ':' + fmt(x || 0)).join(' · ')] : null
  ].filter(Boolean);

  const anyData = d.wages > 0 || d.agi > 0 || d.totalTax > 0;

  container.innerHTML = anyData ? `
    <div class="parse-success">
      <div class="parse-success-title">✅ Successfully extracted ${rows.length} fields from your ${d.taxYear} return</div>
      <table class="parse-table">
        ${rows.map(([k,v]) => `<tr><td>${k}</td><td><strong>${v}</strong></td></tr>`).join('')}
      </table>
      <div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap">
        <button class="btn-success" onclick="applyPriorYearData(parsedPDFData)">✓ Use This Data &amp; Analyze</button>
        <button class="btn-secondary" onclick="document.getElementById('prior-year-modal').classList.add('hidden')">Cancel</button>
      </div>
    </div>
  ` : `
    <div class="parse-error">
      ⚠️ We couldn't extract usable data from this PDF. This can happen with scanned (image-based) PDFs.<br>
      <strong>Try these options:</strong><br>
      • Use "Enter Manually" instead<br>
      • Make sure the PDF is text-based (open it, select text with your cursor — if you can't, it's a scan)<br>
      • Try printing to PDF from your tax software again
    </div>
  `;

  // Store for the confirm button
  window.parsedPDFData = data;
}

/* ---- APPLY PRIOR YEAR DATA (from PDF or manual) ---- */
function applyPriorYearData(data) {
  priorYearData = normalizePriorYearData(data);

  // Auto-fill form fields where we have data
  const set = (id, val) => { const el = document.getElementById(id); if (el && val > 0) el.value = Math.round(val); };
  const py = priorYearData;
  set('w2Income',              py.wages);
  set('mortgageInterest',      py.mortgageInterest);
  set('charitableCash',        py.charitableDeduct);
  set('k401Contrib',           py.k401);
  set('traditionalIRAContrib', py.iraDeduction);
  set('hsaContrib',            py.hsa);
  set('studentLoanInterest',   py.studentLoan);
  set('federalWithheld',       py.federalWithheld);
  set('childcareExpenses',     py.childcareExpenses);
  if (py.numCollege > 0 || py.educationCredit > 0) {
    set('tuitionPaid', py.numCollege > 0 ? 5000 * py.numCollege : 5000);
  }
  set('dividends',             py.dividends);
  set('longTermCapGains',      py.ltcg);
  set('shortTermCapGains',     py.stcg);
  set('rentalIncome',          py.rentalNet);
  set('selfEmploymentIncome',  py.selfEmployed);
  set('educatorExpenses',      py.educatorExpenses);
  set('propertyTax',           py.propertyTax);
  set('stateTaxPaid',          py.stateIncomeTax);
  set('tipIncome',             py.obbbTips);
  set('overtimePay',           py.obbbOvertime);
  set('autoLoanInterest',      py.obbbAutoLoan);
  if (py.numUnder17 > 0) set('numChildrenUnder17', py.numUnder17);
  else if (py.numDependents > 0) set('numChildrenUnder17', py.numDependents);
  if (py.numCollege > 0) set('numChildrenCollege', py.numCollege);
  if (py.dependentCareFSA > 0) set('dependentCarefsaContrib', py.dependentCareFSA);
  if (py.sepSimple > 0) set('sepIRAContrib', py.sepSimple);

  // Set filing status
  const fsMap = { single: 0, mfj: 1, mfs: 2, hoh: 3 };
  const fsIdx = fsMap[py.filingStatus] ?? 0;
  const radios = document.querySelectorAll('input[name="filingStatus"]');
  if (radios[fsIdx]) {
    radios[fsIdx].checked = true;
    radios.forEach(r => r.closest('.radio-card')?.classList.toggle('selected', r.checked));
  }

  // Show analysis bar + mapping table + live compare
  showPriorAnalysisBar(py);
  renderPriorMappingPanel();

  // Close modals
  document.getElementById('prior-year-modal')?.classList.add('hidden');
  document.getElementById('manual-prior-modal')?.classList.add('hidden');
}

/* ---- MANUAL ENTRY HANDLER ---- */
function analyzePriorYear() {
  const getNum = id => parseFloat(document.getElementById(id)?.value) || 0;
  const data = normalizePriorYearData({
    taxYear:           parseInt(document.getElementById('py-year')?.value, 10) || 2024,
    filingStatus:      document.getElementById('py-filing')?.value || 'single',
    wages:             getNum('py-wages'),
    agi:               getNum('py-agi'),
    totalTax:          getNum('py-tax'),
    refund:            getNum('py-refund'),
    deductionType:     document.getElementById('py-deduction-type')?.value || 'standard',
    deductionAmount:   getNum('py-deduction-amount'),
    k401:              getNum('py-401k'),
    iraDeduction:      getNum('py-ira'),
    hsa:               getNum('py-hsa'),
    ctc:               getNum('py-ctc'),
    mortgageInterest:  getNum('py-mortgage'),
    charitableDeduct:  getNum('py-charity'),
    federalWithheld:   getNum('py-withheld'),
    studentLoan:       0,
    selfEmployed:      getNum('py-self-employment'),
    saltDeduct:        getNum('py-property-tax') + getNum('py-state-tax'),
    taxableIncome:     0,
    numDependents:     getNum('py-num-under17'),
    numUnder17:        getNum('py-num-under17'),
    numCollege:        getNum('py-num-college'),
    childcareExpenses: getNum('py-childcare'),
    educationCredit:   getNum('py-education'),
    eitc:              getNum('py-eitc'),
    dividends:         getNum('py-dividends'),
    ltcg:              getNum('py-ltcg'),
    stcg:              getNum('py-stcg'),
    rentalNet:         getNum('py-rental'),
    medicalSchA:       getNum('py-medical'),
    propertyTax:       getNum('py-property-tax'),
    stateIncomeTax:    getNum('py-state-tax'),
    investmentInterest:getNum('py-inv-interest'),
    educatorExpenses:  getNum('py-educator'),
    sepSimple:         getNum('py-sep'),
    dependentCareFSA:  getNum('py-dcfsa'),
    stateRefundTaxable:getNum('py-state-refund-taxable'),
    obbbTips:          getNum('py-tips'),
    obbbOvertime:      getNum('py-overtime'),
    obbbAutoLoan:      getNum('py-auto-loan'),
    rothIRA:           0
  });
  applyPriorYearData(data);
}

/* ---- SHOW PRIOR ANALYSIS STICKY BAR ---- */
function showPriorAnalysisBar(data) {
  const bar = document.getElementById('prior-analysis-bar');
  const inner = document.getElementById('prior-analysis-inner');
  if (!bar || !inner) return;

  const effRate = data.agi > 0 ? ((data.totalTax / data.agi) * 100).toFixed(1) : '—';
  inner.innerHTML = `
    <div class="pa-summary">
      <div class="pa-badge">📄 ${data.taxYear} Return Loaded</div>
      <div class="pa-item"><span>Prior AGI</span><strong>${fmt(data.agi)}</strong></div>
      <div class="pa-item"><span>Prior Tax</span><strong>${fmt(data.totalTax)}</strong></div>
      <div class="pa-item"><span>Effective Rate</span><strong>${effRate}%</strong></div>
      <div class="pa-item"><span>${data.refund >= 0 ? 'Refund' : 'Owed'}</span><strong style="color:${data.refund >= 0 ? 'var(--success)' : 'var(--danger)'}">${fmt(Math.abs(data.refund))}</strong></div>
      <div class="pa-item"><span>Deduction</span><strong>${data.deductionType === 'itemized' ? 'Itemized' : 'Standard'} ${fmt(data.deductionAmount)}</strong></div>
    </div>
    <div class="pa-hint">✏️ <a href="#" onclick="document.getElementById('manual-prior-modal').classList.remove('hidden');return false">Edit prior year data</a> · Fill out the form below and click Analyze to see the year-over-year comparison</div>
  `;
  bar.classList.remove('hidden');
}

function stdDedForPriorYear(year, filingStatus) {
  const d = TAX_DATA[year];
  if (d && d.standardDeduction[filingStatus]) return d.standardDeduction[filingStatus];
  if (year >= 2025) {
    return filingStatus === 'mfj' ? 31500 : filingStatus === 'hoh' ? 23625 : 15750;
  }
  return filingStatus === 'mfj' ? 29200 : filingStatus === 'hoh' ? 21900 : 14600;
}

/** Build categorized filing provisions from prior return + selected filing year */
function buildPriorYearFilingProvisions(py, marginalRate, selectedTaxYear) {
  const cats = [];
  const fs = py.filingStatus || 'single';
  const ty = py.taxYear || 2024;
  const obbbYears = selectedTaxYear >= 2025 && ty >= 2025;

  // —— 1. Forms & information returns ——
  const forms = [];
  if (py.wages > 0) {
    forms.push({ icon: '📋', title: 'W-2 wage reconciliation', detail: `Last year: ${fmt(py.wages)} in Box 1 wages. This year, verify all employers sent W-2s by Jan 31; match Box 12 codes (D = 401k, W = HSA, DD = health insurance) for consistency with your entries.`, ref: 'Form W-2' });
  }
  if (py.dividends > 0 || py.ltcg > 0 || py.stcg > 0) {
    forms.push({ icon: '📈', title: 'Investment 1099s', detail: `You had investment income. Collect 1099-DIV, 1099-B, and brokerage consolidated 1099s. Qualified dividends and long-term gains use lower rates — ensure cost basis is reported (1099-B Box A/B).`, ref: '1099-DIV / 1099-B' });
  }
  if (py.selfEmployed > 0) {
    forms.push({ icon: '📒', title: 'Self-employment documentation', detail: `Schedule C net was about ${fmt(py.selfEmployed)}. Keep mileage logs, receipts, and separate business accounts. Consider SEP-IRA or Solo 401(k) to shelter more than IRA limits allow.`, ref: 'Sch C / SE' });
  }
  if (py.rentalNet > 0) {
    forms.push({ icon: '🏘️', title: 'Rental property records', detail: `Rental income reported (~${fmt(py.rentalNet)}). Maintain depreciation schedules, repair vs. improvement distinction, and track days of personal use.`, ref: 'Schedule E' });
  }
  if (py.mortgageInterest > 0) {
    forms.push({ icon: '🏠', title: 'Mortgage interest (Form 1098)', detail: `You deducted mortgage interest. Lenders send 1098 by Jan 31; verify loan limits ($750k acquisition debt) still apply if you refinanced.`, ref: 'Form 1098' });
  }
  if (forms.length) cats.push({ id: 'forms', title: 'Forms & information returns', items: forms });

  // —— 2. Credits & dependents ——
  const credits = [];
  if (py.ctc > 0 || py.numUnder17 > 0) {
    credits.push({ icon: '👶', title: 'Child Tax Credit & dependents', detail: `Document SSNs for every qualifying child. CTC phases out at higher incomes; if income rose, expect a smaller credit unless you reduce AGI with 401(k)/HSA.`, ref: 'Schedule 8812' });
  }
  if (py.childcareExpenses > 0 || py.dependentCareFSA > 0) {
    credits.push({ icon: '🧒', title: 'Child and dependent care', detail: `You had care expenses or DCFSA. Provider EIN + address required on Form 2441. DCFSA ${fmt(py.dependentCareFSA || 0)} reduces eligible expenses dollar-for-dollar for the credit.`, ref: 'Form 2441' });
  }
  if (py.educationCredit > 0 || py.numCollege > 0) {
    credits.push({ icon: '🎓', title: 'Education credits (AOTC / LLC)', detail: `American Opportunity Credit is limited to 4 years per student; Lifetime Learning has different rules. Keep Form 1098-T from each institution.`, ref: 'Form 8863' });
  }
  if (py.eitc > 0) {
    credits.push({ icon: '💵', title: 'Earned Income Credit', detail: `You claimed EITC. PATH Act delays refunds claiming EITC until mid-February. Income limits change yearly — verify eligibility if family size or wages changed.`, ref: 'Schedule EIC' });
  }
  if (credits.length) cats.push({ id: 'credits', title: 'Credits to claim again (with proof)', items: credits });

  // —— 3. Deductions: itemized vs standard & SALT ——
  const ded = [];
  const stdLast = stdDedForPriorYear(ty, fs);
  if (py.deductionType === 'itemized') {
    const salt = (py.propertyTax || 0) + (py.stateIncomeTax || 0);
    ded.push({ icon: '📑', title: 'Itemized — SALT cap', detail: `State/local taxes + property tax are capped at ${fmt(10000)} combined. Your Schedule A items should be tracked again; bunching charitable gifts may help in alternate years.`, ref: 'Schedule A' });
    if (py.stateRefundTaxable > 0) {
      ded.push({ icon: '↩️', title: 'Taxable state refund (recapture)', detail: `You may have ${fmt(py.stateRefundTaxable)} taxable state refund on Schedule 1 if you itemized last year and received a state refund — same logic applies this year if you itemize again.`, ref: 'Sch 1, Line 1' });
    }
  } else {
    ded.push({ icon: '⚖️', title: 'Standard vs. itemized', detail: `You used the standard deduction (~${fmt(py.deductionAmount || stdLast)}). Compare each year: mortgage ${fmt(py.mortgageInterest)} + charity ${fmt(py.charitableDeduct)} + SALT (capped) vs. new standard ${fmt(stdDedForPriorYear(selectedTaxYear, fs))} for ${selectedTaxYear}.`, ref: '1040 Line 12' });
  }
  if (py.medicalSchA > 0) {
    ded.push({ icon: '🏥', title: 'Medical expense deduction', detail: `Only amounts over 7.5% of AGI count. If AGI drops this year, more medical may become deductible if you itemize.`, ref: 'Schedule A' });
  }
  if (ded.length) cats.push({ id: 'deductions', title: 'Deduction strategy from your last return', items: ded });

  // —— 4. Retirement & health ——
  const ret = [];
  const k401Lim = (TAX_DATA[selectedTaxYear] || TAX_DATA[2025]).limits.k401.under50;
  if (py.wages > 0 && py.k401 < k401Lim * 0.85) {
    ret.push({ icon: '🏦', title: '401(k) deferral room', detail: `Prior contribution ${fmt(py.k401)} vs. ${fmt(k401Lim)} limit for ${selectedTaxYear}. Increasing deferrals reduces W-2 Box 1 and can lower marginal rate on credits that phase out with AGI.`, ref: 'W-2 Box 12 code D' });
  }
  if (!py.hsa && py.wages > 0) {
    ret.push({ icon: '🩺', title: 'HSA eligibility', detail: 'No HSA detected on prior data. If you enroll in a qualified HDHP this year, fund an HSA by the filing deadline for a triple tax advantage.', ref: 'Form 8889' });
  }
  if (py.iraDeduction > 0 || py.sepSimple > 0) {
    ret.push({ icon: '💰', title: 'IRA / SEP', detail: `Prior IRA ${fmt(py.iraDeduction)} / SEP ${fmt(py.sepSimple)}. Watch combined limits and deduction phase-outs if covered by a workplace plan.`, ref: 'Form 8606 if nondeductible IRA' });
  }
  if (ret.length) cats.push({ id: 'retirement', title: 'Retirement & health accounts', items: ret });

  // —— 5. Withholding & estimates ——
  const wh = [];
  if (py.refund > 2500) {
    wh.push({ icon: '📅', title: 'Adjust Form W-4', detail: `Large refund (${fmt(py.refund)}) means over-withholding. Use IRS Tax Withholding Estimator to update W-4 early in the year.`, ref: 'Form W-4' });
  }
  if (py.refund < 0 || (py.totalTax - py.federalWithheld) > 1000) {
    wh.push({ icon: '📆', title: 'Estimated taxes (1040-ES)', detail: 'You owed tax at filing or had a balance. If self-employed or investment income grows, pay quarterly estimates to avoid underpayment penalties.', ref: 'Form 1040-ES' });
  }
  if (wh.length) cats.push({ id: 'withholding', title: 'Withholding & estimated tax', items: wh });

  // —— 6. OBBB (2025+) ——
  if (obbbYears) {
    const obbb = [];
    obbb.push({ icon: '📎', title: 'Schedule 1-A (OBBB)', detail: 'Tips, overtime, car loan interest, and senior bonus are reported on new Schedule 1-A through 2028. Without it, new deductions are disallowed.', ref: 'Schedule 1-A' });
    if (!py.obbbTips) {
      obbb.push({ icon: '💵', title: 'Tips deduction (if applicable)', detail: 'If you receive tips in a customary occupation, you may deduct up to $25,000 (with MAGI phase-out). Report on Schedule 1-A; keep W-2 and employer tip records.', ref: 'OBBB §70201' });
    }
    if (!py.obbbOvertime && py.wages > 40000) {
      obbb.push({ icon: '⏰', title: 'Overtime deduction', detail: 'The premium half of time-and-a-half may be deductible up to $12,500 single / $25,000 MFJ.', ref: 'OBBB §70202' });
    }
    if (!py.obbbAutoLoan) {
      obbb.push({ icon: '🚗', title: 'US-assembled vehicle loan interest', detail: 'Up to $10,000/year for qualifying personal-use vehicles; include VIN on return.', ref: 'OBBB §70203' });
    }
    cats.push({ id: 'obbb', title: 'One Big Beautiful Bill (this filing year)', items: obbb });
  }

  // —— 7. Investments & carryovers ——
  const inv = [];
  if (py.ltcg > 0 || py.stcg > 0) {
    inv.push({ icon: '📊', title: 'Capital gains timing', detail: `Prior gains ~ LTCG ${fmt(py.ltcg)} / ST ${fmt(py.stcg)}. Hold appreciated assets >1 year for LTCG rates; harvest losses against gains (up to $3,000 ordinary).`, ref: 'Schedule D' });
  }
  if (py.investmentInterest > 0) {
    inv.push({ icon: '🔗', title: 'Investment interest', detail: 'Interest must trace to taxable investment income; Form 4952 if complex.', ref: 'Form 4952' });
  }
  if (inv.length) cats.push({ id: 'invest', title: 'Investments & capital gains', items: inv });

  return cats;
}

/* ---- YEAR-OVER-YEAR COMPARISON (called inside calculateTaxes) ---- */
/** Live strip: prior vs. current form (uses last tax math run) */
function updateLiveYoYBar() {
  const body = document.getElementById('live-yoy-body');
  const card = document.getElementById('live-yoy-compare');
  if (!body || !priorYearData) return;
  const py = priorYearData;
  const c = window.__lastTaxCompute;
  if (!c) {
    body.innerHTML = '<p class="live-yoy-placeholder">Enter income and deductions, then use <strong>Refresh tax estimate</strong> below.</p>';
    card?.classList.remove('hidden');
    return;
  }
  const r = (label, pv, cv) =>
    `<div class="live-yoy-row"><span class="live-yoy-label">${label}</span><span class="live-yoy-prior">${fmt(pv)}</span><span class="live-yoy-arr">→</span><span class="live-yoy-cur">${fmt(cv)}</span></div>`;
  const priorEff = py.agi > 0 ? ((py.totalTax / py.agi) * 100).toFixed(1) + '%' : '—';
  const curEff = c.agi > 0 ? ((c.totalTax / c.agi) * 100).toFixed(1) + '%' : '—';
  const curMr = (c.marginalRate * 100).toFixed(1) + '%';
  body.innerHTML = `
    <div class="live-yoy-rows">
      ${r('W-2 wages (Box 1)', py.wages, c.w2Income + c.spouseW2)}
      ${r('401(k) deferrals', py.k401, c.k401Contrib + c.spouseK401Contrib)}
      ${r('HSA', py.hsa, c.hsaContrib)}
      ${r('AGI', py.agi, c.agi)}
      ${r('Federal tax (before withholding)', py.totalTax, c.totalTax)}
      <div class="live-yoy-row"><span class="live-yoy-label">Effective tax rate</span><span class="live-yoy-prior">${priorEff}</span><span class="live-yoy-arr">→</span><span class="live-yoy-cur">${curEff}</span></div>
      <div class="live-yoy-row"><span class="live-yoy-label">Marginal rate (ordinary, bracket)</span><span class="live-yoy-prior">—</span><span class="live-yoy-arr">→</span><span class="live-yoy-cur">${curMr}</span></div>
    </div>
  `;
  card?.classList.remove('hidden');
}

function buildPriorMappingRows(py, selYear) {
  const lim = (TAX_DATA[selYear] || TAX_DATA[2025]).limits;
  const k401Max = lim.k401.under50;
  const hsaMax = lim.hsa.family;
  const rows = [];
  const push = (priorLabel, amt, step, field, cond) => {
    rows.push({
      priorLabel,
      priorAmt: fmt(amt),
      step,
      field,
      conditions: cond
    });
  };
  if (py.wages > 0) {
    push('Wages, salaries, tips (W-2 Box 1)', py.wages, 'Step 2 · Income', 'W-2 Wages (Box 1) & spouse W-2',
      `Same boxes on ${selYear} W-2s. Must match employer filings. If multiple jobs, sum all Box 1 amounts.`);
  }
  if (py.k401 > 0) {
    push('401(k) / 403(b) deferrals (W-2 Box 12 code D)', py.k401, 'Step 5 · Retirement', '401(k) / 403(b) Contributions',
      `${selYear} employee deferral limit $${k401Max.toLocaleString()} (higher if age 50+). Must be through employer plan; excess may be taxable.`);
  }
  if (py.iraDeduction > 0) {
    push('Traditional IRA deduction', py.iraDeduction, 'Step 5 · Retirement', 'Traditional IRA Contributions',
      'Deduction phases out if you or spouse covered by workplace plan and income above IRS thresholds. Roth IRA is not deductible.');
  }
  if (py.sepSimple > 0) {
    push('SEP / SIMPLE / self-employed retirement', py.sepSimple, 'Step 5 · Retirement', 'SEP-IRA / Solo 401(k)',
      'Generally limited to ~25% of net self-employment income up to annual SEP cap. Must be self-employment earnings.');
  }
  if (py.hsa > 0) {
    push('HSA contributions (Form 8889)', py.hsa, 'Step 6 · Health', 'HSA Contributions',
      `Must be enrolled in qualified HDHP; ${selYear} limits apply (family up to $${hsaMax.toLocaleString()}). Cannot double-count with Medicaid/traditional FSA improperly.`);
  }
  if (py.mortgageInterest > 0) {
    push('Home mortgage interest (1098)', py.mortgageInterest, 'Step 4 · Home', 'Mortgage Interest Paid',
      'Loan must be acquisition or improvement debt; generally limited to $750k principal. Refinance rules apply.');
  }
  if ((py.propertyTax || 0) + (py.stateIncomeTax || 0) > 0) {
    push('State/local taxes (SALT)', (py.propertyTax || 0) + (py.stateIncomeTax || 0), 'Step 4 · Home', 'Property Taxes & State Income Taxes',
      `Combined SALT capped at $10,000 for federal itemizing. Compare to standard deduction for ${selYear}.`);
  }
  if (py.charitableDeduct > 0) {
    push('Charitable contributions', py.charitableDeduct, 'Step 7 · Other', 'Charitable Donations',
      'Cash gifts need acknowledgment for $250+; non-cash over $500 needs Form 8283 details. Must itemize to deduct.');
  }
  if (py.studentLoan > 0) {
    push('Student loan interest', py.studentLoan, 'Step 6 · Health', 'Student Loan Interest Paid',
      `Up to $${lim.studentLoanInterest} deduction; phases out above MAGI ($80k single / $165k MFJ in many years).`);
  }
  if (py.childcareExpenses > 0) {
    push('Child / dependent care', py.childcareExpenses, 'Step 3 · Dependents', 'Child/Dependent Care Expenses',
      'Qualifying person rules; provider SSN/EIN on Form 2441. Credit % depends on AGI. DCFSA reduces eligible expenses.');
  }
  if (py.educationCredit > 0 || py.numCollege > 0) {
    push('Education credits (8863) / tuition', py.educationCredit || 0, 'Step 3 · Dependents', 'College Tuition & Fees',
      'AOTC: first 4 years per student, 1098-T required. LLC has different rules. Income phase-outs apply.');
  }
  if (py.ctc > 0 || py.numUnder17 > 0) {
    push('Child Tax Credit', py.ctc || 0, 'Step 3 · Dependents', 'Children Under 17',
      'Child must have SSN valid for employment. Credit phases out at higher incomes ($400k MFJ / $200k others).');
  }
  if (py.dividends > 0 || py.ltcg > 0) {
    push('Dividends / capital gains', py.dividends + py.ltcg, 'Step 2 · Income', 'Qualified Dividends & Long-Term Capital Gains',
      'Qualified dividends and long-term gains taxed at 0/15/20% brackets — not ordinary rates. Hold assets >1 year for LTCG.');
  }
  if (py.selfEmployed > 0) {
    push('Self-employment (Schedule C)', py.selfEmployed, 'Step 2 · Income', 'Self-Employment / 1099 Income',
      'Net profit after expenses; SE tax on Schedule SE. Quarterly estimates if tax due is high enough.');
  }
  if (py.rentalNet > 0) {
    push('Rental income (Schedule E)', py.rentalNet, 'Step 2 · Income', 'Rental Income',
      'Passive activity rules; depreciation recapture on sale. Material participation affects loss deductibility.');
  }
  if (py.eitc > 0) {
    push('Earned Income Credit', py.eitc, 'Step 1–3', 'Earned income & dependents',
      `Investment income must be below limit; EITC has earned income ranges. PATH Act may delay refund until mid-February.`);
  }
  if (selYear >= 2025 && ((py.obbbTips || 0) + (py.obbbOvertime || 0) + (py.obbbAutoLoan || 0) > 0)) {
    push('OBBB: tips / overtime / car loan (Schedule 1-A)', (py.obbbTips || 0) + (py.obbbOvertime || 0) + (py.obbbAutoLoan || 0), 'Step 2 & 4', 'Tips, Overtime, Car Loan Interest',
      '2025–2028: file Schedule 1-A. Tips/overtime phase out at higher MAGI; car loan requires US-assembled vehicle & personal use.');
  }
  if (rows.length === 0) {
    push('(No detailed amounts detected)', 0, 'All steps', 'Fill the form to mirror last year',
      'Enter your best estimates from your prior Form 1040 and schedules.');
  }
  return rows;
}

function renderPriorMappingPanel() {
  const wrap = document.getElementById('prior-mapping-wrap');
  const panel = document.getElementById('prior-mapping-panel');
  if (!priorYearData || !panel) {
    wrap?.classList.add('hidden');
    return;
  }
  const selYear = parseInt(document.getElementById('taxYear')?.value, 10) || 2025;
  const rows = buildPriorMappingRows(priorYearData, selYear);
  panel.innerHTML = `
    <div class="pmap-head">
      <div class="pmap-title">Post last year’s numbers into this year’s return</div>
      <p class="pmap-sub">Each row shows <strong>where to enter</strong> the same type of item in this calculator, and <strong>conditions</strong> that must be met for ${selYear}.</p>
    </div>
    <div class="pmap-table-wrap">
      <table class="pmap-table">
        <thead><tr><th>From ${priorYearData.taxYear} return</th><th>Enter in this app</th><th>Conditions for ${selYear}</th></tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td><span class="pmap-pl">${r.priorLabel}</span><br><span class="pmap-amt">${r.priorAmt}</span></td>
              <td><span class="pmap-step">${r.step}</span><br><span class="pmap-field">${r.field}</span></td>
              <td class="pmap-cond">${r.conditions}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="pmap-foot">
      <button type="button" class="btn-primary btn-sm" onclick="calculateTaxes({ previewOnly: true })">↻ Refresh live comparison &amp; tax estimate</button>
      <span class="pmap-foot-hint">Uses the same tax engine as <strong>Analyze</strong> — your form stays open.</span>
    </div>
  `;
  wrap.classList.remove('hidden');
  document.getElementById('live-yoy-compare')?.classList.remove('hidden');
  try {
    calculateTaxes({ previewOnly: true });
  } catch (e) {
    console.warn('Preview tax:', e);
  }
}

/** Side-by-side line items: prior return vs. last full calculation */
function buildPriorVsCurrentLineTable(py, selYear) {
  const c = window.__lastTaxCompute;
  if (!c) return '';
  const row = (label, p, cur) =>
    `<tr><td>${label}</td><td>${fmt(p)}</td><td>${fmt(cur)}</td></tr>`;
  return `
    <div class="pyc-line-detail">
      <div class="pyc-line-detail-title">Line-by-line: prior year vs. current entries (this analysis)</div>
      <table class="pyc-line-table">
        <thead><tr><th>Item</th><th>${py.taxYear} prior</th><th>${selYear} (your entries now)</th></tr></thead>
        <tbody>
          ${row('W-2 wages (Box 1)', py.wages, c.w2Income + c.spouseW2)}
          ${row('401(k) deferrals', py.k401, c.k401Contrib + c.spouseK401Contrib)}
          ${row('Traditional IRA + SEP', (py.iraDeduction || 0) + (py.sepSimple || 0), c.traditionalIRA + c.sepIRA)}
          ${row('HSA contributions', py.hsa, c.hsaContrib)}
          ${row('Mortgage interest', py.mortgageInterest, c.mortgageInterest)}
          ${row('Charitable (cash + non-cash)', (py.charitableDeduct || 0), c.charitableCash + c.charitableNonCash)}
          ${row('Qualified dividends', py.dividends, c.dividends)}
          ${row('Long-term capital gains', py.ltcg, c.ltcg)}
          ${row('Student loan interest', py.studentLoan, c.studentLoanInterest)}
          ${row('Child / dependent care paid', py.childcareExpenses, c.childcareExpenses)}
          ${row('Tuition (for education credits)', py.educationCredit || 0, c.tuitionPaid)}
          ${row('OBBB: tips + overtime + auto (if any)', (py.obbbTips || 0) + (py.obbbOvertime || 0) + (py.obbbAutoLoan || 0), (c.tipIncome || 0) + (c.overtimePay || 0) + (c.autoLoanInterest || 0))}
          <tr class="pyc-line-highlight"><td><strong>Adjusted gross income (AGI)</strong></td><td><strong>${fmt(py.agi)}</strong></td><td><strong>${fmt(c.agi)}</strong></td></tr>
          <tr class="pyc-line-highlight"><td><strong>Federal income tax (before withholding)</strong></td><td><strong>${fmt(py.totalTax)}</strong></td><td><strong>${fmt(c.totalTax)}</strong></td></tr>
        </tbody>
      </table>
      <p class="pyc-line-note">“Current” column reflects the numbers in the form when you clicked <strong>Analyze</strong>. Use the live panel above the form to compare while editing.</p>
    </div>
  `;
}

function renderPriorYearComparison(currentAGI, currentTax, currentRefund, marginalRate, selectedTaxYear) {
  const panel = document.getElementById('py-comparison-panel');
  if (!panel || !priorYearData) { if (panel) panel.classList.add('hidden'); return; }

  const py = priorYearData;
  const agiChange   = currentAGI  - py.agi;
  const taxChange   = currentTax  - py.totalTax;

  const arrow = (val, invertColor) => {
    const up = val > 0;
    const col = invertColor
      ? (up ? 'var(--danger)' : 'var(--success)')
      : (up ? 'var(--success)' : 'var(--danger)');
    return val === 0 ? '<span style="color:var(--gray-400)">—</span>'
      : `<span style="color:${col}">${up ? '▲' : '▼'} ${fmt(Math.abs(val))}</span>`;
  };

  const stdRef = stdDedForPriorYear(py.taxYear, py.filingStatus);

  // Find missed opportunities from prior year
  const missed = [];
  const yKey = Math.min(Math.max(py.taxYear, 2024), 2026);
  const k401LimPY = (TAX_DATA[yKey] || TAX_DATA[2025]).limits.k401.under50;
  if (py.wages > 0 && (py.k401 || 0) < k401LimPY * 0.5) {
    const room = k401LimPY - (py.k401 || 0);
    missed.push({ icon: '🏦', text: `401(k): you contributed ${py.k401 ? fmt(py.k401) : 'little or nothing'} vs. a ${fmt(k401LimPY)} limit for ${py.taxYear}. Unused room ≈ ${fmt(room)} deferral — roughly ${fmt(room * marginalRate)} federal tax at your current marginal rate if you had maxed out.` });
  }
  if (!py.hsa && py.wages > 0) {
    missed.push({ icon: '🏥', text: `No HSA on your ${py.taxYear} data. With a qualified HDHP you could have funded up to ${fmt((TAX_DATA[py.taxYear] || TAX_DATA[2025]).limits.hsa.family)} (family) pre-tax.` });
  }
  if (py.deductionType === 'standard' && ((py.mortgageInterest || 0) + (py.charitableDeduct || 0) + (py.propertyTax || 0) + (py.stateIncomeTax || 0)) > 0) {
    const potentialItemized = (py.mortgageInterest || 0) + (py.charitableDeduct || 0) + Math.min(10000, (py.propertyTax || 0) + (py.stateIncomeTax || 0));
    if (potentialItemized > stdRef * 0.85) {
      missed.push({ icon: '📋', text: `Standard deduction (${fmt(stdRef)}) vs. roughly ${fmt(potentialItemized)} in Schedule A-type expenses. Bunch charitable contributions or plan timing to itemize in a high-expense year.` });
    }
  }
  if (py.wages > 0 && !(py.iraDeduction > 0) && (py.k401 || 0) < k401LimPY * 0.9) {
    missed.push({ icon: '💰', text: `No traditional IRA deduction in the data. If under IRS income limits (and spouse rules), ${fmt(7000)} IRA (${fmt(8000)} at 50+) could save ~${fmt(7000 * marginalRate)}.` });
  }
  if (py.refund > 3000) {
    missed.push({ icon: '💸', text: `${fmt(py.refund)} refund — consider W-4 adjustment so you are not lending the IRS money interest-free.` });
  }
  if (py.totalTax > 0 && py.agi > 0 && (py.totalTax / py.agi) > 0.2) {
    missed.push({ icon: '📉', text: `Effective rate ${((py.totalTax / py.agi) * 100).toFixed(1)}% — prioritize above-the-line items (401k, HSA, SEP) to lower AGI.` });
  }
  if (py.childcareExpenses > 0 && py.dependentCareFSA === 0 && py.childcareExpenses > 3000) {
    missed.push({ icon: '🏫', text: `You had ${fmt(py.childcareExpenses)} in care expenses but no DCFSA in the data. A Dependent Care FSA saves payroll + income tax on up to $5,000.` });
  }
  if (py.eitc > 0) {
    missed.push({ icon: '⏳', text: 'You received EITC — remember refunds with EITC are held under PATH Act until mid-February; file early for faster processing after release.' });
  }
  if (py.stateRefundTaxable > 0 && py.deductionType === 'itemized') {
    missed.push({ icon: '📌', text: `Taxable state refund (${fmt(py.stateRefundTaxable)}) may flow to this year's income — same if you itemize again and receive a state refund.` });
  }
  if (py.selfEmployed > 0 && !(py.sepSimple > 0)) {
    missed.push({ icon: '🏢', text: `Self-employment income without a large SEP/Solo 401(k) contribution in the data — you can often shelter ~25% of net SE income up to the annual cap.` });
  }

  const provisionCats = buildPriorYearFilingProvisions(py, marginalRate, selectedTaxYear);
  const provisionsHTML = provisionCats.length ? `
    <div class="pyc-provisions-wrap">
      <div class="pyc-provisions-title">📌 Filing provisions for ${selectedTaxYear} (from your ${py.taxYear} return)</div>
      <div class="pyc-provisions-sub">Actionable items tied to what you actually filed before — forms to gather, strategies to repeat or fix, and IRS references.</div>
      ${provisionCats.map(cat => `
        <div class="pyc-prov-cat">
          <div class="pyc-prov-cat-head">${cat.title}</div>
          <div class="pyc-prov-list">
            ${cat.items.map(it => `
              <div class="pyc-prov-item">
                <div>
                  <strong>${it.icon} ${it.title}</strong>
                  ${it.detail}
                  ${it.ref ? `<span class="pyc-prov-ref">${it.ref}</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  ` : '';

  panel.classList.remove('hidden');
  panel.innerHTML = `
    <div class="results-panel py-compare-panel">
      <h3>📊 Year-Over-Year Comparison: ${py.taxYear} → ${selectedTaxYear}</h3>
      <div class="pyc-grid">
        <div class="pyc-col">
          <div class="pyc-year-label">${py.taxYear} (Prior Year)</div>
          <div class="pyc-row"><span>AGI</span><strong>${fmt(py.agi)}</strong></div>
          <div class="pyc-row"><span>Total Tax</span><strong>${fmt(py.totalTax)}</strong></div>
          <div class="pyc-row"><span>Effective Rate</span><strong>${py.agi > 0 ? ((py.totalTax/py.agi)*100).toFixed(1) : '—'}%</strong></div>
          <div class="pyc-row"><span>Deduction</span><strong>${py.deductionType === 'itemized' ? 'Itemized' : 'Standard'} ${fmt(py.deductionAmount)}</strong></div>
          <div class="pyc-row"><span>401(k)</span><strong>${fmt(py.k401)}</strong></div>
          <div class="pyc-row"><span>IRA</span><strong>${fmt(py.iraDeduction)}</strong></div>
          <div class="pyc-row"><span>HSA</span><strong>${fmt(py.hsa)}</strong></div>
          <div class="pyc-row"><span>${py.refund >= 0 ? 'Refund' : 'Owed'}</span><strong style="color:${py.refund >= 0 ? 'var(--success)' : 'var(--danger)'}">${fmt(Math.abs(py.refund))}</strong></div>
        </div>
        <div class="pyc-col pyc-change">
          <div class="pyc-year-label">Change</div>
          <div class="pyc-row"><span>&nbsp;</span><strong>${arrow(agiChange, false)}</strong></div>
          <div class="pyc-row"><span>&nbsp;</span><strong>${arrow(taxChange, true)}</strong></div>
          <div class="pyc-row"><span>&nbsp;</span>—</div>
          <div class="pyc-row"><span>&nbsp;</span>—</div>
        </div>
        <div class="pyc-col pyc-current">
          <div class="pyc-year-label">This Year (Projected)</div>
          <div class="pyc-row"><span>AGI</span><strong>${fmt(currentAGI)}</strong></div>
          <div class="pyc-row"><span>Total Tax</span><strong>${fmt(currentTax)}</strong></div>
          <div class="pyc-row"><span>Effective Rate</span><strong>${currentAGI > 0 ? ((currentTax/currentAGI)*100).toFixed(1) : '—'}%</strong></div>
        </div>
      </div>
      ${buildPriorVsCurrentLineTable(py, selectedTaxYear)}
      ${provisionsHTML}
      ${missed.length > 0 ? `
        <div class="pyc-missed-section">
          <div class="pyc-missed-title">🔍 Gaps we spotted on last year's pattern — improve this year</div>
          <div class="pyc-missed-list">
            ${missed.map(m => `
              <div class="pyc-missed-item">
                <span class="pyc-missed-icon">${m.icon}</span>
                <span>${m.text}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : `<div style="color:var(--success);font-weight:600;margin-top:16px;font-size:0.9rem;">🎉 Strong use of common savings levers in your prior data. Review provisions above for anything new in ${selectedTaxYear}.</div>`}
    </div>
  `;
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  // Keep radio-card highlights in sync
  document.querySelectorAll('.radio-card input').forEach(inp => {
    inp.addEventListener('change', () => {
      document.querySelectorAll(`.radio-card input[name="${inp.name}"]`).forEach(i => {
        i.closest('.radio-card')?.classList.toggle('selected', i.checked);
      });
    });
  });

  // Show senior banner dynamically when age 65+ is entered
  ['taxpayerAge', 'spouseAge'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateSeniorBanner);
  });

  // Init drag-and-drop on upload zone
  initDropZone();

  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), wait);
    };
  }
  const liveRefresh = debounce(() => {
    if (priorYearData) {
      try {
        calculateTaxes({ previewOnly: true });
      } catch (e) {
        console.warn('Live tax preview:', e);
      }
    }
  }, 450);
  document.getElementById('form-section')?.addEventListener('input', liveRefresh);
  document.getElementById('form-section')?.addEventListener('change', liveRefresh);
  document.getElementById('taxYear')?.addEventListener('change', () => {
    if (priorYearData) renderPriorMappingPanel();
  });
});
