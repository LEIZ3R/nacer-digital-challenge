import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchForm } from "./SearchForm";

// Mock de next/navigation para que useRouter sea controlable desde los tests.
// Mantenemos la firma de useRouter para que el componente no se entere.
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("SearchForm", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it("renderiza el input y el botón con el placeholder correcto", () => {
    render(<SearchForm />);
    expect(
      screen.getByPlaceholderText(/octocat/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /buscar/i }),
    ).toBeInTheDocument();
  });

  it("muestra error si se submitea vacío", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/ingresá/i);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("muestra error si el username no cumple la regex de GitHub", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    const input = screen.getByPlaceholderText(/octocat/i);
    await user.type(input, "!!!invalid!!!");
    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/inválid/i);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("navega a /:username cuando el input es válido", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    const input = screen.getByPlaceholderText(/octocat/i);
    await user.type(input, "octocat");
    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(pushMock).toHaveBeenCalledWith("/octocat");
  });

  it("limpia el error al empezar a tipear después de uno", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    // Forzar error
    await user.click(screen.getByRole("button", { name: /buscar/i }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Tipear debe limpiar el error
    const input = screen.getByPlaceholderText(/octocat/i);
    await user.type(input, "o");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
