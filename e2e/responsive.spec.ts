import { test, expect } from "./fixtures";

test.describe("Responsividade Mobile", () => {
  // Configura viewport mobile para todos os testes deste describe
  test.use({ viewport: { width: 375, height: 667 } });

  test("sidebar desktop esta oculta em tela mobile", async ({ adminPage: page }) => {
    await page.waitForLoadState("networkidle");

    // A sidebar desktop (w-56, hidden lg:block) deve estar oculta em mobile
    const desktopSidebar = page.locator("aside.w-56");
    await expect(desktopSidebar).not.toBeVisible({ timeout: 5000 });
  });

  test("botao hamburger abre menu mobile", async ({ adminPage: page }) => {
    await page.waitForLoadState("networkidle");

    // O botao de menu (hamburger) deve estar visivel em mobile
    const menuButton = page.locator('button[title="Menu"]');
    await expect(menuButton).toBeVisible({ timeout: 10000 });

    // Clica no botao hamburger
    await menuButton.click();

    // O Sheet (drawer) deve abrir com o SidebarContent
    // O Sheet renderiza um overlay com role="dialog"
    const sheet = page.locator('[role="dialog"]');
    await expect(sheet).toBeVisible({ timeout: 5000 });

    // Os links de navegacao devem estar visiveis dentro do sheet
    await expect(sheet.getByText("Dashboard")).toBeVisible();
    await expect(sheet.getByText("Conteudos")).toBeVisible();
    await expect(sheet.getByText("Campanhas")).toBeVisible();
  });

  test("navegar via menu mobile fecha o drawer", async ({ adminPage: page }) => {
    await page.waitForLoadState("networkidle");

    // Abre o menu mobile
    const menuButton = page.locator('button[title="Menu"]');
    await menuButton.click();

    const sheet = page.locator('[role="dialog"]');
    await expect(sheet).toBeVisible({ timeout: 5000 });

    // Clica em "Conteudos" no menu
    await sheet.getByText("Conteudos").click();

    // Deve navegar para /conteudos
    await page.waitForURL("**/conteudos", { timeout: 15000 });
    await expect(page).toHaveURL(/conteudos/);

    // O sheet deve fechar apos a navegacao (onNavigate callback)
    await expect(sheet).not.toBeVisible({ timeout: 5000 });
  });

  test("navegar para campanhas via menu mobile", async ({ adminPage: page }) => {
    await page.waitForLoadState("networkidle");

    // Abre o menu mobile
    const menuButton = page.locator('button[title="Menu"]');
    await menuButton.click();

    const sheet = page.locator('[role="dialog"]');
    await expect(sheet).toBeVisible({ timeout: 5000 });

    // Clica em "Campanhas"
    await sheet.getByText("Campanhas").click();

    // Deve navegar para /campanhas
    await page.waitForURL("**/campanhas", { timeout: 15000 });
    await expect(page).toHaveURL(/campanhas/);
  });

  test("tabelas tem scroll horizontal em mobile", async ({ adminPage: page }) => {
    // Navega para pagina de campanhas (tem tabela com min-w-[600px])
    await page.goto("/campanhas");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Campanhas" })).toBeVisible({ timeout: 15000 });

    // Se houver campanhas, verifica que o container da tabela tem overflow-x-auto
    const tableContainer = page.locator(".overflow-x-auto");
    const hasTableContainer = await tableContainer.first().isVisible().catch(() => false);

    if (hasTableContainer) {
      // O container de overflow deve existir
      await expect(tableContainer.first()).toBeVisible();

      // A tabela dentro deve ter min-width maior que a viewport
      const table = tableContainer.first().locator("table");
      const hasTable = await table.isVisible().catch(() => false);

      if (hasTable) {
        const tableMinWidth = await table.evaluate((el) => {
          return parseInt(window.getComputedStyle(el).minWidth, 10);
        });
        // A tabela tem min-w-[600px], que e maior que 375px do viewport
        expect(tableMinWidth).toBeGreaterThan(375);
      }
    }
  });

  test("header e visivel em mobile com todos os elementos", async ({ adminPage: page }) => {
    await page.waitForLoadState("networkidle");

    // Header deve estar visivel
    const header = page.locator("header");
    await expect(header).toBeVisible({ timeout: 10000 });

    // Botao de menu hamburger deve estar visivel
    await expect(page.locator('button[title="Menu"]')).toBeVisible();

    // Botao de logout deve estar visivel
    await expect(page.locator('button[title="Sair"]')).toBeVisible();
  });

  test("logo Brand Brain visivel no menu mobile", async ({ adminPage: page }) => {
    await page.waitForLoadState("networkidle");

    // Abre o menu mobile
    const menuButton = page.locator('button[title="Menu"]');
    await menuButton.click();

    const sheet = page.locator('[role="dialog"]');
    await expect(sheet).toBeVisible({ timeout: 5000 });

    // Logo "BB" e texto "Brand Brain" devem estar visiveis no drawer
    await expect(sheet.getByText("BB")).toBeVisible();
    await expect(sheet.getByText("Brand Brain")).toBeVisible();
  });
});
