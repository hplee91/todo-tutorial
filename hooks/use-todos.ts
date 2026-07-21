"use client";

import { useEffect, useState } from "react";
import { DEFAULT_PRIORITY, type Priority, type Todo } from "@/lib/types";

const STORAGE_KEY = "todos";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loaded, setLoaded] = useState(false);

  // 마운트 후 localStorage에서 로드 (SSR hydration mismatch 방지)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // priority 도입 이전에 저장된 데이터와의 호환을 위해 기본값으로 보정
        const parsed = JSON.parse(stored) as (Omit<Todo, "priority"> & {
          priority?: Priority;
        })[];
        // 마운트 후 localStorage 값으로 동기화 — hydration mismatch 방지를 위해 의도적으로 effect에서 설정
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTodos(
          parsed.map((todo) => ({
            ...todo,
            priority: todo.priority ?? DEFAULT_PRIORITY,
          }))
        );
      }
    } catch {
      // 파싱 실패 시 빈 목록 유지
    }
    setLoaded(true);
  }, []);

  // 변경 시 저장 (로드 완료 후에만 — 초기 빈 배열이 기존 데이터를 덮어쓰지 않도록)
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos, loaded]);

  function addTodo(
    text: string,
    priority: Priority = DEFAULT_PRIORITY,
    dueDate?: string
  ) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      priority,
      dueDate: dueDate || undefined,
    };
    setTodos((prev) => [todo, ...prev]);
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function editTodo(id: string, text: string) {
    const trimmed = text.trim();
    // 빈 문자열로 편집하면 삭제 처리
    if (!trimmed) {
      deleteTodo(id);
      return;
    }
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: trimmed } : todo
      )
    );
  }

  return { todos, loaded, addTodo, toggleTodo, deleteTodo, editTodo };
}
