const { DiscordAPIError } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

async function handleSuspiciousLinks(message) {
    if (message.author.bot) return;

    if (containsSuspiciousLink(message)) {
        try {
            await deleteMessage(message);
            message.channel.send(`${message.author}, please refrain from posting outside links in this channel.`);
        } catch (error) {
            handleFilterError(error);
        }
    }
}

async function deleteMessage(message) {
    try {
        if (message.deletable) {
            await message.delete();
            // console.log('Message deleted successfully.');
        } else {
            console.log("Message is not deletable.");
        }
    } catch (error) {
        handleFilterError(error);
    }
}

const allowedChannels = process.env.ALLOWED_CHANNELS ? process.env.ALLOWED_CHANNELS.split(',').map(channel => channel.trim()) : [];

function containsSuspiciousLink(message) {
    const linkRegex = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (linkRegex.test(message.content)) {
        // console.log('Suspicious link found:', message.content);
        // Check if the message is in an allowed channel
        if (!isChannelAllowed(message.channel)) {
            try {
                // deleteMessage(message);
                message.author.send(`@${message.author.username}, no outside links are allowed in this channel.`);
                return true; 
            } catch (error) {
                handleFilterError(error);
            }
        }
    }
    return false;
}

function isChannelAllowed(channel) {
    // Check if the channel name or ID is in the array of allowed channels
    return allowedChannels.includes(channel.name) || allowedChannels.includes(channel.id);
}

function handleFilterError(error) {
    // Handle errors specific to the filtering logic
    if (error instanceof DiscordAPIError && error.code === 10008) {
        console.log('Message not found. It may have already been deleted.');
    } else {
        console.error(`Error handling message filter: ${error.message}`);
    }
}

// Export the function
module.exports = {
    handleSuspiciousLinks,
};



//pre cjs
// import { DiscordAPIError } from 'discord.js';
// import dotenv from 'dotenv';  
// dotenv.config();


// export async function handleSuspiciousLinks(message) {
//     if (message.author.bot) return;

//     if (containsSuspiciousLink(message)) {
//         try {
//             await deleteMessage(message);
//             message.channel.send(`${message.author}, please refrain from posting outside links in this channel.`);
//         } catch (error) {
//             handleFilterError(error);
//         }
//     }
// }

// async function deleteMessage(message) {
//     try {
//         if (message.deletable) {
//             await message.delete();
//             // console.log('Message deleted successfully.');
//         } else {
//             console.log("Message is not deletable.");
//         }
//     } catch (error) {
//         handleFilterError(error);
//     }
// }


// //allows certain channels that are declared to have links 
// //declare ALLOWED_CHANNELS in .env
// // const allowedChannels = process.env.ALLOWED_CHANNELS ? process.env.ALLOWED_CHANNELS.split(',') : [];
// // const allowedChannels = process.env.ALLOWED_CHANNELS.split(',');

// const allowedChannels = process.env.ALLOWED_CHANNELS ? process.env.ALLOWED_CHANNELS.split(',').map(channel => channel.trim()) : [];
// // console.log('allowed channels pre:',process.env.ALLOWED_CHANNELS);
// // console.log('allowed channels post:', allowedChannels);
// function containsSuspiciousLink(message) {
//     const linkRegex = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
//     if (linkRegex.test(message.content)) {
//         // console.log('Suspicious link found:', message.content);
//         // Check if the message is in an allowed channel
//         if (!isChannelAllowed(message.channel)) {
//             try {
//                 // deleteMessage(message);
//                 message.author.send(`@${message.author.username}, no outside links are allowed in this channel.`);
//                 return true; 
//             } catch (error) {
//                 handleFilterError(error);
//             }
//         }
//     }
//     return false;
// }

// function isChannelAllowed(channel) {
//     // Check if the channel name or ID is in the array of allowed channels
//     return allowedChannels.includes(channel.name) || allowedChannels.includes(channel.id);
// }



// function handleFilterError(error) {
//     // Handle errors specific to the filtering logic
//     if (error instanceof DiscordAPIError && error.code === 10008) {
//         console.log('Message not found. It may have already been deleted.');
//     } else {
//         console.error(`Error handling message filter: ${error.message}`);
//     }
// }
