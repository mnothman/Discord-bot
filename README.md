Features: <br />
Using the Google Cloud Translate API, simply add !translate at the end of a message, and it will automatically detect and translate the message to the set language (default is English). <br />  <br />
[
![translate1](https://github.com/user-attachments/assets/5270edae-d1e2-402f-adfd-64b4954161dc)
](url)   <br />

![translate2](https://github.com/user-attachments/assets/94ab8d16-bf7b-4294-9a07-32fd1793a8df) <br /> <br />

Our bot features a robust automatic profanity filter to maintain a respectful environment, and can automatically time users out. Includes a common list of banned words and the ability to add custom words to the filter by moderators. This feature can be turned off or enabled/disabled in chosen chat rooms by moderators. <br /> <br />
Example of 3 separate messages being sent with profanity:  <br />  <br />
![profanityfilter1](https://github.com/user-attachments/assets/05698dcb-537a-4298-9dab-2c2bea68fa0e)  <br />  <br />

Our bot includes a spam prevention feature that automatically detects and manages spam messages. If a user sends multiple messages in quick succession, the bot temporarily restricts the user to prevent further spam, ensuring a clean and orderly chat environment. This feature can be turned off or enabled/disabled in chosen chat rooms by moderators.  <br />  <br />
![spammingexample](https://github.com/user-attachments/assets/fe2b72c4-a946-4f7c-9795-e502b325cbdf)  <br />  <br />  


Our bot also features a convenient search functionality powered by the Google Custom Search API. Users can append !search to their queries, and the bot will provide relevant search results directly in the chat. To ensure a safe browsing experience, Google SafeSearch is enabled and moderators can add restricted words to be filtered out. The bot will warn users and take action if inappropriate content is detected. <br />  <br />
![searchexample1](https://github.com/user-attachments/assets/5abbd54b-c336-4da2-b8cf-42cbd08231f7)<br />  <br />
More button displays link: <br />
![searchexample2](https://github.com/user-attachments/assets/b56e6ab2-d0ac-4752-b41d-1cf08ccb9902) <br />  <br />
![searchexample3](https://github.com/user-attachments/assets/ca4f2c3e-c3f3-4941-927a-6124cb45d6d3) <br />  <br />


<br />  <br />


To update slash commands (make global or specific guild), run: node deploy-commands.cjs  <br />
Read comments on line 45 to make global (only do after testing) <br />
https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands <br />


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
