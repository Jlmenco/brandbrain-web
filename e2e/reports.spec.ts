import { test, expect } from "./fixtures";

test.describe("Relatorios", () => {
  test("pagina carrega com titulo", async ({ adminPage: page }) => {
    await page.goto("/reports");
    await page.waitForLoadState("networkidle");

    // Titulo da pagina
    await expect(page.getByRole("heading", { name: /Relat/i })).toBeVisible({ timeout: 15000 });
  });

  test("seletores de data existem", async ({ adminPage: page }) => {
    await page.goto("/reports");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: /Relat/i })).toBeVisible({ timeout: 15000 });

    // Deve ter campos de data (inicio e fim)
    const dateInputs = page.locator('input[type="date"], button:has-text("Selecionar data"), button:has-text("De"), button:has-text("Ate")');
    const count = await dateInputs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("botao Visualizar existe", async ({ adminPage: page }) => {
    await page.goto("/reports");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: /Relat/i })).toBeVisible({ timeout: 15000 });

    const previewButton = page.getByRole("button", { name: /Visualizar|Preview/i });
    await expect(previewButton).toBeVisible({ timeout: 10000 });
  });

  test("botao Download existe", async ({ adminPage: page }) => {
    await page.goto("/reports");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: /Relat/i })).toBeVisible({ timeout: 15000 });

    const downloadButton = page.getByRole("button", { name: /Download|Baixar|Exportar/i });
    await expect(downloadButton).toBeVisible({ timeout: 10000 });
  });
});
