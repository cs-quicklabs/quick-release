import { test, expect } from "@playwright/test";
import { Signout } from "../Pages/Signout";
import { LoginPage } from "../Pages/Login";


test('verify user able to  signout ',async({page},testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 300000);
    const login = new LoginPage(page); // 30 seconds
    await login.gotoLoginPage();
    await login.login("divanshu@crownstack.com","pass1234")
    const signout= new Signout(page)// 30 seconds
    await signout.logout()



})

