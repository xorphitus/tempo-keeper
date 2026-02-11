import { test, expect } from "@playwright/test";

test("app loads with correct title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Tempo Keeper - Metronome Training");
});

test.describe("count-in controls", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("count-in select is present with default value 0", async ({ page }) => {
    const countInSelect = page.locator("#count-in");
    await expect(countInSelect).toBeVisible();
    await expect(countInSelect).toHaveValue("0");
  });

  test("shows 'No count-in' help text when value is 0", async ({ page }) => {
    await expect(page.getByText("No count-in")).toBeVisible();
  });

  test("updates help text when count-in value changes", async ({ page }) => {
    const countInSelect = page.locator("#count-in");
    await countInSelect.selectOption("2");
    await expect(page.getByText("2 measures count-in before playing")).toBeVisible();
  });

  test("shows singular form for 1 measure count-in", async ({ page }) => {
    const countInSelect = page.locator("#count-in");
    await countInSelect.selectOption("1");
    await expect(page.getByText("1 measure count-in before playing")).toBeVisible();
  });

  test("count-in select is disabled while playing", async ({ page }) => {
    const countInSelect = page.locator("#count-in");
    await page.getByRole("button", { name: "Start" }).click();
    await expect(countInSelect).toBeDisabled();
    await page.getByRole("button", { name: "Stop" }).click();
    await expect(countInSelect).toBeEnabled();
  });
});

test.describe("count-in playback", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows Count-in label during count-in phase", async ({ page }) => {
    const countInSelect = page.locator("#count-in");
    await countInSelect.selectOption("2");

    await page.getByRole("button", { name: "Start" }).click();

    // During count-in, the measure label should show "Count-in" and status "(Count-in)"
    await expect(page.locator(".measure-number .label")).toHaveText("Count-in", { timeout: 2000 });
    await expect(page.locator(".measure-status")).toHaveText("(Count-in)", { timeout: 2000 });

    await page.getByRole("button", { name: "Stop" }).click();
  });

  test("transitions from count-in to normal playback", async ({ page }) => {
    // Use 1 count-in measure at fast tempo to transition quickly
    const countInSelect = page.locator("#count-in");
    await countInSelect.selectOption("1");

    // Set fast BPM for quicker transition
    const bpmInput = page.locator(".bpm-number");
    await bpmInput.fill("240");
    await bpmInput.blur();

    await page.getByRole("button", { name: "Start" }).click();

    // Should eventually show "Measure" label after count-in completes
    await expect(page.locator(".measure-number .label")).toHaveText("Measure", { timeout: 5000 });

    await page.getByRole("button", { name: "Stop" }).click();
  });

  test("count-in beats have purple styling", async ({ page }) => {
    const countInSelect = page.locator("#count-in");
    await countInSelect.selectOption("2");

    await page.getByRole("button", { name: "Start" }).click();

    // The measure value should have counting-in class during count-in
    await expect(page.locator(".measure-number .value.counting-in")).toBeVisible({
      timeout: 2000,
    });

    await page.getByRole("button", { name: "Stop" }).click();
  });

  test("no count-in when value is 0", async ({ page }) => {
    // Default is 0, so start should immediately show Measure
    await page.getByRole("button", { name: "Start" }).click();

    await expect(page.locator(".measure-number .label")).toHaveText("Measure", { timeout: 2000 });
    // Count-in styling should not appear
    await expect(page.locator(".measure-number .value.counting-in")).not.toBeVisible();

    await page.getByRole("button", { name: "Stop" }).click();
  });
});
