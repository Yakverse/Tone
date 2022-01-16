import axios, { AxiosRequestConfig } from "axios";
import { LOG } from "../utils/constants";

export default class Logger {

    private logging: boolean = LOG.ENABLE
    private URL: string = 'https://log-api.newrelic.com/log/v1'

    async send(logType: string, message: string | object): Promise<void>{
        if (typeof message != 'string') message = JSON.stringify(message)

        if (!this.logging) {
            console.log(`${logType}: ${message}`)
            return
        }

        let payload = {
            timestamp: new Date().getTime(),
            message: message,
            logtype: logType,
            service: 'tonebot-log'
        }

        let options: AxiosRequestConfig = {
            params: {
                "Api-Key": LOG.NEW_RELIC_KEY
            }
        }

        await axios.post(this.URL, payload, options)
    }
}
