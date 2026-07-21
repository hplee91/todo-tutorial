import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoInput } from "@/components/todo-input";

describe("TodoInput 우선순위 선택", () => {
  it("기본 우선순위는 '보통'이 선택되어 있다", () => {
    render(<TodoInput onAdd={vi.fn()} />);

    expect(screen.getByRole("radio", { name: "보통" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByRole("radio", { name: "높음" })).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("우선순위를 클릭하면 선택 상태가 바뀐다", async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);

    await user.click(screen.getByRole("radio", { name: "높음" }));

    expect(screen.getByRole("radio", { name: "높음" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByRole("radio", { name: "보통" })).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("Enter로 제출하면 입력값과 선택한 우선순위로 onAdd를 호출한다", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await user.click(screen.getByRole("radio", { name: "낮음" }));
    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "장보기{Enter}"
    );

    expect(onAdd).toHaveBeenCalledExactlyOnceWith(
      "장보기",
      "low",
      undefined,
      "work"
    );
  });

  it("제출 후 우선순위가 기본값('보통')으로 초기화된다", async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);

    await user.click(screen.getByRole("radio", { name: "높음" }));
    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "장보기{Enter}"
    );

    expect(screen.getByRole("radio", { name: "보통" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });
});

describe("TodoInput 마감일 입력", () => {
  it("마감일을 입력하고 제출하면 onAdd에 마감일이 전달된다", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    fireEvent.change(screen.getByLabelText("마감일"), {
      target: { value: "2026-08-01" },
    });
    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "보고서 제출{Enter}"
    );

    expect(onAdd).toHaveBeenCalledExactlyOnceWith(
      "보고서 제출",
      "medium",
      "2026-08-01",
      "work"
    );
  });

  it("마감일을 입력하지 않고 제출하면 onAdd에 undefined가 전달된다", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "청소{Enter}"
    );

    expect(onAdd).toHaveBeenCalledExactlyOnceWith(
      "청소",
      "medium",
      undefined,
      "work"
    );
  });

  it("제출 후 마감일 입력이 초기화된다", async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("마감일"), {
      target: { value: "2026-08-01" },
    });
    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "보고서 제출{Enter}"
    );

    expect(screen.getByLabelText("마감일")).toHaveValue("");
  });
});

describe("TodoInput 카테고리 선택", () => {
  it("기본 카테고리는 '업무'가 선택되어 있다", () => {
    render(<TodoInput onAdd={vi.fn()} />);

    expect(screen.getByRole("radio", { name: "업무" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByRole("radio", { name: "개인" })).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("카테고리를 클릭하면 선택 상태가 바뀐다", async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);

    await user.click(screen.getByRole("radio", { name: "쇼핑" }));

    expect(screen.getByRole("radio", { name: "쇼핑" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByRole("radio", { name: "업무" })).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("Enter로 제출하면 선택한 카테고리로 onAdd를 호출한다", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await user.click(screen.getByRole("radio", { name: "개인" }));
    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "병원 예약{Enter}"
    );

    expect(onAdd).toHaveBeenCalledExactlyOnceWith(
      "병원 예약",
      "medium",
      undefined,
      "personal"
    );
  });

  it("제출 후 카테고리가 기본값('업무')으로 초기화된다", async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);

    await user.click(screen.getByRole("radio", { name: "쇼핑" }));
    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "장보기{Enter}"
    );

    expect(screen.getByRole("radio", { name: "업무" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });
});
