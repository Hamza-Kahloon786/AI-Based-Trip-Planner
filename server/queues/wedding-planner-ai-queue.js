import client from './client.js'
import {Queue} from 'bullmq'

const aiPlanningQueue = new Queue('wedding-planner-ai-queue',{
    connection: client
})
export const addInAiPlanningJob = async (jobData) => {
    return await aiPlanningQueue.add('wedding-planner-ai-queue',jobData,{
    attempts: 3, 
    backoff: { type: 'exponential', delay: 5000 }, 
    })
}
export default aiPlanningQueue

