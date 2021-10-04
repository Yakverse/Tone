import BotError from "./botError";

export default class UserNotInAVoiceChannel extends BotError{
    name: string = 'User not in a voice channel'
    message: string = 'You are not in a voice channel'
}