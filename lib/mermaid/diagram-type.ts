/**
 * Map Mermaid's internal diagram-type identifiers to friendly labels.
 * Mermaid's `detectType` returns short ids such as `flowchart-v2` or `gitGraph`.
 */
const TYPE_LABELS: Record<string, string> = {
  flowchart: "Flowchart",
  "flowchart-v2": "Flowchart",
  graph: "Flowchart",
  sequence: "Sequence Diagram",
  "sequenceDiagram": "Sequence Diagram",
  class: "Class Diagram",
  "classDiagram": "Class Diagram",
  "classDiagram-v2": "Class Diagram",
  state: "State Diagram",
  "stateDiagram": "State Diagram",
  "stateDiagram-v2": "State Diagram",
  er: "Entity Relationship",
  "erDiagram": "Entity Relationship",
  journey: "User Journey",
  "journeyDiagram": "User Journey",
  gantt: "Gantt Chart",
  pie: "Pie Chart",
  "pieDiagram": "Pie Chart",
  gitGraph: "Git Graph",
  mindmap: "Mindmap",
  timeline: "Timeline",
  requirement: "Requirement Diagram",
  "requirementDiagram": "Requirement Diagram",
  c4: "C4 Diagram",
  sankey: "Sankey Diagram",
  quadrantChart: "Quadrant Chart",
  xychart: "XY Chart",
  block: "Block Diagram",
  packet: "Packet Diagram",
  architecture: "Architecture",
  radar: "Radar Chart",
  kanban: "Kanban",
};

/** Human-readable label for a Mermaid diagram-type id. */
export function diagramTypeLabel(type: string | undefined): string {
  if (!type) return "Unknown";
  return TYPE_LABELS[type] ?? type.charAt(0).toUpperCase() + type.slice(1);
}

/** The Mermaid keyword that starts a given diagram type, used for file names. */
export function diagramTypeSlug(type: string | undefined): string {
  if (!type) return "diagram";
  const slug = type
    .replace(/Diagram$/i, "")
    .replace(/-v2$/i, "")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
  return slug || "diagram";
}
