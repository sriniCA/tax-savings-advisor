/* =========================================================
   TAX SAVINGS ADVISOR — CALCULATION ENGINE
   Tax Years 2024, 2025, 2026
   ========================================================= */

'use strict';

/* ---- 2024 TAX CONSTANTS ---- */
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
    standardDeduction: {
      single: 15000,
      mfj:    30000,
      mfs:    15000,
      hoh:    22500
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
  // 2026 brackets — estimated based on IRS inflation adjustments (~2.5%)
  // Verify at irs.gov once official figures are published
  2026: {
    brackets: {
      single: [
        { min: 0,       max: 12200,  rate: 0.10 },
        { min: 12200,   max: 49650,  rate: 0.12 },
        { min: 49650,   max: 105950, rate: 0.22 },
        { min: 105950,  max: 202250, rate: 0.24 },
        { min: 202250,  max: 256800, rate: 0.32 },
        { min: 256800,  max: 642100, rate: 0.35 },
        { min: 642100,  max: Infinity, rate: 0.37 }
      ],
      mfj: [
        { min: 0,       max: 24450,  rate: 0.10 },
        { min: 24450,   max: 99350,  rate: 0.12 },
        { min: 99350,   max: 211850, rate: 0.22 },
        { min: 211850,  max: 404450, rate: 0.24 },
        { min: 404450,  max: 513600, rate: 0.32 },
        { min: 513600,  max: 770400, rate: 0.35 },
        { min: 770400,  max: Infinity, rate: 0.37 }
      ],
      mfs: [
        { min: 0,       max: 12200,  rate: 0.10 },
        { min: 12200,   max: 49650,  rate: 0.12 },
        { min: 49650,   max: 105950, rate: 0.22 },
        { min: 105950,  max: 202250, rate: 0.24 },
        { min: 202250,  max: 256800, rate: 0.32 },
        { min: 256800,  max: 385200, rate: 0.35 },
        { min: 385200,  max: Infinity, rate: 0.37 }
      ],
      hoh: [
        { min: 0,       max: 17450,  rate: 0.10 },
        { min: 17450,   max: 66500,  rate: 0.12 },
        { min: 66500,   max: 105950, rate: 0.22 },
        { min: 105950,  max: 202250, rate: 0.24 },
        { min: 202250,  max: 256800, rate: 0.32 },
        { min: 256800,  max: 642100, rate: 0.35 },
        { min: 642100,  max: Infinity, rate: 0.37 }
      ]
    },
    standardDeduction: {
      single: 15700,
      mfj:    31400,
      mfs:    15700,
      hoh:    23550
    },
    ltcgBrackets: {
      single: [
        { min: 0,       max: 49550,  rate: 0.00 },
        { min: 49550,   max: 547000, rate: 0.15 },
        { min: 547000,  max: Infinity, rate: 0.20 }
      ],
      mfj: [
        { min: 0,       max: 99100,  rate: 0.00 },
        { min: 99100,   max: 615000, rate: 0.15 },
        { min: 615000,  max: Infinity, rate: 0.20 }
      ],
      hoh: [
        { min: 0,       max: 66350,  rate: 0.00 },
        { min: 66350,   max: 580850, rate: 0.15 },
        { min: 580850,  max: Infinity, rate: 0.20 }
      ],
      mfs: [
        { min: 0,       max: 49550,  rate: 0.00 },
        { min: 49550,   max: 307500, rate: 0.15 },
        { min: 307500,  max: Infinity, rate: 0.20 }
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
      adoptionCreditMax: 17500,
      capitalLossLimit: 3000,
      energyCreditPct: 0.30
    }
  }
};

/* ---- UTILITY ---- */
const fmt = (n) => '$' + Math.round(Math.abs(n)).toLocaleString();
const fmtPct = (n) => (n * 100).toFixed(1) + '%';
const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);
const n = (id) => parseFloat(document.getElementById(id)?.value) || 0;
const radio = (name) => document.querySelector(`input[name="${name}"]:checked`)?.value || '';

/* ---- STEP NAVIGATION ---- */
let currentStep = 1;
const totalSteps = 7;

function goToStep(step) {
  document.getElementById(`section-${currentStep}`)?.classList.remove('active-section');
  document.querySelectorAll('.step').forEach((el, i) => {
    el.classList.remove('active');
    if (i + 1 < step) el.classList.add('completed');
    else el.classList.remove('completed');
    if (i + 1 === step) el.classList.add('active');
  });
  currentStep = step;
  const next = document.getElementById(`section-${step}`);
  if (next) {
    next.classList.add('active-section');
    next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function editForm() {
  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('form-section').style.display = '';
  goToStep(1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

/* ---- MAIN CALCULATION ---- */
function calculateTaxes() {
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
  const taxableIncomeFull = Math.max(0, agi - chosenDeduction - studentLoanDeduct + (ltcg + dividends));
  const taxableOrdinary   = Math.max(0, agiNoLTCG - chosenDeduction - studentLoanDeduct);
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
  const childTaxCredit      = calcChildTaxCredit(numChildrenUnder17, agi, filingStatus, lim);
  const otherDepCredit      = numOtherDependents * lim.otherDependentCredit;
  const childCareCredit     = calcChildCareCredit(childcareExpenses, numChildrenUnder17, dependentCareFSA, lim);
  const aoCredit            = calcAOCredit(tuitionPaid, numChildrenCollege, lim);
  const energyCredit        = energyImprovement * lim.energyCreditPct;
  const evCredit            = evPurchased ? 7500 : 0;
  const adoptionCredit      = Math.min(adoptionExpenses, lim.adoptionCreditMax);

  const totalCredits = childTaxCredit + otherDepCredit + childCareCredit + aoCredit + energyCredit + evCredit + adoptionCredit;

  // --- TOTAL TAX ---
  const grossTax    = ordinaryTax + ltcgTax + seTax;
  const totalTax    = Math.max(0, grossTax - totalCredits);
  const netTaxDue   = totalTax - federalWithheld;
  const marginalRate = getMarginalRate(taxableOrdinary, brackets);
  const effectiveRate = agi > 0 ? totalTax / agi : 0;

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
    savingsItems.push({ icon: '📉', title: 'Capital Loss Deduction', desc: `${fmt(investmentLossLimit)} of investment losses offsetting income`, amount: fmt(investmentLossLimit * marginalRate) + ' saved', type: 'used' });
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
  if (traditionalIRA > 0 && agi < 36500) {
    untapped.push({ icon: '💫', title: `Saver's Credit (Retirement)`, desc: `Your income may qualify for the Retirement Savings Contributions Credit (Saver's Credit) — worth 10–50% of your retirement contributions. Check Form 8880.`, save: 'Up to $1,000 credit' });
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

  actions.push({ num: actions.length + 1, icon: '👩‍💼', title: `Schedule a CPA Review in Q4 ${nextYear}`, desc: `Meet with a tax professional in October–November ${nextYear} — before the year ends — when you still have time to act on strategies. Year-end tax planning can reduce your bill by thousands. Don't wait until April.`, deadline: 'October/November ' + nextYear, save: 'Proactive savings opportunity' });

  document.getElementById('next-year-plan').innerHTML = `
    <div class="action-items">
      ${actions.map(a => `
        <div class="action-item">
          <div class="a-num">${a.num}</div>
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
      ${taxYear === 2026 ? '<br><span style="color:var(--warning);font-weight:600;">⚠️ 2026 brackets are estimated — verify at irs.gov once official figures are published.</span>' : ''}
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
});
