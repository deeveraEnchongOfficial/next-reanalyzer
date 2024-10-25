const MONTHS_IN_YEAR = 12;
const DEFAULT_ANNUAL_INCREASE_RATE = 0.02;

interface YearlyResult {
  grossRent: string;
  vacancy: string;
  otherIncome: string;
  operatingIncome: string;
  propertyTaxes: string;
  insurance: string;
  propertyManagement: string;
  maintenance: string;
  capitalReserves: string;
  operatingExpenses: string;
  netOperatingIncome: string;
  loanPayments: string;
  cashFlow: string;
}

interface TransposedResult {
  metric: string;
  [key: string]: string; // Dynamic keys for each year
}

export function proFormula(
  years: number,
  grossRent: number,
  otherIncome: number
): TransposedResult[] {
  const annualIncreaseRate = 0.02; // 2% increase
  const vacancyRate = 0.1; // 10% vacancy rate
  let propertyTaxes = 1750; // Initial Property Taxes
  let insurance = 1000; // Initial Insurance
  const propertyManagementRate = 0.1; // 10% of Operating Income
  const maintenanceRate = 0.11; // 11% of Operating Income
  const capitalReservesRate = 0.08; // 8% of Operating Income
  const LOAN_PAYMNENT = 5058;

  const resultsByYear: YearlyResult[] = [];

  // Calculate results for each year
  for (let year = 1; year <= years; year++) {
    const vacancy = grossRent * vacancyRate;
    const operatingIncome = grossRent - vacancy + otherIncome;

    const propertyManagement =
      (grossRent + otherIncome) * propertyManagementRate;
    const maintenance = (grossRent + vacancy) * maintenanceRate;
    const capitalReserves = (grossRent + vacancy) * capitalReservesRate;

    const operatingExpenses =
      propertyTaxes +
      insurance +
      propertyManagement +
      maintenance +
      capitalReserves;
    const netOperatingIncome = operatingIncome - operatingExpenses;
    const cashFlow = netOperatingIncome - LOAN_PAYMNENT;

    resultsByYear.push({
      grossRent: grossRent.toFixed(2),
      vacancy: vacancy.toFixed(2),
      otherIncome: otherIncome.toFixed(2),
      operatingIncome: operatingIncome.toFixed(2),
      propertyTaxes: propertyTaxes.toFixed(2),
      insurance: insurance.toFixed(2),
      propertyManagement: propertyManagement.toFixed(2),
      maintenance: maintenance.toFixed(2),
      capitalReserves: capitalReserves.toFixed(2),
      operatingExpenses: operatingExpenses.toFixed(2),
      netOperatingIncome: netOperatingIncome.toFixed(2),
      loanPayments: LOAN_PAYMNENT.toFixed(2),
      cashFlow: cashFlow.toFixed(2),
    });

    // Increase values by 2% for the next year
    grossRent *= 1 + annualIncreaseRate;
    otherIncome *= 1 + annualIncreaseRate;
    propertyTaxes *= 1 + annualIncreaseRate;
    insurance *= 1 + annualIncreaseRate;
  }

  // Transpose results
  const transposedResults: TransposedResult[] = Object.keys(
    resultsByYear[0]
  ).map((metric) => {
    const row: TransposedResult = { metric };
    resultsByYear.forEach((yearResult, index) => {
      row[`year${index + 1}`] = `$${yearResult[metric as keyof YearlyResult]}`;
    });
    return row;
  });

  return transposedResults;
}

export function cashOnCashReturn(
  purchasePrice: number,
  upfrontRepair: number,
  loanDonwPayment: number,
  monthlyLoanPayment: number,
  rent: number,
  otherIncome: number,
  vacancyRate: number,
  operatingExpensesPercentage: number,
  operatingExpenses: number
) {
  const GSR = rent * MONTHS_IN_YEAR;
  const monthlyOtherIncome = otherIncome * MONTHS_IN_YEAR;
  const gsrVacancy = GSR * vacancyRate;
  const netIncomeOperatingExpenses =
    (GSR - gsrVacancy) * operatingExpensesPercentage;
  const operatingExpensesTotal = operatingExpenses;
  const monthlyLoan = monthlyLoanPayment * MONTHS_IN_YEAR;
  const totalCashInvestment =
    purchasePrice * loanDonwPayment +
    upfrontRepair +
    purchasePrice * (1 - loanDonwPayment) * DEFAULT_ANNUAL_INCREASE_RATE;
  const CashOnCashReturn =
    (GSR +
      monthlyOtherIncome -
      (gsrVacancy + netIncomeOperatingExpenses + monthlyLoan)) /
    totalCashInvestment; // Cash Needed

  return CashOnCashReturn;
}

export function mothlyCashFlow(
  rent: number,
  vacancyRate: number,
  operatingExpensesPercentage: number,
  monthlyLoanPayment: number
) {
  const netIncome = rent * (1 - vacancyRate);
  const operatingExpenses = netIncome * operatingExpensesPercentage;
  const loanPayments = monthlyLoanPayment;

  return netIncome - operatingExpenses - loanPayments;
}

export function calculateAmortization({
  principal,
  annualInterestRate,
  years,
}: {
  principal: number;
  annualInterestRate: number;
  years: number;
}) {
  const monthlyInterestRate = annualInterestRate / 12 / 100; // Convert to monthly and percentage
  const numberOfPayments = years * 12;

  // Calculate monthly payment using the amortization formula
  const monthlyPayment =
    (principal *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  const amortizationSchedule = [];
  let balance = principal;

  // Calculate schedule of payments
  for (let i = 0; i < numberOfPayments; i++) {
    const interestPayment = balance * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;

    amortizationSchedule.push({
      month: i + 1,
      monthlyPayment: monthlyPayment.toFixed(2),
      principalPayment: principalPayment.toFixed(2),
      interestPayment: interestPayment.toFixed(2),
      remainingBalance: balance.toFixed(2),
    });
  }

  return {
    monthlyPayment: monthlyPayment.toFixed(2),
    totalPayments: (monthlyPayment * numberOfPayments).toFixed(2),
    totalInterest: (monthlyPayment * numberOfPayments - principal).toFixed(2),
    amortizationSchedule,
  };
}

/**
 * Function to calculate the NPV (Net Present Value) given a rate and cash flows
 * @param rate - The discount rate (e.g., 0.1 for 10%)
 * @param cashFlows - Array of cash flows, with the first being the initial investment (negative)
 */
function calculateNPV(rate: number, cashFlows: number[]): number {
  return cashFlows.reduce((npv, cashFlow, t) => {
    return npv + cashFlow / Math.pow(1 + rate, t);
  }, 0);
}

/**
 * Function to calculate IRR (Internal Rate of Return) iteratively
 * @param cashFlows - Array of cash flows (initial investment as negative value)
 * @param guess - Initial guess for IRR (default: 10%)
 * @returns The computed IRR as a decimal (e.g., 0.1 for 10%)
 */
export function calculateIRR(cashFlows: number[], guess: number = 0.1): number {
  const precision = 1e-6; // Precision for stopping the iteration
  const maxIterations = 1000;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    const npv = calculateNPV(rate, cashFlows);
    const npvPlus = calculateNPV(rate + precision, cashFlows);

    // Derivative of NPV with respect to the rate
    const derivative = (npvPlus - npv) / precision;

    if (Math.abs(npv) < precision) {
      return rate;
    }

    // Newton-Raphson method to update the rate
    rate = rate - npv / derivative;
  }

  throw new Error("IRR calculation did not converge");
}
