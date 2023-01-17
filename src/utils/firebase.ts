import { initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import config from "../config"
import * as log from "./logger"

function initializeAppWithProjectId() {
  try {
    initializeApp(config.FIREBASE_CREDENTIALS)
    return getFirestore()
  } catch (err) {
    log.error(log.Labels.FIREBASE_CONNECTION, err, log.Level.CRITICAL)
    process.exit(1)
  }
}

const firestore = initializeAppWithProjectId()

export default firestore
