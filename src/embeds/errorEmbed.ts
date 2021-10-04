import {Embeds} from "./embed";
import {ColorsEnum} from "../enumerations/Colors.enum";

export class ErrorEmbed extends Embeds{
    constructor(description: string) {
        super({
            hexColor: ColorsEnum.RED,
            description: "**"+description+"**",
        });
    }
}