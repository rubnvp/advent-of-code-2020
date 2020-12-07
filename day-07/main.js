// var inputText = `
// light red bags contain 1 bright white bag, 2 muted yellow bags.
// dark orange bags contain 3 bright white bags, 4 muted yellow bags.
// bright white bags contain 1 shiny gold bag.
// muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
// shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
// dark olive bags contain 3 faded blue bags, 4 dotted black bags.
// vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
// faded blue bags contain no other bags.
// dotted black bags contain no other bags.
// `;

function parseInput(inputText) {
  return inputText
    .trim()
    .split('\n')
    .map(text => {
      let [id, childText] = text.split(' bags contain ');
      childText = childText.slice(0, childText.length - 1) // remove last dot
      const child = childText === 'no other bags' ? []
        : childText.split(', ')
          .map(childText => {
            const [amount, tone, color] = childText.split(' ');
            return {
              amount: parseInt(amount),
              id: tone + ' ' + color,
            };
          });
      return {
        id,
        child,
      }
    });
}

function resolve1(bags) {
  const targetId = 'shiny gold';
  function findBagParentIds(bagId) {
    return bags
      .filter(bag => bag.child.find(b => b.id === bagId))
      .map(bag => bag.id);
  }

  let parentIds = [targetId]; // we will decrease one
  let oldParents;
  do {
    oldParents = parentIds;
    const newParentIds = parentIds
      .flatMap(id => findBagParentIds(id));
    parentIds = Array.from(new Set([...parentIds, ...newParentIds]));
  } while (parentIds.length !== oldParents.length)

  return parentIds.length - 1;
}

function resolve2(bags) {
  const targetId = 'shiny gold';
  bags = bags
    .map(({ id, child }) => ({
      id,
      childIds: child.flatMap(bag => Array(bag.amount).fill(bag.id)),
      ...!child.length && { total: 1 }
    }));

  let resolvedBagIds;
  let remainBags;

  do {
    resolvedBagIds = bags.filter(bag => bag.total).map(b => b.id)
    remainBags = bags.filter(bag => !bag.total)
    remainBags
      .forEach(bag => {
        bag.childIds = bag.childIds
          .map(id => {
            return resolvedBagIds.includes(id)
              ? bags.find(b => b.id === id).total
              : id;
          });
        if (bag.childIds.every(item => typeof item === 'number')) {
          bag.total = bag.childIds.reduce((sum, num) => sum + num) + 1; // plus one to count itself
        }
      });
  } while (remainBags.length)

  return bags.find(bag => bag.id === targetId).total - 1;
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);