const messageCreateHandler = (message) => {
    // weegee: 369305001211854858
    if (message.author.id === "369305001211854858" || message.author.id === "236270502430113793") {
        const content = message.content;
        if (content === content.toUpperCase()) {
            message.channel.send("Message From Weegee: " + lower.charAt(0).toUpperCase() + lower.slice(1));
            message.delete(1000);
            const lower = content.toLowerCase()
        }
    }
}