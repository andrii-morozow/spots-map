import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminPage from "./page";

const mocks = vi.hoisted(() => ({
  protect: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: { protect: mocks.protect },
}));
vi.mock("@clerk/nextjs", () => ({
  SignOutButton: ({ children }: { children: ReactNode }) => children,
}));
vi.mock("@/components/admin/spot-form/spot-form", () => ({
  SpotForm: () => <div>Protected spot form</div>,
}));
vi.mock("@/components/map/map", () => ({ Map: () => null }));
vi.mock("@/components/auth/account-button", () => ({
  AccountButton: () => null,
}));

describe("admin access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("ADMIN_USER_ID", "user_admin");
    mocks.protect.mockResolvedValue({ userId: "user_admin" });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows the matching admin", async () => {
    render(await AdminPage());
    expect(screen.getByText("Protected spot form")).toBeInTheDocument();
    expect(mocks.protect).toHaveBeenCalledOnce();
  });

  it("preserves Clerk’s rejection of unauthenticated requests", async () => {
    mocks.protect.mockRejectedValue(new Error("CLERK_REJECTION"));
    await expect(AdminPage()).rejects.toThrow("CLERK_REJECTION");
  });

  it("shows access denied for other users", async () => {
    mocks.protect.mockResolvedValue({ userId: "user_other" });
    render(await AdminPage());
    expect(
      screen.getByRole("heading", { name: "Admin access required" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Protected spot form")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to map" })).toHaveAttribute(
      "href",
      "/map",
    );
  });

  it("requires an exact admin ID match", async () => {
    vi.stubEnv("ADMIN_USER_ID", "user_admin\n");
    render(await AdminPage());
    expect(
      screen.getByRole("heading", { name: "Admin access required" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Protected spot form")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to map" })).toHaveAttribute(
      "href",
      "/map",
    );
  });

  it("shows unavailable when admin configuration is missing", async () => {
    vi.stubEnv("ADMIN_USER_ID", undefined);
    render(await AdminPage());
    expect(
      screen.getByRole("heading", { name: "Admin is temporarily unavailable" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Protected spot form")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to map" })).toHaveAttribute(
      "href",
      "/map",
    );
  });
});
