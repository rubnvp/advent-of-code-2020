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
    const columns = tile.rows.map(() => [])
    tile.rows.forEach(row => {
        row.split('').forEach((char, i) => {
            columns[i].push(char);
        });
    });
    tile.rows = columns.map(col => col.reverse().join(''));
};

const flipTile = (tile) => {
    tile.rows = tile.rows
        .map(row => reverseText(row));
}

const getBorder = (position, rows) => {
    return {
        'top': rows => rows[0],
        'right': rows => rows.map(row => row[row.length - 1]).join(''),
        'bottom': rows => rows[rows.length - 1],
        'left': rows => rows.map(row => row[0]).join(''),
    }[position](rows);
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
            const [tileHeader, ...rows] = tileBlock
                .split('\n')
                .map(line => line.trim());
            const [_, tileIdText] = /Tile (\d+):/.exec(tileHeader);
            return {
                id: parseInt(tileIdText),
                rows,
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
    console.assert(getBorder('top', tile.rows) === '123');
    console.assert(getBorder('right', tile.rows) === '369');
    console.assert(getBorder('bottom', tile.rows) === '789');
    console.assert(getBorder('left', tile.rows) === '147');
    // test spinBorders
    spinTile(tile);
    // 741
    // 852
    // 963
    console.assert(getBorder('top', tile.rows) === '741');
    console.assert(getBorder('right', tile.rows) === '123');
    console.assert(getBorder('bottom', tile.rows) === '963');
    console.assert(getBorder('left', tile.rows) === '789');
    flipTile(tile);
    // 147
    // 258
    // 369
    console.assert(getBorder('top', tile.rows) === '147');
    console.assert(getBorder('right', tile.rows) === '789');
    console.assert(getBorder('bottom', tile.rows) === '369');
    console.assert(getBorder('left', tile.rows) === '123');
}

function resolve1(tiles) {
    const firstPlaced = tiles.shift(); // shift is pop from left

    firstPlaced.x = 0;
    firstPlaced.y = 0;
    let placedTiles = [firstPlaced];
    const getMatchedTile = (rows, position) => tiles
        .find(tile => {
            const border = getBorder(position, rows);
            const opposite = oppositePosition[position];
            for (let i = 0; i < 8; i++) {
                if (getBorder(opposite, tile.rows) === border) return true;
                spinTile(tile);
                if (i === 3) flipTile(tile);
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
                    const matchedTile = getMatchedTile(tile.rows, direction);
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