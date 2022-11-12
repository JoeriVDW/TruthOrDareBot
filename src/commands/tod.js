const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const path = require("path");
const fs = require("fs");
const { getRandomInt } = require("../utils/MathUtils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tod")
        .setDescription("Truth Or Dare?")
        .addStringOption(option =>
            option.setName("tod")
                .setDescription("Truth or Dare?")
                .setRequired(true)
                .addChoices(
                    { name: "Truth", value: "truth"},
                    { name: "Dare", value: "dare"},
                    { name: "Random", value: "rnd"},
                )
        ),
    async execute(interaction) {
        await interaction.reply({
            embeds: [await this.getQuestionEmbed(interaction.options.getString("tod"), interaction.user)],
            ephemeral: false,
            components: [await this.getRow()]
        });
    },
    async getQuestionEmbed(t, user) {
        let questionIndex = 0;
        let question = "No question found!";

        const filesPath = path.join(__dirname, "../temp/questions");
        const commandFiles = fs.readdirSync(filesPath).filter(file => file.endsWith(".txt"));
        console.log(t);
        for await(const file of commandFiles) {
            switch (t) {
                case "truth":
                    if (file.startsWith("truths")) {
                        const finalPath = path.join(filesPath, file);
                        const list = fs.readFileSync(finalPath).toString().split(/\r?\n/);
                        console.log(`Found (${list.length}) truths`);
                        questionIndex = getRandomInt(list.length);
                        question = list[questionIndex];
                    }
                    break;
                case "dare":
                    if (file.startsWith("dares")) {
                        const finalPath = path.join(filesPath, file);
                        const list = fs.readFileSync(finalPath).toString().split(/\r?\n/);
                        console.log(`Found (${list.length}) dares`);
                        questionIndex = getRandomInt(list.length);
                        question = list[questionIndex];
                    }
                    break;
                case "random":
                    const options = ["truth", "dare"];
                    return this.getQuestionEmbed(options[getRandomInt(options.length)], user)
            }
        }

        if(t !== "random") {
            return new EmbedBuilder()
                .setColor(0x5865f2)
                .setAuthor({name: `Requested by ${user.tag}`, iconURL: user.avatarURL()})
                .setTitle(question)
                .setFooter({text: `Type: ${t.toUpperCase()} | Index: ${questionIndex}`});
        }
    },
    async getRow() {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('truth')
                    .setLabel("Truth")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('dare')
                    .setLabel("Dare")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('random')
                    .setLabel("Random")
                    .setStyle(ButtonStyle.Primary)
            );
    }
};