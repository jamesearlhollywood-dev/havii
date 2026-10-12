import type { CourseModule } from "../course-types";

export const module4: CourseModule = {
  id: "module-4",
  number: 4,
  title: "Education Without the Financial Surprise — College, Training & Student Loans",
  subtitle:
    "Compare the real cost of education, understand financial aid, and know what borrowing means before you accept it.",
  estimatedTime: "115 minutes",
  icon: "🎓",
  themeColor: "rise-blue",
  overview:
    "Education after high school is one of the biggest financial decisions you will ever make — and it is also one of the easiest to get wrong if you only look at the headline price. This module teaches you to compare the full cost of education before committing. You will learn that there is more than one postsecondary path, from four-year college to trade school to apprenticeships. You will distinguish sticker price from net price, understand cost of attendance, and separate grants, scholarships, work-study, and student loans. We walk through the FAFSA at a high level, teach you to read a financial-aid offer line by line, and explain the differences between federal and private student loans — including subsidized and unsubsidized loans. You will calculate a funding gap, estimate multi-year borrowing, and see how interest affects repayment. Most importantly, you will learn to evaluate whether borrowing for education fits your likely career and financial plan. The central RISE principle for this module is: Do not choose a school, program, or loan based only on the headline price or monthly payment. Understand the full cost before committing.",
  objectives: [
    "Compare different postsecondary education and training paths",
    "Distinguish sticker price from net price",
    "Identify the major components of cost of attendance",
    "Distinguish grants, scholarships, work-study, savings, and student loans",
    "Explain the basic purpose of the FAFSA",
    "Read and compare financial-aid offers",
    "Distinguish federal student loans from private student loans at a high level",
    "Explain subsidized and unsubsidized federal student loans at an introductory level",
    "Calculate a remaining funding gap",
    "Estimate multi-year borrowing",
    "Explain how interest affects student-loan repayment",
    "Identify potential consequences of delinquency or default",
    "Evaluate whether borrowing for education fits the student's likely career and financial plan",
  ],
  lessons: [
    // ======================================================================
    // LESSON 1 — THERE IS MORE THAN ONE PATH
    // ======================================================================
    {
      id: "m4-l1",
      title: "College Is One Option — Not the Only Option",
      subtitle: "There is more than one path to a career",
      estimatedMinutes: 8,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Multiple Paths After High School", level: 2 },
        { type: "paragraph", text: "After high school, you have more options than you might realize. Each path has different costs, time commitments, and outcomes. Understanding all of them helps you make a decision that fits your goals and your finances." },
        { type: "heading", text: "Postsecondary Paths to Consider", level: 3 },
        { type: "list", items: [
          "Four-year college or university — leads to a bachelor's degree; offers the widest range of academic programs.",
          "Community college — offers two-year associate degrees and certificates; can also serve as a transfer pathway to a four-year school.",
          "Trade or technical school — trains you for specific skilled careers such as electrician, plumber, HVAC technician, or dental assistant.",
          "Certification program — prepares you for industry-recognized certifications in fields like IT, healthcare, or project management.",
          "Apprenticeship — combines paid on-the-job training with classroom instruction; you earn while you learn.",
          "Military education benefits — at a high level, military service can provide education benefits; eligibility and terms vary.",
          "Employer-sponsored training — some employers pay for training, certifications, or education related to your job.",
          "Direct-to-workforce pathways — entering the workforce directly and building experience, skills, and income over time.",
        ]},
        { type: "callout", calloutType: "info", text: "No single path is inherently superior to another. A four-year degree is not automatically better than a trade certification, and a trade certification is not automatically better than an apprenticeship. The best path depends on your goals, finances, career plan, and circumstances." },
        { type: "heading", text: "What to Compare", level: 3 },
        { type: "paragraph", text: "When comparing paths, consider more than just cost. Think about:" },
        { type: "list", items: [
          "Total cost — the full cost of the program, not just tuition.",
          "Time required — how long until you complete the program and enter the workforce.",
          "Credential earned — what degree, certificate, or license you receive.",
          "Career outcomes — what jobs the credential qualifies you for.",
          "Licensing requirements — whether the career requires a specific license or certification.",
          "Job demand — whether employers are hiring in that field in your area.",
          "Location — where the program is and whether you can attend from where you live.",
          "Transportation — how you will get to and from the program.",
          "Housing — whether you need to relocate or can live at home.",
          "Opportunity cost — what you give up by choosing one path over another, including income you could have earned during that time.",
        ]},
        { type: "callout", calloutType: "tip", text: "Key takeaway: The best path is the one that fits your goals, finances, career plan, and circumstances. Do not choose a path because it seems like the 'default' — choose it because it makes sense for you." },
      ],
    },

    // ======================================================================
    // LESSON 2 — WHAT DOES EDUCATION REALLY COST?
    // ======================================================================
    {
      id: "m4-l2",
      title: "Sticker Price vs. Total Cost",
      subtitle: "Tuition is just one part of what education actually costs",
      estimatedMinutes: 8,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Cost of Attendance", level: 2 },
        { type: "paragraph", text: "When you look at the price of a school or program, tuition is often the first number you see — but it is rarely the full cost. The broader measure is called cost of attendance." },
        { type: "definition", text: "Cost of attendance is the total estimated cost of one year of education, including more than just tuition. It typically includes tuition, fees, books, supplies, equipment, housing, food, transportation, personal expenses, and technology." },
        { type: "heading", text: "Components of Cost of Attendance", level: 3 },
        { type: "list", items: [
          "Tuition — the cost of instruction.",
          "Fees — additional charges for services, facilities, or technology.",
          "Books — textbooks and required reading materials.",
          "Supplies — materials needed for coursework.",
          "Equipment — tools, software, or devices required for the program.",
          "Housing — rent, dorm costs, or housing-related expenses.",
          "Food — meals and groceries.",
          "Transportation — commuting costs, parking, or travel home.",
          "Personal expenses — clothing, laundry, phone, and other daily needs.",
          "Technology — a laptop, internet access, or other technology requirements.",
        ]},
        { type: "heading", text: "Example: Adding Up the Full Cost", level: 3 },
        { type: "callout", calloutType: "warning", text: "The figures below are fictional and for educational purposes only. Actual costs vary widely by school, location, and program." },
        { type: "table", headers: ["Component", "Estimated Cost"], rows: [
          ["Tuition", "$12,000"],
          ["Fees", "$1,500"],
          ["Housing/food", "$10,000"],
          ["Books/supplies", "$1,200"],
          ["Transportation/personal", "$2,300"],
          ["Total estimated cost", "$27,000"],
        ]},
        { type: "paragraph", text: "Notice that tuition ($12,000) is less than half of the total estimated cost ($27,000). If you only looked at tuition, you would underestimate the real cost by more than $15,000." },
        { type: "callout", calloutType: "tip", text: "A lower tuition price does not automatically mean the lowest total cost. A school with lower tuition but higher housing and transportation costs could end up costing more overall. Always look at the full cost of attendance, not just tuition." },
      ],
    },

    // ======================================================================
    // LESSON 3 — NET PRICE MATTERS
    // ======================================================================
    {
      id: "m4-l3",
      title: "What Will You Actually Need to Cover?",
      subtitle: "Sticker price vs. net price — and why it changes everything",
      estimatedMinutes: 8,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Two Different Prices", level: 2 },
        { type: "definition", text: "Sticker price is the published cost of attendance before any financial aid is applied. It is the number you see on a school's website or brochure." },
        { type: "definition", text: "Net price is the cost after certain grants and scholarships are considered. It is the amount you would actually need to cover through savings, work, or borrowing." },
        { type: "callout", calloutType: "info", text: "Do not compare schools using tuition alone — and do not compare them using sticker price alone. Two schools with very different sticker prices can have similar net prices after grants and scholarships are applied." },
        { type: "heading", text: "Example: School A vs. School B", level: 3 },
        { type: "callout", calloutType: "warning", text: "The figures below are fictional and for educational purposes only." },
        { type: "table", headers: ["", "School A", "School B"], rows: [
          ["Published cost (sticker price)", "$32,000", "$24,000"],
          ["Grants/scholarships", "$18,000", "$9,000"],
          ["Remaining amount (net price)", "$14,000", "$15,000"],
        ]},
        { type: "heading", text: "Which School Looks Cheaper at First Glance?", level: 3 },
        { type: "paragraph", text: "School B has the lower published price ($24,000 vs. $32,000). If you compared only sticker prices, School B would look like the better deal." },
        { type: "callout", calloutType: "warning", text: "Which school currently has the smaller remaining cost after grants and scholarships?" },
        { type: "paragraph", text: "Correct: School A. After grants and scholarships, School A leaves $14,000 to cover, while School B leaves $15,000. School A — the one with the higher sticker price — actually has the lower net price." },
        { type: "callout", calloutType: "tip", text: "Key lesson: Compare net cost, not just sticker price. A school with a higher sticker price may offer more grants and scholarships, leaving you with less to cover. Always find out what the net price is before making a decision." },
      ],
    },

    // ======================================================================
    // LESSON 4 — TYPES OF FINANCIAL AID
    // ======================================================================
    {
      id: "m4-l4",
      title: "Money You Do and Do Not Have to Repay",
      subtitle: "Understanding grants, scholarships, work-study, loans, and savings",
      estimatedMinutes: 8,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Five Types of Financial Aid", level: 2 },
        { type: "paragraph", text: "Financial aid comes in several forms. Some you do not have to repay, some you earn, and some you borrow. Understanding the difference is essential." },
        { type: "heading", text: "Grants", level: 3 },
        { type: "paragraph", text: "Grants generally do not need to be repaid when eligibility requirements are met. They are often based on financial need." },
        { type: "heading", text: "Scholarships", level: 3 },
        { type: "paragraph", text: "Scholarships generally do not need to be repaid when requirements are satisfied. They may be based on academics, athletics, community service, background, field of study, or other criteria." },
        { type: "heading", text: "Work-Study", level: 3 },
        { type: "paragraph", text: "Work-study provides the opportunity to earn money through eligible employment. It is not an upfront discount — it is the opportunity to work and earn." },
        { type: "callout", calloutType: "warning", text: "Do not treat work-study as an upfront discount from the bill. Work-study money is generally earned through employment rather than automatically applied to the student's bill. You still need to cover the cost upfront and earn the money over time." },
        { type: "heading", text: "Student Loans", level: 3 },
        { type: "paragraph", text: "Student loans are borrowed money that generally must be repaid with interest. Unlike grants and scholarships, loans create an obligation." },
        { type: "heading", text: "Savings / Family Contribution", level: 3 },
        { type: "paragraph", text: "Savings and family contributions are funds available to help cover costs. This is money that does not need to be borrowed or earned through work-study." },
        { type: "callout", calloutType: "info", text: "The key distinction: Grants and scholarships are money you generally do not repay. Work-study is money you earn. Student loans are money you must repay with interest. Savings is money you already have." },
      ],
    },

    // ======================================================================
    // LESSON 5 — FAFSA BASICS
    // ======================================================================
    {
      id: "m4-l5",
      title: "The FAFSA Is a Starting Point",
      subtitle: "What the FAFSA is — and what it is not",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What Is the FAFSA?", level: 2 },
        { type: "definition", text: "The FAFSA (Free Application for Federal Student Aid) is the form used to apply for federal student aid. It may also be used by states, schools, or other programs to determine eligibility for their own aid." },
        { type: "heading", text: "Key Points About the FAFSA", level: 3 },
        { type: "list", items: [
          "It is used to apply for federal student aid — including grants, work-study, and federal student loans.",
          "It may also be used by states, schools, or other programs to award their own aid.",
          "It should be completed using current official guidance — information requirements and deadlines can change.",
          "You generally need to reapply each year you are in school.",
        ]},
        { type: "callout", calloutType: "warning", text: "Do not hardcode outdated deadlines or award amounts. The FAFSA process, deadlines, and award amounts can change from year to year. Always check current official information." },
        { type: "heading", text: "Where to Find Current Information", level: 3 },
        { type: "paragraph", text: "For current, official information about the FAFSA, go to:" },
        { type: "callout", calloutType: "info", text: "StudentAid.gov — the official U.S. government website for federal student aid. This is where you can find current deadlines, requirements, and submit the FAFSA." },
        { type: "heading", text: "Fraud Awareness", level: 3 },
        { type: "callout", calloutType: "warning", text: "Do not pay a company just because it claims you must pay to submit the FAFSA. The FAFSA itself is free. If anyone charges you to submit it, that is a red flag." },
        { type: "callout", calloutType: "tip", text: "The FAFSA itself is free. You should never have to pay to submit it. If a website or service demands payment, go directly to StudentAid.gov instead." },
        { type: "callout", calloutType: "info", text: "This module does not request actual FAFSA information. Do not enter your real FAFSA data, tax information, or personal identifiers into the RISE LMS." },
      ],
    },

    // ======================================================================
    // LESSON 6 — HOW TO READ AN AID OFFER
    // ======================================================================
    {
      id: "m4-l6",
      title: "Not Everything Called 'Aid' Is Free Money",
      subtitle: "Reading a financial-aid offer line by line",
      estimatedMinutes: 8,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Three Categories of Aid", level: 2 },
        { type: "paragraph", text: "A financial-aid offer may list several types of aid together. To understand what you are actually getting, you need to separate them into three categories:" },
        { type: "heading", text: "Gift Aid", level: 3 },
        { type: "list", items: [
          "Grants — money you generally do not repay.",
          "Scholarships — money you generally do not repay.",
        ]},
        { type: "heading", text: "Earned Aid", level: 3 },
        { type: "list", items: [
          "Work-study — the opportunity to earn money through employment.",
        ]},
        { type: "heading", text: "Borrowed Aid", level: 3 },
        { type: "list", items: [
          "Student loans — money you must repay with interest.",
        ]},
        { type: "callout", calloutType: "warning", text: "Some financial-aid offers list loans alongside grants without clearly distinguishing them. A $30,000 'aid package' that includes $20,000 in loans is very different from $30,000 in grants. Read the offer line by line." },
        { type: "heading", text: "Example: A Fictional Aid Offer", level: 3 },
        { type: "callout", calloutType: "warning", text: "The figures below are fictional and for educational purposes only." },
        { type: "table", headers: ["Component", "Amount"], rows: [
          ["Cost of attendance", "$29,000"],
          ["Grants", "$7,000"],
          ["Scholarships", "$6,000"],
          ["Work-study eligibility", "$3,000"],
          ["Federal student loans offered", "$5,500"],
        ]},
        { type: "heading", text: "Identify Each Category", level: 3 },
        { type: "paragraph", text: "Gift aid: Grants ($7,000) + Scholarships ($6,000) = $13,000. This is money you generally do not repay." },
        { type: "paragraph", text: "Earned aid: Work-study ($3,000). This is the opportunity to earn money through employment — not guaranteed upfront money." },
        { type: "paragraph", text: "Borrowed aid: Federal student loans ($5,500). This is money you must repay with interest." },
        { type: "heading", text: "What Is the Remaining Funding Gap?", level: 3 },
        { type: "paragraph", text: "Cost of attendance ($29,000) − grants ($7,000) − scholarships ($6,000) − loans offered ($5,500) = $10,500 remaining. And that is before assuming work-study wages are immediately available — work-study is earned over time, not guaranteed upfront." },
        { type: "callout", calloutType: "tip", text: "A financial-aid offer should be read line by line. Separate gift aid from earned aid from borrowed aid. Calculate the remaining funding gap. Do not assume work-study wages are immediately available to pay the bill." },
      ],
    },

    // ======================================================================
    // LESSON 7 — FEDERAL STUDENT LOANS
    // ======================================================================
    {
      id: "m4-l7",
      title: "Understand the Loan Before You Accept It",
      subtitle: "Federal student loans — key terms and concepts",
      estimatedMinutes: 9,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What Is a Federal Student Loan?", level: 2 },
        { type: "paragraph", text: "A federal student loan is money borrowed from the federal government for education expenses. It must be repaid with interest. Before accepting any loan, you should understand the key terms." },
        { type: "heading", text: "Key Loan Terms", level: 3 },
        { type: "list", items: [
          "Borrower — the person who receives the loan and agrees to repay it.",
          "Principal — the original amount borrowed, before any interest or fees.",
          "Interest — the cost of borrowing money, usually expressed as a percentage.",
          "Interest rate — the percentage charged on the principal.",
          "Loan fee — a fee charged when the loan is disbursed, when applicable.",
          "Repayment — the process of paying back what was borrowed, usually over time.",
          "Servicer — a company that manages the loan on behalf of the lender, including collecting payments and answering questions.",
        ]},
        { type: "heading", text: "Subsidized Federal Student Loans", level: 3 },
        { type: "paragraph", text: "Certain eligible borrowers may have interest benefits during specified periods under current federal rules. This means that during certain periods — such as while enrolled at least half-time — the government may pay the interest on the loan." },
        { type: "heading", text: "Unsubsidized Federal Student Loans", level: 3 },
        { type: "paragraph", text: "Interest generally begins accruing according to federal loan terms, including while the student is in school. This means the interest adds up from the time the loan is disbursed, even while you are still enrolled." },
        { type: "callout", calloutType: "warning", text: "This module does not hardcode current federal loan limits or interest rates. Federal loan terms can change. Students should verify current federal terms at StudentAid.gov before borrowing." },
        { type: "callout", calloutType: "tip", text: "Students should verify current federal terms at StudentAid.gov before borrowing. Interest rates, loan limits, and repayment options can change from year to year. Always check the most current information." },
      ],
    },

    // ======================================================================
    // LESSON 8 — PRIVATE STUDENT LOANS
    // ======================================================================
    {
      id: "m4-l8",
      title: "Private Loans Are Different",
      subtitle: "Understanding private education loans and how they differ from federal loans",
      estimatedMinutes: 8,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What Are Private Student Loans?", level: 2 },
        { type: "paragraph", text: "Private education loans may come from banks, credit unions, online lenders, or other private lenders. They are different from federal student loans in important ways." },
        { type: "heading", text: "What to Compare in a Private Loan", level: 3 },
        { type: "list", items: [
          "Interest rate — the percentage charged on the amount borrowed.",
          "Fixed vs. variable rate — whether the rate stays the same or can change over time.",
          "Fees — any origination fees or other charges.",
          "Cosigner requirements — whether someone else must share responsibility for the loan.",
          "Repayment terms — how long you have to repay and what the payment schedule looks like.",
          "In-school payment requirements — whether you must make payments while still in school.",
          "Hardship options — what happens if you have trouble repaying.",
          "Total repayment — the full amount you will pay over the life of the loan, including interest.",
        ]},
        { type: "heading", text: "How Private Loans Differ From Federal Loans", level: 3 },
        { type: "callout", calloutType: "warning", text: "Private student loans generally do not automatically provide the same federal borrower protections or repayment options as federal student loans. Federal loans may offer income-driven repayment, deferment, forbearance, and forgiveness programs that private loans typically do not." },
        { type: "callout", calloutType: "info", text: "Do not imply that every private lender has identical terms. Private loan terms vary significantly from one lender to another. Each loan must be evaluated on its own terms." },
        { type: "callout", calloutType: "tip", text: "Understand available federal aid before considering private borrowing. Federal student loans generally offer more borrower protections. Private loans should generally be a last resort, not a first option." },
      ],
    },

    // ======================================================================
    // LESSON 9 — THE FUNDING GAP
    // ======================================================================
    {
      id: "m4-l9",
      title: "What Is Still Missing?",
      subtitle: "Calculating the funding gap",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "The Funding Gap Formula", level: 2 },
        { type: "definition", text: "Total education cost − grants − scholarships − available savings/other confirmed resources = Funding Gap" },
        { type: "paragraph", text: "The funding gap is the amount that still needs to be addressed after you subtract the money you do not have to repay (grants and scholarships) and the money you already have (savings and other confirmed resources)." },
        { type: "heading", text: "How to Address the Gap", level: 3 },
        { type: "paragraph", text: "The funding gap does not automatically mean you must borrow the entire amount. There are several ways to address it:" },
        { type: "list", items: [
          "Additional scholarships — applying for more free money.",
          "Savings — using money you have set aside.",
          "Employment — working part-time or during breaks.",
          "Reduced expenses — choosing a less expensive housing or living arrangement.",
          "Different school/program choice — selecting a path with a lower net cost.",
          "Payment plans — spreading payments over time instead of borrowing.",
          "Borrowing — taking out student loans, but only after exploring other options.",
        ]},
        { type: "callout", calloutType: "info", text: "Do not automatically assume the entire gap must become student debt. The funding gap is a problem to solve — and borrowing is only one of several tools available." },
        { type: "heading", text: "Example: Calculating the Gap", level: 3 },
        { type: "callout", calloutType: "warning", text: "The figures below are fictional and for educational purposes only." },
        { type: "table", headers: ["Component", "Amount"], rows: [
          ["Total annual cost", "$28,000"],
          ["Grants/scholarships", "$13,000"],
          ["Confirmed savings/resources", "$3,000"],
          ["Funding gap", "$12,000"],
        ]},
        { type: "paragraph", text: "$28,000 − $13,000 − $3,000 = $12,000 funding gap. This $12,000 is what still needs to be addressed — through additional scholarships, work, reduced expenses, payment plans, or borrowing." },
      ],
    },

    // ======================================================================
    // LESSON 10 — ONE YEAR VS. FOUR YEARS
    // ======================================================================
    {
      id: "m4-l10",
      title: "Think Beyond the First Semester",
      subtitle: "Estimating borrowing across the full program",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Look at the Full Program, Not Just One Year", level: 2 },
        { type: "paragraph", text: "It is easy to focus on the cost of one year — or even one semester — and lose sight of the total. But education is usually a multi-year commitment. You should estimate borrowing across the expected duration of the program." },
        { type: "heading", text: "Example: $8,000 Per Year for Four Years", level: 3 },
        { type: "callout", calloutType: "warning", text: "The figures below are fictional and for educational purposes only." },
        { type: "paragraph", text: "If a student expects to borrow $8,000 per year for four years, the estimated principal borrowed is:" },
        { type: "example", text: "$8,000 × 4 years = $32,000 estimated principal borrowed" },
        { type: "paragraph", text: "And that $32,000 is just the principal. Actual costs may rise over time, and interest may increase the total repayment beyond $32,000." },
        { type: "callout", calloutType: "warning", text: "Would you make the same borrowing decision if you looked at four years instead of one semester? Seeing $32,000 may feel very different from seeing $8,000 — even though they represent the same commitment." },
        { type: "callout", calloutType: "tip", text: "Key lesson: Small annual borrowing amounts can become large total balances over multiple years. Always estimate the total program cost, not just one year. Multiply the annual borrowing by the number of years in the program to see the full picture." },
      ],
    },

    // ======================================================================
    // LESSON 11 — INTEREST & REPAYMENT
    // ======================================================================
    {
      id: "m4-l11",
      title: "You Repay More Than You Borrow",
      subtitle: "How interest affects student-loan repayment",
      estimatedMinutes: 8,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Key Repayment Terms", level: 2 },
        { type: "list", items: [
          "Principal — the original amount borrowed.",
          "Interest — the cost of borrowing, expressed as a percentage.",
          "Interest rate — the percentage charged on the principal.",
          "Accrued interest — interest that has accumulated over time but has not yet been paid.",
          "Repayment term — the length of time over which the loan is repaid.",
          "Monthly payment — the amount due each month during repayment.",
          "Total repayment — the sum of all payments made over the life of the loan, including principal and interest.",
        ]},
        { type: "heading", text: "A Simple Illustration", level: 3 },
        { type: "callout", calloutType: "warning", text: "The figures below are fictional and for educational purposes only. Actual interest rates and terms vary." },
        { type: "paragraph", text: "Amount borrowed: $20,000. If interest applies, total repayment can exceed $20,000. The exact amount depends on the interest rate, the repayment term, and whether interest accrues during school." },
        { type: "callout", calloutType: "info", text: "This lesson does not require advanced amortization math. The key concept is simple: when you borrow money, you generally repay more than you borrowed because of interest. The longer you take to repay, the more interest may accumulate." },
        { type: "heading", text: "Fictional Loan Disclosure", level: 3 },
        { type: "paragraph", text: "Read this fictional lender disclosure and identify each figure:" },
        { type: "table", headers: ["Disclosure Item", "Amount"], rows: [
          ["Principal", "$20,000"],
          ["Interest rate (fixed, fictional)", "6.0%"],
          ["Estimated monthly payment", "$222"],
          ["Repayment term", "10 years (120 months)"],
          ["Estimated total repayment", "$26,640"],
        ]},
        { type: "paragraph", text: "In this fictional example, borrowing $20,000 at 6.0% interest over 10 years results in an estimated total repayment of $26,640. That means the borrower pays $6,640 in interest — about one-third more than the amount borrowed." },
        { type: "callout", calloutType: "tip", text: "Students should be able to identify each figure in a loan disclosure: the principal, the interest rate, the estimated monthly payment, the repayment term, and the estimated total repayment. These numbers tell you what borrowing will actually cost." },
      ],
    },

    // ======================================================================
    // LESSON 12 — CAN YOUR FUTURE BUDGET HANDLE IT?
    // ======================================================================
    {
      id: "m4-l12",
      title: "Education Debt Meets Real Life",
      subtitle: "Connecting student debt to your future budget",
      estimatedMinutes: 8,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Student Debt Does Not Exist in a Vacuum", level: 2 },
        { type: "paragraph", text: "When you borrow for education, the loan payment will eventually become part of your monthly budget — alongside rent, food, transportation, insurance, and other expenses. Before borrowing, you should think about how the payment will fit into your future financial life." },
        { type: "heading", text: "What Your Future Budget Includes", level: 3 },
        { type: "list", items: [
          "Take-home pay — your net income after taxes and deductions.",
          "Rent — housing costs.",
          "Transportation — car payment, gas, insurance, or transit costs.",
          "Insurance — health, auto, renter's, or other insurance.",
          "Food — groceries and meals.",
          "Emergency savings — money set aside for the unexpected.",
          "Other debt — credit card payments, auto loans, or other obligations.",
        ]},
        { type: "heading", text: "Scenario: A Graduate's Monthly Budget", level: 3 },
        { type: "callout", calloutType: "warning", text: "The figures below are fictional and for educational purposes only." },
        { type: "table", headers: ["Budget Item", "Monthly Amount"], rows: [
          ["Graduate's monthly net income", "$3,200"],
          ["Student-loan payment", "$425"],
          ["Housing", "$1,250"],
          ["Transportation/insurance", "$550"],
          ["Other essential expenses", "$700"],
        ]},
        { type: "heading", text: "How Much Remains?", level: 3 },
        { type: "paragraph", text: "$3,200 − $425 − $1,250 − $550 − $700 = $275 remaining. That $275 must cover food, emergency savings, any other debt, and everything else that life requires." },
        { type: "callout", calloutType: "warning", text: "Ask yourself: What other priorities must fit into that $275? How does student debt affect your flexibility? If your income is lower than expected, or if expenses are higher, the student-loan payment still must be made." },
        { type: "callout", calloutType: "tip", text: "Education debt should be considered in relation to realistic future income and expenses. A loan payment that seems manageable on paper may feel very different when it competes with rent, food, and emergency savings in real life." },
      ],
    },

    // ======================================================================
    // LESSON 13 — WHEN PAYMENTS BECOME A PROBLEM
    // ======================================================================
    {
      id: "m4-l13",
      title: "Do Not Ignore the Loan",
      subtitle: "Delinquency, default, and what to do if repayment becomes difficult",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Key Terms", level: 2 },
        { type: "list", items: [
          "Payment due date — the date by which your payment must be received.",
          "Delinquency — when a payment is missed or late; the loan is in a delinquent status.",
          "Default — when a loan is severely past due, triggering serious consequences.",
          "Loan servicer — the company that manages your loan and collects payments.",
          "Repayment options — different plans that may adjust your payment amount or schedule.",
          "Deferment — a temporary pause on payments, under certain conditions and eligibility.",
          "Forbearance — a temporary pause or reduction in payments, under certain conditions.",
        ]},
        { type: "callout", calloutType: "info", text: "Federal student-loan rules and repayment programs can change. The information here is conceptual. Always check current official options at StudentAid.gov." },
        { type: "heading", text: "What to Do If Repayment Becomes Difficult", level: 3 },
        { type: "callout", calloutType: "warning", text: "If repayment becomes difficult, communicate with the loan servicer and review current official options rather than ignoring the debt. Your loan servicer is the first point of contact — they can explain what options are available." },
        { type: "paragraph", text: "Ignoring the problem does not make it go away. In fact, it usually makes things worse. Missing payments can lead to delinquency, and continued nonpayment can lead to default — which has serious consequences." },
        { type: "heading", text: "Potential Consequences of Serious Nonpayment", level: 3 },
        { type: "paragraph", text: "Potential consequences of serious nonpayment may include damage to credit, additional costs, and loss of certain borrower benefits. This module does not overstate or hardcode specific rules that may change — but the principle is clear:" },
        { type: "callout", calloutType: "warning", text: "Missing payments does not make the debt disappear. The obligation remains, and the consequences of ignoring it can be serious and long-lasting." },
        { type: "callout", calloutType: "tip", text: "If you are struggling, contact your loan servicer immediately. There may be options available — such as different repayment plans, deferment, or forbearance — but only if you act. Do not wait until the situation gets worse." },
      ],
    },

    // ======================================================================
    // LESSON 14 — REDUCE THE NEED TO BORROW
    // ======================================================================
    {
      id: "m4-l14",
      title: "Borrowing Is One Tool — Not the Entire Plan",
      subtitle: "Strategies to reduce the need to borrow",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Strategies to Reduce Borrowing", level: 2 },
        { type: "paragraph", text: "Borrowing is one tool for paying for education — but it is not the only one. Before taking out loans, explore every option that reduces the amount you need to borrow." },
        { type: "heading", text: "Ways to Reduce the Need to Borrow", level: 3 },
        { type: "list", items: [
          "Apply for scholarships — free money you generally do not repay. Local scholarships often have less competition than national ones.",
          "Compare schools/programs — a less expensive option may provide the same credential for less.",
          "Start at community college when appropriate — complete general education at a lower cost, then transfer.",
          "Consider commuting — living at home and commuting can significantly reduce housing and food costs.",
          "Work part-time when manageable — earning income during school can reduce the amount you need to borrow.",
          "Use employer education benefits — some employers offer tuition assistance or reimbursement.",
          "Explore apprenticeship opportunities — earn while you learn, reducing or eliminating the need to borrow.",
          "Reduce unnecessary living expenses — a smaller housing arrangement, fewer discretionary purchases, and careful spending can lower your total cost.",
          "Save before enrollment — building savings before starting school gives you money to draw on.",
          "Reconsider program cost when outcomes do not justify the debt — if the career outcome does not support the borrowing, a different path may make more sense.",
        ]},
        { type: "callout", calloutType: "info", text: "Do not imply students should overwork at the expense of academic success or health. Working part-time can help, but your education and well-being come first. Find a balance that works for your situation." },
        { type: "callout", calloutType: "tip", text: "Every dollar you do not borrow is a dollar you do not owe with interest. Reducing the need to borrow is the most powerful way to make education more affordable." },
      ],
    },

    // ======================================================================
    // LESSON 15 — BEFORE YOU ACCEPT THE AID
    // ======================================================================
    {
      id: "m4-l15",
      title: "Read It. Compare It. Calculate It. Understand It.",
      subtitle: "The RISE decision framework for education financing",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Before Accepting Financial Aid or Borrowing, Ask:", level: 2 },
        { type: "paragraph", text: "Before you accept a financial-aid offer or take out a student loan, you should be able to answer all of these questions. If you cannot answer one of them, you are not ready to commit." },
        { type: "list", items: [
          "What is the total annual cost?",
          "What is the net price?",
          "Which aid is free money?",
          "Which aid must be earned?",
          "Which aid must be repaid?",
          "What is the remaining funding gap?",
          "How much might I borrow over the entire program?",
          "What interest rate applies?",
          "When does interest begin?",
          "When does repayment begin?",
          "What protections or repayment options exist?",
          "Is a cosigner required?",
          "What is the expected career outcome?",
          "What is a realistic starting salary range?",
          "Can my future budget support repayment?",
        ]},
        { type: "heading", text: "BEFORE YOU ACCEPT THE AID", level: 2 },
        { type: "callout", calloutType: "success", text: "1. READ IT. — What does the aid offer actually say? Read it line by line. Separate gift aid from earned aid from borrowed aid. Understand what you are being offered before you accept." },
        { type: "callout", calloutType: "success", text: "2. COMPARE IT. — Compare offers from multiple schools or programs. Look at net price, not just sticker price. Compare the full cost, the aid mix, and the remaining funding gap." },
        { type: "callout", calloutType: "success", text: "3. CALCULATE IT. — Calculate the funding gap. Estimate total borrowing over the entire program. Estimate what repayment will look like. See the full cost, not just one year." },
        { type: "callout", calloutType: "success", text: "4. UNDERSTAND IT. — Understand what happens after you accept. Know when interest begins, when repayment starts, what protections exist, and whether your future budget can handle the payment. Understand the full commitment before you sign." },
        { type: "callout", calloutType: "warning", text: "This is the central RISE principle for this module: Do not choose a school, program, or loan based only on the headline price or monthly payment. Understand the full cost before committing. Read it. Compare it. Calculate it. Understand it." },
      ],
    },
  ],

  // ========================================================================
  // KNOW THE TERMS
  // ========================================================================
  keyTerms: [
    { term: "Cost of Attendance", definition: "The total estimated cost of one year of education, including tuition, fees, books, supplies, equipment, housing, food, transportation, personal expenses, and technology." },
    { term: "Tuition", definition: "The cost of instruction charged by a school or program." },
    { term: "Fees", definition: "Additional charges for services, facilities, or technology, separate from tuition." },
    { term: "Net Price", definition: "The cost of attendance after certain grants and scholarships are considered — the amount you would actually need to cover." },
    { term: "Grant", definition: "Financial aid that generally does not need to be repaid when eligibility requirements are met, often based on financial need." },
    { term: "Scholarship", definition: "Financial aid that generally does not need to be repaid when requirements are satisfied, often based on academics, athletics, community service, or other criteria." },
    { term: "Work-Study", definition: "A program that provides the opportunity to earn money through eligible employment. It is not an upfront discount — the money is earned through work." },
    { term: "Financial Aid", definition: "Money provided to help pay for education, including grants, scholarships, work-study, and student loans." },
    { term: "FAFSA", definition: "Free Application for Federal Student Aid — the form used to apply for federal student aid. It may also be used by states, schools, or other programs." },
    { term: "Funding Gap", definition: "The amount that still needs to be addressed after subtracting grants, scholarships, and available savings/other confirmed resources from the total education cost." },
    { term: "Student Loan", definition: "Borrowed money for education expenses that generally must be repaid with interest." },
    { term: "Federal Student Loan", definition: "A student loan funded by the federal government, generally offering borrower protections and repayment options." },
    { term: "Private Student Loan", definition: "A student loan from a bank, credit union, online lender, or other private lender. Terms vary by lender and generally offer fewer protections than federal loans." },
    { term: "Subsidized Loan", definition: "A federal student loan where certain eligible borrowers may have interest benefits during specified periods, such as while enrolled at least half-time." },
    { term: "Unsubsidized Loan", definition: "A federal student loan where interest generally begins accruing according to federal loan terms, including while the student is in school." },
    { term: "Principal", definition: "The original amount borrowed, before any interest or fees." },
    { term: "Interest", definition: "The cost of borrowing money, usually expressed as a percentage of the amount borrowed." },
    { term: "Interest Rate", definition: "The percentage charged on the principal for the use of borrowed money." },
    { term: "Loan Fee", definition: "A fee charged when a loan is disbursed, when applicable." },
    { term: "Servicer", definition: "A company that manages a loan on behalf of the lender, including collecting payments and answering borrower questions." },
    { term: "Repayment", definition: "The process of paying back borrowed money, usually over a defined period of time." },
    { term: "Delinquency", definition: "When a loan payment is missed or late, putting the loan in a delinquent status." },
    { term: "Default", definition: "When a loan is severely past due, triggering serious consequences that may include credit damage and additional costs." },
    { term: "Cosigner", definition: "A person who agrees to share responsibility for repaying a loan if the primary borrower does not repay as agreed." },
    { term: "Fixed Interest Rate", definition: "An interest rate that stays the same for the life of the loan." },
    { term: "Variable Interest Rate", definition: "An interest rate that can change over time, based on market conditions or other factors defined in the loan terms." },
  ],

  // ========================================================================
  // SEE IT IN REAL LIFE
  // ========================================================================
  realLifeScenario: {
    title: "Maya Compares Three Paths",
    setup:
      "Maya is a high school senior considering three different postsecondary options. She wants to compare the full cost and funding gap for each before making a decision.",
    situation:
      "Option A — Four-Year University: Total annual cost $31,000. Grants/scholarships $17,000. Remaining annual gap $14,000. The program takes four years to complete.\n\nOption B — Community College + Transfer: Estimated first-year total cost $12,000. Grants/scholarships $7,500. Remaining first-year gap $4,500. The full 2+2 pathway takes four years to complete.\n\nOption C — Technical Certification: Total program cost $16,000. Grants/scholarships $4,000. Remaining program gap $12,000. The program takes 12 months to complete and leads directly to a skilled-trade career.",
    prompt:
      "Think about Maya's options and answer these questions:\n1. Which has the lowest sticker price?\n2. Which has the smallest immediate funding gap?\n3. Which program takes the least time?\n4. Which option necessarily has the best long-term value?\n5. What other information should Maya compare?\n6. How might career outcomes affect the decision?",
  },

  // ========================================================================
  // RISE DECISION LAB
  // ========================================================================
  decisionLab: {
    id: "college-decision-challenge",
    title: "RISE Decision Lab: College Decision Challenge",
    subtitle: "Compare three fictional postsecondary offers — or choose none of them",
    instructions:
      "You are comparing three fictional postsecondary offers. For each option, calculate the net cost after grants and scholarships, identify the gift aid, earned aid, and borrowed aid, calculate the remaining funding gap, estimate total borrowing over the program, and compare likely repayment burden. Then select the option you believe is most appropriate — or choose 'None of these options' if your reasoning supports it. There is no one predetermined correct school choice. All amounts are fictional and for educational purposes only. Do not subtract work-study from the upfront cost as if it is guaranteed free money.",
    fields: [
      // --- Option A: Four-Year University ---
      { id: "optionAInfo", label: "Option A — Four-Year Public University", type: "calculated", description: "Program type: Bachelor's degree. Program length: 4 years. Tuition/fees: $13,000/yr. Housing/food: $11,000/yr. Books/supplies: $1,200/yr. Transportation: $1,800/yr. Total cost of attendance: $27,000/yr. Grants: $8,000/yr. Scholarships: $5,000/yr. Work-study eligibility: $3,000/yr. Federal loans offered: $5,500/yr. Private loan option: available if needed. Estimated starting salary range after graduation: $42,000–$52,000." },

      // --- Option B: Community College + Transfer ---
      { id: "optionBInfo", label: "Option B — Community College + Transfer", type: "calculated", description: "Program type: Associate degree then transfer to bachelor's. Program length: 4 years total (2 years community college + 2 years university). Years 1–2: Tuition/fees $4,500/yr, Housing/food $6,000/yr (living at home), Books/supplies $800/yr, Transportation $1,200/yr. Total COA: $12,500/yr. Grants $5,500/yr, Scholarships $2,000/yr, Work-study $2,000/yr, Federal loans offered $3,000/yr. Years 3–4: Same costs and aid as Option A. Estimated starting salary range after graduation: $42,000–$52,000 (same degree as Option A)." },

      // --- Option C: Technical Certification ---
      { id: "optionCInfo", label: "Option C — Technical Certification Program", type: "calculated", description: "Program type: Industry certification in a skilled trade. Program length: 12 months. Tuition/fees: $10,000 total. Housing/food: $3,000 total (living at home). Books/supplies: $1,000 total. Transportation: $2,000 total. Total cost of attendance: $16,000 total. Grants: $3,000 total. Scholarships: $1,000 total. Work-study eligibility: not available. Federal loans offered: $0 (program not eligible for federal aid in this fictional scenario). Private loan option: $12,000 at a fictional fixed rate. Estimated starting salary range after completion: $38,000–$48,000." },

      // --- Task 1: Calculate net cost after grants and scholarships ---
      { id: "netCostA", label: "1a. Net cost after grants and scholarships — Option A (per year)", type: "number", placeholder: "Total COA − grants − scholarships", unit: "$", description: "$27,000 − $8,000 − $5,000" },
      { id: "netCostB", label: "1b. Net cost after grants and scholarships — Option B (Years 1–2, per year)", type: "number", placeholder: "Total COA − grants − scholarships", unit: "$", description: "$12,500 − $5,500 − $2,000" },
      { id: "netCostC", label: "1c. Net cost after grants and scholarships — Option C (total program)", type: "number", placeholder: "Total COA − grants − scholarships", unit: "$", description: "$16,000 − $3,000 − $1,000" },

      // --- Task 2: Identify gift aid ---
      { id: "giftAidA", label: "2a. Identify the gift aid for Option A", type: "text", placeholder: "Which parts of the offer are gift aid (money you generally do not repay)?" },
      { id: "giftAidB", label: "2b. Identify the gift aid for Option B (Years 1–2)", type: "text", placeholder: "Which parts of the offer are gift aid?" },
      { id: "giftAidC", label: "2c. Identify the gift aid for Option C", type: "text", placeholder: "Which parts of the offer are gift aid?" },

      // --- Task 3: Identify earned aid ---
      { id: "earnedAid", label: "3. Identify the earned aid for each option", type: "text", placeholder: "Which parts of each offer represent earned aid (work-study)?" },

      // --- Task 4: Identify borrowed aid ---
      { id: "borrowedAid", label: "4. Identify the borrowed aid for each option", type: "text", placeholder: "Which parts of each offer represent borrowed aid (loans)?" },

      // --- Task 5: Calculate the remaining funding gap ---
      { id: "fundingGapA", label: "5a. Remaining funding gap — Option A (per year, before assuming work-study wages)", type: "number", placeholder: "Net cost − federal loans offered", unit: "$", description: "Do not subtract work-study from the upfront cost" },
      { id: "fundingGapB", label: "5b. Remaining funding gap — Option B (Years 1–2, per year)", type: "number", placeholder: "Net cost − federal loans offered", unit: "$", description: "Do not subtract work-study from the upfront cost" },
      { id: "fundingGapC", label: "5c. Remaining funding gap — Option C (total program)", type: "number", placeholder: "Net cost − any loans offered", unit: "$" },

      // --- Task 6: Estimate total borrowing over the program ---
      { id: "totalBorrowingA", label: "6a. Estimated total borrowing — Option A (4 years)", type: "number", placeholder: "Annual federal loans × 4 years", unit: "$" },
      { id: "totalBorrowingB", label: "6b. Estimated total borrowing — Option B (full 4-year pathway)", type: "number", placeholder: "(Years 1–2 loans × 2) + (Years 3–4 loans × 2)", unit: "$" },
      { id: "totalBorrowingC", label: "6c. Estimated total borrowing — Option C", type: "number", placeholder: "Total borrowing for the program", unit: "$" },

      // --- Task 7: Compare likely repayment burden ---
      { id: "repaymentBurden", label: "7. Compare the likely repayment burden for each option", type: "text", placeholder: "How would the estimated monthly loan payment compare to the estimated starting salary for each option? Which option creates the most/least repayment pressure?" },

      // --- Task 8: Select an option ---
      { id: "optionSelection", label: "8. Select the option you believe is most appropriate", type: "radio", options: [
        { id: "option-a", label: "Option A — Four-Year Public University", description: "Bachelor's degree, $27,000/yr COA, 4 years, higher total borrowing" },
        { id: "option-b", label: "Option B — Community College + Transfer", description: "Same bachelor's degree, lower first-year costs, 4 years total, less borrowing" },
        { id: "option-c", label: "Option C — Technical Certification", description: "12-month program, skilled trade, private loan only, fastest to workforce" },
        { id: "none", label: "None of these options", description: "Based on my reasoning, none of these options are appropriate for my goals and circumstances" },
      ]},

      // --- Task 9: Explain the tradeoffs ---
      { id: "tradeoffExplanation", label: "9. Explain the tradeoffs of your choice", type: "text", placeholder: "What are the advantages and disadvantages of the option you selected? Why is it the best fit for your goals, finances, and career plan? Use specific numbers from the offers to support your reasoning." },
    ],
    resultPrompt:
      "There is no single predetermined correct school choice for this lab. What matters is the quality of your financial reasoning: Did you calculate net cost correctly? Did you separate gift aid, earned aid, and borrowed aid? Did you calculate the funding gap without subtracting work-study as guaranteed upfront money? Did you estimate total borrowing over the full program? Did you compare repayment burden to likely income? Did you consider career outcomes? Evaluate cost comparison, understanding of aid, borrowing analysis, long-term thinking, and quality of reasoning — not whether the student chose a specific option. 'None of these options' is a valid response when the reasoning supports it.",
  },

  // ========================================================================
  // WORKBOOK ACTIVITY
  // ========================================================================
  workbookActivity: {
    title: "My Education Cost Comparison",
    instructions:
      "Compare three fictional or hypothetical education options. For each option, complete the program details, cost breakdown, aid breakdown, calculations, and decision questions. Use fictional or estimated figures — do not enter actual FAFSA records, family income, tax returns, Social Security numbers, student-loan account numbers, passwords, or financial-aid login credentials.",
    prompts: [
      "OPTION 1 — PROGRAM: School/program name",
      "OPTION 1 — PROGRAM: Credential earned",
      "OPTION 1 — PROGRAM: Program length",
      "OPTION 1 — COST: Tuition",
      "OPTION 1 — COST: Fees",
      "OPTION 1 — COST: Housing",
      "OPTION 1 — COST: Food",
      "OPTION 1 — COST: Books/supplies",
      "OPTION 1 — COST: Transportation",
      "OPTION 1 — COST: Other",
      "OPTION 1 — COST: Total estimated cost",
      "OPTION 1 — AID: Grants",
      "OPTION 1 — AID: Scholarships",
      "OPTION 1 — AID: Work-study",
      "OPTION 1 — AID: Federal loans",
      "OPTION 1 — AID: Private loans",
      "OPTION 1 — AID: Savings/other resources",
      "OPTION 1 — CALCULATIONS: Net price (total cost − grants − scholarships)",
      "OPTION 1 — CALCULATIONS: Remaining funding gap",
      "OPTION 1 — CALCULATIONS: Estimated annual borrowing",
      "OPTION 1 — CALCULATIONS: Estimated total program borrowing",
      "OPTION 1 — DECISION: What are the strongest reasons for this option?",
      "OPTION 1 — DECISION: What concerns do I have?",
      "OPTION 1 — DECISION: What questions do I still need answered?",
      "OPTION 2 — PROGRAM: School/program name",
      "OPTION 2 — PROGRAM: Credential earned",
      "OPTION 2 — PROGRAM: Program length",
      "OPTION 2 — COST: Tuition",
      "OPTION 2 — COST: Fees",
      "OPTION 2 — COST: Housing",
      "OPTION 2 — COST: Food",
      "OPTION 2 — COST: Books/supplies",
      "OPTION 2 — COST: Transportation",
      "OPTION 2 — COST: Other",
      "OPTION 2 — COST: Total estimated cost",
      "OPTION 2 — AID: Grants",
      "OPTION 2 — AID: Scholarships",
      "OPTION 2 — AID: Work-study",
      "OPTION 2 — AID: Federal loans",
      "OPTION 2 — AID: Private loans",
      "OPTION 2 — AID: Savings/other resources",
      "OPTION 2 — CALCULATIONS: Net price",
      "OPTION 2 — CALCULATIONS: Remaining funding gap",
      "OPTION 2 — CALCULATIONS: Estimated annual borrowing",
      "OPTION 2 — CALCULATIONS: Estimated total program borrowing",
      "OPTION 2 — DECISION: What are the strongest reasons for this option?",
      "OPTION 2 — DECISION: What concerns do I have?",
      "OPTION 2 — DECISION: What questions do I still need answered?",
      "OPTION 3 — PROGRAM: School/program name",
      "OPTION 3 — PROGRAM: Credential earned",
      "OPTION 3 — PROGRAM: Program length",
      "OPTION 3 — COST: Tuition",
      "OPTION 3 — COST: Fees",
      "OPTION 3 — COST: Housing",
      "OPTION 3 — COST: Food",
      "OPTION 3 — COST: Books/supplies",
      "OPTION 3 — COST: Transportation",
      "OPTION 3 — COST: Other",
      "OPTION 3 — COST: Total estimated cost",
      "OPTION 3 — AID: Grants",
      "OPTION 3 — AID: Scholarships",
      "OPTION 3 — AID: Work-study",
      "OPTION 3 — AID: Federal loans",
      "OPTION 3 — AID: Private loans",
      "OPTION 3 — AID: Savings/other resources",
      "OPTION 3 — CALCULATIONS: Net price",
      "OPTION 3 — CALCULATIONS: Remaining funding gap",
      "OPTION 3 — CALCULATIONS: Estimated annual borrowing",
      "OPTION 3 — CALCULATIONS: Estimated total program borrowing",
      "OPTION 3 — DECISION: What are the strongest reasons for this option?",
      "OPTION 3 — DECISION: What concerns do I have?",
      "OPTION 3 — DECISION: What questions do I still need answered?",
    ],
  },

  // ========================================================================
  // KNOWLEDGE CHECK — 10 questions, 70% to pass
  // ========================================================================
  knowledgeCheck: [
    {
      id: "m4-q1",
      type: "multiple_choice",
      question: "What does cost of attendance include?",
      options: [
        "Tuition only",
        "Tuition, fees, books, supplies, equipment, housing, food, transportation, personal expenses, and technology",
        "Tuition and fees only",
        "Tuition, fees, and books only",
      ],
      correctAnswer: "Tuition, fees, books, supplies, equipment, housing, food, transportation, personal expenses, and technology",
      explanation: "Cost of attendance is broader than tuition alone. It includes the full estimated cost of one year of education — tuition, fees, books, supplies, equipment, housing, food, transportation, personal expenses, and technology.",
    },
    {
      id: "m4-q2",
      type: "multiple_choice",
      question: "What is the difference between sticker price and net price?",
      options: [
        "They are the same thing",
        "Sticker price is the published cost before financial aid; net price is the cost after certain grants and scholarships are considered",
        "Net price is always higher than sticker price",
        "Sticker price is what you pay; net price is what the school charges",
      ],
      correctAnswer: "Sticker price is the published cost before financial aid; net price is the cost after certain grants and scholarships are considered",
      explanation: "Sticker price is the published cost of attendance before aid. Net price is what you actually need to cover after grants and scholarships are subtracted. Two schools with different sticker prices can have similar net prices.",
    },
    {
      id: "m4-q3",
      type: "multiple_choice",
      question: "Which type of financial aid generally does NOT need to be repaid?",
      options: [
        "Federal student loans",
        "Private student loans",
        "Grants and scholarships",
        "All forms of financial aid must be repaid",
      ],
      correctAnswer: "Grants and scholarships",
      explanation: "Grants and scholarships are gift aid — money you generally do not repay when eligibility requirements are met. Student loans must be repaid with interest. Work-study is earned through employment.",
    },
    {
      id: "m4-q4",
      type: "multiple_choice",
      question: "Which of the following best describes work-study?",
      options: [
        "It is an upfront discount automatically applied to your tuition bill",
        "It provides the opportunity to earn money through eligible employment — it is not guaranteed upfront money",
        "It is a type of grant that does not need to be repaid",
        "It is a type of loan that must be repaid with interest",
      ],
      correctAnswer: "It provides the opportunity to earn money through eligible employment — it is not guaranteed upfront money",
      explanation: "Work-study money is generally earned through employment rather than automatically applied to the student's bill. Do not treat it as an upfront discount or subtract it from the cost as if it is guaranteed free money.",
    },
    {
      id: "m4-q5",
      type: "true_false",
      question: "The FAFSA itself is free, and you should not pay a company that claims you must pay to submit it.",
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "The FAFSA is free. Do not pay a company just because it claims you must pay to submit the FAFSA. Go directly to StudentAid.gov for current official information.",
    },
    {
      id: "m4-q6",
      type: "multiple_choice",
      question: "Which of the following is true about federal student loans compared to private student loans?",
      options: [
        "Private student loans generally offer more borrower protections than federal student loans",
        "Federal student loans generally offer more borrower protections and repayment options than private student loans",
        "Federal and private student loans are identical in terms and protections",
        "Neither type of loan offers any borrower protections",
      ],
      correctAnswer: "Federal student loans generally offer more borrower protections and repayment options than private student loans",
      explanation: "Federal student loans may offer income-driven repayment, deferment, forbearance, and other protections that private loans generally do not automatically provide. Understand available federal aid before considering private borrowing.",
    },
    {
      id: "m4-q7",
      type: "multiple_choice",
      question: "What is the key difference between subsidized and unsubsidized federal student loans?",
      options: [
        "Subsidized loans have higher interest rates",
        "With subsidized loans, certain eligible borrowers may have interest benefits during specified periods; with unsubsidized loans, interest generally begins accruing according to federal loan terms, including while in school",
        "Unsubsidized loans are only for graduate students",
        "There is no difference between them",
      ],
      correctAnswer: "With subsidized loans, certain eligible borrowers may have interest benefits during specified periods; with unsubsidized loans, interest generally begins accruing according to federal loan terms, including while in school",
      explanation: "Subsidized loans may provide interest benefits during certain periods (such as while enrolled at least half-time). Unsubsidized loans generally accrue interest from the time they are disbursed, including while you are in school. Always verify current federal terms at StudentAid.gov.",
    },
    {
      id: "m4-q8",
      type: "scenario",
      question: "Annual cost: $27,000. Grants/scholarships: $15,000. Confirmed savings: $2,000. What is the remaining funding gap?",
      options: ["$10,000", "$12,000", "$25,000", "$42,000"],
      correctAnswer: "$10,000",
      explanation: "Funding gap = Total cost − grants − scholarships − confirmed savings = $27,000 − $15,000 − $2,000 = $10,000. This $10,000 still needs to be addressed through additional scholarships, work, reduced expenses, payment plans, or borrowing.",
    },
    {
      id: "m4-q9",
      type: "scenario",
      question: "A student qualifies for $3,000 in work-study. Should that amount automatically be subtracted from the current tuition bill as guaranteed upfront aid?",
      options: [
        "Yes — work-study is guaranteed money that is applied directly to the bill",
        "No — work-study generally represents the opportunity to earn money through employment, not guaranteed upfront aid",
        "Yes — work-study is the same as a grant",
        "It depends on the student's GPA",
      ],
      correctAnswer: "No — work-study generally represents the opportunity to earn money through employment, not guaranteed upfront aid",
      explanation: "Work-study money is generally earned through employment rather than automatically applied to the student's bill. Do not subtract it from the upfront cost as if it is guaranteed free money.",
    },
    {
      id: "m4-q10",
      type: "scenario",
      question: "A student expects to borrow $8,000 per year for four years. What is the estimated total principal borrowed, and what should the student keep in mind?",
      options: [
        "$8,000 — only the first year matters",
        "$32,000 — and actual costs may rise and interest may increase total repayment beyond this amount",
        "$32,000 — and this is the exact amount the student will repay, no more",
        "$8,000 — borrowing resets each year so the total is always just one year",
      ],
      correctAnswer: "$32,000 — and actual costs may rise and interest may increase total repayment beyond this amount",
      explanation: "$8,000 × 4 years = $32,000 estimated principal. But actual costs may rise over time, and interest may increase the total repayment beyond $32,000. Small annual borrowing amounts can become large total balances over multiple years.",
    },
  ],

  // ========================================================================
  // REFLECTION
  // ========================================================================
  reflection: {
    prompt:
      "What is one thing you would now compare before choosing a college, training program, or education loan that you might not have considered before?",
    placeholder: "Write your reflection here...",
  },

  // ========================================================================
  // ACTION COMMITMENT
  // ========================================================================
  actionCommitment: {
    prompt:
      "Before I accept financial aid or borrow for education, I will ____________.",
    placeholder: "I will...",
  },

  // ========================================================================
  // RISE FINANCIAL BLUEPRINT UPDATE
  // ========================================================================
  blueprintUpdate: {
    sectionKey: "education_financing",
    sectionTitle: "My Education Financing Plan",
    prompt:
      "Complete your Education Financing Plan. Use estimates or fictional information — do not enter actual FAFSA records, parent income, tax returns, Social Security numbers, student-loan account numbers, passwords, or financial-aid login credentials.",
    fields: [
      { id: "postsecondaryPath", label: "Postsecondary path I am considering", type: "text", placeholder: "e.g., community college then transfer, trade school, four-year university" },
      { id: "estimatedProgramLength", label: "Estimated program length", type: "text", placeholder: "e.g., 2 years, 4 years, 12 months" },
      { id: "estimatedAnnualCost", label: "Estimated annual cost", type: "text", placeholder: "e.g., $12,000/year" },
      { id: "grantsScholarshipsPursuing", label: "Grants/scholarships I may pursue", type: "textarea", placeholder: "e.g., Pell Grant, local community scholarships, merit aid" },
      { id: "workStudyPlan", label: "Work-study or employment plan", type: "text", placeholder: "e.g., work-study on campus, part-time job 15 hrs/week" },
      { id: "estimatedSavings", label: "Estimated savings/resources", type: "text", placeholder: "e.g., $3,000 from summer job" },
      { id: "estimatedAnnualGap", label: "Estimated annual funding gap", type: "text", placeholder: "e.g., $8,000/year" },
      { id: "estimatedBorrowingPerYear", label: "Estimated borrowing per year", type: "text", placeholder: "e.g., $5,500/year in federal loans" },
      { id: "estimatedTotalBorrowing", label: "Estimated total borrowing for the program", type: "text", placeholder: "e.g., $22,000 over 4 years" },
      { id: "personalBorrowingLimit", label: "My personal borrowing limit or rule", type: "text", placeholder: "e.g., I will not borrow more than my expected first-year salary" },
      { id: "questionsForLender", label: "Questions I will ask before accepting a loan", type: "textarea", placeholder: "e.g., What is the interest rate? When does interest begin? What repayment options exist?" },
      { id: "careerField", label: "Career field I am considering", type: "text", placeholder: "e.g., nursing, IT, electrician, business" },
      { id: "expectedStartingIncome", label: "Expected starting-income range (using an estimate)", type: "text", placeholder: "e.g., $40,000–$50,000 (estimated)" },
      { id: "budgetImpact", label: "How student-loan payments might affect my future monthly budget", type: "textarea", placeholder: "e.g., a $250/month payment would leave less room for rent and savings" },
      { id: "reduceBorrowingStrategy", label: "One strategy I can use to reduce borrowing", type: "text", placeholder: "e.g., start at community college, apply for 5 more scholarships, commute from home" },
    ],
  },
};
