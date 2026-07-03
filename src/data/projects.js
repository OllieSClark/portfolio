const projects = [
  {
    tag: "shipped — third-year individual project",
    title: "brglm2: a trust-region fitting engine for bias-reduced GLMs",
    period: "CS350, Grade 1 (89% final report & viva)",
    description:
      "Forked brglm2 (the standard R package for bias-reduction in GLMs) and replaced its default quasi-Fisher scoring fit routine with a trust-region framework built from scratch: a CG-Steihaug subproblem solver with Jacobi preconditioning, adaptive hat-value scheduling, sparse Cholesky dispatch, and a vectorised rewrite of the median bias-reduction adjustment. Bias-reduced GLM estimation is needed most exactly where it's most expensive — high-dimensional, separated, or sparse data — so a method that doesn't scale is unusable in the regime it was built for.",
    meta: [
      "Numerical optimisation",
      "R",
      "Statistical computing",
      "Performance engineering",
    ],
    link: "https://github.com/OllieSClark/brglm2",
    benchmark: true,
  },
  {
    tag: "current — internship",
    title: "Software Engineering Intern, BNY",
    period: "8 June 2026 – mid-August 2026 (in progress)",
    description:
      "Working in the Foundations team on workflow orchestration and diagnostics tooling built around AI agents. Full write-up to follow once the internship concludes and disclosure limits are confirmed.",
    meta: [
      "Software engineering",
      "Workflow orchestration",
      "Applied AI agents",
    ],
    link: null,
  },
  {
    tag: "competition",
    title: "WorldQuant BRAIN — International Quant Championship, Finalist",
    period: "2025/26",
    description:
      "Designed and backtested alpha signals on WorldQuant's BRAIN platform, progressing to the IQC final round. Focus on signal construction, turnover/decay trade-offs, and robustness across simulation regimes.",
    meta: ["Alpha research", "Signal design", "Backtesting"],
    link: null,
  },
  {
    tag: "upcoming — starting July 2026",
    title: "Diffusion models for implied volatility surfaces (dissertation)",
    period: "MDatSci final year, July 2026 – May 2027",
    description:
      "Investigating whether diffusion models' better-calibrated implied volatility surfaces translate into a measurable options-hedging edge over GAN-based approaches — extending very recent (2025) exact-conditional diffusion methodology to a live financial dataset. Supervised by Prof. Paul Jenkins, Department of Statistics, University of Warwick.",
    meta: ["Generative modelling", "Stochastic calculus", "Warwick Statistics"],
    link: null,
  },
];

export default projects;
