import {
  addHabit,
  listHabits,
  markDone,
  showStats,
  deleteHabit,
  updateHabit
} from '../controllers/habit.controller.js';
import { parseArgs } from '../utils/parseArgs.js';
import { ADD,
  DONE,
  LIST,
  DELETE,
  STATS,
  UPDATE
} from '../utils/validateCommands.js';

const handlers = {
  [ADD]: addHabit,
  [LIST]: listHabits,
  [DONE]: markDone,
  [STATS]: showStats,
  [DELETE]: deleteHabit,
  [UPDATE]: updateHabit,
};

export const routeCommand = (command, args) => {
  const options = parseArgs(args);

  const handler = handlers[command];

  if (handler) {
    handler(options);
  }
};
