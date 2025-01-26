# Quick Logger

An awesome opinionated easy-to-use lightweight logger with a bunch of useful features.
But still being incredibly small for it's comprehensiveness

## Features:

- Multiple Logging Levels
- Different File Handling Formats
- A bunch of other options
- Multiple parallel Transports
- Many built-in Transport
- Transports can be configured through a String
- Easily extensible and custom Transport Support
- Custom Formatter Support

## Contents:

- [Features](#features)
- [Options](#options)
- [Create a Logger](#create-a-logger)
- [Log Levels](#log-levels)
- [Transports]()

## Options

When creating a new Logger instance the following options can be provided. If a ´String´ is provided, it'll only be used as the namespace! All Option Names need to be writen in lowercase!

| Name         | Description                                              | Type   | Alias | Default                                                    |
| ------------ | -------------------------------------------------------- | ------ | ----- | ---------------------------------------------------------- |
| Namespace    | The Namespace for Logger                                 | String | Name  |                                                            |
| logLevel     | The min. Log Level (all below will be ignored)           | Number | -     | info (3)                                                   |
| Date Format  | Format for the Date                                      | String | -     | DD-MM-YYYY-HH-mm-ss                                        |
| Formatter    | Formats & combines the message with helpful contexts\*\* | String | -     | [\<Timestamp\>] [\<LogLevel\>] \<namespace\> - \<message\> |
| ThrowAtError | If it'll be thrown when a Error is logged \*\*\*         | String | -     | False                                                      |
| Transports   | The Log Destination. See [Transports](#transports)       | String | -     | Console                                                    |

\*\* The namespace will be left out, if it is empty. For a custom Formatter, see [Formatter](#formatter)

\*\*\* Only with the LogLevel of Fatal an Error is thrown. The same can be enabled for the LogLevel of Error too.

## Create a Logger

There are many ways to create or use the logger with/without options.

### Directly:

```javascript
const { logger } = require("quick-logger");
logger.log("hello");
```

#### With Namespace:

```javascript
const { Logger } = require("quick-logger");

const logger1 = new Logger("HTTP");
// or
const logger2 = Logger.getLogger("HTTP");
// or
const logger3 = Logger.createLogger("HTTP");

// Note: All loggers above are essentially the same!!
```

#### With Options:

```javascript
const { Logger } = require("quick-logger");

const logger = Logger.getLogger({
  namespace: "HTTP",
});
// or
const logger2 = Logger.createLogger({
  namespace: "HTTP",
});
```

#### Cloning:

```javascript
const { Logger } = require("quick-logger");

const instance = Logger.getLogger("HTTP");

const clonedLogger = instance.clone();
```

#### As Child / Derived Logger:

```javascript
const { logger, Logger } = require("quick-logger");

const derivedLogger1 = logger.child({ namespace: "hello" });
// or
const derivedLogger2 = logger.derive({ namespace: "hello" });
// or
const derivedLogger3 = Logger.from(derivedLogger, { namespace: "hello" });

// Note: All loggers above are essentially the same!!
```

## Log Levels

The Log Levels are defined as:

- silent: 0
- trace: 1
- debug: 2
- info: 3
- warn: 4
- error: 5 (optionally throws Error)
- fatal: 6 (throws Error)

The higher the number, the more importent the message is.

## Formatter

A custom Formatter can described as a function with following arguments `message`, `logLevel`, `timestamp`, `namespace`. The output should be the formatted output.

Example (also the default):

```javascript
function defaultFormatter(message, level, timestamp, namespace) {
  return `[${timestamp}] [${level.toUpperCase()}]${namespace} - ${message}`;
}
```

## Todo:

- more Constants
- more Transports
- polishing
- Readme
