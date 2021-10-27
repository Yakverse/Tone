import { Client, Intents } from "discord.js";
import { Event } from "../event/event";
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
import * as commands from '../commands'

export default class Bot {

    client: Client = new Client({ 
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
        presence: {
            status: 'online',
            activities: [
                {
                    name: `good music`,
                    type: 'LISTENING',
                }
            ]
        }
    });
    event: Event = new Event(this.client)
    commands = Object.values(commands)
    commandName: string[] = this.commands.map(command => command.name)
    slashCommands = this.commands.map(command => {
        return {
            name: command.properties.name,
            description: command.properties.description,
            options: command.properties.options
        }
    })

    constructor(private token: string | undefined){
        if (!token) throw new Error("Invalid token");
        
        this.client.login(token).then((res: string) => {
            console.log('BOT ONLINE');
            console.log(`Total guilds: ${this.client.guilds.cache.size}`)
            
            if (res === this.token) this.addSlashCommands();
            else throw new Error('Login error');         
        })
    }
    
    private addSlashCommands(): void{
        (async () => {
            if (!this.client.user) throw new Error('User error')
            
            const rest = new REST({ version: '9' }).setToken(this.token);
            await rest.put(
                Routes.applicationCommands(this.client.user.id),
                { body: this.slashCommands }
            ); 
        })();
    }


}
