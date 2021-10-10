import BotError from "./botError";

export default class NoTracksInQueue extends BotError{
    name: string = 'No Tracks in Queue'
    message: string = 'There is no Tracks in your queue'
}