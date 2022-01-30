import {JSDOM} from 'jsdom';

const svgNS = "http://www.w3.org/2000/svg";

interface EmojiOptions {
    size: number;
    sizeX: number;
    sizeY: number;
    spaceX: number;
    spaceY: number;
}

export const formatEmojis = (emojis: string[], options: EmojiOptions) => {
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
    el.setAttributeNS(null, "viewbox", '0 0 '.concat(getViewbox(emojis.length, options).join(' ')));
    el.setAttribute('xmlns', "http://www.w3.org/2000/svg");
    el.setAttribute('style', `font-family: "Twitter"`);
    emojis.forEach((emoji, i) => {
        // const x = i;
        // const y = i % 2 === 0 ? 1 : 2;
        // const rotate = 'rotate(90)';
        // const origin = `${x+0.5}em ${y-0.5}em`;
        appendEmojiTextNode(document, el, emoji, i, emojis.length, options)
    });
    
    return [el.outerHTML, getViewbox(emojis.length, options).map(val => `${val}px`).join(' ')];
}

/**
 * Only return the size of x and y. This value is also used in the css background-size with px unit.
 * @param length 
 * @param param1 
 * @returns 
 */
const getViewbox = (length: number, {sizeX, sizeY, spaceX, spaceY}: EmojiOptions) => {
    return [(length / 2) * ( sizeX + ( sizeX * spaceX )), ( sizeY +( sizeY * spaceY ))];
}

const getWidth = (length: number, {sizeX, spaceX}: EmojiOptions) => {
    return `${(length/2)*(sizeX+(sizeX*spaceX))}`
}

const getHeight = ({sizeY, spaceY}: EmojiOptions) => {
    return `${(sizeY+(sizeY*spaceY))}`;
}

const getX = (index: number, {spaceX}: EmojiOptions) => {
    return `${((index+(index*spaceX))*1.25) +'em'}`
}

// const getY = (index: number, {spaceY}: EmojiOptions) => {
//     const i = index % 2 === 0 ? 1 : 2;
//     return `${((i*spaceY))*1.25 +'em'}`
// }

const appendEmojiTextNode = (document: Document, svgNode: Element, emoji: string, i: number, length: number, options: EmojiOptions): void => {
    const el = document.createElementNS(svgNS, 'text');
    el.setAttributeNS(null, 'x', getX(i, options));
    el.setAttributeNS(null, 'y', `${i % 2 === 0 ? 1 : 2}em`);
    // el.setAttributeNS(null, 'y', getY(i, options));
    el.setAttributeNS(null,'width', getWidth(length, options));
    el.setAttributeNS(null,'height',getHeight(options));
    // el.setAttributeNS(null, 'transform', options.rotate);
    // el.setAttributeNS(null, 'transform-origin', options.origin);

    el.innerHTML = emoji;
    svgNode.appendChild(el);
}
