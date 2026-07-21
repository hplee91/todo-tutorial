"use client";

import { Input } from "@/components/ui/input";

interface TodoSearchProps {
  value: string;
  onChange: (query: string) => void;
}

export function TodoSearch({ value, onChange }: TodoSearchProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="제목으로 검색"
      aria-label="검색"
    />
  );
}
