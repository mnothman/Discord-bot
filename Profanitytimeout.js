import { DiscordAPIError } from 'discord.js';
import BadWordsFilter from 'bad-words';

const profanityFilter = new BadWordsFilter();
const profanityCounts = new Map();

export async function handleProfanity(message) {
    // Your profanity handling logic here
    const userId = message.author.id;
    const userProfanityCount = profanityCounts.get(userId) || 0;

    // Check if the message is deletable
    if (message.deletable) {
        await message.delete();
    } else {
        console.log("Message is not deletable.");
    }

    profanityCounts.set(userId, userProfanityCount + 1);

    message.channel.send(`${message.author}, please refrain from using profanity. Profanity count: ${userProfanityCount + 1} / 3`);

    const profanityThreshold = 3;
    if (userProfanityCount + 1 >= profanityThreshold) {
        const timeoutDuration = 30 * 60 * 1000; // 30 minutes

        const member = message.guild.members.cache.get(userId);
        if (member) {
            // Timeout the user for 30 minutes
            await member.timeout(timeoutDuration, 'Exceeded profanity threshold');

            const moderatorChannelId = process.env.MODERATOR_CHANNEL_ID;
            const moderatorChannel = message.guild.channels.cache.get(moderatorChannelId);

            if (moderatorChannel) {
                moderatorChannel.send(`User ${message.author.tag} has been timed out automatically for exceeding the profanity threshold.`);
            } else {
                console.error('Moderator channel not found.');
            }

            // Set a timeout to reset the profanity count after the timeout
            setTimeout(() => {
                profanityCounts.delete(userId);
            }, timeoutDuration);
        } else {
            console.error('Member not found.');
        }
    }
}

function handleProfanityError(error) {
    // Handle errors specific to the profanity handling logic
    if (error instanceof DiscordAPIError && error.code === 10008) {
        console.log('Message not found. It may have already been deleted.');
    } else {
        console.error(`Error handling profanity: ${error.message}`);
    }
}