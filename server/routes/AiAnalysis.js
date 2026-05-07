import express from "express"
import { generateReportController, generateReportStreamController, getProjectsController, getProjectController } from "../controllers/GenerateReportController.js"


const router = express.Router()
router.post('/generate-report',generateReportController)
router.get('/stream/:jobId',generateReportStreamController)
router.get('/projects/:userId', getProjectsController)
router.get('/projects/:userId/:projectId', getProjectController)

export default router
