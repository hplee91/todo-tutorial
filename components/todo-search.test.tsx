import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoSearch } from "@/components/todo-search";

describe("TodoSearch", () => {
  it("현재 검색어를 입력 필드에 표시한다", () => {
    render(<TodoSearch value="회의" onChange={vi.fn()} />);

    expect(screen.getByRole("textbox", { name: "검색" })).toHaveValue("회의");
  });

  it("입력하면 입력한 값으로 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TodoSearch value="" onChange={onChange} />);

    await user.type(screen.getByRole("textbox", { name: "검색" }), "회");

    expect(onChange).toHaveBeenCalledExactlyOnceWith("회");
  });
});
