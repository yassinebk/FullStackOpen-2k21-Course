const jwt = require("jsonwebtoken");
const logger = require("./logger");
const User = require("../models/user");

const requestLogger = (req, res, next) => {
  logger.info("Method : ", req.method);
  logger.info("Path : ", req.path);
  logger.info("Body : ", req.body);
  logger.info("---");

  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unkown endpoint" }).end();
};

const errorHandler = (error, req, res, next) => {
  logger.error("Error ", error);
  if (error.name === "CastError") res.status(404).send({ error: "malformed id" }).end();
  else if (error.name === "ValidationError") res.status(500).json({ error: error.message });
  next(error);
};

const tokenExtractor = (request, response, next) => {
  // code that extracts the token
  const auth = request.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) request.token = auth.slice(7);
  logger.info("request became", request.token);

  next();
};

const userExtractor = async (req, res, next) => {
  logger.info(req);
  const decodedToken = req.token
    ? jwt.verify(req.token, process.env.SECRET)
    : null;
  req.user = decodedToken ? await User.findById(decodedToken.id) : null;
  next();
};
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
