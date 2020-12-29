// var inputText = `
// sesenwnenenewseeswwswswwnenewsewsw
// neeenesenwnwwswnenewnwwsewnenwseswesw
// seswneswswsenwwnwse
// nwnwneseeswswnenewneswwnewseswneseene
// swweswneswnenwsewnwneneseenw
// eesenwseswswnenwswnwnwsewwnwsene
// sewnenenenesenwsewnenwwwse
// wenwwweseeeweswwwnwwe
// wsweesenenewnwwnwsenewsenwwsesesenwne
// neeswseenwwswnwswswnw
// nenwswwsewswnenenewsenwsenwnesesenew
// enewnwewneswsewnwswenweswnenwsenwsw
// sweneswneswneneenwnewenewwneswswnese
// swwesenesewenwneswnwwneseswwne
// enesenwswwswneneswsenwnewswseenwsese
// wnwnesenesenenwwnenwsewesewsesesew
// nenewswnwewswnenesenwnesewesw
// eneswnwswnwsenenwnwnwwseeswneewsenese
// neswnwewnwnwseenwseesewsenwsweewe
// wseweeenwnesenwwwswnew
// `; // 10

const DIRECTIONS = ['e', 'se', 'sw', 'w', 'nw', 'ne'];
const [EAST, SOUTH_EAST, SOUTH_WEST, WEST, NORTH_WEST, NORTH_EAST] = DIRECTIONS;

function parseInput(inputText) {
    return inputText
        .trim()
        .split('\n')
        .map(line => {
            const directions = [];
            while (line) {
                const dir = DIRECTIONS.find(dir => line.startsWith(dir));
                directions.push(dir);
                line = line.slice(dir.length);
            }
            return directions;
        });
}

const directionToPos = {
    [EAST]: ({x, y}) => ({x: x + 1, y}),
    [WEST]: ({x, y}) => ({x: x - 1, y}),
    [NORTH_WEST]: ({x, y}) => ({x: x, y: y + 1}),
    [SOUTH_EAST]: ({x, y}) => ({x: x, y: y - 1}),
    [NORTH_EAST]: ({x, y}) => ({x: x + 1, y: y + 1}),
    [SOUTH_WEST]: ({x, y}) => ({x: x - 1, y: y - 1}),
};

function getFlippedTiles(tileDirections) {
    return tileDirections
        .reduce((flipped, directions) => {
            const {x, y} = directions
                .reduce((pos, dir)=> {
                    return directionToPos[dir](pos);
                }, {x: 0, y: 0});
            const id = `${x}_${y}`;
            if (flipped.has(id)) flipped.delete(id);
            else flipped.add(id);
            return flipped;
        }, new Set());
}

function resolve1(tileDirections) {
    return getFlippedTiles(tileDirections).size;
}

function resolve2(tileDirections) {
    let flippedTiles = getFlippedTiles(tileDirections);
    const getTilesAround = pos => DIRECTIONS.map(dir => directionToPos[dir](pos));
    for (let day = 1; day <= 100; day++) {
        const blackTiles = [...flippedTiles].map(id => {
            const [x, y] = id.split('_');
            return {x: parseInt(x), y: parseInt(y)};
        });
        const remainBlack = blackTiles
            .filter(pos => {
                const count = getTilesAround(pos)
                    .filter(({x, y}) => flippedTiles.has(`${x}_${y}`))
                    .length;
                return 0 < count && count <= 2;
            });
        const whiteTiles = blackTiles // could be repeats but doesn't matter
            .flatMap(pos => getTilesAround(pos))
            .filter(({x, y}) => !flippedTiles.has(`${x}_${y}`));
        const whiteToBlack = whiteTiles
            .filter(pos => {
                const count = getTilesAround(pos)
                    .filter(({x, y}) => flippedTiles.has(`${x}_${y}`))
                    .length;
                return count === 2;
            });
        flippedTiles = new Set([...remainBlack, ...whiteToBlack].map(({x, y})=> `${x}_${y}`));
    }
    return flippedTiles.size;
}

console.time('time');
const input = parseInput(inputText);
const output = resolve2(input);
console.timeEnd('time');

console.log(output);