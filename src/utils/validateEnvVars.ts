import * as log from "./logger"
import config from "../config"

export const validateEnvVars = (obj: any, path: string = "") => {
  const missingEnvVars: string[] = []
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      validateEnvVars(obj[key], path + key + ".")
    } else if (typeof obj[key] === "undefined") {
      missingEnvVars.push(path + key)
    }
  }
  if (missingEnvVars.length === 0) return
  log.error(
    log.Labels.UTILITY_ENV_VARS,
    `Missing environment variable: ${missingEnvVars.join(", ")}`,
    log.Level.CRITICAL
  )
  process.exit(1)
}

validateEnvVars(config)
