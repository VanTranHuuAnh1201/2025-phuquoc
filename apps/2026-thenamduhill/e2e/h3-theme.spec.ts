import { test, expect } from '@playwright/test'

test.describe('Theme H3 & Theme Switching E2E Tests', () => {

    test('should display Theme Hub page with H3 card and navigate to H3 theme', async ({ page }) => {
        await page.goto('/')

        // Verify Hub page header
        await expect(page.locator('h1')).toContainText(/Chọn giao diện|Choose your interface/)

        // Locate H3 card link
        const h3Link = page.locator('a[href*="/h3"]').first()
        await expect(h3Link).toBeVisible()

        // Click H3 theme card and check URL
        await h3Link.click()
        await expect(page).toHaveURL(/\/(h3)(\?.*)?$/)
    })

    test('should render H3 home page correctly', async ({ page }) => {
        const response = await page.goto('/h3')
        expect(response?.status()).toBe(200)

        // Verify document title contains resort brand
        await expect(page).toHaveTitle(/The Nam Du Hill|Nam Du Hill Resort/i)

        // Verify main body element exists and is visible
        await expect(page.locator('body')).toBeVisible()
    })

    test('should navigate across H3 theme pages', async ({ page }) => {
        // Test Rooms page
        await page.goto('/h3/rooms')
        await expect(page).toHaveURL(/\/h3\/rooms/)
        await expect(page.locator('body')).toBeVisible()

        // Test Dining page
        await page.goto('/h3/dining')
        await expect(page).toHaveURL(/\/h3\/dining/)
        await expect(page.locator('body')).toBeVisible()

        // Test Gallery page
        await page.goto('/h3/gallery')
        await expect(page).toHaveURL(/\/h3\/gallery/)
        await expect(page.locator('body')).toBeVisible()

        // Test Contact page
        await page.goto('/h3/contact')
        await expect(page).toHaveURL(/\/h3\/contact/)
        await expect(page.locator('body')).toBeVisible()

        // Test Checkout page
        await page.goto('/h3/checkout')
        await expect(page).toHaveURL(/\/h3\/checkout/)
        await expect(page.locator('body')).toBeVisible()
    })

    test('should seamlessly switch between H1, H2, H3 and H4 themes', async ({ page }) => {
        // Start at Theme H1
        await page.goto('/h1')
        await expect(page).toHaveURL(/\/h1/)

        // Switch to Theme H3
        await page.goto('/h3')
        await expect(page).toHaveURL(/\/h3/)

        // Verify H3 page title / header
        await expect(page).toHaveTitle(/The Nam Du Hill|Nam Du Hill Resort/i)

        // Switch to Theme H4
        await page.goto('/h4')
        await expect(page).toHaveURL(/\/h4/)

        // Return to Theme H3
        await page.goto('/h3')
        await expect(page).toHaveURL(/\/h3/)
    })
})
