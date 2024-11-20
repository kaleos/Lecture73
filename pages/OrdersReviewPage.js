const { expect } = require("@playwright/test");

class OrdersReviewPage
{
constructor(page)
{
  this.page = page;
  this.country = page.locator("[placeholder*='Country']");   // css locator
  this.dropdown = page.locator(".ta-results");  // Main locator is only visible when typing something for example uni for United.
  this.emailId = page.locator("//div[contains(@class, 'user__name')]/label[@type='text']").first();  // email address text above the email address field.
  this.submit = page.locator("//*[text()='Place Order ']");  // Place Order button.
  this.orderConfirmationText = page.locator("//h1[contains(@class, 'hero-primary')]");  // Thank you for the order message
  this.orderId = page.locator("//label[contains(@class, 'ng-star-inserted')]");  // Order id locator under the thank you for the order message.

}
async searchCountryAndSelect(countryCode,countryName)
{
  await this.country.type(countryCode,{delay:100});  // Fill won't work here since each letter has to be entered slowly, otherwise the auto fill will not work.
  await this.dropdown.waitFor();
  const optionsCount = await this.dropdown.locator("button").count();  // Page.locator is not needed since only the locators for .ta-results are needed for that section of the field results. And only looking for button for united.
  for(let i=0; i< optionsCount; ++i)
  {
    const text = await this.dropdown.locator("button").nth(i).textContent(); // textContent is needed to retrieve the actual text.
    if(text.trim() === countryName)
      {
      await this.dropdown.locator("button").nth(i).click();
      break;
      }
    }
}

async VerifyEmailId(username)
{
  await expect(this.emailId).toHaveText(username);  // Compares the email id to be the same as the email address.
}

async SubmitAndGetOrderId()
{
  await this.submit.click();
  await expect(this.orderConfirmationText).toHaveText(" Thankyou for the order. ");
  return await this.orderId.textContent();  // Returns the order id.
  }
}
module.exports = {OrdersReviewPage};