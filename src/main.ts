import Bot from "./config/bot";
import { environment } from "./environments/environment";
import { InactivityHandler } from "./event/inactivity";
import Logger from "./log/logger";
import MusicController from "./music/musicController";

export default class App{

    static bot: Bot = new Bot(environment.token)
    static musicController: MusicController = new MusicController()
    static logger: Logger = new Logger()
    static InactivityHandler: InactivityHandler = new InactivityHandler()

}
