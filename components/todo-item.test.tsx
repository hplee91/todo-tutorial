import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Todo } from "@/lib/types";
import { TodoItem } from "@/components/todo-item";

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: "1",
    text: "테스트 할 일",
    completed: false,
    priority: "medium",
    createdAt: 0,
    category: "work",
    ...overrides,
  };
}

describe("TodoItem", () => {
  it("할 일 텍스트를 렌더링한다", () => {
    render(
      <TodoItem
        todo={makeTodo()}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    expect(screen.getByText("테스트 할 일")).toBeInTheDocument();
  });

  it("체크박스를 클릭하면 해당 id로 onToggle을 호출한다", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <TodoItem
        todo={makeTodo({ id: "abc" })}
        onToggle={onToggle}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    await user.click(screen.getByRole("checkbox"));

    expect(onToggle).toHaveBeenCalledExactlyOnceWith("abc");
  });

  it("삭제 버튼을 클릭하면 해당 id로 onDelete를 호출한다", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <TodoItem
        todo={makeTodo({ id: "abc" })}
        onToggle={vi.fn()}
        onDelete={onDelete}
        onEdit={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(onDelete).toHaveBeenCalledExactlyOnceWith("abc");
  });

  it("우선순위 라벨을 뱃지로 표시한다", () => {
    render(
      <TodoItem
        todo={makeTodo({ priority: "high" })}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    expect(screen.getByText("높음")).toBeInTheDocument();
  });

  it("카테고리 라벨을 뱃지로 표시한다", () => {
    render(
      <TodoItem
        todo={makeTodo({ category: "shopping" })}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    expect(screen.getByText("쇼핑")).toBeInTheDocument();
  });

  it("완료된 할 일은 취소선 스타일을 가진다", () => {
    render(
      <TodoItem
        todo={makeTodo({ completed: true })}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    expect(screen.getByText("테스트 할 일")).toHaveClass("line-through");
  });
});
