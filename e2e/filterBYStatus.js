const { test, expect } = require("@playwright/test");
exports.Filterstatus = class filter {
  constructor(page) {
    this.page = page;
    this.status= this. page.locator('#filter-status')
    this.publish=this.page.getByRole('menuitem', { name: 'Published' })
    this.saveDraft=this.page.getByRole('menuitem',{name:'Draft'})
    this.addNewButton = this.page.locator("#add-new");

  }

async filterPublish(){
  const maxRetries = 10; 
    const retryInterval = 3000; 
    
    let isAddNewButtonVisible = false;
    
    for (let i = 0; i < maxRetries; i++) {
      isAddNewButtonVisible = await this.addNewButton.isVisible();
      if (isAddNewButtonVisible) {
        await this.click()
        break;
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval)); 
    }
    await this.status.click()
    await this.publish.click()
}

async filterSaveDraft(){
    await this.status.click()
    await this.saveDraft.click()
}
}