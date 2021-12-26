import {Embed} from "./embed";
import {ColorsEnum} from "../enumerations/Colors.enum";

export class ErrorEmbed extends Embed{
    constructor(description: string, title?: string){
        super({
            title: title || "Error",
            hexColor: ColorsEnum.RED,
            description: "**"+description+"**",
        });
    }

    static create(description: string, title?: string){
        return new ErrorEmbed(description, title);
    }
}
