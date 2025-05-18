const averageGrade = (person) => {
  if (!Array.isArray(person?.grades) || person.grades.length === 0) {
    throw new Error('No grades found');
  }

  let sumScore = 0;

  for (const { score } of person.grades) {
    sumScore += score ?? 0;
  }

  const average = sumScore/person.grades.length;

  return Number(average.toFixed(2));
};

console.log(averageGrade({
  name: 'Chill Student', grades: [
    {
      name: 'Math',
      score: 1,
    },
    {
      name: 'Science',
      score: 5
    },
    {
      name: 'Invalid Name',
      score: null
    },
    {
      name: 'Invalid Subject',
      score: undefined
    },
    {
      name: 'Biology',
      score: 10
    }]
})); // Result: 3.2
