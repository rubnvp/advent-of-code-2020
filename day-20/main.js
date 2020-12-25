var inputText = `
Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...
`;

const reverseText = text => text.split('').reverse().join('');

const spinTile = (tile) => {
    const {top, right, bottom, left} = tile.border;
    tile.border = {
        top: reverseText(left),
        right: top,
        bottom: reverseText(right),
        left: bottom,
    };
};

const flipTile = (tile) => {
    const {top, right, bottom, left} = tile.border;
    tile.border = {
        top: reverseText(top),
        right: left,
        bottom: reverseText(bottom),
        left: right,
    };
}

const oppositePosition = {
    'top': 'bottom',
    'right': 'left',
    'bottom': 'top',
    'left': 'right',
};

function parseInput(inputText) {
    return inputText
        .trim()
        .split('\n\n')
        .map(tileBlock => {
            const [tileHeader, ...tileLines] = tileBlock
                .split('\n')
                .map(line => line.trim());
            const [_, tileIdText] = /Tile (\d+):/.exec(tileHeader);
            const borderTop = tileLines[0];
            const borderRight = tileLines
                .map(line => line[line.length - 1])
                .join('');
            const borderBottom = tileLines[tileLines.length - 1];
            const borderLeft = tileLines
                .map(line => line[0])
                .join('');
            return {
                id: parseInt(tileIdText),
                border: {
                    top: borderTop,
                    right: borderRight,
                    bottom: borderBottom,
                    left: borderLeft,
                },
            };
        });
}

function test1() {
    const [tile] = parseInput(`
    Tile 42:
    123
    456
    789
    `);
    // test parseInput
    console.assert(tile.id === 42);
    console.assert(tile.border.top === '123');
    console.assert(tile.border.right === '369');
    console.assert(tile.border.bottom === '789');
    console.assert(tile.border.left === '147');
    // test spinBorders
    spinTile(tile);
    // 741
    // 852
    // 963
    console.assert(tile.border.top === '741');
    console.assert(tile.border.right === '123');
    console.assert(tile.border.bottom === '963');
    console.assert(tile.border.left === '789');
    flipTile(tile);
    // 147
    // 258
    // 369
    console.assert(tile.border.top === '147');
    console.assert(tile.border.right === '789');
    console.assert(tile.border.bottom === '369');
    console.assert(tile.border.left === '123');
}

function resolve1(tiles) {
    const firstPlaced = tiles.shift(); // shift is pop from left

    firstPlaced.x = 0;
    firstPlaced.y = 0;
    let placedTiles = [firstPlaced];
    const getMatchedTile = (borders, position) => tiles
        .find(tile => {
            const opposite = oppositePosition[position];
            for (let i = 0; i < 4; i++) {
                if (tile.border[opposite] === borders[position]) return true;
                spinTile(tile);
            }
            flipTile(tile);
            for (let i = 0; i < 4; i++) {
                if (tile.border[opposite] === borders[position]) return true;
                spinTile(tile);
            }
            return false;
        });
    function resolveTo(direction, coord, increment) {
        let count = 0;
        let newPlacedTiles;
        do {
            newPlacedTiles = [];
            placedTiles
                .filter(tile => tile[coord] === count)
                .forEach(tile => {
                    const matchedTile = getMatchedTile(tile.border, direction);
                    if (!matchedTile) return;
                    matchedTile[coord] = tile[coord] + increment;
                    const otherCoord = coord === 'x' ? 'y' : 'x';
                    matchedTile[otherCoord] = tile[otherCoord];
                    newPlacedTiles.push(matchedTile);
                    tiles = tiles.filter(t => t !== matchedTile);
                });
            count = count + increment;
            placedTiles = [...placedTiles, ...newPlacedTiles];
        } while (newPlacedTiles.length);
    }
    resolveTo('right',  'x',  1);
    resolveTo('bottom', 'y',  1);
    resolveTo('left',   'x', -1);
    resolveTo('top',    'y', -1);

    const allX = placedTiles.map(t => t.x);
    const allY = placedTiles.map(t => t.y);
    const [minX, maxX] = [Math.min(...allX), Math.max(...allX)];
    const [minY, maxY] = [Math.min(...allY), Math.max(...allY)];
    const corners = [
        placedTiles.find(t => t.x === minX && t.y === minY).id,
        placedTiles.find(t => t.x === minX && t.y === maxY).id,
        placedTiles.find(t => t.x === maxX && t.y === minY).id,
        placedTiles.find(t => t.x === maxX && t.y === maxY).id,
    ];
    
    return corners
        .reduce((mult, num) => mult * num, 1);
}

function resolve2(input) {
    return input;
}

console.time('time');
const input = parseInput(inputText);
const output = resolve1(input);
console.timeEnd('time');

console.log(output);