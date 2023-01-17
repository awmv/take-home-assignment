import config from "../config"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { Request, Response, Router } from "express"

export const swaggerRouter = Router()

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Espresso API",
      version: "2.0.0",
    },
    basePath: config.API_PREFIX,
  },
  apis: ["./src/routes/*.ts", "!./src/routes/swagger.ts"],
}

swaggerRouter.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJSDoc(options), {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
  })
)

swaggerRouter.use("/postman.json", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json")
  res.send(swaggerJSDoc(options))
})
