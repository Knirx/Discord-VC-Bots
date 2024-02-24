const fs = require("fs")
const { Client } = require("discord.js-selfbot-v13")
const readline = require("readline")
const axios = require("axios")
const { joinVoiceChannel } = require("@discordjs/voice");
const token_2 = process.argv[2]


const voice_channel_id = "123"

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function get_random_item_array(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

async function read_bottom_line_txt(filePath) {
    const lines_array = []
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    for await (const line of rl) {
        lines_array.push(line)
    }
    return lines_array
}

async function changeStatus(status_text, status, headers) {
    try {
        await axios.patch(
            "https://discord.com/api/v8/users/@me/settings", { status: status, custom_status: { text: status_text } }, { headers: headers }
          );
          
        await sleep(1000);
    } catch (error) {
        console.log(error)
        }
}

async function boot_all_tokens () {
    const bot_status = ["idle", "online", "dnd", "invisible"];
    const bot = new Client();
    bot.login(token_2);
    bot.on('ready', async () => {
    console.log(`Bot is online as ${bot.user.tag}`)
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token_2,
        }
        }
    await changeStatus(get_random_item_array(await read_bottom_line_txt("statuses.txt")), get_random_item_array(bot_status), headers.headers) // statuses file path
    await voiceChannelBots(bot.channels.cache.get(voice_channel_id))
      });
}

async function voiceChannelBots(channel) {
    if (channel?.type === "GUILD_VOICE") {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false
      });
  }
}
while (true) {
    boot_all_tokens()
    sleep(86390000)
}