import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardDetailsModal from "../components/CardDetailsModal";

describe("CardDetailsModal", () => {
  it("does not show validation errors before the form is submitted", () => {
    render(<CardDetailsModal onClose={() => {}} onConfirm={() => {}} />);
    expect(screen.queryByText("Enter the name on the card")).not.toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    render(<CardDetailsModal onClose={() => {}} onConfirm={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Save card" }));

    expect(screen.getByText("Enter the name on the card")).toBeInTheDocument();
    expect(screen.getByText("Enter a 16-digit card number")).toBeInTheDocument();
    expect(screen.getByText("Use MM/YY")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid CVV")).toBeInTheDocument();
  });

  it("calls onConfirm when all fields are valid", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<CardDetailsModal onClose={() => {}} onConfirm={onConfirm} />);

    await user.type(screen.getByLabelText("Name on card"), "Jane Doe");
    await user.type(screen.getByLabelText("Card number"), "4242424242424242");
    await user.type(screen.getByLabelText("Expiry"), "12/28");
    await user.type(screen.getByLabelText("CVV"), "123");
    await user.click(screen.getByRole("button", { name: "Save card" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("does not call onConfirm when the expiry format is invalid", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<CardDetailsModal onClose={() => {}} onConfirm={onConfirm} />);

    await user.type(screen.getByLabelText("Name on card"), "Jane Doe");
    await user.type(screen.getByLabelText("Card number"), "4242424242424242");
    await user.type(screen.getByLabelText("Expiry"), "13/99");
    await user.type(screen.getByLabelText("CVV"), "123");
    await user.click(screen.getByRole("button", { name: "Save card" }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByText("Use MM/YY")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<CardDetailsModal onClose={onClose} onConfirm={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
