const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = []
const ping = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('test ping')
}
const help = {
	data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('need some help? wanna know the commands?'),
}
const invite = {
	data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('invite me to your discord server'),
}
const join = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('join a voice channel'),
}
const leave = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('leave the voice channel'),
}
const play = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song')
		.addStringOption(option => option.setName('song').setDescription('URL or name of the song').setRequired(true)),
}
const pause = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('pause the song'),
}
const resume = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('resume the song'),
}
const stop = {
	data: new SlashCommandBuilder()
		.setName('stop')
        .setDescription('stop the song and clear queue'),
}
const skip = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('skip the song'),
}
const loop = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('loop the song')
		.addIntegerOption(option => option.setName('number').setDescription('Number of times the queue will repeat').setRequired(false)),
}
const unloop = {
	data: new SlashCommandBuilder()
		.setName('unloop')
		.setDescription('unloop the song'),
}
commands.push(ping.data.toJSON());
commands.push(help.data.toJSON());
commands.push(invite.data.toJSON());
commands.push(join.data.toJSON());
commands.push(leave.data.toJSON());
commands.push(play.data.toJSON());
commands.push(pause.data.toJSON());
commands.push(resume.data.toJSON());
commands.push(stop.data.toJSON());
commands.push(skip.data.toJSON());
commands.push(loop.data.toJSON());
commands.push(unloop.data.toJSON());

const rest = new REST({ version: '10' }).setToken("MTA3Mzc2Mzk1Mjk5NzE3OTQ1NQ.GSqc64.Niy9piiqkwLXEMa5cY7HvefIJjKYnACJVId788");

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands("1073763952997179455", "534774137902596106"),
			{ body: commands },
		);

		await rest.put(
			Routes.applicationGuildCommands("1073763952997179455", "678697096454471708"),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();