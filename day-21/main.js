// var inputText = `
// mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
// trh fvjkl sbzzf mxmxvkd (contains dairy)
// sqjhc fvjkl (contains soy)
// sqjhc mxmxvkd sbzzf (contains fish)
// `; // kfcds, nhms, sbzzf, trh

function parseInput(inputText) {
    return inputText
        .trim()
        .split('\n')
        .map(line => {
            const index = line.indexOf(' (');
            const ingredientsText = line
                .slice(0, index);
            const allergiesText = line
                .slice(index + '(contains '.length + 1, line.length - 1);
            return {
                ingredients: ingredientsText.split(' '),
                allergies: allergiesText.split(', '),
            };
        });
}

function getResolvedAllergies(foods) {
    const allergies = [...new Set(foods.flatMap(food => food.allergies))];
    let unresolvedAllergies = allergies
        .reduce((acc, allergy) => {
            const ingredients = foods
                .filter(food => food.allergies.includes(allergy))
                .map(food => food.ingredients);
            const candidates = Array.from(
                    new Set(ingredients.flat())
                ).filter(ingredient => ingredients
                    .every(foodIngredients => foodIngredients.includes(ingredient))
                );
            acc.push({allergy, candidates});
            return acc;
        }, []);
    const resolvedAllergies = {};
    while(unresolvedAllergies.length) {
        const {allergy, candidates} = unresolvedAllergies
            .find(({candidates}) => candidates.length === 1);
        const [ingredient] = candidates;
        resolvedAllergies[allergy] = ingredient;
        unresolvedAllergies = unresolvedAllergies
            .filter(un => un.allergy !== allergy)
            .map(({allergy, candidates}) => ({
                allergy,
                candidates: candidates.filter(c => c !== ingredient),
            }));
    }
    return resolvedAllergies;
}

function resolve1(foods) {
    const resolvedAllergies = getResolvedAllergies(foods);
    return foods
        .flatMap(food => food.ingredients)
        .filter(ingredient => !Object.values(resolvedAllergies).includes(ingredient))
        .length;
}

function resolve2(foods) {
    const resolvedAllergies = getResolvedAllergies(foods);
    return Object.entries(resolvedAllergies)
        .sort(([allergyA], [allergyB]) => allergyA < allergyB ? -1 : 1)
        .map(([_, ingredient]) => ingredient)
        .join(',');
}

console.time('time');
const input = parseInput(inputText);
const output = resolve2(input);
console.timeEnd('time');

console.log(output);