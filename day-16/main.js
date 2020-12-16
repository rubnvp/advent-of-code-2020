// var inputText = `
// class: 0-1 or 4-19
// row: 0-5 or 8-19
// seat: 0-13 or 16-19

// your ticket:
// 11,12,13

// nearby tickets:
// 3,9,18
// 15,1,5
// 5,14,9
// `;

function parseInput1(inputText) {
    const [rulesText, myTicketText, ticketsText] = inputText
        .trim()
        .split('\n\n');
    const rules = rulesText
        .split('\n')
        .flatMap(text => {
            const [name, rangeText] = text.split(': ');
            return rangeText.split(' or ');
        })
        .map(rangeText => {
            const [min, max] = rangeText.split('-');
            return {min: parseInt(min), max: parseInt(max)};
        });
    const ticketNumbers = ticketsText
        .split('\n')
        .slice(1)
        .flatMap(text => text.split(','))
        .map(num => parseInt(num));

    return {rules, ticketNumbers};
}

function resolve1({rules, ticketNumbers}) {
    return ticketNumbers
        .filter(num => !rules.some(({min, max}) => min <= num && num <= max))
        .reduce((sum, num) => sum + num);
}

function parseInput2(inputText) {
    const [rulesText, myTicketText, ticketsText] = inputText
        .trim()
        .split('\n\n');
    const rules = rulesText
        .split('\n')
        .map(text => {
            const [name, rangeText] = text.split(': ');
            const ranges = rangeText.split(' or ')
                .map(rangeText => {
                    const [min, max] = rangeText.split('-');
                    return {min: parseInt(min), max: parseInt(max)};
                });
            return {name, ranges};
        })
    const [myTicket] = myTicketText
        .split('\n')
        .slice(1)
        .map(text => text
            .split(',')
            .map(num => parseInt(num))
        );
    const tickets = ticketsText
        .split('\n')
        .slice(1)
        .map(text => text
            .split(',')
            .map(num => parseInt(num))
        );

    return {rules, myTicket, tickets};
}

function resolve2({rules, myTicket, tickets}) {
    const isNumberInRanges = (ranges, number) => ranges
        .some(({min, max}) => min <= number && number <= max);

    const validTickets = tickets
        .filter(numbers => numbers
            .every(number => rules.some(({ranges})=> isNumberInRanges(ranges, number)))
        );
    const invalidRulesByPos = rules.map(()=> new Set());
    validTickets.forEach(numbers=> {
        numbers.forEach((number, pos)=> {
            rules.forEach(({name, ranges})=> {
                if (!isNumberInRanges(ranges, number)) invalidRulesByPos[pos].add(name);
            });
        });
    });
    const allRuleNames = rules.map(rule => rule.name);
    const posByRuleName = invalidRulesByPos
        .map((invalidRules, pos) => ({
            pos,
            ruleNames: allRuleNames.filter(name => !invalidRules.has(name)),
        }))
        .sort((a, b)=> a.ruleNames.length - b.ruleNames.length)
        .reduce((posByRuleName, {pos, ruleNames}, i)=> {
            const [ruleName] = ruleNames.filter(name => posByRuleName[name] === undefined);
            posByRuleName[ruleName] = pos;
            return posByRuleName;
        }, {});
    
    return Object.entries(posByRuleName)
        .filter(([ruleName]) => ruleName.startsWith('departure'))
        .map(([_, pos])=> myTicket[pos])
        .reduce((mult, num)=> mult * num, 1);
}

const input = parseInput2(inputText);
const output = resolve2(input);

console.log(output);