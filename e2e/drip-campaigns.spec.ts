import { test, expect } from "./fixtures";

test.describe("Campanhas de Email (Drip)", () => {
  test("pagina carrega com titulo", async ({ adminPage: page }) => {
    await page.goto("/configuracoes/emails");
    await page.waitForLoadState("networkidle");

    // Titulo da pagina
    const heading = page.getByRole("heading", { name: /Campanhas de Email|Drip/i });
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test("lista de campanhas esta visivel ou estado vazio", async ({ adminPage: page }) => {
    await page.goto("/configuracoes/emails");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: /Campanhas de Email|Drip/i })).toBeVisible({ timeout: 15000 });

    // Deve exibir OU a lista/tabela com campanhas OU o estado vazio
    const table = page.locator("table");
    const emptyState = page.getByText(/Nenhuma campanha/i);

    const hasTable = await table.isVisible().catch(() => false);
    const hasEmpty = await emptyState.isVisible().catch(() => false);

    expect(hasTable || hasEmpty).toBeTruthy();
  });

  test("botao criar campanha existe", async ({ adminPage: page }) => {
    await page.goto("/configuracoes/emails");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: /Campanhas de Email|Drip/i })).toBeVisible({ timeout: 15000 });

    // Admin deve ver o botao de criar campanha
    const createButton = page.getByRole("button", { name: /Nova Campanha|Criar Campanha/i });
    await expect(createButton).toBeVisible({ timeout: 10000 });
  });
});
