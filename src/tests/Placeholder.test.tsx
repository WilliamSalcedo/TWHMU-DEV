import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Placeholder from "../components/Placeholder";

describe("Placeholder", () => {
  it("renders the given label", () => {
    render(<Placeholder label="ticket" />);
    expect(screen.getByText("ticket")).toBeInTheDocument();
  });

  it("applies the portrait aspect ratio class", () => {
    const { container } = render(<Placeholder label="portrait" aspect="portrait" />);
    expect(container.firstChild).toHaveClass("aspect-[3/4]");
  });

  it("applies the default aspect ratio class when none is given", () => {
    const { container } = render(<Placeholder label="default" />);
    expect(container.firstChild).toHaveClass("aspect-[4/5]");
  });
});
