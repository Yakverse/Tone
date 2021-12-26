import { VoiceState } from "discord.js"
import { Embed } from "../embeds/embed"
import { ColorsEnum } from "../enumerations/Colors.enum"
import { IMusicTimeout, IAloneTimeout } from "../interfaces/Timeout.interface"
import App from "../main"
import Queue from "../music/queue"

export class InactivityHandler {

    time: number = 5 * 60 * 1000 //5min

    musicTimeouts: Map<string, IMusicTimeout> = new Map<string, IMusicTimeout>()
    aloneTimeouts: Map<string, IAloneTimeout> = new Map<string, IAloneTimeout>()
    
    createNoMusicTimeout(guildId: string, queue: Queue){
        this.deleteNoMusicTimeout(guildId)

        this.musicTimeouts.set(guildId, {
            queue: queue,
            timeout: setTimeout(async () => { await this.leaveOnInactive(guildId, queue, undefined) }, this.time)
        })
    }

    deleteNoMusicTimeout(guildId: string){
        let musicTimeout = this.musicTimeouts.get(guildId)
        if (musicTimeout) {
            clearTimeout(musicTimeout.timeout)
            this.musicTimeouts.delete(guildId)
        }
    }

    createAloneTimeout(guildId: string, state: VoiceState){
        this.deleteAloneTimeout(guildId)

        this.aloneTimeouts.set(guildId, {
            state: state,
            timeout: setTimeout(async () => { await this.leaveOnInactive(guildId, undefined, state) }, this.time)
        })
    }

    deleteAloneTimeout(guildId: string){
        let aloneTimeout = this.aloneTimeouts.get(guildId)
        if (aloneTimeout){
            clearTimeout(aloneTimeout.timeout)
            this.aloneTimeouts.delete(guildId)
        }
    }

    private async leaveOnInactive(guildId: string, queue: Queue | undefined, state: VoiceState | undefined){
        if (queue && !queue.audios.length){
            App.musicController.leave(null, guildId)

            let embed = new Embed({
                hexColor: ColorsEnum.BLUE,
                description: `Leaving due to inactivity`,
            })

            await queue.message.channel?.send({ embeds: [embed.build()] })

        } else if (state) 
            App.musicController.leave(null, state.guild.id)

        this.deleteNoMusicTimeout(guildId)
        this.deleteAloneTimeout(guildId)
    }

}
