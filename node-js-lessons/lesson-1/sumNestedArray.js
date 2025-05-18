const parseInput = (input) => {
  if (!input) {
    throw new Error('Please provide an array as a string, e.g. "[1, 2, [3, 4, [5]], 6]"');
  }

  try {
    return JSON.parse(input);
  } catch (err) {
    throw new Error('Error: Unable to parse input. Make sure it is a valid JSON array.');
  }
}

const sumNestedArray = (arr) => {
  let sum = 0;

  for (const item of arr) {
    if (Array.isArray(item)) {
      sum += sumNestedArray(item);
    } else if (typeof item === 'number') {
      sum += item;
    }
  }

  return sum;
}

try {
  const input = process.argv[2];
  const parsed = parseInput(input);
  const total = sumNestedArray(parsed);
  console.log('Sum of numbers:', total);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
