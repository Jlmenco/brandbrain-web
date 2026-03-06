import { test, expect } from "./fixtures";

test.describe("Dashboard", () => {
  test("dashboard carrega com metricas e graficos", async ({ adminPage: page }) => {
    // Verify heading
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    // Verify metrics cards are visible (at least some numbers)
    await expect(page.locator("text=Impressoes").first()).toBeVisible({ timeout: 10000 });

    // Verify recharts container exists (the chart)
    await expect(page.locator(".recharts-responsive-container").first()).toBeVisible({ timeout: 10000 });
  });

  test("dashboard mostra conteudos recentes", async ({ adminPage: page }) => {
    // Verify recent content table/section exists
    await expect(page.getByText("Conteudos Recentes").first()).toBeVisible({ timeout: 10000 });
  });
});
