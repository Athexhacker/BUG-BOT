
function escapeMarkdownV2(text) {
    return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1'); 
}

exports.noToken = "The bot token cannot be empty, please create a bot via https://t.me/BotFather";

exports.first_chat = (botname, pushname) => {
    return escapeMarkdownV2(`Hi Dear ${pushname}, I am ATHEX Bot, that can destroy WhatsApp users.\n\nJoin All Channel To Unlock 🔓 Menu\n\nAFTER JOIN ALL CLICK HERE /menu`);
};