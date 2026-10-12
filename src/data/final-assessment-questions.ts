// ============================================================================
// RISE USA LMS — Final Assessment Questions (30 questions, 5 per module)
// At least 60% require application, calculation, comparison, or scenario reasoning.
// ============================================================================

import type { AssessmentQuestion } from "./assessment-types";

export const FINAL_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // =========================================================================
  // MODULE 1 — Income, Paychecks & Banking (5 questions)
  // =========================================================================

  // Q1 — Calculation: gross pay (required example)
  {
    id: "fa-m1-q1",
    type: "calculation",
    question:
      "A student works 24 hours at $17.50 per hour. What is the student's gross pay before any deductions?",
    numericAnswer: 420,
    acceptableRangeLow: 420,
    acceptableRangeHigh: 420,
    unit: "$",
    explanation: "Gross pay = hours × rate = 24 × $17.50 = $420.",
    points: 2,
    difficulty: "foundational",
    topic: "income",
    moduleId: "module-1",
    published: true,
    correctAnswer: "420",
  },

  // Q2 — Scenario: paystub interpretation (identify net pay)
  {
    id: "fa-m1-q2",
    type: "scenario",
    question:
      "Review this paystub:\n\nGross Pay: $880\nFederal Tax: -$95\nSocial Security (6.2%): -$54.56\nMedicare (1.45%): -$12.76\nState Tax: -$40\nHealth Insurance: -$25\n\nWhat is the net (take-home) pay?",
    options: ["$652.68", "$725.00", "$880.00", "$785.00"],
    correctAnswer: "$652.68",
    explanation:
      "Net pay = Gross − all deductions = $880 − $95 − $54.56 − $12.76 − $40 − $25 = $652.68.",
    points: 3,
    difficulty: "applied",
    topic: "paychecks",
    moduleId: "module-1",
    published: true,
  },

  // Q3 — Multiple choice: banking comparison (monthly fee, minimum balance, ATM, overdraft)
  {
    id: "fa-m1-q3",
    type: "multiple_choice",
    question:
      "You are comparing two checking accounts. Account A has no monthly fee but requires a $500 minimum balance and charges $3 for non-network ATM withdrawals. Account B charges a $7 monthly fee, has no minimum balance, and offers free ATM withdrawals at all network ATMs. Both charge a $35 overdraft fee. Which factors should you compare to choose the best account for your situation?",
    options: [
      "Only the monthly fee — the account with no fee is always better",
      "Only the minimum balance — you should never have to keep a minimum",
      "The monthly fee, minimum balance requirement, ATM access, and overdraft terms together — weigh them based on your habits",
      "The overdraft fee only — since both charge the same amount, it doesn't matter",
    ],
    correctAnswer:
      "The monthly fee, minimum balance requirement, ATM access, and overdraft terms together — weigh them based on your habits",
    explanation:
      "The best account depends on your individual banking habits. If you can maintain a $500 balance and rarely use non-network ATMs, Account A may save you money. If you need flexibility and use ATMs often, Account B may be worth the $7 fee. Always compare all terms together.",
    points: 2,
    difficulty: "applied",
    topic: "banking",
    moduleId: "module-1",
    published: true,
  },

  // Q4 — Matching: bank-account terms
  {
    id: "fa-m1-q4",
    type: "matching",
    question: "Match each banking term with its correct definition.",
    matches: [
      { left: "Minimum balance", right: "The lowest amount you must keep in the account to avoid a fee" },
      { left: "Overdraft", right: "Spending more than what is in your account, often triggering a fee" },
      { left: "APY", right: "The annual rate of return on a savings account, including compounding" },
      { left: "Routing number", right: "A 9-digit code that identifies your bank for transfers" },
    ],
    correctAnswer: [
      "The lowest amount you must keep in the account to avoid a fee",
      "Spending more than what is in your account, often triggering a fee",
      "The annual rate of return on a savings account, including compounding",
      "A 9-digit code that identifies your bank for transfers",
    ],
    explanation:
      "Understanding these terms helps you compare accounts and avoid unnecessary fees.",
    points: 2,
    difficulty: "applied",
    topic: "banking",
    moduleId: "module-1",
    published: true,
  },

  // Q5 — True/false: gross vs net pay (used sparingly)
  {
    id: "fa-m1-q5",
    type: "true_false",
    question:
      "True or False: Your net pay is always the same as your gross pay because taxes and deductions do not affect what you take home.",
    options: ["True", "False"],
    correctAnswer: "False",
    explanation:
      "Net pay is your gross pay minus all deductions (taxes, insurance, retirement, etc.). Net pay is always less than or equal to gross pay.",
    points: 1,
    difficulty: "foundational",
    topic: "income",
    moduleId: "module-1",
    published: true,
  },

  // =========================================================================
  // MODULE 2 — Budgeting, Saving & Financial Goals (5 questions)
  // =========================================================================

  // Q1 — Calculation: monthly cash flow (required example)
  {
    id: "fa-m2-q1",
    type: "calculation",
    question:
      "Your monthly net income is $1,900. Your total monthly expenses are $1,625. What is your monthly cash flow (net income minus expenses)?",
    numericAnswer: 275,
    acceptableRangeLow: 275,
    acceptableRangeHigh: 275,
    unit: "$",
    explanation: "Cash flow = $1,900 − $1,625 = $275. A positive cash flow means you have money left over to save or invest.",
    points: 2,
    difficulty: "foundational",
    topic: "budgeting",
    moduleId: "module-2",
    published: true,
    correctAnswer: "275",
  },

  // Q2 — Scenario: Life Happens (income decreases, reasonable budget response)
  {
    id: "fa-m2-q2",
    type: "scenario",
    question:
      "Life Happens: Your work hours are cut and your monthly net income drops from $1,900 to $1,500. Your current expenses are $1,625. Which of the following is the most reasonable budget response?",
    options: [
      "Eliminate all discretionary spending immediately and never spend on entertainment again",
      "Review your full budget — look for areas to reduce across fixed, variable, and discretionary categories, and consider whether any fixed costs can be renegotiated",
      "Borrow money to maintain your current spending level",
      "Ignore the change and hope your hours increase next month",
    ],
    correctAnswer:
      "Review your full budget — look for areas to reduce across fixed, variable, and discretionary categories, and consider whether any fixed costs can be renegotiated",
    explanation:
      "A reasonable budget response looks at the full picture. You may reduce some discretionary spending, but you should also review variable expenses, check whether fixed costs can be lowered, and prioritize essential needs. Eliminating all discretionary spending is not always necessary or sustainable.",
    points: 3,
    difficulty: "applied",
    topic: "budgeting",
    moduleId: "module-2",
    published: true,
  },

  // Q3 — Multiple choice: SMART goals
  {
    id: "fa-m2-q3",
    type: "multiple_choice",
    question:
      "Which of the following is the best example of a SMART financial goal?",
    options: [
      "I want to save money someday",
      "I will save $600 for an emergency fund by saving $50 per month for 12 months, starting next payday",
      "I want to be rich",
      "I will try to spend less money",
    ],
    correctAnswer:
      "I will save $600 for an emergency fund by saving $50 per month for 12 months, starting next payday",
    explanation:
      "A SMART goal is Specific ($600 for emergency fund), Measurable ($50/month), Achievable (fits a budget), Relevant (emergency savings), and Time-bound (12 months, starting next payday).",
    points: 2,
    difficulty: "applied",
    topic: "saving",
    moduleId: "module-2",
    published: true,
  },

  // Q4 — Matching: expense types
  {
    id: "fa-m2-q4",
    type: "matching",
    question: "Match each expense type with the correct example.",
    matches: [
      { left: "Fixed expense", right: "Rent of $1,000 per month" },
      { left: "Variable expense", right: "Groceries that change each month" },
      { left: "Periodic expense", right: "Car insurance paid every 6 months" },
      { left: "Discretionary expense", right: "Concert tickets or dining out" },
    ],
    correctAnswer: [
      "Rent of $1,000 per month",
      "Groceries that change each month",
      "Car insurance paid every 6 months",
      "Concert tickets or dining out",
    ],
    explanation:
      "Fixed expenses stay the same each month, variable expenses fluctuate, periodic expenses occur at intervals, and discretionary expenses are wants rather than needs.",
    points: 2,
    difficulty: "applied",
    topic: "budgeting",
    moduleId: "module-2",
    published: true,
  },

  // Q5 — Scenario: emergency savings reasoning
  {
    id: "fa-m2-q5",
    type: "scenario",
    question:
      "A student has a positive monthly cash flow of $275 but no emergency savings. Their car needs a $600 repair next month. Which approach best balances building emergency savings with the upcoming expense?",
    options: [
      "Ignore the car repair and put all $275 into long-term savings",
      "Save $200/month toward the car repair and $75/month toward an emergency fund, adjusting as needed",
      "Put all $275 toward the car repair and nothing toward emergency savings",
      "Borrow $600 for the repair and continue saving $275/month",
    ],
    correctAnswer:
      "Save $200/month toward the car repair and $75/month toward an emergency fund, adjusting as needed",
    explanation:
      "A sinking fund for the known car repair ($200/month) ensures the money is there when needed, while still building emergency savings ($75/month) for unexpected expenses. Balancing both is smarter than putting everything toward one goal.",
    points: 3,
    difficulty: "advanced",
    topic: "saving",
    moduleId: "module-2",
    published: true,
  },

  // =========================================================================
  // MODULE 3 — Credit & Borrowing (5 questions)
  // =========================================================================

  // Q1 — Calculation: credit utilization (required example)
  {
    id: "fa-m3-q1",
    type: "calculation",
    question:
      "You have a credit limit of $1,500 and a current balance of $450. What is your credit utilization rate (as a percentage)?",
    numericAnswer: 30,
    acceptableRangeLow: 30,
    acceptableRangeHigh: 30,
    unit: "%",
    explanation: "Credit utilization = balance ÷ credit limit = $450 ÷ $1,500 = 0.30 = 30%. Experts recommend keeping utilization below 30%.",
    points: 2,
    difficulty: "foundational",
    topic: "credit",
    moduleId: "module-3",
    published: true,
    correctAnswer: "30",
  },

  // Q2 — Scenario: loan comparison (monthly payment alone doesn't determine affordability)
  {
    id: "fa-m3-q2",
    type: "scenario",
    question:
      "You are comparing two auto loans:\n\nLoan A: $250/month for 3 years (36 months) = $9,000 total\nLoan B: $180/month for 5 years (60 months) = $10,800 total\n\nBoth have the same interest rate. Which statement is most accurate?",
    options: [
      "Loan B is more affordable because the monthly payment is lower",
      "Loan A is the better choice because the monthly payment is higher, which means you pay it off faster",
      "Monthly payment alone does not determine affordability or total cost — Loan B costs $1,800 more in total, so you must weigh the lower payment against the higher total cost",
      "Both loans cost the same because the interest rate is identical",
    ],
    correctAnswer:
      "Monthly payment alone does not determine affordability or total cost — Loan B costs $1,800 more in total, so you must weigh the lower payment against the higher total cost",
    explanation:
      "A lower monthly payment often means a longer term and a higher total repayment. Always compare the total cost, not just the monthly payment. Loan B's lower payment costs $1,800 more over the life of the loan.",
    points: 3,
    difficulty: "applied",
    topic: "borrowing",
    moduleId: "module-3",
    published: true,
  },

  // Q3 — Multiple choice: credit reports
  {
    id: "fa-m3-q3",
    type: "multiple_choice",
    question:
      "Which of the following is NOT typically found on a credit report?",
    options: [
      "Payment history for loans and credit cards",
      "Current credit account balances",
      "Your bank account routing number",
      "Public records such as bankruptcies",
    ],
    correctAnswer: "Your bank account routing number",
    explanation:
      "Credit reports contain payment history, account balances, credit inquiries, and public records. They do not contain your bank account routing numbers or passwords.",
    points: 2,
    difficulty: "applied",
    topic: "credit",
    moduleId: "module-3",
    published: true,
  },

  // Q4 — Multiple select: factors affecting credit score
  {
    id: "fa-m3-q4",
    type: "multiple_select",
    question:
      "Which of the following factors commonly affect your credit score? Select all that apply.",
    options: [
      "Payment history (on-time or late payments)",
      "Credit utilization rate",
      "Length of credit history",
      "Your monthly income amount",
      "Types of credit accounts you have",
    ],
    correctAnswer: [
      "Payment history (on-time or late payments)",
      "Credit utilization rate",
      "Length of credit history",
      "Types of credit accounts you have",
    ],
    explanation:
      "Payment history, credit utilization, length of credit history, and types of credit all affect your score. Your income amount does not directly affect your credit score, though lenders may consider it separately.",
    points: 2,
    difficulty: "applied",
    topic: "credit",
    moduleId: "module-3",
    published: true,
  },

  // Q5 — Scenario: cosigning risks
  {
    id: "fa-m3-q5",
    type: "scenario",
    question:
      "Your friend asks you to cosign a loan. If your friend misses payments, what is the most likely consequence for you?",
    options: [
      "Nothing — the lender will only contact your friend",
      "Your credit score may be negatively affected and you could become legally responsible for repaying the loan",
      "Your friend's credit score will improve but yours will stay the same",
      "You will automatically receive a share of the loan amount",
    ],
    correctAnswer:
      "Your credit score may be negatively affected and you could become legally responsible for repaying the loan",
    explanation:
      "Cosigning means you share legal responsibility for the debt. If the primary borrower misses payments, your credit can be damaged and the lender can pursue you for repayment. Cosign only if you can afford to pay the loan yourself.",
    points: 3,
    difficulty: "applied",
    topic: "borrowing",
    moduleId: "module-3",
    published: true,
  },

  // =========================================================================
  // MODULE 4 — Education Financing & Student Loans (5 questions)
  // =========================================================================

  // Q1 — Calculation: funding gap (required example)
  {
    id: "fa-m4-q1",
    type: "calculation",
    question:
      "A student's total annual cost of attendance is $30,000. They receive $16,000 in grants and scholarships and have $2,500 in confirmed savings to apply. What is the remaining funding gap?",
    numericAnswer: 11500,
    acceptableRangeLow: 11500,
    acceptableRangeHigh: 11500,
    unit: "$",
    explanation: "Funding gap = Total cost − Grants/scholarships − Confirmed savings = $30,000 − $16,000 − $2,500 = $11,500.",
    points: 3,
    difficulty: "applied",
    topic: "student_loans",
    moduleId: "module-4",
    published: true,
    correctAnswer: "11500",
  },

  // Q2 — Multiple choice: work-study is not guaranteed upfront free money
  {
    id: "fa-m4-q2",
    type: "multiple_choice",
    question:
      "Which statement about federal work-study is most accurate?",
    options: [
      "Work-study money is guaranteed upfront and does not require you to work",
      "Work-study provides a job that earns money to help pay education expenses, but it is not guaranteed upfront free money — you must work the hours to earn it",
      "Work-study covers all tuition costs automatically",
      "Work-study is the same as a grant and does not need to be earned",
    ],
    correctAnswer:
      "Work-study provides a job that earns money to help pay education expenses, but it is not guaranteed upfront free money — you must work the hours to earn it",
    explanation:
      "Work-study is a part-time job program. You earn money through work, which means it is not guaranteed upfront. You should not count it as guaranteed free money when planning how to cover your funding gap.",
    points: 2,
    difficulty: "applied",
    topic: "student_loans",
    moduleId: "module-4",
    published: true,
  },

  // Q3 — Calculation: multi-year borrowing
  {
    id: "fa-m4-q3",
    type: "calculation",
    question:
      "A student borrows $7,500 per year for 4 years of college. What is the total principal amount borrowed before considering any interest?",
    numericAnswer: 30000,
    acceptableRangeLow: 30000,
    acceptableRangeHigh: 30000,
    unit: "$",
    explanation: "Total principal = $7,500 × 4 years = $30,000. This is the principal only — interest will increase the total repayment amount.",
    points: 2,
    difficulty: "applied",
    topic: "student_loans",
    moduleId: "module-4",
    published: true,
    correctAnswer: "30000",
  },

  // Q4 — Scenario: net price vs cost of attendance
  {
    id: "fa-m4-q4",
    type: "scenario",
    question:
      "College A has a sticker price (total cost of attendance) of $40,000 and offers $22,000 in grants. College B has a sticker price of $25,000 and offers $5,000 in grants. Which college has the lower net price (what you actually pay after grants)?",
    options: [
      "College B, because the sticker price is lower",
      "College A, because its net price is $18,000 compared to College B's $20,000",
      "Both colleges cost the same",
      "Cannot be determined without knowing the interest rate",
    ],
    correctAnswer:
      "College A, because its net price is $18,000 compared to College B's $20,000",
    explanation:
      "Net price = Sticker price − Grants. College A: $40,000 − $22,000 = $18,000. College B: $25,000 − $5,000 = $20,000. College A actually costs less despite having a higher sticker price. Always compare net price, not sticker price.",
    points: 3,
    difficulty: "applied",
    topic: "student_loans",
    moduleId: "module-4",
    published: true,
  },

  // Q5 — Multiple select: funding sources
  {
    id: "fa-m4-q5",
    type: "multiple_select",
    question:
      "Which of the following are legitimate ways to help fund education after high school? Select all that apply.",
    options: [
      "Grants and scholarships that do not need to be repaid",
      "Federal student loans with fixed interest rates and borrower protections",
      "Earnings from a part-time or work-study job",
      "Private loans with variable interest rates and fewer protections",
      "Savings set aside specifically for education",
    ],
    correctAnswer: [
      "Grants and scholarships that do not need to be repaid",
      "Federal student loans with fixed interest rates and borrower protections",
      "Earnings from a part-time or work-study job",
      "Private loans with variable interest rates and fewer protections",
      "Savings set aside specifically for education",
    ],
    explanation:
      "All of these are legitimate funding sources. Grants and scholarships are best (free money). Federal loans offer protections. Work-study and savings reduce borrowing. Private loans are an option but typically have fewer protections and variable rates — use them as a last resort.",
    points: 2,
    difficulty: "applied",
    topic: "student_loans",
    moduleId: "module-4",
    published: true,
  },

  // =========================================================================
  // MODULE 5 — Saving, Investing & Wealth Building (5 questions)
  // =========================================================================

  // Q1 — Scenario: short time horizon, liquidity, risk of loss
  {
    id: "fa-m5-q1",
    type: "scenario",
    question:
      "A student needs $5,000 for tuition in 8 months. They are considering putting all of it into a highly volatile investment that could gain or lose 30% in a short period. Which concepts should they consider most carefully before deciding?",
    options: [
      "Only the potential return — higher returns are always better for short-term goals",
      "The short time horizon, liquidity needs, and risk of loss — money needed soon should not be exposed to high volatility",
      "Only the investment fees — if fees are low, the investment is safe",
      "Diversification alone — as long as the investment is diversified, the time horizon doesn't matter",
    ],
    correctAnswer:
      "The short time horizon, liquidity needs, and risk of loss — money needed soon should not be exposed to high volatility",
    explanation:
      "When you need money in 8 months, a volatile investment could lose value right when you need it. Short time horizon, liquidity (ability to access cash quickly), and risk of loss are the most critical factors. Money needed soon should be in stable, liquid accounts.",
    points: 3,
    difficulty: "applied",
    topic: "investing",
    moduleId: "module-5",
    published: true,
  },

  // Q2 — Scenario: concentration risk
  {
    id: "fa-m5-q2",
    type: "scenario",
    question:
      "A student's investment portfolio consists entirely of stock in a single company. What is the primary concern with this approach?",
    options: [
      "There is no concern — investing in one company you know well is the safest strategy",
      "Concentration risk — putting all your money in one investment means a single company's failure could wipe out your entire portfolio",
      "The concern is only about fees — single-stock portfolios always have the highest fees",
      "The concern is liquidity — single stocks cannot be sold",
    ],
    correctAnswer:
      "Concentration risk — putting all your money in one investment means a single company's failure could wipe out your entire portfolio",
    explanation:
      "Concentration risk is the danger of having too much of your money in one investment. Diversifying across different investments and asset classes reduces the impact of any single investment performing poorly.",
    points: 3,
    difficulty: "applied",
    topic: "investing",
    moduleId: "module-5",
    published: true,
  },

  // Q3 — Multiple choice: investment scam warning sign
  {
    id: "fa-m5-q3",
    type: "multiple_choice",
    question:
      "Someone approaches you with an investment opportunity and says, 'Guaranteed high returns with no risk — you'll double your money in 30 days.' What is the biggest warning sign?",
    options: [
      "The 30-day timeline is too short for any investment",
      "Guaranteed high returns with no risk — no legitimate investment can guarantee high returns without risk; this is a major warning sign of fraud",
      "The person is not wearing a suit",
      "The investment is only available to a limited number of people",
    ],
    correctAnswer:
      "Guaranteed high returns with no risk — no legitimate investment can guarantee high returns without risk; this is a major warning sign of fraud",
    explanation:
      "All investments carry some level of risk. The higher the potential return, the higher the risk. Anyone promising guaranteed high returns with no risk is likely running a scam. Always verify investment opportunities through independent, trusted sources.",
    points: 2,
    difficulty: "applied",
    topic: "fraud_protection",
    moduleId: "module-5",
    published: true,
  },

  // Q4 — Multiple select: diversification principles
  {
    id: "fa-m5-q4",
    type: "multiple_select",
    question:
      "Which of the following are sound principles of diversification? Select all that apply.",
    options: [
      "Spreading investments across different asset classes (stocks, bonds, cash)",
      "Investing in a variety of industries or sectors",
      "Putting all your money into one stock that you believe will perform well",
      "Considering investments with different levels of risk and return",
    ],
    correctAnswer: [
      "Spreading investments across different asset classes (stocks, bonds, cash)",
      "Investing in a variety of industries or sectors",
      "Considering investments with different levels of risk and return",
    ],
    explanation:
      "Diversification means spreading your money across different asset classes, sectors, and risk levels. Putting all your money into one stock is the opposite of diversification and creates concentration risk.",
    points: 2,
    difficulty: "applied",
    topic: "investing",
    moduleId: "module-5",
    published: true,
  },

  // Q5 — Calculation: investment fees impact
  {
    id: "fa-m5-q5",
    type: "calculation",
    question:
      "You invest $5,000 in a fund that charges a 1.5% annual fee. How much will you pay in fees in the first year (based on the initial investment amount)?",
    numericAnswer: 75,
    acceptableRangeLow: 75,
    acceptableRangeHigh: 75,
    unit: "$",
    explanation: "Annual fee = $5,000 × 0.015 = $75. Over many years, fees compound and can significantly reduce your returns. Always compare fees when choosing investments.",
    points: 2,
    difficulty: "applied",
    topic: "investing",
    moduleId: "module-5",
    published: true,
    correctAnswer: "75",
  },

  // =========================================================================
  // MODULE 6 — Cars, Housing, Insurance & Protection (5 questions)
  // =========================================================================

  // Q1 — Calculation: total car ownership cost (required example)
  {
    id: "fa-m6-q1",
    type: "calculation",
    question:
      "Your monthly car payment is $340, insurance is $185, fuel is $145, and you set aside $80 for maintenance savings. What is your total monthly vehicle cost?",
    numericAnswer: 750,
    acceptableRangeLow: 750,
    acceptableRangeHigh: 750,
    unit: "$",
    explanation: "Total = $340 + $185 + $145 + $80 = $750/month. The advertised car payment of $340 is less than half the real monthly cost of ownership.",
    points: 2,
    difficulty: "applied",
    topic: "cars",
    moduleId: "module-6",
    published: true,
    correctAnswer: "750",
  },

  // Q2 — Calculation: housing cost (rent + utilities + internet + insurance + parking)
  {
    id: "fa-m6-q2",
    type: "calculation",
    question:
      "You are renting an apartment. Monthly rent is $1,200, utilities average $180, internet is $55, renters insurance is $18, and parking is $75. What is your total monthly housing-related cost?",
    numericAnswer: 1528,
    acceptableRangeLow: 1528,
    acceptableRangeHigh: 1528,
    unit: "$",
    explanation: "Total = $1,200 + $180 + $55 + $18 + $75 = $1,528/month. Always budget for the full cost of housing, not just rent.",
    points: 2,
    difficulty: "applied",
    topic: "housing",
    moduleId: "module-6",
    published: true,
    correctAnswer: "1528",
  },

  // Q3 — Scenario: phishing response
  {
    id: "fa-m6-q3",
    type: "scenario",
    question:
      "You receive a text message that appears to be from your bank: 'Your account has been compromised. Click this link immediately to verify your identity and secure your funds.' What is the safest response?",
    options: [
      "Click the link and enter your account information to secure your funds",
      "Reply to the text with your account number so the bank can verify you",
      "Do not click the link; independently contact the financial institution through a verified channel (call the number on your card or the official website)",
      "Forward the text to friends to warn them, then click the link",
    ],
    correctAnswer:
      "Do not click the link; independently contact the financial institution through a verified channel (call the number on your card or the official website)",
    explanation:
      "Phishing messages create urgency to trick you into clicking malicious links or sharing personal information. Never click links in suspicious messages. Always contact your bank independently through a verified channel — the phone number on your card or the official website you navigate to yourself.",
    points: 3,
    difficulty: "applied",
    topic: "fraud_protection",
    moduleId: "module-6",
    published: true,
  },

  // Q4 — Multiple choice: lease terms
  {
    id: "fa-m6-q4",
    type: "multiple_choice",
    question:
      "When reviewing an apartment lease before signing, which of the following should you look for most carefully?",
    options: [
      "Only the monthly rent amount",
      "The lease term length, early termination terms, security deposit conditions, maintenance responsibilities, and any fees — review all terms before signing",
      "Only whether parking is included",
      "Only the color of the walls",
    ],
    correctAnswer:
      "The lease term length, early termination terms, security deposit conditions, maintenance responsibilities, and any fees — review all terms before signing",
    explanation:
      "A lease is a legal contract. You should understand the full term, what happens if you need to break the lease early, how your security deposit is handled, who is responsible for repairs, and any additional fees. Never sign a lease you have not fully read and understood.",
    points: 2,
    difficulty: "applied",
    topic: "housing",
    moduleId: "module-6",
    published: true,
  },

  // Q5 — Multiple select: insurance types
  {
    id: "fa-m6-q5",
    type: "multiple_select",
    question:
      "Which of the following types of insurance are commonly important for a young adult to understand? Select all that apply.",
    options: [
      "Auto liability insurance (covers damage you cause to others)",
      "Renters insurance (covers your personal belongings and liability)",
      "Health insurance (helps pay for medical care)",
      "Investment insurance that guarantees no losses on any stock",
      "Identity-theft protection (helps monitor and recover from identity fraud)",
    ],
    correctAnswer: [
      "Auto liability insurance (covers damage you cause to others)",
      "Renters insurance (covers your personal belongings and liability)",
      "Health insurance (helps pay for medical care)",
      "Identity-theft protection (helps monitor and recover from identity fraud)",
    ],
    explanation:
      "Auto liability, renters, health, and identity-theft protection are all important insurance types for young adults. 'Investment insurance that guarantees no losses' does not exist — it is a sign of a potential scam.",
    points: 2,
    difficulty: "applied",
    topic: "insurance",
    moduleId: "module-6",
    published: true,
  },
];
