import { test, expect } from "./fixtures";

test.describe("Planejamento Editorial", () => {
  test("pagina do calendario carrega com titulo", async ({ adminPage: page }) => {
    await page.goto("/calendario");
    await page.waitForLoadState("networkidle");

    // Titulo da pagina
    await expect(page.getByRole("heading", { name: /Calend/i })).toBeVisible({ timeout: 15000 });
  });

  test("botao Gerar Plano Editorial visivel", async ({ adminPage: page }) => {
    await page.goto("/calendario");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: /Calend/i })).toBeVisible({ timeout: 15000 });

    // Botao de gerar plano editorial
    const generateButton = page.getByRole("button", { name: /Gerar Plano Editorial/i });
    await expect(generateButton).toBeVisible({ timeout: 10000 });
  });

  test("clicar Gerar Plano abre dialog com opcoes", async ({ adminPage: page }) => {
    await page.goto("/calendario");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: /Calend/i })).toBeVisible({ timeout: 15000 });

    // Clica no botao
    const generateButton = page.getByRole("button", { name: /Gerar Plano Editorial/i });
    await expect(generateButton).toBeVisible({ timeout: 10000 });
    await generateButton.click();

    // Dialog deve abrir
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Deve ter seletor de periodo e opcoes de plataforma
    const periodSelector = dialog.getByText(/Periodo|Semana|Mes|dias/i);
    await expect(periodSelector.first()).toBeVisible({ timeout: 5000 });

    const platformChip = dialog.getByText(/Instagram|LinkedIn|TikTok|YouTube|Facebook/i);
    await expect(platformChip.first()).toBeVisible({ timeout: 5000 });
  });

  test("botao Cancelar fecha o dialog", async ({ adminPage: page }) => {
    await page.goto("/calendario");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: /Calend/i })).toBeVisible({ timeout: 15000 });

    const generateButton = page.getByRole("button", { name: /Gerar Plano Editorial/i });
    await expect(generateButton).toBeVisible({ timeout: 10000 });
    await generateButton.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Clica em Cancelar para fechar
    const cancelButton = dialog.getByRole("button", { name: /Cancelar/i });
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();

    // Dialog deve fechar
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });
});
