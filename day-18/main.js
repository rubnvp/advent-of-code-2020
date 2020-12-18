// var inputText = `
// 5 + (8 * 3 + 9 + 3 * 4 * 3)
// `; // 1445

const [SUM, MULT, OPEN, CLOSE] = ['+', '*', '(', ')'];

function parseInput(inputText) {
    function pushBlocks(blocks, list) {
        while (blocks.length) {
            const block = blocks.shift(); // remove from left
            if (block === OPEN) list.push(pushBlocks(blocks, []));
            else if (block === CLOSE) return list;
            else list.push(block);
        }
        return list;
    }
    return inputText
        .trim()
        .split('\n')
        .map(line => line
            .replaceAll('(', '( ')
            .replaceAll(')', ' )')
            .split(' ')
            .map(block => [SUM, MULT, OPEN, CLOSE].includes(block) ? block : parseInt(block))
        )
        .map(blocks => pushBlocks(blocks, []));
}

const resolveBlocks = blocks => blocks
    .reduce(({result, op}, block)=> {
        if (Array.isArray(block)) block = resolveBlocks(block);
        if (result === null) result = block;
        else if ([SUM, MULT].includes(block)) op = block;
        else {
            if (op === SUM) result += block;
            else if (op === MULT) result *= block;
        }
        return {result, op};
    }, {result: null, op: ''})
    .result;

function resolve1(operations) {
    return operations
        .map(resolveBlocks)
        .reduce((sum, num)=> sum + num);       
}

function resolve2(operations) {
    function groupSumBlocks(blocks) {
        const groups = [];
        for (let i = 0; i < blocks.length; i++) {
            const [block1, block2, block3] = blocks
                .slice(i, i + 3)
                .map(block => Array.isArray(block) ? groupSumBlocks(block) : block);
            if (block1 === SUM) {
                const previousBlock = groups.pop();
                groups.push([previousBlock, SUM, block2]);
                i += 1;
            }
            else if (block2 === SUM) {
                groups.push([block1, SUM, block3]);
                i += 2;
            }
            else {
                groups.push(block1);
            }
        }
        return groups;
    }
    return operations
        .map(groupSumBlocks)
        .map(resolveBlocks)
        .reduce((sum, num)=> sum + num);
}

function test2() {
    console.assert(resolve2(parseInput('1 + (2 * 3) + (4 * (5 + 6))')) === 51);
    console.assert(resolve2(parseInput('2 * 3 + (4 * 5)')) === 46);
    console.assert(resolve2(parseInput('5 + (8 * 3 + 9 + 3 * 4 * 3)')) === 1445);
    console.assert(resolve2(parseInput('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))')) === 669060);
    console.assert(resolve2(parseInput('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2')) === 23340);
}
    
console.time('time');
const input = parseInput(inputText);
const output = resolve2(input);
console.timeEnd('time');

console.log(output);