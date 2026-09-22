import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TourDatesList from "../components/TourDatesList";
import type { TourDateRow } from "../types/database";

const mockUseAuth = vi.fn();
vi.mock("../context/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

const baseDate: TourDateRow = {
  id: "t1",
  event_date: "2026-10-03",
  city: "New York, NY",
  venue: "Brooklyn Steel",
  venue_address: null,
  event_time: null,
  price: 95,
  capacity: 50,
  tickets_sold: 44,
  headliner: null,
  description: null,
  age_restriction: "All Ages",
  tag_label: "Few Left",
  tag_variant: "coral",
  action_label: "Tickets ›",
  action_href: "#",
  action_variant: "btn",
  sold_out: false,
  sort_order: 1,
};

function renderList(dates: TourDateRow[]) {
  return render(
    <MemoryRouter>
      <TourDatesList dates={dates} />
    </MemoryRouter>
  );
}

describe("TourDatesList", () => {
  it("renders the city, venue and tag for each date", () => {
    mockUseAuth.mockReturnValue({ user: null });
    renderList([baseDate]);

    expect(screen.getByText("New York, NY")).toBeInTheDocument();
    expect(screen.getByText("Brooklyn Steel")).toBeInTheDocument();
    expect(screen.getByText("Few Left")).toBeInTheDocument();
  });

  it("links each row to its detail page", () => {
    mockUseAuth.mockReturnValue({ user: null });
    renderList([baseDate]);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/tour/t1");
  });

  it("shows the members-presale action label when signed out", () => {
    mockUseAuth.mockReturnValue({ user: null });
    const presale: TourDateRow = { ...baseDate, tag_variant: "aqua", tag_label: "Pre-Sale · Members", action_label: "Sign in to access", action_variant: "link" };
    renderList([presale]);

    expect(screen.getByText("Sign in to access")).toBeInTheDocument();
  });

  it("unlocks the ticket action for members-presale rows once signed in", () => {
    mockUseAuth.mockReturnValue({ user: { id: "u1" } });
    const presale: TourDateRow = { ...baseDate, tag_variant: "aqua", tag_label: "Pre-Sale · Members", action_label: "Sign in to access", action_variant: "link" };
    renderList([presale]);

    expect(screen.getByText("Tickets ›")).toBeInTheDocument();
    expect(screen.queryByText("Sign in to access")).not.toBeInTheDocument();
  });

  it("applies a faded style to sold-out dates", () => {
    mockUseAuth.mockReturnValue({ user: null });
    const soldOut: TourDateRow = { ...baseDate, sold_out: true };
    renderList([soldOut]);

    expect(screen.getByRole("link")).toHaveClass("opacity-70");
  });
});
