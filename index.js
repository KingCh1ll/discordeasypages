module.exports = async (message, pages, emojis) => {
    if (!message){
        throw new Error("[Discord.js-pages]: Please provide a valid discord message.")
    }

    if (!pages){
        return new Error("[Discord.js-pages]: Please include pages.")
    }

    if (!emojis){
        emojis = ["⬅", "➡"]
    }

    if (!emojis.length === 2){
        return new Error(`[Discord.js-pages]: Invalid number of emojis. Expected 2, got ${emojis.length}.`)
    }

    var PageNumber = 0
    const CurrentPage = await message.channel.send(pages[PageNumber])

    for (const emoji of emojis){
        CurrentPage.edit(pages[PageNumber].setFooter("Please wait until reactions load!"))

        try {
            await CurrentPage.react(emoji)
        } catch(err) {
            CurrentPage.edit(pages[PageNumber].setFooter("Error occured."))

            return new Error(`[Discord.js-pages]: Error reacting! Are you sure this is a valid emoji?`)
        }
    }

    const Filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id

    const ReactionCollector = CurrentPage.createReactionCollector(Filter, {
        time: 260 * 1000
    })

    ReactionCollector.on("collect", reaction => {
        reaction.users.remove(message.author)

        if (reaction.emoji.name){
            if (emojis[0]){
                PageNumber = PageNumber > 0 ? --PageNumber : pages.length - 1
            } else if (emojis[1]){
                PageNumber = PageNumber + 1 < pages.length ? ++PageNumber : 0
            } else {
                return
            }
        }

        CurrentPage.edit(pages[PageNumber].setFooter(`Page ${PageNumber + 1}/${pages.length}`))
    })

    ReactionCollector.on("end", () => {
        if (!CurrentPage.deleted){
            CurrentPage.reactions.removeAll()
        }
    })

    return CurrentPage
}
