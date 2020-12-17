// var inputText = `
// .#.
// ..#
// ###
// `;

// If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
// ACTIVE -> 2 || 3 ACTIVE -> ACTIVE
//                        |-> INACTIVE
// If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
// INACTIVE -> 3 ACTIVE -> ACTIVE
//                     |-> INACTIVE

const [ACTIVE, INACTIVE] = ['#', '.'];
const toText = coords => coords.join(',');
const toCoords = coordsText => coordsText.split(',').map(num => parseInt(num));

function parseInput1(inputText) {
    return inputText
        .trim()
        .split('\n')
        .map(text => text.split(''))
        .reduce((map, xRow, x)=> {
            xRow.forEach((value, y)=> {
                if (value === ACTIVE) map.add(toText([x, y, 0]));
            });
            return map;
        }, new Set());
}

function resolve1(map) {  // map is a Set with the active cubes
    const MAX_ITERATIONS = 6;

    const aroundRange = [-1, 0, 1];
    const getCoordsAround = ([x, y, z]) => aroundRange
        .flatMap(xSum => aroundRange
            .flatMap(ySum => aroundRange
                .map(zSum => [x + xSum, y + ySum, z + zSum])
            )
        )
        .filter(coords => toText(coords) !== toText([x, y, z]));

    function getNextCube(map, coords) {
        const getCoordValue = coords => map.has(toText(coords)) ? ACTIVE : INACTIVE;
        const neighborsCount = getCoordsAround(coords)
            .map(getCoordValue)
            .filter(value => value === ACTIVE)
            .length;
        const value = getCoordValue(coords);
        if (value === ACTIVE) {
            if (neighborsCount === 2 || neighborsCount === 3) return ACTIVE;
            else return INACTIVE;
        }
        if (value === INACTIVE) {
            if (neighborsCount === 3) return ACTIVE;
            else return INACTIVE;
        }
    }

    const getNewActiveCubesFromCoords = (map, coords) => [
            coords,
            ...getCoordsAround(coords)
        ]
        .map(coords => ({coords, value: getNextCube(map, coords)}))
        .filter(({value})=> value === ACTIVE)
        .map(({coords})=> coords);

    let newMap;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        newMap = new Set();
        for (const coordsText of map) {
            const coords = toCoords(coordsText);
            getNewActiveCubesFromCoords(map, coords)
                .forEach((coords) => {
                    newMap.add(toText(coords))
                });
        }
        map = newMap;
    }
    return newMap.size;
}

function parseInput2(inputText) {
    return inputText
        .trim()
        .split('\n')
        .map(text => text.split(''))
        .reduce((map, xRow, x)=> {
            xRow.forEach((value, y)=> {
                if (value === ACTIVE) map.add(toText([x, y, 0, 0]));
            });
            return map;
        }, new Set());
}

function resolve2(map) {  // map is a Set with the active cubes
    const MAX_ITERATIONS = 6;

    const aroundRange = [-1, 0, 1];
    const getCoordsAround = ([x, y, z, w]) => aroundRange
        .flatMap(xSum => aroundRange
            .flatMap(ySum => aroundRange
                .flatMap(zSum => aroundRange
                    .map(wSum => [x + xSum, y + ySum, z + zSum, w + wSum])
                )
            )
        )
        .filter(coords => toText(coords) !== toText([x, y, z, w]));

    function getNextCube(map, coords) {
        const getCoordValue = coords => map.has(toText(coords)) ? ACTIVE : INACTIVE;
        const neighborsCount = getCoordsAround(coords)
            .map(getCoordValue)
            .filter(value => value === ACTIVE)
            .length;
        const value = getCoordValue(coords);
        if (value === ACTIVE) {
            if (neighborsCount === 2 || neighborsCount === 3) return ACTIVE;
            else return INACTIVE;
        }
        if (value === INACTIVE) {
            if (neighborsCount === 3) return ACTIVE;
            else return INACTIVE;
        }
    }

    const getNewActiveCubesFromCoords = (map, coords) => [
            coords,
            ...getCoordsAround(coords)
        ]
        .map(coords => ({coords, value: getNextCube(map, coords)}))
        .filter(({value})=> value === ACTIVE)
        .map(({coords})=> coords);

    let newMap;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        newMap = new Set();
        for (const coordsText of map) {
            const coords = toCoords(coordsText);
            getNewActiveCubesFromCoords(map, coords)
                .forEach((coords) => {
                    newMap.add(toText(coords))
                });
        }
        map = newMap;
    }
    return newMap.size;
}

const input = parseInput2(inputText);
const output = resolve2(input);

console.log(output);