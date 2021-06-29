const express = require("express");

const app = express();

const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogRouter = require("./routers/blogRouter");
const userRouter = require("./routers/userRouter");
const loginRouter = require("./routers/login");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

logger.info("connecting to ", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => logger.error("error connecting to MongoDB", error.message));
app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use("/api/blogs", middleware.userExtractor);
app.use(middleware.requestLogger);

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
