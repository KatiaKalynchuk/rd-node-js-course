import { routeCommand } from './router/index.js';
import { validateCommands } from './utils/validateCommands.js';

try {
  const [,, command, ...args] = process.argv;

  validateCommands(command);
  routeCommand(command, args);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
