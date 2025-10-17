import winston from 'winston';

const { combine, timestamp, printf, colorize, align, splat } = winston.format;

const formatMessage = (info) => {
  const { timestamp, level, message, ...meta } = info;
  const ip = meta.ip || '';
  return `[${timestamp}] ${level}: ${message} ${ip ? `(IP: ${ip})` : ''}`;
};

const consoleLogFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  splat(),
  align(),
  printf(formatMessage)
);

const fileLogFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  splat(),
  printf(formatMessage)
);

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileLogFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/security.log',
      level: 'warn',
      format: fileLogFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: fileLogFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleLogFormat,
    })
  );
}

export default logger;