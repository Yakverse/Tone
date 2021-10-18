import BotError from "./botError";

export default class PlaylistLimit extends BotError{
    name: string = 'This playlist has more songs than allowed';
    message: string = 'This playlist has more songs than allowed';
}
