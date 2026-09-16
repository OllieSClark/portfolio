// Verified against arXiv/SIAM/PMLR/T&F listings — keep fields conservative;
// don't add page/volume detail beyond what was checked.
//
// Ordered alphabetically by first author's surname, the standard for an
// author–date reference list, and numbered to match. Citation numbers in the
// prose therefore don't ascend in reading order — that's correct, not a bug.
// Adding an entry renumbers the ones after it: the cite(n) calls in paper.jsx
// and the hard-coded pair in CompileFooter.jsx have to move with it.
const references = [
  {
    id: 1,
    authors: "Anthropic",
    year: 2026,
    title: "Claude (Fable 5) [Large language model]",
    venue: "Used in the design and construction of this site",
    url: "https://claude.ai",
  },
  {
    id: 2,
    authors: "Clark, O.",
    year: 2026,
    title: "brglm2, feat/trust-region: a trust-region fitting engine for bias-reduced GLMs",
    venue: "Software fork of ikosmidis/brglm2",
    url: "https://github.com/OllieSClark/brglm2",
  },
  {
    id: 3,
    authors:
      "Corenflos, A., Zhao, Z., Schön, T. B., Särkkä, S., and Sjölund, J.",
    year: 2025,
    title: "Conditioning diffusion models by explicit forward-backward bridging",
    venue: "Proceedings of AISTATS 2025, PMLR 258",
    url: "https://arxiv.org/abs/2405.13794",
  },
  {
    id: 4,
    authors: "Jin, C. and Agarwal, A.",
    year: 2025,
    title:
      "Forecasting implied volatility surface with generative diffusion models",
    venue: "arXiv:2511.07571",
    url: "https://arxiv.org/abs/2511.07571",
  },
  {
    id: 5,
    authors: "Kosmidis, I., Kenne Pagui, E. C., and Sartori, N.",
    year: 2020,
    title: "Mean and median bias reduction in generalized linear models",
    venue: "Statistics and Computing, 30, 43–59",
    url: "https://arxiv.org/abs/1804.04085",
  },
  {
    id: 6,
    authors: "Steihaug, T.",
    year: 1983,
    title:
      "The conjugate gradient method and trust regions in large scale optimization",
    venue: "SIAM Journal on Numerical Analysis, 20(3), 626–637",
    url: "https://epubs.siam.org/doi/10.1137/0720042",
  },
];

export default references;
