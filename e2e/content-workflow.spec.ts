import { test, expect } from "./fixtures";

test.describe("Workflow de Conteudo", () => {
  test("criar conteudo draft", async ({ adminPage: page }) => {
    await page.goto("/conteudos");
    await page.waitForLoadState("networkidle");

    // Click "Novo Conteudo" button
    await page.getByRole("button", { name: /Novo Conte/i }).click();

    // Wait for dialog
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Fill form — select first influencer and platform
    const influencerSelect = dialog.locator("select").first();
    await influencerSelect.waitFor({ state: "visible" });
    const influencerOptions = await influencerSelect.locator("option").all();
    if (influencerOptions.length > 1) {
      await influencerSelect.selectOption({ index: 1 });
    }

    const platformSelect = dialog.locator("select").nth(1);
    await platformSelect.selectOption("instagram");

    // Fill text
    await dialog.locator("textarea").fill("Teste E2E: conteudo criado via Playwright");

    // Submit
    await dialog.getByRole("button", { name: /Criar/i }).click();

    // Wait for dialog to close and verify content appears in list
    await expect(dialog).not.toBeVisible({ timeout: 10000 });

    // Content should appear in the list
    await expect(page.getByText("Teste E2E").first()).toBeVisible({ timeout: 10000 });
  });

  test("workflow completo: draft -> review -> approved", async ({ adminPage: page }) => {
    // Navigate to conteudos and find a draft
    await page.goto("/conteudos");
    await page.waitForLoadState("networkidle");

    // Click on first content item row to go to detail
    const rows = page.locator("table tbody tr");
    await rows.first().waitFor({ state: "visible", timeout: 10000 });
    await rows.first().click();

    // Wait for detail page
    await page.waitForURL(/\/conteudos\//);

    // Check if it's a draft — if so, submit for review
    const submitButton = page.getByRole("button", { name: /Enviar para Revis/i });
    if (await submitButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitButton.click();
      await expect(page.getByText(/Em Revis/i).first()).toBeVisible({ timeout: 5000 });
    }

    // If in review state, approve
    const approveButton = page.getByRole("button", { name: /Aprovar/i });
    if (await approveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await approveButton.click();
      await expect(page.getByText(/Aprovado/i).first()).toBeVisible({ timeout: 5000 });
    }
  });
});
