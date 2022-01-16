import 'dotenv-flow/config'
import Bot from "./config/bot";
import { InactivityHandler } from "./event/inactivity";
import Logger from "./log/logger";
import MusicController from "./music/musicController";
import { BOT } from "./utils/constants";

export default class App{

    static bot: Bot = new Bot(BOT.TOKEN)
    static musicController: MusicController = new MusicController()
    static logger: Logger = new Logger()
    static InactivityHandler: InactivityHandler = new InactivityHandler()

}
