// requirements: discord.js-selfbot-v13, discordjs/voice, axios

const { fork } = require('child_process');
const fs = require("fs")
const readline = require("readline")


async function read_txt_file(filePath) {
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

async function start_the_tokens() {
    const voice_channel_tokens_array = await read_txt_file("./src/util/vc_tokens.txt")

    for (const token of voice_channel_tokens_array) {
        const child = fork('boot_multiple_tokens.js', [token]);
        child.on('message', (message) => {
        console.log(`Child process ${child.pid} sent a message:`, message);
        })
    }
}

start_the_tokens()

