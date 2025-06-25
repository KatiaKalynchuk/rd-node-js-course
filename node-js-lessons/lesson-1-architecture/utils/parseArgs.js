export const parseArgs = (args) => {
  const result = {};

  args.forEach((arg, i) => {
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1]?.startsWith('--') ? true : args[i + 1];
      result[key] = value;
    }
  });

  return result;
};
