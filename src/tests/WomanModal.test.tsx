import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WomanModal from "../components/WomanModal";
import type { WomanRow } from "../types/database";

const woman: WomanRow = {
  id: "w1",
  name: "Whitney",
  role: "Vocalist · 90s",
  bio: "One of the best-selling music artists of all time.",
  image_url: null,
  is_large: false,
  sort_order: 1,
};

describe("WomanModal", () => {
  it("renders the woman's name, role and bio", () => {
    render(<WomanModal woman={woman} onClose={() => {}} />);

    expect(screen.getByText("Whitney")).toBeInTheDocument();
    expect(screen.getByText("Vocalist · 90s")).toBeInTheDocument();
    expect(screen.getByText(woman.bio!)).toBeInTheDocument();
  });

  it("falls back to a placeholder bio when none is set", () => {
    render(<WomanModal woman={{ ...woman, bio: null }} onClose={() => {}} />);
    expect(screen.getByText("Bio coming soon.")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<WomanModal woman={woman} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking the overlay", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<WomanModal woman={woman} onClose={onClose} />);

    const dialog = screen.getByRole("dialog");
    await user.click(dialog.firstChild as Element);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when pressing Escape", () => {
    const onClose = vi.fn();
    render(<WomanModal woman={woman} onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
