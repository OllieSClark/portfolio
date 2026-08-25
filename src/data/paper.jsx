import { t, typo, swap, cite, pause, mark } from "../typeset/engine";
import Claim from "../components/Claim";

// All typed prose lives here as typeset scripts. Static furniture (section
// labels, project titles/meta) stays in the components — the conceit is that
// the outline exists and the prose is being written into it.

// spans, not <p>: this JSX also renders inline inside typed paragraphs (the
// Claim tap-fallback), and a <p> inside a <p> is invalid HTML
const speedupEvidence = (
  <>
    <span className="block font-mono text-ink">31.65x&ndash;168.6x speedup</span>
    <span className="block mt-1 text-ink-dim">
      across dense and sparse benchmark scenarios, coefficient agreement
      &lt;10&#8315;&#8310; vs. the original package, 394/394 tests passing. See
      Fig. 2 and Table 2, &sect;2.1.
    </span>
  </>
);

export const heroTitle = [
  t("Evidence, not assertion", { cps: 34 }),
  mark("hero-title-done"),
];

export const heroAbstract = [
  t("Data science ", { cps: 95 }),
  typo("studnet", "student"),
  t(
    " at Warwick specialising in quantitative finance, the intersection of statistical rigour (GLMs, mathematical finance) and modern ML (neural networks, optimisation). Most recent work: a from-scratch trust-region optimiser that made bias-reduced GLM fitting",
    { cps: 95 }
  ),
  swap(" much faster", "up to 168.6× faster", {
    wrap: (txt) => <Claim evidence={speedupEvidence}>{txt}</Claim>,
  }),
  cite(1),
  t("."),
];

export const introduction = [
  mark("sec-intro"),
  t(
    "MDatSci (Data Science) student at Warwick, three years into a degree built around exactly the join between statistics and machine learning: probability and mathematical statistics, then modern ML, neural computing, and mathematical finance. I'm drawn to the problems that sit in that overlap — GLMs give valid, interpretable inference; ML predicts better when the true relationship won't fit a closed form; quantitative finance runs on both.",
    { cps: 100 }
  ),
  mark("intro-done"),
];

export const projectScripts = {
  brglm2: [
    mark("sec-results"),
    t(
      "GLMs give valid, interpretable inference — the tradeoff is a fitting routine that doesn't scale. Forked brglm2 (the standard R package for bias-reduction in GLMs) and replaced its default quasi-Fisher scoring fit routine with a trust-region framework built from scratch: a CG-Steihaug subproblem solver",
      { cps: 130 }
    ),
    cite(2),
    mark("r2"),
    t(
      " with Jacobi preconditioning, adaptive hat-value scheduling, sparse Cholesky dispatch, and a vectorised rewrite of the median bias-reduction adjustment. Bias-reduced estimation is needed most exactly where it is most expensive: high-dimensional, separated, or sparse data. A method that doesn't scale is unusable in the regime it was built for. Full implementation public",
      { cps: 130 }
    ),
    cite(6),
    t("."),
  ],
  bny: [
    mark("sec-bny"),
    t(
      "Interned on the Foundations team, building AI-powered diagnostics into a Camunda-based workflow orchestration platform, spanning both design-time and deployed-time tooling.",
      { cps: 120 }
    ),
  ],
  bnyDesignTime: [
    t(
      "At design-time: a suite of diagnostic agents performing structural and execution analysis on process models within a sandboxed environment, paired with an interactive copilot for exploring findings, staging AI-generated fixes, and iterating on the model. Shipped to QA, where I gathered real feedback from teams building on the platform.",
      { cps: 120 }
    ),
  ],
  bnyDeployment: [
    t(
      "At deployment: a multi-step reasoning agent that routes through a backend I built as an MCP server, streaming over websockets to fetch live process data and support power-user features — slash-command skills, @-context injection. Owned the AI-centric backend, all model connectivity, plus the front-end integration work to surface it, and picked up the Camunda spec along the way to build workflows that actually held up.",
      { cps: 120 }
    ),
  ],
  bnyDemos: [
    t("Delivered 8+ demos over the internship, including to ", { cps: 120 }),
    typo("seniro", "senior"),
    t(
      " leadership, and presented as part of the Foundations showcase series to an audience of 80+.",
      { cps: 120 }
    ),
  ],
  wq: [
    mark("sec-wq"),
    t(
      "Designed and backtested alpha signals on WorldQuant's BRAIN platform",
      { cps: 120 }
    ),
    swap(", and did well", ", progressing to the final round of the International Quant Championship"),
    mark("wq-note"),
    t(
      ". Focus on signal construction, turnover/decay trade-offs, and robustness across simulation regimes.",
      { cps: 120 }
    ),
  ],
  diss: [
    mark("sec-diss"),
    t("Upcoming (starts July 2026): investigating whether diffusion models'", {
      cps: 130,
    }),
    cite(3),
    t(" better-calibrated implied ", { cps: 130 }),
    typo("volitility", "volatility"),
    t(
      " surfaces translate into a measurable options-hedging edge over GAN-based approaches",
      { cps: 130 }
    ),
    cite(5),
    t(
      ", extending very recent exact-conditional diffusion methodology",
      { cps: 130 }
    ),
    cite(4),
    t(
      " to a live financial dataset. Supervised by Prof. Paul Jenkins, Department of Statistics, University of Warwick.",
      { cps: 130 }
    ),
  ],
};

export const brglm2Result = [
  t("Result: "),
  t("31.65x–168.6x speedup", {
    wrap: (txt) => <Claim evidence={speedupEvidence}>{txt}</Claim>,
  }),
  t(
    " across dense and sparse scenarios, coefficient agreement <10⁻⁶ against the original package, with the existing 394-test suite green.",
    { cps: 110 }
  ),
  pause(150),
];

export const acknowledgements = [
  t(
    "The dissertation project is supervised by Prof. Paul Jenkins, Department of Statistics, University of Warwick. The brglm2 work builds on Ioannis Kosmidis' package and would be nothing without a mature test suite to answer to.",
    { cps: 120 }
  ),
];

export const correspondenceHead = [
  mark("sec-contact"),
  t("Let's talk about the work.", { cps: 40 }),
];

export const correspondenceBody = [
  t(
    "Open to quant research conversations for autumn 2026. The fastest way to reach me is email. CV below.",
    { cps: 130 }
  ),
];
