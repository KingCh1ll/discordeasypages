const Discord = require("discord.js");

/**
 * DiscordEasyPages constructor.
 * @param {Object} message - Discord message.
 * @param {Object} pages - Discord.js Embeds in a table.
 * @param {Object} emojis - Emojis.
 * @param {String} footer - Footer next that goes aside the page number.
 * @param {Number} authoronly - If only the author should be able to change the page. Default true.
 * @param {Number} timeout - Timeout until emojis will be removed. Default: 250 seconds.
 * @returns {Object} CurrentPage
 */

module.exports = async (message, pages, emojis, footer, authoronly, timeout) => {
  if (!message) {
    throw new Error("[DiscordEasyPages]: Please provide a valid discord message.");
  }

  if (!pages) {
    return new Error("[DiscordEasyPages]: Please include pages.");
  }

  if (!emojis) {
    emojis = ["⬅", "➡"];
  }

  if (!authoronly) {
    authoronly = true;
  }

  if (!footer) {
    footer = "⚡";
  }

  if (!timeout) {
    timeout = 250 * 1000;
  }

  if (!emojis.length === 2) {
    return new Error(`[DiscordEasyPages]: Invalid custom number of emojis. Expected 2, got ${emojis.length}.`);
  }

  let PageNumber = 0;
  const CurrentPage = await message.channel
    .send({
      embeds: [pages[PageNumber]],
    })
    .catch(err => {});

  CurrentPage.edit({
    embeds: [pages[PageNumber].setFooter(`${footer} • Please wait until reactions load!`)],
  });

  for (const emoji of emojis) {
    try {
      await CurrentPage.react(emoji).catch(err => {});
    } catch (err) {
      CurrentPage.edit({
        embeds: [pages[PageNumber].setFooter("Error occured!")],
      });

      return new Error(`[DiscordEasyPages]: Error reacting with ${emoji}! Are you sure this is a valid emoji?`);
    }
  }

  CurrentPage.edit({
    embeds: [pages[PageNumber].setFooter(`${footer} • Page ${PageNumber + 1}/${pages.length}`)],
  });

  const Filter = (reaction, user) =>
    authoronly
      ? emojis.includes(reaction.emoji.name) && user.id === message.author.id
      : emojis.includes(reaction.emoji.name);
  const ReactionCollector = CurrentPage.createReactionCollector(Filter, {
    time: timeout,
  });

  ReactionCollector.on("collect", async reaction => {
    reaction.users.remove(message.author).catch(err => {});

    if (reaction.emoji.name) {
      if (reaction.emoji.name === emojis[0]) {
        if (PageNumber > 0) {
          --PageNumber;
        } else {
          PageNumber = pages.length - 1;
        }
      } else if (reaction.emoji.name === emojis[1]) {
        if (PageNumber + 1 < pages.length) {
          ++PageNumber;
        } else {
          PageNumber = 0;
        }
      } else {
        return;
      }
    }

    CurrentPage.edit({
      embeds: [pages[PageNumber].setFooter(`${footer} • Page ${PageNumber + 1}/${pages.length}`)],
    });
  });

  ReactionCollector.on("end", () => {
    if (CurrentPage.deleted) {
      return;
    }

    CurrentPage.reactions.removeAll().catch(err => {});
  });

  return CurrentPage;
};
