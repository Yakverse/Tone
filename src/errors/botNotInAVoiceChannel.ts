import BotError from "./botError";

export default class BotNotInAVoiceChannel extends BotError{
    name: string = 'Bot not in a voice channel'
    message: string = 'I\'m not in a voice channel'
}