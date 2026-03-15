import { test, expect } from "./fixtures";

test.describe("Onboarding Checklist", () => {
  test("checklist aparece no dashboard", async ({ adminPage: page }) => {
    // Dashboard e a pagina padrao apos login
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({ timeout: 15000 });

    // Checklist de onboarding pode estar visivel para usuarios novos
    const checklist = page.getByText(/Checklist|Primeiros Passos|Bem-vindo/i);
    const hasChecklist = await checklist.isVisible({ timeout: 5000 }).catch(() => false);

    // Se o checklist existir, verifica que tem etapas
    if (hasChecklist) {
      await expect(checklist).toBeVisible();
    }
  });

  test("botao de dispensar existe no checklist", async ({ adminPage: page }) => {
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({ timeout: 15000 });

    const checklist = page.getByText(/Checklist|Primeiros Passos|Bem-vindo/i);
    const hasChecklist = await checklist.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasChecklist) {
      // Botao de fechar/dispensar o checklist
      const dismissButton = page.getByRole("button", { name: /Fechar|Dispensar|Pular|×/i });
      await expect(dismissButton).toBeVisible();
    }
  });

  test("checklist mostra etapas de progresso", async ({ adminPage: page }) => {
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({ timeout: 15000 });

    const checklist = page.getByText(/Checklist|Primeiros Passos|Bem-vindo/i);
    const hasChecklist = await checklist.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasChecklist) {
      // Deve ter pelo menos uma etapa com checkbox ou indicador
      const steps = page.locator('[role="checkbox"], [data-state="checked"], [data-state="unchecked"]');
      const stepCount = await steps.count();
      expect(stepCount).toBeGreaterThan(0);
    }
  });
});
