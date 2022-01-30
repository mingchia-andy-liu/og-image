import {JSDOM} from 'jsdom';

const svgNS = "http://www.w3.org/2000/svg";

export const formatEmojis = (emojis: string[]) => {
    const dom = new JSDOM(`
        <!doctype html>
        <html lang="en">
        <head>
            <title>Hello SSR</title>
        </head>
        <body>
            <svg></svg>
        </body>
        </html>
    `);
    const document = dom.window.document;
    const el = document.body.children[0];
    el.setAttributeNS(null, "viewbox", "0 0 50 30")
    el.setAttribute('xmlns', "http://www.w3.org/2000/svg");
    emojis.forEach((emoji, i) => {
        const x = i;
        const y = i % 2 === 0 ? 1 : 2;
        const rotate = 'rotate(90)';
        const origin = `${x+0.5}em ${y-0.5}em`;
        appendEmojiTextNode(document, el, emoji, {x: `${x}em`, y: `${y}em`, rotate, origin})
    });
    
    return el.outerHTML;
}

const appendEmojiTextNode = (document: Document, svgNode: Element, emoji: string, options: {x: string, y: string, rotate: string, origin: string}): void => {
    const el = document.createElementNS(svgNS, 'text');
    el.setAttributeNS(null, 'x', options.x);
    el.setAttributeNS(null, 'y', options.y);
    // el.setAttributeNS(null,'font-size','25px');
    // el.setAttributeNS(null,'width','25px');
    // el.setAttributeNS(null,'height','25px');
    el.setAttributeNS(null, 'transform', options.rotate);
    el.setAttributeNS(null, 'transform-origin', options.origin);

    el.innerHTML = emoji;
    svgNode.appendChild(el);
}
