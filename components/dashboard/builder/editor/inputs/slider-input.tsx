"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";

export function SliderInput({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "px",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <Field>
      <FieldLabel>
        {label} — {value}
        {unit}
      </FieldLabel>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onChange(next)}
      />
    </Field>
  );
}
