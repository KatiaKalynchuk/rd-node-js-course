const createMultiplier = (multiplier) => (number) => multiplier * number;

const multiplyBy2 = createMultiplier(2);

console.log(multiplyBy2(5)); // Result: 10
console.log(multiplyBy2(10)); // Result: 20