import twemoji from 'twemoji';

const twOptions = { folder: 'svg', ext: '.svg' };
export const emojify = (text: string) => twemoji.parse(text, twOptions);

function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}


export const formatEmojis = (emojis: string[]) => {
    return emojis
        .concat(emojis)
        .concat(emojis)
        .concat(emojis)
        .concat(emojis)
        .map(emoji => {
            const x = randomInRange(0, 100);
            const y = randomInRange(0, 100);
            const deg = randomInRange(0, 360);
            return `
            <div 
                class="random" 
                style="font-size: ${randomInRange(1, 15)}em;top:${x}%; left:${y}%; transform: rotate(${deg}deg);"
            >
                ${emoji}
            </div>`
        })
        .map(emojify)
        .join('');
}
