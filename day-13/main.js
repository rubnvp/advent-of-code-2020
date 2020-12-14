// var inputText = `
// 939
// 67,7,x,59,61
// `;
// 17,x,13,19
function parseInput(inputText) {
    const [arrivalTimeText, busTimesText] = inputText.trim().split('\n');
    const busTimes = busTimesText
        .split(',')
        .map(num => parseInt(num));
    return {
        arrivalTime: parseInt(arrivalTimeText),
        busTimes,
    };
}

function resolve1({arrivalTime, busTimes}) {
    const {time, departureTime} = busTimes
        .filter(num => !isNaN(num))
        .map(time => ({time, departureTime: time - arrivalTime % time}))
        .reduce((min, num) => num.departureTime < min.departureTime ? num : min);
    return time * departureTime;
}

function resolve2({busTimes}) {
    let offsetBusTimes = busTimes
        .map((time, offset) => ({time, offset}))
        .filter(({time}) => !isNaN(time));

    
    // Simpler brute force (steps of 1)
    // let num = 0;
    // while (offsetBusTimes.some(({time, offset}) => (num + offset) % time !== 0)) num++;
    // return num;

    // Fastest brute force (steps of max number) but almost 3 hours for the given input :S
    const {time: maxTime, offset: maxOffset} = offsetBusTimes
        .reduce((max, num) => num.time > max.time ? num : max);
    offsetBusTimes = offsetBusTimes
        .map(({time, offset}) => ({time, offset: offset - maxOffset}));
    let num = 0;
    while (offsetBusTimes.some(({time, offset}) => (num + offset) % time !== 0)) num += maxTime;
    return num - maxOffset;
}

console.time('time');
const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);
console.timeEnd('time');