import express, { ErrorRequestHandler } from 'express'
import recordManager from './RecordManager.js'

const api = express()
const port = 3000

api.use(express.json())

api.post('/recorder/v1/start', async ({ body }, res, next) => {
    const { channel, owner }: { channel: string, owner?: number } = body
    if (!channel) {
        return next(new Error('channel is mandatory'))
    }

    try {
        const success = await recordManager.start(channel, owner)
        res.status(200).json({ success })
    } catch (e) {
        next(e)
    }
})

api.post('/recorder/v1/stop', async ({ body }, res, next) => {
    const { channel }: { channel: string } = body
    if (!channel) {
        return next(new Error('channel is mandatory'))
    }

    try {
        const success = recordManager.stop(channel)
        res.status(200).json({ success })
    } catch (e) {
        next(e)
    }
})

api.use((req, res, _next) => {
    res.status(404).json({ error: 'Command ot found' })
})

const errorRequestHandler: ErrorRequestHandler = ({ message, stack }: Error, req, res, _next) => {
    console.error(stack)
    res.status(500).json({ error: message || 'generic error' })
}
api.use(errorRequestHandler)

api.listen(port, () => {
    console.log(`WebRTC recorder listening at the port ${port}`)
})
