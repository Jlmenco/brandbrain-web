import { test, expect } from "./fixtures";

test.describe("Command Palette", () => {
  test("Cmd+K abre a paleta de comandos", async ({ adminPage: page }) => {
    // Garante que estamos no dashboard autenticado
    await page.waitForLoadState("networkidle");

    // Pressiona Cmd+K (Meta+K no Playwright)
    await page.keyboard.press("Meta+k");

    // Verifica que o dialog da paleta de comandos apareceu
    const dialog = page.locator('[role="dialog"][aria-label="Paleta de comandos"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Verifica que o campo de busca esta visivel
    const searchInput = dialog.locator('input[placeholder="Buscar paginas..."]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeFocused();
  });

  test("Escape fecha a paleta de comandos", async ({ adminPage: page }) => {
    await page.waitForLoadState("networkidle");

    // Abre a paleta
    await page.keyboard.press("Meta+k");

    const dialog = page.locator('[role="dialog"][aria-label="Paleta de comandos"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Fecha com Escape
    await page.keyboard.press("Escape");

    // Verifica que o dialog foi removido
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });

  test("busca filtra resultados na paleta", async ({ adminPage: page }) => {
    await page.waitForLoadState("networkidle");

    // Abre a paleta
    await page.keyboard.press("Meta+k");

    const dialog = page.locator('[role="dialog"][aria-label="Paleta de comandos"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    const searchInput = dialog.locator('input[placeholder="Buscar paginas..."]');

    // Digita "Dashboard" para filtrar
    await searchInput.fill("Dashboard");

    // Deve exibir o resultado "Dashboard"
    const resultButton = dialog.locator("button", { hasText: "Dashboard" });
    await expect(resultButton.first()).toBeVisible({ timeout: 5000 });

    // Digita algo sem resultados
    await searchInput.fill("xyznonexistent");

    // Deve mostrar mensagem de nenhum resultado
    await expect(dialog.getByText("Nenhum resultado encontrado.")).toBeVisible({ timeout: 5000 });
  });

  test("clicar em resultado navega para a pagina", async ({ adminPage: page }) => {
    await page.waitForLoadState("networkidle");

    // Abre a paleta
    await page.keyboard.press("Meta+k");

    const dialog = page.locator('[role="dialog"][aria-label="Paleta de comandos"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    const searchInput = dialog.locator('input[placeholder="Buscar paginas..."]');

    // Busca por "Leads"
    await searchInput.fill("Leads");

    // Clica no resultado
    const resultButton = dialog.locator("button", { hasText: "Leads" });
    await resultButton.first().click();

    // Verifica que navegou para /leads
    await page.waitForURL("**/leads", { timeout: 15000 });
    await expect(page).toHaveURL(/leads/);

    // A paleta deve ter fechado
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });

  test("Ctrl+K tambem abre a paleta (fallback)", async ({ adminPage: page }) => {
    await page.waitForLoadState("networkidle");

    // Pressiona Ctrl+K (alternativa ao Cmd+K)
    await page.keyboard.press("Control+k");

    const dialog = page.locator('[role="dialog"][aria-label="Paleta de comandos"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });
  });

  test("navegar com setas e Enter na paleta", async ({ adminPage: page }) => {
    await page.waitForLoadState("networkidle");

    // Abre a paleta
    await page.keyboard.press("Meta+k");

    const dialog = page.locator('[role="dialog"][aria-label="Paleta de comandos"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Pressiona seta para baixo para mover o foco
    await page.keyboard.press("ArrowDown");

    // Pressiona Enter para navegar para o item selecionado
    await page.keyboard.press("Enter");

    // A paleta deve fechar apos navegacao
    await expect(dialog).not.toBeVisible({ timeout: 5000 });

    // A URL deve ter mudado (nao mais /dashboard, pois ArrowDown vai para o segundo item)
    await page.waitForLoadState("networkidle");
  });
});
