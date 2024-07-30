import fs from 'fs';
import path from 'path';
import { expect, test } from '@playwright/test';
import { parse } from 'csv-parse/sync';

const records = parse(fs.readFileSync(path.join(__dirname, 'input.csv')), {
  columns: true,
  skip_empty_lines: true
});

for (const record of records) {
  test(`${record.originalUrl}`, async ({ page }) => {
    await page.goto(record.originalUrl);
    await page.waitForLoadState('networkidle');
    let cleanOriginalUrl = record.originalUrl.replace(/[^a-zA-Z0-9]/g, '-')  + ".png";
    await expect(page).toHaveScreenshot(cleanOriginalUrl, { fullPage: true })
    await page.goto(record.comparisonUrl);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot(cleanOriginalUrl, { fullPage: true })
  });
}
