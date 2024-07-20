const { DiscordAPIError } = require('discord.js');
const { setTimeout, clearTimeout } = require('timers');

const unsafeSearchMap = new Map();
const unsafeKeywords = ['porn', 'sex', 'xxx', 'nude']; // add more as needed by moderators

function isUnsafeContent(text) {
    const lowerText = text.toLowerCase();
    return unsafeKeywords.some(keyword => lowerText.includes(keyword));
}

async function handleUnsafeSearch(message) {
    const authorId = message.author.id;
    if (unsafeSearchMap.has(authorId)) {
        const data = unsafeSearchMap.get(authorId);
        data.count += 1;
        if (data.count >= 3) {
            const timeoutDuration = 3 * 60 * 1000; // 3 minutes

            const member = message.guild.members.cache.get(authorId);
            if (member) {
                try {
                    await member.timeout(timeoutDuration, 'Exceeded unsafe search threshold');
                    unsafeSearchMap.delete(authorId);
                    message.channel.send(`User ${message.author.username} is timed due to unsafe searches.`);
                } catch (error) {
                    handleUnsafeSearchError(error);
                }
            } else {
                console.error('Member not found.');
            }
        } else {
            message.reply('Unsafe search detected. Please avoid unsafe searches.');
            unsafeSearchMap.set(authorId, data);
        }
    } else {
        unsafeSearchMap.set(authorId, { count: 1 });
        message.reply('Unsafe search detected. Please avoid unsafe searches.');
    }
}

function handleUnsafeSearchError(error) {
    if (error instanceof DiscordAPIError && error.code === 50013) {
        console.log('Missing Permissions - Unable to timeout user.');
    } else {
        console.error(`Error handling unsafe search: ${error.message}`);
    }
}

module.exports = {
    handleUnsafeSearch,
    isUnsafeContent,
    handleUnsafeSearchError,
};
