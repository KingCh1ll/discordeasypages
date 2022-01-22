const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require("discord.js");

/**
 * DiscordEasyPages constructor.
 * @param {Object} message - Discord message.
 * @param {Object} pages - Discord.js Embeds in a table.
 * @param {Object} options - Options for the DiscordEasyPages.
 * @param {string[]} options.emojis - Custom emojis that act as buttons to interact with the embeds.
 * @param {boolean} options.authoronly - Whether the reactions should only be used by the author.
 * @param {string} options.footer - Custom footer for the embeds.
 * @param {number} options.timeout - Timeout until emojis will be removed. Default: 250 seconds.
 * @returns {Object} CurrentPage
 */

module.exports = async (message, pages, menuName = "pages", options = {}) => {
    if (!message) throw new Error("[DiscordEasyPages]: Please provide a valid discord message.");
    if (!pages) return new Error("[DiscordEasyPages]: Please include pages.");
    if (!options.emojis) options.emojis = ["⬅️", "◀️", "#️⃣", "▶️", "➡️"];
    if (!options.authoronly) options.authoronly = true;
    if (!options.footer) options.footer = "⚡";
    if (!options.timeout) options.timeout = 300 * 1000;
    if (!options.emojis.length === 2) return new Error(`[DiscordEasyPages]: Invalid custom number of emojis. Expected 2, got ${options.emojis.length}.`);

    const quickLeft = new MessageButton()
        .setEmoji(options.emojis[0])
        .setCustomId("quickLeft")
        .setStyle("PRIMARY");

    const left = new MessageButton()
        .setEmoji(options.emojis[1])
        .setCustomId("left")
        .setStyle("PRIMARY");

    const number = new MessageButton()
        .setEmoji(options.emojis[2])
        .setCustomId("number")
        .setStyle("PRIMARY");

    const right = new MessageButton()
        .setEmoji(options.emojis[3])
        .setCustomId("right")
        .setStyle("PRIMARY");

    const quickRight = new MessageButton()
        .setEmoji(options.emojis[4])
        .setCustomId("quickRight")
        .setStyle("PRIMARY");

    let PageNumber = 0;
    const CurrentPage = await message.reply({
        embeds: [
            pages[PageNumber]
        ],
        components: [new MessageActionRow().addComponents(quickLeft, left, number, right, quickRight)],
        fetchReply: true
    }).catch(err => { });

    CurrentPage.edit({
        embeds: [
            pages[PageNumber].setFooter({
                text: `${options.footer} • Page ${PageNumber + 1}/${pages.length}`
            })
        ],
    });

    const collector = CurrentPage.createMessageComponentCollector({
        filter: interaction => {
            if (!interaction.deferred) interaction.deferUpdate();

            if (options.authoronly === true) return interaction.user.id === message.author.id;
        },
        time: options.timeout
    });

    collector.on("collect", async interaction => {
        if (interaction.customId) {
            if (interaction.customId === "quickLeft") {
                PageNumber = 0;
            } else if (interaction.customId === "left") {
                if (PageNumber > 0) {
                    --PageNumber;
                } else {
                    PageNumber = pages.length - 1;
                }
            } else if (interaction.customId === "right") {
                if (PageNumber + 1 < pages.length) {
                    ++PageNumber;
                } else {
                    PageNumber = 0;
                }
            } else if (interaction.customId === "quickRight") {
                PageNumber = pages.length - 1;
            } else if (interaction.customId === "number") {
                const infoMsg = await message.reply("Please send a page number.");

                await message.channel.awaitMessages({ filter: msg => {
                    if (msg.author.id === msg.client.user.id) return false;
                    if (options.authoronly === true && !interaction.user.id === message.author.id) return false;

                    if (!msg.content) {
                        msg.reply("Please send a number!");

                        return false;
                    }

                    if (!parseInt(msg.content) && isNaN(msg.content)) {
                        msg.reply("Please send a valid number!");

                        return false;
                    }

                    if (parseInt(msg.content) > pages.length) {
                        msg.reply("That's a page number higher than the amount of pages there are.");

                        return false;
                    }

                    return true;
                }, max: 1, time: 30 * 1000, errors: ["time"] }).then(async collected => {
                    const input = parseInt(collected.first().content);

                    PageNumber = input - 1;
                    collected.first().delete().catch(err => { });
                    infoMsg.delete().catch(err => { });
                }).catch(async collected => await message.replyT("Canceled due to no valid response within 30 seconds."));
            } else {
                return;
            }
        }

        if (!pages[PageNumber]) return;

        CurrentPage.edit({
            embeds: [
                pages[PageNumber].setFooter({
                    text: `${options.footer} • Page ${PageNumber + 1}/${pages.length}`
                })
            ],
        });
    });

    collector.on("end", async () => {
        await CurrentPage.edit({
            embeds: [
              CurrentPage
                .setTitle(await message.translate("Timed Out!"), bot.user.displayAvatarURL({ dynamic: true }))
                .setDescription(await message.translate("Please rerun command."))
            ],
            components: []
        }).catch(err => {});
    });

    return CurrentPage;
};
