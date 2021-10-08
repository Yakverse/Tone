import * as commands from './index'
import InvalidCommand from '../errors/invalidCommand';
import {Command} from "./command";

export class ButtonFactory {
    factory(buttonId: string): Command {
        switch (buttonId[0]) {
            case 'q':
                return new commands.Queue()
            default:
                throw new InvalidCommand();
        }
    }
}
