import BotError from "./botError";

export default class UserInWrongChannel extends BotError{
    name: string = 'User in the wrong channel'
    message: string = `I'm not in the same voice channel as you`
}