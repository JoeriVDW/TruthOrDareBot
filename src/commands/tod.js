const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
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
        await setQuestion(interaction.options.getString("tod"));
        async function setQuestion(t) {
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
                        await setQuestion(options[getRandomInt(options.length)])
                        break;
                }
            }

            if(t !== "random") {
                const finalEmbed = await new EmbedBuilder()
                    .setColor(0x5865f2)
                    .setAuthor({name: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL()})
                    .setTitle(question)
                    .setFooter({text: `Type: ${t.toUpperCase()} | Index: ${questionIndex}`})

                await interaction.reply({embeds: [finalEmbed]});
            }
        }
    },
};