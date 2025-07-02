export const parseRequestData = async (req) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  return JSON.parse(body);
};
