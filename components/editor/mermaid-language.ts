import { StreamLanguage } from "@codemirror/language";

/**
 * A lightweight Mermaid tokenizer for CodeMirror.
 *
 * Mermaid has no first-party CodeMirror language package, so we provide a
 * stream parser that highlights the parts that matter when reading a diagram:
 * comments, directives, strings, keywords and the arrow/edge operators.
 */
const KEYWORDS = new Set([
  // diagram headers
  "flowchart",
  "graph",
  "sequenceDiagram",
  "classDiagram",
  "stateDiagram",
  "stateDiagram-v2",
  "erDiagram",
  "journey",
  "gantt",
  "pie",
  "gitGraph",
  "mindmap",
  "timeline",
  "requirementDiagram",
  "sankey-beta",
  "quadrantChart",
  "xychart-beta",
  "block-beta",
  "packet-beta",
  "architecture-beta",
  "C4Context",
  "C4Container",
  // structure
  "subgraph",
  "end",
  "direction",
  "namespace",
  "state",
  "class",
  "participant",
  "actor",
  "autonumber",
  "activate",
  "deactivate",
  "loop",
  "alt",
  "else",
  "opt",
  "par",
  "and",
  "rect",
  "critical",
  "break",
  "note",
  "over",
  "of",
  "link",
  "links",
  "properties",
  "section",
  "title",
  "dateFormat",
  "axisFormat",
  "tickInterval",
  "excludes",
  "includes",
  "todayMarker",
  "commit",
  "branch",
  "checkout",
  "merge",
  "cherry-pick",
  "tag",
  "type",
  "accTitle",
  "accDescr",
  "classDef",
  "classDiagram",
  "click",
  "style",
  "linkStyle",
  "callback",
  "href",
  "call",
  "requirement",
  "functionalRequirement",
  "performanceRequirement",
  "interfaceRequirement",
  "physicalRequirement",
  "designConstraint",
  "element",
  "satisfies",
  "contains",
  "derives",
  "refines",
  "traces",
  "copies",
  "verifies",
]);

export const mermaidLanguage = StreamLanguage.define({
  name: "mermaid",
  startState: () => ({ directive: false }),
  token(stream) {
    if (stream.eatSpace()) return null;

    // %%{ init: { ... } }%% directive
    if (stream.match(/%%\{[\s\S]*?\}%%/)) return "meta";

    // %% comment to end of line
    if (stream.match(/%%[^\n]*/)) return "comment";

    // "quoted string"
    if (stream.match(/"[^"\n]*"/)) return "string";

    // edge labels |text|
    if (stream.match(/\|[^|\n]*\|/)) return "string";

    // numbers (with optional unit)
    if (stream.match(/\d+(\.\d+)?(px|%|ms|s|d|w|h|M)?/)) return "number";

    // identifiers & keywords
    if (stream.match(/[A-Za-z_][\w-]*/)) {
      const word = stream.current();
      return KEYWORDS.has(word) ? "keyword" : "variableName";
    }

    // arrows / edges / operators
    if (
      stream.match(
        /(-->|---|==>|-.->|--x|--o|\.\.|->>|-->>|->|<-|<-->|~~~|&|::|:)/,
      )
    ) {
      return "operator";
    }

    // brackets and node shapes
    if (stream.match(/[()[\]{}<>]+/)) return "bracket";

    stream.next();
    return null;
  },
});
