// var inputText = `
// F10
// N3
// F7
// R90
// F11
// `;

function parseInput(inputText) {
    return inputText
        .trim()
        .split('\n')
        .map(line => {
            const [action, ...value] = line;
            return {action, value: parseInt(value.join(''))};
        });
}

const [EAST, NORTH, WEST, SOUTH, RIGHT, LEFT, FORWARD] = ['E', 'N', 'W', 'S', 'R', 'L', 'F'];

function resolve1(actions) {
    let [posX, posY, angle] = [0, 0, 0];
    const actionMap = {
        [EAST]:  value => posX += value,
        [NORTH]: value => posY += value,
        [WEST]:  value => posX -= value,
        [SOUTH]: value => posY -= value,
        [RIGHT]: value => angle -= value,
        [LEFT]:  value => angle += value,
        [FORWARD](value) {
            let finalAngle = angle % 360;
            if (finalAngle < 0) finalAngle += 360;
            const action = [EAST, NORTH, WEST, SOUTH][finalAngle / 90]; // the angles are multiples of 90
            this[action](value);
        },
    }
    actions.forEach(({action, value})=> {
        actionMap[action](value);
    });
    return Math.abs(posX) + Math.abs(posY);
}


function resolve2(actions) {
    let shipPos = {x: 0, y: 0};
    let wayPos = {x: 10, y: 1};
    const getQuadrant = ({x, y}) => y > 0
        ? x > 0 ? 0 : 1
        : x < 0 ? 2 : 3;
    function setWaypoint({quadrant, flip}){
        let [x, y] = [Math.abs(wayPos.x), Math.abs(wayPos.y)];
        if (flip) [x, y] = [y, x];
        if (quadrant === 0) wayPos = {x, y};
        if (quadrant === 1) wayPos = {x: -x, y};
        if (quadrant === 2) wayPos = {x: -x, y: -y};
        if (quadrant === 3) wayPos = {x, y: -y};
    }
    const actionMap = {
        [EAST]:  value => wayPos.x += value,
        [NORTH]: value => wayPos.y += value,
        [WEST]:  value => wayPos.x -= value,
        [SOUTH]: value => wayPos.y -= value,
        [LEFT]:  value => {
            const quadrant = getQuadrant(wayPos);
            const valueMap = {
                90:  {quadrant: [1, 2, 3, 0][quadrant], flip: true},
                180: {quadrant: [2, 3, 0, 1][quadrant], flip: false},
                270: {quadrant: [3, 0, 1, 2][quadrant], flip: true},
            };
            setWaypoint(valueMap[value]);
        },
        [RIGHT](value) {
            this[LEFT]([270, 180, 90][value / 90 - 1]);
        },
        [FORWARD]: value => {
            shipPos.x += wayPos.x * value;
            shipPos.y += wayPos.y * value;
        },
    }
    actions.forEach(({action, value})=> {
        actionMap[action](value);
    });
    return Math.abs(shipPos.x) + Math.abs(shipPos.y);
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);