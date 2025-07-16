export function errorHandler(err, req, res) {
  req.log.error({err});

  res.status(err.status || 500).json({error: err.message || 'Server error'});
}
