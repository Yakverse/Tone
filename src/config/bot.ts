import { Client, Intents } from "discord.js";
import { Event } from "../event/event";
import { typeSlashCommand } from "./typeSlashCommand.enum";
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

export class Bot {

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
 
    constructor(private token: string | undefined){
        if (!token) throw new Error("Invalid token");
        
        this.client.login(token).then((res: string) => {
            console.log('BOT ONLINE');
            
            if (res === this.token) this.addSlashCommands();
            else throw new Error('Login error');         
        })
    }
    
    get getClient(): Client { return this.client; }
    
    get getToken(): string | undefined { return this.token; }
    
    private addSlashCommands(): void{
        (async () => {
            if (!this.client.user) throw new Error('User error')
            
            const rest = new REST({ version: '9' }).setToken(this.token);
            await rest.put(
                Routes.applicationGuildCommands(this.client.user.id, '534774137902596106'),
                {
                    body: [
                        {
                            name: "ping",
                            description: "teste"
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
                        }
                    ]
                }
            ); 
        })();
    }
}