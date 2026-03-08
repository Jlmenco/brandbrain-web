import { test, expect } from "./fixtures";

test.describe("Campanhas", () => {
  test("pagina de campanhas carrega", async ({ adminPage: page }) => {
    await page.goto("/campanhas");
    await page.waitForLoadState("networkidle");

    // Titulo da pagina
    await expect(page.getByRole("heading", { name: "Campanhas" })).toBeVisible({ timeout: 15000 });
  });

  test("exibe tabela ou estado vazio", async ({ adminPage: page }) => {
    await page.goto("/campanhas");
    await page.waitForLoadState("networkidle");

    // Aguarda o titulo para confirmar que a pagina carregou
    await expect(page.getByRole("heading", { name: "Campanhas" })).toBeVisible({ timeout: 15000 });

    // Deve exibir OU a tabela com campanhas OU o estado vazio
    const table = page.locator("table");
    const emptyState = page.getByText("Nenhuma campanha encontrada");

    // Um dos dois deve estar visivel
    const hasTable = await table.isVisible().catch(() => false);
    const hasEmpty = await emptyState.isVisible().catch(() => false);

    expect(hasTable || hasEmpty).toBeTruthy();
  });

  test("botao Nova Campanha visivel para admin", async ({ adminPage: page }) => {
    await page.goto("/campanhas");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Campanhas" })).toBeVisible({ timeout: 15000 });

    // Admin deve ver o botao de criar campanha
    await expect(page.getByRole("button", { name: /Nova Campanha/i })).toBeVisible({ timeout: 10000 });
  });

  test("filtro de objetivo existe", async ({ adminPage: page }) => {
    await page.goto("/campanhas");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Campanhas" })).toBeVisible({ timeout: 15000 });

    // Select de filtro de objetivo
    const objectiveFilter = page.locator("select");
    await expect(objectiveFilter.first()).toBeVisible();

    // Deve ter opcao "Todos os objetivos"
    await expect(objectiveFilter.first().locator('option[value=""]')).toHaveText("Todos os objetivos");
  });

  test("botao Exportar CSV existe", async ({ adminPage: page }) => {
    await page.goto("/campanhas");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Campanhas" })).toBeVisible({ timeout: 15000 });

    // Botao Exportar CSV deve estar visivel (nao clicar para evitar download)
    const exportButton = page.getByRole("button", { name: /Exportar CSV/i });
    await expect(exportButton).toBeVisible();
  });

  test("viewer nao ve botao Nova Campanha", async ({ viewerPage: page }) => {
    await page.goto("/campanhas");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Campanhas" })).toBeVisible({ timeout: 15000 });

    // Viewer nao deve ver o botao Nova Campanha
    await expect(page.getByRole("button", { name: /Nova Campanha/i })).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe("Leads", () => {
  test("pagina de leads carrega", async ({ adminPage: page }) => {
    await page.goto("/leads");
    await page.waitForLoadState("networkidle");

    // Titulo da pagina
    await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible({ timeout: 15000 });
  });

  test("exibe tabela ou estado vazio", async ({ adminPage: page }) => {
    await page.goto("/leads");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible({ timeout: 15000 });

    // Deve exibir OU a tabela com leads OU o estado vazio
    const table = page.locator("table");
    const emptyState = page.getByText("Nenhum lead encontrado");

    const hasTable = await table.isVisible().catch(() => false);
    const hasEmpty = await emptyState.isVisible().catch(() => false);

    expect(hasTable || hasEmpty).toBeTruthy();
  });

  test("botao Novo Lead visivel para admin", async ({ adminPage: page }) => {
    await page.goto("/leads");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible({ timeout: 15000 });

    // Admin deve ver o botao de criar lead
    await expect(page.getByRole("button", { name: /Novo Lead/i })).toBeVisible({ timeout: 10000 });
  });

  test("filtro de status existe", async ({ adminPage: page }) => {
    await page.goto("/leads");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible({ timeout: 15000 });

    // Select de filtro de status
    const statusFilter = page.locator("select");
    await expect(statusFilter.first()).toBeVisible();

    // Deve ter opcao "Todos os status"
    await expect(statusFilter.first().locator('option[value=""]')).toHaveText("Todos os status");
  });

  test("botao Exportar CSV existe na pagina de leads", async ({ adminPage: page }) => {
    await page.goto("/leads");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible({ timeout: 15000 });

    // Botao Exportar CSV deve estar visivel (nao clicar para evitar download)
    const exportButton = page.getByRole("button", { name: /Exportar CSV/i });
    await expect(exportButton).toBeVisible();
  });

  test("viewer nao ve botao Novo Lead", async ({ viewerPage: page }) => {
    await page.goto("/leads");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible({ timeout: 15000 });

    // Viewer nao deve ver o botao Novo Lead
    await expect(page.getByRole("button", { name: /Novo Lead/i })).not.toBeVisible({ timeout: 5000 });
  });

  test("subtitulo mostra contagem de leads", async ({ adminPage: page }) => {
    await page.goto("/leads");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible({ timeout: 15000 });

    // Subtitulo deve mostrar a contagem (ex: "8 leads" ou "0 leads")
    await expect(page.getByText(/\d+ leads?/)).toBeVisible({ timeout: 10000 });
  });
});
