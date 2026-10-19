"use client";

import * as React from "react";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

import { cn } from "@/lib/utils";

import { mermaidLanguage } from "./mermaid-language";

/** Syntax colours tuned for the Mermaid grammar, using design-system tokens. */
const mermaidHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "var(--primary)", fontWeight: "600" },
  { tag: t.comment, color: "var(--muted-foreground)", fontStyle: "italic" },
  { tag: t.string, color: "#15803d" },
  { tag: t.number, color: "#b45309" },
  { tag: t.operator, color: "var(--foreground)" },
  { tag: t.variableName, color: "var(--foreground)" },
  { tag: t.bracket, color: "#7c3aed" },
  { tag: t.meta, color: "#7c3aed" },
]);

const editorTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "var(--editor-bg)",
      color: "var(--foreground)",
      height: "100%",
      fontSize: "13px",
    },
    ".cm-content": {
      fontFamily: "var(--font-mono)",
      padding: "10px 0 40px 0",
      caretColor: "var(--primary)",
    },
    ".cm-gutters": {
      backgroundColor: "var(--editor-gutter)",
      color: "var(--muted-foreground)",
      border: "none",
      borderRight: "1px solid var(--border)",
      paddingRight: "4px",
    },
    ".cm-lineNumbers .cm-gutterElement": { padding: "0 8px 0 12px" },
    ".cm-foldGutter .cm-gutterElement": { padding: "0 6px" },
    ".cm-activeLine": { backgroundColor: "var(--editor-line-highlight)" },
    ".cm-activeLineGutter": {
      backgroundColor: "var(--editor-line-highlight)",
      color: "var(--foreground)",
    },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
      backgroundColor: "color-mix(in srgb, var(--primary) 20%, transparent)",
    },
    ".cm-cursor": { borderLeftColor: "var(--primary)", borderLeftWidth: "2px" },
    ".cm-tooltip": {
      border: "1px solid var(--border)",
      backgroundColor: "var(--card)",
      borderRadius: "8px",
      overflow: "hidden",
    },
    ".cm-tooltip-autocomplete ul li[aria-selected]": {
      backgroundColor: "var(--accent)",
      color: "var(--accent-foreground)",
    },
    ".cm-panels": {
      backgroundColor: "var(--card)",
      color: "var(--foreground)",
      borderColor: "var(--border)",
    },
  },
  { dark: false }
);

export interface MermaidEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Imperative handle used by the toolbar for undo/redo. */
  editorRef?: React.Ref<ReactCodeMirrorRef>;
  /** Focus the editor when it mounts (editor page). */
  autoFocus?: boolean;
}

export function MermaidEditor({
  value,
  onChange,
  className,
  editorRef,
  autoFocus = false,
}: MermaidEditorProps) {
  const extensions = React.useMemo(
    () => [
      mermaidLanguage,
      syntaxHighlighting(mermaidHighlightStyle),
      EditorView.lineWrapping,
      keymap.of([indentWithTab]),
    ],
    []
  );

  return (
    <div className={cn("h-full w-full overflow-hidden", className)}>
      <CodeMirror
        ref={editorRef}
        value={value}
        onChange={onChange}
        height="100%"
        theme={editorTheme}
        extensions={extensions}
        autoFocus={autoFocus}
        indentWithTab={false}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,
          highlightSelectionMatches: true,
          searchKeymap: true,
          tabSize: 2,
        }}
        aria-label="Mermaid source code editor"
      />
    </div>
  );
}
