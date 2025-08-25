import { Inject } from './inject';

export const CONFIG_TOKEN  = 'CONFIG';

export function Config(): ParameterDecorator {
  return Inject(CONFIG_TOKEN);
}
