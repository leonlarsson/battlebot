const Discord = require('discord.js');
const { prefix } = require('../config.json');
// eslint-disable-next-line no-irregular-whitespace
//const badWordsRegex = /chink|f4gs|nigs|paki|nlbba|nig nog|rart|negro|\bloli\b|lolis|fagit|fagot|kys|fgt|fag|fags|pedo|tard|bilibili|Y9O-6nsNBXM|nigger|niglet|faggot|cyka blyat|nigga|child porn|retard|retart|rarted|r3tar|hitler|nazi|ching chong|cunt|kunt|nibba|nibber|pedophile|kneegrow|n i g g|\.onion|k y s|wigga|wigger|sleamco|streamco|staemco|sreanco|staernco|steaamco|streannco|streanco|steaimeco|steacmco|steam-|steamaco|steambo|steamca|steamcco|steamcommin|steamcommn|stearmco|stermcco|strearmco|stiemco|streanco|steanco|stenco|stemco|stearnc|steemco|stemco|steann|steamnc|steamcomnm|discrod-gift|discord-nitro|leaving this fucking game|steamspecial\.com|steamreward\.com|steamsummer\.com|steamfeatured\.com|steamlimited\.com|steampromote\.com|Get 3 Months Of Discord Nitro|Discord Nitro for free|-nitro|-gifts|tradeoffer|trade-offer|Hi, get discord nitro|discord nitro 1 month|shoppy\.gg|tokens\.rip|tornadus\.net|pixeldrain\.com|app\.buff\.game|dropbox\.com|kekma\.net|yoink\.rip|iplogger\.org|kinguin\.net|wa\.link|staemcommunitly\.com|gogetfunding\.com|chat\.whatsapp\.com|gramfree\.world|ssteam\.site|dlcordapp\.com|gestyy\.com|zoom\.us|pladollmo\.com|thewillpower\.ytmnd\.com|steamgames\.me|deathaddict\.co|steam-halloween\.com|steam-community\.com|dirtyonline\.com|yȯutube\.com|media\.8ch\.net|paypal\.me|paypal\.com|simg3\.gelbooru\.com|i2\.wp\.com|goo\.gl|adf\.ly|bit\.ly|bit\.do|pornhub\.com|gyazo\.nl|tinyurl\.com|g2a\.com|youporn\.com|redtube\.com|to\.free-gg\.com|discordbots\.org|quickmessage\.us|thejobpaid\.com|2no\.co|cdkeys\.com|discord\.me|unknowncheats\.me|steamspecial\.org|engineowning\.com|atshop\.io|yip\.su|whatsappx\.com|discord\.amazingsexdating|t\.me|docs\.google\.com|change\.org|kickstarter\.com|selly\.gg|quantumcheats\.com|discordservers\.com|aimjunkies\.com|särahah\.eu|särahah\.pl|xda-developers\.us|chng\.it|youshouldclick\.us|watches-my\.stream|discordapp\.com\/oauth2|viewc\.site|fortnite\.events|beeg\.com|g2a\.com|ebonus\.gg|free4u\.xyz|wallhax\.com|privatepage\.vip|perfectaim\.io|nakedphotos\.club|gamekit\.com|steam-wallet-rewards\.com|steamhalloween\.com|worlds-rewards\.com|fortnite-special\.com|bucks\.as|sweatco\.in|gang\.karter\.me|queue\.gg|discord\.io|apexspecial\.com|gofund\.me|steamgifts\.site|homefilm\.com|shorte\.st|destyy\.com|113girl\.com| vplan\.com|selfbot\.cc|amzn\.to|xvideos\.com|get\.cryptobrowser\.site|bestgore\.com|spamis\.fun|wn\.nr|paid4clout\.com|nuked\.cc|bmwforum\.co|spottyfly\.com|yoütu\.be|discörd\.com|minecräft\.com|disçordapp\.com|crabrave\.pw|yourtube\.site|youtubeshort\.watch|youtubeshort\.pro|amishdatacenter\.com|poweredbydialup\.org|amishprincess\.com|packetlivesmatter\.club|packetlivesmatter\.online|canadianlumberjacks\.club|canadianlumberjacks\.online|poweredbydialup\.club|poweredbydialup\.online|poweredbysecurity\.org|poweredbysecurity\.online|zanerewards\.com|gofundme\.com|cutt\.ly|anonfiles\.com|anonymousfiles\.io|gleam\.io|pnrtscr\.com|mega\.nz|meet\.google\.com|4chan\.org|top\.gg|battlefield2042\.com|instant-gaming\.com|hunolog\.vip|lovebird\.guru|trulove\.guru|dateing\.club|otherhalf\.life|shrekis\.life|headshot\.monster|gaming-at-my\.best|progaming\.monster|yourmy\.monster|screenshare\.host|imageshare\.best|screenshot\.best|gamingfun\.me|catsnthing\.com|mypic\.icu|catsnthings\.fun|curiouscat\.club|joinmy\.site|fortnitechat\.site|fortnight\.space|freegiftcards\.co|stopify\.co|leancoding\.co|grabify\.link|@​everyone|@here|discord.gg/
//const modChannels = ["449514127707078656", "866424900268589096", "769356439495901214", "591426310317015072", "533714761553281034", "591422940789211160", "591423157856895015", "844314485769371648", "846797227561058305"];

module.exports = {
    name: 'messageCreate',
    execute(message, client) {

        // Temp for when Zep dies
        //if (!message.author.bot && !modChannels.includes(message.channel.id) && message.content.match(badWordsRegex)) {
        //    client.channels.cache.get("448431011257384970").send({ content: `(Zep dead backup) Detected **possible** bad content in <#${message.channel.id}> from <@${message.author.id}> (${message.author.id})\n\`\`\`\n${message.content}\n\`\`\`\nLink: https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`, allowedMentions: { parse: [] } });
        //    return;
        //}

        if (message.author.id !== "99182302885588992") return;

        var time = new Date().toISOString().substr(11, 5) + " UTC"

        // Ignore if no prefix or bot user
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return; // If not a command, return.

        // Bot permissions tests - Check only if a correct command was found.
        if (!message.channel.permissionsFor(client.user).toArray().includes("SEND_MESSAGES")) {
            return console.log(`[${time}] Missing "SEND_MESSAGES" permission in ${message.guild.name} (${message.guild.id}).`);
        }

        if (!message.channel.permissionsFor(client.user).toArray().includes("ATTACH_FILES")) {
            return message.reply(`I need the \`Attach Files\` permission to do this.`);
        }

        if (command.disabled) return;
        if (command.public == false && message.author.id != "99182302885588992") return; // If command is not public, return.

        // Perm Check.
        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return;
            }
        }

        // Cooldowns
        const { cooldowns } = client;

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // Run Command
        try {
            command.execute(message, args, client, Discord);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }
    },
};