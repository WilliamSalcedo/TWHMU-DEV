import { describe, it, expect } from "vitest";
import { formatShortDate, formatFullDate } from "../utils/date";

describe("formatShortDate", () => {
  it("formats an ISO date as MONTH DD", () => {
    expect(formatShortDate("2026-10-03")).toBe("OCT 03");
  });

  it("pads single-digit days", () => {
    expect(formatShortDate("2026-01-05")).toBe("JAN 05");
  });

  it("handles December correctly", () => {
    expect(formatShortDate("2026-12-25")).toBe("DEC 25");
  });
});

describe("formatFullDate", () => {
  it("formats an ISO date with weekday and full month name", () => {
    // 2026-10-03 is a Saturday
    expect(formatFullDate("2026-10-03")).toBe("Saturday, October 3, 2026");
  });

  it("does not shift the date due to timezone parsing", () => {
    // A naive `new Date("2026-01-01")` parse (UTC midnight) can render as
    // Dec 31 in negative-offset timezones — formatFullDate must not do that.
    expect(formatFullDate("2026-01-01")).toBe("Thursday, January 1, 2026");
  });
});
