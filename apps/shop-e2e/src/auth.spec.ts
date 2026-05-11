import { test, expect } from '@playwright/test';

const baseUrl = 'http://localhost:4200';

test.describe('Authentication', () => {
  test('should register a new user, auto-login, logout, then login again', async ({
    page,
  }) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const email = `test-${timestamp}-${random}@example.com`;
    const name = `Test User ${random}`;
    const password = 'Test123!';

    await page.goto(`${baseUrl}/register`);
    await page.fill('input[placeholder="Full name"]', name);
    await page.fill('input[placeholder="Email address"]', email);
    await page.fill(
      'input[placeholder="Password (min 6 characters)"]',
      password,
    );
    await page.getByTestId('terms-checkbox').check();
    await page.click('button[type="submit"]');

    await page.waitForURL(`${baseUrl}/products`);
    await expect(page.getByTestId('avatar')).toBeVisible();
    await expect(page.getByTestId('avatar')).toHaveText(
      name.charAt(0).toUpperCase(),
    );

    const cookies = await page.context().cookies();
    const tokenCookie = cookies.find((c) => c.name === 'token');
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie?.httpOnly).toBe(true);

    await page.getByTestId('avatar').click();
    await page.getByTestId('logout-button').click();
    await page.waitForURL(`${baseUrl}/login`);

    await page.fill('input[placeholder="Email address"]', email);
    await page.fill('input[placeholder="Password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${baseUrl}/products`);
    await expect(page.getByTestId('avatar')).toBeVisible();
    await expect(page.getByTestId('avatar')).toHaveText(
      name.charAt(0).toUpperCase(),
    );
  });

  test('invalid login shows error and stays on login page', async ({
    page,
  }) => {
    const randomEmail = `nonexistent-${Date.now()}-${Math.random()}@example.com`;
    await page.goto(`${baseUrl}/login`);
    await page.fill('input[placeholder="Email address"]', randomEmail);
    await page.fill('input[placeholder="Password"]', 'wrongpassword');

    await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes('/api/auth/login') && resp.status() === 401,
      ),
      page.click('button[type="submit"]'),
    ]);

    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('login-error')).toContainText(
      'Invalid credentials',
    );
    await expect(page).toHaveURL(`${baseUrl}/login`);
  });
});
