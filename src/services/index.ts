import * as log from "../utils/logger"
import config from "../config"
import { Storage } from "@google-cloud/storage"

export const getFolders = async (bucketName: string) => {
  try {
    const storage = new Storage()
    const bucket = storage.bucket(bucketName)
    const [files] = await bucket.getFiles({
      delimiter: "/",
    })

    const folders = files.reduce((allFolders, file) => {
      if (file.name.endsWith("/")) {
        allFolders[file.name] = {
          files: [],
          created_at: file.metadata.timeCreated,
        }
      } else {
        const folder = file.name.substring(0, file.name.lastIndexOf("/"))
        if (allFolders[folder]) {
          allFolders[folder].files.push(file.name)
        }
      }
      return allFolders
    }, {} as { [folder: string]: { files: string[]; created_at: string } })

    return folders
  } catch (err: unknown) {
    log.error(log.Labels.GCP_BUCKET, err)
    return Promise.reject(err)
  }
}

export const getBucketUri = (deploymentArtifactId: string) => {
  return `gs://${config.FIREBASE_CREDENTIALS.storageBucket}/${deploymentArtifactId}`
}

export const isDeploymentArtifactIdInBucket = (
  deploymentArtifactId: string
): boolean => {
  const folders = getFoldersMocked()
  return deploymentArtifactId in folders
}

export const getFoldersMocked = () => {
  return {
    "1a3bfc85-0bf6-4ab0-99c0-43c37ec9efd5": {
      files: ["manifest.json", "index.89263651.js", "styles.99893605.css"],
      created_at: "2023-01-17T00:13:03.708Z",
    },
    "d784441e-4274-4b70-b775-f18bd87d9214": {
      files: ["manifest.json", "index.88056111.js", "styles.22731866.css"],
      created_at: "2023-01-18T00:13:03.710Z",
    },
    "7e8944a7-83e2-4566-8731-41bce9edda77": {
      files: ["manifest.json", "index.1724968.js", "styles.97780320.css"],
      created_at: "2023-01-19T00:13:03.710Z",
    },
    "7147ba30-c221-44df-94ab-0c83fe4a6391": {
      files: ["manifest.json", "index.36471052.js", "styles.77511315.css"],
      created_at: "2023-01-20T00:13:03.710Z",
    },
    "176f43e8-259e-4e9d-a55b-192bc5cae64f": {
      files: ["manifest.json", "index.84176651.js", "styles.7086849.css"],
      created_at: "2023-01-21T00:13:03.710Z",
    },
    "15b37099-f1a6-45ba-bbc1-cb9261dcaa75": {
      files: ["manifest.json", "index.10270009.js", "styles.59359724.css"],
      created_at: "2023-01-22T00:13:03.710Z",
    },
    "ae21fefe-0e71-47ab-9ad7-43f1182b451e": {
      files: ["manifest.json", "index.57117165.js", "styles.20214774.css"],
      created_at: "2023-01-23T00:13:03.710Z",
    },
    "57a20f2c-bbb2-44eb-8508-67143d9a0c18": {
      files: ["manifest.json", "index.75906841.js", "styles.46359545.css"],
      created_at: "2023-01-24T00:13:03.710Z",
    },
    "3f717260-8051-4da4-8e8d-2d8a390ac8bd": {
      files: ["manifest.json", "index.74834240.js", "styles.70394533.css"],
      created_at: "2023-01-25T00:13:03.710Z",
    },
    "c58a9a90-c5c0-4b59-8d57-03ee8729c825": {
      files: ["manifest.json", "index.54348891.js", "styles.50364086.css"],
      created_at: "2023-01-26T00:13:03.710Z",
    },
    "99c08202-ec34-482a-9a85-da470ede9a53": {
      files: ["manifest.json", "index.93666719.js", "styles.6202881.css"],
      created_at: "2023-01-27T00:13:03.710Z",
    },
    "8c474471-eb35-45ee-bbf1-b2368c320b5a": {
      files: ["manifest.json", "index.60907524.js", "styles.89312022.css"],
      created_at: "2023-01-28T00:13:03.710Z",
    },
    "a9502de5-4bfa-4375-be69-8099235a6a76": {
      files: ["manifest.json", "index.35798873.js", "styles.49077758.css"],
      created_at: "2023-01-29T00:13:03.710Z",
    },
    "733fcc9e-e68e-45e4-be23-863a250c151a": {
      files: ["manifest.json", "index.49604849.js", "styles.18635668.css"],
      created_at: "2023-01-30T00:13:03.710Z",
    },
    "9b9b2dcf-dcc1-4256-b083-9fcc1c7bc44b": {
      files: ["manifest.json", "index.95263143.js", "styles.38067611.css"],
      created_at: "2023-01-31T00:13:03.710Z",
    },
    "8ba65daa-84da-410e-b412-55998aec14a5": {
      files: ["manifest.json", "index.38468193.js", "styles.21435310.css"],
      created_at: "2023-02-01T00:13:03.710Z",
    },
    "c4276d03-1410-4c75-b886-4144cebfb5ae": {
      files: ["manifest.json", "index.40254642.js", "styles.29276563.css"],
      created_at: "2023-02-02T00:13:03.710Z",
    },
    "aa1dbc82-cf6e-4174-b9fe-bea136cc9ca7": {
      files: ["manifest.json", "index.28116839.js", "styles.98897325.css"],
      created_at: "2023-02-03T00:13:03.710Z",
    },
    "6f7d8f84-12a3-454d-bcce-0a77b81c68ef": {
      files: ["manifest.json", "index.93800834.js", "styles.65622981.css"],
      created_at: "2023-02-04T00:13:03.710Z",
    },
    "8a5173e5-fd39-4a35-a5a6-1288b59f2042": {
      files: ["manifest.json", "index.45977129.js", "styles.81443452.css"],
      created_at: "2023-02-05T00:13:03.710Z",
    },
  }
}
