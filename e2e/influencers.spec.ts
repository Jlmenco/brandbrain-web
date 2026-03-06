import { test, expect } from "./fixtures";

test.describe("Influenciadores", () => {
  test("listar influenciadores", async ({ adminPage: page }) => {
    await page.goto("/influenciadores");
    await page.waitForLoadState("networkidle");

    // Verify known influencers from seed appear
    await expect(page.getByText("Mel Expert")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Meat Guru")).toBeVisible({ timeout: 10000 });
  });

  test("criar influenciador", async ({ adminPage: page }) => {
    await page.goto("/influenciadores");
    await page.waitForLoadState("networkidle");

    // Click "Novo Influenciador"
    await page.getByRole("button", { name: /Novo Influen/i }).click();

    // Wait for dialog
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Fill required fields: nome, nicho, tom
    await dialog.locator('input[placeholder*="Nome"]').first().fill("E2E Test Influencer");
    await dialog.locator('input[placeholder*="tecnologia"]').fill("teste e2e");
    await dialog.locator('input[placeholder*="profissional"]').fill("casual");

    // Submit
    await dialog.getByRole("button", { name: /Criar/i }).click();

    // Verify dialog closes and new influencer appears
    await expect(dialog).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText("E2E Test Influencer").first()).toBeVisible({ timeout: 10000 });
  });

  test("ver detalhe do influenciador", async ({ adminPage: page }) => {
    await page.goto("/influenciadores");
    await page.waitForLoadState("networkidle");

    // Click on Mel Expert
    await page.getByText("Mel Expert").click();

    // Wait for detail page
    await page.waitForURL(/\/influenciadores\//);

    // Verify detail page shows name and brand kit section
    await expect(page.getByText("Mel Expert")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Brand Kit/i })).toBeVisible({ timeout: 10000 });
  });
});
