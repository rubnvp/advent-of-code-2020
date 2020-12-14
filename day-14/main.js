// var inputText = `
// mask = 000000000000000000000000000000X1001X
// mem[42] = 100
// mask = 00000000000000000000000000000000X0XX
// mem[26] = 1
// `; // expected output 208

function parseInput(inputText) {
    return inputText
        .trim()
        .split('\n')
        .map(text => {
            const [typeText, valueText] = text.split(' = ');
            if (typeText.startsWith('mask')) return {maskValue: valueText};
            // from here is a mememory position instruction
            const [_, memPos] = /^mem\[(.*)\]$/.exec(typeText);
            return {
                memPos,
                value: parseInt(valueText).toString(2).padStart(36, '0'),
            };
        });
}

function resolve1(instructions) {
    const getAppliedMask = (mask, value) => mask
        .split('')
        .reduce((result, char, index) => ([
            ...result,
            ...char === 'X'
                ? [value.charAt(index)]
                : [char],
        ]), [])
        .join('');
    const {memory} = instructions
        .reduce(({mask, memory}, {maskValue, memPos, value}) => {
            if (maskValue) return {mask: maskValue, memory};
            memory[memPos] = getAppliedMask(mask, value);
            return {mask, memory};
        }, {mask: '', memory: {}});
    return Object.values(memory)
        .map(value => parseInt(value, 2))
        .reduce((sum, num) => sum + num);
}

function resolve2(instructions) {
    const getAppliedMask = (mask, value) => mask
        .split('')
        .reduce((result, char, index) => ([
            ...result,
            ...char === '0'
                ? [value.charAt(index)]
                : [char],
        ]), [])
        .join('');
    const getMemoryAddresses = (mask, memPos) => {
        const value = parseInt(memPos).toString(2).padStart(36, '0');
        const floatingBinary = getAppliedMask(mask, value);
        const count = floatingBinary.split('').filter(char => char === 'X').length;
        const length = Math.pow(2, count);
        return Array.from({length})
            .map((_, num)=> {
                const combination = num.toString(2).padStart(count, '0');
                let i = 0;
                return floatingBinary.replace(/X/g, ()=> combination.charAt(i++));
            })
            .map(value => parseInt(value, 2));
    }
    const {memory} = instructions
        .reduce(({mask, memory}, {maskValue, memPos, value}) => {
            if (maskValue) return {mask: maskValue, memory};
            getMemoryAddresses(mask, memPos).forEach(address => memory[address] = value);
            return {mask, memory};
        }, {mask: '', memory: {}});
    return Object.values(memory)
        .map(value => parseInt(value, 2))
        .reduce((sum, num) => sum + num);
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);