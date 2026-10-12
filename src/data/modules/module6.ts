import type { CourseModule } from "../course-types";

export const module6: CourseModule = {
  id: "module-6",
  number: 6,
  title: "Real Life, Real Money — Cars, Housing, Insurance & Protection",
  subtitle:
    "The financial decisions that come with adult independence go far beyond the advertised price. Learn to calculate the real cost and protect yourself before you commit.",
  estimatedTime: "115 minutes",
  icon: "🚗",
  themeColor: "rise-navy-light",
  overview:
    "The financial decisions that come with adult independence go far beyond the advertised price. A car is not just a monthly payment — it is insurance, fuel, maintenance, registration, and parking. An apartment is not just rent — it is utilities, insurance, deposits, and moving costs. Insurance does not eliminate risk, but it may transfer or reduce certain financial risks according to the policy. Identity theft, phishing, and scams target people of all ages — and the best protection starts before anything goes wrong. This module teaches you to calculate the real cost of major financial decisions, read and understand contracts before signing, protect your identity and finances, and prepare for emergencies. The central RISE principle for this module is: The price is only part of the cost. Throughout this module, reinforce the RISE sequence: Read it. Compare it. Calculate it. Understand it. This is the final instructional module before the Final RISE USA Assessment and your completed Financial Blueprint.",
  objectives: [
    "Calculate the total cost of owning and operating a vehicle",
    "Explain the financial differences between buying, financing, and leasing a vehicle",
    "Identify important auto-loan terms",
    "Explain the major costs associated with renting housing",
    "Identify key sections of a lease",
    "Explain the financial responsibilities involved in sharing housing",
    "Explain the basic purpose of auto, renters, health, and other common insurance",
    "Distinguish insurance premiums from deductibles",
    "Explain why emergency savings matters when unexpected expenses occur",
    "Identify common forms of financial fraud, identity theft, phishing, and scams",
    "Identify appropriate steps after suspected identity theft",
    "Explain why financial contracts and records should be reviewed and retained",
    "Build a realistic hypothetical monthly plan for transportation, housing, insurance, and financial protection",
  ],
  lessons: [
    // ======================================================================
    // LESSON 1 — THE PRICE IS NOT THE COST
    // ======================================================================
    {
      id: "m6-l1",
      title: "Look Beyond the Price Tag",
      subtitle: "Purchase price is not always the same as total cost of ownership",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "The Price Is Only Part of the Cost", level: 2 },
        { type: "paragraph", text: "Purchase price is not always the same as total cost of ownership. The advertised price or monthly payment tells you only part of the story. The real cost includes everything you pay over time to own and use something." },
        { type: "heading", text: "A Car May Also Require", level: 3 },
        { type: "list", items: [
          "Loan interest",
          "Insurance",
          "Fuel",
          "Maintenance",
          "Repairs",
          "Registration",
          "Taxes",
          "Parking",
        ]},
        { type: "heading", text: "An Apartment May Also Require", level: 3 },
        { type: "list", items: [
          "Security deposit",
          "Application fees",
          "Utilities",
          "Internet",
          "Renters insurance",
          "Parking",
          "Moving costs",
        ]},
        { type: "callout", calloutType: "tip", text: "Ask, \u201cWhat will this cost me every month and over time?\u201d \u2014 not only \u201cWhat is the advertised price?\u201d The advertised number is the starting point, not the full picture." },
        { type: "callout", calloutType: "success", text: "The central RISE principle for this module: The price is only part of the cost. Read it. Compare it. Calculate it. Understand it." },
      ],
    },

    // ======================================================================
    // LESSON 2 — THE TRUE COST OF A CAR
    // ======================================================================
    {
      id: "m6-l2",
      title: "Can You Afford the Car or Just the Payment?",
      subtitle: "Calculating the real monthly transportation cost",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Monthly Transportation Cost", level: 2 },
        { type: "paragraph", text: "Your monthly transportation cost is more than just the car payment. To understand what a vehicle really costs you each month, add up everything:" },
        { type: "list", items: [
          "Car payment",
          "Insurance",
          "Fuel",
          "Maintenance/repair savings",
          "Parking/tolls",
          "Registration-related savings",
        ]},
        { type: "heading", text: "Example Calculation", level: 3 },
        { type: "table", headers: ["Expense", "Monthly Cost"], rows: [
          ["Car payment", "$325"],
          ["Insurance", "$190"],
          ["Fuel", "$160"],
          ["Maintenance/repair fund", "$75"],
          ["Parking/tolls", "$50"],
          ["Total", "$800"],
        ]},
        { type: "callout", calloutType: "warning", text: "If an advertisement says \u201cOnly $325 per month,\u201d is the car really costing $325 per month?" },
        { type: "paragraph", text: "Correct: No. The advertised $325 is only the loan payment. The real monthly cost of owning and operating that vehicle is $800 when you include insurance, fuel, maintenance savings, and parking." },
        { type: "callout", calloutType: "tip", text: "Always calculate the full monthly transportation cost before deciding whether a vehicle fits your budget. The payment alone does not tell you whether you can afford the car." },
      ],
    },

    // ======================================================================
    // LESSON 3 — BUYING A VEHICLE
    // ======================================================================
    {
      id: "m6-l3",
      title: "Cash Price, Down Payment & Financing",
      subtitle: "Understanding the basic financing calculation",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Key Terms", level: 2 },
        { type: "list", items: [
          "Purchase price — the price of the vehicle before financing.",
          "Down payment — money you pay upfront to reduce the amount you borrow.",
          "Amount financed — the amount you borrow after the down payment.",
          "APR — Annual Percentage Rate, the yearly cost of borrowing money.",
          "Loan term — how long you have to repay the loan.",
          "Monthly payment — what you pay each month.",
          "Total repayment — the total of all payments over the life of the loan.",
        ]},
        { type: "heading", text: "The Basic Formula", level: 3 },
        { type: "callout", calloutType: "info", text: "Vehicle price \u2212 down payment = amount financed (before accounting for applicable taxes, fees, trade-in, or other transaction details)." },
        { type: "heading", text: "Example", level: 3 },
        { type: "table", headers: ["Item", "Amount"], rows: [
          ["Vehicle price", "$18,000"],
          ["Down payment", "$3,000"],
          ["Basic amount remaining", "$15,000"],
        ]},
        { type: "paragraph", text: "Actual financing documents may include additional taxes, fees, warranties, or add-ons. The amount financed on the contract may differ from this basic calculation." },
        { type: "callout", calloutType: "warning", text: "Never assume the amount financed equals the advertised vehicle price. Review the financing disclosure. Taxes, fees, warranties, and add-ons can all increase the amount you borrow." },
        { type: "callout", calloutType: "tip", text: "Read the financing disclosure carefully. The amount financed, APR, loan term, and total repayment are all spelled out in the documents. Understand each one before signing." },
      ],
    },

    // ======================================================================
    // LESSON 4 — AUTO LOANS
    // ======================================================================
    {
      id: "m6-l4",
      title: "A Lower Payment Can Cost More",
      subtitle: "Comparing loan terms and total repayment",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Comparing Two Loans", level: 2 },
        { type: "paragraph", text: "A lower monthly payment does not always mean a loan costs less overall. Compare two fictional auto loans on the same amount financed:" },
        { type: "table", headers: ["Feature", "Loan A", "Loan B"], rows: [
          ["APR", "5.0%", "5.5%"],
          ["Loan term", "48 months", "72 months"],
          ["Amount financed", "$15,000", "$15,000"],
          ["Monthly payment", "Higher", "Lower"],
          ["Total repayment", "Lower", "Higher"],
        ]},
        { type: "callout", calloutType: "warning", text: "Loan A has a higher monthly payment but a shorter term and lower total repayment. Loan B has a lower monthly payment but a longer term and higher total repayment. Which costs more over time?" },
        { type: "paragraph", text: "Correct: Loan B costs more over time. Even though the monthly payment is lower, the longer term means more months of interest charges. The total repayment is higher." },
        { type: "heading", text: "Negative Equity", level: 3 },
        { type: "definition", text: "Negative equity means owing more on a vehicle than it is currently worth. Longer loan terms can create situations where a borrower still owes a large amount on a vehicle that has declined significantly in value." },
        { type: "callout", calloutType: "warning", text: "The longest loan is not automatically the most affordable loan. A longer term may create a situation where you owe a large amount on a vehicle that has declined significantly in value. This is called negative equity, and it can make selling or trading in the vehicle difficult." },
        { type: "callout", calloutType: "tip", text: "Compare APR, loan term, monthly payment, amount financed, and total repayment before choosing a loan. The lowest monthly payment is not always the best financial decision." },
      ],
    },

    // ======================================================================
    // LESSON 5 — BUYING VS. LEASING
    // ======================================================================
    {
      id: "m6-l5",
      title: "What Are You Actually Agreeing To?",
      subtitle: "Understanding the difference between buying and leasing",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Buying or Financing", level: 2 },
        { type: "paragraph", text: "When you buy or finance a vehicle, you generally move toward ownership if the loan is fully repaid. Once the loan is paid off, you own the vehicle outright." },
        { type: "heading", text: "Leasing", level: 3 },
        { type: "paragraph", text: "Leasing generally provides use of a vehicle for a defined period under specific contract terms. You do not own the vehicle during the lease term, and you typically return it at the end unless a purchase option applies." },
        { type: "heading", text: "What to Review in a Lease", level: 3 },
        { type: "list", items: [
          "Upfront costs",
          "Monthly payment",
          "Mileage limits",
          "Excess-mileage charges",
          "Wear-and-tear provisions",
          "Lease term",
          "End-of-lease responsibilities",
          "Purchase-option terms when applicable",
        ]},
        { type: "callout", calloutType: "warning", text: "Do not assume buying or leasing is universally better. Each option has different costs, benefits, and restrictions. The right choice depends on how you expect to use the vehicle." },
        { type: "callout", calloutType: "tip", text: "Compare the entire agreement based on how you expect to use the vehicle. Consider mileage, how long you want to keep the vehicle, and the total cost over the term \u2014 not just the monthly payment." },
      ],
    },

    // ======================================================================
    // LESSON 6 — CAR INSURANCE
    // ======================================================================
    {
      id: "m6-l6",
      title: "Insurance Is Part of the Transportation Budget",
      subtitle: "Understanding auto insurance basics",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Key Terms", level: 2 },
        { type: "list", items: [
          "Premium — the regular payment you make for insurance coverage.",
          "Deductible — the amount you pay before insurance covers the rest.",
          "Liability coverage — covers damage or injuries you cause to others.",
          "Collision coverage — covers damage to your vehicle from a collision.",
          "Comprehensive coverage — covers certain non-collision damage such as theft, weather, or falling objects.",
        ]},
        { type: "heading", text: "Legal Requirements Vary", level: 3 },
        { type: "paragraph", text: "Legal insurance requirements vary by location. Do not assume one set of minimum coverage limits applies everywhere. Check the requirements that apply where you live and where you drive." },
        { type: "heading", text: "Premium vs. Deductible Tradeoff", level: 3 },
        { type: "paragraph", text: "A lower premium may come with a higher deductible or different coverage. Consider this scenario:" },
        { type: "table", headers: ["Feature", "Policy A", "Policy B"], rows: [
          ["Monthly premium", "Lower", "Higher"],
          ["Deductible", "Higher", "Lower"],
          ["Coverage", "May differ", "May differ"],
        ]},
        { type: "callout", calloutType: "warning", text: "Why should a student consider emergency savings when selecting coverage? If you choose a higher deductible to lower your premium, you need enough savings to pay that deductible if an accident occurs. A lower premium with a higher deductible only works if you can afford the deductible when something goes wrong." },
        { type: "callout", calloutType: "tip", text: "Balance your premium and deductible based on what you can afford both monthly and in an emergency. Insurance is part of the transportation budget \u2014 not an afterthought." },
      ],
    },

    // ======================================================================
    // LESSON 7 — RENTING YOUR FIRST PLACE
    // ======================================================================
    {
      id: "m6-l7",
      title: "Rent Is Only the Beginning",
      subtitle: "Understanding the full cost of renting housing",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Common Costs of Renting", level: 2 },
        { type: "paragraph", text: "Rent is the largest housing expense, but it is not the only one. Budget for the full cost of housing:" },
        { type: "list", items: [
          "Monthly rent",
          "Security deposit",
          "Application fee",
          "Utility deposits",
          "Electricity/gas",
          "Water where applicable",
          "Internet",
          "Renters insurance",
          "Parking",
          "Moving expenses",
          "Furniture/basic household items",
        ]},
        { type: "heading", text: "Example Calculation", level: 3 },
        { type: "table", headers: ["Expense", "Monthly Cost"], rows: [
          ["Rent", "$1,200"],
          ["Utilities", "$160"],
          ["Internet", "$60"],
          ["Renters insurance", "$20"],
          ["Parking", "$75"],
          ["Total monthly housing-related cost", "$1,515"],
        ]},
        { type: "callout", calloutType: "warning", text: "Budget for housing, not just rent. The difference between rent and total housing cost can be hundreds of dollars per month." },
        { type: "callout", calloutType: "tip", text: "Before signing a lease, calculate your total monthly housing-related cost \u2014 not just rent. Include utilities, internet, insurance, parking, and any other recurring expenses." },
      ],
    },

    // ======================================================================
    // LESSON 8 — READ THE LEASE
    // ======================================================================
    {
      id: "m6-l8",
      title: "A Lease Is a Contract",
      subtitle: "Key sections to review before signing",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Key Sections to Review", level: 2 },
        { type: "paragraph", text: "A lease is a legal contract. Before signing, review each of these sections carefully:" },
        { type: "list", items: [
          "Rent amount",
          "Due date",
          "Lease start/end dates",
          "Security deposit",
          "Late fees",
          "Utilities",
          "Guest policies",
          "Parking",
          "Pet rules",
          "Maintenance responsibilities",
          "Renewal terms",
          "Early termination",
          "Move-out requirements",
          "Damage charges",
        ]},
        { type: "callout", calloutType: "warning", text: "Never rely only on what someone verbally tells you when the written agreement says something different. The written contract is what governs your obligations \u2014 not a conversation." },
        { type: "callout", calloutType: "tip", text: "Keep copies of signed agreements. If a dispute arises later, the written lease is your record of what was agreed to. Store it securely with your other important financial documents." },
      ],
    },

    // ======================================================================
    // LESSON 9 — ROOMMATES & COSIGNERS
    // ======================================================================
    {
      id: "m6-l9",
      title: "Shared Housing Can Mean Shared Financial Risk",
      subtitle: "Understanding leases, roommates, and cosigners",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Key Terms", level: 2 },
        { type: "list", items: [
          "Individual lease — a lease where you are responsible only for your own portion of the rent.",
          "Joint lease — a lease where all signers are responsible for the full rent amount.",
          "Roommate — a person who shares housing with you.",
          "Cosigner/guarantor — a person who agrees to be responsible for the lease if you do not pay.",
        ]},
        { type: "heading", text: "Legal Responsibility Depends on the Agreement", level: 3 },
        { type: "paragraph", text: "The type of lease you sign determines your legal responsibility. An individual lease means you owe only your share. A joint lease means every signer is responsible for the full rent \u2014 not just their portion." },
        { type: "heading", text: "Scenario", level: 3 },
        { type: "paragraph", text: "Three roommates sign one joint lease. One roommate stops paying." },
        { type: "callout", calloutType: "warning", text: "What should the remaining roommates review? Why does the wording of the lease matter?" },
        { type: "paragraph", text: "The remaining roommates should review the lease to understand whether they are jointly responsible for the full rent. If the lease is a joint lease, the landlord can seek the full rent from any or all of the signers \u2014 not just the one who stopped paying. The wording of the lease determines who is legally responsible." },
        { type: "callout", calloutType: "info", text: "This module does not provide individualized legal advice. If you face a situation like this, review your lease and consider consulting an appropriate professional." },
        { type: "callout", calloutType: "tip", text: "Understand your financial responsibility before signing with other people. Read the lease, understand whether it is individual or joint, and know what happens if a roommate does not pay." },
      ],
    },

    // ======================================================================
    // LESSON 10 — RENTERS INSURANCE
    // ======================================================================
    {
      id: "m6-l10",
      title: "The Landlord's Insurance May Not Protect Your Stuff",
      subtitle: "Understanding renters insurance",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What Renters Insurance May Cover", level: 2 },
        { type: "paragraph", text: "Renters insurance may provide protection for certain:" },
        { type: "list", items: [
          "Personal belongings",
          "Liability risks",
          "Additional living expenses",
        ]},
        { type: "paragraph", text: "The specific coverage depends on the policy terms. Not all policies cover the same things." },
        { type: "callout", calloutType: "warning", text: "A landlord's property insurance generally should not be assumed to cover a renter's personal belongings. The landlord's insurance protects the building \u2014 not your stuff." },
        { type: "heading", text: "Key Terms", level: 3 },
        { type: "list", items: [
          "Premium — the regular payment for coverage.",
          "Deductible — the amount you pay before insurance covers the rest.",
          "Coverage limit — the maximum amount the policy will pay for a covered loss.",
          "Exclusion — something the policy does not cover.",
          "Claim — a formal request to the insurance company for payment under the policy.",
        ]},
        { type: "callout", calloutType: "tip", text: "Read actual policy documents before purchasing. Understand what is covered, what is excluded, what the limits are, and what your deductible would be. Do not rely on assumptions about what a policy covers." },
      ],
    },

    // ======================================================================
    // LESSON 11 — INSURANCE BASICS
    // ======================================================================
    {
      id: "m6-l11",
      title: "You Pay to Transfer Some Financial Risk",
      subtitle: "Understanding the basic purpose of insurance",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "The Basic Purpose of Insurance", level: 2 },
        { type: "paragraph", text: "Insurance is a system where you pay a premium and the insurer may pay for covered losses. You are paying to transfer some financial risk to an insurance company." },
        { type: "callout", calloutType: "warning", text: "Insurance does not eliminate risk. It may transfer or reduce certain financial risks according to the policy. Not all risks are covered, and coverage depends on the specific policy terms." },
        { type: "heading", text: "Common Types of Insurance", level: 3 },
        { type: "list", items: [
          "Auto insurance — may cover vehicle damage and liability related to driving.",
          "Renters insurance — may cover personal belongings and liability in a rental.",
          "Health insurance — may help pay for medical care.",
          "Life insurance — may provide a payment to beneficiaries if the insured person dies.",
          "Disability insurance — may provide income replacement if you cannot work due to a disability.",
        ]},
        { type: "heading", text: "Key Terms", level: 3 },
        { type: "list", items: [
          "Premium — the regular payment you make for coverage.",
          "Deductible — the amount you pay before insurance covers the rest.",
          "Coverage — what the policy protects against.",
          "Limit — the maximum amount the policy will pay.",
          "Exclusion — something the policy does not cover.",
          "Claim — a formal request for payment under the policy.",
        ]},
        { type: "callout", calloutType: "info", text: "This module does not recommend particular insurers or coverage amounts. Insurance decisions depend on individual circumstances." },
        { type: "callout", calloutType: "tip", text: "Understand what you are paying for and what the policy covers before you buy. Compare premiums, deductibles, coverage limits, and exclusions across policies." },
      ],
    },

    // ======================================================================
    // LESSON 12 — EMERGENCIES HAPPEN
    // ======================================================================
    {
      id: "m6-l12",
      title: "Financial Protection Starts Before the Emergency",
      subtitle: "Why emergency savings and insurance work together",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Insurance and Emergency Savings Serve Different Purposes", level: 2 },
        { type: "paragraph", text: "Insurance and emergency savings may work together. Insurance may cover certain large losses after you pay your deductible. Emergency savings can help you cover the deductible, the uncovered portion, or expenses that insurance does not cover at all." },
        { type: "heading", text: "Example Emergencies", level: 3 },
        { type: "list", items: [
          "Vehicle repair",
          "Medical bill",
          "Lost work hours",
          "Emergency travel",
          "Unexpected housing expense",
        ]},
        { type: "heading", text: "Scenario", level: 3 },
        { type: "paragraph", text: "A car repair costs $900. The student has $650 in emergency savings." },
        { type: "callout", calloutType: "warning", text: "How much remains uncovered? What financial choices might be available?" },
        { type: "paragraph", text: "Correct calculation: $900 \u2212 $650 = $250 remains uncovered. The student may need to reduce other spending, use credit, arrange a payment plan, or find another source of funds to cover the remaining $250." },
        { type: "callout", calloutType: "info", text: "This connects back to Module 2. Emergency savings is part of a financial plan because unexpected expenses happen. The goal is not to predict the exact emergency \u2014 it is to be prepared when one occurs." },
        { type: "callout", calloutType: "tip", text: "Insurance and emergency savings serve different purposes and may work together. Build both into your financial plan before you need them." },
      ],
    },

    // ======================================================================
    // LESSON 13 — IDENTITY THEFT
    // ======================================================================
    {
      id: "m6-l13",
      title: "Your Identity Has Financial Value",
      subtitle: "Understanding identity theft and how to protect yourself",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What Is Identity Theft?", level: 2 },
        { type: "definition", text: "Identity theft is when someone uses your personal information without your permission to commit fraud or other crimes." },
        { type: "heading", text: "Protect These Items", level: 3 },
        { type: "list", items: [
          "Social Security number",
          "Account information",
          "Passwords",
          "PINs",
          "Authentication codes",
          "Government identification",
        ]},
        { type: "callout", calloutType: "warning", text: "Never enter these sensitive items into RISE USA. This module teaches you to protect them \u2014 not to share them in an educational platform." },
        { type: "heading", text: "Warning Signs", level: 3 },
        { type: "list", items: [
          "Accounts you did not open",
          "Charges you do not recognize",
          "Unexpected credit inquiries",
          "Missing mail",
          "Notices about unfamiliar accounts",
        ]},
        { type: "callout", calloutType: "tip", text: "Treat your personal information as something with financial value. Protect it carefully, monitor your accounts, and act quickly if you notice warning signs." },
      ],
    },

    // ======================================================================
    // LESSON 14 — PHISHING & DIGITAL SCAMS
    // ======================================================================
    {
      id: "m6-l14",
      title: "Stop Before You Click",
      subtitle: "Recognizing phishing and digital scams",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Types of Attacks", level: 2 },
        { type: "list", items: [
          "Phishing — fraudulent emails that try to steal your information.",
          "Smishing — fraudulent text messages that try to steal your information.",
          "Vishing — fraudulent phone calls that try to steal your information.",
          "Fake websites — sites designed to look like legitimate organizations.",
          "Account-takeover scams — attempts to gain access to your existing accounts.",
          "Payment-app scams — fraudulent requests through payment apps.",
          "Fake job scams — job offers that require upfront payment or personal information.",
          "Check scams — sending you a fake check and asking you to send money back.",
          "Social-media impersonation — fake accounts pretending to be someone you know.",
        ]},
        { type: "heading", text: "Warning Signs", level: 3 },
        { type: "list", items: [
          "Urgency",
          "Threats",
          "Unexpected payment request",
          "Gift-card demands",
          "Cryptocurrency payment demands",
          "Requests for verification codes",
          "Suspicious links",
          "\u201cToo good to be true\u201d opportunities",
        ]},
        { type: "callout", calloutType: "warning", text: "Do not use the contact information in a suspicious message to verify the message. Independently locate the official contact information. If a message claims to be from your bank, find your bank's phone number from a trusted source \u2014 not from the message itself." },
        { type: "callout", calloutType: "tip", text: "Stop before you click. Urgency and threats are designed to make you act before you think. Take a moment, verify independently, and never share passwords, PINs, or authentication codes." },
      ],
    },

    // ======================================================================
    // LESSON 15 — IF YOUR IDENTITY IS STOLEN
    // ======================================================================
    {
      id: "m6-l15",
      title: "Act Quickly and Keep Records",
      subtitle: "Steps to take after suspected identity theft",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Steps You May Take", level: 2 },
        { type: "paragraph", text: "If you suspect identity theft, act quickly. Responses may include:" },
        { type: "list", items: [
          "Contacting affected financial institutions",
          "Changing compromised passwords",
          "Reviewing financial accounts",
          "Reviewing credit information",
          "Reporting identity theft through appropriate official channels",
          "Considering fraud alerts or freezes when appropriate",
          "Documenting communications",
        ]},
        { type: "heading", text: "Official Educational Resource", level: 3 },
        { type: "callout", calloutType: "info", text: "IdentityTheft.gov is the federal government's resource for reporting identity theft and creating a recovery plan. It provides step-by-step guidance." },
        { type: "callout", calloutType: "warning", text: "This module does not provide individualized legal advice. If you suspect identity theft, use official resources and consider consulting an appropriate professional." },
        { type: "callout", calloutType: "tip", text: "Act quickly and keep records. Document every communication \u2014 dates, times, who you spoke with, and what was said. Records can become evidence of what happened and what you did about it." },
      ],
    },

    // ======================================================================
    // LESSON 16 — KEEP YOUR FINANCIAL RECORDS
    // ======================================================================
    {
      id: "m6-l16",
      title: "Save What You Sign",
      subtitle: "Why financial records matter",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Important Records to Retain", level: 2 },
        { type: "list", items: [
          "Paystubs",
          "Tax documents",
          "Bank agreements",
          "Loan agreements",
          "Leases",
          "Insurance policies",
          "Receipts for major purchases",
          "Warranty documents",
        ]},
        { type: "heading", text: "Safe Storage", level: 3 },
        { type: "list", items: [
          "Secure digital storage",
          "Strong passwords",
          "Multi-factor authentication",
          "Protected physical documents",
        ]},
        { type: "callout", calloutType: "warning", text: "When a financial dispute occurs, records can become evidence of what was agreed to or paid. Without records, it can be difficult to prove what you owe, what you paid, or what was promised." },
        { type: "callout", calloutType: "tip", text: "Save what you sign. Keep copies of contracts, agreements, and important financial documents in a secure location \u2014 both digital and physical. You may need them years later." },
      ],
    },

    // ======================================================================
    // LESSON 17 — BEFORE YOU SIGN
    // ======================================================================
    {
      id: "m6-l17",
      title: "The RISE Real-Life Decision Check",
      subtitle: "Read it. Compare it. Calculate it. Understand it.",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Before You Sign", level: 2 },
        { type: "paragraph", text: "Before signing for a car, apartment, loan, insurance policy, or other major financial obligation, work through the RISE Real-Life Decision Check:" },
        { type: "heading", text: "READ IT", level: 3 },
        { type: "paragraph", text: "What does the contract actually say? Read the entire document before signing." },
        { type: "heading", text: "COMPARE IT", level: 3 },
        { type: "paragraph", text: "What other options exist? Compare terms, costs, and alternatives before committing." },
        { type: "heading", text: "CALCULATE IT", level: 3 },
        { type: "paragraph", text: "What is the total monthly and long-term cost? Calculate the full cost, not just the advertised price or monthly payment." },
        { type: "heading", text: "UNDERSTAND IT", level: 3 },
        { type: "paragraph", text: "What happens if circumstances change? Understand what happens if your income decreases, if you need to cancel, or if something goes wrong." },
        { type: "heading", text: "Additional Questions to Ask", level: 3 },
        { type: "list", items: [
          "What fees apply?",
          "When is payment due?",
          "Can the price or rate change?",
          "What happens if I cancel?",
          "What happens if I pay late?",
          "Who is financially responsible?",
          "What am I required to insure?",
          "What records should I keep?",
          "Can this obligation fit within my budget?",
        ]},
        { type: "callout", calloutType: "success", text: "Read it. Compare it. Calculate it. Understand it. This is the RISE sequence for every major financial decision in adult life. The price is only part of the cost." },
      ],
    },
  ],

  // ========================================================================
  // KNOW THE TERMS
  // ========================================================================
  keyTerms: [
    { term: "Total Cost of Ownership", definition: "The complete cost of owning and using something over time, including the purchase price plus all ongoing expenses such as insurance, fuel, maintenance, and fees." },
    { term: "Down Payment", definition: "Money you pay upfront to reduce the amount you need to borrow when purchasing a vehicle or other asset." },
    { term: "Amount Financed", definition: "The amount you borrow after the down payment, before accounting for applicable taxes, fees, or other transaction details." },
    { term: "Auto Loan", definition: "A loan used to purchase a vehicle, where the vehicle typically serves as collateral for the loan." },
    { term: "APR", definition: "Annual Percentage Rate \u2014 the yearly cost of borrowing money, expressed as a percentage." },
    { term: "Loan Term", definition: "The length of time you have to repay a loan, typically expressed in months." },
    { term: "Negative Equity", definition: "Owing more on a vehicle than it is currently worth, which can happen with longer loan terms as the vehicle loses value faster than the loan is repaid." },
    { term: "Lease", definition: "A contract that provides use of a vehicle for a defined period under specific terms, without transferring ownership." },
    { term: "Mileage Limit", definition: "The maximum number of miles you may drive per year under a lease agreement, with excess-mileage charges applying if exceeded." },
    { term: "Rent", definition: "The regular payment you make to a landlord for the right to live in a rental property." },
    { term: "Security Deposit", definition: "Money paid upfront to a landlord and held against damages, typically returnable when you move out minus any deductions for damage beyond normal wear and tear." },
    { term: "Joint Lease", definition: "A lease where all signers are responsible for the full rent amount, not just their individual share." },
    { term: "Cosigner", definition: "A person who agrees to be financially responsible for a loan or lease if the primary borrower or tenant does not pay." },
    { term: "Premium", definition: "The regular payment you make to an insurance company in exchange for insurance coverage." },
    { term: "Deductible", definition: "The amount you pay before insurance covers the remaining cost of a covered loss." },
    { term: "Coverage", definition: "What an insurance policy protects against, as defined in the policy terms." },
    { term: "Coverage Limit", definition: "The maximum amount an insurance policy will pay for a covered loss." },
    { term: "Exclusion", definition: "Something that an insurance policy does not cover, as specified in the policy." },
    { term: "Claim", definition: "A formal request to an insurance company for payment under the terms of the policy." },
    { term: "Liability", definition: "Legal responsibility for damage or injuries you cause to others." },
    { term: "Renters Insurance", definition: "Insurance that may cover a renter's personal belongings, liability risks, and additional living expenses, depending on the policy terms." },
    { term: "Emergency Fund", definition: "Money saved to cover unexpected expenses, such as vehicle repairs, medical bills, or lost income, so you do not have to rely on credit or loans." },
    { term: "Identity Theft", definition: "When someone uses your personal information without your permission to commit fraud or other crimes." },
    { term: "Phishing", definition: "Fraudulent emails that impersonate trusted organizations to steal personal information." },
    { term: "Smishing", definition: "Fraudulent text messages that impersonate trusted organizations to steal personal information." },
    { term: "Vishing", definition: "Fraudulent phone calls that impersonate trusted organizations to steal personal information." },
    { term: "Fraud Alert", definition: "A notice placed on your credit report that requires lenders to take steps to verify your identity before extending credit in your name." },
    { term: "Credit Freeze", definition: "A restriction placed on your credit report that prevents new credit accounts from being opened in your name, which can be temporarily lifted when you need to apply for credit." },
    { term: "Multi-Factor Authentication", definition: "A security method that requires two or more forms of verification to access an account, adding protection beyond a password alone." },
    { term: "Financial Contract", definition: "A legally binding agreement that defines the financial rights and responsibilities of the parties involved." },
  ],

  // ========================================================================
  // SEE IT IN REAL LIFE
  // ========================================================================
  realLifeScenario: {
    title: "Maya Moves Out",
    setup:
      "Maya earns $3,000 monthly net income. She is considering an apartment. Her monthly costs would include: Rent $1,150, Utilities $160, Internet $60, Renters insurance $20, Parking $75, Car payment $300, Auto insurance $190, Fuel $140, Food $350, Phone $70.",
    situation:
      "Maya has never lived on her own before. She found an apartment she likes and is ready to sign the lease. But she has not yet calculated her total monthly costs or considered what would happen if her work hours decrease.",
    prompt:
      "Think about Maya's situation and answer these questions:\n1. What are Maya's total listed monthly costs?\n2. How much income remains?\n3. What expenses are still missing?\n4. Where would emergency savings fit?\n5. What might happen if Maya's work hours decrease?\n6. What should Maya review before signing the lease?\n\nDo not frame moving out as automatically good or bad. Focus on preparedness.",
  },

  // ========================================================================
  // RISE DECISION LAB
  // ========================================================================
  decisionLab: {
    id: "adulting-cost-challenge",
    title: "RISE Decision Lab: Adulting Cost Challenge",
    subtitle: "Build a complete monthly plan within $3,400, then adapt when real life happens",
    instructions:
      "You receive a hypothetical monthly net income of $3,400. Make decisions in four categories: Housing, Transportation, Insurance/Protection, and Other Monthly Needs. Your plan must not exceed $3,400. After creating your original plan, one Real Life Happens event will occur and you must revise your budget. There is no one predetermined correct lifestyle choice. All amounts are hypothetical and for educational purposes only.",
    fields: [
      // --- 1. HOUSING ---
      { id: "housingChoice", label: "1. Housing choice", type: "radio", options: [
        { id: "housing-shared", label: "Option A \u2014 Shared apartment", description: "Rent: $850, Utilities: $130, Renters insurance: $20" },
        { id: "housing-studio", label: "Option B \u2014 Studio", description: "Rent: $1,250, Utilities: $160, Renters insurance: $20" },
        { id: "housing-family", label: "Option C \u2014 Remain with family", description: "Household contribution: $500" },
      ]},
      { id: "housingMonthlyCost", label: "1a. Total monthly housing cost", type: "number", placeholder: "Enter the total monthly housing cost", unit: "$", description: "Sum of rent, utilities, and renters insurance for your chosen option" },

      // --- 2. TRANSPORTATION ---
      { id: "transportChoice", label: "2. Transportation choice", type: "radio", options: [
        { id: "transport-used", label: "Option A \u2014 Used financed vehicle", description: "Car payment: $300, Insurance: $170, Fuel: $150, Maintenance savings: $60" },
        { id: "transport-public", label: "Option B \u2014 Public transportation + rideshare", description: "Transit pass: $90, Rideshare: $70" },
        { id: "transport-paidoff", label: "Option C \u2014 Existing paid-off vehicle", description: "Insurance: $130, Fuel: $120, Maintenance: $50" },
      ]},
      { id: "transportMonthlyCost", label: "2a. Total monthly transportation cost", type: "number", placeholder: "Enter the total monthly transportation cost", unit: "$", description: "Sum of all transportation costs for your chosen option" },

      // --- 3. INSURANCE / PROTECTION ---
      { id: "insuranceTypes", label: "3. Insurance types you will carry", type: "checkbox", options: [
        { id: "ins-auto", label: "Auto insurance", description: "If you chose a vehicle option, include auto insurance" },
        { id: "ins-renters", label: "Renters insurance ($20/mo)", description: "Protects your personal belongings in a rental" },
        { id: "ins-health", label: "Health insurance ($120/mo)", description: "Employer plan or marketplace" },
      ]},
      { id: "emergencySavings", label: "3a. Monthly emergency savings contribution", type: "number", placeholder: "Amount to save each month", unit: "$", min: 0, description: "How much you set aside for unexpected expenses" },
      { id: "insuranceMonthlyCost", label: "3b. Total monthly insurance + emergency savings cost", type: "number", placeholder: "Enter the total", unit: "$", description: "Sum of insurance premiums and emergency savings contribution" },

      // --- 4. OTHER MONTHLY NEEDS ---
      { id: "foodCost", label: "4a. Food", type: "number", placeholder: "Monthly food cost", unit: "$", min: 0 },
      { id: "phoneCost", label: "4b. Phone", type: "number", placeholder: "Monthly phone cost", unit: "$", min: 0 },
      { id: "personalCareCost", label: "4c. Personal care", type: "number", placeholder: "Monthly personal care cost", unit: "$", min: 0 },
      { id: "savingsCost", label: "4d. Additional savings (beyond emergency)", type: "number", placeholder: "Monthly additional savings", unit: "$", min: 0 },
      { id: "entertainmentCost", label: "4e. Entertainment", type: "number", placeholder: "Monthly entertainment cost", unit: "$", min: 0 },
      { id: "otherMonthlyCost", label: "4f. Total other monthly needs cost", type: "number", placeholder: "Enter the total", unit: "$", description: "Sum of food, phone, personal care, additional savings, and entertainment" },

      // --- 5. ORIGINAL BUDGET ---
      { id: "originalBudgetTotal", label: "5. Original total monthly budget", type: "number", placeholder: "Sum of housing + transport + insurance/protection + other", unit: "$", description: "Must not exceed $3,400" },
      { id: "originalRemaining", label: "5a. Remaining cash flow after budget", type: "calculated", description: "$3,400 \u2212 original total monthly budget" },

      // --- 6. REAL LIFE HAPPENS ---
      { id: "lifeEvent", label: "6. Real Life Happens \u2014 which event occurred?", type: "radio", options: [
        { id: "event-a", label: "Event A: $700 car repair", description: "An unexpected vehicle repair costs $700" },
        { id: "event-b", label: "Event B: $500 medical bill", description: "An unexpected medical bill costs $500" },
        { id: "event-c", label: "Event C: Income decreases by $400 for one month", description: "Your monthly income drops to $3,000 for one month" },
        { id: "event-d", label: "Event D: Emergency travel costs $550", description: "An unexpected travel expense costs $550" },
        { id: "event-e", label: "Event E: Security deposit increases by $300 before move-in", description: "An additional $300 is required before you can move in" },
      ]},
      { id: "revisedBudgetTotal", label: "6a. Revised total monthly budget after the event", type: "number", placeholder: "Your revised budget total", unit: "$", description: "Adjust your plan to account for the event" },
      { id: "revisedRemaining", label: "6b. Remaining cash flow after revised budget", type: "calculated", description: "$3,400 \u2212 revised total monthly budget (or $3,000 if Event C)" },

      // --- 7-9. EXPLANATIONS ---
      { id: "tradeoffExplanation", label: "7. Explanation of tradeoffs", type: "text", placeholder: "How did you adjust your plan after the event? What did you give up or change?" },
      { id: "riskIdentified", label: "8. One risk you identified", type: "text", placeholder: "What is one financial risk you see in your plan?" },
      { id: "protectionStrategy", label: "9. One financial protection strategy", type: "text", placeholder: "What is one strategy you will use to protect yourself financially?" },
    ],
    resultPrompt:
      "There is no one predetermined correct lifestyle choice. Evaluate the student's work on: Financial reasoning \u2014 did the student make choices that fit within $3,400? Completeness \u2014 did the student address all four categories and the revised budget? Affordability \u2014 does the plan stay within income? Risk awareness \u2014 did the student identify a genuine risk? Ability to adapt \u2014 did the student revise the budget logically after the event? Quality of explanation \u2014 did the student explain tradeoffs clearly and identify a meaningful protection strategy? Grade on financial reasoning, completeness, affordability, risk awareness, ability to adapt, and quality of explanation \u2014 not on which lifestyle option the student chose.",
  },

  // ========================================================================
  // WORKBOOK ACTIVITY
  // ========================================================================
  workbookActivity: {
    title: "My Real-Life Cost Planner",
    instructions:
      "Complete your Real-Life Cost Planner using hypothetical or estimated information. Do not enter actual account numbers, policy numbers, lease numbers, Social Security numbers, passwords, PINs, or authentication codes. Use estimates and plans \u2014 not real financial data.",
    prompts: [
      "TRANSPORTATION: Car payment or public transit cost",
      "TRANSPORTATION: Insurance",
      "TRANSPORTATION: Fuel",
      "TRANSPORTATION: Maintenance",
      "TRANSPORTATION: Parking/tolls",
      "TRANSPORTATION: Registration savings",
      "TRANSPORTATION: Total transportation",
      "HOUSING: Rent or housing contribution",
      "HOUSING: Utilities",
      "HOUSING: Internet",
      "HOUSING: Renters insurance",
      "HOUSING: Parking",
      "HOUSING: Total housing",
      "PROTECTION: Emergency savings",
      "PROTECTION: Insurance premiums",
      "PROTECTION: Deductible amount I would need to handle",
      "OTHER: Food",
      "OTHER: Phone",
      "OTHER: Personal expenses",
      "OTHER: Savings",
      "OTHER: Entertainment",
      "OTHER: Other",
      "TOTAL: Total monthly expenses",
      "TOTAL: Total savings",
      "TOTAL: Remaining monthly cash flow",
      "REFLECTION: Which three expenses could change unexpectedly?",
      "REFLECTION: What would you do if one changed next month?",
    ],
  },

  // ========================================================================
  // KNOWLEDGE CHECK
  // ========================================================================
  knowledgeCheck: [
    {
      id: "m6-q1",
      type: "multiple_choice",
      question: "What is the total cost of owning and operating a vehicle beyond the monthly car payment?",
      options: [
        "Just the down payment",
        "Insurance, fuel, maintenance, repairs, registration, taxes, and parking",
        "Nothing extra \u2014 the payment covers everything",
        "Only gas and oil changes",
      ],
      correctAnswer: "Insurance, fuel, maintenance, repairs, registration, taxes, and parking",
      explanation: "Total cost of ownership includes all ongoing expenses, not just the loan payment. A lower monthly payment does not mean a lower total cost.",
    },
    {
      id: "m6-q2",
      type: "scenario",
      question: "A car payment is $300, insurance is $180, fuel is $150, and maintenance savings is $70. What is the total monthly vehicle cost?",
      options: [
        "$600",
        "$650",
        "$700",
        "$750",
      ],
      correctAnswer: "$700",
      explanation: "Total = $300 + $180 + $150 + $70 = $700 per month. The advertised payment of $300 is less than half the real monthly cost.",
    },
    {
      id: "m6-q3",
      type: "multiple_choice",
      question: "Why might a longer auto loan term be risky even though the monthly payment is lower?",
      options: [
        "Longer loans always have higher APRs",
        "You may owe more than the vehicle is worth (negative equity) because the vehicle loses value faster than the loan is repaid",
        "Longer loans require larger down payments",
        "Longer loans are illegal for first-time buyers",
      ],
      correctAnswer: "You may owe more than the vehicle is worth (negative equity) because the vehicle loses value faster than the loan is repaid",
      explanation: "Negative equity means owing more than the vehicle is worth. Longer loan terms spread payments over more months, which can create this situation as the vehicle depreciates.",
    },
    {
      id: "m6-q4",
      type: "scenario",
      question: "A renter pays $1,100 in rent, $150 in utilities, $60 for internet, $20 for renters insurance, and $75 for parking. What is the actual monthly housing-related cost?",
      options: [
        "$1,100",
        "$1,300",
        "$1,405",
        "$1,500",
      ],
      correctAnswer: "$1,405",
      explanation: "Total = $1,100 + $150 + $60 + $20 + $75 = $1,405. Budget for housing, not just rent.",
    },
    {
      id: "m6-q5",
      type: "multiple_choice",
      question: "What does a lease provide that buying or financing generally does not?",
      options: [
        "Ownership of the vehicle at the end of the term",
        "Use of a vehicle for a defined period under specific contract terms, including mileage limits and wear-and-tear provisions",
        "Lower insurance requirements",
        "Unlimited mileage",
      ],
      correctAnswer: "Use of a vehicle for a defined period under specific contract terms, including mileage limits and wear-and-tear provisions",
      explanation: "Leasing provides use of a vehicle for a set period under contract terms. It does not generally transfer ownership. Review mileage limits, excess-mileage charges, and end-of-lease responsibilities.",
    },
    {
      id: "m6-q6",
      type: "multiple_choice",
      question: "What is the difference between an insurance premium and a deductible?",
      options: [
        "A premium is paid when you file a claim; a deductible is paid monthly",
        "A premium is the regular payment you make for coverage; a deductible is the amount you pay before insurance covers the rest",
        "They are the same thing",
        "A premium covers everything; a deductible covers nothing",
      ],
      correctAnswer: "A premium is the regular payment you make for coverage; a deductible is the amount you pay before insurance covers the rest",
      explanation: "The premium is your ongoing cost for having insurance. The deductible is what you pay out of pocket when a covered loss occurs before the insurance company pays.",
    },
    {
      id: "m6-q7",
      type: "true_false",
      question: "A landlord's property insurance generally covers a renter's personal belongings.",
      options: ["True", "False"],
      correctAnswer: "False",
      explanation: "A landlord's insurance generally covers the building, not the renter's personal belongings. Renters insurance is what may protect your stuff.",
    },
    {
      id: "m6-q8",
      type: "scenario",
      question: "A text claims to be from your bank and says: \u201cYour account will be closed in 30 minutes. Click this link and enter your password and verification code.\u201d What is the safest response?",
      options: [
        "Click the link and enter your password and verification code to prevent closure",
        "Reply to the text with your password",
        "Do not use the link. Independently contact the institution through a verified channel",
        "Forward the text to all your contacts",
      ],
      correctAnswer: "Do not use the link. Independently contact the institution through a verified channel",
      explanation: "Do not use the contact information in a suspicious message to verify the message. Independently locate the official contact information and reach out through a verified channel.",
    },
    {
      id: "m6-q9",
      type: "multiple_choice",
      question: "Why should you keep copies of signed financial agreements?",
      options: [
        "They look nice in a folder",
        "When a financial dispute occurs, records can become evidence of what was agreed to or paid",
        "It is required by law for all documents",
        "Only banks need to keep records",
      ],
      correctAnswer: "When a financial dispute occurs, records can become evidence of what was agreed to or paid",
      explanation: "Records can become evidence in a dispute. Without them, it can be difficult to prove what you owe, what you paid, or what was promised. Save what you sign.",
    },
    {
      id: "m6-q10",
      type: "multiple_select",
      question: "Which of the following are warning signs of phishing or scams? (Select all that apply)",
      options: [
        "Urgency or threats",
        "Gift-card or cryptocurrency payment demands",
        "Requests for verification codes",
        "A monthly statement from your bank",
        "\u201cToo good to be true\u201d opportunities",
      ],
      correctAnswer: ["Urgency or threats", "Gift-card or cryptocurrency payment demands", "Requests for verification codes", "\u201cToo good to be true\u201d opportunities"],
      explanation: "Urgency, threats, gift-card demands, cryptocurrency demands, requests for verification codes, and too-good-to-be-true offers are all warning signs. A legitimate monthly statement is not.",
    },
  ],

  // ========================================================================
  // REFLECTION
  // ========================================================================
  reflection: {
    prompt:
      "Which adult financial cost surprised you most in this module, and how will that change the way you prepare for independence?",
    placeholder: "Write your reflection here...",
  },

  // ========================================================================
  // ACTION COMMITMENT
  // ========================================================================
  actionCommitment: {
    prompt:
      "Before I sign a major financial agreement, I will ____________.",
    placeholder: "I will...",
  },

  // ========================================================================
  // RISE FINANCIAL BLUEPRINT UPDATE
  // ========================================================================
  blueprintUpdate: {
    sectionKey: "protection_plan",
    sectionTitle: "My Transportation, Housing, Insurance & Protection Plan",
    prompt:
      "Complete your Transportation, Housing, Insurance & Protection Plan. Use estimates or hypothetical information. Do not enter driver's license numbers, vehicle identification numbers, actual insurance policy numbers, lease account numbers, bank-account information, Social Security numbers, passwords, PINs, or authentication codes.",
    fields: [
      // --- TRANSPORTATION ---
      { id: "transportOption", label: "TRANSPORTATION: Transportation option I am considering", type: "text", placeholder: "e.g., buy a used car with cash, use public transit" },
      { id: "transportMonthlyCost", label: "TRANSPORTATION: Estimated monthly transportation cost", type: "text", placeholder: "e.g., $330" },
      { id: "maxVehiclePayment", label: "TRANSPORTATION: Maximum hypothetical vehicle payment", type: "text", placeholder: "e.g., $250" },
      { id: "estimatedInsuranceCost", label: "TRANSPORTATION: Estimated insurance cost", type: "text", placeholder: "e.g., $150" },
      { id: "maintenanceSavingsTarget", label: "TRANSPORTATION: Maintenance/repair savings target", type: "text", placeholder: "e.g., $60/month" },
      { id: "vehicleRule", label: "TRANSPORTATION: My rule before financing or leasing a vehicle", type: "textarea", placeholder: "e.g., I will calculate the total monthly cost, not just the payment, and compare at least two options" },
      // --- HOUSING ---
      { id: "housingOption", label: "HOUSING: Housing option I am considering", type: "text", placeholder: "e.g., shared apartment with one roommate" },
      { id: "housingMonthlyCost", label: "HOUSING: Estimated monthly housing cost", type: "text", placeholder: "e.g., $1,000" },
      { id: "moveInCosts", label: "HOUSING: Estimated move-in costs", type: "text", placeholder: "e.g., $2,400 (first month, last month, deposit)" },
      { id: "utilitiesToPlan", label: "HOUSING: Utilities I need to plan for", type: "textarea", placeholder: "e.g., electricity, gas, internet, water" },
      { id: "leaseChecklist", label: "HOUSING: My lease-review checklist", type: "textarea", placeholder: "e.g., rent amount, due date, late fees, early termination, maintenance responsibilities, pet rules" },
      { id: "roommateRule", label: "HOUSING: My roommate/cosigner rule", type: "textarea", placeholder: "e.g., I will read the lease to understand if it is joint or individual before signing with a roommate" },
      // --- INSURANCE ---
      { id: "insuranceTypesNeeded", label: "INSURANCE: Insurance types I may need", type: "textarea", placeholder: "e.g., auto, renters, health" },
      { id: "premiumDeductibleRule", label: "INSURANCE: My rule for comparing premiums and deductibles", type: "textarea", placeholder: "e.g., I will not choose a deductible I cannot afford to pay from emergency savings" },
      { id: "deductibleSavingsNeeded", label: "INSURANCE: Emergency savings needed to handle a deductible", type: "text", placeholder: "e.g., $500" },
      // --- PROTECTION ---
      { id: "identityProtections", label: "PROTECTION: Three identity-theft protections I will use", type: "textarea", placeholder: "e.g., strong unique passwords, multi-factor authentication, credit freeze" },
      { id: "suspiciousMessageResponse", label: "PROTECTION: What I will do if I receive a suspicious financial message", type: "textarea", placeholder: "e.g., I will not click any links and will independently contact the institution through a verified channel" },
      { id: "recordsToKeep", label: "PROTECTION: Important financial records I will keep", type: "textarea", placeholder: "e.g., paystubs, tax documents, lease, insurance policies, loan agreements" },
      { id: "secureStorage", label: "PROTECTION: How I will securely store financial information", type: "textarea", placeholder: "e.g., secure digital storage with strong passwords and multi-factor authentication, plus protected physical documents" },
      { id: "emergencyToPrepare", label: "PROTECTION: One financial emergency I want to prepare for", type: "textarea", placeholder: "e.g., a $900 car repair" },
    ],
  },
};
