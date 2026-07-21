"use client";

import { useState } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  if (!isFocused && draft !== value) {
    setDraft(value);
  }

  const isValidHex = (hex: string) =>
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);

  const commitDraft = () => {
    if (isValidHex(draft)) {
      onChange(draft);
    } else {
      setDraft(value);
    }
  };

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="size-8 shrink-0 rounded-md border border-border"
              style={{ backgroundColor: value }}
              aria-label={`${label} swatch`}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <input
              type="color"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="size-32"
            />
          </PopoverContent>
        </Popover>
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            commitDraft();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitDraft();
            }
          }}
        />
      </div>
    </Field>
  );
}
