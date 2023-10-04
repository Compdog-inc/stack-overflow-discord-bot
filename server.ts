import 'dotenv/config';
import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import ask from "./commands/ask.js";
import set from "./commands/set.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    try {
        if (interaction.commandName === "ask") {
            await ask.execute(interaction);
        } else if (interaction.commandName === "set") {
            await set.execute(interaction);
        }
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

const rest = new REST().setToken(process.env.BOT_TOKEN || "");

(async () => {
    try {
        console.log(`Started refreshing application (/) commands.`);

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID || ""),
            { body: [ask.data.toJSON(), set.data.toJSON()] },
        );

        console.log(`Successfully reloaded application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});


client.login(process.env.BOT_TOKEN);