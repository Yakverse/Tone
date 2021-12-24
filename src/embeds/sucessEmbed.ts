import {Embed} from "./embed";
import {ColorsEnum} from "../enumerations/Colors.enum";

export default class SucessEmbed extends Embed{
    constructor(description: string, title?: string) {
        super({
            hexColor: ColorsEnum.GREEN,
            description: "**"+description+"**",
            title: title
        });
    }

    static create(description: string, title?: string){
        return new SucessEmbed(description, title);
    }
}

