import * as log from "../utils/logger"
import { NextFunction, Request, Response } from "express"

export const notFoundMiddleware = (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(404).json({ error: "Not Found" })
}

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  log.error(log.Labels.MIDDLEWARE_FALLBACK, err)
  res.status(500).json({ error: "Internal Server Error" })
}
