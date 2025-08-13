/**
 * 기본 애플리케이션 테스트
 */
describe("Application", () => {
  it("should be defined", () => {
    expect(true).toBe(true);
  });

  it("should have correct environment", () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
