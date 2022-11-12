const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong"),
    async execute(interaction) {
        const ping = new Date().getTime() - interaction.createdTimestamp;
        return interaction.reply(
            ":ping_pong: Pong! \n" +
            "```\n" +
            "Latency: " + ping.toString() + "ms```"
        );
    },
};