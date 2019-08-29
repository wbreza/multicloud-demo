const {
  LoggingServiceMiddleware,
  HTTPBindingMiddleware,
  PerformanceMiddleware,
  ExceptionMiddleware,
  ConsoleLogger,
  LogLevel,
} = require("@multicloud/sls-core");

module.exports = function config() {
  return [
    LoggingServiceMiddleware(new ConsoleLogger(LogLevel.VERBOSE)),
    PerformanceMiddleware(),
    ExceptionMiddleware(),
    HTTPBindingMiddleware()
  ];
};