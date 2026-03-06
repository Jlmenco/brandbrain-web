import { test as base, type Page } from "@playwright/test";

const USERS = {
  admin: { email: "admin@brandbrain.dev", password: "admin123" },
  editor: { email: "editor@brandbrain.dev", password: "editor123" },
  viewer: { email: "viewer@brandbrain.dev", password: "viewer123" },
};

type Role = keyof typeof USERS;

async function loginViaApi(page: Page, role: Role = "admin") {
  const creds = USERS[role];

  // Login via API to get token
  const response = await page.request.post("http://localhost/api/auth/login", {
    data: { email: creds.email, password: creds.password },
  });
  const { access_token } = await response.json();

  // Navigate to the app origin first so we can set localStorage
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.evaluate((token: string) => {
    localStorage.setItem("bb_token", token);
  }, access_token);

  // Navigate to dashboard (authenticated area)
  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  await page.waitForURL("**/dashboard", { timeout: 30000 });
}

export const test = base.extend<{ adminPage: Page; editorPage: Page; viewerPage: Page }>({
  adminPage: async ({ page }, use) => {
    await loginViaApi(page, "admin");
    await use(page);
  },
  editorPage: async ({ page }, use) => {
    await loginViaApi(page, "editor");
    await use(page);
  },
  viewerPage: async ({ page }, use) => {
    await loginViaApi(page, "viewer");
    await use(page);
  },
});

export { expect } from "@playwright/test";
export { loginViaApi, USERS };
