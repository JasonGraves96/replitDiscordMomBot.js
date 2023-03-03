const { REST, Routes } = require('discord.js');
const mySecret = process.env['dsToken']
const ClientId = process.env['clientId']
const ServerId = process.env['serverId']


const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!'
  },{
    name: 'happy',
    description: 'Cheers you up!'
  }];

const rest = new REST({ version: '10' }).setToken(mySecret);


(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(ClientId), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();