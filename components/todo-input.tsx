"use client";

import { useState } from "react";
import {
  CATEGORIES,
  DEFAULT_CATEGORY,
  DEFAULT_PRIORITY,
  PRIORITIES,
  type Category,
  type Priority,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TodoInputProps {
  onAdd: (
    text: string,
    priority: Priority,
    dueDate?: string,
    category?: Category
  ) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState<Priority>(DEFAULT_PRIORITY);
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY);

  function submit() {
    onAdd(value, priority, dueDate || undefined, category);
    setValue("");
    setPriority(DEFAULT_PRIORITY);
    setDueDate("");
    setCategory(DEFAULT_CATEGORY);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    submit();
  }

  // 입력 필드가 두 개 이상이면 브라우저의 암묵적 Enter 제출이 동작하지 않으므로
  // "새 할 일" 입력에서는 Enter를 명시적으로 처리한다.
  function handleTextKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleTextKeyDown}
        placeholder="할 일을 입력하고 Enter를 누르세요"
        aria-label="새 할 일"
      />

      <Input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        aria-label="마감일"
      />

      <div role="radiogroup" aria-label="우선순위" className="flex gap-1">
        {PRIORITIES.map((item) => {
          const selected = item.value === priority;
          return (
            <Button
              key={item.value}
              type="button"
              size="sm"
              variant={selected ? "default" : "outline"}
              role="radio"
              aria-checked={selected}
              onClick={() => setPriority(item.value)}
            >
              {item.label}
            </Button>
          );
        })}
      </div>

      <div role="radiogroup" aria-label="카테고리" className="flex gap-1">
        {CATEGORIES.map((item) => {
          const selected = item.value === category;
          return (
            <Button
              key={item.value}
              type="button"
              size="sm"
              variant={selected ? "default" : "outline"}
              role="radio"
              aria-checked={selected}
              onClick={() => setCategory(item.value)}
            >
              {item.label}
            </Button>
          );
        })}
      </div>
    </form>
  );
}
