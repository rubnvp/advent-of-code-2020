// var inputText = `
// F10
// N3
// F7
// R90
// F11
// `; // 43,586 too high

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
        [EAST]:  value => {posX += value;},
        [NORTH]: value => {posY += value;},
        [WEST]:  value => {posX -= value;},
        [SOUTH]: value => {posY -= value;},
        [RIGHT]: value => {angle -= value;},
        [LEFT]:  value => {angle += value;},
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
    function getQuadrant({x, y}) {
        if (y > 0) {
            if (x > 0) return 0;
            else return 1;
        } else {
            if (x < 0) return 2;
            else return 3;
        }
    }
    function setWaypointInQuadrant(quadrant, flip){
        let [x, y] = [Math.abs(wayPos.x), Math.abs(wayPos.y)];
        if (flip) {
            [x, y] = [y, x];
        }
        if (quadrant === 0) {
            wayPos = {x, y};
        } else if (quadrant === 1) {
            wayPos = {x: -x, y};
        } else if (quadrant === 2) {
            wayPos = {x: -x, y: -y};
        } else if (quadrant === 3) {
            wayPos = {x, y: -y};
        }
    }
    const actionMap = {
        [EAST]:  value => {wayPos.x += value;},
        [NORTH]: value => {wayPos.y += value;},
        [WEST]:  value => {wayPos.x -= value;},
        [SOUTH]: value => {wayPos.y -= value;},
        [LEFT]:  value => {
            const quadrant = getQuadrant(wayPos);
            const valueMap = {
                90: () => {
                    const nextQuadrant = [1, 2, 3, 0][quadrant];
                    setWaypointInQuadrant(nextQuadrant, true);
                },
                180: () => {
                    const nextQuadrant = [2, 3, 0, 1][quadrant];
                    setWaypointInQuadrant(nextQuadrant, false);
                },
                270: () => {
                    const nextQuadrant = [3, 0, 1, 2][quadrant];
                    setWaypointInQuadrant(nextQuadrant, true);
                },
            };
            valueMap[value]();
        },
        [RIGHT](value) {
            this[LEFT]([270, 180, 90][value / 90 - 1]);
        },
        [FORWARD](value) {
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