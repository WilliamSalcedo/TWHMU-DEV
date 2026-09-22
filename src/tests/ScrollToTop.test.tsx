import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

describe("ScrollToTop", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it("scrolls to (0, 0) when the route has no hash", () => {
    render(
      <MemoryRouter initialEntries={["/shop"]}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("does not scroll when the route has a hash (lets useScrollToHash own it)", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/", hash: "#shop" }]}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("renders nothing", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/shop"]}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });
});
