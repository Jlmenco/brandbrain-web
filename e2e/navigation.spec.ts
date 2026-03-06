import { test, expect } from "./fixtures";

test.describe("Navegacao", () => {
  test("sidebar navega entre paginas", async ({ adminPage: page }) => {
    // Navigate to each page via sidebar links
    const pages = [
      { name: /Dashboard/i, url: /dashboard/ },
      { name: /Conte/i, url: /conteudos/ },
      { name: /Influen/i, url: /influenciadores/ },
      { name: /Campanha/i, url: /campanhas/ },
      { name: /Leads/i, url: /leads/ },
      { name: /Hist/i, url: /historico/ },
    ];

    for (const p of pages) {
      await page.getByRole("link", { name: p.name }).first().click();
      await page.waitForURL(p.url);
      await expect(page).toHaveURL(p.url);
    }
  });

  test("viewer nao ve botoes de criacao", async ({ viewerPage: page }) => {
    await page.goto("/conteudos");
    await page.waitForLoadState("networkidle");

    // Viewer should NOT see "Novo Conteudo" button
    await expect(page.getByRole("button", { name: /Novo Conte/i })).not.toBeVisible({ timeout: 5000 });

    await page.goto("/influenciadores");
    await page.waitForLoadState("networkidle");

    // Viewer should NOT see "Novo Influenciador" button
    await expect(page.getByRole("button", { name: /Novo Influen/i })).not.toBeVisible({ timeout: 5000 });
  });

  test("editor ve botoes de criacao de conteudo", async ({ editorPage: page }) => {
    await page.goto("/conteudos");
    await page.waitForLoadState("networkidle");

    // Editor should see "Novo Conteudo" button
    await expect(page.getByRole("button", { name: /Novo Conte/i })).toBeVisible({ timeout: 10000 });
  });
});
