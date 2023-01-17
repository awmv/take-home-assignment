import { Request, Response, Router } from "express"

/**
 * @openapi
 * /api/v2/healthcheck:
 *   get:
 *     tags:
 *       - Default
 *     description: Check the health of the service
 *     responses:
 *       200:
 *         description: The service is healthy and running
 */
export const defaultRouter = Router()

defaultRouter.get("/healthcheck", (_req: Request, res: Response) => {
  res.status(200).json({ message: "OK" })
})
