import { describe, it, expect } from "vitest";
import { withProtocol } from "../utils/url";

describe("withProtocol", () => {
  it("adds https:// to a bare domain", () => {
    expect(withProtocol("myportfolio.com")).toBe("https://myportfolio.com");
  });

  it("leaves an https:// URL untouched", () => {
    expect(withProtocol("https://myportfolio.com")).toBe("https://myportfolio.com");
  });

  it("leaves an http:// URL untouched", () => {
    expect(withProtocol("http://myportfolio.com")).toBe("http://myportfolio.com");
  });

  it("is case-insensitive when checking for an existing protocol", () => {
    expect(withProtocol("HTTPS://myportfolio.com")).toBe("HTTPS://myportfolio.com");
  });
});
