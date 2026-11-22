import { describe, expect, it } from "vitest";
import { canTransition, nextStatus } from "@/lib/order-workflow";

describe("order workflow", () => {
  it("moves through Pending → Confirmed → Preparing → Ready → Completed", () => {
    expect(nextStatus("pending")).toBe("confirmed");
    expect(nextStatus("confirmed")).toBe("preparing");
    expect(nextStatus("preparing")).toBe("ready");
    expect(nextStatus("ready")).toBe("completed");
    expect(nextStatus("completed")).toBeNull();
  });

  it("does not let staff skip a step", () => {
    expect(canTransition("pending", "ready", "staff")).toBe(false);
    expect(canTransition("pending", "confirmed", "staff")).toBe(true);
  });

  it("lets customers cancel only while the order is pending", () => {
    expect(canTransition("pending", "cancelled", "customer")).toBe(true);
    expect(canTransition("confirmed", "cancelled", "customer")).toBe(false);
    expect(canTransition("pending", "confirmed", "customer")).toBe(false);
  });

  it("never changes a completed or cancelled order", () => {
    expect(canTransition("completed", "cancelled", "admin")).toBe(false);
    expect(canTransition("cancelled", "pending", "admin")).toBe(false);
  });
});
