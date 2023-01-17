const config: {
  API_PORT: number
  API_VERSION: string
  FIREBASE_CREDENTIALS: {
    projectId: string
    storageBucket: string
  }
  [key: string]: any
} = {
  API_PORT: Number(process.env.API_POR) || 3001,
  API_VERSION: process.env.API_VERSION || "v2",
  FIREBASE_CREDENTIALS: {
    projectId: process.env.FIREBASE_PROJECT_ID || "headbits-tha",
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET || "headbits-tha.appspot.com",
  },
}

export default config
