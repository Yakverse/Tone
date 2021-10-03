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
        if (!options.title) options.title = undefined
        if (!options.description) options.description = undefined
        if (!options.user) options.user = undefined
        if (!options.hexColor) options.hexColor = undefined

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
