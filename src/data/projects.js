// Manuscript-status taxonomy: every entry maps to a publication lifecycle
// stage — published / in progress / presented / in preparation.
const projects = [
  {
    id: "brglm2",
    tag: "published: third-year individual project",
    title: "brglm2: a trust-region fitting engine for bias-reduced GLMs",
    period: "CS350, Grade 1 (89% final report & viva)",
    meta: [
      "Numerical optimisation",
      "R",
      "Statistical computing",
      "Performance engineering",
    ],
    link: "https://github.com/OllieSClark/brglm2",
    report: "/brglm2-report.pdf",
    benchmark: true,
  },
  {
    id: "bny",
    tag: "in progress: internship",
    title: "Software Engineering Intern, BNY",
    period: "8 June 2026 – mid-August 2026",
    meta: [
      "Software engineering",
      "Workflow orchestration",
      "Applied AI agents",
    ],
    link: null,
  },
  {
    id: "wq",
    tag: "presented: competition finalist",
    title: "WorldQuant BRAIN: International Quant Championship, Finalist",
    period: "2025/26",
    meta: ["Alpha research", "Signal design", "Backtesting"],
    link: null,
  },
  {
    id: "diss",
    tag: "in preparation: dissertation",
    title: "Diffusion models for implied volatility surfaces",
    period: "MDatSci final year, July 2026 – May 2027",
    meta: ["Generative modelling", "Stochastic calculus", "Warwick Statistics"],
    link: null,
  },
];

export default projects;
