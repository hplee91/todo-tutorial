import { act, renderHook, waitFor } from "@testing-library/react";
import { useTodos } from "@/hooks/use-todos";

beforeEach(() => {
  localStorage.clear();
});

describe("useTodos 우선순위", () => {
  it("addTodo에 전달한 우선순위로 추가한다", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("장보기", "high");
    });

    expect(result.current.todos[0]).toMatchObject({
      text: "장보기",
      priority: "high",
      completed: false,
    });
  });

  it("우선순위를 생략하면 기본값(medium)으로 추가한다", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("청소");
    });

    expect(result.current.todos[0].priority).toBe("medium");
  });

  it("priority가 없는 기존 저장 데이터는 medium으로 보정해 로드한다", async () => {
    localStorage.setItem(
      "todos",
      JSON.stringify([{ id: "1", text: "구버전 할 일", completed: false }])
    );

    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].priority).toBe("medium");
  });

  it("추가한 우선순위를 localStorage에 저장한다", async () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("장보기", "low");
    });

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("todos") ?? "[]");
      expect(stored[0]?.priority).toBe("low");
    });
  });
});

describe("useTodos 마감일", () => {
  it("마감일을 지정해 추가하면 dueDate가 저장된다", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("보고서 제출", "medium", "2026-08-01");
    });

    expect(result.current.todos[0].dueDate).toBe("2026-08-01");
  });

  it("마감일 없이 추가하면 dueDate가 없다", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("청소");
    });

    expect(result.current.todos[0].dueDate).toBeUndefined();
  });
});
