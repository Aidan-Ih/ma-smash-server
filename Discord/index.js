const runNutbot = () => {
    const { Client, Events, GatewayIntentBits } = require('discord.js');
    require('dotenv').config();
    token = process.env.NUTBOT_TOKEN
    // Create a new client instance
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ]
    });

    // When the client is ready, run this code (only once).
    // The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
    // It makes some properties non-nullable.
    client.once(Events.ClientReady, readyClient => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    client.on("messageCreate", message => {
        // weegee: 369305001211854858
        if (message.author.id === "369305001211854858" || message.author.id === "236270502430113793") {
            const content = message.content;
            if (content === content.toUpperCase()) {
                message.delete(1000);
                const lower = content.toLowerCase()
                message.channel.send("Message From Weegee: " + lower.charAt(0).toUpperCase() + lower.slice(1));
            }

        }
    })
    // Log in to Discord with your client's token
    client.login(token);
}

module.exports = runNutbot;