import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function capturePixels(canvas) {
  await canvas.evaluate((c) => {
    c.previousPixels = c
      .getContext('2d')
      .getImageData(0, 0, c.width, c.height).data;
  });
}
async function changedPixels(canvas, silhouette = false) {
  return canvas.evaluate((c, mask) => {
    const next = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let changed = 0,
      visible = 0;
    for (let i = 0; i < next.length; i += 4) {
      // The artwork uses a single tint: its moving geometry also changes alpha.
      if (!mask && next[i + 3] < 60 && c.previousPixels[i + 3] < 60) continue;
      visible++;
      if (
        mask
          ? next[i + 3] > 90 !== c.previousPixels[i + 3] > 90
          : Math.abs(next[i] - c.previousPixels[i]) +
              Math.abs(next[i + 1] - c.previousPixels[i + 1]) +
              Math.abs(next[i + 2] - c.previousPixels[i + 2]) +
              Math.abs(next[i + 3] - c.previousPixels[i + 3]) >
            25
      )
        changed++;
    }
    return changed / Math.max(1, mask ? next.length / 4 : visible);
  }, silhouette);
}

test('normal playback visibly moves, Pause freezes pixels, and Play resumes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const canvas = page.locator('.neural-stage canvas');
  await expect(
    page.getByRole('button', { name: 'Pause visualization' })
  ).toBeVisible();
  await capturePixels(canvas);
  await page.waitForTimeout(700);
  expect(await changedPixels(canvas)).toBeGreaterThan(0.1);
  await page.getByRole('button', { name: 'Pause visualization' }).click();
  await page.waitForTimeout(150);
  await capturePixels(canvas);
  await page.waitForTimeout(500);
  expect(await changedPixels(canvas)).toBe(0);
  await page.getByRole('button', { name: 'Play visualization' }).click();
  await page.waitForTimeout(600);
  expect(await changedPixels(canvas)).toBeGreaterThan(0.1);
});

test('modes have different geometry and useful controls with autoplay enabled', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  const canvas = page.locator('.neural-stage canvas');
  await page.getByRole('button', { name: 'Pause visualization' }).click();
  await page.evaluate(() => document.fonts.ready);
  await capturePixels(canvas);
  await page.getByRole('button', { name: /02 Signals/ }).click();
  await expect(page.locator('.mode-inspector')).toContainText(
    'Cardiac, neural, and respiratory'
  );
  await page.waitForTimeout(100);
  expect(await changedPixels(canvas, true)).toBeGreaterThan(0.01);
  await page.screenshot({ path: testInfo.outputPath('signals.png') });
  await capturePixels(canvas);
  await page.getByRole('button', { name: /03 Systems/ }).click();
  await expect(page.locator('.mode-inspector')).toContainText(
    'sites, computation, validation'
  );
  await page.waitForTimeout(100);
  expect(await changedPixels(canvas, true)).toBeGreaterThan(0.01);
  await page.screenshot({ path: testInfo.outputPath('systems.png') });
  const rate = page.getByRole('slider', { name: /Transfer playback rate/ });
  await rate.fill('2');
  await expect(page.locator('.scene-speed output')).toHaveText('2.0×');
  await page.getByRole('button', { name: 'Play visualization' }).click();
  await capturePixels(canvas);
  await page.waitForTimeout(650);
  expect(await changedPixels(canvas)).toBeGreaterThan(0.01);
});

test('scrolling transforms the research story and movement buttons navigate it', async ({
  page,
}) => {
  await page.goto('/#research-story');
  await expect(page.locator('.story-words h2')).toHaveText('First, listen.');
  await page.getByRole('button', { name: '02 Find the pattern.' }).click();
  await expect(page.locator('.story-words h2')).toHaveText('Find the pattern.');
  await expect(page.locator('.story-art canvas')).toHaveAttribute(
    'data-scene',
    'latent-atlas'
  );
  await page.getByRole('button', { name: '03 Make it matter.' }).click();
  await expect(page.locator('.story-words h2')).toHaveText('Make it matter.');
  await expect(page.locator('.story-art canvas')).toHaveAttribute(
    'data-scene',
    'compute-fabric'
  );
});

test('Exploration Log restores the WebGL globe, every waypoint, route replay and excursions', async ({
  page,
}, testInfo) => {
  test.setTimeout(60000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/#journeys');
  await expect(page.locator('.globe-viewport canvas')).toBeVisible({
    timeout: 30000,
  });
  await expect(page.getByRole('button', { name: 'Pause globe' })).toBeVisible();
  await expect(page.locator('.career-stop')).toHaveCount(10);
  await expect(page.locator('.excursion-chips button')).toHaveCount(9);
  await page.locator('.career-stop').filter({ hasText: 'Gainesville' }).click();
  await expect(page.locator('.expedition-readout')).toContainText(
    'Gainesville, USA'
  );
  await page
    .locator('.excursion-chips button')
    .filter({ hasText: 'Kuala Lumpur' })
    .click();
  await expect(page.locator('.coordinate-value')).toContainText('101.69° E');
  await page.getByRole('button', { name: 'Replay career route' }).click();
  await expect(page.getByRole('button', { name: 'Pause globe' })).toBeVisible();
  await page.mouse.move(50, 150);
  await page.waitForTimeout(1100);
  await page.screenshot({ path: testInfo.outputPath('exploration-log.png') });
  await page.getByRole('button', { name: 'Pause globe' }).click();
  await expect(page.getByRole('button', { name: 'Play globe' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('Exploration Log fits mobile screens and exposes accessible controls', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#journeys');
  await expect(page.locator('.globe-viewport canvas')).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath('mobile-exploration.png'),
  });
  await page.locator('.career-stop').filter({ hasText: 'Jaipur' }).click();
  await expect(
    page.locator('.career-stop').filter({ hasText: 'Jaipur' })
  ).toHaveAttribute('aria-pressed', 'true');
  expect(
    (
      await new AxeBuilder({ page })
        .include('#journeys')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    ).violations
  ).toEqual([]);
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
  }
});

for (const reducedMotion of ['reduce', 'no-preference']) {
  test(`Research Story animates every scene by default with ${reducedMotion} and supports pause`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto('/#research-story');
    const canvas = page.locator('.story-art canvas');
    await expect(
      page.getByRole('button', { name: 'Pause research story' })
    ).toBeVisible();
    for (const title of [
      '01 First, listen.',
      '02 Find the pattern.',
      '03 Make it matter.',
    ]) {
      await page.getByRole('button', { name: title, exact: true }).click();
      await page.waitForTimeout(1200);
      await capturePixels(canvas);
      await page.waitForTimeout(650);
      expect(await changedPixels(canvas)).toBeGreaterThan(0.1);
      if (reducedMotion === 'reduce')
        await page.screenshot({
          path: testInfo.outputPath(title.slice(0, 2) + '-story.png'),
        });
    }
    await page.getByRole('button', { name: 'Pause research story' }).click();
    await page.waitForTimeout(100);
    await capturePixels(canvas);
    await page.waitForTimeout(350);
    expect(await changedPixels(canvas)).toBe(0);
    await page.getByRole('button', { name: 'Play research story' }).click();
    await page.waitForTimeout(650);
    expect(await changedPixels(canvas)).toBeGreaterThan(0.1);
  });
}
