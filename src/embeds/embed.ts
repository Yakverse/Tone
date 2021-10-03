import {MessageEmbed} from "discord.js";
import {EmbedInterface} from "../interfaces/Embed.interface";

export class Field{
    constructor(
        public title: string = "",
        public text: string = "",
        public inline: boolean = true){
    }
}

export class Embeds{

    public fields : Array<Field> = [];


    constructor(
        public options: EmbedInterface
    ) {
        if (!options.description){
            options.description = ''
        }
    }


    // constructor(
    //     public title?: string,
    //     public HexColor?: HexColorString,
    //     public user?: User,
    //     fields?: Array<Field> | Field
    // ){
    //     if (fields) this.fields = Array.isArray(fields) ? fields : [fields];
    // };

    setDescription(text: string){
        this.options.description = text;
    }


    addField(field: Field){
        this.fields.push(field);
    }

    build(): MessageEmbed{
        let embed = new MessageEmbed();

        if (this.options.title)
            embed.setTitle(this.options.title);

        if (this.options.user)
            embed.setAuthor(this.options.user.username, this.options.user.defaultAvatarURL, this.options.user.defaultAvatarURL);

        embed.setColor(this.options.hexColor || '#0000ff');

        if (this.options.description)
            embed.setDescription(this.options.description);

        this.fields.forEach(field => {
            embed.addField(field.title, field.text, field.inline);
        });
        return embed
    }
}