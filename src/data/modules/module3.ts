import type { CourseModule } from "../course-types";

export const module3: CourseModule = {
  id: "module-3",
  number: 3,
  title: "Credit & Borrowing — Before You Sign",
  subtitle:
    "Credit can create opportunities or expensive obligations. Learn what borrowing really costs before you agree to it.",
  estimatedTime: "115 minutes",
  icon: "💳",
  themeColor: "rise-red",
  overview:
    "Credit can open doors — but it can also create obligations that follow you for years. This module teaches you what borrowing really costs before you agree to it. You will learn the difference between credit, debt, and borrowing, what a credit report and credit score generally represent, and how your financial behavior can strengthen or weaken your credit history over time. You will calculate credit utilization, distinguish credit cards from debit cards, and understand APR, interest, minimum payments, fees, and credit limits. We compare secured and unsecured credit, installment loans, cosigning responsibilities, buy-now-pay-later risks, and high-cost borrowing. Most importantly, you will learn to read, compare, calculate, and understand any credit or loan offer before you sign. The central RISE principle for this module is simple: Before You Sign — Read it. Compare it. Calculate it. Understand it.",
  objectives: [
    "Explain the difference between credit, debt, and borrowing",
    "Explain the purpose of a credit report",
    "Explain what a credit score generally represents",
    "Identify behaviors that can strengthen or weaken a credit history",
    "Calculate credit utilization",
    "Distinguish a credit card from a debit card",
    "Explain APR, interest, minimum payments, fees, and credit limits",
    "Distinguish secured from unsecured credit",
    "Compare borrowing offers using cost and repayment terms",
    "Explain the responsibilities associated with cosigning",
    "Identify potential risks of BNPL and high-cost borrowing",
    "Review important terms before signing a credit or loan agreement",
  ],
  lessons: [
    // ======================================================================
    // LESSON 1 — CREDIT IS BORROWED MONEY
    // ======================================================================
    {
      id: "m3-l1",
      title: "Credit, Debt & Borrowing",
      subtitle: "Available credit is not the same as available income",
      estimatedMinutes: 10,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What Is Credit?", level: 2 },
        { type: "paragraph", text: "Credit gives you access to money, goods, or services now with an agreement to repay later. When you use credit, you are borrowing — and borrowing creates an obligation. That obligation is called debt." },
        { type: "heading", text: "Key Terms", level: 3 },
        { type: "list", items: [
          "Credit — access to money, goods, or services now with an agreement to repay later.",
          "Borrowing — the act of using credit to obtain money, goods, or services.",
          "Debt — the amount you owe as a result of borrowing.",
          "Lender — the person or institution that provides the credit or loan.",
          "Borrower — the person who receives the credit or loan and agrees to repay.",
          "Principal — the original amount borrowed, before any interest or fees.",
          "Interest — the cost of borrowing money, usually expressed as a percentage.",
          "Finance charge — the total cost of borrowing, including interest and certain fees.",
          "Repayment — the process of paying back what was borrowed, usually over time.",
        ]},
        { type: "heading", text: "Types of Credit You May Encounter", level: 3 },
        { type: "paragraph", text: "As a high school student or young adult, you may soon encounter several forms of credit:" },
        { type: "list", items: [
          "Credit card — revolving credit you can use repeatedly up to a limit.",
          "Auto loan — an installment loan to purchase a vehicle.",
          "Personal loan — a lump-sum loan repaid in scheduled payments.",
          "Student loan — money borrowed for education expenses (covered in detail in Module 4).",
          "Installment financing — a purchase paid for through scheduled payments.",
          "Buy Now, Pay Later (BNPL) — a purchase split into a small number of payments.",
        ]},
        { type: "callout", calloutType: "info", text: "Each of these gives you access to something now — a car, a purchase, an education — in exchange for a promise to repay later. That promise is a legal obligation, not a suggestion." },
        { type: "heading", text: "A Simple Decision Question", level: 3 },
        { type: "callout", calloutType: "warning", text: "If you borrow $500, have you increased your income?" },
        { type: "paragraph", text: "Correct principle: No. Borrowing provides access to money, but it also creates debt that must be repaid. The $500 is not income — it is an obligation. You now owe $500 (plus any interest or fees) to a lender." },
        { type: "callout", calloutType: "tip", text: "Key takeaway: Available credit is not the same as available income. A credit card with a $2,000 limit does not mean you have $2,000 to spend. It means you can borrow up to $2,000 — and everything you borrow must be repaid." },
      ],
    },

    // ======================================================================
    // LESSON 2 — YOUR CREDIT HISTORY
    // ======================================================================
    {
      id: "m3-l2",
      title: "What Is a Credit Report?",
      subtitle: "A record of borrowing history — not a judgment of your worth",
      estimatedMinutes: 10,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What a Credit Report Contains", level: 2 },
        { type: "paragraph", text: "A credit report contains information about a person's credit history. It is a record — not a judgment. Lenders may use it to help decide whether to extend credit and on what terms. But a credit report is not a complete picture of someone's financial worth or character." },
        { type: "heading", text: "What a Credit Report May Include", level: 3 },
        { type: "list", items: [
          "Identifying information — name, address, and similar details used to match the report to the right person.",
          "Credit accounts — loans and credit cards that have been opened, including the type and status of each.",
          "Payment history — whether payments have been made on time or late.",
          "Account balances — amounts currently owed on credit accounts.",
          "Credit limits — the maximum amount available on revolving credit accounts.",
          "Certain collections or other reportable information — items that may appear when obligations are not met.",
          "Credit inquiries — records of who has requested a copy of the credit report.",
        ]},
        { type: "callout", calloutType: "info", text: "A credit report is not a complete picture of someone's financial worth or character. It does not include income, savings, or personal values. It is a record of borrowing history — nothing more and nothing less." },
        { type: "heading", text: "What a Credit Report Is Not For", level: 3 },
        { type: "paragraph", text: "A credit report does not measure whether someone is a good person, a hard worker, or a responsible adult. It records borrowing and repayment activity. Many factors that matter in life — generosity, work ethic, kindness, creativity — do not appear on a credit report." },
        { type: "heading", text: "Young People and Credit History", level: 3 },
        { type: "paragraph", text: "Many young people have little or no credit history. This is normal. Having no credit history is different from having poor credit history." },
        { type: "definition", text: "Credit invisible — a person who has little or no credit history on file with credit-reporting agencies. This is common among young people and is not the same as having bad credit." },
        { type: "callout", calloutType: "info", text: "Being credit invisible is not a failure. It simply means you have not yet had the opportunity to build a borrowing record. Over time, responsible credit use can help establish a credit history." },
        { type: "heading", text: "Checking Your Own Credit Report", level: 3 },
        { type: "callout", calloutType: "tip", text: "Checking your own credit report does not mean you failed financially. Reviewing information for accuracy is a responsible financial habit. You are entitled to request a free copy of your credit report from each of the nationwide credit-reporting agencies, and reviewing it regularly is a smart practice." },
        { type: "callout", calloutType: "warning", text: "This module uses fictional credit reports only. Do not access or upload your actual credit report for this course. If you want to review your own report, do so privately through official channels — never through a link sent by email or text." },
      ],
    },

    // ======================================================================
    // LESSON 3 — CREDIT SCORES
    // ======================================================================
    {
      id: "m3-l3",
      title: "What Does a Credit Score Tell a Lender?",
      subtitle: "A numerical estimate of credit risk — not a measure of your value",
      estimatedMinutes: 10,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What a Credit Score Is", level: 2 },
        { type: "paragraph", text: "Credit scores are numerical models designed to help estimate credit risk based on information in a credit report. A credit score gives a lender a quick, standardized way to assess how likely a borrower is to repay as agreed. But a credit score is not a measure of a person's worth — it is a tool lenders use to evaluate risk." },
        { type: "heading", text: "There Is More Than One Score", level: 3 },
        { type: "list", items: [
          "There are multiple credit-scoring models. Different models may produce different numbers for the same person.",
          "Different lenders may use different scores. The score one lender sees may not be the same score another lender sees.",
          "Not every score a consumer sees will necessarily be the score a lender uses. Some services show educational scores that are estimates, not the exact scores lenders rely on.",
        ]},
        { type: "callout", calloutType: "info", text: "Do not assume the number you see on a free app is the exact number a lender will see. It may be close, but it may not be identical. What matters more than any single number is the behavior that shapes your credit over time." },
        { type: "heading", text: "Behaviors That Can Generally Affect Credit", level: 3 },
        { type: "paragraph", text: "While exact formulas vary by scoring model, these behaviors generally influence credit scores:" },
        { type: "table", headers: ["Behavior", "What It Means"], rows: [
          ["Paying bills as agreed", "Making payments on time is one of the most important factors in most scoring models"],
          ["Amounts owed", "How much you currently owe across your credit accounts"],
          ["Use of available revolving credit", "How much of your available credit limit you are using (credit utilization)"],
          ["Length / history of credit accounts", "How long your credit accounts have been open — longer histories can help"],
          ["Applications for new credit", "Recent applications can create inquiries that may affect your score"],
          ["Types of credit accounts", "Having a mix of credit types (such as revolving and installment) may be a factor"],
        ]},
        { type: "callout", calloutType: "warning", text: "This module does not hardcode one scoring company's percentage formula as if it applies to every credit score. Different models weight factors differently. The important thing is to understand the behaviors that generally matter — not to memorize a single formula." },
        { type: "heading", text: "No Instant Shortcuts", level: 3 },
        { type: "callout", calloutType: "tip", text: "Credit scores are influenced by financial behavior over time. There is no legitimate instant shortcut to perfect credit. Anyone who promises to 'fix' your credit overnight is not acting in your best interest. Responsible habits — paying on time, keeping balances low, and borrowing only when necessary — are the real path to a strong credit history." },
      ],
    },

    // ======================================================================
    // LESSON 4 — CREDIT UTILIZATION
    // ======================================================================
    {
      id: "m3-l4",
      title: "How Much of Your Credit Are You Using?",
      subtitle: "Calculating revolving credit utilization",
      estimatedMinutes: 10,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What Is Credit Utilization?", level: 2 },
        { type: "paragraph", text: "Credit utilization is the percentage of your available revolving credit that you are currently using. It is one of the behaviors that can generally affect your credit. Lenders may view lower utilization more favorably because it suggests you are not relying heavily on borrowed money." },
        { type: "heading", text: "The Formula", level: 3 },
        { type: "definition", text: "Credit Card Balance ÷ Credit Limit × 100 = Utilization Percentage" },
        { type: "heading", text: "Example 1", level: 3 },
        { type: "example", text: "Credit limit: $1,000. Current balance: $300. Calculation: $300 ÷ $1,000 × 100 = 30%. The utilization rate is 30%." },
        { type: "heading", text: "Example 2", level: 3 },
        { type: "example", text: "Credit limit: $2,500. Current balance: $1,000. Calculation: $1,000 ÷ $2,500 × 100 = 40%. The utilization rate is 40%." },
        { type: "callout", calloutType: "info", text: "Using less of your available revolving credit generally presents less credit risk than being close to the limit. However, this module does not promise a specific score increase based on one utilization percentage. Credit scores are influenced by many factors over time — utilization is just one of them." },
        { type: "callout", calloutType: "warning", text: "A higher credit limit is not permission to spend more than you can repay. If your limit increases from $1,000 to $5,000, that does not mean you can now afford to carry $5,000 in debt. The limit is what the lender allows you to borrow — not what you can afford to repay." },
        { type: "heading", text: "Quick Practice", level: 3 },
        { type: "callout", calloutType: "tip", text: "Try it yourself: A student has a credit limit of $2,000 and a balance of $500. What is the utilization? (Answer: $500 ÷ $2,000 × 100 = 25%)" },
      ],
    },

    // ======================================================================
    // LESSON 5 — CREDIT CARDS
    // ======================================================================
    {
      id: "m3-l5",
      title: "A Credit Card Is a Loan, Not Extra Money",
      subtitle: "Understanding how credit cards actually work",
      estimatedMinutes: 12,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "How a Credit Card Works", level: 2 },
        { type: "paragraph", text: "A credit card is a form of revolving credit. You can borrow up to a credit limit, repay some or all of what you borrowed, and then borrow again. Unlike an installment loan with fixed payments, revolving credit gives you flexibility — but that flexibility can lead to carrying balances that cost money in interest." },
        { type: "heading", text: "Key Credit Card Terms", level: 3 },
        { type: "table", headers: ["Term", "What It Means"], rows: [
          ["Revolving credit", "Credit you can use repeatedly up to a limit; you repay and can borrow again"],
          ["Credit limit", "The maximum amount you can borrow on the card at any one time"],
          ["Statement balance", "The total amount you owe as of the statement closing date"],
          ["Current balance", "The total amount you owe at this moment, including charges after the statement date"],
          ["Available credit", "Credit limit minus current balance — how much more you can borrow"],
          ["Billing cycle", "The period covered by a single statement, usually about 28–31 days"],
          ["Payment due date", "The date by which your payment must be received to avoid late fees"],
          ["Minimum payment", "The smallest amount you can pay to keep the account current"],
          ["Grace period", "A period during which you can pay your balance in full without incurring interest charges, if the card offers one"],
          ["APR", "Annual Percentage Rate — the yearly cost of borrowing on the card"],
          ["Purchase APR", "The APR that applies to purchases made with the card"],
          ["Cash advance", "Borrowing cash from the credit card; often has a higher APR and no grace period"],
          ["Late fee", "A fee charged when a payment is not received by the due date"],
          ["Annual fee", "A yearly charge for having the card, charged by some cards"],
        ]},
        { type: "heading", text: "Credit Card vs. Debit Card", level: 3 },
        { type: "callout", calloutType: "info", text: "Debit card: generally uses money already in a deposit account. When you make a purchase, the money comes out of your checking or savings account. You are spending your own money." },
        { type: "callout", calloutType: "info", text: "Credit card: generally uses borrowed money that must be repaid. When you make a purchase, you are borrowing from the card issuer. You owe that amount until you pay it back — and you may owe interest if you do not pay the full balance." },
        { type: "heading", text: "Purchases Increase Debt. Payments Reduce Debt.", level: 3 },
        { type: "paragraph", text: "This is the fundamental rule of credit cards: Credit card purchases increase debt. Payments reduce debt. Every purchase you make with a credit card adds to what you owe. Every payment you make reduces what you owe. The card is not giving you free money — it is lending you money that you must repay." },
        { type: "heading", text: "Minimum Payments and Carrying a Balance", level: 3 },
        { type: "callout", calloutType: "warning", text: "Paying only the minimum payment can keep an account current, but carrying a balance can result in additional interest and a longer repayment period. If you carry a $1,000 balance and only pay the minimum each month, it can take years to pay off the debt — and you may pay more in interest than the original purchase cost." },
        { type: "callout", calloutType: "tip", text: "This module does not teach students to intentionally carry interest-bearing debt simply to 'build credit.' The most responsible approach is to pay your balance in full each month when possible. If you cannot pay in full, pay as much as you can — every dollar above the minimum reduces the interest you will owe." },
      ],
    },

    // ======================================================================
    // LESSON 6 — READ THE CREDIT CARD OFFER
    // ======================================================================
    {
      id: "m3-l6",
      title: "APR, Fees & the Fine Print",
      subtitle: "Comparing credit card offers — beyond the advertising",
      estimatedMinutes: 11,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Read the Disclosures, Not the Advertisement", level: 2 },
        { type: "paragraph", text: "Credit card advertisements highlight rewards, sign-up bonuses, and low introductory rates. But the full terms are in the disclosures — the fine print. Before you apply for any card, you should compare these key terms:" },
        { type: "heading", text: "What to Compare", level: 3 },
        { type: "list", items: [
          "APR — the annual percentage rate for purchases.",
          "Introductory APR — a temporary rate that may be lower than the standard rate.",
          "Length of introductory period — how long the intro rate lasts before the standard rate applies.",
          "APR after introductory period — the rate that applies once the intro period ends.",
          "Annual fee — a yearly charge for having the card.",
          "Late-payment fee — charged when a payment is not received by the due date.",
          "Balance-transfer fee — a fee for moving debt from one card to another.",
          "Cash-advance fee — a fee for borrowing cash from the card.",
          "Foreign-transaction fee — a fee for purchases made in a foreign currency or through a foreign bank, when applicable.",
          "Penalty terms — what happens if you violate the card agreement (for example, a penalty APR that may apply after a late payment).",
          "Grace period — whether the card offers a period during which you can pay in full without incurring interest.",
          "Rewards — cash back, points, or miles offered for purchases.",
        ]},
        { type: "callout", calloutType: "warning", text: "Rewards do not automatically make a card a good deal. If a card charges a $95 annual fee and a high APR, the rewards may not offset the costs — especially if you carry a balance. Always compare the full terms, not just the rewards." },
        { type: "heading", text: "Card A vs. Card B", level: 3 },
        { type: "paragraph", text: "Compare these two fictional credit card offers:" },
        { type: "table", headers: ["Feature", "Card A", "Card B"], rows: [
          ["Annual fee", "$0", "$95"],
          ["Purchase APR", "22% variable", "29% variable"],
          ["Rewards", "None", "2% cash back"],
        ]},
        { type: "callout", calloutType: "warning", text: "Which is better?" },
        { type: "paragraph", text: "Correct teaching principle: There is not enough information to declare one card universally better. The answer depends on how the card will be used, whether balances will be carried, fees, spending behavior, and other terms. If someone pays their balance in full every month and spends enough to earn more than $95 in rewards, Card B's rewards might outweigh the annual fee. But if someone carries a balance, Card B's 29% APR could cost far more than any rewards earned. Card A has no annual fee and a lower APR, which may be better for someone who occasionally carries a balance." },
        { type: "callout", calloutType: "tip", text: "Teach students to read disclosures rather than choosing based only on advertising. The ad says 'Earn 3X points!' — but the disclosure tells you the APR, fees, and conditions that determine whether the card is actually a good deal for you." },
      ],
    },

    // ======================================================================
    // LESSON 7 — SECURED, UNSECURED & INSTALLMENT CREDIT
    // ======================================================================
    {
      id: "m3-l7",
      title: "Not All Borrowing Works the Same Way",
      subtitle: "Secured, unsecured, and installment credit explained",
      estimatedMinutes: 11,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Secured Credit", level: 2 },
        { type: "definition", text: "Secured credit is credit backed by collateral or a security deposit, depending on the product. If the borrower does not repay as agreed, the lender may be able to claim the collateral." },
        { type: "paragraph", text: "Examples of secured credit:" },
        { type: "list", items: [
          "Auto loan — secured by the vehicle. If the borrower does not repay, the lender may repossess the vehicle.",
          "Secured credit card — supported by a cash deposit. The deposit typically serves as the credit limit and protects the lender if the cardholder does not pay.",
        ]},
        { type: "heading", text: "Unsecured Credit", level: 2 },
        { type: "definition", text: "Unsecured credit is credit generally not backed by specific collateral. The lender relies on the borrower's promise to repay." },
        { type: "paragraph", text: "Examples of unsecured credit:" },
        { type: "list", items: [
          "Many traditional credit cards — not backed by a deposit or specific asset.",
          "Some personal loans — not tied to a specific piece of collateral.",
        ]},
        { type: "heading", text: "Installment Loans", level: 2 },
        { type: "definition", text: "An installment loan is money borrowed and generally repaid through scheduled payments over a defined period. Unlike revolving credit (which you can use repeatedly up to a limit), an installment loan has a set amount, a set number of payments, and a defined end date." },
        { type: "heading", text: "Installment Credit vs. Revolving Credit", level: 3 },
        { type: "table", headers: ["Feature", "Installment Credit", "Revolving Credit"], rows: [
          ["How it works", "Borrow a set amount, repay in scheduled payments", "Borrow up to a limit, repay and borrow again"],
          ["Payment", "Generally fixed monthly payment", "Payment varies based on balance"],
          ["End date", "Defined — loan is paid off after the last payment", "No defined end date — continues as long as the account is open"],
          ["Examples", "Auto loan, personal loan, student loan", "Credit card, line of credit"],
        ]},
        { type: "heading", text: "Key Installment Loan Terms", level: 3 },
        { type: "list", items: [
          "Principal — the original amount borrowed.",
          "Loan term — the length of time over which the loan is repaid.",
          "Monthly payment — the amount due each month.",
          "APR — the annual percentage rate, including certain fees.",
          "Total repayment — the sum of all payments made over the life of the loan.",
          "Collateral — the asset that secures the loan, if applicable.",
        ]},
        { type: "callout", calloutType: "warning", text: "The smallest monthly payment does not necessarily mean the least expensive loan. A longer term can lower the monthly payment while increasing the total amount paid. A 60-month auto loan may have a lower monthly payment than a 36-month loan — but you may pay more in total because you are paying interest for a longer period." },
      ],
    },

    // ======================================================================
    // LESSON 8 — BEFORE YOU BORROW
    // ======================================================================
    {
      id: "m3-l8",
      title: "Compare the Total Cost",
      subtitle: "Why the lowest monthly payment is not always the cheapest loan",
      estimatedMinutes: 12,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "The $5,000 Loan Comparison", level: 2 },
        { type: "paragraph", text: "A student needs to finance $5,000 for an important purchase. Two lenders offer different terms. Let's compare them." },
        { type: "callout", calloutType: "warning", text: "The figures below are fictional and for educational purposes only. Actual loan terms vary. The point is to learn how to compare — not to memorize these specific numbers." },
        { type: "table", headers: ["Feature", "Loan A", "Loan B"], rows: [
          ["Amount borrowed", "$5,000", "$5,000"],
          ["APR", "12%", "18%"],
          ["Loan term", "24 months", "48 months"],
          ["Monthly payment", "~$235", "~$147"],
          ["Total repayment", "~$5,649", "~$7,070"],
          ["Total interest paid", "~$649", "~$2,070"],
        ]},
        { type: "heading", text: "What Do You Notice?", level: 3 },
        { type: "paragraph", text: "Loan B has a lower monthly payment ($147 vs. $235), which might seem more affordable at first glance. But Loan B costs significantly more in total — about $7,070 compared to Loan A's $5,649. That is a difference of more than $1,400, mostly because of the higher APR and longer term." },
        { type: "heading", text: "What Students Should Identify", level: 3 },
        { type: "list", items: [
          "Amount borrowed — how much is actually being borrowed ($5,000 in both cases).",
          "APR — the annual percentage rate for each loan (12% vs. 18%).",
          "Monthly payment — what is due each month ($235 vs. $147).",
          "Loan term — how long the repayment lasts (24 months vs. 48 months).",
          "Fees — any origination fees or other charges (none in this example, but always check).",
          "Total repayment — the full amount paid over the life of the loan ($5,649 vs. $7,070).",
        ]},
        { type: "callout", calloutType: "tip", text: "Key lesson: Affordability is not just 'Can I make this month's payment?' It also includes what the debt will cost over time. A lower monthly payment can mean a longer term and a higher total cost. Always look at the total repayment, not just the monthly payment." },
      ],
    },

    // ======================================================================
    // LESSON 9 — COSIGNING & SHARED RESPONSIBILITY
    // ======================================================================
    {
      id: "m3-l9",
      title: "When Someone Else Signs With You",
      subtitle: "Understanding cosigning, co-borrowing, and shared responsibility",
      estimatedMinutes: 10,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Key Terms", level: 2 },
        { type: "list", items: [
          "Cosigner — a person who agrees to be financially responsible for a loan if the primary borrower does not repay as agreed. The cosigner's credit may be affected by the loan's payment history.",
          "Co-borrower — a person who borrows jointly with another person and shares responsibility for repayment from the start.",
          "Authorized user — at a high level, a person who is permitted to use someone else's credit card account but is not legally responsible for repaying the debt.",
        ]},
        { type: "heading", text: "Cosigning Is a Real Financial Obligation", level: 3 },
        { type: "callout", calloutType: "warning", text: "Cosigning is not simply giving someone permission. It can create a real financial obligation. A cosigner generally agrees to be financially responsible if the primary borrower does not repay as agreed." },
        { type: "paragraph", text: "If the primary borrower misses payments or defaults, the cosigner may be expected to repay the full amount. The loan may also appear on the cosigner's credit report, and missed payments could affect the cosigner's credit history." },
        { type: "heading", text: "Scenario: Jordan and the Cosigning Request", level: 3 },
        { type: "paragraph", text: "A relative asks Jordan to cosign a loan because Jordan has stronger credit. Before agreeing, Jordan should ask:" },
        { type: "list", items: [
          "What responsibility could Jordan be accepting? — Jordan could become legally responsible for repaying the full loan amount if the relative does not pay.",
          "What could happen if payments are missed? — The lender could pursue Jordan for payment, and missed payments could appear on Jordan's credit report, potentially affecting Jordan's ability to get credit in the future.",
          "What information should Jordan review before agreeing? — The loan amount, APR, term, monthly payment, total repayment, fees, default terms, and whether Jordan can afford to repay the loan if the relative cannot.",
        ]},
        { type: "callout", calloutType: "tip", text: "This module does not encourage students to cosign loans for others. Cosigning is a serious financial commitment that should be considered carefully. If you are ever asked to cosign, take time to understand the full obligation before making a decision." },
      ],
    },

    // ======================================================================
    // LESSON 10 — BUY NOW, PAY LATER & HIGH-COST BORROWING
    // ======================================================================
    {
      id: "m3-l10",
      title: "Small Payments Can Hide a Bigger Cost",
      subtitle: "Understanding BNPL and high-cost borrowing risks",
      estimatedMinutes: 10,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What Is Buy Now, Pay Later?", level: 2 },
        { type: "paragraph", text: "Buy Now, Pay Later (BNPL) is a service that splits a purchase into a small number of payments — often four. The first payment is usually due at checkout, and the remaining payments are spread over a few weeks. BNPL can seem simple and low-cost, but it is still a form of borrowing." },
        { type: "heading", text: "Questions to Ask Before Using BNPL", level: 3 },
        { type: "list", items: [
          "What is the total purchase price? — The full cost of the item, not just the per-payment amount.",
          "How many payments? — The total number of payments required.",
          "When are payments due? — The schedule for each payment.",
          "What happens if a payment is missed? — Late fees, restricted future use, or other consequences.",
          "Are there fees? — Any fees beyond the purchase price.",
          "Are multiple BNPL plans already active? — If you already have several BNPL plans, adding another may strain your future income.",
          "Can the purchase actually fit within the budget? — Will the future payments leave room for your other obligations?",
        ]},
        { type: "callout", calloutType: "warning", text: "Four payments of $50 is still a $200 purchase. The small payment amount does not change the total cost. And if you have multiple BNPL plans active at the same time, those small payments can add up — and compete for the same future income." },
        { type: "heading", text: "Multiple Plans Can Stack Up", level: 3 },
        { type: "paragraph", text: "If you use BNPL for a $200 jacket (4 × $50), a $300 phone (4 × $75), and a $100 pair of shoes (4 × $25), you owe $600 total. Your next four payments could be $50 + $75 + $25 = $150 per period — money that comes out of future income you may have already planned to use for other things." },
        { type: "heading", text: "High-Cost Borrowing", level: 3 },
        { type: "paragraph", text: "Some forms of borrowing — such as payday-style lending — are designed for very short repayment periods but can carry extremely high borrowing costs. Short repayment periods, fees, or high borrowing costs can make some products expensive, even when the individual payment amounts seem small." },
        { type: "callout", calloutType: "warning", text: "This module does not provide instructions for obtaining high-cost loans. The goal is to help you recognize when borrowing costs are high, compare alternatives, and understand the total cost before agreeing to anything." },
        { type: "callout", calloutType: "tip", text: "Before using any form of borrowing — BNPL, a credit card, or a loan — compare alternatives and understand the total cost. Ask: Is there a less expensive option? Could I save for this instead? What will this actually cost me?" },
      ],
    },

    // ======================================================================
    // LESSON 11 — BEFORE YOU SIGN
    // ======================================================================
    {
      id: "m3-l11",
      title: "Read It. Compare It. Calculate It. Understand It.",
      subtitle: "The culminating lesson — your framework for every borrowing decision",
      estimatedMinutes: 9,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Before You Sign, Ask These Questions", level: 2 },
        { type: "paragraph", text: "Before accepting credit or a loan, you should be able to identify all of the following. If you cannot answer one of these questions, you are not ready to sign." },
        { type: "list", items: [
          "Who is lending the money?",
          "How much am I borrowing?",
          "What is the APR?",
          "What fees apply?",
          "What is the monthly payment?",
          "How many payments are required?",
          "What is the total repayment?",
          "When is payment due?",
          "What happens if I pay late?",
          "Is there collateral?",
          "Is there a cosigner?",
          "Can the rate change?",
          "Can I afford the payment within my existing budget?",
          "Is borrowing necessary for this purchase?",
        ]},
        { type: "heading", text: "BEFORE YOU SIGN", level: 2 },
        { type: "callout", calloutType: "success", text: "1. READ IT. — What does the agreement actually say? Read the disclosure, not just the advertisement. Understand the terms before you agree to them." },
        { type: "callout", calloutType: "success", text: "2. COMPARE IT. — Is there another option with better terms? Compare at least two offers. Look at APR, fees, monthly payment, and total repayment — not just one number." },
        { type: "callout", calloutType: "success", text: "3. CALCULATE IT. — What will this actually cost? Calculate the total repayment, not just the monthly payment. Understand how much you will pay in interest and fees over the life of the agreement." },
        { type: "callout", calloutType: "success", text: "4. UNDERSTAND IT. — What happens after I agree? Know what happens if you pay late, if the rate can change, and what you are committing to. Understand the full obligation before you sign." },
        { type: "callout", calloutType: "warning", text: "This is the central RISE principle for this module: Before You Sign — Read it. Compare it. Calculate it. Understand it. Every credit card, every loan, every BNPL plan, every financial agreement. No exceptions." },
      ],
    },
  ],

  // ========================================================================
  // KNOW THE TERMS
  // ========================================================================
  keyTerms: [
    { term: "Credit", definition: "Access to money, goods, or services now with an agreement to repay later." },
    { term: "Debt", definition: "The amount you owe as a result of borrowing." },
    { term: "Borrower", definition: "The person who receives credit or a loan and agrees to repay." },
    { term: "Lender", definition: "The person or institution that provides credit or a loan." },
    { term: "Credit Report", definition: "A record containing information about a person's credit history, including accounts, payment history, and inquiries." },
    { term: "Credit Score", definition: "A numerical estimate of credit risk based on information in a credit report. Multiple scoring models exist, and different lenders may use different scores." },
    { term: "Credit History", definition: "The record of a person's borrowing and repayment activity over time." },
    { term: "Credit Utilization", definition: "The percentage of available revolving credit currently being used: Credit Card Balance ÷ Credit Limit × 100." },
    { term: "Credit Limit", definition: "The maximum amount you can borrow on a revolving credit account at any one time." },
    { term: "Revolving Credit", definition: "Credit you can use repeatedly up to a limit; you repay and can borrow again, like a credit card." },
    { term: "Installment Loan", definition: "Money borrowed and generally repaid through scheduled payments over a defined period, like an auto loan." },
    { term: "APR", definition: "Annual Percentage Rate — the yearly cost of borrowing, including interest and certain fees, expressed as a percentage." },
    { term: "Interest", definition: "The cost of borrowing money, usually expressed as a percentage of the amount borrowed." },
    { term: "Minimum Payment", definition: "The smallest amount you can pay to keep a credit account current. Paying only the minimum can result in additional interest and a longer repayment period." },
    { term: "Grace Period", definition: "A period during which you can pay your balance in full without incurring interest charges, if the card offers one." },
    { term: "Secured Credit", definition: "Credit backed by collateral or a security deposit. If the borrower does not repay, the lender may claim the collateral." },
    { term: "Unsecured Credit", definition: "Credit generally not backed by specific collateral. The lender relies on the borrower's promise to repay." },
    { term: "Collateral", definition: "An asset that secures a loan. If the borrower does not repay, the lender may be able to claim the collateral." },
    { term: "Cosigner", definition: "A person who agrees to be financially responsible for a loan if the primary borrower does not repay as agreed." },
    { term: "Co-borrower", definition: "A person who borrows jointly with another person and shares responsibility for repayment from the start." },
    { term: "Inquiry", definition: "A record of a request to review a person's credit report. Hard inquiries (from applying for credit) may affect a credit score; soft inquiries (like checking your own credit) generally do not." },
    { term: "Principal", definition: "The original amount borrowed, before any interest or fees." },
    { term: "Loan Term", definition: "The length of time over which a loan is repaid." },
    { term: "Finance Charge", definition: "The total cost of borrowing, including interest and certain fees." },
    { term: "Buy Now, Pay Later", definition: "A service that splits a purchase into a small number of payments. It is a form of borrowing, even when it does not charge interest." },
  ],

  // ========================================================================
  // SEE IT IN REAL LIFE
  // ========================================================================
  realLifeScenario: {
    title: "Jordan Gets His First Credit Card Offer",
    setup:
      "Jordan recently turned 18 and receives a credit-card offer in the mail. The advertisement is eye-catching and highlights 'Earn 3X points!' The offer seems exciting — points for purchases, a sign-up bonus, and the feeling of being treated like an adult.",
    situation:
      "The disclosure that comes with the offer shows: a $75 annual fee, a variable purchase APR, a higher cash-advance APR, a late-payment fee, and rewards conditions (points may be limited, capped, or subject to change). Jordan currently earns about $1,400 in monthly net income and already spends most of it on transportation, phone, food, savings, and personal expenses.",
    prompt:
      "Think about Jordan's situation and answer these questions:\n1. Why should Jordan look beyond the rewards advertisement?\n2. What is APR?\n3. Which fees should Jordan review?\n4. How should Jordan's existing budget affect the decision?\n5. Does receiving a credit offer mean Jordan can afford the debt?\n6. What should Jordan understand before submitting an application?",
  },

  // ========================================================================
  // RISE DECISION LAB
  // ========================================================================
  decisionLab: {
    id: "before-you-sign-lab",
    title: "RISE Decision Lab: Before You Sign",
    subtitle: "Compare three borrowing offers for a $1,200 purchase — or choose not to borrow",
    instructions:
      "You need to make a $1,200 purchase. You are comparing three fictional borrowing offers. For each option, identify the amount being financed, the APR (when applicable), any fees, the payment schedule, and the total repayment where calculable. Then select the option you believe is most appropriate — or choose not to borrow. Defend your decision using financial evidence. There is no single predetermined correct borrowing choice. 'Do not borrow' is an acceptable option. All amounts are fictional and for educational purposes only.",
    fields: [
      // --- Provided context ---
      { id: "purchaseAmount", label: "Purchase Amount", type: "calculated", description: "$1,200" },

      // --- Option A: Credit Card ---
      { id: "optionAInfo", label: "Option A — Credit Card", type: "calculated", description: "Purchase APR: 22% (variable). Minimum payment: $25 or 2% of balance, whichever is greater. No annual fee. Grace period applies if balance is paid in full. No origination fee." },

      // --- Option B: Installment Loan ---
      { id: "optionBInfo", label: "Option B — Installment Loan", type: "calculated", description: "Fixed monthly payment: $105/month. APR: 10%. Loan term: 12 months. Origination fee: $25 (deducted from loan proceeds). Total repayment: $1,260 (12 × $105) + $25 origination fee = $1,285 total." },

      // --- Option C: BNPL ---
      { id: "optionCInfo", label: "Option C — Buy Now, Pay Later", type: "calculated", description: "4 payments of $300. First payment due at checkout. Remaining 3 payments due every 2 weeks. No interest if all payments are made on time. Late-payment consequence: $8 late fee per missed payment, and future BNPL availability may be restricted. Total if paid on time: $1,200." },

      // --- Task 1: Identify amount financed ---
      { id: "amountFinanced", label: "1. Identify the Amount Being Financed", type: "number", placeholder: "Amount being borrowed", unit: "$", description: "How much is being financed across all three options?" },

      // --- Task 2: Identify APR ---
      { id: "aprComparison", label: "2. Identify the APR for Each Option (When Applicable)", type: "text", placeholder: "Option A APR: ___, Option B APR: ___, Option C APR: ___ (or N/A)" },

      // --- Task 3: Identify fees ---
      { id: "feesComparison", label: "3. Identify Any Fees for Each Option", type: "text", placeholder: "List any fees for each option (annual fee, origination fee, late fees, etc.)" },

      // --- Task 4: Compare payment schedules ---
      { id: "paymentScheduleComparison", label: "4. Compare the Payment Schedules", type: "text", placeholder: "Describe the payment schedule for each option — how many payments, how often, and how much" },

      // --- Task 5: Compare total repayment ---
      { id: "totalRepaymentComparison", label: "5. Compare the Total Repayment Where Calculable", type: "text", placeholder: "What is the total repayment for each option if paid as agreed?" },

      // --- Task 6: Identify major risks ---
      { id: "riskIdentification", label: "6. Identify the Major Risks of Each Option", type: "text", placeholder: "What could go wrong with each option? What are the risks?" },

      // --- Task 7: Select an option (or do not borrow) ---
      { id: "optionSelection", label: "7. Select the Option You Believe Is Most Appropriate — or Choose Not to Borrow", type: "radio", options: [
        { id: "option-a", label: "Option A — Credit Card", description: "22% APR, minimum payment, no annual fee, grace period if paid in full" },
        { id: "option-b", label: "Option B — Installment Loan", description: "10% APR, $105/month for 12 months, $25 origination fee, $1,285 total" },
        { id: "option-c", label: "Option C — Buy Now, Pay Later", description: "4 payments of $300, no interest if paid on time, $8 late fee per missed payment" },
        { id: "do-not-borrow", label: "Do Not Borrow", description: "I would not borrow for this purchase. I would save for it instead, or find a less expensive alternative." },
      ]},

      // --- Task 8: Defend the decision ---
      { id: "decisionDefense", label: "8. Defend Your Decision Using Financial Evidence", type: "text", placeholder: "Explain why you chose this option (or chose not to borrow). Use specific numbers from the offers — APR, fees, total repayment, payment schedule, and risks — to support your reasoning." },
    ],
    resultPrompt:
      "There is no single predetermined correct borrowing choice for this lab. What matters is the quality of your financial reasoning: Did you compare the terms? Did you understand the cost? Did you recognize the risks? Did you consider whether borrowing was necessary? And did you defend your decision with evidence? 'Do not borrow' is a valid and responsible choice when borrowing is not necessary or when the terms are not favorable. Evaluate financial reasoning, comparison of terms, understanding of cost, recognition of risk, and quality of explanation — not whether the student chose a specific option.",
  },

  // ========================================================================
  // WORKBOOK ACTIVITY
  // ========================================================================
  workbookActivity: {
    title: "Before I Borrow Checklist",
    instructions:
      "Complete this checklist before borrowing money or applying for credit. Use hypothetical or fictional scenarios — do not enter actual account numbers, balances, or personal financial information. The goal is to build the habit of thinking through a borrowing decision before signing.",
    prompts: [
      "THE PURPOSE — What am I borrowing for?",
      "THE PURPOSE — Is this a need, a goal, or a discretionary purchase?",
      "THE PURPOSE — Is there a less expensive alternative?",
      "THE PURPOSE — Could I save for it instead?",
      "THE COST — Amount borrowed",
      "THE COST — APR",
      "THE COST — Fees",
      "THE COST — Monthly payment",
      "THE COST — Number of payments",
      "THE COST — Total repayment",
      "THE RISK — What happens if I miss a payment?",
      "THE RISK — Is collateral involved?",
      "THE RISK — Is a cosigner involved?",
      "THE RISK — Could the interest rate change?",
      "MY BUDGET — Does the payment fit within monthly net income?",
      "MY BUDGET — What existing expense or savings goal would this payment compete with?",
      "BEFORE I SIGN — I read the disclosure",
      "BEFORE I SIGN — I compared another option",
      "BEFORE I SIGN — I calculated the cost",
      "BEFORE I SIGN — I understand the repayment obligation",
    ],
  },

  // ========================================================================
  // KNOWLEDGE CHECK — 10 questions, 70% to pass
  // ========================================================================
  knowledgeCheck: [
    {
      id: "m3-q1",
      type: "multiple_choice",
      question: "If you borrow $500, have you increased your income?",
      options: [
        "Yes — borrowing gives you money you didn't have before",
        "No — borrowing provides access to money, but it also creates debt that must be repaid",
        "Yes — borrowed money counts as income for budgeting purposes",
        "It depends on the interest rate",
      ],
      correctAnswer: "No — borrowing provides access to money, but it also creates debt that must be repaid",
      explanation: "Available credit is not the same as available income. Borrowing gives you access to money now, but it creates an obligation to repay later — with interest and fees. The $500 is debt, not income.",
    },
    {
      id: "m3-q2",
      type: "multiple_choice",
      question: "Which of the following best describes the purpose of a credit report?",
      options: [
        "It is a complete picture of someone's financial worth and character",
        "It contains information about a person's credit history, such as accounts, payment history, and inquiries",
        "It determines whether someone is a good person",
        "It shows someone's income and savings",
      ],
      correctAnswer: "It contains information about a person's credit history, such as accounts, payment history, and inquiries",
      explanation: "A credit report is a record of borrowing history — not a judgment of someone's worth or character. It does not include income or savings. It is used by lenders to help assess credit risk.",
    },
    {
      id: "m3-q3",
      type: "multiple_choice",
      question: "Which of the following is true about credit scores?",
      options: [
        "There is only one credit score, and every lender sees the same number",
        "There are multiple credit-scoring models, and different lenders may use different scores",
        "The score you see on a free app is always the exact score a lender will use",
        "Credit scores are based solely on income",
      ],
      correctAnswer: "There are multiple credit-scoring models, and different lenders may use different scores",
      explanation: "There are multiple credit-scoring models. Different lenders may use different scores, and not every score a consumer sees will necessarily be the score a lender uses. Credit scores are influenced by financial behavior over time — there is no legitimate instant shortcut to perfect credit.",
    },
    {
      id: "m3-q4",
      type: "scenario",
      question: "A student has a credit limit of $2,000 and a balance of $500. What is the credit utilization?",
      options: ["20%", "25%", "30%", "40%"],
      correctAnswer: "25%",
      explanation: "Credit utilization = Balance ÷ Credit Limit × 100 = $500 ÷ $2,000 × 100 = 25%. Using less of available revolving credit generally presents less credit risk than being close to the limit.",
    },
    {
      id: "m3-q5",
      type: "multiple_choice",
      question: "Which of the following best describes the difference between a credit card and a debit card?",
      options: [
        "A credit card and a debit card are the same thing",
        "A debit card generally uses money already in a deposit account; a credit card generally uses borrowed money that must be repaid",
        "A credit card uses money in your deposit account; a debit card borrows money",
        "A debit card builds credit; a credit card does not",
      ],
      correctAnswer: "A debit card generally uses money already in a deposit account; a credit card generally uses borrowed money that must be repaid",
      explanation: "With a debit card, you are spending your own money from your deposit account. With a credit card, you are borrowing money from the card issuer that you must repay — often with interest if you do not pay the full balance. Credit card purchases increase debt; payments reduce debt.",
    },
    {
      id: "m3-q6",
      type: "multiple_choice",
      question: "What does APR stand for, and what does it represent?",
      options: [
        "Annual Payment Rate — the monthly payment amount",
        "Annual Percentage Rate — the yearly cost of borrowing, including interest and certain fees",
        "Average Purchase Rate — the average amount spent per purchase",
        "Account Protection Rate — the insurance on your account",
      ],
      correctAnswer: "Annual Percentage Rate — the yearly cost of borrowing, including interest and certain fees",
      explanation: "APR (Annual Percentage Rate) is the yearly cost of borrowing expressed as a percentage. It includes interest and may include certain fees, giving you a more complete picture of what borrowing will cost.",
    },
    {
      id: "m3-q7",
      type: "true_false",
      question: "Paying only the minimum payment on a credit card can keep the account current, but carrying a balance can result in additional interest and a longer repayment period.",
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "The minimum payment keeps your account in good standing, but if you carry a balance, interest continues to accrue. Paying only the minimum can extend repayment for years and cost significantly more in interest than the original purchase.",
    },
    {
      id: "m3-q8",
      type: "multiple_choice",
      question: "Which of the following best describes the difference between secured and unsecured credit?",
      options: [
        "Secured credit has a higher interest rate; unsecured credit has a lower rate",
        "Secured credit is backed by collateral or a deposit; unsecured credit is generally not backed by specific collateral",
        "Secured credit is for businesses; unsecured credit is for individuals",
        "Secured credit is always better than unsecured credit",
      ],
      correctAnswer: "Secured credit is backed by collateral or a deposit; unsecured credit is generally not backed by specific collateral",
      explanation: "Secured credit (like an auto loan or secured credit card) is backed by collateral — an asset the lender may claim if you do not repay. Unsecured credit (like many traditional credit cards) is not backed by specific collateral; the lender relies on your promise to repay.",
    },
    {
      id: "m3-q9",
      type: "scenario",
      question: "Loan A has a lower monthly payment but a substantially higher total repayment than Loan B. In addition to the monthly payment, which number should you consider before choosing?",
      options: [
        "The color of the loan documents",
        "The total cost / total repayment — a lower monthly payment can mean a longer term and more paid over time",
        "The name of the lender",
        "Only the monthly payment — it is the only number that matters",
      ],
      correctAnswer: "The total cost / total repayment — a lower monthly payment can mean a longer term and more paid over time",
      explanation: "Affordability is not just 'Can I make this month's payment?' A lower monthly payment often comes with a longer term, which means you pay more in total. Always compare the total repayment, not just the monthly payment.",
    },
    {
      id: "m3-q10",
      type: "multiple_select",
      question: "Which of the following are potential risks of Buy Now, Pay Later (BNPL)? (Select all that apply)",
      options: [
        "Multiple small payment plans can compete for the same future income",
        "Four payments of $50 is still a $200 purchase",
        "Late payments may result in fees or restricted future use",
        "BNPL is always free with no risks whatsoever",
        "It can be easy to overspend because the payments seem small",
      ],
      correctAnswer: ["Multiple small payment plans can compete for the same future income", "Four payments of $50 is still a $200 purchase", "Late payments may result in fees or restricted future use", "It can be easy to overspend because the payments seem small"],
      explanation: "BNPL is a form of borrowing. The small payment amounts can make purchases feel affordable, but multiple plans can stack up and compete for future income. Late payments may result in fees or restricted access. BNPL is not always free of risk — always ask about the total cost, payment schedule, and consequences of missed payments.",
    },
  ],

  // ========================================================================
  // REFLECTION
  // ========================================================================
  reflection: {
    prompt:
      "What is one credit or borrowing offer that you now realize you would need to examine more carefully before accepting? What would you look for?",
    placeholder: "Write your reflection here...",
  },

  // ========================================================================
  // ACTION COMMITMENT
  // ========================================================================
  actionCommitment: {
    prompt:
      "Before I borrow money or apply for credit, I will ____________.",
    placeholder: "I will...",
  },

  // ========================================================================
  // RISE FINANCIAL BLUEPRINT UPDATE
  // ========================================================================
  blueprintUpdate: {
    sectionKey: "credit_borrowing",
    sectionTitle: "My Credit & Borrowing Rules",
    prompt:
      "Complete your Credit & Borrowing Rules. Use hypothetical planning only — do not enter your actual credit score, upload a credit report, or provide any credit-card number, account number, Social Security number, PIN, password, or actual outstanding debt amount. These are your personal rules for using credit responsibly.",
    fields: [
      { id: "reasonForCredit", label: "My reason for wanting to build credit", type: "text", placeholder: "e.g., to qualify for better loan terms in the future, to rent an apartment" },
      { id: "paymentHistoryHabit", label: "One habit I will use to protect my payment history", type: "text", placeholder: "e.g., I will set up automatic payments for at least the minimum due" },
      { id: "monitoringPlan", label: "How I will monitor my credit accounts", type: "text", placeholder: "e.g., I will review my statements each month and check my credit report annually" },
      { id: "creditCardRule", label: "My personal rule for using a credit card", type: "textarea", placeholder: "e.g., I will only use it for planned purchases I can pay for in full each month" },
      { id: "bnplRule", label: "My personal rule for BNPL", type: "text", placeholder: "e.g., I will not use BNPL if I already have an active plan, and I will only use it for purchases I could pay for today" },
      { id: "installmentLoanRule", label: "My rule before taking an installment loan", type: "text", placeholder: "e.g., I will compare at least two offers and review the total repayment, not just the monthly payment" },
      { id: "cosigningRule", label: "My rule about cosigning", type: "text", placeholder: "e.g., I will not cosign a loan unless I can afford to repay the full amount myself" },
      { id: "maxDebtPayment", label: "Maximum debt payment I would allow within a hypothetical monthly budget", type: "text", placeholder: "e.g., no more than 15% of my monthly net income" },
      { id: "termsToReview", label: "Three terms I will always review before signing", type: "textarea", placeholder: "e.g., 1. APR, 2. Total repayment, 3. What happens if I pay late" },
      { id: "mistakeToAvoid", label: "One credit mistake I want to avoid", type: "text", placeholder: "e.g., carrying a balance and paying only the minimum for months" },
      { id: "ifCannotPay", label: "What I will do if I cannot make a payment", type: "text", placeholder: "e.g., I will contact the lender before the due date to discuss options" },
    ],
  },
};
