import { BlueprintPanel } from "./blueprint-panel";

/**
 * The "engine" section, mirroring the reference's split layout: a large
 * two-tone statement on the left, a dark full-bleed technical panel on the
 * right.
 */
export function BlueprintSection() {
  return (
    <section id="engine" className="px-4 py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative lg:pr-8">
          <span className="label-mono absolute -left-0 top-1 text-muted-foreground lg:-left-6">
            02
          </span>
          <h2 className="text-[1.75rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.25rem]">
            One engine, every diagram type
          </h2>

          <p className="mt-8 text-[1.75rem] font-medium leading-[1.25] tracking-[-0.02em] text-foreground sm:text-[2.125rem]">
            Start with the diagram you need today and expand as your architecture
            grows.
            <span className="text-muted-foreground/45">
              {" "}
              Flowcharts, sequence, class, state, ER, Gantt, Git graphs,
              mindmaps, timelines and more, rendered live, with no build step
              and nothing sent to a server.
            </span>
          </p>
        </div>

        <div className="chamfer-lg-tl-bl overflow-hidden lg:-mr-4">
          <BlueprintPanel />
        </div>
      </div>
    </section>
  );
}
