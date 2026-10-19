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
    <section id="diagram-types" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Every diagram Mermaid supports
          </h2>
          <p className="mt-3 text-muted-foreground">
            The editor renders whatever the installed Mermaid version supports —
            here are the types you are most likely to reach for.
          </p>
        </div>

        <ul className="mt-8 flex flex-wrap gap-2">
          {DIAGRAM_TYPES.map((type) => (
            <li
              key={type}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground shadow-subtle"
            >
              {type}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
