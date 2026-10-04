export type Program = {
  slug: string;
  name: string;
  tagline?: string;
  tag: string;
  cardDescription: string;
  overview: string;
  whoItServes: string;
  whatToExpect: string;
  features: string[];
  cardCta: string;
  pageCta: string;
  ctaHref: string;
  imageTone: "warm" | "forest" | "navy" | "clay";
  imageLabel: string;
  featured: boolean;
};

export const PROGRAMS: Program[] = [
  {
    slug: "haviy",
    name: "HAVII",
    tag: "Youth Wellness Platform",
    tagline: undefined,
    cardDescription:
      "A youth wellness and mentorship platform for ages 13–24 — supporting check-ins, journaling, goals, mentorship connections, and guided support.",
    overview:
      "HAVII is a youth wellness and mentorship platform designed for young people ages 13–24. It supports check-ins, journaling, goals, mentorship connections, guided support, and access to helpful resources.",
    whoItServes:
      "Young people ages 13–24 who are seeking wellness support, mentorship, goal-setting tools, and a supportive digital space.",
    whatToExpect:
      "A guided experience with wellness check-ins, journaling tools, goal tracking, mentorship connections, and curated resources — all within one supportive platform designed for young people.",
    features: [
      "Wellness check-ins",
      "Personal journaling tools",
      "Goal setting & tracking",
      "Mentorship connections",
      "Guided support resources",
      "Private, supportive environment",
    ],
    cardCta: "Learn About HAVII",
    pageCta: "Access the Platform",
    ctaHref: "/auth/login",
    imageTone: "navy",
    imageLabel: "HAVII platform — youth wellness and mentorship app interface",
    featured: true,
  },
  {
    slug: "tomorrow-together",
    name: "Tomorrow, Together",
    tag: "Peer Support Program",
    tagline: "One day, together.",
    cardDescription:
      "A peer-support program focused on grief, loss, isolation, and connection — helping young people process difficult experiences in a supportive, structured environment.",
    overview:
      "Tomorrow, Together is a peer-support program focused on grief, loss, isolation, and connection. It is designed to help young people process difficult experiences in a supportive, structured environment.",
    whoItServes:
      "Young people navigating grief, loss, isolation, or significant life transitions who can benefit from structured peer support.",
    whatToExpect:
      "A structured, supportive environment where young people connect with peers, process difficult experiences, and find community through guided sessions and shared reflection.",
    features: [
      "Peer support groups",
      "Guided reflection sessions",
      "Grief & loss support",
      "Connection & community",
      "Structured, safe environment",
      "Facilitated by trained staff",
    ],
    cardCta: "Explore Tomorrow, Together",
    pageCta: "Join the Program",
    ctaHref: "/get-involved",
    imageTone: "forest",
    imageLabel: "Tomorrow, Together — young people in a supportive peer group setting",
    featured: true,
  },
  {
    slug: "mentorship-leadership",
    name: "Mentorship & Leadership Programs",
    tag: "Mentorship & Leadership",
    tagline: undefined,
    cardDescription:
      "Youth mentoring, leadership development, coaching, and relationship-based support that builds confidence, skills, and lasting connections.",
    overview:
      "Our Mentorship & Leadership Programs support youth mentoring, leadership development, coaching, and relationship-based support for young people across Maryland.",
    whoItServes:
      "Young people seeking mentorship relationships, leadership development opportunities, and coaching to build confidence and skills.",
    whatToExpect:
      "One-on-one and group mentorship experiences that build confidence, relationships, leadership skills, and supportive connections over time.",
    features: [
      "One-on-one mentorship",
      "Leadership development",
      "Skills coaching",
      "Group mentoring",
      "Relationship-based support",
      "Confidence building",
    ],
    cardCta: "Learn More",
    pageCta: "Find a Mentor",
    ctaHref: "/get-involved",
    imageTone: "warm",
    imageLabel: "Mentorship & Leadership — mentor and young person working together",
    featured: true,
  },
  {
    slug: "career-readiness",
    name: "Career Readiness & Workforce Development",
    tag: "Career & Workforce",
    tagline: undefined,
    cardDescription:
      "Career exploration, workplace preparation, professional development, internships, and employment pathways for young people and emerging professionals.",
    overview:
      "Our Career Readiness & Workforce Development programs prepare young people and emerging professionals with career skills, professional development, work-based learning, and employment pathways.",
    whoItServes:
      "Young people and emerging professionals seeking career exploration, workplace preparation, and employment pathways.",
    whatToExpect:
      "Hands-on career exploration, professional development workshops, work-based learning, and pathways to employment that build real-world skills and professional confidence.",
    features: [
      "Career exploration",
      "Professional development workshops",
      "Work-based learning",
      "Internship pathways",
      "Resume & interview preparation",
      "Employment connections",
    ],
    cardCta: "Learn More",
    pageCta: "Explore Career Pathways",
    ctaHref: "/get-involved",
    imageTone: "clay",
    imageLabel: "Career Readiness — young people in a professional development workshop",
    featured: true,
  },
  {
    slug: "digital-education",
    name: "Digital Education & AI Literacy",
    tag: "Digital & AI Literacy",
    tagline: undefined,
    cardDescription:
      "Responsible technology use, digital skills, AI literacy, and practical education for young people and communities.",
    overview:
      "Our Digital Education & AI Literacy programs help young people and communities build practical digital skills and understand emerging technology responsibly.",
    whoItServes:
      "Young people and community members who want to build digital skills, understand AI, and use technology responsibly.",
    whatToExpect:
      "Practical, hands-on learning that builds digital skills, AI literacy, and responsible technology habits for school, work, and daily life.",
    features: [
      "Digital skills workshops",
      "AI literacy education",
      "Responsible technology use",
      "Hands-on learning",
      "Practical digital tools",
      "Community technology access",
    ],
    cardCta: "Build Digital Skills",
    pageCta: "Build Digital Skills",
    ctaHref: "/get-involved",
    imageTone: "navy",
    imageLabel: "Digital Education — young people learning technology skills in a classroom",
    featured: false,
  },
  {
    slug: "family-community-support",
    name: "Family & Community Support",
    tag: "Family & Community",
    tagline: undefined,
    cardDescription:
      "Family engagement, community resources, supportive programming, and community-based education for families and neighborhoods.",
    overview:
      "Our Family & Community Support programs strengthen families and communities through resources, connection, education, and community-centered programming.",
    whoItServes:
      "Families, caregivers, and community members seeking resources, connection, and supportive programming.",
    whatToExpect:
      "Community-centered programs that connect families with resources, education, and supportive relationships that strengthen neighborhoods.",
    features: [
      "Family engagement programs",
      "Community resources",
      "Supportive programming",
      "Community-based education",
      "Resource navigation",
      "Neighborhood connections",
    ],
    cardCta: "Connect with Support",
    pageCta: "Connect with Support",
    ctaHref: "/get-involved",
    imageTone: "warm",
    imageLabel: "Family & Community Support — families gathered at a community program",
    featured: false,
  },
];
