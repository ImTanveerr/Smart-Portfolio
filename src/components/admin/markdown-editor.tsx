"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import "@uiw/react-md-editor/markdown-editor.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export function MarkdownEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  // The editor package ships its own light/dark CSS keyed off this
  // attribute - without it, it was always rendering light-mode even when
  // the rest of the admin panel was in dark mode.
  const { resolvedTheme } = useTheme();

  return (
    <div data-color-mode={resolvedTheme === "dark" ? "dark" : "light"} className="w-full">
      <MDEditor value={value} onChange={(v) => onChange(v ?? "")} height={320} />
    </div>
  );
}
