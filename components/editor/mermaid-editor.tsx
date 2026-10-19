"use client";

import * as React from "react";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

import { cn } from "@/lib/utils";

import { mermaidLanguage } from "./mermaid-language";

/**
 * Syntax colours are driven by design tokens so the editor follows the theme:
 * a lime signal on the deep green-black dark mode, olive-on-paper in light.
 */
const mermaidHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "var(--syn-keyword)", fontWeight: "600" },
  { tag: t.comment, color: "var(--syn-comment)", fontStyle: "italic" },
  { tag: t.string, color: "var(--syn-string)" },
  { tag: t.number, color: "var(--syn-number)" },
  { tag: t.operator, color: "var(--syn-operator)" },
  { tag: t.variableName, color: "var(--syn-operator)" },
  { tag: t.bracket, color: "var(--syn-bracket)" },
  { tag: t.meta, color: "var(--syn-meta)" },
]);

const editorTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "var(--editor-bg)",
      color: "var(--foreground)",
      height: "100%",
      fontSize: "12.5px",
    },
    ".cm-content": {
      fontFamily: "var(--font-mono)",
      padding: "14px 0 40px 0",
      caretColor: "var(--caret)",
    },
    ".cm-gutters": {
      backgroundColor: "var(--editor-gutter)",
      color: "var(--muted-foreground)",
      border: "none",
      borderRight: "1px solid var(--border)",
      paddingRight: "4px",
    },
    ".cm-lineNumbers .cm-gutterElement": { padding: "0 10px 0 14px" },
    ".cm-foldGutter .cm-gutterElement": { padding: "0 6px" },
    ".cm-activeLine": { backgroundColor: "var(--editor-line-highlight)" },
    ".cm-activeLineGutter": {
      backgroundColor: "var(--editor-line-highlight)",
      color: "var(--foreground)",
    },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
      backgroundColor: "color-mix(in srgb, var(--primary) 45%, transparent)",
    },
    ".cm-cursor": { borderLeftColor: "var(--caret)", borderLeftWidth: "2px" },
    ".cm-tooltip": {
      border: "1px solid var(--border)",
      backgroundColor: "var(--card)",
      borderRadius: "6px",
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
