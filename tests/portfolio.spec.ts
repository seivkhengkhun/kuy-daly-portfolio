import { test, expect, type Page } from "@playwright/test";

async function open(page: Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#hero-title")).toBeVisible();
}
async function run(page: Page, command: string) {
  const input = page.getByRole("textbox", { name: "Terminal command" });
  await input.fill(command);
  await input.press("Enter");
}

test("desktop loads without runtime errors or invalid navigation targets", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", msg => { if (msg.type() === "error") errors.push(msg.text()); });
  await open(page);
  await page.waitForTimeout(1500);
  const broken = await page.locator("a").evaluateAll(links => links.map(link => link.getAttribute("href") || "").filter(href => !href || href === "#" || (href.startsWith("#") && !document.querySelector(href))));
  expect(broken).toEqual([]);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator(".secret-output")).toHaveCount(0);
  await expect(page.getByText("There's one undocumented contributor.", { exact: false })).toHaveCount(0);
});

test("desktop vertical scroll drives all four project panels horizontally", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  await expect(page.locator(".work-pin")).toHaveClass(/motion-horizontal/);
  await page.locator(".hero-work-link").click();
  await expect.poll(() => page.locator("#work").evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(110);
  const start = await page.locator(".work-pin").evaluate(el => el.getBoundingClientRect().top + scrollY);
  for (let i = 0; i < 4; i++) {
    await page.evaluate(top => window.scrollTo({ top, behavior: "instant" }), start + i * 1440 + 3);
    await page.waitForTimeout(1300);
    const panel = page.locator(`#project-0${i + 1}`);
    expect(Math.abs(await panel.evaluate(el => el.getBoundingClientRect().left))).toBeLessThan(15);
    await expect(panel.locator("h3")).toBeVisible();
    await expect(panel.locator("h3")).toHaveCSS("opacity", "1");
    await expect(panel.locator(".project-description")).toHaveCSS("opacity", "1");
    await expect(panel.locator(".project-links")).toHaveCSS("opacity", "1");
    if (i === 1 || i === 2) {
      await expect.poll(() => panel.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    }
  }
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await page.screenshot({ path: "research/screenshots/desktop-horizontal-final.png" });
});

test("keyboard focus brings offscreen project links into view", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  await page.keyboard.press("Tab");
  await page.locator("#project-03 .project-links a").first().focus();
  await expect.poll(() => page.locator("#project-03").evaluate(el => Math.abs(el.getBoundingClientRect().left))).toBeLessThan(25);
});

for (const [name, width, height] of [["tablet", 820, 1180], ["mobile", 390, 844], ["small mobile", 320, 740], ["compact desktop", 1366, 600]] as const) {
  test(`${name}: vertical projects, working navigation and no overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await open(page);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator(".work-track")).toHaveCSS("display", "block");
    for (const heading of await page.locator(".project-panel h3").all()) await expect(heading).toHaveCSS("opacity", "1");
    if (width < 768) {
      const menu = page.locator(".menu-toggle");
      await menu.click();
      await expect(menu).toHaveAttribute("aria-expanded", "true");
      await page.getByRole("navigation").getByRole("link", { name: "About" }).click();
      await expect(page.getByRole("button", { name: "MENU +" })).toHaveAttribute("aria-expanded", "false");
    }
    for (const id of ["project-01", "project-02", "project-03", "project-04", "about", "skills", "terminal", "experience", "contact"]) {
      await page.locator(`#${id}`).evaluate(el => el.scrollIntoView({ behavior: "instant", block: "start" }));
      await page.waitForTimeout(250);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${id}`).toBe(true);
    }
    await expect(page.locator(".project-screenshot").first()).toBeVisible();
    await expect.poll(() => page.locator(".project-screenshot").evaluateAll(imgs => imgs.every(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
  });
}

test("every terminal command, history, completion, clear and error response work", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page);
  await page.locator("#terminal").scrollIntoViewIfNeeded();
  await run(page, "help");
  await expect(page.locator(".terminal-entry").last()).toContainText("Available commands:");
  await run(page, "whoami");
  await expect(page.locator(".terminal-entry").last()).toContainText("Information Technology student");
  await run(page, "projects");
  await expect(page.locator(".terminal-entry").last()).toContainText("Library system");
  await expect(page.locator(".terminal-entry").last().getByRole("link")).toHaveAttribute("href", "#work");
  await run(page, "skills");
  await expect(page.locator(".terminal-entry").last()).toContainText("IN THE CODE");
  await run(page, "github");
  await expect(page.locator(".terminal-entry").last().getByRole("link")).toHaveAttribute("href", "https://github.com/DalyTechie");
  await run(page, "contact");
  await expect(page.locator(".terminal-entry").last().getByRole("link")).toHaveAttribute("href", "mailto:kuydalyy@gmail.com");
  await run(page, "secret");
  await expect(page.locator(".secret-output")).toContainText("There's one undocumented contributor.");
  await expect(page.locator(".secret-output")).toContainText("♥");
  const input = page.getByRole("textbox", { name: "Terminal command" });
  await input.press("ArrowUp"); await expect(input).toHaveValue("secret");
  await input.press("ArrowUp"); await expect(input).toHaveValue("contact");
  await input.press("ArrowDown"); await expect(input).toHaveValue("secret");
  await input.fill("who"); await input.press("Tab"); await expect(input).toHaveValue("whoami");
  await run(page, "unknown-command");
  await expect(page.locator(".terminal-entry").last()).toContainText("Command not found");
  await run(page, "<script>alert(1)</script>");
  await expect(page.locator(".terminal-entry").last()).toContainText("<script>alert(1)</script>");
  await run(page, "clear");
  await expect(page.locator(".terminal-entry")).toHaveCount(0);
  await expect(page.locator(".secret-output")).toHaveCount(0);
  await run(page, " WHOAMI ");
  await expect(page.locator(".terminal-entry").last()).toContainText("Kuy Daly");
});

test("interactive stack works with click and keyboard", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page);
  await page.getByRole("button", { name: "02 Backend systems" }).click();
  await expect(page.locator("#area-02")).toBeVisible();
  await expect(page.locator("#area-01")).toBeHidden();
  const api = page.getByRole("button", { name: "03 REST APIs" });
  await api.focus(); await api.press("Enter");
  // Focus opens it; Enter intentionally collapses it.
  await expect(api).toHaveAttribute("aria-expanded", "false");
  await api.press("Enter");
  await expect(page.locator("#area-03")).toBeVisible();
});

test("reduced motion and breakpoint changes clean up and recreate one pin", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  for (let i = 0; i < 3; i++) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator(".work-track")).toHaveCSS("display", "block");
    expect(await page.locator(".work-track").evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41)).toBe(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
});

test("all header links and footer return navigate to their target", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  for (const [label, id] of [["Work", "work"], ["About", "about"], ["Playground", "terminal"], ["Contact", "contact"]]) {
    await page.locator(".wordmark").evaluate(el => el.scrollIntoView({ behavior: "instant" }));
    await page.getByRole("navigation").getByRole("link", { name: label, exact: true }).click();
    await expect.poll(() => page.locator(`#${id}`).evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(20);
  }
  await page.getByRole("link", { name: "BACK TO TOP" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5);
});

test("portfolio remains readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(process.env.TEST_BASE_URL || "http://localhost:3000");
  await expect(page.locator(".work-track")).toHaveCSS("display", "block");
  await expect(page.locator(".project-panel")).toHaveCount(4);
  await page.locator("#project-04").scrollIntoViewIfNeeded();
  await expect(page.locator("#project-04 h3")).toBeVisible();
  await context.close();
});
