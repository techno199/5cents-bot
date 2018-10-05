<h1>Quickstart:</h1><br>
Install node.js. Tested version is 8.11.<br>
Create and save config.json file in the root folder.<br>
Shape of config as follows:<br>
{<br>
  "prefix": "/",<br>
  "token": "Insert your auth token here"<br>
}<br>
Open console in the root folder and type: node index.js<br>
Bot should say that it's ready to use.

<h4>How do I get auth token?</h4>
Got to <a href='https://discordapp.com/developers/applications'>your applications</a>, add new application and create a bot in Bot tab.
Give your child fancy avatar and nickname, and there it is - your token.
<h4>How do I invite bot to the channel?</h4>
You have to have 'Manage Server' permission first. If you do, go to your application settings and copy its ID.
Paste you client ID into this link https://discordapp.com/oauth2/authorize?client_id=<h5>YOU_CLIENT_ID_GOES_HERE</h5>&scope=bot and follow it in your browser.
Viola!