// var inputText = `
// pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
// hcl:#623a2f

// eyr:2029 ecl:blu cid:129 byr:1989
// iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

// hcl:#888785
// hgt:164cm byr:2001 iyr:2015 cid:88
// pid:545766238 ecl:hzl
// eyr:2022

// iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719
// `;

function parseInput1(inputText) {
    return inputText
        .trim()
        .split('\n\n')
        .map(passportText => {
            const keyValues = passportText
                .replace(/\n/g, ' ')
                .split(' ');
            const keys = keyValues
                .map(keyValue => keyValue.split(':')[0]);
            return keys;
        });
}

function resolve1(passports) {
    return passports
        .filter(passportKeys => {
            if (passportKeys.length >= 8) return true;
            else if (passportKeys.length === 7) return !passportKeys.includes('cid');
            else return false;
        })
        .length;
}

function parseInput2(inputText) {
    return inputText
        .trim()
        .split('\n\n')
        .map(passportText => {
            const keyValues = passportText
                .replace(/\n/g, ' ')
                .split(' ');
            return keyValues
                .map(keyValue => {
                    const [key, textValue] = keyValue.split(':');
                    return {key, textValue};
                });
        });
}

// byr (Birth Year) - four digits; at least 1920 and at most 2002.
// iyr (Issue Year) - four digits; at least 2010 and at most 2020.
// eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
// hgt (Height) - a number followed by either cm or in:
//      If cm, the number must be at least 150 and at most 193.
//      If in, the number must be at least 59 and at most 76.
// hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
// ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
// pid (Passport ID) - a nine-digit number, including leading zeroes.
// cid (Country ID) - ignored, missing or not.

function validate(key, textValue) {
    const valueValidation = {
        'byr': textValue => {
            const value = parseInt(textValue);
            return textValue.length === 4 && 1920 <= value && value <= 2002;
        },
        'iyr': textValue => {
            const value = parseInt(textValue);
            return textValue.length === 4 && 2010 <= value && value <= 2020;
        },
        'eyr': textValue => {
            const value = parseInt(textValue);
            return textValue.length === 4 && 2020 <= value && value <= 2030;
        },
        'hgt': textValue => {
            const len = textValue.length;
            if (len < 3) return false;
            const value = parseInt(textValue.slice(0, len-2));
            const metric = textValue.slice(len-2, len);
            if (metric === 'cm') return 150 <= value && value <= 193;
            else if (metric === 'in') return 59 <= value && value <= 76;
            else return false;
        },
        'hcl': textValue => {
            return /^#[0-9|a-f]{6}$/.test(textValue);
        },
        'ecl': textValue => {
            return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(textValue);
        },
        'pid': textValue => {
            return /^[0-9]{9}$/.test(textValue);
        },
        'cid': () => true,
    };
    return (valueValidation[key] || (() => false))(textValue);
}
// byr valid:   2002
// byr invalid: 2003
console.assert(validate('byr', '2002') === true);
console.assert(validate('byr', '2003') === false);

// hgt (Height) - a number followed by either cm or in:
//      If cm, the number must be at least 150 and at most 193.
//      If in, the number must be at least 59 and at most 76.
// hgt valid:   60in
// hgt valid:   190cm
// hgt invalid: 190in
// hgt invalid: 190
console.assert(validate('hgt', '60in') === true);
console.assert(validate('hgt', '190cm') === true);
console.assert(validate('hgt', '190in') === false);
console.assert(validate('hgt', '190') === false);
console.assert(validate('hgt', '150cm') === true);
console.assert(validate('hgt', '149cm') === false);
console.assert(validate('hgt', '193cm') === true);
console.assert(validate('hgt', '194cm') === false);
console.assert(validate('hgt', '58in') === false);
console.assert(validate('hgt', '59in') === true);
console.assert(validate('hgt', '76in') === true);
console.assert(validate('hgt', '77in') === false);
console.assert(validate('hgt', '77im') === false);
console.assert(validate('hgt', '76im') === false);

// hcl valid:   #123abc
// hcl invalid: #123abz
// hcl invalid: 123abc
console.assert(validate('hcl', '#123abc') === true);
console.assert(validate('hcl', '#123abz') === false);
console.assert(validate('hcl', '123abc') === false);

// ecl valid:   brn
// ecl invalid: wat
console.assert(validate('ecl', 'brn') === true);
console.assert(validate('ecl', 'wat') === false);

// pid valid:   000000001
// pid invalid: 0123456789
console.assert(validate('pid', '000000001') === true);
console.assert(validate('pid', '0123456789') === false);


function resolve2(passports) {
    return passports
        .filter((passportKeys, i) => {
            // if (i === 1) debugger;
            if (passportKeys < 7) return false;
            if (![
                'byr','iyr','eyr','hgt',
                'hcl','ecl','pid'
            ].every(k=>passportKeys.some(o => o.key === k))) return false;
            if (passportKeys.length === 7 && passportKeys.includes('cid')) return false;
            for (const index in passportKeys) {
                const {key, textValue} = passportKeys[index];
                const value = validate(key, textValue);
                if (!value) return false;
            }
            return true;
        })
        // .filter(o=>o.find(k=>k.key === 'byr'))
        // .map(o=>o.find(k=>k.key === 'byr')['byr'])
        .length; // not 87, or 172 (too high)
}

const input = parseInput2(inputText);
const output = resolve2(input);

console.log(output);