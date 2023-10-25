import { Client, GatewayIntentBits, ActivityType, Collection } from "discord.js";
import { Event } from "@/event/event";
import * as commands from '@/commands'

export default class Bot {

    client: Client = new Client({ 
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates],
        presence: {
            status: 'online',
            activities: [
                {
                    name: 'good music',
                    type: ActivityType.Listening,
                }
            ]
        }
    });
    event: Event = new Event(this.client)

    constructor(private token: string | undefined){
        console.log(`Bot token: ${token}`)
        if (!token) throw new Error("Invalid token");
        
        this.client.login(token).then((res: string) => {
            console.log('BOT ONLINE');
            console.log(`Total guilds: ${this.client.guilds.cache.size}`)
            
            if (res === this.token) {
                this.client.commands = new Collection();
                for (const command of Object.values(commands)) {
                    this.client.commands.set(command.data.name, command);
                }
            }
            else throw new Error('Login error');         
        })
    }
}
