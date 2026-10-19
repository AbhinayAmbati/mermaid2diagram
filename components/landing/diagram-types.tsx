const DIAGRAM_TYPES = [
  "Flowchart",
  "Sequence Diagram",
  "Class Diagram",
  "State Diagram",
  "Entity Relationship",
  "User Journey",
  "Gantt Chart",
  "Pie Chart",
  "Git Graph",
  "Mindmap",
  "Timeline",
  "Requirement Diagram",
  "Quadrant Chart",
  "Block Diagram",
];

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
            The editor renders whatever the installed Mermaid version supports —
            here are the types you are most likely to reach for.
          </p>
        </div>

        <ul className="mt-10 flex flex-wrap gap-2">
          {DIAGRAM_TYPES.map((type) => (
            <li
              key={type}
              className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-foreground"
            >
              <span className="h-1 w-1 rounded-full bg-primary" />
              {type}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
