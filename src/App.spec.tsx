import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App initialization", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("creates example customer when no customers exist", () => {
    render(<App />);

    const customerElements = screen.getAllByText(/Andersson & Co AB/);
    expect(customerElements.length).toBeGreaterThan(0);
  });

  test("creates example service when no services exist", () => {
    render(<App />);

    const serviceElements = screen.getAllByText(/Konsulttjänst/);
    expect(serviceElements.length).toBeGreaterThan(0);
  });
});
