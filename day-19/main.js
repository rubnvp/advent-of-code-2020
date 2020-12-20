var inputText = `
42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba
`;

function parseInput(inputText) {
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
    
    // return {0: matchesMap[0], 8: matchesMap[8], 11: matchesMap[11]};
    return messages
        .filter(message => matchesMap[0].includes(message))
        .length;
}

function resolve2({rules, messages}) {
    const matchesMap = Object
        .fromEntries(rules
            .filter(rule => rule.matches)
            .map(({id, matches}) => [id, new Set(matches)])
        );

    function mapRulesToMatches({id, rules}) {
        let matches = new Set();
        rules
            .forEach(rule => {
                const [matches1, matches2, matches3] = rule
                    .map(id => matchesMap[id]);
                if (matches1 && !matches2 && !matches3) {
                    matches1.forEach(match1 => matches.add(match1));
                } else if (matches1 && matches2 && !matches3) {
                    matches1.forEach(match1 => {
                        matches2.forEach(match2 => {
                            matches.add(match1 + match2);
                        });
                    });
                }
                else {
                    matches1.forEach(match1 => {
                        matches2.forEach(match2 => {
                            matches3.forEach(match3 => {
                                matches.add(match1 + match2 + match3);
                            });
                        });
                    });
                }
            });
        return {id, matches};
    }
    
    // while (Object.keys(matchesMap).length < rules.length) {
    //     rules
    //         .filter(({id}) => !matchesMap[id])
    //         .map(({id, rules}) => ({
    //             id,
    //             rules,
    //             dependencies: [...new Set(rules.flatMap(rule => rule))],
    //         }))
    //         .filter(({dependencies}) => dependencies
    //             .every(dependence => Object.keys(matchesMap).includes(dependence))
    //         )
    //         .map(mapRulesToMatches)
    //         .forEach(({id, matches})=> {
    //             matchesMap[id] = matches;
    //         });
    // }

    // const maxMessageLength = Math.max(...messages.map(m=>m.length));

    // 0: 8 11
    // 8: 42 | 42 8
    // 11: 42 31 | 42 11 31
    const recursiveRules = [
        {id: 8, rules: [[42], [42, 8]]},
        {id: 11, rules: [[42, 31], [42, 11, 31]]},
    ];
    matchesMap[42] = [['A']]
    matchesMap[31] = [['B']]
    
    for (let index = 0; index < 1; index++) {
        recursiveRules
            .map(mapRulesToMatches)
            .forEach(({id, matches})=> {
                matchesMap[id] = matches;
            });
    }
    [{id: 0, rules: [[8, 11]]}]
        .map(mapRulesToMatches)
        .forEach(({id, matches})=> {
            matchesMap[id] = matches;
        });



    return {0: matchesMap[0], 8: matchesMap[8], 11: matchesMap[11], 42: matchesMap[42], 31: matchesMap[31]};
    
    return messages
        .filter(message => matchesMap[0].has(message))
        // .length;
}

console.time('time');
const input = parseInput(inputText);
const output = resolve2(input);
console.timeEnd('time');

console.log(output);