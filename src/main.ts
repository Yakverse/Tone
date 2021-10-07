import Bot from "./config/bot";
import { environment } from "./environments/environment";
import Logger from "./log/logger";
import MusicController from "./music/musicController";

export default class App{

    static bot: Bot = new Bot(environment.token)
    static musicController: MusicController = new MusicController()
    static logger: Logger = new Logger()

}
