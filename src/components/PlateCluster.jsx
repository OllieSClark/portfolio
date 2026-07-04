import { useEffect, useRef, useState } from "react";

// Margin "plates" — photographs hung in the page furniture. xl+: a small
// staggered gallery cluster in the margin, like frames on a wall. Below xl,
// where there is no margin to hang them in, they become a compact horizontal
// strip in the normal document flow instead of disappearing outright.
const STAGGER = [
  "w-[70%] self-start",
  "w-[88%] self-end",
  "w-[62%] self-start",
];

const PLATE_FX = "border border-line grayscale-[0.15] sepia-[0.12] contrast-[0.95]";

// Each plate reveals itself independently on scroll-in, staggered left to
// right by index — a slide-and-fade rather than everything landing at once.
// The site-wide reduced-motion override collapses the transition to instant.
function RevealImg({ src, alt, className, delayMs }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading="lazy"
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition duration-700 ease-out
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}
        ${className}`}
    />
  );
}

export default function PlateCluster({
  numeral,
  caption,
  photos,
  className = "",
}) {
  return (
    <>
      {/* xl+: staggered margin gallery */}
      <figure
        className={`hidden xl:flex print:hidden xl:absolute xl:right-full xl:mr-8 2xl:mr-16
          xl:w-40 2xl:w-60 flex-col gap-4 ${className}`}
      >
        {photos.map((p, i) => (
          <RevealImg
            key={p.src}
            src={p.src}
            alt={p.alt}
            delayMs={i * 150}
            className={`${STAGGER[i % STAGGER.length]} ${PLATE_FX}`}
          />
        ))}
        <figcaption className="fig-caption mt-1 self-start">
          <span className="fig-number">Plate {numeral}.</span> {caption}
        </figcaption>
      </figure>

      {/* below xl: a compact strip, back in the normal flow */}
      <figure className="xl:hidden print:hidden my-8">
        <div className="flex gap-2 sm:gap-3">
          {photos.map((p, i) => (
            <RevealImg
              key={p.src}
              src={p.src}
              alt={p.alt}
              delayMs={i * 150}
              className={`w-1/3 aspect-square object-cover ${PLATE_FX}`}
            />
          ))}
        </div>
        <figcaption className="fig-caption mt-2">
          <span className="fig-number">Plate {numeral}.</span> {caption}
        </figcaption>
      </figure>
    </>
  );
}
