export default abstract class BotError implements Error{
    message: string = "";
    name: string = "";
}