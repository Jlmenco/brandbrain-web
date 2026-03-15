import { test, expect } from "./fixtures";

test.describe("Repurpose (Adaptar Conteudo)", () => {
  test("botao Adaptar visivel na pagina de detalhe", async ({ adminPage: page }) => {
    // Navega para lista de conteudos
    await page.goto("/conteudos");
    await page.waitForLoadState("networkidle");

    // Clica no primeiro conteudo para ir ao detalhe
    const rows = page.locator("table tbody tr");
    await rows.first().waitFor({ state: "visible", timeout: 10000 });
    await rows.first().click();

    // Aguarda pagina de detalhe
    await page.waitForURL(/\/conteudos\//);

    // Botao Adaptar deve estar visivel
    const adaptButton = page.getByRole("button", { name: /Adaptar/i });
    await expect(adaptButton).toBeVisible({ timeout: 10000 });
  });

  test("clicar Adaptar abre dialog com selecao de plataforma", async ({ adminPage: page }) => {
    await page.goto("/conteudos");
    await page.waitForLoadState("networkidle");

    const rows = page.locator("table tbody tr");
    await rows.first().waitFor({ state: "visible", timeout: 10000 });
    await rows.first().click();

    await page.waitForURL(/\/conteudos\//);

    // Clica no botao Adaptar
    const adaptButton = page.getByRole("button", { name: /Adaptar/i });
    await expect(adaptButton).toBeVisible({ timeout: 10000 });
    await adaptButton.click();

    // Dialog de repurpose deve abrir
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Deve ter opcoes de plataforma
    const platformOption = dialog.getByText(/Instagram|LinkedIn|TikTok|YouTube|Facebook/i);
    await expect(platformOption.first()).toBeVisible({ timeout: 5000 });
  });
});
