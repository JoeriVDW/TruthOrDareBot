const { Events } = require("discord.js");
const tod = require("../commands/tod.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if(interaction.isChatInputCommand()) {
            console.log(interaction.client.commands);
            const command = interaction.client.commands.get(interaction.commandName);

            if(!command) {
                console.error(`No command matching "${interaction.commandName}".`);
            }

            try {
                await command.execute(interaction);
            } catch (e) {
                console.error(e);
                await interaction.reply({ content: "There was an error while executing the command!", ephemeral: true})
            }
        } else if(interaction.isButton()) {
            await interaction.reply({
                embeds: [await tod.getQuestionEmbed(interaction.customId, interaction.user)],
                ephemeral: false,
                components: [await tod.getRow()]
            });
        }
    }
}