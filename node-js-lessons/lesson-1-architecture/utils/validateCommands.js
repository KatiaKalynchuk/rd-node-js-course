export const ADD = 'add';
export const LIST = 'list';
export const DONE = 'done';
export const STATS = 'stats';
export const DELETE = 'delete';
export const UPDATE = 'update';

export const validateCommands = (command) => {
  const VALID_COMMANDS = {
    [ADD]: '--name <text> --freq <daily|weekly|monthly>',
    [LIST]: '',
    [DONE]: '--id <habit_id>',
    [STATS]: '',
    [DELETE]: '--id <habit_id>',
    [UPDATE]: '--id <habit_id> [--name <text>] [--freq <daily|weekly|monthly>]'
  };

  if (!Object.keys(VALID_COMMANDS).includes(command)) {
    const available = Object.entries(VALID_COMMANDS)
      .map(([cmd, usage]) => `  ${cmd} ${usage}`.trim())
      .join('\n');

    throw new Error(`Unknown command: '${command}'\nAvailable commands:\n${available}`);
  }
};
