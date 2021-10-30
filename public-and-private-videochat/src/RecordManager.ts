import AgoraRecorder, { AgoraRecorderEvent, AgoraRecorderConfig, AgoraRegion, AgoraVideoMixingLayout } from 'agora-recorder'
import { config as dotEnvConfig } from 'dotenv'
import { format as formatDate } from 'fecha'

dotEnvConfig()

export interface AgoraRecord {
    recorder: AgoraRecorder
    layout: AgoraVideoMixingLayout
    regions: { owner?: AgoraRegion, guest?: AgoraRegion }
}

class RecordManager {
    private readonly records: Record<string, AgoraRecord> = {}

    constructor() {
        if (!process.env.AGORA_APP_ID || !process.env.AGORA_CERTIFICATE) {
            throw new Error(
              'Environment parameters AGORA_APP_ID, AGORA_CERTIFICATE are required for the AgoraRTC'
            )
        }
    }

    async start(channel: string, ownerUid?: number) {
        const config: AgoraRecorderConfig = {
            appId: process.env.AGORA_APP_ID,
            certificate: process.env.AGORA_CERTIFICATE,
            channel,
        }
        let canvasWidth = 320
        // If this is a private chat
        if (channel.indexOf(':') > 0) {
            config.recordDirTmpl = ({ channel, date }) => `${formatDate(date, 'YYYY-MM-DD')}/${formatDate(date, 'HH:mm:ss')} ${channel.replace(':', ' - ')}`
            canvasWidth = 640
        }
        this.records[channel] = {
            recorder: new AgoraRecorder(config),
            layout: {
                canvasWidth,
                canvasHeight: 240,
                backgroundColor: '#000000',
                regions: [],
            },
            regions: { owner: null, guest: null }
        }
        this.records[channel].recorder.setMixLayout(this.records[channel].layout)
        if (ownerUid) {
            this.createRegion(this.records[channel], ownerUid, 'owner')
        }
        this.subscribeEvents(this.records[channel])
        await this.records[channel].recorder.start()
        console.log(`Record ${channel} is started`)
        return true
    }

    subscribeEvents(record: AgoraRecord) {
        const { recorder, regions } = record
        recorder.on(AgoraRecorderEvent.REC_EVENT_ERROR, (err, stat) => {
            this.stopRecorder(recorder, `Error (code: ${err} stat: ${stat})`)
        })
        recorder.on(AgoraRecorderEvent.REC_EVENT_FIRST_VIDEO_FRAME, (uid) => {
            // If the owner of the room is not specified with parameter `ownerUid`,
            // the first person who started the stream becomes the owner (will be placed in the left slot)
            const type = !regions.owner ? 'owner' : 'guest'
            this.createRegion(record, uid, type)
        })
    }

    stop(channel: string) {
        if (this.records[channel]) {
            const { recorder } = this.records[channel]
            return this.stopRecorder(recorder, 'Stopped by command')
        } else {
            throw new Error(`Record ${channel} is not found`)
        }
    }

    stopRecorder(recorder: AgoraRecorder, reason: string) {
        recorder.stop()
        console.log(`Record ${recorder.channel} is stopped. Reason: ${reason}`)
        this.records[recorder.channel] = null
        delete this.records[recorder.channel]
        return true
    }

    createRegion(record: AgoraRecord, uid: number, type: 'owner' | 'guest') {
        const { recorder, layout , regions } = record
        if (regions[type] && regions[type].uid === uid) {
            return
        }
        regions[type] = {
            uid,
            x: type === 'owner' ? 0 : 320,
            y: 0,
            width: 320,
            height: 240,
            alpha: 1,
        }
        layout.regions = Object.values(regions).filter(region => region)
        recorder.setMixLayout(layout)
    }
}

export default new RecordManager()
