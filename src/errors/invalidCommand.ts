import BotError from "./botError";

export default class InvalidCommand extends BotError{
    name: string = 'Invalid Command'
    message: string = 'Invalid Command'
}