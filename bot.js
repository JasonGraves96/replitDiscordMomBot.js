/*import { Client, GatewayIntentBits } from "discord.js";
import { ChatGPT } from "discord-chat-gpt";
*/

const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
const { Configuration, OpenAIApi} = require("openai");
const configuration = new Configuration({
  apiKey: process.env['openAIkey'],
});
const openai = new OpenAIApi(configuration);
const fetch = require("node-fetch")
const fs = require('fs');
const ytdl = require('ytdl-core');
const mySecret = process.env['dsToken']
const Nwords = ["nigger", "nigg", "nigga", "nigglet", "niglet", "niggas"];
const Ketchup = ["ketchup"];
const atMom = ["@Mom"];
const EBR = [". Epic Rap Battles Of History"];


let prompt =`The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.

Human: Hello, who are you?
AI: I am an AI created by OpenAI. How can I help you today?
Human: is furious gay?
AI: I'm sorry, I'm not sure how to answer that. Can you tell me what you're trying to ask?
Human: do you know anything?

AI: Yes, I know a lot of things! Is there something in particular you'd like to know?
Human: list of avgn episodes?
AI: Sure, I can provide you with a list of Angry Video Game Nerd episodes.
Human: what are they?

AI: The list of Angry Video Game Nerd episodes includes: "Pac-Man," "Haunted Castle," "CastleVania 2," "The Karate Kid," "Double Dragon 3," "Teenage Mutant Ninja Turtles," and more!

Human: is Furious gay?
AI: Yes Furious is gay`;

client.login(mySecret);

/*
async function getQuote(){
  const response = await fetch("https://zenquotes.io/api/random");
  var data = await response.json();
  return data;
}
*/

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
    })
    .then(data => {
      return data[0]["q"] + " -" + data[0]["a"]
    })
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
    
  } else if (interaction.commandName === 'happy') {
    
    await getQuote().then(quote => interaction.reply(quote))
  }
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return
  //console.log(msg.content);
  //console.log(msg.author);
  //MAKE THIS NOT CASE SENSETIVE!!
  
  if(Nwords.some(word => msg.content.toLowerCase().includes(word))){
    msg.reply("Please don't say the N word.") 
     msg.member.timeout(60_000, "Said the N word");
    return;
  }
  
  if(Ketchup.some(word => msg.content.toLowerCase().includes(word))){
    msg.reply("That's nasty.")
  }

   if (validateYouTubeUrl(msg) === true){
    ytdl.getInfo(msg.content).then(info => {
    console.log(info.videoDetails.title);
     if(EBR.some(word => info.videoDetails.title.includes(word))){
    msg.member.timeout(30_000, "Posted Epic Crap Battles Of History");
    msg.delete(1000);
  }
})
   }else{}

if(msg.mentions.has(client.user)){
prompt += `You: ${msg.content}\n`;
  (async () => {
        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
  prompt: prompt,
  temperature: 1,
  max_tokens: 150,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0.6,
  stop: [" Human:", " AI:"],
          });
        msg.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
        prompt += `${gptResponse.data.choices[0].text}\n`;
    })();
    //msg.reply("@ recieved!")
  }
});

function validateYouTubeUrl(url){
                    if (url) {
                        var regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
                        if (String(url).match(regExp)) {
                            return true;
                        }
                    }
                    return false;
                }//end youtube url parcer

