// const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
// const ytdl = require('ytdl-core');

// class MusicPlayer {
//     constructor() {
//         this.queue = [];
//         this.connection = null;
//         this.player = createAudioPlayer();
//     }

//     async joinChannel(channel) {
//         this.connection = joinVoiceChannel({
//             channelId: channel.id,
//             guildId: channel.guild.id,
//             adapterCreator: channel.guild.voiceAdapterCreator,
//         });
//         this.connection.subscribe(this.player);

//         this.player.on(AudioPlayerStatus.Idle, () => {
//             // Play the next song when the player is idle
//             this.playNext();
//         });
//     }

//     async play(url) {
//         const stream = ytdl(url, { filter: 'audioonly' });
//         const resource = createAudioResource(stream);

//         this.player.play(resource);
//     }

//     playNext() {
//         // Check if there are more songs in the queue
//         if (this.queue.length > 0) {
//             const nextSong = this.queue.shift();
//             this.play(nextSong);
//         } else {
//             // No more songs in the queue, disconnect from the channel
//             this.connection.destroy();
//         }
//     }

//     enqueue(url) {
//         this.queue.push(url);

//         // If the player is idle, start playing the next song
//         if (this.player.state.status === AudioPlayerStatus.Idle) {
//             this.playNext();
//         }
//     }
// }

// module.exports = MusicPlayer;
