import { expect, test } from '@playwright/test';
import { databaseWipe } from './fixtures/helpers.js';

test.describe('Assets', () => {
	test.beforeEach(async ({ baseURL }) => {
		await databaseWipe(baseURL!);
	});

	test('A new asset can be added and updated', async ({ page }) => {
		// Check no assets exist
		await page.goto('/');
		await page.locator('a', { hasText: 'Balance sheet' }).click();
		await expect(page.locator('h1', { hasText: 'Balance sheet' })).toBeVisible();
		expect(await page.locator('.card', { hasText: 'Cash' }).textContent()).toMatch('$0');
		expect(await page.locator('.card', { hasText: 'Investment' }).textContent()).toMatch('$0');

		const balanceTypeGroup = page.locator('.balanceSheet__typeGroup');
		expect(await balanceTypeGroup.count()).toBe(0);

		const isSoldCheckbox = page.locator('.formInputCheckbox__input[name=isSold]');
		const nameInput = page.locator('.formInput__input[name=name]');
		const symbolInput = page.locator('.formInput__input[name=symbol]');
		const quantityInput = page.locator('.formInput__input[name=quantity]');
		const costInput = page.locator('.formInput__input[name=cost]');
		const valueInput = page.locator('.formInput__input[name=value]');
		const assetTypeSelect = page.locator('.formSelect__select[name=assetTypeId]');
		const balanceGroupSelect = page.locator('.formSelect__select[name=balanceGroup]');

		// Add a new asset of type "Security" (which `isQuantifiable`)
		await page.locator('a', { hasText: 'Add asset' }).click();
		await expect(page.locator('h1', { hasText: 'Add asset' })).toBeVisible();
		await expect(page.locator('button', { hasText: 'Add' })).toBeDisabled();
		await expect(symbolInput).not.toBeVisible();

		await nameInput.fill('GameStop');
		await assetTypeSelect.selectOption({ label: 'Security' });
		await balanceGroupSelect.selectOption({ label: 'Investments' });
		await expect(symbolInput).toBeVisible();
		await expect(page.locator('button', { hasText: 'Add' })).not.toBeDisabled();
		await expect(page.locator('section', { hasText: 'New asset' })).toBeVisible();
		await expect(page.locator('section', { hasText: 'Update asset' })).not.toBeVisible();

		await symbolInput.fill('GME');
		const statusBar = page.locator('.statusBar');
		await expect(statusBar).not.toHaveClass(/statusBar--positive/);
		expect(await statusBar.textContent()).not.toMatch('The asset was added successfully');

		await page.locator('button', { hasText: 'Add' }).click();
		await expect(statusBar).toHaveClass(/statusBar--positive/);
		expect(await statusBar.textContent()).toMatch('The asset was added successfully');

		// Check the asset was created successfully
		await page.locator('button', { hasText: 'Dismiss' }).click();
		await expect(page.locator('h1', { hasText: 'Balance sheet' })).toBeVisible();
		expect(await balanceTypeGroup.textContent()).toMatch('GameStop');
		expect(await balanceTypeGroup.textContent()).toMatch('$0');
		expect(await balanceTypeGroup.count()).toBe(1);

		await page.locator('a', { hasText: 'GameStop' }).click();
		await expect(page.locator('h1', { hasText: 'GameStop' })).toBeVisible();
		await expect(nameInput).toHaveValue('GameStop');
		await expect(symbolInput).toHaveValue('GME');
		expect(await assetTypeSelect.textContent()).toMatch('Security');
		expect(await balanceGroupSelect.textContent()).toMatch('Investments');
		await expect(page.locator('section', { hasText: 'Update asset' })).toBeVisible();
		await expect(page.locator('section', { hasText: 'New asset' })).not.toBeVisible();

		// Update the asset
		await quantityInput.fill('4.20');
		await costInput.fill('69');
		await expect(valueInput).toBeDisabled();
		await expect(valueInput).toHaveValue('289.8');
		expect(await statusBar.textContent()).not.toMatch('The asset was updated successfully');

		await page.locator('button', { hasText: 'Save' }).click();
		await expect(statusBar).toHaveClass(/statusBar--positive/);
		expect(await statusBar.textContent()).toMatch('The asset was updated successfully');

		// Check the account was updated successfully
		await page.locator('button', { hasText: 'Dismiss' }).click();
		await page.locator('a', { hasText: 'Balance sheet' }).click();
		expect(await balanceTypeGroup.count()).toBe(1);
		expect(await balanceTypeGroup.textContent()).toMatch('Security');
		expect(await balanceTypeGroup.textContent()).toMatch('GameStop');
		expect(await balanceTypeGroup.textContent()).toMatch('$290');

		await page.locator('a', { hasText: 'GameStop' }).click();
		await expect(quantityInput).toBeVisible();
		await expect(costInput).toBeVisible();
		await expect(symbolInput).toBeVisible();

		// Check that the asset's available fields change when the type is one that's not "quantifiable"
		await assetTypeSelect.selectOption({ label: 'Business' });
		await balanceGroupSelect.selectOption({ label: 'Other assets' });
		await expect(symbolInput).not.toBeVisible();
		await expect(quantityInput).not.toBeVisible();
		await expect(costInput).not.toBeVisible();
		await expect(isSoldCheckbox).not.toBeChecked();

		await isSoldCheckbox.check();
		await page.locator('button', { hasText: 'Save' }).click();
		await page.locator('a', { hasText: 'GameStop' }).click();
		expect(await assetTypeSelect.textContent()).toMatch('Business');
		expect(await balanceGroupSelect.textContent()).toMatch('Other assets');
		await expect(isSoldCheckbox).toBeChecked();
		await expect(valueInput).toHaveValue('289.8');
		await expect(isSoldCheckbox).toBeChecked();

		// Check the asset type was updated successfully
		await page.locator('a', { hasText: 'Balance sheet' }).click();
		await expect(page.locator('h1', { hasText: 'Balance sheet' })).toBeVisible();
		expect(await balanceTypeGroup.count()).toBe(1);
		expect(await balanceTypeGroup.textContent()).toMatch('Business');
		expect(await balanceTypeGroup.textContent()).toMatch('GameStop');
		expect(await balanceTypeGroup.textContent()).toMatch('$290');

		// Another asset with the same name can't be created
		await page.locator('a', { hasText: 'Add asset' }).click();
		await expect(page.locator('h1', { hasText: 'Add asset' })).toBeVisible();
		const inputError = page.locator('.formInput__error');
		await expect(inputError).not.toBeVisible();

		await nameInput.fill('GameStop');
		await page.locator('button', { hasText: 'Dismiss' }).click();
		await page.locator('button', { hasText: 'Add' }).click();
		await expect(inputError).toBeVisible();
		expect(await inputError.textContent()).toMatch('An asset with the same name already exists');
		await expect(statusBar).not.toHaveClass(/statusBar--positive/);
		expect(await statusBar.textContent()).not.toMatch('The asset was added successfully');

		// Check an asset can't be edited to have the same name as another asset
		await nameInput.fill('AMC Entertainment Holdings Inc');
		await page.locator('button', { hasText: 'Add' }).click();
		await expect(statusBar).toHaveClass(/statusBar--positive/);
		expect(await statusBar.textContent()).toMatch('The asset was added successfully');

		await page.locator('a', { hasText: 'AMC Entertainment Holdings Inc' }).click();
		await expect(page.locator('h1', { hasText: 'AMC Entertainment Holdings Inc' })).toBeVisible();

		// Rename using an existing asset name
		await nameInput.fill('GameStop');
		await expect(inputError).not.toBeVisible();

		await page.locator('button', { hasText: 'Save' }).click();
		expect(await inputError.textContent()).toMatch('An asset with the same name already exists');
	});
});