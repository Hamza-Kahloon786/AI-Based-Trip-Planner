import {generateReportHandler} from "../handlers/GenerateReportHandler.js";
import {addInAiPlanningJob} from "../queues/wedding-planner-ai-queue.js"
import client from "../queues/client.js"
import WeddingResult from "../models/WeddingResult.js"

export const generateReportController = async(req,res)=>{
    try{
        const aiText = await addInAiPlanningJob(req.body)
        const result = await generateReportHandler(req.body)
        return res.status(200).json({message:"Report generated successfully",aiText:aiText.id})
    }catch(err){
        return res.status(500).json({message:"Internal server error"})
    }
}

export const getProjectsController = async (req, res) => {
    try {
        const { userId } = req.params
        if (!userId) return res.status(400).json({ message: "userId is required" })
        const projects = await WeddingResult.find({ userId }).sort({ _id: -1 })
        return res.status(200).json({ ok: true, data: projects })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getProjectController = async (req, res) => {
    try {
        const { userId, projectId } = req.params
        if (!userId || !projectId) return res.status(400).json({ message: "userId and projectId are required" })
        const project = await WeddingResult.findOne({ userId, projectId })
        if (!project) return res.status(404).json({ message: "Project not found" })
        return res.status(200).json({ ok: true, data: project })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const generateReportStreamController = async(req,res)=>{
    const { jobId } = req.params
    const sub = client.duplicate()

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.flushHeaders?.()

    await sub.subscribe(`job:${jobId}`)

    sub.on("message", (channel, message) => {
        if (message === "[DONE]") {
            res.write("event: done\ndata: done\n\n")
            sub.disconnect()
            res.end()
            return
        }

        res.write(`data: ${JSON.stringify(message)}\n\n`)
    })

    req.on("close", () => {
        sub.disconnect()
        res.end()
    })
}
