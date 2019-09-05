const {
  LoggingServiceMiddleware,
  HTTPBindingMiddleware,
  PerformanceMiddleware,
  ExceptionMiddleware,
  ConsoleLogger,
  LogLevel,
} = require("@multicloud/sls-core");

const defaultLogger = new ConsoleLogger(LogLevel.VERBOSE);

module.exports = function config() {
  return [
    LoggingServiceMiddleware(defaultLogger),
    PerformanceMiddleware(),
    ExceptionMiddleware({ log: defaultLogger.error }),
    HTTPBindingMiddleware()
  ];
};
