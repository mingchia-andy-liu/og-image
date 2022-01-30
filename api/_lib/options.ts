import chrome from 'chrome-aws-lambda';
const exePath = process.platform === 'win32'
? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
: process.platform === 'linux'
? '/usr/bin/google-chrome'
: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

interface Options {
    args: string[];
    executablePath: string;
    headless: boolean;
}

export async function getOptions(isDev: boolean) {
    let options: Options;
    if (isDev) {
        options = {
            args: ['--flag-switches-begin', '--enable-features=COLRV1Fonts', '--flag-switches-end'],
            executablePath: exePath,
            headless: true
        };
    } else {
        options = {
            args: chrome.args.concat(['--flag-switches-begin', '--enable-features=COLRV1Fonts', '--flag-switches-end']),
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
        };
    }
    return options;
}
