import { test, expect } from '@playwright/test';

const sizes = [[320,568],[360,800],[375,812],[390,844],[412,915],[430,932],[768,1024],[820,1180],[844,390],[1023,600]] as const;
for (const [width,height] of sizes) {
  test(`touch layout ${width}×${height}: sections, menu, skills and terminal`, async ({ browser }) => {
    const context = await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true});
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {if(message.type()==='error') errors.push(message.text());});
    await page.goto(process.env.TEST_BASE_URL || 'http://localhost:3000', {waitUntil:'networkidle'});
    await expect(page.locator('body')).toHaveCSS('background-color','rgb(22, 22, 22)');
    await page.waitForTimeout(800);
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.classList.contains('lenis'))).toBe(false);
    if(width < 768) expect(await page.locator('.hero').evaluate(el=>el.clientHeight)).toBeLessThan(650);
    const menu=page.locator('.menu-toggle');
    await menu.tap();
    await expect(menu).toHaveAttribute('aria-expanded','true');
    expect(await page.evaluate(()=>getComputedStyle(document.body).overflow)).toBe('hidden');
    await page.getByRole('navigation').getByRole('link',{name:'About'}).tap();
    await expect(menu).toHaveAttribute('aria-expanded','false');
    expect(await page.evaluate(()=>getComputedStyle(document.body).overflow)).not.toBe('hidden');
    for(const id of ['home','work','project-01','project-02','project-03','project-04','about','skills','terminal','experience','contact']) {
      const section=page.locator('#'+id);
      await section.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));
      await page.waitForTimeout(650);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id).toBe(true);
      const outside=await section.locator('h1,h2,h3,p,.email-link').evaluateAll(elements=>elements.filter(el=>{const r=el.getBoundingClientRect();return r.right>innerWidth+1||r.left<0;}).map(el=>el.textContent));
      expect(outside,id).toEqual([]);
      await section.screenshot({path:`research/responsive-verified/${width}-${id}.png`});
    }
    for(const project of await page.locator('.project-panel').all()) {
      const positions=await project.evaluate(el=>['h3','.project-media','.project-description','.project-links'].map(selector=>el.querySelector(selector)!.getBoundingClientRect().top));
      expect(positions[0]).toBeLessThan(positions[1]);expect(positions[1]).toBeLessThan(positions[2]);expect(positions[2]).toBeLessThan(positions[3]);
      await expect(project.locator('.project-links a').first()).toHaveAttribute('href',/^https:\/\//);
    }
    await expect.poll(()=>page.locator('img').evaluateAll(images=>images.every(img=>(img as HTMLImageElement).complete&&(img as HTMLImageElement).naturalWidth>0))).toBe(true);
    const skill=page.locator('.build-row button').nth(1);
    await skill.tap();await expect(skill).toHaveAttribute('aria-expanded','true');
    await skill.tap();await expect(skill).toHaveAttribute('aria-expanded','false');
    const input=page.getByRole('textbox',{name:'Terminal command'});
    await expect(input).toHaveCSS('font-size','16px');
    await input.fill('secret');await input.press('Enter');await expect(page.locator('.secret-output')).toContainText('undocumented contributor');
    for(const command of ['help','whoami','projects','skills','github','contact','clear']) {await input.fill(command);await input.press('Enter');}
    await expect(page.locator('.terminal-entry')).toHaveCount(0);
    await input.fill('x'.repeat(120));await input.press('Enter');
    expect(await page.locator('.terminal-scroll').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
    for(const link of await page.locator('.contact-socials a,.project-links a,.terminal-input-row button,.menu-toggle,.wordmark').all()) {
      expect(await link.evaluate(el=>el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    }
    await page.setViewportSize({width,height:340});await input.focus();await page.waitForTimeout(250);
    expect(await input.evaluate(el=>el.getBoundingClientRect().bottom)).toBeLessThanOrEqual(341);
    await input.fill('whoami');await input.press('Enter');await expect(page.locator('.terminal-entry').last()).toContainText('Kuy Daly');
    expect(errors).toEqual([]);
    await context.close();
  });
}

test('menu releases scrolling and hidden focus targets when changing breakpoints', async ({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/');
  await page.locator('.menu-toggle').click();await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded','true');
  await page.keyboard.press('Escape');await expect(page.locator('.menu-toggle')).toBeFocused();
  await page.locator('.menu-toggle').click();await page.setViewportSize({width:1440,height:900});
  await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded','false');
  expect(await page.evaluate(()=>document.body.style.overflow)).toBe('');
  expect(await page.locator('nav').evaluate(el=>(el as HTMLElement).inert)).toBe(false);
  await page.setViewportSize({width:820,height:1180});await expect(page.locator('.pin-spacer')).toHaveCount(0);
  expect(await page.locator('nav').evaluate(el=>(el as HTMLElement).inert)).toBe(true);
});


test('native touch scrolling and mobile keyboard navigation remain usable', async ({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const page=await context.newPage();await page.goto(process.env.TEST_BASE_URL || 'http://localhost:3000');await page.waitForTimeout(700);
  const client=await context.newCDPSession(page);
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:720}]});
  for(const y of [650,580,510,440,370]) {await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y}]});await page.waitForTimeout(20);}
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(200);
  expect(await page.evaluate(()=>document.documentElement.classList.contains('lenis'))).toBe(false);
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  const toggle=page.locator('.menu-toggle');await toggle.click();await toggle.focus();
  await page.keyboard.press('Shift+Tab');await expect(page.getByRole('navigation').getByRole('link',{name:'Contact'})).toBeFocused();
  await page.keyboard.press('Tab');await expect(toggle).toBeFocused();
  await page.keyboard.press('Escape');await expect(toggle).toHaveAttribute('aria-expanded','false');
  await page.keyboard.press('Tab');expect(await page.locator('.skip-link').evaluate(el=>el.getBoundingClientRect().bottom)).toBeLessThan(0);
  await context.close();
});
