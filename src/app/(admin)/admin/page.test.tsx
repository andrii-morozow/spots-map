import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminPage from "./page";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  protect: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: Object.assign(mocks.auth, { protect: mocks.protect }),
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

describe("admin access diagnostics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("ADMIN_USER_ID", "user_admin");
    mocks.auth.mockResolvedValue({
      userId: "user_admin",
      isAuthenticated: true,
      sessionStatus: "active",
    });
    mocks.protect.mockResolvedValue({ userId: "user_admin" });
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("allows the matching admin without logging a failure", async () => {
    render(await AdminPage());
    expect(screen.getByText("Protected spot form")).toBeInTheDocument();
    expect(mocks.protect).toHaveBeenCalledOnce();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("keeps Clerk's rejection and records unauthenticated sessions", async () => {
    mocks.auth.mockResolvedValue({
      userId: null,
      isAuthenticated: false,
      sessionStatus: null,
    });
    mocks.protect.mockRejectedValue(new Error("CLERK_REJECTION"));
    await expect(AdminPage()).rejects.toThrow("CLERK_REJECTION");
    expect(console.warn).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ reason: "unauthenticated" }),
    );
  });

  it("rejects other users without logging either user ID", async () => {
    mocks.auth.mockResolvedValue({
      userId: "user_other",
      isAuthenticated: true,
      sessionStatus: "active",
    });
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
    expect(console.warn).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        reason: "admin-id-mismatch",
        matchesAfterTrimming: false,
      }),
    );
    const output = JSON.stringify(vi.mocked(console.warn).mock.calls);
    expect(output).not.toContain("user_admin");
    expect(output).not.toContain("user_other");
  });

  it("identifies whitespace without changing the access policy", async () => {
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
    expect(console.warn).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        adminIdHasWhitespace: true,
        matchesAfterTrimming: true,
      }),
    );
  });

  it("identifies missing configuration and still denies access", async () => {
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
    expect(console.warn).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ adminIdConfigured: false }),
    );
  });
});
