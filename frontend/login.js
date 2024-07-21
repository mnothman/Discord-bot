function generateRandomString() {
	let randomString = '';
	const randomNumber = Math.floor(Math.random() * 10);

	for (let i = 0; i < 20 + randomNumber; i++) {
		randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
	}

	return randomString;
}


window.onload = () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType, state] = [fragment.get('access_token'), fragment.get('token_type'), fragment.get('state')];

    if (!accessToken) {
        const randomString = generateRandomString();
        localStorage.setItem('oauth-state', randomString);

        document.getElementById('login').href += `&state=${encodeURIComponent(btoa(randomString))}`;
        return document.getElementById('login').style.display = 'block';
    }

    if (localStorage.getItem('oauth-state') !== atob(decodeURIComponent(state))) {
        return console.log('You may have been click-jacked!');
    }

    fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenType} ${accessToken}`,
        },
    })
        .then(result => result.json())
        .then(response => {
            const { username, discriminator, avatar, id } = response;
            document.getElementById('info').innerText += ` ${username}#${discriminator}`;
            let img = document.createElement('img');
					// Use the correct avatar URL format
					let avatarURL = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
					img.src = avatarURL;
					document.body.appendChild(img);
                    document.getElementById('avatar-container').appendChild(img);

        })
        .catch(console.error);

        //for guilds
        fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            authorization: `${tokenType} ${accessToken}`,
        },
    })
        .then(result => result.json())
        .then(response => {
            let guilds = document.createElement('div');
            guilds.innerText = 'GUILDS';
            document.body.appendChild(guilds);
            for(const guild of response) {
                if (guild.owner || guild.permissions.includes('MANAGE_GUILD')) {
                    let g = document.createElement('p');
                    g.innerText += `${guild.name}`;
                    guilds.appendChild(g);
            }
        }
        })
        .catch(console.error);

        document.getElementById('add-to-server').addEventListener('click', () => {
            // Redirect to the authorization URL when the button is clicked
            //Works for adding to server. Is not implemented anywhere, add to server is handled in index.html
            window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=1177780282003296387&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A8000&scope=bot';
        });
}