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

describe("useTodos 생성일", () => {
  it("새로 추가한 항목은 목록 맨 앞에 오고 createdAt이 숫자로 기록된다", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("장보기");
    });

    expect(typeof result.current.todos[0].createdAt).toBe("number");
  });

  it("나중에 추가한 항목의 createdAt이 먼저 추가한 항목보다 크거나 같다", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("먼저");
    });
    act(() => {
      result.current.addTodo("나중에");
    });

    // 배열은 최신 항목이 앞(index 0)에 온다
    expect(result.current.todos[0].createdAt).toBeGreaterThanOrEqual(
      result.current.todos[1].createdAt
    );
  });

  it("createdAt이 없는 기존 저장 데이터도 순서를 유지한 채 보정해 로드한다", async () => {
    localStorage.setItem(
      "todos",
      JSON.stringify([
        { id: "1", text: "최근 항목", completed: false, priority: "medium" },
        { id: "2", text: "오래된 항목", completed: false, priority: "medium" },
      ])
    );

    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(typeof result.current.todos[0].createdAt).toBe("number");
    expect(result.current.todos[0].createdAt).toBeGreaterThan(
      result.current.todos[1].createdAt
    );
  });
});

describe("useTodos 카테고리", () => {
  it("카테고리를 지정해 추가하면 해당 카테고리로 저장된다", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("장보기", "medium", undefined, "shopping");
    });

    expect(result.current.todos[0].category).toBe("shopping");
  });

  it("카테고리를 생략하면 기본값(업무)으로 추가한다", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("청소");
    });

    expect(result.current.todos[0].category).toBe("work");
  });

  it("category가 없는 기존 저장 데이터는 업무로 보정해 로드한다", async () => {
    localStorage.setItem(
      "todos",
      JSON.stringify([
        { id: "1", text: "구버전 할 일", completed: false, priority: "medium" },
      ])
    );

    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.todos[0].category).toBe("work");
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
