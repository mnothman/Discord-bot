
.env missing:
DISC_TOKEN="token for bot"
MODERATOR_CHANNEL_ID="sends message to specific channel for moderators"
ALLOWED_CHANNELS="allowed channels (copy channel id) for links where links are allowed"

Coming changes: dashboard for bot to allow profanity, links, spam in channels, automatic translation for most languages using google translate api. currently have it manually for links only


.env missing: MODERATOR_CHANNEL_ID= "sends message to specific channel for moderators"
clientId: Your application's client id (Discord Developer Portal > "General Information" > application id)
guildId: Your development server's id (Enable developer mode > Right-click the server title > "Copy ID")

MODERATOR_CHANNEL_ID: for update messages sent to moderation team channel
ALLOWED_CHANNELS: channels where profanity/links/etc allowed (config this more later)

node deploy-commands.cjs //for command updates

run project:
node . //run project backend (port 5000)
npx vite dev --host --port 8000 //run project frontend
