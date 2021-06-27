const logger = require("./logger");

const requestLogger = (req, res, next) => {
  logger.info("Method : ", req.method);
  logger.info("Path : ", req.path);
  logger.info("Body : ", req.body);
  logger.info("---");

  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unkown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  logger.error("Error ", error);
  if (error.name === "CastError")
    res.status(404).send({ error: "malformed id" });
  else if (error.name === "ValidationError")
    res.status(500).json({ error: error.message });
  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
