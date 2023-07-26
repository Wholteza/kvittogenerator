import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Test } from "./test-component";

describe("That UI testing is working with test component", () => {
  test("it renders button", () => {
    // Arrange
    render(<Test />);

    // Assert
    const button = screen.getByRole("button");
    expect(button).toBeVisible();
    expect(button).toHaveTextContent("click me");
  });

  test("shows a heading when button is pressed", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Test />);

    //Act
    const textInput = screen.getByText("click me");
    await user.click(textInput);
    await screen.findByRole("heading");

    // Assert
    expect(screen.getByRole("heading")).toHaveTextContent("Test Heading");
  });
});
