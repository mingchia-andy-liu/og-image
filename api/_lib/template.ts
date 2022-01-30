
import { readFileSync } from 'fs';
import { marked } from 'marked';
import { formatEmojis } from './emoji';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';


const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');
const tw = readFileSync(`${__dirname}/../_fonts/twemoji-glyf_colr_1.ttf`).toString('base64');

function getCss(theme: string, fontSize: string, emojiBackground: string) {
    let background = 'white';
    let foreground = 'black';
    let radial = 'lightgray';
    let bgImage = `radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%)`;

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
        radial = 'dimgray';
    }

    if (emojiBackground != null) {
        background = '';
        bgImage = emojiBackground;
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
        font-family: 'Twitter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/ttf;charset=utf-8;base64,${tw}) format('truetype');
    }

    body {
        background: ${background};
        background-image: ${bgImage};
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        font-family: 'Twitter', sans-serif;
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
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images, widths, heights, confettie } = parsedReq;

    const emojis = formatEmojis(['🧐','🐵','🐮']);
    const background = `url("data:image/svg+xml;utf8,${emojis.replaceAll('"', `\\'`)}")`;
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${
        confettie ? '<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js"></script>' : ''
    }
    <style>
        ${getCss(theme, fontSize, background)}
    </style>
</head>
    <body>
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
            <div class="heading">${md ? marked(text) : sanitizeHtml(text)}
            </div>
            <div style="border: red 5px solid">
            ${emojis}
            </div>
        </div>
    </body>
    ${
        confettie ? `
        <script>
            var duration = 15 * 1000;
            var animationEnd = Date.now() + duration;
            var defaults = { startVelocity: 50, spread: 360, ticks: 60, zIndex: 0 };
            
            function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
            }
            
            var interval = setInterval(function() {
                var timeLeft = animationEnd - Date.now();
                
                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }
                
                var particleCount = 100 * (timeLeft / duration);
                // since particles fall down, start a bit higher than random
                // only on the sides of text
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.05, 0.3), y: Math.random() - 0.2 }, scalar: randomInRange(0.5, 3) }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.95), y: Math.random() - 0.2 }, scalar: randomInRange(0.5, 3) }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.05, 0.3), y: Math.random() - 0.2 }}));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.95), y: Math.random() - 0.2 }}));
            }, 100);
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
