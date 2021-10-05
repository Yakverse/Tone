import {Embeds} from "./embed";
import {ColorsEnum} from "../enumerations/Colors.enum";

export default class SucessEmbed extends Embeds{
    constructor(description: string) {
        super({
            hexColor: ColorsEnum.GREEN,
            description: "**"+description+"**",
        });
    }
}

