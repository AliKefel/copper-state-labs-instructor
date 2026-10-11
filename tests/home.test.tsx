import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("Home page", () => {
  it("shows the base repo placeholder heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "Copper State Labs base repo" }),
    ).toBeInTheDocument();
  });
});
