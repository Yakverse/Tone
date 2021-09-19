import { HexColorString, MessageEmbed, User } from "discord.js";

class Field{
    constructor(
        public title: string = "",
        public text: string = "",
        public inline: boolean = true){
    }
}

export class Embeds{

    public fields : Array<Field> = [];

    constructor(
        public title?: string,
        public HexColor?: HexColorString,
        public user?: User,
        fields?: Array<Field> | Field
    ){
        if (fields) this.fields = Array.isArray(fields) ? fields : [fields];
    };

    addField(field: Field){
        this.fields.push(field);
    }

    build(){
        let embed = new MessageEmbed();

        embed.setTitle(this.title || "");

        if (this.user)
            embed.setAuthor(this.user.username, this.user.defaultAvatarURL, this.user.defaultAvatarURL);

        embed.setColor(this.HexColor || '#0000ff');


        this.fields.forEach(field => {
            embed.addField(field.title, field.text, field.inline)
        });

    }
}