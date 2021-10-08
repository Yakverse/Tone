import { Client, Intents } from "discord.js";
import { Event } from "../event/event";
import {typeSlashCommand} from "../enumerations/typeSlashCommand.enum";
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

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
    static slashCommands = {
        body: [
            {
                name: "ping",
                description: "ping, pong"
            },
            {
                name: 'play',
                description: 'Play a song',
                options: [
                    {
                        name: 'song',
                        type: typeSlashCommand.STRING,
                        description: 'URL or name of the song',
                        required: true
                    }
                ]
            },
            {
                name: 'leave',
                description: 'Leave the voice channel'
            },
            {
                name: 'skip',
                description: 'Skip the song'
            },
            {
                name: 'pause',
                description: 'Pause the song'
            },
            {
                name: 'resume',
                description: 'Resume the song'
            },
            {
                name: 'stop',
                description: 'Stop the song and clear queue'
            },
            {
                name: 'loop',
                description: 'loop the song',
                options: [
                    {
                        name: 'number',
                        type: typeSlashCommand.INTEGER,
                        description: 'Number of times the queue will repeat',
                        required: false
                    }
                ]
            },
            {
                name: 'unloop',
                description: 'unloop the song'
            },
            {
                name: 'help',
                description: 'need some help? wanna know the commands?'
            },
            {
                name: 'queue',
                description: 'show the current server queue',
            },
            {
                name: 'invite',
                description: 'invite me to your discord server'
            }
        ]
    }

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
                Bot.slashCommands
            ); 
        })();
    }


}
