// var inputText = `
// 389125467
// `; // 10 moves is 92658374 - 100 moves is 67384529

function parseInput(inputText) {
    return inputText
        .trim()
        .split('')
        .map(num => parseInt(num));
}

function resolve1(cups) {
    const MOVES_COUNT = 100;
    const cupsLength = cups.length;
    for (let i = 0; i < MOVES_COUNT; i++) {
        const pos = i % cupsLength;
        const currentCup = cups[pos];

        const grabbedCups = cups.splice(pos + 1, 3);
        while (grabbedCups.length < 3) grabbedCups.push(cups.shift());

        let destinationCup = currentCup;
        do {
            destinationCup--;
            if (destinationCup === 0) destinationCup = 9;
        } while (grabbedCups.includes(destinationCup));

        const index = cups.indexOf(destinationCup);
        cups = [...cups.slice(0, index + 1), ...grabbedCups, ...cups.slice(index + 1)];

        while (cups.indexOf(currentCup) !== pos) cups.push(cups.shift());
    }
    const index1 = cups.indexOf(1);
    return [
        ...cups.slice(index1 + 1),
        ...cups.slice(0, index1)
    ].join('');
}

function resolve2(cups) {
    const ONE_MILLION = 1000000;
    const MOVES_COUNT = 10 * ONE_MILLION;
    cups = Array.from({length: ONE_MILLION}) // add extra cups
        .map((_, i) => cups[i] || i + 1);
    const cupMap = {};
    const firstCup = {value: cups[0]};
    cupMap[firstCup.value] = firstCup;
    const lastCup = cups
        .slice(1)
        .reduce((previousCup, num) => {
            const cup = {value: num};
            previousCup.next = cup;
            cupMap[cup.value] = cup;
            return cup;
        }, firstCup);
    lastCup.next = firstCup;
    let currentCup = firstCup;
    for (let i = 0; i < MOVES_COUNT; i++) {
        const grabbedCup = currentCup.next;
        const lastGrabbedCup = grabbedCup.next.next;
        const grabbedCupValues = [grabbedCup, grabbedCup.next, lastGrabbedCup].map(c => c.value);

        let destinationCupValue = currentCup.value;
        do {
            destinationCupValue--;
            if (destinationCupValue === 0) destinationCupValue = ONE_MILLION;
        } while (grabbedCupValues.includes(destinationCupValue));

        currentCup.next = lastGrabbedCup.next;

        // let findCup = currentCup;
        // while (findCup.value !== destinationCupValue) findCup = findCup.next;
        let findCup = cupMap[destinationCupValue];

        const findCupNext = findCup.next;
        findCup.next = grabbedCup;
        lastGrabbedCup.next = findCupNext;

        currentCup = currentCup.next;
    }
    let findCup = cupMap[1];
    return findCup.next.value * findCup.next.next.value;
}

console.time('time');
const input = parseInput(inputText);
const output = resolve2(input);
console.timeEnd('time');

console.log(output);