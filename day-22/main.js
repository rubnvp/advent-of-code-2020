// var inputText = `
// Player 1:
// 9
// 2
// 6
// 3
// 1

// Player 2:
// 5
// 8
// 4
// 7
// 10
// `; // 291

function parseInput(inputText) {
    const [player1Text, player2Text] = inputText.trim().split('\n\n');
    const cards1 = player1Text
        .split('\n')
        .slice(1)
        .map(num => parseInt(num));
    const cards2 = player2Text
        .split('\n')
        .slice(1)
        .map(num => parseInt(num));
    return {cards1, cards2};
}

function resolve1({cards1, cards2}) {
    while (cards1.length && cards2.length) {
        const play1 = cards1.shift();
        const play2 = cards2.shift();
        if (play1 > play2) {
            cards1.push(play1, play2);
        }
        else {
            cards2.push(play2, play1);
        }
    }
    const winner = cards1.length ? cards1 : cards2;
    return winner
        .reverse()
        .map((num, i) => num * (i + 1))
        .reduce((sum, num) => sum + num);
}

function resolve2({cards1, cards2}) {
    function recursiveCombat(cards1, cards2) {
        const playedCache = new Set();
        while (cards1.length && cards2.length) {
            const cacheLog = `${cards1.join()}_${cards2.join()}`;
            if (playedCache.has(cacheLog)) return {winner: 1, cards1, cards2};
            else playedCache.add(cacheLog);

            const play1 = cards1.shift();
            const play2 = cards2.shift();

            if (cards1.length >= play1 && cards2.length >= play2) {
                const {winner} = recursiveCombat(cards1.slice(0, play1), cards2.slice(0, play2));
                if (winner === 1) cards1.push(play1, play2);
                else cards2.push(play2, play1);
            }
            else if (play1 > play2) {
                cards1.push(play1, play2);
            }
            else {
                cards2.push(play2, play1);
            }
        }
        return {winner: cards1.length ? 1 : 2, cards1, cards2};
    }
    const result = recursiveCombat(cards1.slice(), cards2.slice());
    return (result.winner === 1 ? result.cards1 : result.cards2)
        .reverse()
        .map((num, i) => num * (i + 1))
        .reduce((sum, num) => sum + num);
}

console.time('time');
const input = parseInput(inputText);
const output = resolve2(input);
console.timeEnd('time');

console.log(output);