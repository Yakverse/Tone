import BotError from "./botError";

export default class BotIsProcessingError extends BotError{
    name: string = 'Bot is processing';
    message: string = 'Bot is processing please try again later';
}