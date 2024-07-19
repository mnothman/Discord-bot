const { DiscordAPIError } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const { setTimeout, clearTimeout } = require('timers'); // Import setTimeout and clearTimeout

const map = new Map();

async function handleSpam(message) {
    if (map.has(message.author.id)) {
        const data = map.get(message.author.id);
        const { lastmsg, timer } = data;
        const diff = message.createdTimestamp - lastmsg.createdTimestamp;
        let msgs = data.msgs;
        if (diff > 2000) { // If sent within 2 seconds
            clearTimeout(timer);
            data.msgs = 1;
            data.lastmsg = message;
            data.timer = setTimeout(() => {
                map.delete(message.author.id);
            }, 5000);
            map.set(message.author.id, data);
        } else {
            ++msgs;
            if (parseInt(msgs) === 5) {
                const timeoutDuration = 3 * 60 * 1000; // 5 minutes

                // Timeout the user for 5 minutes
                const member = message.guild.members.cache.get(message.author.id);
                if (member) {
                    try {
                        await member.timeout(timeoutDuration, 'Exceeded spam threshold');
                        map.delete(message.author.id);
                        message.channel.send(`User ${message.author.username} is timed out for 3 minutes due to spamming.`);
                    } catch (error) {
                        handleSpamError(error);
                    }
                } else {
                    console.error('Member not found.');
                }
            } else {
                data.msgs = msgs;
                map.set(message.author.id, data);
            }
        }
    } else {
        let remove = setTimeout(() => {
            map.delete(message.author.id);
        }, 5000);
        map.set(message.author.id, {
            msgs: 1,
            lastmsg: message,
            timer: remove,
        });
    }
}

function handleSpamError(error) {
    if (error instanceof DiscordAPIError && error.code === 50013) {
        console.log('Missing Permissions - Unable to timeout user.');
    } else {
        console.error(`Error handling spam: ${error.message}`);
    }
}

// Export the function
module.exports = {
    handleSpam,
};


//pre cjs

// import { DiscordAPIError } from 'discord.js';
// import dotenv from 'dotenv';  
// dotenv.config();
// import { setTimeout } from 'timers';


// const map = new Map();

// export async function handleSpam(message) {
//     if (map.has(message.author.id)) {
//         const data = map.get(message.author.id);
//         const { lastmsg, timer } = data;
//         const diff = message.createdTimestamp - lastmsg.createdTimestamp;
//         let msgs = data.msgs;
//         if (diff > 2000) { // If sent within 2 seconds
//             clearTimeout(timer);
//             data.msgs = 1;
//             data.lastmsg = message;
//             data.timer = setTimeout(() => {
//                 map.delete(message.author.id);
//             }, 5000);
//             map.set(message.author.id, data);
//         } else {
//             ++msgs;
//             if (parseInt(msgs) === 5) {
//                 const timeoutDuration = 3 * 60 * 1000; // 5 minutes

//                 // Timeout the user for 5 minutes
//                 const member = message.guild.members.cache.get(message.author.id);
//                 if (member) {
//                     try {
//                         await member.timeout(timeoutDuration, 'Exceeded spam threshold');
//                         map.delete(message.author.id);
//                         message.channel.send(`User ${message.author.username} is timed out for 3 minutes due to spamming.`);
//                     } catch (error) {
//                         handleSpamError(error);
//                     }
//                 } else {
//                     console.error('Member not found.');
//                 }
//             } else {
//                 data.msgs = msgs;
//                 map.set(message.author.id, data);
//             }
//         }
//     } else {
//         let remove = setTimeout(() => {
//             map.delete(message.author.id);
//         }, 5000);
//         map.set(message.author.id, {
//             msgs: 1,
//             lastmsg: message,
//             timer: remove,
//         });
//     }
// }

// function handleSpamError(error) {
//     if (error instanceof DiscordAPIError && error.code === 50013) {
//         console.log('Missing Permissions - Unable to timeout user.');
//     } else {
//         console.error(`Error handling spam: ${error.message}`);
//     }
// }


// //error with termination due to missing permissions, terminates bot when owner tries to get muted from bot

// // export async function handleSpam(message) {
// //     if (map.has(message.author.id)) {
// //         const data = map.get(message.author.id);
// //         const { lastmsg, timer } = data;
// //         const diff = message.createdTimestamp - lastmsg.createdTimestamp;
// //         let msgs = data.msgs;
// //         if (diff > 2000) { // If sent within 2 seconds
// //             clearTimeout(timer);
// //             data.msgs = 1;
// //             data.lastmsg = message;
// //             data.timer = setTimeout(() => {
// //                 map.delete(message.author.id);
// //             }, 5000);
// //             map.set(message.author.id, data);
// //         } else {
// //             ++msgs;
// //             if (parseInt(msgs) === 5) {
// //                 const timeoutDuration = 5 * 60 * 1000; // 5 minutes

// //                 // Timeout the user for 5 minutes
// //                 const member = message.guild.members.cache.get(message.author.id);
// //                 if (member) {
// //                     await member.timeout(timeoutDuration, 'Exceeded spam threshold');
// //                     map.delete(message.author.id);

// //                     message.channel.send(`User ${message.author.username} is timed out for 5 minutes due to spamming.`);
// //                 } else {
// //                     console.error('Member not found.');
// //                 }
// //             } else {
// //                 data.msgs = msgs;
// //                 map.set(message.author.id, data);
// //             }
// //         }
// //     } else {
// //         let remove = setTimeout(() => {
// //             map.delete(message.author.id);
// //         }, 5000);
// //         map.set(message.author.id, {
// //             msgs: 1,
// //             lastmsg: message,
// //             timer: remove,
// //         });
// //     }
// // }

