import * as gcp from "../services"
import * as log from "../utils/logger"
import db from "../utils/firebase"
import { Branch } from "../types"
import { FieldValue } from "firebase-admin/firestore"
import { Request, Response, Router } from "express"

export const espressoRouter = Router()

/**
 * @openapi
 * /api/v2/espresso/company:
 *   post:
 *     tags:
 *      - Espresso - Create [Should be protected]
 *     description: Create a new company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_name:
 *                 type: string
 *                 description: Company name
 *     responses:
 *       200:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 company_id:
 *                   type: string
 *                   description: Id of the created company
 *       422:
 *         description: Company name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Company name already exists"
 *       500:
 *         description: Error creating company
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Error creating company"
 */
espressoRouter.post(
  "/espresso/company",
  async (req: Request, res: Response) => {
    try {
      const { company_name } = req.body

      const companiesRef = db.collection("companies")
      const companySnapshot = await companiesRef
        .where("company_name", "==", company_name)
        .get()
      if (!companySnapshot.empty) {
        return res.status(422).json({ error: "Company name already exists" })
      }

      const companyRef = await db.runTransaction(async (transaction) => {
        const companyRef = companiesRef.doc()
        transaction.set(
          companyRef,
          {
            company_name,
            created_at: FieldValue.serverTimestamp(),
            updated_at: null,
          },
          { merge: true }
        )
        return companyRef
      })

      const { id: company_id } = companyRef
      res.json({
        company_id,
      })
    } catch (err: unknown) {
      log.error(log.Labels.FIREBASE_OPERATIONS, err)
      res.status(500).json({ error: "Error creating company" })
    }
  }
)

/**
 * @openapi
 * /api/v2/espresso/widget:
 *   post:
 *     tags:
 *       - Espresso - Create [Should be protected]
 *     description: Create a new widget
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_id:
 *                 type: string
 *                 description: Company id
 *               widget_name:
 *                 type: string
 *                 description: Widget name
 *     responses:
 *       200:
 *         description: Widget created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 widget_id:
 *                   type: string
 *                   description: Id of the created widget
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Company not found"
 *       422:
 *         description: Widget name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Widget name already exists"
 *       500:
 *         description: Error creating widget
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Error creating widget"
 */
espressoRouter.post("/espresso/widget", async (req: Request, res: Response) => {
  try {
    const { company_id, widget_name } = req.body

    const companyRef = db.collection("companies").doc(company_id)
    const companySnapshot = await companyRef.get()
    if (!companySnapshot.exists) {
      return res.status(404).json({ error: "Company not found" })
    }

    const widgetsRef = companyRef.collection("widgets")
    const widgetSnapshot = await widgetsRef
      .where("widget_name", "==", widget_name)
      .get()
    if (!widgetSnapshot.empty) {
      return res.status(422).json({ error: "Widget name already exists" })
    }

    const widgetRef = await db.runTransaction(async (transaction) => {
      const widgetRef = widgetsRef.doc()
      transaction.set(
        widgetRef,
        {
          widget_name,
          created_at: FieldValue.serverTimestamp(),
          updated_at: null,
        },
        { merge: true }
      )
      return widgetRef
    })

    const { id: widget_id } = widgetRef
    res.json({
      widget_id,
    })
  } catch (err: unknown) {
    log.error(log.Labels.FIREBASE_OPERATIONS, err)
    res.status(500).json({ error: "Error creating widget" })
  }
})

/**
 * @openapi
 * /api/v2/espresso/branch:
 *   post:
 *     tags:
 *       - Espresso - Create [Should be protected]
 *     description: Create a new branch
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               widget_id:
 *                 type: string
 *                 description: Id of the associated widget
 *               branch_name:
 *                 type: string
 *                 description: Branch name
 *               deployment_artifact_id:
 *                 type: string
 *                 description: Id of the deployment artifact
 *               company_id:
 *                 type: string
 *                 description: Id of the associated company
 *     responses:
 *       200:
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 branch_id:
 *                   type: string
 *                   description: Id of the created branch
 *       404:
 *         description: Company or widget not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Company or widget not found"
 *       422:
 *         description: Branch name already exists or Deployment artifact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Branch name already exists or Deployment artifact not found"
 *       500:
 *         description: Error creating branch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Error creating branch"
 */
espressoRouter.post("/espresso/branch", async (req: Request, res: Response) => {
  try {
    const { widget_id, branch_name, deployment_artifact_id, company_id } =
      req.body

    if (!gcp.isDeploymentArtifactIdInBucket(deployment_artifact_id)) {
      return res.status(422).json({ error: "Deployment artifact not found" })
    }

    const companyRef = db.collection("companies").doc(company_id)
    const companySnapshot = await companyRef.get()
    if (!companySnapshot.exists) {
      return res.status(404).json({ error: "Company not found" })
    }

    const widgetRef = companyRef.collection("widgets").doc(widget_id)
    const widgetSnapshot = await widgetRef.get()
    if (!widgetSnapshot.exists) {
      return res.status(404).json({ error: "Widget not found" })
    }

    const branchesRef = widgetRef.collection("branches")
    const branchSnapshot = await branchesRef
      .where("branch_name", "==", branch_name)
      .get()
    if (!branchSnapshot.empty) {
      return res.status(422).json({ error: "Branch name already exists" })
    }

    const branchRef = await db.runTransaction(async (transaction) => {
      const branchRef = branchesRef.doc()
      transaction.set(
        branchRef,
        {
          branch_name,
          deployment_artifact_id,
          created_at: FieldValue.serverTimestamp(),
          updated_at: null,
        },
        { merge: true }
      )
      return branchRef
    })

    res.json({
      branch_id: branchRef.id,
    })
  } catch (err) {
    log.error(log.Labels.FIREBASE_OPERATIONS, err)
    res.status(500).json({ error: "Error creating branch" })
  }
})

/**
 * @openapi
 * /api/v2/espresso/branch/{branch_id}:
 *   patch:
 *     description: Update a branch [Should be protected]
 *     parameters:
 *       - name: branch_id
 *         in: path
 *         required: true
 *         description: Id of the branch to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deployment_artifact_id:
 *                 type: string
 *                 description: Id of the deployment artifact
 *               company_id:
 *                 type: string
 *                 description: Id of the associated company
 *               widget_id:
 *                 type: string
 *                 description: Id of the associated widget
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Branch updated successfully"
 *       404:
 *         description: Company, widget or branch not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Company, widget or branch not found"
 *       422:
 *         description: Deployment artifact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Deployment artifact not found"
 *       500:
 *         description: Error updating branch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Error updating branch"
 *     tags:
 *       - Espresso - Update [Should be protected]
 */
espressoRouter.patch(
  "/espresso/branch/:branch_id",
  async (req: Request, res: Response) => {
    try {
      const { branch_id } = req.params
      const { deployment_artifact_id, company_id, widget_id } = req.body

      if (!gcp.isDeploymentArtifactIdInBucket(deployment_artifact_id)) {
        return res.status(422).json({ error: "Deployment artifact not found" })
      }

      const companyRef = db.collection("companies").doc(company_id)
      const companySnapshot = await companyRef.get()
      if (!companySnapshot.exists) {
        return res.status(404).json({ error: "Company not found" })
      }

      const widgetsRef = companyRef.collection("widgets").doc(widget_id)
      const widgetSnapshot = await widgetsRef.get()
      if (!widgetSnapshot.exists) {
        return res.status(404).json({ error: "Widget not found" })
      }

      const branchRef = widgetsRef.collection("branches").doc(branch_id)
      const branchSnapshot = await branchRef.get()
      if (!branchSnapshot.exists) {
        return res.status(404).json({ error: "Branch not found" })
      }

      await branchRef.update({
        deployment_artifact_id,
        updated_at: FieldValue.serverTimestamp(),
      })
      res.json({ message: "Branch updated successfully" })
    } catch (err) {
      log.error(log.Labels.FIREBASE_OPERATIONS, err)
      res.status(500).json({ error: "Error updating branch" })
    }
  }
)

espressoRouter.get(
  "/espresso/companies",
  async (_req: Request, res: Response) => {
    try {
      const companiesRef = db.collection("companies")
      const companiesSnapshot = await companiesRef.get()
      const companies = await Promise.all(
        companiesSnapshot.docs.map(async (doc) => {
          const company = doc.data()
          const widgetsRef = doc.ref.collection("widgets")
          const widgetsSnapshot = await widgetsRef.get()
          company.widgets = await Promise.all(
            widgetsSnapshot.docs.map(async (widgetDoc) => {
              const widget = widgetDoc.data()
              const branchesRef = widgetDoc.ref.collection("branches")
              const branchesSnapshot = await branchesRef.get()
              widget.branches = branchesSnapshot.docs.map((branchDoc) => {
                return branchDoc.data()
              })
              return widget
            })
          )
          return company
        })
      )

      res.json({ companies })
    } catch (err: unknown) {
      log.error(log.Labels.FIREBASE_OPERATIONS, err)
      res.status(500).json({ error: "Error getting companies" })
    }
  }
)

/**
 * @openapi
 * /api/v2/espresso/branch/{branch_id}:
 *   get:
 *     description: Get branch details
 *     parameters:
 *       - name: branch_id
 *         in: path
 *         required: true
 *         description: Id of the branch to retrieve
 *       - name: company_id
 *         in: query
 *         required: true
 *         description: Id of the company the branch belongs to
 *       - name: widget_id
 *         in: query
 *         required: true
 *         description: Id of the widget the branch belongs to
 *     responses:
 *       200:
 *         description: Branch details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 branch:
 *                   type: object
 *                   properties:
 *                     created_at:
 *                       type: object
 *                       properties:
 *                         _seconds:
 *                           type: number
 *                           description: timestamp (seconds)
 *                         _nanoseconds:
 *                           type: number
 *                           description: timestamp (nanoseconds)
 *                     deployment_artifact_id:
 *                       type: string
 *                       description: Id of the deployment artifact
 *                     branch_name:
 *                       type: string
 *                       description: Name of the branch
 *                     updated_at:
 *                       type: object
 *                       properties:
 *                         _seconds:
 *                           type: number
 *                           description: timestamp (seconds)
 *                         _nanoseconds:
 *                           type: number
 *                           description: timestamp (nanoseconds)
 *       404:
 *         description: Company, widget or branch not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Company, widget or branch not found"
 *       500:
 *         description: Error getting branch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Error getting branch"
 *     tags:
 *       - Espresso - Read
 */
espressoRouter.get(
  "/espresso/branch/:branch_id",
  async (req: Request, res: Response) => {
    try {
      const { branch_id } = req.params
      const { company_id, widget_id } = req.query

      const companyRef = db.collection("companies").doc(<string>company_id)
      const companySnapshot = await companyRef.get()
      if (!companySnapshot.exists) {
        return res.status(404).json({ error: "Company not found" })
      }

      const widgetsRef = companyRef.collection("widgets").doc(<string>widget_id)
      const widgetSnapshot = await widgetsRef.get()
      if (!widgetSnapshot.exists) {
        return res.status(404).json({ error: "Widget not found" })
      }

      const branchRef = widgetsRef.collection("branches").doc(branch_id)
      const branchSnapshot = await branchRef.get()
      if (!branchSnapshot.exists) {
        return res.status(404).json({ error: "Branch not found" })
      }

      res.json({ branch: branchSnapshot.data() } as Branch)
    } catch (err) {
      log.error(log.Labels.FIREBASE_OPERATIONS, err)
      res.status(500).json({ error: "Error getting branch" })
    }
  }
)

/**
 * @openapi
 * /api/v2/espresso/branch-id/{branch_name}:
 *   get:
 *     description: Get the id of a branch by its name
 *     parameters:
 *       - name: branch_name
 *         in: path
 *         required: true
 *         description: The name of the branch
 *     responses:
 *       200:
 *         description: Branch id retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 branch_id:
 *                   type: string
 *                   description: Id of the branch
 *       404:
 *         description: Company, widget or branch not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Company, widget or branch not found"
 *       500:
 *         description: Error getting branch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Error getting branch"
 *     tags:
 *       - Espresso - Read
 */
espressoRouter.get(
  "/espresso/branch-id/:branch_name",
  async (req: Request, res: Response) => {
    try {
      const { branch_name } = req.params
      const { company_id, widget_id } = req.query

      const companyRef = db.collection("companies").doc(<string>company_id)
      const companySnapshot = await companyRef.get()
      if (!companySnapshot.exists) {
        return res.status(404).json({ error: "Company not found" })
      }

      const widgetRef = companyRef.collection("widgets").doc(<string>widget_id)
      const widgetSnapshot = await widgetRef.get()
      if (!widgetSnapshot.exists) {
        return res.status(404).json({ error: "Widget not found" })
      }

      const branchesRef = widgetRef.collection("branches")
      const branchSnapshot = await branchesRef
        .where("branch_name", "==", branch_name)
        .get()
      if (branchSnapshot.empty) {
        return res.status(404).json({ error: "Branch not found" })
      }

      const branch = branchSnapshot.docs[0]
      res.json({ branch_id: branch.id })
    } catch (err) {
      log.error(log.Labels.FIREBASE_OPERATIONS, err)
      res.status(500).json({ error: "Error getting branch" })
    }
  }
)

/**
 * @openapi
 * /api/v2/espresso/widget-id/{widget_name}:
 *   get:
 *     description: Get the id of a widget by its name
 *     parameters:
 *       - name: widget_name
 *         in: path
 *         required: true
 *         description: The name of the widget
 *     responses:
 *       200:
 *         description: Widget id retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 widget_id:
 *                   type: string
 *                   description: Id of the widget
 *       404:
 *         description: Company or widget not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Company or widget not found"
 *       500:
 *         description: Error getting widget
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Error getting widget"
 *     tags:
 *       - Espresso - Read
 */
espressoRouter.get(
  "/espresso/widget-id/:widget_name",
  async (req: Request, res: Response) => {
    try {
      const { widget_name } = req.params
      const { company_id } = req.query

      const companyRef = db.collection("companies").doc(<string>company_id)
      const companySnapshot = await companyRef.get()
      if (!companySnapshot.exists) {
        return res.status(404).json({ error: "Company not found" })
      }

      const widgetsRef = companyRef.collection("widgets")
      const widgetSnapshot = await widgetsRef
        .where("widget_name", "==", widget_name)
        .get()
      if (widgetSnapshot.empty) {
        return res.status(404).json({ error: "Widget not found" })
      }

      const widget = widgetSnapshot.docs[0]
      res.json({ widget_id: widget.id })
    } catch (err: unknown) {
      log.error(log.Labels.FIREBASE_OPERATIONS, err)
      res.status(500).json({ error: "Error getting widget" })
    }
  }
)

/**
 * @openapi
 * /api/v2/espresso/company-id/{company_name}:
 *   get:
 *     description: Get the id of a company by its name
 *     parameters:
 *       - name: company_name
 *         in: path
 *         required: true
 *         description: The name of the company
 *     responses:
 *       200:
 *         description: Company id retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 company_id:
 *                   type: string
 *                   description: Id of the company
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Company not found"
 *       500:
 *         description: Error getting company
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Error getting company"
 *     tags:
 *       - Espresso - Read
 */
espressoRouter.get(
  "/espresso/company-id/:company_name",
  async (req: Request, res: Response) => {
    try {
      const { company_name } = req.params

      const companiesRef = db.collection("companies")
      const companySnapshot = await companiesRef
        .where("company_name", "==", company_name)
        .get()
      if (companySnapshot.empty) {
        return res.status(404).json({ error: "Company not found" })
      }

      const company = companySnapshot.docs[0]
      res.json({ company_id: company.id })
    } catch (err) {
      log.error(log.Labels.FIREBASE_OPERATIONS, err)
      res.status(500).json({ error: "Error getting company" })
    }
  }
)
