"use client";

import * as React from "react";
import { Info, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_SETTINGS,
  DIAGRAM_FONT_STACK,
  MERMAID_THEMES,
  PRESETS,
} from "@/lib/mermaid/config";
import { useDiagramStore } from "@/lib/store/use-diagram-store";
import { clearDraft } from "@/lib/storage/draft";
import { cn } from "@/lib/utils";
import type { CanvasBackground, MermaidTheme } from "@/types/diagram";

export interface DiagramSettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FONT_OPTIONS = [
  { value: DIAGRAM_FONT_STACK, label: "Inter / system sans" },
  {
    value: '"Georgia", "Times New Roman", serif',
    label: "Serif",
  },
  {
    value: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
    label: "Monospace",
  },
];

const BACKGROUND_OPTIONS: { value: CanvasBackground; label: string }[] = [
  { value: "grid", label: "Grid" },
  { value: "white", label: "White" },
  { value: "transparent", label: "Transparent" },
];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const safeValue = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value) ? value : "#000000";
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="text-xs font-normal text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <span className="font-mono text-2xs uppercase text-muted-foreground">
          {value}
        </span>
        <input
          type="color"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="h-7 w-9 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
        />
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 border-b border-border px-5 py-4 last:border-b-0">
      <h3 className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function DiagramSettingsPanel({
  open,
  onOpenChange,
}: DiagramSettingsPanelProps) {
  const settings = useDiagramStore((s) => s.settings);
  const updateSettings = useDiagramStore((s) => s.updateSettings);
  const updateThemeVariables = useDiagramStore((s) => s.updateThemeVariables);
  const applyPreset = useDiagramStore((s) => s.applyPreset);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle>Appearance</SheetTitle>
          <SheetDescription>
            Tune the diagram and canvas. Changes render live.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <Section title="Presets">
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset) => {
                const active = settings.presetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-colors",
                      active
                        ? "border-primary bg-accent"
                        : "border-border bg-card hover:bg-secondary"
                    )}
                  >
                    <span className="block text-sm font-medium">{preset.name}</span>
                    <span className="mt-0.5 block text-2xs leading-snug text-muted-foreground">
                      {preset.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Theme">
            <div className="space-y-2">
              <Label htmlFor="mermaid-theme" className="text-xs font-normal text-muted-foreground">
                Mermaid theme
              </Label>
              <Select
                value={settings.theme}
                onValueChange={(value) =>
                  updateSettings({ theme: value as MermaidTheme })
                }
              >
                <SelectTrigger id="mermaid-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MERMAID_THEMES.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-family" className="text-xs font-normal text-muted-foreground">
                Font family
              </Label>
              <Select
                value={settings.fontFamily}
                onValueChange={(value) => updateSettings({ fontFamily: value })}
              >
                <SelectTrigger id="font-family">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((option) => (
                    <SelectItem key={option.label} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-normal text-muted-foreground">
                  Font size
                </Label>
                <span className="font-mono text-2xs text-muted-foreground">
                  {settings.fontSize}px
                </span>
              </div>
              <Slider
                value={[settings.fontSize]}
                min={10}
                max={24}
                step={1}
                onValueChange={([value]) => updateSettings({ fontSize: value })}
                aria-label="Diagram font size"
              />
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-normal text-muted-foreground">
                  Diagram padding
                </Label>
                <span className="font-mono text-2xs text-muted-foreground">
                  {settings.padding}px
                </span>
              </div>
              <Slider
                value={[settings.padding]}
                min={0}
                max={48}
                step={2}
                onValueChange={([value]) => updateSettings({ padding: value })}
                aria-label="Diagram padding"
              />
            </div>
          </Section>

          <Section title="Theme variables">
            <div className="space-y-3">
              <ColorField
                label="Primary fill"
                value={settings.themeVariables.primaryColor ?? "#eef4ff"}
                onChange={(value) => updateThemeVariables({ primaryColor: value })}
              />
              <ColorField
                label="Primary text"
                value={settings.themeVariables.primaryTextColor ?? "#111318"}
                onChange={(value) =>
                  updateThemeVariables({ primaryTextColor: value })
                }
              />
              <ColorField
                label="Primary border"
                value={settings.themeVariables.primaryBorderColor ?? "#2563ff"}
                onChange={(value) =>
                  updateThemeVariables({ primaryBorderColor: value })
                }
              />
              <ColorField
                label="Lines & arrows"
                value={settings.themeVariables.lineColor ?? "#2563ff"}
                onChange={(value) => updateThemeVariables({ lineColor: value })}
              />
            </div>
          </Section>

          <Section title="Canvas">
            <div className="space-y-2">
              <Label htmlFor="canvas-bg" className="text-xs font-normal text-muted-foreground">
                Background
              </Label>
              <Select
                value={settings.canvasBackground}
                onValueChange={(value) =>
                  updateSettings({
                    canvasBackground: value as CanvasBackground,
                    showGrid: value === "grid",
                  })
                }
              >
                <SelectTrigger id="canvas-bg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BACKGROUND_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Label htmlFor="show-grid" className="text-xs font-normal text-muted-foreground">
                Show grid dots
              </Label>
              <Switch
                id="show-grid"
                checked={settings.showGrid}
                onCheckedChange={(checked) => updateSettings({ showGrid: checked })}
              />
            </div>
          </Section>

          <Section title="Export defaults">
            <div className="space-y-2">
              <Label htmlFor="export-bg" className="text-xs font-normal text-muted-foreground">
                Export background
              </Label>
              <Select
                value={settings.exportBackground}
                onValueChange={(value) =>
                  updateSettings({
                    exportBackground: value as "white" | "transparent" | "dark",
                  })
                }
              >
                <SelectTrigger id="export-bg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="transparent">Transparent</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Section>

          <div className="flex items-start gap-2 px-5 py-4 text-2xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>
              Mermaid themes and theme variables apply differently per diagram
              type — some types (e.g. Gantt, Pie) honour a smaller subset of
              these values.
            </p>
          </div>
        </ScrollArea>

        <div className="space-y-2 border-t border-border p-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5"
            onClick={() => {
              updateSettings({ ...DEFAULT_SETTINGS });
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reset appearance
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => {
              clearDraft();
              toast.success("Saved draft cleared from this browser.");
            }}
          >
            Clear saved draft
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
