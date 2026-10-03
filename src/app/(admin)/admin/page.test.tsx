import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminPage from "./page";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  protect: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: Object.assign(mocks.auth, { protect: mocks.protect }),
}));
vi.mock("next/navigation", () => ({ notFound: mocks.notFound }));
vi.mock("@/components/admin/spot-form/spot-form", () => ({
  SpotForm: () => null,
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
    await expect(AdminPage()).resolves.toBeDefined();
    expect(mocks.protect).toHaveBeenCalledOnce();
    expect(mocks.notFound).not.toHaveBeenCalled();
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
    await expect(AdminPage()).rejects.toThrow("NOT_FOUND");
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
    await expect(AdminPage()).rejects.toThrow("NOT_FOUND");
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
    await expect(AdminPage()).rejects.toThrow("NOT_FOUND");
    expect(console.warn).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ adminIdConfigured: false }),
    );
  });
});
