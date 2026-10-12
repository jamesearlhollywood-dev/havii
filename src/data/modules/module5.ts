import type { CourseModule } from "../course-types";

export const module5: CourseModule = {
  id: "module-5",
  number: 5,
  title: "From Saving to Wealth — Investing & Building Your Future",
  subtitle:
    "Saving protects short-term goals. Investing can help money grow over longer periods — but growth comes with risk.",
  estimatedTime: "110 minutes",
  icon: "📈",
  themeColor: "rise-success",
  overview:
    "Saving and investing are two different tools for two different purposes. Saving protects money you need soon — emergency funds, car repairs, tuition payments. Investing accepts some risk in pursuit of potential long-term growth — retirement, wealth building, goals that are many years away. This module teaches you the difference, explains risk and return, time horizon, and liquidity, and introduces stocks, bonds, mutual funds, and ETFs at a basic level. You will learn about diversification, asset allocation, compound growth, and the impact of fees. We cover employer retirement plans, employer matching, and Roth IRA basics. You will learn to distinguish investing from speculation, recognize common warning signs of investment fraud, and build a hypothetical long-term investment allocation based on your goals, time horizon, and risk. The central RISE principle for this module is: Start Small. Scale Smart. Stay Consistent. This module is educational and practical. It does not recommend specific securities, cryptocurrencies, funds, brokerages, or financial products, and it does not provide individualized investment advice. All investment returns shown are hypothetical illustrations, not guarantees.",
  objectives: [
    "Explain the difference between saving and investing",
    "Explain the relationship between risk and potential return",
    "Define time horizon and liquidity",
    "Describe stocks, bonds, mutual funds, and ETFs at a basic level",
    "Explain diversification",
    "Explain basic asset allocation",
    "Recognize the impact of fees on long-term growth",
    "Explain compound growth",
    "Explain why starting early can matter",
    "Explain employer retirement plans and employer matching at a high level",
    "Explain Roth IRA basics at an introductory level",
    "Distinguish investing from speculation and gambling",
    "Identify common warning signs of investment fraud",
    "Build a hypothetical long-term investment allocation based on goals, time horizon, and risk",
  ],
  lessons: [
    // ======================================================================
    // LESSON 1 — SAVING VS. INVESTING
    // ======================================================================
    {
      id: "m5-l1",
      title: "Different Tools for Different Goals",
      subtitle: "Saving and investing serve different purposes",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Two Different Tools", level: 2 },
        { type: "paragraph", text: "Saving and investing are both important — but they serve different purposes. Understanding the difference helps you decide which tool to use for each financial goal." },
        { type: "heading", text: "Saving", level: 3 },
        { type: "paragraph", text: "Saving usually emphasizes safety, liquidity, and short-term or near-term goals. When you save, you generally put money in a place where it is protected and accessible — such as a savings account." },
        { type: "paragraph", text: "Examples of goals that may be appropriate for saving:" },
        { type: "list", items: [
          "Emergency fund",
          "Car repair",
          "Tuition payment due soon",
          "Apartment deposit",
        ]},
        { type: "heading", text: "Investing", level: 3 },
        { type: "paragraph", text: "Investing usually involves accepting some risk in pursuit of potential long-term growth. When you invest, you put money into assets that may increase or decrease in value over time." },
        { type: "paragraph", text: "Examples of goals that may be appropriate for investing:" },
        { type: "list", items: [
          "Retirement",
          "Long-term wealth",
          "Goals many years away",
        ]},
        { type: "callout", calloutType: "warning", text: "Money needed soon generally should not automatically be exposed to substantial market risk. If you need the money in the near future, the potential for loss may outweigh the potential for growth." },
        { type: "heading", text: "Sorting Activity", level: 3 },
        { type: "paragraph", text: "Think about how you would classify each of the following hypothetical goals. Is each more appropriate for saving, investing, or possibly a combination?" },
        { type: "list", items: [
          "Saving for a phone you want to buy in three months",
          "Saving for retirement, which is 40 years away",
          "Saving for a used car you want to buy in two years",
          "Building an emergency fund",
          "Saving for a down payment on a house in ten years",
          "Putting aside money you may need for a medical expense",
        ]},
        { type: "callout", calloutType: "tip", text: "There is no single correct answer for every situation. What matters is matching the tool to the goal: money needed soon generally favors safety and liquidity; money not needed for many years may be appropriate for investing. Some goals may call for a combination of both." },
      ],
    },

    // ======================================================================
    // LESSON 2 — RISK AND RETURN
    // ======================================================================
    {
      id: "m5-l2",
      title: "More Potential Growth Usually Means More Risk",
      subtitle: "Understanding the relationship between risk and return",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Key Terms", level: 2 },
        { type: "list", items: [
          "Investment risk — the possibility that an investment may lose value or not grow as expected.",
          "Return — the gain or loss on an investment over a period of time.",
          "Loss — a decline in the value of an investment.",
          "Volatility — how much and how quickly an investment's value may go up and down.",
          "Risk tolerance — how much uncertainty or potential loss you are personally comfortable accepting.",
          "Risk capacity — how much uncertainty or potential loss your financial situation can actually absorb.",
        ]},
        { type: "heading", text: "The Core Principle", level: 3 },
        { type: "callout", calloutType: "info", text: "Higher potential returns generally involve accepting greater uncertainty or risk. There is no free lunch — investments that offer the possibility of higher growth usually come with a greater possibility of loss." },
        { type: "paragraph", text: "This does not mean that taking more risk always leads to higher returns. It means that investments with higher potential returns generally carry greater uncertainty. An investment can lose value regardless of its potential." },
        { type: "callout", calloutType: "warning", text: "Investments can lose value. Do not assume that markets always rise over every time period. Even investments that have grown over long periods can experience significant declines along the way." },
        { type: "heading", text: "Scenario: Two Students, Two Time Horizons", level: 3 },
        { type: "paragraph", text: "Two students each have $1,000. One needs the money in six months. One does not expect to need the money for 30 years." },
        { type: "callout", calloutType: "warning", text: "Should they necessarily make the same financial choice?" },
        { type: "paragraph", text: "Correct principle: No. Time horizon and purpose matter. The student who needs the money in six months may not be in a position to accept the same level of risk as the student who does not need the money for 30 years. A decline in value right before the money is needed could create a real problem." },
        { type: "callout", calloutType: "tip", text: "Risk tolerance is personal and emotional — how much uncertainty you can stomach. Risk capacity is financial — how much loss your situation can actually absorb. Both matter when making decisions about investing." },
      ],
    },

    // ======================================================================
    // LESSON 3 — TIME HORIZON
    // ======================================================================
    {
      id: "m5-l3",
      title: "When Will You Need the Money?",
      subtitle: "Understanding time horizon",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What Is Time Horizon?", level: 2 },
        { type: "definition", text: "Time horizon is the expected period before money is needed. It is one of the most important factors in deciding how to save or invest." },
        { type: "heading", text: "Examples of Different Time Horizons", level: 3 },
        { type: "list", items: [
          "6 months — money needed very soon; stability and access are likely the priority.",
          "3 years — short-term goal; preserving the money may still be important.",
          "10 years — medium-term goal; some ability to accept fluctuation may exist.",
          "40 years — long-term goal; more time to potentially experience and recover from market fluctuations.",
        ]},
        { type: "heading", text: "Why Time Horizon Matters", level: 3 },
        { type: "paragraph", text: "Longer horizons may give an investor more time to experience and potentially recover from market fluctuations. Short-term goals may require greater stability because there is less time to wait out a decline." },
        { type: "callout", calloutType: "warning", text: "This does not guarantee recovery from losses. A longer time horizon may provide more opportunity for recovery, but it does not eliminate the possibility of loss. Investments can decline in value regardless of how long you hold them." },
        { type: "callout", calloutType: "tip", text: "Before choosing how to save or invest, ask: When will I need this money? The answer helps determine how much risk may be appropriate for your situation." },
      ],
    },

    // ======================================================================
    // LESSON 4 — LIQUIDITY
    // ======================================================================
    {
      id: "m5-l4",
      title: "Can You Access the Money When You Need It?",
      subtitle: "Understanding liquidity",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Key Terms", level: 2 },
        { type: "list", items: [
          "Liquidity — how easily and quickly you can access your money without significant loss of value.",
          "Liquid asset — an asset that can be converted to cash quickly and easily, such as money in a checking or savings account.",
          "Illiquid asset — an asset that may be difficult or time-consuming to convert to cash, or that may lose value if sold quickly.",
        ]},
        { type: "heading", text: "Comparing Liquidity", level: 3 },
        { type: "paragraph", text: "Different types of money and investments have different levels of liquidity:" },
        { type: "list", items: [
          "Checking and savings accounts — generally very liquid; you can access your money quickly.",
          "Publicly traded investments — generally liquid; you can typically sell them within days, though the price may have changed.",
          "Real estate — generally illiquid; selling property can take weeks or months.",
          "Certain retirement accounts — access may be limited by account rules, tax rules, or penalties, especially before retirement age.",
        ]},
        { type: "heading", text: "What Affects Access?", level: 3 },
        { type: "paragraph", text: "Accessibility may be affected by several factors:" },
        { type: "list", items: [
          "Market conditions — the price of an investment may have declined when you need to sell.",
          "Account rules — some accounts restrict when or how you can withdraw.",
          "Taxes — withdrawing from certain accounts may trigger tax consequences.",
          "Penalties — early withdrawals from retirement accounts may incur penalties.",
          "Settlement periods — even after selling an investment, it may take a few days for the cash to be available.",
        ]},
        { type: "callout", calloutType: "tip", text: "Growth potential is not the only factor. Access matters too. An investment that has grown significantly may still be a poor choice for money you need soon if you cannot access it quickly or without penalty." },
      ],
    },

    // ======================================================================
    // LESSON 5 — STOCKS
    // ======================================================================
    {
      id: "m5-l5",
      title: "Owning a Piece of a Company",
      subtitle: "Understanding stocks at a basic level",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Key Terms", level: 2 },
        { type: "list", items: [
          "Stock — a type of investment that represents an ownership interest in a company.",
          "Share — a unit of ownership in a company.",
          "Shareholder — a person who owns shares of stock in a company.",
          "Price appreciation — an increase in the price of an investment over time.",
          "Dividend — a portion of a company's earnings that may be distributed to shareholders, when a company chooses to pay one.",
        ]},
        { type: "heading", text: "What Does Owning Stock Mean?", level: 3 },
        { type: "paragraph", text: "Owning stock represents an ownership interest in a company. When you buy a share of stock, you own a small piece of that company. The value of that share may rise, fall, or remain relatively flat over time." },
        { type: "paragraph", text: "Stock values may:" },
        { type: "list", items: [
          "Rise — if the company performs well and investors are optimistic.",
          "Fall — if the company struggles or market conditions change.",
          "Remain relatively flat — if conditions stay stable.",
        ]},
        { type: "callout", calloutType: "warning", text: "A familiar company is not automatically a good investment. Just because you recognize a company's name or use its products does not mean its stock is appropriate for your financial plan. Familiarity is not the same as research or understanding." },
        { type: "callout", calloutType: "info", text: "This module does not name specific companies as recommendations. All references to companies are for educational purposes only." },
        { type: "callout", calloutType: "tip", text: "Owning stock means owning a piece of a company — and accepting that the value of that piece can go up or down. A dividend, if one is paid, is not guaranteed and can change or stop." },
      ],
    },

    // ======================================================================
    // LESSON 6 — BONDS
    // ======================================================================
    {
      id: "m5-l6",
      title: "When Investors Lend Money",
      subtitle: "Understanding bonds at a basic level",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Key Terms", level: 2 },
        { type: "list", items: [
          "Bond — a type of investment where the investor lends money to an issuer under specified terms.",
          "Issuer — the entity that borrows money by issuing a bond — such as a company, a city, or a government.",
          "Principal — the amount originally lent, which the issuer generally agrees to repay.",
          "Interest — the periodic payments the issuer makes to the bondholder, often called coupon payments.",
          "Maturity — the date when the issuer is scheduled to repay the principal.",
        ]},
        { type: "heading", text: "What Does Buying a Bond Mean?", level: 3 },
        { type: "paragraph", text: "Buying a bond generally represents lending money to an issuer under specified terms. The issuer agrees to make interest payments and to repay the principal at maturity. In exchange, the investor accepts the risk that the issuer may not meet those obligations." },
        { type: "heading", text: "Bonds Also Carry Risks", level: 3 },
        { type: "callout", calloutType: "warning", text: "Bonds are not risk-free. They carry several types of risk, including:" },
        { type: "list", items: [
          "Interest-rate risk — when interest rates rise, the value of existing bonds may fall.",
          "Credit/default risk — the risk that the issuer may fail to make interest payments or repay the principal.",
          "Inflation risk — inflation may reduce the purchasing power of the interest and principal you receive.",
        ]},
        { type: "callout", calloutType: "info", text: "Do not describe bonds as risk-free. While bonds are generally considered less volatile than stocks, they still carry real risks. The level of risk depends on the issuer, the terms, and market conditions." },
        { type: "callout", calloutType: "tip", text: "A bond is a loan — you lend money, the issuer promises to pay interest and repay principal. But promises can be broken, and bond values can change. Understand the risks before lending your money." },
      ],
    },

    // ======================================================================
    // LESSON 7 — MUTUAL FUNDS & ETFs
    // ======================================================================
    {
      id: "m5-l7",
      title: "Owning Many Investments at Once",
      subtitle: "Understanding mutual funds and ETFs at a basic level",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Mutual Fund", level: 2 },
        { type: "definition", text: "A mutual fund is a pooled investment vehicle that can hold many securities. When you invest in a mutual fund, your money is combined with money from other investors to buy a collection of stocks, bonds, or other assets." },
        { type: "heading", text: "Exchange-Traded Fund (ETF)", level: 3 },
        { type: "definition", text: "An ETF (Exchange-Traded Fund) is a pooled investment that generally trades on an exchange. Like a mutual fund, it can hold many securities — but unlike a traditional mutual fund, it can be bought and sold throughout the trading day." },
        { type: "heading", text: "What to Know About Funds", level: 3 },
        { type: "list", items: [
          "Funds can hold stocks, bonds, or other assets.",
          "Some are actively managed — a manager or team selects investments trying to outperform a benchmark.",
          "Some follow an index — they try to match the performance of a specific market index rather than beat it.",
          "Fees and investment strategies vary from one fund to another.",
        ]},
        { type: "callout", calloutType: "warning", text: "Do not imply every mutual fund or ETF is diversified equally. A fund that holds many securities may be more diversified than one that holds few — but the level of diversification depends on what the fund actually holds. Two funds can have very different risk profiles." },
        { type: "callout", calloutType: "tip", text: "Mutual funds and ETFs can provide a way to own many investments at once, but they are not all the same. Compare what they hold, how they are managed, what they cost, and what their objectives are before making any decision." },
      ],
    },

    // ======================================================================
    // LESSON 8 — DIVERSIFICATION
    // ======================================================================
    {
      id: "m5-l8",
      title: "Do Not Put Everything in One Basket",
      subtitle: "Understanding diversification",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What Is Diversification?", level: 2 },
        { type: "definition", text: "Diversification means spreading investments across different assets or investments to reduce concentration risk — the risk that comes from having too much of your money tied to a single investment." },
        { type: "heading", text: "Example: Portfolio A vs. Portfolio B", level: 3 },
        { type: "paragraph", text: "Consider two hypothetical portfolios:" },
        { type: "list", items: [
          "Portfolio A — 100% invested in one company.",
          "Portfolio B — Spread across many companies and asset types.",
        ]},
        { type: "callout", calloutType: "warning", text: "Which portfolio has more concentration risk?" },
        { type: "paragraph", text: "Correct: Portfolio A. When all your money is in one investment, a decline in that investment affects your entire portfolio. Portfolio B, spread across many investments, may be less affected by a decline in any single investment." },
        { type: "callout", calloutType: "warning", text: "Diversification can reduce certain risks, but it does not eliminate the possibility of loss. A diversified portfolio can still decline in value if the overall market falls. Diversification reduces concentration risk — it does not eliminate all risk." },
        { type: "callout", calloutType: "tip", text: "The principle is simple: do not put everything in one basket. Spreading investments across different assets, companies, and types can reduce the impact of any single investment performing poorly." },
      ],
    },

    // ======================================================================
    // LESSON 9 — ASSET ALLOCATION
    // ======================================================================
    {
      id: "m5-l9",
      title: "How You Divide the Portfolio",
      subtitle: "Understanding asset allocation",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "What Is Asset Allocation?", level: 2 },
        { type: "definition", text: "Asset allocation is how investments are divided among categories such as stocks, bonds, and cash or cash equivalents." },
        { type: "heading", text: "What Allocation Depends On", level: 3 },
        { type: "paragraph", text: "Allocation may depend on several factors:" },
        { type: "list", items: [
          "Goal — what you are saving or investing for.",
          "Time horizon — when you need the money.",
          "Risk tolerance — how much uncertainty you can comfortably accept.",
          "Need for liquidity — how quickly you may need to access the money.",
        ]},
        { type: "callout", calloutType: "warning", text: "Do not prescribe one universal allocation. There is no single allocation that is right for everyone. The appropriate allocation depends on your individual goals, time horizon, risk tolerance, and liquidity needs." },
        { type: "heading", text: "Three Fictional Profiles", level: 3 },
        { type: "paragraph", text: "Consider these three hypothetical profiles and why the same allocation may not fit all three:" },
        { type: "list", items: [
          "Profile A: Needs money in two years. A short time horizon may call for greater stability and liquidity.",
          "Profile B: Investing for retirement 40 years away. A long time horizon may allow for more tolerance of short-term fluctuations.",
          "Profile C: Saving and investing for multiple goals. Different goals with different time horizons may call for different allocations for each portion.",
        ]},
        { type: "callout", calloutType: "info", text: "Ask yourself: Why might the same allocation not fit all three profiles? The answer is that each profile has a different goal, a different time horizon, and a different relationship with risk. Allocation should be tailored to the individual situation — not copied from someone else." },
        { type: "callout", calloutType: "tip", text: "Asset allocation is one of the most important investment decisions. It is not about picking the 'best' investment — it is about dividing your money among categories in a way that aligns with your goals, time horizon, and risk tolerance." },
      ],
    },

    // ======================================================================
    // LESSON 10 — COMPOUND GROWTH
    // ======================================================================
    {
      id: "m5-l10",
      title: "Growth Can Build on Growth",
      subtitle: "Understanding compound growth",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Key Terms", level: 2 },
        { type: "list", items: [
          "Principal — the original amount invested.",
          "Return — the gain or loss on an investment.",
          "Reinvestment — putting returns back into the investment rather than withdrawing them.",
          "Compounding — when returns earn their own returns over time.",
        ]},
        { type: "heading", text: "How Compounding Works", level: 3 },
        { type: "paragraph", text: "Compound growth means that returns can earn their own returns. If an investment grows, the growth is added to the principal, and future returns may be earned on that larger amount. Over time, this can create a snowball effect." },
        { type: "heading", text: "Hypothetical Illustration", level: 3 },
        { type: "callout", calloutType: "warning", text: "Illustration only. Actual investment returns vary and losses are possible. The assumed return below is fictional and used only for demonstration." },
        { type: "paragraph", text: "A student invests $50 per month. Compare two starting ages, using a clearly fictional assumed annual return only for demonstration:" },
        { type: "table", headers: ["Starting Age", "Monthly Contribution", "Assumed Annual Return (Fictional)", "Years Investing"], rows: [
          ["Age 18", "$50/month", "Illustration only", "Until age 65"],
          ["Age 28", "$50/month", "Illustration only", "Until age 65"],
        ]},
        { type: "paragraph", text: "Starting at age 18 gives the money 10 more years to potentially compound compared to starting at age 28. Even with the same monthly contribution, the earlier start may result in more time for growth to build on growth." },
        { type: "callout", calloutType: "warning", text: "This illustration does not promise a specific future balance. Actual investment returns vary, and losses are possible. The point is not the specific number — it is the principle: time and consistency can matter." },
        { type: "heading", text: "The RISE Connection", level: 3 },
        { type: "callout", calloutType: "success", text: "Start Small. Scale Smart. Stay Consistent. You do not need a large amount to begin. Starting early and staying consistent with even small amounts may give compounding more time to work — but returns are never guaranteed." },
        { type: "callout", calloutType: "tip", text: "Focus on time and consistency rather than promising a specific future balance. The key takeaway is that starting early and investing regularly may give compounding more time to work — but all investments carry risk and returns are never guaranteed." },
      ],
    },

    // ======================================================================
    // LESSON 11 — FEES MATTER
    // ======================================================================
    {
      id: "m5-l11",
      title: "Small Fees Can Become Large Costs",
      subtitle: "Understanding the impact of fees on long-term growth",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Types of Investment Fees", level: 2 },
        { type: "list", items: [
          "Expense ratio — an annual fee charged by a fund, expressed as a percentage of your investment.",
          "Trading fee — a fee charged when buying or selling an investment, when applicable.",
          "Account fee — a fee charged for maintaining an account, when applicable.",
          "Advisory fee — a fee paid to a financial advisor for investment advice or management, when applicable.",
        ]},
        { type: "heading", text: "Fees Reduce Returns", level: 3 },
        { type: "paragraph", text: "Fees reduce investment returns. Even a small-sounding percentage can add up to a significant amount over many years because fees compound against you — they reduce the amount that stays invested and can grow." },
        { type: "heading", text: "Conceptual Comparison", level: 3 },
        { type: "callout", calloutType: "warning", text: "The figures below are fictional and for educational purposes only." },
        { type: "paragraph", text: "Two investments earn the same hypothetical gross return. One charges substantially higher annual fees than the other. Over many years, the higher-fee investment leaves less money invested because more is taken out in fees each year." },
        { type: "callout", calloutType: "warning", text: "Which leaves more money invested, all else being equal?" },
        { type: "paragraph", text: "Correct: The lower-cost option. When two investments earn the same gross return, the one with lower fees leaves more money invested over time." },
        { type: "callout", calloutType: "info", text: "Do not imply lowest fee automatically means best investment. A low fee is valuable, but it is only one factor. Also compare strategy, risk, diversification, and objectives." },
        { type: "heading", text: "What to Compare", level: 3 },
        { type: "paragraph", text: "When evaluating an investment, compare:" },
        { type: "list", items: [
          "Strategy — what the investment tries to achieve and how.",
          "Risk — how much uncertainty or potential for loss is involved.",
          "Diversification — how spread out the investments are.",
          "Fees — what the investment costs you over time.",
          "Objectives — whether the investment's goals align with yours.",
        ]},
        { type: "callout", calloutType: "tip", text: "Fees matter — but they are not the only thing that matters. Compare the full picture: strategy, risk, diversification, fees, and objectives. A low fee on an investment that does not fit your goals is not a good deal." },
      ],
    },

    // ======================================================================
    // LESSON 12 — RETIREMENT ACCOUNTS
    // ======================================================================
    {
      id: "m5-l12",
      title: "Future You Needs a Plan Too",
      subtitle: "Understanding employer retirement plans and employer matching",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Key Terms", level: 2 },
        { type: "list", items: [
          "Employer-sponsored retirement plan — a retirement savings plan offered through an employer.",
          "401(k) — a common type of employer-sponsored retirement plan in the private sector.",
          "403(b) — a type of employer-sponsored retirement plan often available to employees of certain non-profit and educational organizations.",
          "Employer contribution — money an employer puts into an employee's retirement account.",
          "Employer match — additional employer contributions that may be provided when an employee meets certain contribution requirements.",
          "Vesting — the process by which an employee earns the right to keep employer contributions over time, according to the plan's schedule.",
        ]},
        { type: "heading", text: "How Employer Matching Works", level: 3 },
        { type: "paragraph", text: "An employer match may provide additional employer contributions when eligibility and contribution requirements are met. For example, an employer may match some portion of what the employee contributes — but only if the employee contributes enough to qualify." },
        { type: "callout", calloutType: "warning", text: "This module does not hardcode contribution limits. Rules and limits change and should be verified through current IRS or plan guidance. Always check the specific terms of your employer's plan." },
        { type: "heading", text: "Scenario: Understanding the Match", level: 3 },
        { type: "paragraph", text: "An employer offers a hypothetical dollar-for-dollar match on employee contributions up to a stated percentage of salary." },
        { type: "callout", calloutType: "warning", text: "Why might failing to understand the match mean missing part of your compensation package?" },
        { type: "paragraph", text: "If an employer offers to match your contributions up to a certain amount and you do not contribute enough to receive the full match, you may be leaving money on the table. The employer match is part of your total compensation — not contributing enough to receive it is like declining part of your pay." },
        { type: "callout", calloutType: "info", text: "Vesting schedules vary by plan. Some plans provide immediate vesting, while others require a certain number of years of service before employer contributions belong to the employee. Understanding your plan's vesting schedule helps you know what happens if you change jobs." },
        { type: "callout", calloutType: "tip", text: "If your future employer offers a retirement plan with a match, find out the rules: How much do you need to contribute to get the full match? What is the vesting schedule? Understanding these details helps you make the most of your compensation." },
      ],
    },

    // ======================================================================
    // LESSON 13 — ROTH IRA BASICS
    // ======================================================================
    {
      id: "m5-l13",
      title: "Another Long-Term Investing Tool",
      subtitle: "Understanding Roth IRA basics at an introductory level",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Key Terms", level: 2 },
        { type: "list", items: [
          "Individual Retirement Account (IRA) — a type of retirement account an individual can open on their own, outside of an employer plan.",
          "Roth IRA — a type of IRA where contributions are made with after-tax money, and qualified withdrawals in retirement may be tax-free under certain conditions.",
          "Contributions — the money you put into the account.",
          "Earned income requirement — generally, you must have earned income to contribute to a Roth IRA.",
          "Tax treatment — how contributions, growth, and withdrawals are taxed, which depends on the type of account and applicable rules.",
        ]},
        { type: "heading", text: "Roth IRA at a High Level", level: 3 },
        { type: "paragraph", text: "A Roth IRA is a personal retirement account. Contributions are made with after-tax money — meaning you have already paid income tax on the money before putting it in. Under certain conditions, growth and qualified withdrawals in retirement may be tax-free." },
        { type: "callout", calloutType: "warning", text: "Eligibility, contribution limits, and tax rules can change. Verify current IRS guidance before making real decisions. Do not rely on this module for current rules — it provides a conceptual introduction only." },
        { type: "callout", calloutType: "info", text: "Do not present Roth IRAs as appropriate for every person. Whether a Roth IRA makes sense depends on individual circumstances, including income, eligibility, tax situation, and goals. This is an introductory overview, not a recommendation." },
        { type: "callout", calloutType: "tip", text: "A Roth IRA is one tool among many. Understanding the basic concept — after-tax contributions, potential tax-free growth — is useful. But before opening any account, verify current rules and consider whether it fits your individual situation." },
      ],
    },

    // ======================================================================
    // LESSON 14 — INVESTING VS. SPECULATING
    // ======================================================================
    {
      id: "m5-l14",
      title: "Are You Investing or Betting on a Price Move?",
      subtitle: "Distinguishing investing from speculation",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Long-Term Investing", level: 2 },
        { type: "paragraph", text: "Long-term investing typically involves:" },
        { type: "list", items: [
          "Goals — a clear purpose for the money.",
          "Research — understanding what you are investing in and why.",
          "Diversification — spreading risk across multiple investments.",
          "Time — a long-term perspective, measured in years or decades.",
          "Risk management — understanding and managing how much risk you are taking.",
        ]},
        { type: "heading", text: "Speculation", level: 3 },
        { type: "paragraph", text: "Speculation often relies heavily on:" },
        { type: "list", items: [
          "Short-term price movement — betting that a price will go up or down quickly.",
          "Concentrated bets — putting a large portion of money into a single asset.",
          "Higher uncertainty — accepting a greater possibility of losing money.",
        ]},
        { type: "heading", text: "Cryptocurrency and Volatile Assets", level: 3 },
        { type: "paragraph", text: "Cryptocurrency and other highly volatile assets may involve substantial risk and price volatility. This module discusses them only as examples of assets that may carry significant risk — not as recommendations to buy or avoid any specific asset." },
        { type: "callout", calloutType: "warning", text: "An asset becoming popular online does not make it appropriate for your financial plan. Popularity, social-media buzz, and celebrity endorsements are not the same as research, diversification, or sound financial reasoning." },
        { type: "callout", calloutType: "tip", text: "Ask yourself: Am I investing based on goals, research, and a long-term plan? Or am I betting on a short-term price move? Understanding the difference can help you make more deliberate financial decisions." },
      ],
    },

    // ======================================================================
    // LESSON 15 — INVESTMENT SCAMS
    // ======================================================================
    {
      id: "m5-l15",
      title: "If It Sounds Too Good to Be True, Investigate",
      subtitle: "Recognizing common warning signs of investment fraud",
      estimatedMinutes: 7,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "Common Warning Signs", level: 2 },
        { type: "paragraph", text: "Investment scams can target anyone — including young investors. Learn to recognize these common warning signs:" },
        { type: "list", items: [
          "Guaranteed high returns — no legitimate investment can guarantee unusually high returns.",
          "'No risk' — all investments carry some risk; anyone who says otherwise is not being honest.",
          "Pressure to act immediately — scammers create urgency so you do not have time to think or verify.",
          "Secret strategy — claims of a special formula or exclusive method that cannot be explained.",
          "Celebrity or social-media endorsement used as proof — an endorsement is not evidence that an investment is sound.",
          "Unregistered person or product — the person or investment may not be registered with the appropriate authorities.",
          "Requests to send money through unusual channels — such as gift cards, wire transfers to unknown parties, or cryptocurrency.",
          "Fake account screenshots — fabricated images showing large returns that cannot be verified.",
          "Romance or investment scams — someone you met online builds trust and then pressures you to invest.",
          "Pump-and-dump schemes — someone hypes an investment to drive up the price, then sells their own shares when others buy in.",
        ]},
        { type: "callout", calloutType: "warning", text: "No legitimate investment can guarantee unusually high returns with no risk. If someone promises guaranteed high returns, that is one of the clearest warning signs of fraud." },
        { type: "heading", text: "Verify Before You Trust", level: 3 },
        { type: "paragraph", text: "Encourage yourself to independently verify investment professionals and products using appropriate official resources. Do not rely solely on what the promoter tells you." },
        { type: "callout", calloutType: "info", text: "SEC Investor.gov is an educational resource where you can learn about investing and check whether investment professionals and products are registered. Use official resources to verify claims before sending money." },
        { type: "callout", calloutType: "tip", text: "If it sounds too good to be true, investigate. Take your time, ask questions, verify independently, and do not let anyone pressure you into acting before you are ready. A legitimate investment will still be there after you have done your research." },
      ],
    },

    // ======================================================================
    // LESSON 16 — BUILDING A LONG-TERM STRATEGY
    // ======================================================================
    {
      id: "m5-l16",
      title: "Goals First, Investments Second",
      subtitle: "A decision sequence for building a long-term investment strategy",
      estimatedMinutes: 6,
      isRequired: true,
      isEnrichment: false,
      content: [
        { type: "heading", text: "The Decision Sequence", level: 2 },
        { type: "paragraph", text: "Before choosing an investment, work through this decision sequence. Start with your goals — not with an investment product." },
        { type: "list", items: [
          "1. What is the goal? — Know what you are saving or investing for.",
          "2. When will I need the money? — Your time horizon helps determine how much risk may be appropriate.",
          "3. How much risk can I reasonably accept? — Consider both your risk tolerance and your risk capacity.",
          "4. Do I need this money to remain liquid? — Can you access it when you need it without significant loss?",
          "5. How diversified is the investment? — Does it spread risk or concentrate it?",
          "6. What does it cost? — Understand the fees and how they affect long-term growth.",
          "7. Do I understand what I own? — If you cannot explain the investment, you may not understand it well enough.",
          "8. How will I monitor the plan? — Investing is not a one-time decision; revisit your plan periodically.",
        ]},
        { type: "callout", calloutType: "warning", text: "Do not choose an investment first and then invent a goal for it. Start with your goals, then find investments that fit. Choosing an investment and then rationalizing it is working backwards." },
        { type: "callout", calloutType: "success", text: "The RISE principle for this module: Start Small. Scale Smart. Stay Consistent. You do not need to be an expert or have a lot of money to begin learning. Start with your goals, understand what you are doing, and build knowledge over time." },
        { type: "callout", calloutType: "tip", text: "Goals first, investments second. Understand before you act. Diversify rather than concentrate. Compare fees. And if you cannot explain what you own, take time to learn more before committing your money." },
      ],
    },
  ],

  // ========================================================================
  // KNOW THE TERMS
  // ========================================================================
  keyTerms: [
    { term: "Saving", definition: "Putting money in a safe, accessible place for short-term or near-term goals, emphasizing safety and liquidity." },
    { term: "Investing", definition: "Putting money into assets that may grow in value over the long term, accepting some risk in pursuit of potential growth." },
    { term: "Investment", definition: "An asset that a person puts money into with the goal of potential growth, understanding that the value may rise, fall, or stay flat." },
    { term: "Principal", definition: "The original amount of money invested or lent, before any returns or interest." },
    { term: "Return", definition: "The gain or loss on an investment over a period of time." },
    { term: "Risk", definition: "The possibility that an investment may lose value or not grow as expected." },
    { term: "Volatility", definition: "How much and how quickly an investment's value may go up and down over time." },
    { term: "Risk Tolerance", definition: "How much uncertainty or potential loss you are personally comfortable accepting." },
    { term: "Risk Capacity", definition: "How much uncertainty or potential loss your financial situation can actually absorb." },
    { term: "Time Horizon", definition: "The expected period before money is needed — one of the most important factors in deciding how to save or invest." },
    { term: "Liquidity", definition: "How easily and quickly you can access your money without significant loss of value." },
    { term: "Stock", definition: "A type of investment that represents an ownership interest in a company." },
    { term: "Share", definition: "A unit of ownership in a company." },
    { term: "Shareholder", definition: "A person who owns shares of stock in a company." },
    { term: "Dividend", definition: "A portion of a company's earnings that may be distributed to shareholders when a company chooses to pay one; not guaranteed." },
    { term: "Bond", definition: "A type of investment where the investor lends money to an issuer under specified terms, generally in exchange for interest payments and repayment of principal at maturity." },
    { term: "Maturity", definition: "The date when a bond's principal is scheduled to be repaid to the investor." },
    { term: "Mutual Fund", definition: "A pooled investment vehicle that can hold many securities, combining money from many investors to buy a collection of stocks, bonds, or other assets." },
    { term: "ETF", definition: "Exchange-Traded Fund — a pooled investment that generally trades on an exchange and can hold many securities, bought and sold throughout the trading day." },
    { term: "Index", definition: "A measurement of the performance of a group of investments, used as a benchmark that some funds try to match." },
    { term: "Diversification", definition: "Spreading investments across different assets or investments to reduce concentration risk." },
    { term: "Concentration Risk", definition: "The risk that comes from having too much of your money tied to a single investment or a small number of investments." },
    { term: "Asset Allocation", definition: "How investments are divided among categories such as stocks, bonds, and cash or cash equivalents." },
    { term: "Compound Growth", definition: "When investment returns earn their own returns over time, potentially creating a snowball effect as growth is added to the principal." },
    { term: "Expense Ratio", definition: "An annual fee charged by a fund, expressed as a percentage of your investment." },
    { term: "Retirement Account", definition: "An account designed to help save for retirement, which may offer tax advantages depending on the type and applicable rules." },
    { term: "Employer Match", definition: "Additional employer contributions to a retirement plan that may be provided when an employee meets certain contribution requirements." },
    { term: "Vesting", definition: "The process by which an employee earns the right to keep employer contributions over time, according to the plan's schedule." },
    { term: "Roth IRA", definition: "A type of individual retirement account where contributions are made with after-tax money and qualified withdrawals in retirement may be tax-free under certain conditions." },
    { term: "Speculation", definition: "Betting on short-term price movements, often with concentrated bets and higher uncertainty, as distinguished from long-term investing based on goals and research." },
  ],

  // ========================================================================
  // SEE IT IN REAL LIFE
  // ========================================================================
  realLifeScenario: {
    title: "Andre Wants to Start Investing",
    setup:
      "Andre is 18. He has $1,500 in savings, part-time income, no credit-card debt, a goal to buy a car within 12 months, and a long-term goal of building wealth. He sees a social-media creator claiming: 'Put all your money into this one investment before it doubles.'",
    situation:
      "Andre is excited about the idea of growing his money. The creator shows screenshots of large returns and says the opportunity is limited. Andre's friend already sent money. But Andre also needs a car within 12 months, and his $1,500 in savings is what he has been counting on for the down payment.",
    prompt:
      "Think about Andre's situation and answer these questions:\n1. Should Andre invest all $1,500?\n2. How does the car goal affect his decision?\n3. Why does liquidity matter?\n4. What risk comes from putting everything into one investment?\n5. What red flags are present in the social-media claim?\n6. What could Andre do instead of treating all $1,500 the same way?\n\nThere is no one prescribed dollar allocation. Evaluate the reasoning behind each answer.",
  },

  // ========================================================================
  // RISE DECISION LAB
  // ========================================================================
  decisionLab: {
    id: "build-a-portfolio-lab",
    title: "RISE Decision Lab: Build a Portfolio",
    subtitle: "Allocate a hypothetical $10,000 investment portfolio for one of three investor profiles",
    instructions:
      "You receive a hypothetical $10,000 long-term investment portfolio. Choose one of three investor profiles and allocate 100% of the portfolio among four investment categories. These are fictional category examples, not real product recommendations. Your allocation must total exactly 100%. There is no one predetermined correct portfolio — what matters is the quality of your reasoning. All amounts are hypothetical and for educational purposes only. This does not constitute investment advice.",
    fields: [
      // --- Profile selection ---
      { id: "profileSelection", label: "1. Choose an investor profile", type: "radio", options: [
        { id: "profile-jordan", label: "Profile 1 — Jordan", description: "Age 18. Goal: Retirement. Time horizon: 40+ years. Comfortable with substantial short-term market fluctuation." },
        { id: "profile-maya", label: "Profile 2 — Maya", description: "Goal: Graduate-school expenses. Time horizon: 5 years. Moderate risk tolerance." },
        { id: "profile-andre", label: "Profile 3 — Andre", description: "Goal: Major purchase. Time horizon: 2 years. Low tolerance for losing principal." },
      ]},

      // --- Allocation percentages ---
      { id: "allocUSStocks", label: "2a. Broad U.S. stock fund — allocation %", type: "number", placeholder: "Enter percentage (0–100)", unit: "%", min: 0, max: 100, description: "Fictional category example — not a real product recommendation" },
      { id: "allocIntlStocks", label: "2b. International stock fund — allocation %", type: "number", placeholder: "Enter percentage (0–100)", unit: "%", min: 0, max: 100, description: "Fictional category example — not a real product recommendation" },
      { id: "allocBonds", label: "2c. Bond fund — allocation %", type: "number", placeholder: "Enter percentage (0–100)", unit: "%", min: 0, max: 100, description: "Fictional category example — not a real product recommendation" },
      { id: "allocCash", label: "2d. Cash / cash equivalent — allocation %", type: "number", placeholder: "Enter percentage (0–100)", unit: "%", min: 0, max: 100, description: "Fictional category example — not a real product recommendation" },
      { id: "allocTotal", label: "2e. Total allocation (must equal 100%)", type: "calculated", description: "Sum of all four allocation percentages" },

      // --- Explanations ---
      { id: "explainRisk", label: "3. Explain how your allocation reflects the profile's risk tolerance", type: "text", placeholder: "How does your allocation match the risk level appropriate for this profile?" },
      { id: "explainTimeHorizon", label: "4. Explain how your allocation reflects the profile's time horizon", type: "text", placeholder: "How does the time horizon influence your allocation decisions?" },
      { id: "explainDiversification", label: "5. Explain how your allocation achieves diversification", type: "text", placeholder: "How does spreading the portfolio across categories reduce concentration risk?" },
      { id: "explainLiquidity", label: "6. Explain how your allocation addresses liquidity needs", type: "text", placeholder: "Can the profile access money when needed? How does your allocation account for that?" },
      { id: "explainWeakness", label: "7. Identify one possible weakness in your allocation", type: "text", placeholder: "What is one risk, limitation, or drawback of the allocation you chose?" },
    ],
    resultPrompt:
      "There is no single predetermined correct portfolio for any profile. What matters is the quality of financial reasoning. Evaluate: Did the student align the allocation with the profile's goal and time horizon? Did the student demonstrate understanding of risk — not just naming it, but showing how the allocation reflects the profile's risk tolerance? Did the student explain diversification in terms of spreading risk, not just listing categories? Did the student address whether the profile can access money when needed? Did the student identify a genuine weakness rather than a superficial one? Grade on financial reasoning, diversification, alignment with goal and time horizon, understanding of risk, and quality of explanation — not on whether the student picked a specific allocation.",
  },

  // ========================================================================
  // WORKBOOK ACTIVITY
  // ========================================================================
  workbookActivity: {
    title: "My Saving & Investing Roadmap",
    instructions:
      "Complete your Saving & Investing Roadmap using hypothetical or estimated information. Do not enter actual brokerage account numbers, retirement account numbers, passwords, investment login credentials, actual investment balances, or actual holdings. Use estimates and plans — not real financial data.",
    prompts: [
      "SHORT-TERM MONEY: Emergency savings goal",
      "SHORT-TERM MONEY: Goals within 1 year",
      "SHORT-TERM MONEY: Goals within 1–5 years",
      "SHORT-TERM MONEY: Money I may need to keep liquid",
      "LONG-TERM GOALS: Goal",
      "LONG-TERM GOALS: Target timeframe",
      "LONG-TERM GOALS: Estimated amount needed",
      "INVESTMENT DECISION QUESTIONS: What is my time horizon?",
      "INVESTMENT DECISION QUESTIONS: How much volatility could I reasonably tolerate?",
      "INVESTMENT DECISION QUESTIONS: When might I need access to this money?",
      "INVESTMENT DECISION QUESTIONS: How diversified would the investment be?",
      "INVESTMENT DECISION QUESTIONS: What fees apply?",
      "INVESTMENT DECISION QUESTIONS: Do I understand what I am buying?",
      "RETIREMENT: Does my future employer offer a retirement plan?",
      "RETIREMENT: Is there an employer match?",
      "RETIREMENT: What questions should I ask about vesting?",
      "FRAUD CHECK: Is someone promising guaranteed returns?",
      "FRAUD CHECK: Am I being pressured to act quickly?",
      "FRAUD CHECK: Can I independently verify the investment?",
      "FRAUD CHECK: Do I understand how the person promoting it is compensated?",
    ],
  },

  // ========================================================================
  // KNOWLEDGE CHECK
  // ========================================================================
  knowledgeCheck: [
    {
      id: "m5-q1",
      type: "multiple_choice",
      question: "What is the key difference between saving and investing?",
      options: [
        "Saving is for wealthy people; investing is for everyone else",
        "Saving emphasizes safety and liquidity for short-term goals; investing accepts some risk in pursuit of potential long-term growth",
        "Saving always earns more than investing",
        "There is no difference between saving and investing",
      ],
      correctAnswer: "Saving emphasizes safety and liquidity for short-term goals; investing accepts some risk in pursuit of potential long-term growth",
      explanation: "Saving prioritizes safety and access for money needed soon. Investing accepts risk in pursuit of growth for money not needed for a longer period.",
    },
    {
      id: "m5-q2",
      type: "multiple_choice",
      question: "Which statement about risk and return is most accurate?",
      options: [
        "Higher returns are always guaranteed if you take more risk",
        "Higher potential returns generally involve accepting greater uncertainty or risk",
        "Risk and return are unrelated",
        "Lower-risk investments always produce higher returns",
      ],
      correctAnswer: "Higher potential returns generally involve accepting greater uncertainty or risk",
      explanation: "There is no guarantee that taking more risk leads to higher returns. But investments that offer higher potential returns generally carry greater uncertainty and the possibility of loss.",
    },
    {
      id: "m5-q3",
      type: "scenario",
      question: "A student needs $4,000 for tuition in six months. Which factor should be especially important before exposing that money to a volatile investment?",
      options: [
        "The student's age",
        "The student's credit score",
        "Short time horizon and need for liquidity",
        "The name of the investment company",
      ],
      correctAnswer: "Short time horizon and need for liquidity",
      explanation: "Money needed in six months has a very short time horizon. A volatile investment could decline in value right before the money is needed, and liquidity ensures the money is accessible when the tuition payment is due.",
    },
    {
      id: "m5-q4",
      type: "multiple_choice",
      question: "What does liquidity refer to in the context of investing?",
      options: [
        "How much an investment has grown",
        "How easily and quickly you can access your money without significant loss of value",
        "The interest rate an investment pays",
        "The number of shares you own",
      ],
      correctAnswer: "How easily and quickly you can access your money without significant loss of value",
      explanation: "Liquidity measures how easily you can convert an investment to cash when you need it. Cash is very liquid; real estate and certain retirement accounts are generally less liquid.",
    },
    {
      id: "m5-q5",
      type: "multiple_choice",
      question: "What does owning a share of stock represent?",
      options: [
        "A loan you made to a company",
        "An ownership interest in a company",
        "A guaranteed payment from the government",
        "A type of savings account",
      ],
      correctAnswer: "An ownership interest in a company",
      explanation: "Owning stock means owning a piece of a company. The value may rise, fall, or remain flat — and a familiar company is not automatically a good investment.",
    },
    {
      id: "m5-q6",
      type: "multiple_choice",
      question: "What does buying a bond generally represent?",
      options: [
        "Owning a piece of a company",
        "Lending money to an issuer under specified terms",
        "Opening a savings account",
        "Buying insurance against loss",
      ],
      correctAnswer: "Lending money to an issuer under specified terms",
      explanation: "Buying a bond means lending money to an issuer — such as a company or government — in exchange for interest payments and repayment of principal at maturity. Bonds also carry risks, including interest-rate, credit, and inflation risk.",
    },
    {
      id: "m5-q7",
      type: "multiple_choice",
      question: "What is a key feature of a mutual fund or ETF?",
      options: [
        "It guarantees a specific return every year",
        "It is a pooled investment that can hold many securities at once",
        "It can only hold cash",
        "It is always risk-free",
      ],
      correctAnswer: "It is a pooled investment that can hold many securities at once",
      explanation: "Mutual funds and ETFs pool money from many investors to hold a collection of securities. They are not all diversified equally — fees, strategies, and holdings vary from one fund to another.",
    },
    {
      id: "m5-q8",
      type: "scenario",
      question: "A student owns only stock in one company. What major portfolio risk is present?",
      options: [
        "Liquidity risk — the stock cannot be sold",
        "Concentration risk — lack of diversification",
        "Inflation risk — the stock will lose value to inflation",
        "No risk — owning one stock is always safe",
      ],
      correctAnswer: "Concentration risk — lack of diversification",
      explanation: "When all your money is in a single investment, a decline in that investment affects your entire portfolio. Diversification — spreading investments across different assets — can reduce concentration risk, but it does not eliminate the possibility of loss.",
    },
    {
      id: "m5-q9",
      type: "multiple_choice",
      question: "How do investment fees affect long-term growth?",
      options: [
        "Fees have no impact on long-term growth",
        "Fees reduce investment returns, and even small fees can add up to a significant amount over many years",
        "Fees increase investment returns over time",
        "Fees only matter in the first year",
      ],
      correctAnswer: "Fees reduce investment returns, and even small fees can add up to a significant amount over many years",
      explanation: "Fees reduce the amount that stays invested and can grow. Over many years, even a small-sounding percentage can compound into a significant cost. But lowest fee does not automatically mean best investment — also compare strategy, risk, diversification, and objectives.",
    },
    {
      id: "m5-q10",
      type: "multiple_select",
      question: "Which of the following are warning signs of investment fraud? (Select all that apply)",
      options: [
        "Guaranteed high returns with no risk",
        "Pressure to act immediately",
        "The investment is registered with appropriate authorities and clearly explained",
        "A celebrity endorsement used as proof the investment is sound",
        "Requests to send money through unusual channels like gift cards",
      ],
      correctAnswer: ["Guaranteed high returns with no risk", "Pressure to act immediately", "A celebrity endorsement used as proof the investment is sound", "Requests to send money through unusual channels like gift cards"],
      explanation: "Guarantees of high returns with no risk, pressure to act fast, celebrity endorsements as proof, and unusual payment methods are all warning signs of fraud. A registered, clearly explained investment is a positive sign — not a red flag.",
    },
  ],

  // ========================================================================
  // REFLECTION
  // ========================================================================
  reflection: {
    prompt: "How did this module change the way you think about the difference between saving money and investing money?",
    placeholder: "Write your reflection here...",
  },

  // ========================================================================
  // ACTION COMMITMENT
  // ========================================================================
  actionCommitment: {
    prompt: "Before I invest money, I will ____________.",
    placeholder: "Complete the sentence with one action you will take before investing...",
  },

  // ========================================================================
  // RISE FINANCIAL BLUEPRINT UPDATE
  // ========================================================================
  blueprintUpdate: {
    sectionKey: "saving_investing",
    sectionTitle: "My Saving & Investing Plan",
    prompt: "Complete your Saving & Investing Plan. Use hypothetical or estimated information — not actual account numbers, balances, passwords, or login credentials. This is your personal planning tool, not a record of real investments.",
    fields: [
      { id: "emergencySavingsTarget", label: "Emergency savings target", type: "text", placeholder: "e.g., 3 months of essential expenses" },
      { id: "shortTermSavingsGoals", label: "Short-term savings goals", type: "text", placeholder: "e.g., car repair fund, apartment deposit" },
      { id: "longTermFinancialGoal", label: "Long-term financial goal", type: "text", placeholder: "e.g., begin building long-term wealth" },
      { id: "estimatedTimeHorizon", label: "Estimated time horizon", type: "text", placeholder: "e.g., 10+ years for long-term goals" },
      { id: "monthlySaveInvestAmount", label: "Amount I may be able to save/invest monthly", type: "text", placeholder: "e.g., $50–$100 per month (hypothetical)" },
      { id: "currentRiskTolerance", label: "My current hypothetical risk tolerance", type: "text", placeholder: "e.g., moderate — comfortable with some fluctuation over time" },
      { id: "liquidityNeeds", label: "Liquidity needs", type: "text", placeholder: "e.g., keep emergency fund accessible; long-term money can be less liquid" },
      { id: "diversificationRule", label: "My diversification rule", type: "text", placeholder: "e.g., never put everything into a single investment" },
      { id: "feeRule", label: "My rule for investment fees", type: "text", placeholder: "e.g., compare fees alongside strategy, risk, and objectives" },
      { id: "retirementPlanQuestions", label: "My retirement-plan questions", type: "textarea", placeholder: "e.g., Does the employer offer a plan? What is the match? What is the vesting schedule?" },
      { id: "employerMatchRule", label: "My employer-match rule", type: "text", placeholder: "e.g., contribute enough to receive the full match if one is offered" },
      { id: "scamWarningSign", label: "One investment scam warning sign I will remember", type: "text", placeholder: "e.g., guaranteed high returns with no risk" },
      { id: "verifyBeforeInvesting", label: "One thing I will verify before investing", type: "text", placeholder: "e.g., whether the person and product are registered with appropriate authorities" },
      { id: "speculativeAssetsRule", label: "My personal rule about speculative assets", type: "text", placeholder: "e.g., I will not put money I need soon into highly volatile assets" },
      { id: "reviewFrequency", label: "How often I will review my financial plan", type: "text", placeholder: "e.g., once a year or when my goals change" },
    ],
  },
};
