import { test, expect } from "@playwright/test";

test("app loads with correct title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Tempo Keeper - Metronome Training");
});
