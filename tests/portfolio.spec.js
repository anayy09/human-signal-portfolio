import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('the story loads, chapter navigation follows the reader, and art can pause', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Intelligence.With a humanheartbeat.'
  );
  await page.getByRole('button', { name: '02 Signals', exact: true }).click();
  await expect(
    page.getByRole('button', { name: '02 Signals', exact: true })
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.neural-stage')).toHaveClass(/mode-signals/);
  await page.getByRole('button', { name: 'Pause visualization' }).click();
  await expect(
    page.getByRole('button', { name: 'Play visualization' })
  ).toBeVisible();
  await page.getByRole('link', { name: 'Explore my work' }).click();
  await expect(
    page
      .getByRole('navigation', { name: 'Main navigation', exact: true })
      .getByRole('link', { name: 'Selected work' })
  ).toHaveAttribute('aria-current', 'location');
  expect(errors).toEqual([]);
});

test('all projects are discoverable and a case study traps and restores keyboard focus', async ({
  page,
}) => {
  await page.goto('/#work');
  await expect(page.locator('.project-card')).toHaveCount(3);
  await page.getByRole('button', { name: 'All projects', exact: true }).click();
  await expect(page.locator('.project-card')).toHaveCount(7);
  await page
    .getByRole('button', { name: 'Systems', exact: true })
    .last()
    .click();
  await expect(page.locator('.project-card')).toHaveCount(1);
  await expect(page.locator('.project-card')).toContainText('FinMate');
  await page.getByRole('button', { name: 'Clinical AI', exact: true }).click();
  await expect(page.locator('.project-card')).toHaveCount(5);
  const opener = page.getByRole('button', {
    name: 'Explore EHR Timeline Triage case study',
  });
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole('heading', { name: 'EHR Timeline Triage' })
  ).toBeVisible();
  await expect(
    dialog.getByRole('link', { name: 'Explore the source' })
  ).toHaveAttribute('href', 'https://github.com/anayy09/EHR-Timeline-Triage');
  await page.keyboard.press('Shift+Tab');
  expect(
    await page.evaluate(() =>
      document.querySelector('dialog').contains(document.activeElement)
    )
  ).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test('research themes, all publications, and patent records can be explored', async ({
  page,
}) => {
  await page.goto('/#research');
  await page.getByRole('button', { name: 'Computation', exact: true }).click();
  await expect(page.locator('.lens-content')).toContainText('Bigger questions');
  await expect(
    page.getByRole('link', { name: 'Read the related paper' })
  ).toHaveAttribute('href', 'https://doi.org/10.29284/bfq8ev64');
  await page.getByRole('button', { name: 'View all 8 publications' }).click();
  await expect(page.locator('.publication')).toHaveCount(8);
  await page.locator('.publication summary').first().click();
  await expect(page.locator('.publication-detail').first()).toBeVisible();
  await page.locator('.patent summary').first().click();
  await expect(page.locator('.patent').first()).toContainText(
    'DE 20 2026 101 701 U1'
  );
});

test('career chapters and personal coordinates respond to selection', async ({
  page,
}) => {
  await page.goto('/#journey');
  await page
    .locator('#journey')
    .getByRole('button', { name: /GeeksforGeeks/ })
    .click();
  await expect(page.locator('.journey-detail')).toContainText('Next.js');
  await page.getByRole('button', { name: 'Education', exact: true }).click();
  await page
    .locator('#journey')
    .getByRole('button', { name: /JK Lakshmipat University/ })
    .click();
  await expect(page.locator('.journey-detail')).toContainText('Gold Medal');
  await page.goto('/#journeys');
  await page.locator('.career-stop').filter({ hasText: 'Jaipur' }).click();
  await expect(page.locator('.coordinate-value')).toContainText('26.91° N');
  await expect(page.locator('.expedition-readout')).toContainText('Home base');
});

test('contact form validates input and handles delivery and service failure without sending real mail', async ({
  page,
}) => {
  let requests = 0;
  await page.route('https://api.emailjs.com/**', async (route) => {
    requests++;
    await route.fulfill({ status: 200, contentType: 'text/plain', body: 'OK' });
  });
  await page.goto('/#contact');
  if ((await page.locator('.contact-form').count()) === 0) {
    await expect(page.getByRole('link', { name: 'Say hello' })).toHaveAttribute(
      'href',
      /^mailto:/
    );
    return;
  }
  await page.getByRole('button', { name: 'Send message' }).click();
  expect(requests).toBe(0);
  await page.getByLabel('Your name', { exact: true }).fill('Portfolio test');
  await page
    .getByLabel('Email address', { exact: true })
    .fill('test@example.com');
  await page
    .getByLabel('What’s on your mind?')
    .fill('Automated UI verification');
  await page
    .getByLabel('Your message', { exact: true })
    .fill('A test intercepted in the browser. No email is delivered.');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.locator('#contact').getByRole('status')).toContainText(
    'Message sent'
  );
  expect(requests).toBe(1);
  await expect(page.getByLabel('Your name', { exact: true })).toHaveValue('');
  await page.unroute('https://api.emailjs.com/**');
  await page.route('https://api.emailjs.com/**', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'text/plain',
      body: 'Service unavailable',
    })
  );
  await page.getByLabel('Your name', { exact: true }).fill('Portfolio test');
  await page
    .getByLabel('Email address', { exact: true })
    .fill('test@example.com');
  await page.getByLabel('What’s on your mind?').fill('Failure state');
  await page
    .getByLabel('Your message', { exact: true })
    .fill('Test failure state');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.locator('#contact').getByRole('status')).toContainText(
    'could not be sent'
  );
  await expect(page.getByLabel('Your message', { exact: true })).toHaveValue(
    'Test failure state'
  );
});

test('CV deep link serves a PDF and offers a route back', async ({
  page,
  request,
}) => {
  await page.goto('/cv');
  await expect(
    page.getByRole('heading', { name: 'Curriculum vitae.' })
  ).toBeVisible();
  const response = await request.get('/CV_Sinhal_Anay.pdf');
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toContain('application/pdf');
  await page.getByRole('link', { name: 'Back to the story' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Intelligence.'
  );
});

test('mobile navigation closes on selection and Escape, with no horizontal page overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open navigation' });
  await menu.click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation', exact: true })
    .getByRole('link', { name: 'Research', exact: false })
    .click();
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation', exact: true })
  ).toHaveCount(0);
  await expect(page).toHaveURL(/#research$/);
  await menu.click();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true);
  }
});

test('user-paused artwork is static and visual checkpoints render', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('button', { name: 'Pause visualization' }).click();
  await page.waitForTimeout(100);
  await expect(page.locator('.neural-stage .neural-canvas')).toBeVisible();
  const first = await page
    .locator('.neural-stage canvas')
    .evaluate((canvas) => canvas.toDataURL());
  await page.waitForTimeout(160);
  expect(
    await page
      .locator('.neural-stage canvas')
      .evaluate((canvas) => canvas.toDataURL())
  ).toBe(first);
  await page.screenshot({ path: testInfo.outputPath('desktop-hero.png') });
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('#work .section-heading')).toHaveCSS(
    'opacity',
    '1'
  );
  await page.screenshot({ path: testInfo.outputPath('desktop-work.png') });
  await page.locator('#research').scrollIntoViewIfNeeded();
  await expect(page.locator('#research .section-heading')).toHaveCSS(
    'opacity',
    '1'
  );
  await page.screenshot({ path: testInfo.outputPath('desktop-research.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: testInfo.outputPath('mobile-hero.png') });
});

test('the portfolio and study dialog pass automated WCAG A/AA checks', async ({
  page,
}) => {
  await page.goto('/');
  const audit = () =>
    new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
  expect((await audit()).violations).toEqual([]);
  await page
    .getByRole('button', { name: 'Explore EHR Timeline Triage case study' })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect((await audit()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  expect((await audit()).violations).toEqual([]);
});
