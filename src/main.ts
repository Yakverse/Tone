import Bot from "./config/bot";
import { environment } from "./environments/environment";

export default class App{

    static bot: Bot = new Bot(environment.token)

}
