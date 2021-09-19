import { Client, Intents } from "discord.js";
import { Event } from "../event/event";
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

export class Bot {

    client: Client = new Client({ 
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
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
                            name: 'teste',
                            description: 'dsadsadsa'
                        }
                    ]
                }
            ); 
        })();
    }
}