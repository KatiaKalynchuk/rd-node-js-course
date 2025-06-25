import {
  createHabit,
  getAllHabits,
  markHabitDone,
  getStats,
  removeHabit,
  modifyHabit,
} from '../services/habit.service.js';

export const addHabit = (options) => {
  if (!options.name || !options.freq) {
    console.log('Missing --name or --freq');
    return;
  }
  createHabit(options.name, options.freq);
};

export const listHabits = () => {
  const habits = getAllHabits();
  console.table(habits);
};

export const markDone = (options) => {
  if (!options.id) {
    console.log('Missing --id');
    return;
  }
  markHabitDone(options.id);
};

export const showStats = () => {
  const stats = getStats();
  stats.forEach((s) => {
    console.log(`${s.name} [${s.freq}]: ${s.percentage}%`);
  });
};

export const deleteHabit = (options) => {
  if (!options.id) {
    console.log('Missing --id');
    return;
  }
  removeHabit(options.id);
};

export const updateHabit = (options) => {
  if (!options.id) {
    console.log('Missing --id');
    return;
  }
  modifyHabit(options.id, options.name, options.freq);
};
