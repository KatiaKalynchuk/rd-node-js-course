import { readDatabase, writeDatabase } from  '../models/habit.model.js';
import { randomUUID } from 'node:crypto';

export const getTodayOffset = () => {
  const offset = parseInt(process.env.DAY_OFFSET, 10) || 0;
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split('T')[0];
};

export const createHabit = (name, freq) => {
  const data = readDatabase();

  const newHabit = {
    id: randomUUID(),
    name,
    freq,
    created: new Date().toISOString(),
    done: [],
  };

  data.push(newHabit);
  writeDatabase(data);
  console.log('Habit added.');
};

export const getAllHabits = () => {
  return readDatabase();
};

export const markHabitDone = (id) => {
  const data = readDatabase();
  const habit = data.find((h) => h.id === id);
  console.log(data, habit, id);

  if (!habit) {
    console.log('Habit not found');
    return;
  }

  const today = getTodayOffset();

  if (!habit.done.includes(today)) {
    habit.done.push(today);
    writeDatabase(data);
    console.log('Marked as done.');
  } else {
    console.log('Already marked for today.');
  }
};

export const getStats = () => {
  const habits = readDatabase();
  const today = new Date();

  return habits.map((habit) => {
    let period = 7;
    if (habit.freq === 'weekly') period = 30;
    if (habit.freq === 'monthly') period = 30;

    const start = new Date();
    start.setDate(today.getDate() - period);

    const doneInPeriod = habit.done.filter((d) => new Date(d) >= start);
    const target = period / (habit.freq === 'daily' ? 1 : habit.freq === 'weekly' ? 7 : 30);
    const percentage = Math.round((doneInPeriod.length / target) * 100);

    return {
      name: habit.name,
      freq: habit.freq,
      percentage: isNaN(percentage) ? 0 : percentage,
    };
  });
};

export const removeHabit = (id) => {
  const data = readDatabase().filter((h) => h.id !== id);
  writeDatabase(data);
  console.log('Habit deleted.');
};

export const modifyHabit = (id, name, freq) => {
  const data = readDatabase();
  const habit = data.find((h) => h.id === id);

  if (!habit) {
    console.log('Habit not found');
    return;
  }
  if (name) habit.name = name;
  if (freq) habit.freq = freq;

  writeDatabase(data);
  console.log('Habit updated.');
};
