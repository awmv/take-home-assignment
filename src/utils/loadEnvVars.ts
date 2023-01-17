import dotenv from "dotenv"

const loadEnv = (fileName: string = ".env") => {
  dotenv.config({ path: fileName })
}

loadEnv()
