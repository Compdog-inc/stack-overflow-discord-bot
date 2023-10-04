import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { readGuilds, writeGuilds } from "../settings.js";

export default {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Set the answer parameters for the current server.')
        .addNumberOption(opt => opt
            .setName('helpfulness')
            .setDescription('The helpfuless percentage.')
            .setMinValue(0)
            .setMaxValue(100)
            .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        try {
            const helpfulness = interaction.options.getNumber('helpfulness') || 80;
            const guilds = await readGuilds();
            guilds[interaction.guildId || "no_guild"] = Math.min(100, Math.max(0, helpfulness)) / 100;
            await writeGuilds(guilds);
            await interaction.reply({
                content: "Successfully set helpfuless to " + helpfulness + "%"
            });
        } catch {
            await interaction.reply({
                content: "Error setting parameters",
                ephemeral: true
            });
        }
    },
};