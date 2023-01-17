export enum Labels {
  MIDDLEWARE_FALLBACK = "MIDDLEWARE_FALLBACK",
  SERVICE_FALLBACK = "SERVICE_FALLBACK",
  UTILITY_ENV_VARS = "UTILITY_ENV_VARS",
  FIREBASE_CONNECTION = "FIREBASE_CONNECTION",
  FIREBASE_OPERATIONS = "FIREBASE_OPERATIONS",
  GCP_BUCKET = "GCP_BUCKET",
  SERVER_STARTUP = "SERVER_STARTUP",
}

export enum Level {
  CRITICAL = 1,
  ERROR,
  WARN,
  INFO,
}

const logMessage =
  (logFn: (msg: string) => void, defaultLevel: Level) =>
  (label: Labels, details: unknown, level: Level = defaultLevel) => {
    logFn(JSON.stringify({ level, label, details: String(details) }))
  }

const error = logMessage(console.error, Level.ERROR)
const warn = logMessage(console.warn, Level.WARN)
const info = logMessage(console.info, Level.INFO)

export { error, warn, info }
