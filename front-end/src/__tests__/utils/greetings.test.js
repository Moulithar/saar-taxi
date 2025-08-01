import { getGreeting } from "../../utils/greetings";

// Helper to mock Date.getHours()
function mockHours(hour) {
  const RealDate = Date;
  global.Date = class extends RealDate {
    getHours() { return hour; }
  };
  return () => { global.Date = RealDate; };
}

describe("getGreeting", () => {
  it("returns Good morning for morning hours", () => {
    const restore = mockHours(9);
    expect(getGreeting("Mouli")).toBe("Good morning, Mouli!");
    restore();
  });

  it("returns Good afternoon for afternoon hours", () => {
    const restore = mockHours(14);
    expect(getGreeting("Mouli")).toBe("Good afternoon, Mouli!");
    restore();
  });

  it("returns Good evening for evening hours", () => {
    const restore = mockHours(20);
    expect(getGreeting("Mouli")).toBe("Good evening, Mouli!");
    restore();
  });

  it("trims whitespace from name", () => {
    const restore = mockHours(10);
    expect(getGreeting("  Mouli  ")).toBe("Good morning, Mouli!");
    restore();
  });
});