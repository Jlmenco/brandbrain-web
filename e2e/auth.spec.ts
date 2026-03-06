import { test, expect } from "@playwright/test";
import { USERS } from "./fixtures";

test.describe("Autenticacao", () => {
  test("login com credenciais validas redireciona para dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.fill("input#email", USERS.admin.email);
    await page.fill("input#password", USERS.admin.password);
    await page.click('button[type="submit"]');

    await page.waitForURL("**/dashboard");
    await expect(page).toHaveURL(/dashboard/);
  });

  test("login com credenciais invalidas mostra erro", async ({ page }) => {
    await page.goto("/login");

    await page.fill("input#email", "wrong@email.com");
    await page.fill("input#password", "wrongpassword");
    await page.click('button[type="submit"]');

    // Should stay on login and show error
    await expect(page).toHaveURL(/login/);
    await expect(page.locator(".text-destructive")).toBeVisible({ timeout: 10000 });
  });

  test("acesso sem auth redireciona para login", async ({ page }) => {
    // Clear any existing token
    await page.goto("/login");
    await page.evaluate(() => localStorage.removeItem("bb_token"));

    await page.goto("/dashboard");
    await page.waitForURL("**/login");
    await expect(page).toHaveURL(/login/);
  });
});
