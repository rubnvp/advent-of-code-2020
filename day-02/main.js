function parseInput1(inputText) {
    return inputText
        .trim()
        .split('\n')
        .map(text => {
            const [marginText, letterText, password] = text.split(' ');
            const [min, max] = marginText
                .split('-')
                .map(n => parseInt(n));
            const letter = letterText[0];
            return {
                letter,
                min,
                max,
                password,
            };
        });
}

function resolve1(passwordSpecs) {
    return passwordSpecs
        .filter(({min, max, letter, password}) => {
            const ocurrencies = password
                .split('')
                .filter(l => letter === l)
                .length;
            return min <= ocurrencies && ocurrencies <= max;
        })
        .length;
}

// inputText = `
// 1-3 a: abcde
// 1-3 b: cdefg
// 2-9 c: ccccccccc
// 1-10 a: aaa
// `;

function parseInput2(inputText) {
    return inputText
        .trim()
        .split('\n')
        .map(text => {
            const [marginText, letterText, password] = text.split(' ');
            const [contain1, contain2] = marginText
                .split('-')
                .map(n => parseInt(n));
            const letter = letterText[0];
            return {
                letter,
                contain1: contain1 - 1, // offset
                contain2: contain2 - 1,
                password,
            };
        });
}

function resolve2(passwordSpecs) {
    return passwordSpecs
        .filter(({contain1, contain2, letter, password}) => {
            if (password[contain1] === letter && password[contain2] === letter) return false;
            return password[contain1] === letter || password[contain2] === letter;
        })
        .length;
}

const input = parseInput2(inputText);
const output = resolve2(input);

console.log(output);