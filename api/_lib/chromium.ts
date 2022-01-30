import core from 'puppeteer-core';
import { getOptions } from './options';
import { FileType } from './types';
let _page: core.Page | null;

async function getPage(isDev: boolean) {
    if (_page) {
        return _page;
    }
    const options = await getOptions(isDev);
    const browser = await core.launch(options);
    _page = await browser.newPage();
    return _page;
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getScreenshot(html: string, type: FileType, isDev: boolean, wait: boolean) {
    const page = await getPage(isDev);
    await page.setViewport({ width: 2048, height: 1170 });
    await page.setContent(html);
    if (wait) {
        await sleep(2000)
    }
    const file = await page.screenshot({ type });
    return file;
}
