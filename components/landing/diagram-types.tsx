const ROW_ONE = [
  "Flowchart",
  "Sequence Diagram",
  "Class Diagram",
  "State Diagram",
  "Entity Relationship",
  "User Journey",
  "Gantt Chart",
];

const ROW_TWO = [
  "Pie Chart",
  "Git Graph",
  "Mindmap",
  "Timeline",
  "Requirement Diagram",
  "Quadrant Chart",
  "Block Diagram",
];

/**
 * Number of copies of the list rendered into one track.
 *
 * For a seamless loop the track must still cover the viewport after it has
 * travelled one copy's width, which needs `(COPIES - 1) * copyWidth >= viewport`.
 * One copy of seven chips is slightly narrower than the container, so two
 * copies leave a visible gap at the end of each cycle. Four gives plenty of
 * headroom across font sizes and zoom levels, and the track travels a quarter
 * of its own width so the perceived speed is unchanged.
 */
const COPIES = 4;

function TypeChip({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-border bg-card px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
      <span className="h-1 w-1 rounded-full bg-primary" />
      {label}
    </span>
  );
}

/**
 * One marquee lane. The track holds several identical copies of the list, so
 * translating it by exactly one copy's width loops without a seam. Every copy
 * after the first is hidden when the user prefers reduced motion.
 */
function MarqueeLane({
  items,
  direction,
}: {
  items: string[];
  direction: "left" | "right";
}) {
  return (
    <div className="marquee-row marquee-fade overflow-hidden py-1">
      <div
        className={
          direction === "left" ? "marquee-track marquee-left" : "marquee-track marquee-right"
        }
      >
        {Array.from({ length: COPIES }, (_, copy) => (
          <div
            key={copy}
            aria-hidden={copy > 0}
            className={
              copy > 0
                ? "marquee-duplicate flex shrink-0 items-center gap-3 pr-3"
                : "flex shrink-0 items-center gap-3 pr-3"
            }
          >
            {items.map((type) => (
              <TypeChip key={type} label={type} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiagramTypes() {
  return (
    <section id="diagram-types" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[1320px]">
        <div className="max-w-2xl">
          <span className="label-mono text-muted-foreground">04 / Coverage</span>
          <h2 className="mt-4 text-[1.75rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.25rem]">
            Every diagram Mermaid supports
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The editor renders whatever the installed Mermaid version supports.
            Here are the types you are most likely to reach for.
          </p>
        </div>

        {/* Two lanes drifting in opposite directions, held to the page width */}
        <div className="mt-12 space-y-4">
          <MarqueeLane items={ROW_ONE} direction="left" />
          <MarqueeLane items={ROW_TWO} direction="right" />
        </div>
      </div>
    </section>
  );
}
