import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WomenGrid from "../components/WomenGrid";
import type { WomanRow } from "../types/database";

const women: WomanRow[] = [
  { id: "w1", name: "Whitney", role: "Vocalist · 90s", bio: null, image_url: null, is_large: true, sort_order: 1 },
  { id: "w2", name: "Aaliyah", role: "R&B · 90s", bio: null, image_url: "https://example.com/a.jpg", is_large: false, sort_order: 2 },
];

describe("WomenGrid", () => {
  it("renders a card for each woman with her name and role", () => {
    render(<WomenGrid women={women} onSelect={() => {}} />);

    expect(screen.getByText("Whitney")).toBeInTheDocument();
    expect(screen.getByText("Vocalist · 90s")).toBeInTheDocument();
    expect(screen.getByText("Aaliyah")).toBeInTheDocument();
    expect(screen.getByText("R&B · 90s")).toBeInTheDocument();
  });

  it("renders a real image when image_url is set", () => {
    render(<WomenGrid women={women} onSelect={() => {}} />);
    expect(screen.getByAltText("Aaliyah")).toHaveAttribute("src", "https://example.com/a.jpg");
  });

  it("falls back to a placeholder when image_url is missing", () => {
    render(<WomenGrid women={women} onSelect={() => {}} />);
    expect(screen.getByText("portrait")).toBeInTheDocument();
  });

  it("calls onSelect with the clicked woman", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<WomenGrid women={women} onSelect={onSelect} />);

    await user.click(screen.getByText("Aaliyah"));

    expect(onSelect).toHaveBeenCalledWith(women[1]);
  });

  it("applies the large mosaic layout only to is_large entries", () => {
    render(<WomenGrid women={women} onSelect={() => {}} />);
    const buttons = screen.getAllByRole("button");

    expect(buttons[0]).toHaveClass("md:col-span-6");
    expect(buttons[1]).toHaveClass("md:col-span-3");
  });
});
