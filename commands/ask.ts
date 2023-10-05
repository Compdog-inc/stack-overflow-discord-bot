import { ButtonBuilder, CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ButtonStyle, ActionRowBuilder, ComponentType } from "discord.js";
import Search, { findKeyTerms } from "../api/search.js";
import { parse } from 'node-html-parser';
import { readGuilds, writeGuilds } from "../settings.js";

const getAnswer = async (query: string, helpfulness: number) => {
    const questions = (await Search(query, findKeyTerms(query))).filter(q => q.is_answered); // get answered questions
    if (questions.length > 0) {
        const randomQuestion = questions[Math.floor(Math.random() * Math.min(Math.floor(questions.length * (1 - helpfulness)), questions.length))];
        if (typeof (randomQuestion.answers) !== 'undefined') {
            const answer = randomQuestion.answers[Math.floor(Math.random() * randomQuestion.answer_count)];
            let markdown = answer.body_markdown ?? "No Answer";
            markdown = markdown
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("&le;", "<")
                .replaceAll("&ge;", ">")
                .replaceAll("&quot;", "\"")
                .replaceAll("&#39;", "'");

            const root = parse(markdown);

            return {
                embeds: [new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(query)
                    .setURL(randomQuestion.link)
                    .setAuthor({ name: randomQuestion.owner?.display_name ?? "Unknown", iconURL: randomQuestion.owner?.profile_image, url: randomQuestion.owner?.link })
                    .setDescription(root.toString())
                    .setTimestamp()
                    .setFooter({ text: 'Found with helpfulness: ' + helpfulness.toPrecision(2) })],
                components: [
                    <any>new ActionRowBuilder()
                        .addComponents(new ButtonBuilder()
                            .setCustomId('redo')
                            .setLabel('Different Answer')
                            .setStyle(ButtonStyle.Secondary)).toJSON()
                ]
            };
        } else {
            return null;
        }
    } else {
        return null;
    }
};

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
        const guilds = await readGuilds();
        if (typeof (guilds[interaction.guildId || "no_guild"]) === 'undefined') {
            guilds[interaction.guildId || "no_guild"] = 0.8;
            await writeGuilds(guilds);
        }

        const helpfulness = guilds[interaction.guildId || "no_guild"];

        const answer = await getAnswer(query, helpfulness);
        if (answer == null) {
            await interaction.reply({ content: 'No answers found :(', ephemeral: true });
        } else {
            const response = await interaction.reply(answer);
            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3_600_000 });

            collector.on('collect', async i => {
                if (i.customId === "redo") {
                    const a2 = await getAnswer(query, helpfulness);
                    if (a2 == null) {
                        await i.update({ content: 'No answers found :(' });
                    } else {
                        await i.update(a2);
                    }
                }
            });
        }
    },
};