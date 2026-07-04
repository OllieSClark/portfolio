// Margin "plates" — a small staggered cluster of photographs hung in the
// page margin on xl+ screens, like frames on a gallery wall. Ornamental
// furniture per the paper conceit: pre-existing, not typeset; hidden below
// xl and in print.
const STAGGER = [
  "w-[70%] self-start",
  "w-[88%] self-end",
  "w-[62%] self-start",
];

export default function PlateCluster({
  numeral,
  caption,
  photos,
  className = "",
}) {
  return (
    <figure
      className={`hidden xl:flex print:hidden xl:absolute xl:right-full xl:mr-8 2xl:mr-16
        xl:w-40 2xl:w-60 flex-col gap-4 ${className}`}
    >
      {photos.map((p, i) => (
        <img
          key={p.src}
          src={p.src}
          alt={p.alt}
          loading="lazy"
          className={`${STAGGER[i % STAGGER.length]} border border-line
            grayscale-[0.15] sepia-[0.12] contrast-[0.95]`}
        />
      ))}
      <figcaption className="fig-caption mt-1 self-start">
        <span className="fig-number">Plate {numeral}.</span> {caption}
      </figcaption>
    </figure>
  );
}
