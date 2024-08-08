const { test, expect } = require("@playwright/test");
exports.Filterstatus = class filter {
  constructor(page) {
    this.page = page;
    this.status= this. page.locator('#filter-status')
    this.publish=this.page.getByRole('menuitem', { name: 'Published' })
    this.saveDraft=this.page.getByRole('menuitem',{name:'Draft'})

  }

async filterPublish(){
    await this.status.click()
    await this.publish.click()
}

async filterSaveDraft(){
    await this.status.click()
    await this.saveDraft.click()
}
}