// var inputText = `
// 42: 9 14 | 10 1
// 9: 14 27 | 1 26
// 10: 23 14 | 28 1
// 1: "a"
// 11: 42 31
// 5: 1 14 | 15 1
// 19: 14 1 | 14 14
// 12: 24 14 | 19 1
// 16: 15 1 | 14 14
// 31: 14 17 | 1 13
// 6: 14 14 | 1 14
// 2: 1 24 | 14 4
// 0: 8 11
// 13: 14 3 | 1 12
// 15: 1 | 14
// 17: 14 2 | 1 7
// 23: 25 1 | 22 14
// 28: 16 1
// 4: 1 1
// 20: 14 14 | 1 15
// 3: 5 14 | 16 1
// 27: 1 6 | 14 18
// 14: "b"
// 21: 14 1 | 1 14
// 25: 1 1 | 1 14
// 22: 14 14
// 8: 42
// 26: 14 22 | 1 20
// 18: 15 15
// 7: 14 5 | 1 21
// 24: 14 1

// abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
// bbabbbbaabaabba
// babbbbaabbbbbabbbbbbaabaaabaaa
// aaabbbbbbaaaabaababaabababbabaaabbababababaaa
// bbbbbbbaaaabbbbaaabbabaaa
// bbbababbbbaaaaaaaabbababaaababaabab
// ababaaaaaabaaab
// ababaaaaabbbaba
// baabbaaaabbaaaababbaababb
// abbbbabbbbaaaababbbbbbaaaababb
// aaaaabbaabaaaaababaa
// aaaabbaaaabbaaa
// aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
// babaaabbbaaabaababbaabababaaab
// aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba
// `;

function parseInput1(inputText) {
    const [rulesText, messagesText] = inputText
        .trim()
        .split('\n\n');
    const rules = rulesText
        .split('\n')
        .map(line => {
            const [id, rulesText] = line.split(': ');
            if (rulesText.startsWith('"')) return {id, matches: [rulesText[1]]};
            const rules = rulesText
                .split(' | ')
                .map(rule => rule.split(' '));
            return {id, rules};
        });
    const messages = messagesText
        .split('\n');
    return {rules, messages};
}

function resolve1({rules, messages}) {
    const matchesMap = Object
        .fromEntries(rules
            .filter(rule => rule.matches)
            .map(({id, matches}) => [id, matches])
        );
    
    while (Object.keys(matchesMap).length < rules.length) {
        rules
            .filter(({id}) => !matchesMap[id])
            .map(({id, rules}) => ({
                id,
                rules,
                dependencies: [...new Set(rules.flatMap(rule => rule))],
            }))
            .filter(({dependencies}) => dependencies
                .every(dependence => Object.keys(matchesMap).includes(dependence))
            )
            .map(({id, rules})=> {
                let matches = [];
                rules
                    .forEach(rule => {
                        const [matches1, matches2] = rule
                            .map(id => matchesMap[id]);
                        const newMatches = !matches2
                            ? matches1
                            : matches1
                                .flatMap(match1 => matches2
                                    .map(match2=> match1 + match2)
                                );
                        matches = [
                            ...matches,
                            ...newMatches,
                        ]
                    });
                return {id, matches};
            })
            .forEach(({id, matches})=> {
                matchesMap[id] = matches;
            });
    }
    
    return messages
        .filter(message => matchesMap[0].includes(message))
        .length;
}

function parseInput2(inputText) {
    const [rulesText, messagesText] = inputText
        .trim()
        .split('\n\n');
    const rules = rulesText
        .split('\n')
        .map(line => {
            const [id, rulesText] = line.split(': ');
            if (rulesText.startsWith('"')) return {id, regex: rulesText[1]};
            const rules = rulesText
                .split(' | ')
                .map(rule => rule.split(' '));
            return {id, rules};
        });
    const messages = messagesText
        .split('\n');
    return {rules, messages};
}

function resolve2({rules, messages}) {
    const regexMap = Object
        .fromEntries(rules
            .filter(rule => rule.regex)
            .map(({id, regex}) => [id, regex])
        );
    
    function mapRulesToRegex({id, rules}) {
        const regex = rules
            .map(rule => rule
                .map(id => regexMap[id])
                .join('')
            )
            .join('|');
        return {id, regex: `(${regex})`};
    }

    while (Object.keys(regexMap).length < rules.length) {
        rules
            .filter(({id}) => !regexMap[id])
            .map(({id, rules}) => ({
                id,
                rules,
                dependencies: [...new Set(rules.flatMap(rule => rule))],
            }))
            .filter(({dependencies}) => dependencies
                .every(dependence => Object.keys(regexMap).includes(dependence))
            )
            .map(mapRulesToRegex)
            .forEach(({id, regex})=> {
                regexMap[id] = regex;
            });
    }

    // 0: 8 11
    // 8: 42 | 42 8 -> expand as: 42 | 42 42 | 42 42 42 | 42 42 42 42...
    // 11: 42 31 | 42 11 31 -> expand as: 42 31 | 42 42 31 31 | 42 42 42 31 31 31...
    // so rule 0 should be m ocurrences of 42 and n occurrences 31 with m >= n + 1
    const [regex42, regex31] = [regexMap[42], regexMap[31]]
    const regex0 = `(${regex42}{2,}${regex31}+)`;

    return messages
        .filter(message => (new RegExp(`^${regex0}$`)).test(message))
        .filter(message => {
            // it looks like the matches are always of length 8, so I count from the left
            // m ocurrences of regex42 and then the rest are the n * 8 ocurrences of regex31
            let i = 0;
            while ((new RegExp(`^${regex42}$`)).test(message.slice(i * 8, i * 8 + 8))) i++;
            const count42 = i;
            const count31 = (message.length - i * 8) / 8;
            return count42 >= count31 + 1;
        })
        .length;
}

console.time('time');
const input = parseInput2(inputText);
const output = resolve2(input);
console.timeEnd('time');

console.log(output);