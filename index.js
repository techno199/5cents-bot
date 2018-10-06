const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
const ArgsMap = require('./parser');
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log('Bot is ready to use');
});

client.on('message', message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  // Get command and args without prefix
  const argsMap = new ArgsMap(message);

  //Return if unknown command given
  if (!client.commands.has(argsMap.command)) return
  
  try {
    client.commands.get(argsMap.command).execute(message, argsMap);
  }
  catch(error) {
    console.log(error);
    message.reply('There was an error trying to execute this command')
  }
});

client.on('error', err => {
  console.log(`An error occured ${err}` )
})

client.login(config.token);