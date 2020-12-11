// var inputText = `
// L.LL.LL.LL
// LLLLLLL.LL
// L.L.L..L..
// LLLL.LL.LL
// L.LL.LL.LL
// L.LLLLL.LL
// ..L.L.....
// LLLLLLLLLL
// L.LLLLLL.L
// L.LLLLL.LL
// `;

function parseInput(inputText) {
    return inputText
        .trim()
        .split('\n')
        .map(line => line.split(''));
}

const [EMPTY, OCCUPIED, FLOOR] = ['L', '#', '.'];

function resolve1(seatMap) {
    
    function getNextValue(seatMap, row, col) {
        const value = seatMap[row][col];
        if (value === FLOOR) return FLOOR;
        
        const adjacents = [
            seatMap[row - 1]?.[col - 1], seatMap[row - 1]?.[col], seatMap[row - 1]?.[col + 1], // upper adjacents
            seatMap[row][col - 1], seatMap[row][col + 1], // left & right adjacents
            seatMap[row + 1]?.[col - 1], seatMap[row + 1]?.[col], seatMap[row + 1]?.[col + 1], // lower adjacents
        ].map(val => val || EMPTY); // undefined values are considered empty
        
        if (value === EMPTY && adjacents.every(adj => adj !== OCCUPIED)) return OCCUPIED;
        else if (value === OCCUPIED && adjacents.filter(adj => adj === OCCUPIED).length >= 4) return EMPTY;
        return value;
    }
    
    let oldSeatMap;
    do {
        oldSeatMap = seatMap;
        seatMap = oldSeatMap
            .map((rowSeats, row)=> rowSeats
                .map((value, col)=> getNextValue(oldSeatMap, row, col))
            );
    } while(JSON.stringify(seatMap) !== JSON.stringify(oldSeatMap));
    
    return seatMap
        .flat()
        .filter(val => val === OCCUPIED)
        .length;
}

function resolve2(seatMap) {

    function getAdjacent(seatMap, row, col, rowIncrement, colIncrement) {
        const [rowPos, colPos] = [row + rowIncrement, col + colIncrement];
        const value = seatMap[rowPos]?.[colPos] || EMPTY;
        if (value === EMPTY || value === OCCUPIED) return value;
        return getAdjacent(seatMap, rowPos, colPos, rowIncrement, colIncrement);
    }
    
    function getNextValue(seatMap, row, col) {
        const value = seatMap[row][col];
        if (value === FLOOR) return FLOOR;
        
        const adjacents = [
            getAdjacent(seatMap, row, col, -1, -1), getAdjacent(seatMap, row, col, -1, 0), getAdjacent(seatMap, row, col, -1, 1), // upper adjacents
            getAdjacent(seatMap, row, col, 0, -1), getAdjacent(seatMap, row, col, 0, 1), // left & right adjacents
            getAdjacent(seatMap, row, col, 1, -1), getAdjacent(seatMap, row, col, 1, 0), getAdjacent(seatMap, row, col, 1, 1) // lower adjacents
        ];
        
        if (value === EMPTY && adjacents.every(adj => adj !== OCCUPIED)) return OCCUPIED;
        else if (value === OCCUPIED && adjacents.filter(adj => adj === OCCUPIED).length >= 5) return EMPTY;
        return value;
    }
    
    let oldSeatMap;
    do {
        oldSeatMap = seatMap;
        seatMap = oldSeatMap
            .map((rowSeats, row)=> rowSeats
                .map((value, col)=> getNextValue(oldSeatMap, row, col))
            );
    } while(JSON.stringify(seatMap) !== JSON.stringify(oldSeatMap));
    
    return seatMap
        .flat()
        .filter(val => val === OCCUPIED)
        .length;
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);