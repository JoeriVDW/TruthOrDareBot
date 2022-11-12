const { Events } = require("discord.js");

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

        }
    }
}