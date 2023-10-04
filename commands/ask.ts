import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Search, { findKeyTerms } from "../api/search.js";

export default {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask programming-related questions and get somewhat helpful answers.')
        .addStringOption(opt => opt
            .setName('question')
            .setDescription('Your question')
            .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const query = interaction.options.getString('question') || "";
        const helpfulness = 0.2;
        const questions = await Search(query, findKeyTerms(query));
        if (questions.length > 0) {
            const randomQuestion = questions[Math.floor(Math.random() * Math.min(Math.floor(questions.length * (1 - helpfulness)), questions.length))];
            await interaction.reply(JSON.stringify(randomQuestion));
        } else {
            await interaction.reply({ content: 'No answers found :(', ephemeral: true });
        }
    },
};