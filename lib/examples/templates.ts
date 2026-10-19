/**
 * Ready-to-use Mermaid templates. Every snippet is valid Mermaid syntax that
 * renders in the installed Mermaid version.
 */
export interface MermaidTemplate {
  id: string;
  name: string;
  description: string;
  /** Loose grouping used by the examples gallery. */
  category: "Flow" | "Data" | "Sequence" | "Structure" | "Planning";
  code: string;
}

export const DEFAULT_SOURCE = `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Ship it]
    B -->|No| D[Debug]
    D --> B`;

export const TEMPLATES: MermaidTemplate[] = [
  {
    id: "basic-flowchart",
    name: "Basic Flowchart",
    description: "The classic start → decide → ship loop.",
    category: "Flow",
    code: DEFAULT_SOURCE,
  },
  {
    id: "auth-flow",
    name: "User Authentication Flow",
    description: "Sign-in with token issue, refresh and lockout paths.",
    category: "Flow",
    code: `flowchart TD
    A([User opens app]) --> B{Has session?}
    B -- Yes --> C[Validate token]
    B -- No --> D[/Enter credentials/]
    C --> E{Token valid?}
    E -- Yes --> F([Load dashboard])
    E -- No --> D
    D --> G{Verify password}
    G -- Fail --> H[Increment attempt count]
    H --> I{Attempts >= 5?}
    I -- Yes --> J([Account locked])
    I -- No --> D
    G -- Pass --> K[Issue access + refresh token]
    K --> F`,
  },
  {
    id: "api-sequence",
    name: "API Request Sequence",
    description: "Client, gateway, service and database interaction.",
    category: "Sequence",
    code: `sequenceDiagram
    autonumber
    participant C as Client
    participant G as API Gateway
    participant S as Orders Service
    participant D as PostgreSQL
    C->>G: POST /api/orders
    G->>G: Validate JWT
    G->>S: Forward request
    S->>D: BEGIN
    S->>D: INSERT INTO orders (...)
    D-->>S: order_id
    S->>D: COMMIT
    S-->>G: 201 Created
    G-->>C: { id, status: "pending" }`,
  },
  {
    id: "database-er",
    name: "Database ER Diagram",
    description: "Users, orders and products with relationships.",
    category: "Data",
    code: `erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "appears in"
    USER {
        uuid id PK
        string email UK
        string full_name
        timestamp created_at
    }
    ORDER {
        uuid id PK
        uuid user_id FK
        string status
        numeric total
    }
    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
    }
    PRODUCT {
        uuid id PK
        string sku UK
        string name
        numeric price
    }`,
  },
  {
    id: "class-diagram",
    name: "Software Class Diagram",
    description: "Domain model for a small diagram service.",
    category: "Structure",
    code: `classDiagram
    direction LR
    class Diagram {
        +String id
        +String source
        +DiagramType type
        +render() Svg
        +export(Format) Blob
    }
    class Editor {
        +String buffer
        +update(String code) void
        +undo() void
    }
    class Exporter {
        +toSvg() Blob
        +toPng(scale) Blob
        +toPdf() Blob
    }
    class Theme {
        +String name
        +Map~String, String~ variables
    }
    Editor --> Diagram : renders
    Diagram --> Exporter : uses
    Diagram --> Theme : styled by`,
  },
  {
    id: "roadmap-gantt",
    name: "Project Roadmap",
    description: "A seven-week delivery plan as a Gantt chart.",
    category: "Planning",
    code: `gantt
    title Delivery Roadmap
    dateFormat YYYY-MM-DD
    axisFormat %b %d
    section Discovery
    Requirements        :done,    d1, 2025-01-06, 5d
    Design system       :done,    d2, after d1, 4d
    section Build
    Editor + renderer   :active,  b1, after d2, 7d
    Canvas + exports    :         b2, after b1, 6d
    section Launch
    QA and hardening    :         l1, after b2, 4d
    Release             :milestone, m1, after l1, 0d`,
  },
  {
    id: "state-machine",
    name: "State Machine",
    description: "Editor lifecycle with a render queue.",
    category: "Structure",
    code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Editing : keystroke
    Editing --> Idle : idle for 400ms
    Idle --> Rendering : source changed
    Rendering --> Success : parse ok
    Rendering --> Error : parse failed
    Error --> Rendering : source fixed
    Success --> Rendering : source changed
    Success --> [*] : export`,
  },
  {
    id: "git-branching",
    name: "Git Branching",
    description: "Feature branch merged back to main.",
    category: "Flow",
    code: `gitGraph
    commit id: "init"
    commit id: "feat: design tokens"
    branch feature/exports
    checkout feature/exports
    commit id: "feat: png export"
    commit id: "feat: pdf export"
    checkout main
    merge feature/exports tag: "v0.2.0"
    commit id: "chore: release"`,
  },
  {
    id: "mindmap",
    name: "Mindmap",
    description: "Product structure as a mindmap.",
    category: "Structure",
    code: `mindmap
  root((Mermaid Studio))
    Editor
      Syntax highlighting
      Debounced render
      Error hints
    Canvas
      Zoom and pan
      Fit to screen
      Backgrounds
    Export
      SVG
      PNG
      PDF
      Source .mmd`,
  },
  {
    id: "system-architecture",
    name: "System Architecture",
    description: "Browser, edge and data tiers with a cache.",
    category: "Structure",
    code: `flowchart LR
    subgraph Client
        UI[Next.js App Router]
        Store[Zustand store]
    end
    subgraph Edge
        CDN[CDN / Edge cache]
    end
    subgraph Services
        API[Export API]
        Worker[Render worker]
    end
    subgraph Data
        Redis[(Redis)]
        PG[(PostgreSQL)]
    end
    UI --> Store
    UI --> CDN
    CDN --> API
    API --> Redis
    API --> PG
    API --> Worker
    Worker --> PG`,
  },
  {
    id: "user-journey",
    name: "User Journey",
    description: "First-run experience, scored step by step.",
    category: "Planning",
    code: `journey
    title First diagram in under a minute
    section Land
      Open the site: 5: User
      Read the hero: 4: User
    section Create
      Paste Mermaid code: 5: User
      Watch it render: 5: User
      Pick a theme: 4: User
    section Ship
      Open export dialog: 4: User
      Download SVG: 5: User`,
  },
  {
    id: "pie-chart",
    name: "Pie Chart",
    description: "A simple distribution chart.",
    category: "Data",
    code: `pie showData
    title Export format mix
    "SVG" : 42
    "PNG" : 33
    "PDF" : 15
    "Source" : 10`,
  },
];

export function getTemplate(id: string): MermaidTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
