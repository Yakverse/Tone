import { VoiceConnection } from "@discordjs/voice";
import { videoInfo } from 'ytdl-core';
import Audio from "./audio";
import Queue from "./queue";
import { CommandInteraction, Message } from "discord.js";

export default class MusicController {

    guilds: Map<string, Queue> = new Map<string, Queue>();

    configGuildQueue(voiceConnection: VoiceConnection, guildId: string, message: Message | CommandInteraction){

        let queue: Queue | undefined = this.guilds.get(guildId)
        if (!queue) queue = this.guilds.set(guildId, new Queue(voiceConnection, message)).get(guildId)

        queue!.addListener()
    }

    leave(guildId: string){
        const queue: Queue | undefined = this.guilds.get(guildId)
        if (!queue) return

        queue.leave()
        this.guilds.delete(guildId)
    }

    stop(guildId: string){
        const queue: Queue | undefined = this.guilds.get(guildId)
        if (!queue) return

        queue.stop()
    }

    skip(guildId: string){
        const queue: Queue | undefined = this.guilds.get(guildId)
        if (!queue) return
        queue.skip()
    }

    async addQueue(guildId: string, videoInfo: videoInfo): Promise<videoInfo | undefined>{
        let queue: Queue | undefined = this.guilds.get(guildId)
        if (!queue) return

        queue.addAudio(new Audio(videoInfo))
        await queue.processQueue()
    }

    loop(guildId: string, number: number | undefined){
        const queue: Queue | undefined = this.guilds.get(guildId)
        if (!queue) return
        if (!queue.actualAudio) return
        queue.loop(number)
    }

    unloop(guildId: string){
        const queue: Queue | undefined = this.guilds.get(guildId)
        if (!queue) return
        if (!queue.actualAudio) return
        queue.unloop()
    }

}
