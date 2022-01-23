<div align="center">
    <a href="https://nodei.co/npm/discordeasypages/"><img src="https://nodei.co/npm/discordeasypages.png?downloads=true&stars=true" alt="NPM Info"></a>
</div>

# ❔ About
### ❔ About DiscordEasyPages
An effective and easy-to-use package for making discord.js button pages for Discord bots. Each page supplied must be a message embed. Inspired by Discord-pagnation.

[Click here to view demo!](https://user-images.githubusercontent.com/77991729/150664039-c367f6f7-0b95-4f8b-af62-122966510717.mp4)
*DiscordEasyPages in action!*

# 📋 Information
### ❕ Required Programs and Dependencies
This package **REQUIRES** [node.js](https://nodejs.org/). Without it, this package cannot run nor download. You'll also need the package [Discord.js](https://discord.js.org/). When done, run `npm install discordeasypages` in your terminal. If you need help, view the example below.

### ❗ Example
Need help using my package? Simple! You must get your discord bot token for this to work.

```js
// Librarys //
const Discord = require("discord.js")
const DiscordEasyPages = require("discordeasypages")

// Bot //
const Bot = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],

  presence: {
    activity: {
      name: `Example bot for the package DiscordEasyPages!`,
      type: "PLAYING"
    },
    status: "online"
  }
})

const Prefix = "^"

// Code //
Bot.on("message", (message) => {
    if (message.author.bot) return

    if (!message.content.startsWith(Prefix)) return

    const Arguments = message.content
        .slice(Prefix.length)
        .trim()
        .split(/ +/g)
    const command = Arguments.shift()

    if (command.toLowerCase() == "page"){
        const Embed = new Discord.MessageEmbed()
            .setTitle("Page 1")
            .setDescription("Welcome to page 1!")

        const Embed2 = new Discord.MessageEmbed()
            .setTitle("Page 2")
            .setDescription("Welcome to page 2!")

        DiscordEasyPages(message, [Embed, Embed2])
    }
})

console.log("---------- Logging into Bot ----------") 
Bot.login("YourBotTokenFromDiscordDeveloperHubGoesHere")
```


### ⁉ Support
If you acquire help, we ask that you join [KingCh1ll's Discord Server](https://discord.gg/MKKeRU2y4x) & open a ticket. If you don't have discord, you may open up a discussion in our github!
