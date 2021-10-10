import { VoiceState } from "discord.js";
import Queue from "../music/queue";

export interface IMusicTimeout {

    queue: Queue
    timeout: NodeJS.Timeout

}

export interface IAloneTimeout {
    
    state: VoiceState
    timeout: NodeJS.Timeout

}

