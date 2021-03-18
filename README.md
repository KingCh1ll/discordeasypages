<div align="center">
    <a href="https://nodei.co/npm/discordeasypages/"><img src="https://nodei.co/npm/discordeasypages.png?downloads=true&stars=true" alt="NPM Info"></a>
</div>

# ❔ About
### ❔ About DiscordEasyPages
An effective & easy-to-use package for making discord.js pages. Built using discord.js version 12. However, DiscordEasyPages will work on older versions. Pages must be embeds.

# 📋 Information
### ❕ Required Programes & Dependencies
This package **REQUIRES** [node.js](https://nodejs.org/). Without it, this package cannot run nor download. You'll also need the package [Discord.js](https://discord.js.org/). When done, run the command bellow in your terminal.
`npm install discordeasypages`

### ❗ Example
Need help using my package? Simple! You must get your discord bot token for this to work.

```
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
    if (message.author.bot){
        return
    }

    if (!message.content.startsWith(Prefix)){
        return
    }

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

        DiscordEasyPages(message, [Embed, Embed2], ["⬅", "➡"])
    }
})

console.log("---------- Logging into Bot ----------") 
Bot.login("YourBotTokenFromDiscordDeveloperHubGoesHere")
```

### 📺 Demo
![Demo](https://user-images.githubusercontent.com/77991729/111636437-dd417780-87ce-11eb-971e-8cdbb50d84a5.mp4)

### ⁉ Support
If you acquire help, we ask that you join [KingCh1ll's Server](https://discord.gg/5DzTfHs7dy) on [Discord](https://discord.com) & open a ticket. If you dont have discord, you may open up a discussion!
