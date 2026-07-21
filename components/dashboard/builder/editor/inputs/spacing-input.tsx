"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export type Spacing = {
  top: string;
  right: string;
  bottom: string;
  left: string;
};

export function SpacingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Spacing;
  onChange: (value: Spacing) => void;
}) {
  const set = (key: keyof Spacing) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, [key]: event.target.value });
  };

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className="grid grid-cols-2 gap-2">
        <Input value={value.left ?? ""} onChange={set("left")} aria-label={`${label} left`} placeholder="Left" />
        <Input value={value.top ?? ""} onChange={set("top")} aria-label={`${label} top`} placeholder="Top" />
        <Input value={value.right ?? ""} onChange={set("right")} aria-label={`${label} right`} placeholder="Right" />
        <Input value={value.bottom ?? ""} onChange={set("bottom")} aria-label={`${label} bottom`} placeholder="Bottom" />
      </div>
    </Field>
  );
}

export function toCssLength(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "0px";
  const trimmed = String(value).trim();
  if (trimmed === "") return "0px";
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}px`;
  return trimmed;
}
