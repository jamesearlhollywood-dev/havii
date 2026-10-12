import type { CourseModule } from "../course-types";

export const module2: CourseModule = {
  id: "module-2",
  number: 2,
  title: "Make Your Money Work — Budgeting, Saving & Financial Goals",
  subtitle: "Give every dollar a purpose before life decides where it goes.",
  estimatedTime: "105 minutes",
  icon: "📊",
  themeColor: "rise-blue-dark",
  overview:
    "Earning money is just the beginning. This module teaches you how to give every dollar a purpose by building a realistic budget, setting strong financial goals, and understanding where your money actually goes. You will learn the difference between needs and wants, how to categorize expenses, and how to calculate monthly cash flow. We cover emergency savings, sinking funds, and the habit of paying yourself first. You will also see how interest and compounding can help your savings grow over time. By the end, you will have a monthly spending and saving plan and the skills to adjust it when life changes.",
  objectives: [
    "Explain why a budget is a financial decision-making tool rather than simply a restriction on spending",
    "Create realistic short-term and longer-term financial goals",
    "Use the SMART framework to strengthen financial goals",
    "Distinguish needs from wants while recognizing that circumstances affect these categories",
    "Identify fixed, variable, periodic, and discretionary expenses",
    "Calculate monthly cash flow",
    "Explain what positive, zero, and negative cash flow mean",
    "Build a realistic monthly spending and saving plan",
    "Explain the purpose of emergency savings and sinking funds",
    "Identify ways to adjust a budget when income or expenses change",
    "Explain how interest and compounding can help savings grow over time",
  ],
  lessons: [
    // ======================================================================
    // LESSON 1 — MONEY NEEDS A PLAN
    // ======================================================================
    {
      id: "m2-l1",
      title: "A Budget Is a Plan, Not a Punishment",
      subtitle: "Why a budget helps you decide what you can afford — not what you can't",
      estimatedMinutes: 12,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What Is a Budget?", level: 2 },
        { type: "paragraph", text: "A budget is a plan for deciding how your income will be used. It is not a set of rules telling you what you cannot do. It is a tool that helps you decide what you can afford to spend while still meeting your priorities." },
        { type: "callout", calloutType: "info", text: "A budget does not tell you that you cannot spend money. It helps you decide what you can afford to spend while still meeting your priorities." },
        { type: "heading", text: "The Building Blocks", level: 3 },
        { type: "paragraph", text: "Before you build a budget, you need to understand five basic concepts:" },
        { type: "list", items: [
          "Income — money you receive from work or other sources.",
          "Expenses — money you spend on goods, services, and obligations.",
          "Saving — money you set aside for future use instead of spending it now.",
          "Spending — money you use for current purchases and obligations.",
          "Cash flow — the result of comparing your income to your expenses over a period of time.",
        ]},
        { type: "heading", text: "The Basic Equation", level: 3 },
        { type: "definition", text: "Income − Expenses = Cash Flow. This simple equation is the foundation of every budget. If your income is greater than your expenses, you have positive cash flow. If they are equal, you have zero cash flow. If your expenses are greater than your income, you have negative cash flow." },
        { type: "heading", text: "Three Cash Flow Situations", level: 3 },
        { type: "table", headers: ["Cash Flow", "What It Means", "What It Signals"], rows: [
          ["Positive", "Income exceeds expenses", "You have money left over — you can save, invest, or spend on goals"],
          ["Zero", "Income equals expenses", "You are breaking even — nothing left over, but not falling behind"],
          ["Negative", "Expenses exceed income", "You are spending more than you earn — this can lead to debt if it continues"],
        ]},
        { type: "heading", text: "Example A: Positive Cash Flow", level: 3 },
        { type: "example", text: "Monthly net income: $1,800. Monthly expenses: $1,550. Cash flow: +$250. This person has $250 left over each month — they could save it, put it toward a goal, or spend it on something they value." },
        { type: "heading", text: "Example B: Negative Cash Flow", level: 3 },
        { type: "example", text: "Monthly net income: $1,500. Monthly expenses: $1,675. Cash flow: −$175. This person is spending $175 more than they earn each month. If this continues, they may need to reduce expenses, increase income, or use savings to cover the gap." },
        { type: "callout", calloutType: "tip", text: "Think about it: In Example A, what could the person do with the extra $250? In Example B, what changes might help — reducing expenses, increasing income, or both? There is no single right answer — the best choice depends on the situation." },
      ],
    },

    // ======================================================================
    // LESSON 2 — SETTING FINANCIAL GOALS
    // ======================================================================
    {
      id: "m2-l2",
      title: "Know What You Are Building Toward",
      subtitle: "Using the SMART framework to turn vague wishes into real plans",
      estimatedMinutes: 13,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Why Goals Matter", level: 2 },
        { type: "paragraph", text: "A goal gives your money direction. Without one, it is easy to spend without thinking and wonder where your money went. A strong financial goal tells you exactly what you are saving for, how much you need, and by when." },
        { type: "heading", text: "The SMART Framework", level: 3 },
        { type: "paragraph", text: "SMART is a framework for making goals stronger. Each letter stands for something a good goal should have:" },
        { type: "table", headers: ["Letter", "Meaning", "What It Adds"], rows: [
          ["S", "Specific", "The goal names exactly what you are saving for and how much"],
          ["M", "Measurable", "You can track your progress — you know when you are on track or falling behind"],
          ["A", "Action-oriented", "The goal describes an action you will take, not just a wish"],
          ["R", "Realistic / Reachable", "The goal is possible with your income and situation"],
          ["T", "Time-bound", "The goal has a deadline — a specific date or timeframe"],
        ]},
        { type: "heading", text: "Weak Goal vs. Stronger Goal", level: 3 },
        { type: "callout", calloutType: "warning", text: "Weak goal: 'I want to save money.' This is vague — how much? By when? How? You cannot track progress or know if you are succeeding." },
        { type: "callout", calloutType: "success", text: "Stronger goal: 'I will save $600 for emergency expenses over the next 10 months by setting aside $60 each month.' This is specific ($600), measurable ($60/month), action-oriented (setting aside), realistic ($60/month is achievable), and time-bound (10 months)." },
        { type: "heading", text: "Short-Term, Medium-Term, and Longer-Term Goals", level: 3 },
        { type: "paragraph", text: "Financial goals fall into different timeframes. Here are examples relevant to students like you:" },
        { type: "table", headers: ["Timeframe", "Goal Examples"], rows: [
          ["Short-term (weeks to a few months)", "Graduation expenses, a new phone, concert tickets, a short trip"],
          ["Medium-term (several months to a year)", "Laptop, car down payment, college deposit, trade-school supplies, emergency savings"],
          ["Longer-term (a year or more)", "Apartment move-in costs, a reliable used car, first semester of college expenses"],
        ]},
        { type: "heading", text: "Activity: Improve Three Vague Goals", level: 3 },
        { type: "paragraph", text: "Take these three vague goals and rewrite each one using the SMART framework. Make each goal specific, measurable, action-oriented, realistic, and time-bound:" },
        { type: "list", items: [
          "1. 'I want to save for a car.'",
          "2. 'I want to have money for graduation.'",
          "3. 'I want to start an emergency fund.'",
        ]},
        { type: "callout", calloutType: "tip", text: "For each goal, ask yourself: What exactly am I saving for? How much do I need? How will I do it? Is that realistic with my income? By when do I want to reach it?" },
      ],
    },

    // ======================================================================
    // LESSON 3 — NEEDS, WANTS & YOUR VALUES
    // ======================================================================
    {
      id: "m2-l3",
      title: "Your Money Reflects Your Choices",
      subtitle: "Understanding needs, wants, tradeoffs, and opportunity cost",
      estimatedMinutes: 13,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Needs and Wants Are Not Universal", level: 2 },
        { type: "paragraph", text: "A need is something required to live and function. A want is something that improves your life but is not essential. But here is the important part: what counts as a need or a want is not the same for everyone. It depends on your circumstances." },
        { type: "callout", calloutType: "info", text: "Do not treat needs and wants as fixed, universal categories. What is a need for one person may be a want for someone else — and that is okay." },
        { type: "heading", text: "What Affects Whether Something Is a Need or a Want?", level: 3 },
        { type: "list", items: [
          "Where someone lives — a car may be essential in a rural area but optional in a city with good public transit.",
          "Work requirements — a uniform or specific equipment may be necessary for your job.",
          "Health — medical expenses, dietary needs, or medications are needs, not optional spending.",
          "Transportation access — if you have no bus or train, a car or rideshare may be a need.",
          "Family responsibilities — supporting family members may change what counts as essential.",
          "Education needs — a laptop or internet access may be required for schoolwork.",
        ]},
        { type: "heading", text: "Example: The Smartphone", level: 3 },
        { type: "callout", calloutType: "tip", text: "A smartphone may be mostly discretionary for one person — nice to have but not essential. For another person, it may be necessary for their work schedule, transportation, school communication, or safety. The category depends on the situation, not just the item." },
        { type: "heading", text: "Tradeoffs and Opportunity Cost", level: 3 },
        { type: "paragraph", text: "Every financial decision involves a tradeoff. When you choose one use for your money, you are giving up another use for that same money. The value of what you give up is called the opportunity cost." },
        { type: "definition", text: "Opportunity cost is what you give up when you choose one option over another. If you spend $50 on a night out, the opportunity cost is whatever else you could have done with that $50 — save it, put it toward a goal, or spend it on something different." },
        { type: "paragraph", text: "Understanding tradeoffs does not mean you should never spend on things you enjoy. It means you should make spending decisions consciously — aware of what you are giving up, not just what you are getting." },
        { type: "heading", text: "Activity: Allocate $150", level: 3 },
        { type: "paragraph", text: "You have $150 of discretionary money this month. You must allocate it among the following categories. There is no single correct answer — the goal is to think about your priorities and explain your choices." },
        { type: "list", items: [
          "Entertainment",
          "Clothing",
          "Savings",
          "Dining out",
          "Graduation expenses",
          "Transportation",
        ]},
        { type: "callout", calloutType: "info", text: "After you allocate, ask yourself: Why did I prioritize those categories? What did I give up? What does my allocation say about what I value? There is no 'correct' answer — your priorities are yours." },
      ],
    },

    // ======================================================================
    // LESSON 4 — KNOW YOUR EXPENSES
    // ======================================================================
    {
      id: "m2-l4",
      title: "Where Is Your Money Going?",
      subtitle: "Fixed, variable, periodic, and discretionary expenses",
      estimatedMinutes: 13,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Four Categories of Expenses", level: 2 },
        { type: "paragraph", text: "Not all expenses work the same way. Understanding the four main categories helps you plan your budget and find areas to adjust when needed." },
        { type: "heading", text: "Fixed Expenses", level: 3 },
        { type: "paragraph", text: "Fixed expenses usually stay relatively consistent from month to month. You know roughly how much they will cost, which makes them easier to plan for." },
        { type: "list", items: [
          "Rent",
          "Car payment",
          "Subscription with a fixed monthly price",
        ]},
        { type: "heading", text: "Variable Expenses", level: 3 },
        { type: "paragraph", text: "Variable expenses change from month to month. The amount depends on how much you use, how prices change, or your own choices." },
        { type: "list", items: [
          "Food / groceries",
          "Fuel",
          "Utilities (electricity, water, gas)",
        ]},
        { type: "heading", text: "Periodic Expenses", level: 3 },
        { type: "paragraph", text: "Periodic expenses do not occur every month, but they should still be planned for. They are predictable in timing or amount even if they are not monthly." },
        { type: "list", items: [
          "Car registration",
          "School fees",
          "Annual membership",
          "Holiday expenses",
        ]},
        { type: "heading", text: "Discretionary Expenses", level: 3 },
        { type: "paragraph", text: "Discretionary expenses are spending where the amount or the purchase itself is more flexible. These are the easiest to adjust when money is tight." },
        { type: "list", items: [
          "Entertainment",
          "Dining out",
          "Nonessential shopping",
        ]},
        { type: "callout", calloutType: "info", text: "Categories can overlap depending on the situation. For example, dining out could be a variable expense (the amount changes) or a discretionary expense (it is optional). Food could be a variable expense (groceries change monthly) or include fixed elements (a set meal plan). The category helps you think about the expense — it does not have to be perfect." },
        { type: "heading", text: "Sorting Activity", level: 3 },
        { type: "paragraph", text: "Sort the following 12 expenses into the four categories. Some may fit more than one — pick the best fit and be ready to explain your reasoning." },
        { type: "list", items: [
          "1. Monthly rent payment",
          "2. Gasoline for your car",
          "3. Streaming subscription ($12.99/month)",
          "4. Car registration (once a year)",
          "5. Groceries",
          "6. Concert tickets",
          "7. Phone bill ($65/month)",
          "8. Back-to-school supplies (once a year)",
          "9. Electric bill (varies by season)",
          "10. Dinner at a restaurant",
          "11. Gym membership ($30/month)",
          "12. Holiday gifts (once a year)",
        ]},
        { type: "callout", calloutType: "tip", text: "Notice that items 4, 8, and 12 are periodic — they do not happen every month but you know they are coming. Items 6, 10, and 12 are also discretionary — they are optional spending. The categories overlap, and that is fine. What matters is that you plan for all of them." },
      ],
    },

    // ======================================================================
    // LESSON 5 — BUILDING A MONTHLY BUDGET
    // ======================================================================
    {
      id: "m2-l5",
      title: "Make the Numbers Work",
      subtitle: "Building a realistic monthly spending and saving plan",
      estimatedMinutes: 14,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Start With Net Income, Not Gross Pay", level: 2 },
        { type: "paragraph", text: "When you build a budget, always start with your net income — the money that actually reaches your bank account after deductions. Budgeting based on gross pay (before taxes) leads to overspending, because you are planning with money you do not actually receive." },
        { type: "callout", calloutType: "warning", text: "If your gross pay is $2,000 but your net pay is $1,650, you can only spend or save $1,650. Budget from what actually lands in your account." },
        { type: "heading", text: "Alex's Monthly Budget Scenario", level: 3 },
        { type: "paragraph", text: "Let's build a budget together. Alex is a high-school senior who works part-time. Here is what Alex knows for sure each month:" },
        { type: "table", headers: ["Alex's Monthly Net Income", "Amount"], rows: [
          ["Monthly net income", "$1,650"],
        ]},
        { type: "paragraph", text: "Alex's required or likely expenses:" },
        { type: "table", headers: ["Required / Likely Expense", "Amount"], rows: [
          ["Transportation", "$220"],
          ["Phone", "$65"],
          ["Food / personal expenses", "$220"],
          ["Family contribution", "$150"],
          ["Total required expenses", "$655"],
        ]},
        { type: "paragraph", text: "That leaves $1,650 − $655 = $995 for Alex to decide how to use. Alex must decide amounts for:" },
        { type: "list", items: [
          "Emergency savings",
          "Education savings",
          "Entertainment",
          "Clothing",
          "Dining out",
          "Other spending",
        ]},
        { type: "callout", calloutType: "info", text: "The total plan must stay within $1,650. Every dollar should be given a purpose — whether it goes to spending, saving, or both. If the total exceeds $1,650, Alex has negative cash flow and needs to adjust." },
        { type: "heading", text: "What a Completed Budget Looks Like", level: 3 },
        { type: "table", headers: ["Category", "Planned Amount"], rows: [
          ["Planned Income", "$1,650"],
          ["Planned Expenses (all categories)", "$1,200"],
          ["Planned Savings", "$450"],
          ["Remaining Cash Flow", "$0 (balanced)"],
        ]},
        { type: "callout", calloutType: "tip", text: "A balanced budget (zero cash flow) is not a bad thing — it means every dollar has a purpose. Positive cash flow means you have a buffer. Negative cash flow means you need to make changes." },
        { type: "heading", text: "Budgets Can Be Revised", level: 3 },
        { type: "paragraph", text: "A budget is not set in stone. If your income changes, your expenses change, or your goals shift, you can revise your budget. The point is to have a plan — and to adjust it when life changes, not to abandon it." },
      ],
    },

    // ======================================================================
    // LESSON 6 — SAVING FOR THE EXPECTED AND UNEXPECTED
    // ======================================================================
    {
      id: "m2-l6",
      title: "Emergency Funds & Sinking Funds",
      subtitle: "Planning for surprises and for expenses you know are coming",
      estimatedMinutes: 13,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Two Types of Savings for Two Types of Expenses", level: 2 },
        { type: "paragraph", text: "Not all savings serve the same purpose. Two of the most important types are emergency savings and sinking funds. Understanding the difference helps you plan for both the unexpected and the expected." },
        { type: "heading", text: "Emergency Savings", level: 3 },
        { type: "definition", text: "Emergency savings is money reserved for unexpected financial needs — things you could not predict or plan for." },
        { type: "paragraph", text: "Examples of situations where emergency savings help:" },
        { type: "list", items: [
          "Urgent car repair that you need for work or school",
          "Unexpected medical cost",
          "Sudden reduction in work hours",
        ]},
        { type: "callout", calloutType: "warning", text: "Emergency savings is for true emergencies — not for planned purchases, sales, or wants. If you use it for a vacation, it will not be there when your car breaks down." },
        { type: "heading", text: "Sinking Funds", level: 3 },
        { type: "definition", text: "A sinking fund is money you save gradually for a known future expense — something you can predict even if it does not happen every month." },
        { type: "paragraph", text: "Examples of sinking fund goals:" },
        { type: "list", items: [
          "Car registration",
          "Prom",
          "Graduation",
          "Laptop replacement",
          "Holiday travel",
          "School supplies",
        ]},
        { type: "callout", calloutType: "info", text: "Not every large expense is an emergency. Some expenses are predictable even if they do not happen every month. If you know it is coming, plan for it with a sinking fund — do not wait for it to surprise you." },
        { type: "heading", text: "Example: Car Insurance Sinking Fund", level: 3 },
        { type: "example", text: "A student expects a $360 car-insurance payment in six months. How much should they save each month? Answer: $360 ÷ 6 months = $60 per month. By saving $60 each month, the money will be ready when the bill arrives — no scrambling, no debt." },
        { type: "callout", calloutType: "tip", text: "The key difference: emergency savings is for the unexpected. Sinking funds are for the expected but infrequent. You need both — one for surprises, one for expenses you can see coming." },
      ],
    },

    // ======================================================================
    // LESSON 7 — PAY YOURSELF FIRST & AUTOMATE
    // ======================================================================
    {
      id: "m2-l7",
      title: "Make Saving Part of the Plan",
      subtitle: "Pay yourself first, automate, and start small",
      estimatedMinutes: 12,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Pay Yourself First", level: 2 },
        { type: "paragraph", text: "Pay yourself first means treating savings as a priority — not as whatever is left over at the end of the month. When you save first, you make sure saving actually happens. When you save last, there is often nothing left." },
        { type: "callout", calloutType: "info", text: "Saving is an action, not just spending less. If you avoid spending $20 on one thing but immediately spend that $20 somewhere else, it has not become savings. Saving means actually moving money into a savings account or toward a goal." },
        { type: "heading", text: "Make It Automatic", level: 3 },
        { type: "paragraph", text: "The most reliable way to save consistently is to automate it. When saving happens automatically, you do not have to rely on willpower or remembering — the system does the work for you." },
        { type: "list", items: [
          "Automatic transfers — set up a recurring transfer from checking to savings on payday. The money moves before you can spend it.",
          "Direct deposit splitting — if your employer allows it, you can split your direct deposit so part goes to checking and part goes to savings automatically.",
          "Saving consistently — saving $25 every month is more effective than waiting to save $300 all at once. Consistency builds the habit.",
          "Starting small — you do not need a large amount to start. Saving $10, $25, or $50 consistently is more useful than waiting for a large amount of money to appear.",
        ]},
        { type: "heading", text: "The RISE Philosophy", level: 3 },
        { type: "callout", calloutType: "success", text: "Start Small. Scale Smart. Stay Consistent. Saving $10, $25, or $50 consistently can be more useful than waiting for a large amount of money to appear. The habit matters more than the amount when you are starting out." },
        { type: "callout", calloutType: "tip", text: "If you save $25 per month starting now, you will have $300 in a year. If you wait until you 'have enough' to start saving, you may never start. The best time to start saving is now — even if the amount is small." },
      ],
    },

    // ======================================================================
    // LESSON 8 — HOW SAVINGS CAN GROW
    // ======================================================================
    {
      id: "m2-l8",
      title: "Interest & Compounding",
      subtitle: "How money in savings can earn additional money over time",
      estimatedMinutes: 13,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What Makes Savings Grow?", level: 2 },
        { type: "paragraph", text: "When you put money in a savings account, the bank may pay you interest — a percentage of your balance, paid to you for keeping your money there. Over time, interest can help your savings grow beyond what you deposited." },
        { type: "heading", text: "Key Terms", level: 3 },
        { type: "list", items: [
          "Principal — the original amount of money you deposit or save.",
          "Interest — money the bank pays you for keeping your money in a savings account, expressed as a percentage.",
          "Interest rate — the percentage the bank pays, usually stated as an annual rate.",
          "APY (Annual Percentage Yield) — the yearly rate of return on a savings account, including the effect of compounding. A higher APY means your money grows faster.",
          "Compounding — when previously earned interest begins earning additional interest, so your savings can grow faster over time.",
        ]},
        { type: "heading", text: "How Compounding Works", level: 3 },
        { type: "paragraph", text: "At a conceptual level: interest can allow money to earn additional money. With compounding, previously earned interest may also begin earning interest. This means your savings can grow not just from your deposits, but from the interest those deposits earn." },
        { type: "callout", calloutType: "info", text: "This lesson is an introduction to how savings can grow. Module 5 will cover long-term investing in greater depth. For now, the focus is on savings accounts and the concept of compounding — not investment strategies." },
        { type: "heading", text: "A Simple Savings Illustration", level: 3 },
        { type: "callout", calloutType: "warning", text: "The following is an example for educational purposes only. Actual interest rates and APYs vary. This is not a guarantee of any specific return." },
        { type: "table", headers: ["Month", "Starting Balance", "Interest (3% APY / monthly)", "Ending Balance"], rows: [
          ["1", "$100.00", "$0.25", "$100.25"],
          ["2", "$100.25", "$0.25", "$100.50"],
          ["3", "$100.50", "$0.25", "$100.75"],
          ["6", "$101.25", "$0.25", "$101.50"],
          ["12", "$102.52", "$0.26", "$102.78"],
        ]},
        { type: "paragraph", text: "In this example, $100 in a savings account at 3% APY earns about $2.78 in one year. That is not a large amount — but the point is that the money is growing on its own, without you adding more. Over time, as your balance grows and you keep adding to it, compounding has a larger effect." },
        { type: "callout", calloutType: "tip", text: "The earlier you start saving, the more time compounding has to work. Even small amounts grow when given enough time. This is why starting now — even with $25 or $50 — matters more than waiting until you have a large amount." },
      ],
    },
  ],

  // ========================================================================
  // KNOW THE TERMS
  // ========================================================================
  keyTerms: [
    { term: "Budget", definition: "A plan for deciding how your income will be used across spending, saving, and goals." },
    { term: "Income", definition: "Money you receive from work or other sources." },
    { term: "Expense", definition: "Money you spend on goods, services, or obligations." },
    { term: "Cash Flow", definition: "The result of comparing your income to your expenses over a period of time: Income − Expenses = Cash Flow." },
    { term: "Fixed Expense", definition: "An expense that usually stays relatively consistent from month to month, like rent or a car payment." },
    { term: "Variable Expense", definition: "An expense that changes from month to month, like food, fuel, or utilities." },
    { term: "Periodic Expense", definition: "An expense that does not occur every month but should still be planned for, like car registration or school fees." },
    { term: "Discretionary Expense", definition: "Spending where the amount or purchase is more flexible, like entertainment or dining out." },
    { term: "Need", definition: "Something required to live and function. What counts as a need depends on your circumstances." },
    { term: "Want", definition: "Something that improves your life but is not essential. What counts as a want depends on your circumstances." },
    { term: "Tradeoff", definition: "Giving up one use for money when you choose another. Every financial decision involves a tradeoff." },
    { term: "Opportunity Cost", definition: "The value of what you give up when you choose one option over another." },
    { term: "Emergency Fund", definition: "Money reserved for unexpected financial needs, like urgent car repairs or sudden medical costs." },
    { term: "Sinking Fund", definition: "Money saved gradually for a known future expense, like car registration or graduation." },
    { term: "Savings Goal", definition: "A specific amount of money you plan to save by a specific time, for a specific purpose." },
    { term: "Principal", definition: "The original amount of money you deposit or save, before any interest is earned." },
    { term: "Interest", definition: "Money the bank pays you for keeping your money in a savings account, expressed as a percentage." },
    { term: "APY", definition: "Annual Percentage Yield — the yearly rate of return on a savings account, including the effect of compounding." },
    { term: "Compounding", definition: "When previously earned interest begins earning additional interest, helping savings grow faster over time." },
  ],

  // ========================================================================
  // SEE IT IN REAL LIFE
  // ========================================================================
  realLifeScenario: {
    title: "Andre's First Month Managing His Own Money",
    setup:
      "Andre is a high-school senior who works after school and on weekends. He is managing his own money for the first time and wants to make sure he is making good decisions.",
    situation:
      "Andre's monthly net income is $1,700. His planned expenses are: Transportation $300, Phone $75, Food $250, Family contribution $200, Entertainment $200, Clothing $150, Subscriptions $60. Andre also wants to save $100 per month for emergencies and $100 per month toward a car.",
    prompt:
      "Think about Andre's situation and answer these questions:\n1. What is Andre's total planned spending and saving?\n2. Does Andre currently have positive, zero, or negative cash flow?\n3. Which expenses may be easiest to adjust?\n4. What tradeoffs could Andre consider?\n5. Should Andre automatically remove all entertainment spending? Explain why or why not.",
  },

  // ========================================================================
  // RISE DECISION LAB
  // ========================================================================
  decisionLab: {
    id: "first-month-on-your-own",
    title: "RISE Decision Lab: First Month on Your Own",
    subtitle: "Build a monthly budget, then handle a Life Happens event",
    instructions:
      "You are on your own for the first time. Your monthly net income is $2,200. You have required baseline expenses, and you must decide how to allocate the remaining income. After you complete your initial budget, a random Life Happens event will occur — and you will need to revise your plan. All amounts are fictional and for educational purposes only.",
    fields: [
      // --- Provided: income and baseline expenses ---
      { id: "monthlyIncome", label: "Monthly Net Income", type: "calculated", description: "$2,200" },
      { id: "housing", label: "Housing Contribution / Rent", type: "calculated", description: "$700 (required baseline)" },
      { id: "transportation", label: "Transportation", type: "calculated", description: "$275 (required baseline)" },
      { id: "phone", label: "Phone", type: "calculated", description: "$70 (required baseline)" },
      { id: "groceries", label: "Groceries", type: "calculated", description: "$250 (required baseline)" },
      { id: "insurance", label: "Insurance", type: "calculated", description: "$125 (required baseline)" },
      { id: "baselineTotal", label: "Total Baseline Expenses", type: "calculated", description: "$1,420 ($700 + $275 + $70 + $250 + $125)" },
      { id: "remainingIncome", label: "Remaining Income to Allocate", type: "calculated", description: "$780 ($2,200 − $1,420)" },

      // --- Student allocates remaining income ---
      { id: "emergencySavings", label: "Emergency Savings", type: "number", placeholder: "Amount to save for emergencies", unit: "$", description: "How much will you set aside for unexpected expenses?" },
      { id: "sinkingFund", label: "Sinking Fund", type: "number", placeholder: "Amount for a known future expense", unit: "$", description: "How much will you save for a planned future cost (car registration, holidays, etc.)?" },
      { id: "entertainment", label: "Entertainment", type: "number", placeholder: "Movies, games, outings", unit: "$", description: "How much for entertainment and fun?" },
      { id: "clothingPersonal", label: "Clothing / Personal", type: "number", placeholder: "Clothing and personal items", unit: "$", description: "How much for clothing and personal needs?" },
      { id: "diningOut", label: "Dining Out", type: "number", placeholder: "Restaurants, takeout", unit: "$", description: "How much for eating out?" },
      { id: "educationCareer", label: "Education / Career Expenses", type: "number", placeholder: "School supplies, training, certifications", unit: "$", description: "How much for education or career-related costs?" },
      { id: "otherSpending", label: "Other", type: "number", placeholder: "Anything else", unit: "$", description: "Any other spending category?" },

      // --- Life Happens event ---
      { id: "lifeHappensEvent", label: "LIFE HAPPENS: One of the following events has occurred. Your instructor will assign or you will select one. Which event did you receive?", type: "radio", options: [
        { id: "event-a", label: "Event A: Car Repair", description: "+$300 expense this month — your car needs urgent repairs" },
        { id: "event-b", label: "Event B: Work Hours Reduced", description: "Monthly income decreases by $250 — your hours were cut" },
        { id: "event-c", label: "Event C: Unexpected Medical Cost", description: "+$175 expense this month — an unplanned medical bill" },
        { id: "event-d", label: "Event D: Bonus / Additional Work", description: "Monthly income increases by $200 — you picked up extra shifts" },
        { id: "event-e", label: "Event E: Phone Replacement Needed", description: "+$225 expense this month — your phone broke and must be replaced" },
      ]},

      // --- Revised budget ---
      { id: "revisedBudget", label: "Revised Budget — Show your updated amounts for each category after the Life Happens event", type: "text", placeholder: "List your revised amounts for each category (emergency savings, sinking fund, entertainment, clothing, dining out, education, other)..." },
      { id: "whatChanged", label: "1. What did you change?", type: "text", placeholder: "Describe the specific changes you made to your budget..." },
      { id: "whyChanged", label: "2. Why did you change it?", type: "text", placeholder: "Explain your reasoning for each change..." },
      { id: "protectedFromCuts", label: "3. What did you protect from cuts?", type: "text", placeholder: "Which categories did you avoid reducing, and why?" },
      { id: "tradeoffMade", label: "4. What tradeoff did you make?", type: "text", placeholder: "What did you give up, and what did you gain by making that choice?" },
      { id: "easierNextTime", label: "5. What would make this situation easier next time?", type: "text", placeholder: "What could you do in advance to handle a similar situation better?" },
    ],
    resultPrompt:
      "Life is unpredictable. A budget that includes emergency savings and sinking funds gives you options when surprises come. Grade reasoning and use of financial information — not whether every student makes identical spending choices. There is no single correct budget. What matters is that you thought through your priorities, made conscious tradeoffs, and protected what matters most to you.",
  },

  // ========================================================================
  // WORKBOOK ACTIVITY
  // ========================================================================
  workbookActivity: {
    title: "My Monthly Spending & Saving Plan",
    instructions:
      "Build your own monthly spending and saving plan using estimated or fictional figures. Do not use actual household income, parent income, bank balances, or account information. The plan should calculate your total income, total expenses, total savings, and remaining cash flow automatically.",
    prompts: [
      "INCOME — Job income (estimated monthly amount)",
      "INCOME — Other income (estimated monthly amount, if any)",
      "INCOME — Total net income (job + other)",
      "FIXED EXPENSES — List each fixed expense and amount (rent, car payment, phone plan, subscriptions with a fixed price)",
      "VARIABLE EXPENSES — List each variable expense and amount (food, fuel, utilities)",
      "PERIODIC EXPENSES — List each periodic expense and monthly set-aside (car registration ÷ 12, school fees ÷ 12, holiday expenses ÷ 12)",
      "DISCRETIONARY EXPENSES — List each discretionary expense and amount (entertainment, dining out, nonessential shopping)",
      "SAVINGS — Emergency savings (monthly contribution)",
      "SAVINGS — Sinking funds (list each fund and monthly contribution)",
      "SAVINGS — Other savings goals (list each goal and monthly contribution)",
      "CALCULATE — Total income (sum of all income sources)",
      "CALCULATE — Total expenses (sum of all expense categories)",
      "CALCULATE — Total savings (sum of all savings categories)",
      "CALCULATE — Remaining cash flow (total income − total expenses − total savings)",
      "RESULT — Is your cash flow positive, balanced (zero), or negative?",
      "REFLECTION — What would you change if your income dropped by 10% next month?",
    ],
  },

  // ========================================================================
  // KNOWLEDGE CHECK — 10 questions, 70% to pass
  // ========================================================================
  knowledgeCheck: [
    {
      id: "m2-q1",
      type: "multiple_choice",
      question: "Which of the following is the best example of a SMART financial goal?",
      options: [
        "I want to save money",
        "I will save $600 for emergency expenses over the next 10 months by setting aside $60 each month",
        "I want to be rich someday",
        "I will try to spend less",
      ],
      correctAnswer: "I will save $600 for emergency expenses over the next 10 months by setting aside $60 each month",
      explanation: "A SMART goal is Specific ($600 for emergencies), Measurable ($60/month), Action-oriented (setting aside), Realistic ($60/month is achievable), and Time-bound (10 months). The other options are vague and cannot be tracked.",
    },
    {
      id: "m2-q2",
      type: "scenario",
      question: "A student has monthly net income of $1,500 and total expenses of $1,375. What is their monthly cash flow?",
      options: ["+$125", "−$125", "$0", "+$1,375"],
      correctAnswer: "+$125",
      explanation: "Cash flow = Income − Expenses = $1,500 − $1,375 = +$125. This is positive cash flow — the student has $125 left over.",
    },
    {
      id: "m2-q3",
      type: "multiple_choice",
      question: "Why should you build a budget based on net income rather than gross pay?",
      options: [
        "Gross pay is always higher than net pay, so budgeting with gross pay leads to overspending",
        "Net pay is easier to calculate",
        "Gross pay includes deductions that are not yours to spend",
        "Both A and C are correct",
      ],
      correctAnswer: "Both A and C are correct",
      explanation: "Gross pay is your total earnings before deductions. Net pay is what actually reaches your bank account. Budgeting with gross pay means planning with money you do not actually receive — which leads to overspending.",
    },
    {
      id: "m2-q4",
      type: "multiple_choice",
      question: "Which of the following is the best example of a fixed expense?",
      options: [
        "Groceries, because you buy food every month",
        "Rent, because the amount usually stays relatively consistent each month",
        "Dining out, because you choose how much to spend",
        "Car registration, because it happens once a year",
      ],
      correctAnswer: "Rent, because the amount usually stays relatively consistent each month",
      explanation: "Fixed expenses usually stay relatively consistent from month to month. Rent is a classic fixed expense. Groceries are variable, dining out is discretionary, and car registration is periodic.",
    },
    {
      id: "m2-q5",
      type: "multiple_choice",
      question: "Which of the following is the best example of a variable expense?",
      options: [
        "A $65 monthly phone bill",
        "A $400 car repair",
        "Groceries, because the amount changes depending on what you buy and food prices",
        "A $30 monthly gym membership",
      ],
      correctAnswer: "Groceries, because the amount changes depending on what you buy and food prices",
      explanation: "Variable expenses change from month to month. A phone bill and gym membership are fixed (same amount each month). A car repair is an unexpected expense. Groceries vary based on what you buy and food prices.",
    },
    {
      id: "m2-q6",
      type: "multiple_choice",
      question: "A student expects a $360 car-insurance payment in six months. How much should they save each month to have the money ready?",
      options: ["$30", "$60", "$120", "$360"],
      correctAnswer: "$60",
      explanation: "$360 ÷ 6 months = $60 per month. By saving $60 each month in a sinking fund, the money will be ready when the bill arrives.",
    },
    {
      id: "m2-q7",
      type: "true_false",
      question: "An emergency fund and a sinking fund serve the same purpose.",
      options: ["True", "False"],
      correctAnswer: "False",
      explanation: "An emergency fund is for unexpected expenses — things you could not predict. A sinking fund is for known future expenses — things you can see coming, even if they do not happen every month. You need both.",
    },
    {
      id: "m2-q8",
      type: "scenario",
      question: "You have $50 to spend. You choose to buy a video game instead of putting the $50 in your emergency fund. What is the opportunity cost of your decision?",
      options: [
        "The video game",
        "The $50 in emergency savings you gave up — the value of what you did not choose",
        "There is no opportunity cost because you spent your own money",
        "The price of the video game minus $50",
      ],
      correctAnswer: "The $50 in emergency savings you gave up — the value of what you did not choose",
      explanation: "Opportunity cost is the value of what you give up when you choose one option over another. By choosing the video game, you gave up $50 in emergency savings — that is the opportunity cost.",
    },
    {
      id: "m2-q9",
      type: "multiple_choice",
      question: "What does 'pay yourself first' mean?",
      options: [
        "Buy yourself something nice before paying bills",
        "Treat savings as a priority and set money aside before spending on other things",
        "Pay your own bills before helping family",
        "Spend whatever you want and save what is left",
      ],
      correctAnswer: "Treat savings as a priority and set money aside before spending on other things",
      explanation: "Pay yourself first means moving money to savings before spending on other expenses. When you save first, saving actually happens. When you save last, there is often nothing left.",
    },
    {
      id: "m2-q10",
      type: "scenario",
      question: "You deposit $200 in a savings account with a 3% APY. After one year, approximately how much interest will you have earned? (Simple estimate, not exact compounding.)",
      options: ["$0.60", "$6.00", "$30.00", "$200.00"],
      correctAnswer: "$6.00",
      explanation: "A simple estimate: $200 × 0.03 = $6.00 per year. With compounding, the actual amount would be slightly higher because the interest earned during the year would also earn a small amount of interest. This is an example, not a guarantee — actual rates vary.",
    },
  ],

  // ========================================================================
  // REFLECTION
  // ========================================================================
  reflection: {
    prompt:
      "What is one spending habit or financial priority you think could have the greatest impact on your future financial plan? Why?",
    placeholder: "Write your reflection here...",
  },

  // ========================================================================
  // ACTION COMMITMENT
  // ========================================================================
  actionCommitment: {
    prompt:
      "One thing I will do to make my money work for me is ____________.",
    placeholder: "I will...",
  },

  // ========================================================================
  // RISE FINANCIAL BLUEPRINT UPDATE
  // ========================================================================
  blueprintUpdate: {
    sectionKey: "budget_savings",
    sectionTitle: "Monthly Budget & Emergency Savings Plan",
    prompt:
      "Complete your Monthly Budget & Emergency Savings Plan. Use fictional or estimated figures — do not enter actual household income, parent income, bank balances, account numbers, or other sensitive information.",
    fields: [
      { id: "estimatedNetIncome", label: "Estimated monthly net income", type: "text", placeholder: "e.g., $1,650" },
      { id: "estimatedFixedExpenses", label: "Estimated fixed expenses (monthly total)", type: "text", placeholder: "e.g., $655 (rent, phone, car payment)" },
      { id: "estimatedVariableExpenses", label: "Estimated variable expenses (monthly total)", type: "text", placeholder: "e.g., $300 (food, fuel, utilities)" },
      { id: "estimatedPeriodicExpenses", label: "Estimated periodic expenses (monthly set-aside)", type: "text", placeholder: "e.g., $50 (car registration ÷ 12, school fees ÷ 12)" },
      { id: "estimatedDiscretionary", label: "Estimated discretionary spending (monthly total)", type: "text", placeholder: "e.g., $200 (entertainment, dining out)" },
      { id: "emergencySavingsGoal", label: "Emergency-savings goal", type: "text", placeholder: "e.g., $1,000" },
      { id: "monthlyEmergencyContribution", label: "Monthly emergency-savings contribution", type: "text", placeholder: "e.g., $50/month" },
      { id: "sinkingFundsNeeded", label: "Sinking funds I may need", type: "textarea", placeholder: "e.g., car registration $360 in 6 months, graduation expenses $300 in 8 months" },
      { id: "otherSavingsGoals", label: "Other savings goals", type: "textarea", placeholder: "e.g., laptop $600 in 10 months, car down payment $1,500 in 12 months" },
      { id: "plannedMonthlySavings", label: "Planned monthly savings (total)", type: "text", placeholder: "e.g., $200 (emergency + sinking + goals)" },
      { id: "estimatedMonthlyCashFlow", label: "Estimated monthly cash flow", type: "text", placeholder: "e.g., +$145 (income − expenses − savings)" },
      { id: "expenseToAdjust", label: "One expense I could adjust if income decreases", type: "text", placeholder: "e.g., dining out — I could reduce from $100 to $40" },
      { id: "expenseToProtect", label: "One expense or goal I want to protect", type: "text", placeholder: "e.g., emergency savings — I will not cut this even if money is tight" },
    ],
  },
};
