// var inputText = `
// ..##.......
// #...#...#..
// .#....#..#.
// ..#.#...#.#
// .#...##..#.
// ..#.##.....
// .#.#.#....#
// .#........#
// #.##...#...
// #...##....#
// .#..#...#.#
// `; // 336

function parseInput(inputText) {
    return inputText
        .trim()
        .split('\n')
        .map(rowText => rowText.split(''));
}

function resolve1(map) {
    const mapCopy = JSON.parse(JSON.stringify(map));
    const mapHeight = map.length;

    let posY = 0;
    let posX = 0;

    const xOffset = 3;
    const yOffset = 1;

    while (posY + yOffset < mapHeight) {
        posX += xOffset;
        posY += yOffset;

        if (posX >= map[0].length) {
            map.forEach((row, i) => { // add map copy to the right
                map[i] = [...row, ...mapCopy[i]];
            })
        }
        const valueInPos = map[posY][posX];

        if (valueInPos === '.') {
            map[posY][posX] = 'O';
        } else {
            map[posY][posX] = 'X';
        }
    }

    return map
        .flat()
        .filter(cell => cell === 'X')
        .length;
}

function resolve2(originalMap) {
    const slopes =[
        [1, 1],
        [3, 1],
        [5, 1],
        [7, 1],
        [1, 2],
    ];
    const mapCopy = JSON.parse(JSON.stringify(originalMap));
    const mapHeight = originalMap.length;

    function calculateIncidents(xOffset, yOffset) {
        const map = JSON.parse(JSON.stringify(originalMap));

        let posY = 0;
        let posX = 0;

        while (posY + yOffset < mapHeight) {
            posX += xOffset;
            posY += yOffset;

            if (posX >= map[0].length) {
                map.forEach((row, i) => { // add map copy to the right
                    map[i] = [...row, ...mapCopy[i]];
                })
            }
            const valueInPos = map[posY][posX];

            if (valueInPos === '.') {
                map[posY][posX] = 'O';
            } else {
                map[posY][posX] = 'X';
            }
        }

        return map
            .flat()
            .filter(cell => cell === 'X')
            .length;
    }
    return slopes
        .map(slope => calculateIncidents(...slope))
        .reduce((total, num) => num * total);
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);