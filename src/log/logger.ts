import axios, { AxiosRequestConfig } from "axios";
import { environment } from "../environments/environment";

export default class Logger {

    private logging: boolean = environment.log
    private URL: string = 'https://log-api.newrelic.com/log/v1'

    async send(logType: string, message: string): Promise<void>{
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
                "Api-Key": environment.newRelicKey
            }
        }

        await axios.post(this.URL, payload, options)
    }
}
