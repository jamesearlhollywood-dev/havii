import type { CourseModule } from "../course-types";

export const module1: CourseModule = {
  id: "module-1",
  number: 1,
  title: "Your Money Starts Here — Income, Paychecks & Banking",
  subtitle:
    "Understand what you earn, what comes out of your paycheck, where your money goes, and what you are agreeing to when you open a financial account.",
  estimatedTime: "100 minutes",
  icon: "🏦",
  themeColor: "rise-navy",
  overview:
    "Before you can budget, save, or invest, you need to understand how money comes in and where it goes. This module walks through the different ways people earn income, how to calculate gross pay, and what separates gross pay from the net pay that actually reaches your bank account. You will learn to read every section of a paystub, understand required and voluntary deductions, and know what Forms W-4 and W-2 are for. Then we cover banking — checking accounts, savings accounts, debit cards, direct deposit, APY, common fees, overdraft policies, and deposit insurance. Most importantly, you will learn what you are agreeing to when you open a financial account and what to review before you sign. By the end, you will be able to read a paystub, compare bank-account options, and make informed decisions about where your money goes.",
  objectives: [
    "Explain common ways people earn income",
    "Calculate gross pay from hourly wages",
    "Distinguish gross pay from net pay",
    "Identify common payroll deductions",
    "Explain the basic purposes of Forms W-4 and W-2",
    "Read the major sections of a paystub",
    "Explain the difference between checking and savings accounts",
    "Distinguish debit cards from credit cards",
    "Identify common banking fees and account terms",
    "Explain what FDIC and NCUA deposit insurance generally protect",
    "Identify important information to review before opening a bank or credit-union account",
  ],
  lessons: [
    // ======================================================================
    // LESSON 1 — MONEY IN: HOW INCOME WORKS
    // ======================================================================
    {
      id: "m1-l1",
      title: "Money In: How You Get Paid",
      subtitle: "The different ways people earn income — and why the type matters",
      estimatedMinutes: 12,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What Is Income?", level: 2 },
        { type: "paragraph", text: "Income is money you receive in exchange for work, services, or other sources. For most people starting out, income comes from a job. But not every job pays the same way. Understanding the type of income you earn affects how you're paid, how taxes work, and how you plan your budget." },
        { type: "heading", text: "Common Ways People Earn Income", level: 3 },
        { type: "list", items: [
          "Earned income — money you receive from working. This is the most common type of income for people starting out.",
          "Hourly wages — you earn a set amount for each hour you work. If your rate is $18 per hour and you work 25 hours, your gross pay is $450.",
          "Salary — a fixed annual amount paid in regular installments (usually biweekly or semimonthly). Salaried employees typically don't receive overtime, but their income is more predictable.",
          "Tips — extra money from customers, common in food service. Tips are taxable income and must be reported.",
          "Commissions — a percentage of sales you make, common in retail and sales jobs.",
          "Bonuses — one-time payments for strong performance or meeting goals.",
          "Contract or gig income — you're paid per project or gig. You handle your own taxes and benefits, and income can vary month to month.",
        ]},
        { type: "callout", calloutType: "info", text: "Income can vary depending on the type of work. Hourly workers may see different paychecks each period. Gig workers may have busy months and slow months. Salaried workers usually see the same gross pay each period. Knowing your income type helps you plan." },
        { type: "heading", text: "Gross Income", level: 3 },
        { type: "definition", text: "Gross income is the total amount you earn before any deductions or taxes are taken out. It is the starting point — not the amount that reaches your bank account." },
        { type: "heading", text: "Let's Calculate: Jordan's Gross Pay", level: 3 },
        { type: "example", text: "Jordan works 25 hours this week at $18 per hour. Gross pay = hourly rate × hours worked = $18 × 25 = $450. This is what Jordan earned before any deductions." },
        { type: "callout", calloutType: "tip", text: "Try it yourself: If you earned $15 per hour and worked 20 hours, what would your gross pay be? (Answer: $300)" },
        { type: "heading", text: "A Note on Overtime", level: 3 },
        { type: "paragraph", text: "Some hourly jobs pay overtime — a higher rate for hours worked beyond a certain threshold. Overtime rules vary by employer and jurisdiction, and not every job offers overtime. When overtime does apply, it is often 1.5× the regular hourly rate. Do not assume every job has the same overtime rules — check your employer's policy or your offer letter." },
        { type: "callout", calloutType: "warning", text: "Key takeaway: What you earn before deductions is not necessarily what reaches your bank account. Gross pay is the starting point — net pay is what you actually receive." },
      ],
    },

    // ======================================================================
    // LESSON 2 — YOUR FIRST PAYCHECK
    // ======================================================================
    {
      id: "m1-l2",
      title: "Gross Pay vs. Net Pay",
      subtitle: "Reading a paystub and understanding what comes out",
      estimatedMinutes: 15,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Gross Pay vs. Net Pay", level: 2 },
        { type: "paragraph", text: "Gross pay is the total amount you earned during a pay period before anything is taken out. Net pay — often called 'take-home pay' — is what actually reaches your bank account after all deductions. The difference between the two can be significant, and understanding it is one of the most important skills in this module." },
        { type: "definition", text: "Gross pay: Total earnings before any deductions. Net pay: What you actually receive after all deductions are taken out." },
        { type: "heading", text: "Key Sections of a Paystub", level: 3 },
        { type: "paragraph", text: "Your paystub is a detailed record of what you earned and what was taken out. Even if you receive direct deposit, you can usually access your paystub through your employer's payroll system. Here are the major sections you should be able to find and read:" },
        { type: "table", headers: ["Section", "What It Shows"], rows: [
          ["Employee Info", "Your name, address, and employee ID"],
          ["Current Pay Period", "The specific dates you're being paid for in this check"],
          ["Gross Pay", "Total earnings for this pay period before any deductions"],
          ["Deductions", "Each individual deduction — taxes, insurance, retirement, etc."],
          ["Total Deductions", "The sum of all deductions for this pay period"],
          ["Net Pay", "What you actually receive (gross pay minus all deductions)"],
          ["Year-to-Date (YTD)", "Running totals of your earnings and deductions from January 1 to now"],
        ]},
        { type: "heading", text: "Current Pay Period vs. Year-to-Date", level: 3 },
        { type: "paragraph", text: "Most paystubs show two sets of numbers: the current pay period (what you earned and what was deducted for just this paycheck) and year-to-date (a running total from January 1 through the current pay period). Year-to-date helps you track how much you've earned and paid in taxes throughout the year." },
        { type: "heading", text: "Taylor Morgan's Paystub", level: 3 },
        { type: "callout", calloutType: "warning", text: "The paystub below is for educational purposes only. Actual deduction amounts vary depending on your income, location, tax situation, and benefits. Do not treat these fictional amounts as universal tax rates." },
        { type: "table", headers: ["Line Item", "Amount"], rows: [
          ["Employee", "Taylor Morgan"],
          ["Job", "Part-time customer service associate"],
          ["Pay Period", "One week (current period)"],
          ["Hours Worked", "30"],
          ["Pay Rate", "$18.00/hour"],
          ["Gross Pay", "$540.00"],
          ["— Federal income tax withholding", "−$43.20 (fictional)"],
          ["— Social Security (6.2%)", "−$33.48"],
          ["— Medicare (1.45%)", "−$7.83"],
          ["— State/local income tax withholding", "−$16.20 (fictional)"],
          ["— Health insurance premium (optional benefit)", "−$25.00 (fictional)"],
          ["Total Deductions", "−$125.71"],
          ["Net Pay (take-home)", "$414.29"],
        ]},
        { type: "paragraph", text: "Taylor earned $540.00 in gross pay. After $125.71 in deductions, Taylor's net pay — the amount deposited into the bank account — is $414.29. That is a difference of over $125, or about 23% of gross pay." },
        { type: "callout", calloutType: "info", text: "Practice: Using Taylor's paystub, can you identify the hours worked, pay rate, gross pay, each deduction, total deductions, and net pay? These are the six things you should always be able to find on any paystub." },
        { type: "callout", calloutType: "warning", text: "Always budget based on net pay, not gross pay. If your gross pay is $540, your take-home might be closer to $414. Plan your spending around what actually lands in your account." },
      ],
    },

    // ======================================================================
    // LESSON 3 — WHERE DID MY MONEY GO?
    // ======================================================================
    {
      id: "m1-l3",
      title: "Understanding Payroll Deductions",
      subtitle: "Required vs. voluntary — and what each one pays for",
      estimatedMinutes: 12,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Two Categories of Deductions", level: 2 },
        { type: "paragraph", text: "Not all deductions are the same. Some are required by law — taxes you owe. Others are voluntary — benefits you chose to participate in. Understanding the difference helps you see where your money goes and why." },
        { type: "heading", text: "Required or Tax-Related Deductions", level: 3 },
        { type: "paragraph", text: "These are amounts your employer is legally required to withhold from your paycheck:" },
        { type: "list", items: [
          "Federal income tax withholding — money set aside for your federal income taxes. The amount depends on your W-4, your income, and other factors.",
          "State and/or local income tax withholding — depends on where you live. Some states have no income tax; others charge state and local income tax.",
          "Social Security tax — 6.2% of your wages, up to an annual cap. Funds retirement and disability benefits.",
          "Medicare tax — 1.45% of all wages. Funds healthcare for people 65 and older and some younger people with disabilities.",
        ]},
        { type: "callout", calloutType: "info", text: "Social Security and Medicare taxes are commonly referred to together as FICA taxes. FICA stands for the Federal Insurance Contributions Act." },
        { type: "heading", text: "Voluntary Deductions or Benefits", level: 3 },
        { type: "paragraph", text: "These are deductions you choose to participate in. They reduce your net pay, but they pay for benefits you selected:" },
        { type: "list", items: [
          "Health insurance premiums — if you enroll in an employer-sponsored health plan.",
          "Retirement contributions — such as a 401(k), deducted from your pay before taxes.",
          "Other employee benefits — such as flexible spending accounts (FSAs), life insurance, or disability insurance.",
        ]},
        { type: "callout", calloutType: "tip", text: "A deduction is not automatically 'money lost.' Some deductions pay taxes you owe. Others fund benefits you selected — like health insurance or retirement savings. Understanding what each deduction pays for helps you make better decisions about your benefits." },
        { type: "callout", calloutType: "warning", text: "This module provides general, introductory information about payroll deductions. It does not give individualized tax advice. Tax rules can change. For your specific situation, use current official IRS guidance or consult a qualified tax professional." },
      ],
    },

    // ======================================================================
    // LESSON 4 — EMPLOYMENT TAX DOCUMENTS
    // ======================================================================
    {
      id: "m1-l4",
      title: "W-4, W-2, and Why You Should Not Just Click Through",
      subtitle: "Two forms you'll encounter — and why reading them matters",
      estimatedMinutes: 12,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Form W-4", level: 2 },
        { type: "paragraph", text: "When you start a new job, your employer will ask you to complete Form W-4 (Employee's Withholding Certificate). This form helps your employer determine how much federal income tax to withhold from each paycheck." },
        { type: "list", items: [
          "Usually completed when starting a job, as part of onboarding.",
          "Helps your employer determine federal income-tax withholding — how much to set aside from each paycheck for federal taxes.",
          "You can update it later if your situation changes (for example, a second job or a change in dependents).",
          "Students should read the form and its instructions instead of guessing or randomly selecting options.",
        ]},
        { type: "callout", calloutType: "tip", text: "If you're a student with a part-time job and no dependents, the W-4 is usually straightforward. But you should still read the instructions carefully. The choices you make affect how much tax is withheld — and whether you get a refund or owe money at tax time." },
        { type: "heading", text: "Form W-2", level: 2 },
        { type: "paragraph", text: "After the end of each year, your employer generally provides you with Form W-2 — a summary of your annual wages and certain taxes withheld." },
        { type: "list", items: [
          "Generally provided by employers after the end of the calendar year (usually by January 31).",
          "Summarizes your total wages and certain taxes withheld for the year.",
          "Used when preparing your federal income-tax return.",
          "You should receive a W-2 from every employer you worked for during the year.",
        ]},
        { type: "callout", calloutType: "info", text: "Tax rules can change. When completing real tax forms, always use current official IRS guidance. Do not rely on this module for specific tax advice — it provides general information only." },
        { type: "heading", text: "Practical Prompt", level: 3 },
        { type: "callout", calloutType: "tip", text: "You are starting your first job and the onboarding system asks you to complete a W-4. What should you do?" },
        { type: "paragraph", text: "Correct principle: Read the instructions carefully and use current official guidance rather than randomly selecting options. The W-4 affects how much tax is withheld from every paycheck. Taking a few minutes to understand it now can prevent surprises at tax time." },
      ],
    },

    // ======================================================================
    // LESSON 5 — WHERE YOUR PAYCHECK GOES
    // ======================================================================
    {
      id: "m1-l5",
      title: "Checking, Savings & Direct Deposit",
      subtitle: "Where your paycheck goes and how your accounts work",
      estimatedMinutes: 14,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Checking Accounts", level: 2 },
        { type: "paragraph", text: "A checking account is your everyday spending account. You use it for debit card purchases, bill payments, and ATM withdrawals. Money in checking is easily accessible but typically earns little or no interest." },
        { type: "heading", text: "Savings Accounts", level: 2 },
        { type: "paragraph", text: "A savings account is for money you don't need immediately. It earns interest — the bank pays you for keeping your money there. Savings accounts are designed for accumulating, not everyday spending." },
        { type: "heading", text: "Checking vs. Savings at a Glance", level: 3 },
        { type: "table", headers: ["Feature", "Checking", "Savings"], rows: [
          ["Main purpose", "Everyday transactions", "Saving money"],
          ["Debit-card access", "Often", "Varies"],
          ["Interest/APY", "Sometimes", "Often"],
          ["Transaction features", "High", "May vary"],
        ]},
        { type: "heading", text: "Direct Deposit", level: 3 },
        { type: "paragraph", text: "Direct deposit sends your paycheck electronically to your bank account — usually available the morning of payday. It's faster, safer, and more reliable than a paper check. Most employers require or strongly prefer direct deposit." },
        { type: "heading", text: "Other Key Terms", level: 3 },
        { type: "list", items: [
          "Debit card — a card that accesses money in your deposit account. You can only spend what's in your account.",
          "ATM access — withdraw cash from your account at automated teller machines. Using in-network ATMs is usually free; out-of-network ATMs may charge fees.",
          "Electronic transfers — move money between accounts or send money to others electronically.",
          "Available balance — the amount of money in your account that is available to spend right now.",
          "Pending transaction — a transaction that has been initiated but has not yet fully processed. It may reduce your available balance before it posts.",
          "Interest — money the bank pays you for keeping your money in a savings account. Expressed as a percentage of your balance.",
          "APY (Annual Percentage Yield) — the yearly rate of return on a savings account, including compound interest. A higher APY means your money grows faster.",
        ]},
        { type: "heading", text: "Debit Card vs. Credit Card", level: 3 },
        { type: "callout", calloutType: "info", text: "A debit card accesses money in your deposit account. A credit card generally involves borrowing money that you must pay back, often with interest if you don't pay the full balance each month." },
        { type: "paragraph", text: "This is an important distinction. With a debit card, you're spending your own money. With a credit card, you're borrowing money from the card issuer. Debit cards don't build credit history; credit cards can — but only if used responsibly." },
        { type: "callout", calloutType: "tip", text: "This module does not recommend any specific financial institution. When you're ready to open an account, compare options from multiple banks and credit unions to find the one that fits your needs." },
      ],
    },

    // ======================================================================
    // LESSON 6 — WHAT DID YOU JUST AGREE TO?
    // ======================================================================
    {
      id: "m1-l6",
      title: "Read Before You Open the Account",
      subtitle: "Understanding account agreements, fees, and terms",
      estimatedMinutes: 18,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Opening an Account Is an Agreement", level: 2 },
        { type: "paragraph", text: "Opening a financial account creates a legal agreement between you and the financial institution. When you sign up, you are agreeing to the institution's terms — and those terms can include fees, conditions, and policies that affect your money. This is one of the most important lessons in Module 1." },
        { type: "callout", calloutType: "warning", text: "Do not choose a bank account only because someone gives you a debit card. Understand the account behind the card. The card is just a tool — the account terms are what actually matter." },
        { type: "heading", text: "What to Review Before Opening an Account", level: 3 },
        { type: "paragraph", text: "Before you open any account, take time to review these key items:" },
        { type: "list", items: [
          "Account agreement — the legal contract defining your rights and responsibilities.",
          "Fee schedule — a list of all charges that may apply and when.",
          "Minimum balance requirements — the amount you must keep in the account to avoid fees.",
          "Monthly maintenance fees — recurring charges just for having the account, sometimes avoidable.",
          "ATM fees — charges for using ATMs, especially out-of-network machines.",
          "Overdraft policies — what happens when you spend more than what's in your account.",
          "Insufficient-funds policies — what happens when a transaction is attempted without enough money.",
          "Funds-availability rules — how long it takes for deposited money to become available to spend.",
          "Interest/APY — the rate your savings will earn, if any.",
          "Electronic-transfer terms — rules for moving money in and out electronically.",
          "Debit-card terms — rules, protections, and limits for debit card use.",
          "Joint-account ownership — if more than one person owns the account, what rights each person has.",
          "Account-closing rules — how to close the account and whether there are fees for doing so.",
        ]},
        { type: "heading", text: "Two-Account Comparison Activity", level: 3 },
        { type: "paragraph", text: "Compare these two fictional account options. Think about which might be better for different situations." },
        { type: "table", headers: ["Feature", "Account A", "Account B"], rows: [
          ["Monthly fee", "$0", "$8 (unless requirements are met)"],
          ["Minimum balance", "None", "$500 to waive the $8 fee"],
          ["ATM network", "Large", "Smaller"],
          ["APY (checking/savings)", "0.01% APY on checking", "0.25% APY"],
          ["Overdraft settings", "Optional (you can choose)", "Standard policy applies"],
        ]},
        { type: "callout", calloutType: "tip", text: "Ask yourself: Which account may be better for a student with a small balance? What questions should be asked before choosing? There is not always one universally correct account — the right choice depends on your situation, your balance, and your habits." },
        { type: "paragraph", text: "Account A has no monthly fee and no minimum balance, which may be better for a student who keeps a small balance. Account B offers a higher APY (0.25% vs. 0.01%), but charges $8 per month unless you maintain a $500 minimum balance. If your balance is often below $500, Account B's fees could cost more than the interest you earn." },
        { type: "callout", calloutType: "info", text: "Before choosing, ask: What is the monthly fee? What is the minimum balance? How large is the ATM network? What are the overdraft terms? What is the APY? Is the institution federally insured? The answers help you match the account to your needs." },
      ],
    },

    // ======================================================================
    // LESSON 7 — PROTECTING DEPOSITS
    // ======================================================================
    {
      id: "m1-l7",
      title: "FDIC, NCUA & Deposit Insurance",
      subtitle: "What's protected — and what isn't",
      estimatedMinutes: 12,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What Is Deposit Insurance?", level: 2 },
        { type: "paragraph", text: "Deposit insurance protects your money if your bank or credit union fails. In the United States, two federal agencies provide this protection:" },
        { type: "list", items: [
          "FDIC (Federal Deposit Insurance Corporation) — insurance applies to eligible deposits at FDIC-insured banks.",
          "NCUA (National Credit Union Administration) — share insurance applies to eligible deposits at federally insured credit unions.",
        ]},
        { type: "callout", calloutType: "info", text: "Deposit insurance is different from investment protection. Deposit insurance protects money in deposit accounts (like checking and savings). It does not protect investments — even if you purchased them through a financial company." },
        { type: "heading", text: "What Is Protected — and What Isn't", level: 3 },
        { type: "paragraph", text: "It is important to understand the difference between deposits and investments:" },
        { type: "table", headers: ["Generally Protected (Deposit Insurance)", "Not Protected by Deposit Insurance"], rows: [
          ["Checking accounts at FDIC-insured banks", "Stocks"],
          ["Savings accounts at FDIC-insured banks", "Cryptocurrency"],
          ["Deposit accounts at federally insured credit unions", "Mutual funds"],
          ["Certificates of deposit (CDs) at insured institutions", "Bonds (though they have other protections)"],
        ]},
        { type: "callout", calloutType: "warning", text: "Stocks, cryptocurrency, mutual funds, and other investments are not FDIC-insured simply because they may be purchased through a financial company. Know what is protected and what is not." },
        { type: "heading", text: "Verify Before You Open", level: 3 },
        { type: "paragraph", text: "Before opening an account, verify whether the financial institution is federally insured. You can usually find this information on the institution's website, in the account agreement, or by asking a representative. Look for the FDIC or NCUA logo or disclosure." },
        { type: "callout", calloutType: "info", text: "Deposit insurance coverage limits and rules can change. Regulatory limits are not hardcoded in this module. For current limits and details, check the official FDIC (fdic.gov) or NCUA (ncua.gov) websites." },
        { type: "callout", calloutType: "tip", text: "Know what is protected and what is not. Deposit insurance gives you confidence that your deposits are safe — but only at insured institutions and only for eligible deposits." },
      ],
    },
  ],

  // ========================================================================
  // KNOW THE TERMS
  // ========================================================================
  keyTerms: [
    { term: "Income", definition: "Money you receive in exchange for work, services, or other sources." },
    { term: "Gross Pay", definition: "Total earnings before any deductions or taxes are taken out." },
    { term: "Net Pay", definition: "The amount you actually receive after all deductions — also called take-home pay." },
    { term: "Deduction", definition: "Money withheld from your paycheck for taxes, insurance, retirement, or other purposes." },
    { term: "Withholding", definition: "Money your employer sets aside from each paycheck to send to the government for income taxes." },
    { term: "FICA", definition: "Federal Insurance Contributions Act — the law authorizing Social Security and Medicare payroll taxes." },
    { term: "Checking Account", definition: "A bank account for everyday spending, bill payments, and debit card transactions." },
    { term: "Savings Account", definition: "A bank account designed for storing and growing money you don't need immediately; earns interest." },
    { term: "Direct Deposit", definition: "Electronic transfer of your paycheck directly into your bank account." },
    { term: "Debit Card", definition: "A card that accesses money in your deposit account. You can only spend what's in your account." },
    { term: "APY", definition: "Annual Percentage Yield — the yearly rate of return on a savings account, including compound interest." },
    { term: "Overdraft", definition: "When you spend more than what's in your account; the bank may cover it but charges a fee." },
    { term: "Available Balance", definition: "The amount of money in your account that is available to spend right now." },
    { term: "Pending Transaction", definition: "A transaction that has been initiated but has not yet fully processed; may reduce your available balance." },
    { term: "FDIC", definition: "Federal Deposit Insurance Corporation — insures eligible deposits at FDIC-insured banks." },
    { term: "NCUA", definition: "National Credit Union Administration — insures eligible deposits at federally insured credit unions." },
  ],

  // ========================================================================
  // SEE IT IN REAL LIFE
  // ========================================================================
  realLifeScenario: {
    title: "Maya Gets Her First Job",
    setup:
      "Maya is a high-school senior who starts working 20–25 hours per week at a local store. She's excited to earn her own money and calculates what she thinks she'll take home each month.",
    situation:
      "Maya receives her first paycheck and is surprised that the amount deposited into her checking account is lower than the gross-pay amount she calculated. Her employer also offers direct deposit. Maya wants to open her own account and is comparing two institutions. One account looks appealing because there is no monthly fee. Another offers a small amount of interest but requires a minimum balance to avoid an $8 monthly fee.",
    prompt:
      "Think about Maya's situation and answer these questions:\n1. Why might Maya's deposited amount be lower than her gross pay?\n2. What should she review on her paystub?\n3. What should she compare before opening an account?\n4. Why should she read the account agreement?\n5. What role does deposit insurance play?",
  },

  // ========================================================================
  // RISE DECISION LAB
  // ========================================================================
  decisionLab: {
    id: "first-paycheck-lab",
    title: "RISE Decision Lab: My First Paycheck",
    subtitle: "Read a paystub, calculate net pay, compare accounts, and make your choice",
    instructions:
      "You'll examine a fictional paystub, identify each deduction, calculate total deductions and net pay, explain the difference between gross and net pay, then compare two fictional bank-account options and choose the one you'd select. All amounts are fictional and for educational purposes only.",
    fields: [
      // --- Paystub data (provided) ---
      { id: "employeeName", label: "Employee", type: "calculated", description: "From the paystub: Taylor Morgan" },
      { id: "hoursWorked", label: "Hours Worked", type: "calculated", description: "From the paystub: 30 hours" },
      { id: "payRate", label: "Pay Rate", type: "calculated", description: "From the paystub: $18.00/hour" },

      // --- Task 1: Identify gross pay ---
      { id: "grossPay", label: "1. Identify Gross Pay", type: "number", placeholder: "hours × rate", unit: "$", description: "Calculate: 30 hours × $18.00/hour" },

      // --- Task 2: Identify each deduction ---
      { id: "federalTax", label: "2a. Federal Income Tax Withheld", type: "calculated", description: "From the paystub: $43.20 (fictional)" },
      { id: "socialSecurity", label: "2b. Social Security (6.2%)", type: "calculated", description: "From the paystub: $33.48" },
      { id: "medicare", label: "2c. Medicare (1.45%)", type: "calculated", description: "From the paystub: $7.83" },
      { id: "stateTax", label: "2d. State/Local Withholding", type: "calculated", description: "From the paystub: $16.20 (fictional)" },
      { id: "healthInsurance", label: "2e. Health Insurance (optional benefit)", type: "calculated", description: "From the paystub: $25.00 (fictional)" },

      // --- Task 3: Calculate total deductions ---
      { id: "totalDeductions", label: "3. Calculate Total Deductions", type: "number", placeholder: "sum of all deductions", unit: "$", description: "Add up all five deductions above" },

      // --- Task 4: Determine net pay ---
      { id: "netPay", label: "4. Determine Net Pay", type: "number", placeholder: "gross pay − total deductions", unit: "$", description: "Gross pay minus total deductions" },

      // --- Task 5: Explain the difference ---
      { id: "grossNetExplanation", label: "5. Explain the Difference Between Gross and Net Pay", type: "text", placeholder: "In your own words, explain why net pay is lower than gross pay..." },

      // --- Task 6: Compare two bank-account options ---
      { id: "accountComparison", label: "6. Compare Two Bank-Account Options", type: "calculated", description: "Account A: $0 monthly fee, no minimum balance, large ATM network, 0.01% APY, optional overdraft settings. Account B: $8 monthly fee (waived with $500 minimum balance), smaller ATM network, 0.25% APY." },

      // --- Task 7: Select the account ---
      { id: "accountChoice", label: "7. Which Account Would You Choose?", type: "radio", options: [
        { id: "account-a", label: "Account A", description: "$0 monthly fee, no minimum balance, large ATM network, 0.01% APY, optional overdraft settings" },
        { id: "account-b", label: "Account B", description: "$8 monthly fee (waived with $500 min balance), smaller ATM network, 0.25% APY" },
      ]},

      // --- Task 8: Explain reasoning ---
      { id: "reasoning", label: "8. Explain Your Reasoning", type: "text", placeholder: "Why did you choose this account? Consider fees, minimum balance, access, features, deposit insurance, and your fictional financial situation..." },
    ],
    resultPrompt:
      "Your banking choice affects how easily you can save, how much you pay in fees, and how protected your money is. There is no single correct answer — what matters is that you considered fees, minimum balance, access, account features, deposit insurance, and your own financial situation before deciding.",
  },

  // ========================================================================
  // WORKBOOK ACTIVITY
  // ========================================================================
  workbookActivity: {
    title: "My First Paycheck & Banking Checklist",
    instructions:
      "Use this checklist to prepare for your first job, your first paycheck, and your first bank account. Check off each item as you understand it.",
    prompts: [
      "Before starting a job — Know my hourly rate or salary",
      "Before starting a job — Understand how often I am paid (weekly, biweekly, monthly)",
      "Before starting a job — Review onboarding forms (including the W-4)",
      "Before starting a job — Understand direct-deposit options",
      "When receiving a paycheck — Check hours worked",
      "When receiving a paycheck — Check gross pay",
      "When receiving a paycheck — Review each deduction",
      "When receiving a paycheck — Verify net pay",
      "When receiving a paycheck — Save pay records (paystubs and W-2s)",
      "Before opening an account — Confirm the institution is federally insured (FDIC or NCUA)",
      "Before opening an account — Review monthly fees",
      "Before opening an account — Review minimum balances",
      "Before opening an account — Review ATM access and fees",
      "Before opening an account — Review overdraft terms",
      "Before opening an account — Review APY",
      "Before opening an account — Read the account agreement",
    ],
  },

  // ========================================================================
  // KNOWLEDGE CHECK — 10 questions, 70% to pass
  // ========================================================================
  knowledgeCheck: [
    {
      id: "m1-q1",
      type: "multiple_choice",
      question: "What is the difference between gross pay and net pay?",
      options: [
        "Gross pay is monthly; net pay is weekly",
        "Gross pay is before deductions; net pay is after deductions",
        "Gross pay is salary; net pay is hourly",
        "There is no difference",
      ],
      correctAnswer: "Gross pay is before deductions; net pay is after deductions",
      explanation: "Gross pay is your total earnings before any taxes or deductions. Net pay (take-home pay) is what remains after all deductions.",
    },
    {
      id: "m1-q2",
      type: "scenario",
      question: "Sam's gross pay is $600. After deductions, Sam's net pay is $456. Which of the following best explains the $144 difference?",
      options: [
        "The employer made a mistake and Sam should ask for the full $600",
        "The $144 was withheld for taxes and benefits — deductions like federal income tax, Social Security, Medicare, and possibly health insurance",
        "Sam was paid less because they worked fewer hours than expected",
        "The $144 is a bank fee charged for receiving direct deposit",
      ],
      correctAnswer: "The $144 was withheld for taxes and benefits — deductions like federal income tax, Social Security, Medicare, and possibly health insurance",
      explanation: "The difference between gross and net pay is deductions — required taxes (federal, state, FICA) and voluntary benefits (health insurance, retirement). This is normal and expected.",
    },
    {
      id: "m1-q3",
      type: "multiple_choice",
      question: "Looking at Taylor Morgan's paystub: 30 hours at $18.00/hour, gross pay of $540.00, and total deductions of $125.71. What is Taylor's net pay?",
      options: ["$414.29", "$540.00", "$665.71", "$125.71"],
      correctAnswer: "$414.29",
      explanation: "Net pay = gross pay − total deductions = $540.00 − $125.71 = $414.29. This is the amount that would be deposited into Taylor's bank account.",
    },
    {
      id: "m1-q4",
      type: "multiple_choice",
      question: "Which form do you usually complete when starting a job to help your employer determine federal income-tax withholding?",
      options: ["W-2", "W-4", "1099", "1040"],
      correctAnswer: "W-4",
      explanation: "Form W-4 (Employee's Withholding Certificate) is usually completed when starting a job. It helps your employer determine how much federal income tax to withhold from each paycheck.",
    },
    {
      id: "m1-q5",
      type: "multiple_choice",
      question: "Which form is generally provided by employers after the end of the year and summarizes your wages and taxes withheld?",
      options: ["W-4", "W-2", "1099", "I-9"],
      correctAnswer: "W-2",
      explanation: "Form W-2 summarizes your total annual wages and certain taxes withheld. You use it when preparing your federal income-tax return.",
    },
    {
      id: "m1-q6",
      type: "multiple_choice",
      question: "Which of the following best describes the difference between a checking account and a savings account?",
      options: [
        "Checking accounts are only for rich people; savings accounts are for everyone",
        "Checking accounts are for everyday transactions; savings accounts are for storing and growing money you don't need immediately",
        "Checking accounts earn high interest; savings accounts earn no interest",
        "There is no difference — they are the same type of account",
      ],
      correctAnswer: "Checking accounts are for everyday transactions; savings accounts are for storing and growing money you don't need immediately",
      explanation: "Checking accounts are designed for everyday spending, bill payments, and debit card transactions. Savings accounts are designed for accumulating money and typically earn interest.",
    },
    {
      id: "m1-q7",
      type: "true_false",
      question: "A debit card accesses money in your deposit account, while a credit card generally involves borrowing money.",
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "A debit card spends your own money from your deposit account. A credit card borrows money from the card issuer that you must pay back, often with interest if you don't pay the full balance.",
    },
    {
      id: "m1-q8",
      type: "multiple_choice",
      question: "Account A offers 0.01% APY and Account B offers 0.25% APY. If you deposit $1,000 and leave it for one year (simple calculation), approximately how much more interest does Account B earn?",
      options: ["$0.10", "$2.40", "$25.00", "$250.00"],
      correctAnswer: "$2.40",
      explanation: "Account A: $1,000 × 0.0001 = $0.10. Account B: $1,000 × 0.0025 = $2.50. The difference is $2.50 − $0.10 = $2.40. A higher APY earns more, though the difference on small balances may be modest.",
    },
    {
      id: "m1-q9",
      type: "scenario",
      question: "You're comparing two bank accounts. Account A has no monthly fee and no minimum balance. Account B charges $8 per month unless you keep a $500 minimum balance. You usually keep about $200 in your account. What should you consider?",
      options: [
        "Choose Account B because it has a higher APY — the interest will cover the fee",
        "Choose Account A — with a $200 balance, Account B's $8 monthly fee ($96/year) would likely cost more than any interest earned",
        "It doesn't matter — all bank accounts are the same",
        "Choose Account B because a smaller ATM network is always better",
      ],
      correctAnswer: "Choose Account A — with a $200 balance, Account B's $8 monthly fee ($96/year) would likely cost more than any interest earned",
      explanation: "With a $200 balance, Account B would charge $8/month ($96/year) because you're below the $500 minimum. The 0.25% APY on $200 earns only about $0.50/year — far less than the fees. Account A avoids this cost entirely.",
    },
    {
      id: "m1-q10",
      type: "multiple_select",
      question: "Which of the following are generally protected by FDIC or NCUA deposit insurance? (Select all that apply)",
      options: [
        "Checking accounts at FDIC-insured banks",
        "Savings accounts at federally insured credit unions",
        "Stocks purchased through a financial company",
        "Cryptocurrency held on an exchange",
      ],
      correctAnswer: ["Checking accounts at FDIC-insured banks", "Savings accounts at federally insured credit unions"],
      explanation: "FDIC and NCUA insurance protect eligible deposits at insured institutions. Stocks, cryptocurrency, mutual funds, and other investments are not protected by deposit insurance — even if purchased through a financial company.",
    },
  ],

  // ========================================================================
  // REFLECTION
  // ========================================================================
  reflection: {
    prompt:
      "Before this module, what part of receiving a paycheck or using a bank account did you understand the least? What will you pay more attention to now?",
    placeholder: "Write your reflection here...",
  },

  // ========================================================================
  // ACTION COMMITMENT
  // ========================================================================
  actionCommitment: {
    prompt:
      "Before I accept my first paycheck or open my next financial account, I will ____________.",
    placeholder: "I will...",
  },

  // ========================================================================
  // RISE FINANCIAL BLUEPRINT UPDATE
  // ========================================================================
  blueprintUpdate: {
    sectionKey: "income_banking",
    sectionTitle: "Income, Paycheck & Banking Plan",
    prompt:
      "Complete your Income, Paycheck & Banking Plan. Use estimates only — do not enter actual bank account numbers, routing numbers, Social Security numbers, PINs, passwords, or real tax documents.",
    fields: [
      { id: "expectedIncomeType", label: "Expected type of income", type: "text", placeholder: "e.g., hourly wages, salary, tips, gig work" },
      { id: "estimatedWage", label: "Estimated hourly wage or salary", type: "text", placeholder: "e.g., $18/hour or $35,000/year" },
      { id: "estimatedHours", label: "Estimated weekly work hours", type: "text", placeholder: "e.g., 20 hours" },
      { id: "estimatedGrossMonthly", label: "Estimated gross monthly income", type: "text", placeholder: "e.g., $1,560" },
      { id: "estimatedNetMonthly", label: "Estimated net monthly income", type: "text", placeholder: "e.g., $1,200" },
      { id: "preferredPaycheckMethod", label: "Preferred paycheck method", type: "text", placeholder: "e.g., direct deposit to checking" },
      { id: "checkingPriorities", label: "Checking-account priorities", type: "textarea", placeholder: "e.g., no monthly fee, large ATM network, mobile app" },
      { id: "savingsPriorities", label: "Savings-account priorities", type: "textarea", placeholder: "e.g., high APY, no minimum balance, easy transfers" },
      { id: "feesToAvoid", label: "Fees I want to avoid", type: "textarea", placeholder: "e.g., monthly maintenance fees, overdraft fees, out-of-network ATM fees" },
      { id: "bankingQuestions", label: "Banking questions I will ask", type: "textarea", placeholder: "e.g., Is this institution FDIC-insured? What is the minimum balance? What are the overdraft terms?" },
      { id: "paycheckHabit", label: "One paycheck habit I will practice", type: "textarea", placeholder: "e.g., I will review every paystub and verify my net pay before spending" },
    ],
  },
};
