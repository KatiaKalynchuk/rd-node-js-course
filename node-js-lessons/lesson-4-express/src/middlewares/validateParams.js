export function validateParams(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    req.params = result.data;
    next();
  };
}
