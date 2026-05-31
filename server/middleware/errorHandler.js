export function errorHandler(error, _req, res, _next) {
  res.status(error.status || 500).json({
    message: error.message || "Unexpected server error"
  });
}
