// var inputText = `
// abc

// a
// b
// c

// ab
// ac

// a
// a
// a
// a

// b
// `;

function parseInput(inputText) {
    return inputText
        .trim('')
        .split('\n\n')
        .map(text => text.split('\n'));
}

function resolve1(peopleAnswers) {
    return peopleAnswers
        .map(answers => new Set(answers.join('').split('')).size)
        .reduce((sum, num) => sum + num);
}

function resolve2(peopleAnswers) {
    return peopleAnswers
        .map(answers => {
            const candidates = [...new Set(answers.join('').split(''))];
            return candidates
                .filter(candidate => answers.every(answer => answer.includes(candidate)))
                .length;
        })
        .reduce((sum, num) => sum + num);
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);