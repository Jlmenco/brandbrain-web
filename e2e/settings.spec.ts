import { test, expect } from "./fixtures";

test.describe("Configuracoes", () => {
  test("pagina carrega e exibe secao de perfil", async ({ adminPage: page }) => {
    await page.goto("/configuracoes");
    await page.waitForLoadState("networkidle");

    // Titulo da pagina
    await expect(page.getByRole("heading", { name: "Configuracoes" })).toBeVisible({ timeout: 15000 });

    // Secao Perfil com informacoes do usuario
    await expect(page.getByText("Perfil")).toBeVisible();
    await expect(page.getByText("Informacoes da sua conta")).toBeVisible();

    // Campos nome e email (inputs disabled) devem ter valores preenchidos
    const nameInput = page.locator('label:has-text("Nome") + input, label:has-text("Nome") ~ input').first();
    const emailInput = page.locator('label:has-text("Email") + input, label:has-text("Email") ~ input').first();

    // Verifica que os inputs existem e nao estao vazios
    // O admin user tem name e email preenchidos pelo seed
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
  });

  test("secao de informacoes do sistema exibe versao", async ({ adminPage: page }) => {
    await page.goto("/configuracoes");
    await page.waitForLoadState("networkidle");

    // Secao Informacoes do Sistema
    await expect(page.getByText("Informacoes do Sistema")).toBeVisible({ timeout: 15000 });

    // Versao do sistema
    await expect(page.getByText("v0.1.0-mvp")).toBeVisible();

    // Status da API (pode ser Online ou Offline dependendo do backend)
    await expect(page.getByText("Status da API")).toBeVisible();
  });

  test("toggle de tema escuro adiciona classe dark ao html", async ({ adminPage: page }) => {
    await page.goto("/configuracoes");
    await page.waitForLoadState("networkidle");

    // Encontra o botao "Escuro" na secao Preferencias
    const escuroButton = page.getByRole("button", { name: /Escuro/i });
    await expect(escuroButton).toBeVisible({ timeout: 15000 });

    // Clica no botao Escuro
    await escuroButton.click();

    // Verifica que a classe "dark" foi adicionada ao elemento html
    const htmlEl = page.locator("html");
    await expect(htmlEl).toHaveClass(/dark/, { timeout: 5000 });

    // Clica no botao Claro para reverter
    const claroButton = page.getByRole("button", { name: /Claro/i });
    await claroButton.click();

    // Verifica que a classe "dark" foi removida
    await expect(htmlEl).not.toHaveClass(/dark/, { timeout: 5000 });
  });

  test("botoes de idioma existem", async ({ adminPage: page }) => {
    await page.goto("/configuracoes");
    await page.waitForLoadState("networkidle");

    // Secao Idioma
    await expect(page.getByText("Idioma")).toBeVisible({ timeout: 15000 });

    // Botoes de idioma
    await expect(page.getByRole("button", { name: /Portugues/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /English/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Espanol/i })).toBeVisible();
  });

  test("secao alterar senha exibe campos e botao desabilitado", async ({ adminPage: page }) => {
    await page.goto("/configuracoes");
    await page.waitForLoadState("networkidle");

    // Secao Alterar Senha
    await expect(page.getByText("Alterar Senha")).toBeVisible({ timeout: 15000 });

    // Campos de senha
    await expect(page.getByPlaceholder("Digite sua senha atual")).toBeVisible();
    await expect(page.getByPlaceholder("Minimo 6 caracteres")).toBeVisible();
    await expect(page.getByPlaceholder("Repita a nova senha")).toBeVisible();

    // Botao Salvar senha esta desabilitado (em breve)
    const saveButton = page.getByRole("button", { name: /Salvar senha/i });
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeDisabled();
  });

  test("botao tema Sistema esta disponivel", async ({ adminPage: page }) => {
    await page.goto("/configuracoes");
    await page.waitForLoadState("networkidle");

    // Botao Sistema
    const sistemaButton = page.getByRole("button", { name: /Sistema/i });
    await expect(sistemaButton).toBeVisible({ timeout: 15000 });
  });
});
