"use client";

import { useState } from "react";
import {
  DEFAULT_SORT,
  type SortBy,
  type TodoFilter as TodoFilterValue,
} from "@/lib/types";
import { useTodos } from "@/hooks/use-todos";
import { TodoInput } from "@/components/todo-input";
import { TodoFilter } from "@/components/todo-filter";
import { TodoSort } from "@/components/todo-sort";
import { TodoSearch } from "@/components/todo-search";
import { TodoItem } from "@/components/todo-item";

export function TodoList() {
  const { todos, loaded, addTodo, toggleTodo, deleteTodo, editTodo } =
    useTodos();
  const [filter, setFilter] = useState<TodoFilterValue>("all");
  const [sortBy, setSortBy] = useState<SortBy>(DEFAULT_SORT);
  const [query, setQuery] = useState("");

  const sortedTodos = [...todos].sort((a, b) => {
    if (sortBy === "name") return a.text.localeCompare(b.text, "ko");
    if (sortBy === "dueDate") {
      // 마감일이 없는 항목은 항상 뒤로 보낸다.
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    return b.createdAt - a.createdAt;
  });

  const trimmedQuery = query.trim().toLowerCase();

  const visibleTodos = sortedTodos.filter((todo) => {
    if (filter === "active" && todo.completed) return false;
    if (filter === "completed" && !todo.completed) return false;
    if (trimmedQuery && !todo.text.toLowerCase().includes(trimmedQuery))
      return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <TodoInput onAdd={addTodo} />

      <TodoSearch value={query} onChange={setQuery} />
      <TodoFilter value={filter} onChange={setFilter} />
      <TodoSort value={sortBy} onChange={setSortBy} />

      {loaded && visibleTodos.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          아직 할 일이 없습니다. 위에 입력해 추가해보세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visibleTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
