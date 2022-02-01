
import { readFileSync } from 'fs';
import { marked } from 'marked';
import { emojify, formatEmojis } from './emoji';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';


const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');
// note there is a 50mb
const jp = readFileSync(`${__dirname}/../_fonts/NotoSansJP-Regular.otf`).toString('base64');
const ch = readFileSync(`${__dirname}/../_fonts/NotoSansTC-Regular.otf`).toString('base64');
const kr = readFileSync(`${__dirname}/../_fonts/NotoSansKR-Regular.otf`).toString('base64');


function getCss(theme: string, fontSize: string) {
    let background = 'white';
    let foreground = 'black';
    let radial = 'lightgray';

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
        radial = 'dimgray';
    }

    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
    }

    @font-face {
        font-family: 'Noto Sans Japanese';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/otf;charset=utf-8;base64,${jp})  format("opentype");
    }

    @font-face {
        font-family: 'Noto Sans Traditional Chinese';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/otf;charset=utf-8;base64,${ch})  format("opentype");
    }

    @font-face {
        font-family: 'Noto Sans Korean';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/otf;charset=utf-8;base64,${kr})  format("opentype");
    }

    body {
        background: ${background};
        background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        font-family: 'Inter', 'Noto Sans Japanese', 'Noto Sans Traditional Chinese', 'Noto Sans Korean', 'Vera', sans-serif;
        font-style: normal;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-size: ${sanitizeHtml(fontSize)};
        color: ${foreground};
        line-height: 1.8;
        z-index: 9;
    }
    
    .random {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -10;
    }
    
    #confetti-holder {
        z-index: -1;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images, widths, heights, showConfetties, emojis } = parsedReq;

    const emojiEles = formatEmojis(emojis);
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${
        showConfetties ? '<script src="https://cdn.jsdelivr.net/npm/confetti-js@0.0.18/dist/index.min.js"></script>' : ''
    }
    <style>
        ${getCss(theme, fontSize)}
    </style>
</head>
    <body>
        <canvas id="confetti-holder" style="position: absolute;"></canvas>
        <div>
            <div class="spacer">
            ${images.length !== 0 
                ? `<div class="logo-wrapper">
                        ${images.map((img, i) =>
                            getPlusSign(i) + getImage(img, widths[i], heights[i])
                        ).join('')}
                    </div>
                    <div class="spacer">` 
                : ''}
            <div class="heading">${emojify(md ? marked(text) : sanitizeHtml(text))}
            </div>
            ${emojiEles}
        </div>
    </body>
    ${
        showConfetties ? `
        <script>
            var confettiSettings = { target: 'my-canvas' };
            var confetti = new ConfettiGenerator({"target":"confetti-holder","max":"60","size":"5","animate":true,"props":["circle","square","triangle","line"],"colors":[[165,104,246],[230,61,135],[0,199,228],[253,214,126]],"clock":"25","rotate":true,"width":"2048","height":"1170","start_from_edge":false,"respawn":true});
            confetti.render();
        </script>` : ''
    }
</html>`;
}

function getImage(src: string, width ='auto', height = '225') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}
