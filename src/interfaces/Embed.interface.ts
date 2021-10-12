import {HexColorString, User} from "discord.js";

export interface EmbedInterface{
    title?: string;
    hexColor?: HexColorString;
    user?: User;
    description?: string,
    image?: string,
    thumbnail?: string,
    footer?: string
}
