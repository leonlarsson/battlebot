const moment = require("moment");

// eslint-disable-next-line no-irregular-whitespace
const badWordsRegex = /n[\\s.\\-]*[il1|¦ıïîìí][\\s.\\-]*[g6][\\s.\\-]*[g6][\\s.\\-]*[e3][\\s.\\-]*r|n[\\s.\\-]*[il1|¦ıïîìí][\\s.\\-]*[g6][\\s.\\-]*[g6][\\s.\\-]*a|\bn[\s\\-]*word\b|f[\\s.\\-]*a[\\s.\\-]*[g6][\\s.\\-]*[g6][\\s.\\-]*o[\\s.\\-]*[t7]|badword123|chink|f4gs|nigs|paki|nlbba|nig nog|rart|negro|loli|lolis|fagit|fagot|kys|fgt|fag|fags|pedo|tard|niglet|cyka blyat|child porn|retard|retart|rarted|r3tar|hitler|nazi|ching chong|cunt|kunt|nibba|nibber|pedophile|kneegrow|n i g g|k y s|﷽|wigga|wigger|Look out for a Discord user|Please pass this on to any servers|to remove this user from our database|Send this message to all your friends|this is a message from the discord creator|share my hot pictures and videos with you|What the fuck did you just fucking say about me, you little bitch?|copy and paste him|copy and paste this|meme dog|meme cat|卍|卐|retard|ching chong|pornhub|discord by pasting|Photos For Guys|My naked photos|photos with boys|privatepage\.vip|size=我将尽|My sexy photos|Hi! I love sex|Best spambot|spamis\.fun|@everyone|@here|sleamco|streamco|staemco|sreanco|staernco|steaamco|streannco|streanco|steaimeco|steacmco|steam-|steamaco|steambo|steamca|steamcco|steamcommin|steamcommn|stearmco|stermcco|strearmco|stiemco|streanco|steanco|stenco|stemco|stearnc|steemco|stemco|steann|steamnc|steamcomnm|discrod-gift|discord-nitro|leaving this fucking game|steamspecial\.com|steamreward\.com|steamsummer\.com|steamfeatured\.com|steamlimited\.com|steampromote\.com|Get 3 Months Of Discord Nitro.|Discord Nitro for free|-nitro|-gifts|nitro-|gifts-|tradeoffer|trade-offer|Hi, get discord nitro|discord nitro 1 month|tokens\.rip|tornadus\.net|pixeldrain\.com|app\.buff\.game|dropbox\.com|kekma\.net|yoink\.rip|iplogger\.org|kinguin\.net|wa\.link|staemcommunitly\.com|gogetfunding\.com|chat\.whatsapp\.com|gramfree\.world|ssteam\.site|dlcordapp\.com|gestyy\.com|zoom\.us|pladollmo\.com|thewillpower\.ytmnd\.com|steamgames\.me|deathaddict\.co|steam-halloween\.com|steam-community\.com|dirtyonline\.com|yȯutube\.com|media\.8ch\.net|paypal\.me|paypal\.com|simg3\.gelbooru\.com|i2\.wp\.com|goo\.gl|adf\.ly|bit\.ly|bit\.do|pornhub\.com|gyazo\.nl|tinyurl\.com|youporn\.com|redtube\.com|to\.free-gg\.com|discordbots\.org|quickmessage\.us|thejobpaid\.com|2no\.co|cdkeys\.com|discord\.me|unknowncheats\.me|steamspecial\.org|engineowning\.com|atshop\.io|yip\.su|whatsappx\.com|discord\.amazingsexdating|t\.me|docs\.google\.com|change\.org|kickstarter\.com|selly\.gg|quantumcheats\.com|discordservers\.com|aimjunkies\.com|särahah\.eu|särahah\.pl|xda-developers\.us|chng\.it|youshouldclick\.us|watches-my\.stream|viewc\.site|fortnite\.events|beeg\.com|g2a\.com|ebonus\.gg|free4u\.xyz|wallhax\.com|privatepage\.vip|perfectaim\.io|nakedphotos\.club|gamekit\.com|steam-wallet-rewards\.com|steamhalloween\.com|worlds-rewards\.com|fortnite-special\.com|bucks\.as|sweatco\.in|gang\.karter\.me|queue\.gg|discord\.io|apexspecial\.com|gofund\.me|steamgifts\.site|homefilm\.com|shorte\.st|destyy\.com|113girl\.com|vplan\.com|selfbot\.cc|amzn\.to|xvideos\.com|get\.cryptobrowser\.site|bestgore\.com|spamis\.fun|wn\.nr|paid4clout\.com|nuked\.cc|bmwforum\.co|spottyfly\.com|yoütu\.be|discörd\.com|minecräft\.com|disçordapp\.com|crabrave\.pw|yourtube\.site|youtubeshort\.watch|youtubeshort\.pro|amishdatacenter\.com|poweredbydialup\.org|amishprincess\.com|packetlivesmatter\.club|packetlivesmatter\.online|canadianlumberjacks\.club|canadianlumberjacks\.online|poweredbydialup\.club|poweredbydialup\.online|poweredbysecurity\.org|poweredbysecurity\.online|zanerewards\.com|gofundme\.com|cutt\.ly|anonfiles\.com|anonymousfiles\.io|gleam\.io|pnrtscr\.com|mega\.nz|meet\.google\.com|4chan\.org|top\.gg|battlefield2042\.com|instant-gaming\.com|hunolog\.vip|ibb\.co|shpock\.com|eneba\.com|lovebird\.guru|trulove\.guru|dateing\.club|otherhalf\.life|shrekis\.life|headshot\.monster|gaming-at-my\.best|progaming\.monster|yourmy\.monster|screenshare\.host|imageshare\.best|screenshot\.best|gamingfun\.me|catsnthing\.com|mypic\.icu|catsnthings\.fun|curiouscat\.club|joinmy\.site|fortnitechat\.site|fortnight\.space|freegiftcards\.co|stopify\.co|leancoding\.co|grabify\.link|101nitro\.com|alex-nv\.ru|alexandrnav\.ru|alexandrs1\.ru|bitfoxcrypto\.com|board-nitro\.com|cloud9team\.fun|cryptexbit\.com|cs-moneiy\.us|csgo-cyber\.ru|csgowaycups\.org\.ru|dicorcs\.ru|dicsord\.net|dirscod\.com|discod\.art|discod\.info|discorb\.co|discorcl\.link|discord-drop\.info|discord-event\.com|discord-gift\.com|discord-gifts\.com|discord-hypesquads\.com|discord-nitro\.link|discord-nitro\.net|discord-nitro\.su|discord-promo\.com|discordapp\.chat|discordgivenitro\.com|discords\.ru\.com|discrodnitro\.org|diskord\.ru\.com|dlscord\.world|dlscordgift\.ru|ezdrop\.net\.ru|ezence\.ink|ezstat\.ru|fast-gift\.com|fnaticprize\.site|fnaticwin\.xyz|free-nitlross\.ru|free-nitroi\.ru|freenitro\.ru|freenitros\.ru|gamearena\.ru\.com|gams-toph\.xyz|giftdiscord\.com|giftsdiscord\.ru|giveawayd\.shop|giveawaynitro\.com|glft-discord\.com|go-lex\.org\.ru|intimki\.com|izi-navi\.org\.ru|katowice\.ru|keymagic\.me|linktrade\.pp\.ua|magic-top\.org\.ru|magicstreek\.me|natus-vincery-tos\.org\.ru|natus-vincery-tq\.org\.ru|natus-vincerygivez\.xyz|navi-spot\.org\.ru|navi\.auction|naviteam\.net\.ru|new-give\.com|nitro-gift\.fun|nv-box\.com|nv-drop\.com|operation-broken\.xyz|piratewins\.io|please\.net\.ru|rocketcase\.xyz|roll-case\.com|rollskin\.ru|seamcommunlty\.com|seamcommunty\.com|skinroll\.ru|sleam-trade\.org\.ru|sleamcomnnunity\.me|sleamconnunnity\.me|sleamcormunity\.me|sreamcornmunity\.ru|sreancommuniity\.com|staemcommeuneuity\.ru|staerncomrmunity\.com|steaamcomnnunity\.com|steaimeecommuniity\.com|steam-halloween\.com|steam-promo-page\.ml|steamcannunlty\.com|steamcommanitty\.ru|steamcomminiity\.site|steamcomminity\.ru|steamcomminytiu\.com|steamcomminytiu\.ru|steamcommmunilty\.com|steamcommnnunnity\.world|steamcommnunmity\.com|steamcommnuntiy\.com|steamcommnunty\.com|steamcommrnunity\.com|steamcommrutiny\.ru|steamcommunilu\.com|steamcommunirty\.ru\.com|steamcommunitiyu\.com|steamcommunitlu\.com|steamcommunity-com\.xyz|steamcommunity\.link|steamcommunityu\.com|steamcommunityu\.ru|steamcommunityw\.com|steamcommunlty\.com-profiles-bloomez\.online|steamcommunniitly\.ru|steamcommunrlity\.com|steamcommuntly\.com|steamcommuntly\.ru|steamcommunyti\.ru|steamcommunytiu\.com|steamcommunytu\.ru|steamcommurnuity\.com|steamcommutiny\.com|steamcommytiny\.com|steamcomnumily\.com|steamcomnumnity\.com|steamcomnuniity\.ru|steamcomrninuty\.ru|steamcomrnunitiy\.com|steamcomrnunity\.ru|steamcomrnuniuty\.com|steamcomrrnunity\.com|steamcomunnitly\.ru\.com|steamconmmuinty\.com|steamconmumltu\.com\.ru|steamconnunjty\.com|steamcornmuniti\.xyz|steamfeatured\.com|steamgames\.xyz|steamgivenitro\.com|steamhome\.xyz|steamlimited\.com|steammcomunity\.ru|steamncomnmunity\.com|steamnconnmunity\.com|steamprofiles\.site|steampromote\.com|steamreward\.com|steamspecial\.com|steamsummer\.com|steamtradeoffer\.ml|steanccommunity\.xyz|steancommuinity\.me|steancommunytiu\.ru|steancommutitly\.ru|steancomunlty\.me|steancomunnity\.com|steancomunnity\.ru|steancoommunlty\.ru|steanncomunitly\.com|steannconnnnunity\.com|stearcommity\.com|stearmcommunitty\.ru|stearmcommunity\.ru|stearmcommunnitty\.ru|stearmmcomunity\.ru|stearncomminuty\.ru|stearncommrunity\.com|stearncommunytiy\.ru|stearncommuty\.com|stearncomnunitv\.ru\.com|stearncormmunity\.com|stearncormuntity\.ru|steeamcommunnity\.ru\.com|steemcommunnity\.ru|stemcommunitty\.ru\.com|stemcommurity\.com|stermccommunitty\.ru|stermcommuniity\.com|sterrmccommunity\.ru|stleamconnunlty-tyztradeoffernewpartnhr15902271\.xyz|store-stempowered\.com|streamcomnunely\.com|streancommunuty\.ru|streancomunnitiy\.com|tastyskill\.net\.ru|toom-skins\.xyz|top-games\.org\.ru|topr-games\.xyz|topw-gamez\.xyz|topz-games\.xyz|topz-gamez\.org\.ru|trade-offers\.me|tradeoffers\.net\.ru|wild-day\.com|win-lems\.org\.ru|wix-zero\.pp\.ru|wowfnatic\.com|wowfnatic\.site|cs-skins\.link|discordnltro\.com|classic-nitro\.com|giftsdiscord\.com|steaimcommuniity\.com|steamnconmunity\.work|stearncommmnuity\.xyz|steamcommnunytl\.com|steamcommiunity\.pp\.ru|steam-communiity\.ru|steamcomnunytu\.ru|discordnitro\.gift|stemcomnnmuunity\.ru|steamcommnnunity\.ru|steamcomrnunitu\.ru|steamcommunitiu\.ru|quick-cup\.xyz|discord-game\.com|steamcommunitily\.com|csgogf06\.xyz|steanconmunyti\.ru\.com|store-discord\.com|streamconnumity\.com|steamkommunity\.org\.ru|robuxhelpers\.com|sleamcoommunilty\.com|staemcrommunity\.com\.profiles-768590190751377476483\.me|streamcommunicatie\.nl|steamgiveaway\.cc|discrodnitro\.ru|magik-dr0p\.fun|discords-gift\.ru|smitecommunity\.org|mythicups\.xyz|steamcommunuti\.ru|discord\.cm|disrcod\.gift|dixcord\.com|steamcommnuitly\.com|steamconnunity\.fun|discordnitro-gift\.com|steamccommunity\.com|steamconmumnity\.com|discord\.com\.pl|discord-giveaway\.com|skins\.pp\.ru|discord-partner\.com|staemmcommunity\.ru|steamcominity\.ru|straemcummonilty\.com|steancomunite-xuz\.ru|steamcoomynity\.ru|accountauthorization\.xyz|bigs\.monster|get-nitro\.fun|steamcornrrnunity\.com|steancommunlty\.com|staemcommunity\.ru|steamcammunitu\.ru\.com|pubggift102\.xyz|natus-open\.pp\.ru|streomcommunuty\.com|lan-pro\.link|steamcornmunite\.com|steamcommuwunity\.com|steamcommunnity\.ru|navileague\.xyz|steamcommuntily\.ru|discort\.site|sleamcomnnuniliy\.site|steamcommunicty\.com|steamrommunily\.com|cashy\.monster|dlscard\.ru|steamcomrnunity\.online|staemcornmunity\.ru|ezdiscord\.xyz|bysellers\.xyz|steamcommunitry\.com|steawcommunity\.com|seamconmunity\.xyz|streamcommuunniity\.com|viwwzagul\.xyz|stmarkcommunity\.org\.au|dislcord\.com|steampowened\.ru\.com|dicsord\.pw|csgogf07\.xyz|steancomunitiy\.ru\.com|streamcommnunity\.ru|stemcomnunyti\.ru\.com|steamrcommunity\.ru|disbords\.com|viwwzagulw\.xyz|steamconmunlty\.com|discord-xnitro\.com|discorcl\.online|pubggift97\.xyz|steancommueniliy\.ru\.com|cash\.org\.ru|stearncommunuity\.net\.ru|pubg-asia\.xyz|steamommunity\.com|drop\.net\.ru|dlscord\.blog|discrdapp\.cf|discard\.gg|stearncommunlty\.store|discordshort\.ga|steamcommunety\.org\.ru|steamcoomunnity\.com|stemcommuunity\.com\.ru|steamcommiunitiy\.pp\.ru|steamcommunillty\.net\.ru|discordgifts\.com|discordalts293\.repl\.co|steamcommutyniu\.com|stemcomunity\.com|steamcomminuty\.link|dicsord\.ru|stearncomminutiu\.ru|steamnconmunity\.com|dlscord\.pro|steamcomrrnunity\.ru|staemcommunity\.com\.ru|natus-rolls\.xyz|streancommunitiy\.net\.ru|pubggf03\.xyz|secure-instagram\.ru|steamcommunlilty\.ru\.com|steamcoummunitiy\.com|steancommunitv\.com|nise-win\.xyz|discord\.online|steancommnunity\.ru|pubgmobile365\.giftcodehot\.net|itemcloud\.one|navi-hawai\.net\.ru|steamcommunnity\.net|discord-developer\.com|steamcomuniity\.ru\.com|discord-nitro\.store|stieamcomnnunity\.com|steannconnnnunity\.net\.ru|discorcl\.ga|steamcommunittru\.co|disxord\.com|steammecommunity\.com|big\.pp\.ru|discordgift\.ru\.com|iscord\.gift|discordalt5\.repl\.co|steancomunitly\.ru|discordp\.ml|steamcommunity\.co\.ua|sleamcomnnunily\.site|steamcomuniltu\.xyz|discordapps\.gifts|discord\.download|staeamcromnuninty\.com\.profiles-76582109509\.me|steamcoomunitye\.com|stemcommuniity\.com|discord-ru\.site|steemcommnnity\.com|steamcomrninuty\.link|dlscord\.tech|cave-nitro\.com|dkscord\.com|discord\.pp\.ru|staemconmuilty\.com|steamcomuunity\.com|streammcomunittty\.ru|steamcommunitie\.ru|discrord\.com|steam-support\.xyz|steemcomrnunity\.co|lan-pro\.ru|nitro-gift\.site|dirscod\.gift|disc-ord\.com|steamcommiunniutty\.net\.ru|steancomnuuniliy\.ru\.com|steamcommuunity\.ru|streamcornnunitly\.com|steamcomunuty\.com|lkdiscord\.com|discor\.me|sleamcomrnunity\.com|stearmcommunitry\.cf|steamcommunty\.com|stemcammuniity\.com|steamcommutyniy\.com|guns-slot\.tk|fnatic-drop\.com|tournament\.ru\.com|stearncomnunitu\.ru|steamcommuunlity\.com|duscord\.com|alm-gaming\.com|steamcomnumty\.ru|stearmcommunnity\.ru\.com|steancommuniite\.xyz|pubggf05\.xyz|steampoweredtrades\.xyz|steamcomuniti\.xyz|sleamcommuiliy\.ru\.com|steamwcommunity\.com|steamcomnmrunity\.ru|diisscord\.club|keydoppler\.one|steamcommunitty\.net|csgo-market\.ru\.com|steamcommunitiyy\.com|stieamcommuunitey\.us|pubggift96\.xyz|steamcumumunity\.com\.ru|robuxhelps\.com|steamcommuniuity\.com|steamcormmunity\.ru\.com|staemcummunity\.ru\.com|driscord\.ru|steancommuniiliy\.ru\.com|steamcommmunnity\.com|steamcomnuniti\.com|steamcommnunity\.org\.ru|discordgift\.org|nitrodiscord\.org|discordapp\.co\.uk|steamcconmmuunity\.co|facepunch-llc\.com|steamcommunity\.us|stermcommunityy\.ru|steamcommunjtv\.xyz|discordnitro\.link|discordtokens\.shop|discordappp\.com|discordapps\.gift|smartcommunity\.net|rollskins\.monster|discordiatech\.co\.uk|steamcomnunmity\.com|slemcommunity\.com|viwwzaguls\.xyz|steamcommunity\.net\.in|steancammunity\.ru|discordcanary\.com|steamcommuniyty\.ru|beast-cup\.ru|steamrccommunity\.com|steamcomnnunity\.co|myccgo\.xyz|steancommunity\.link|steamcommunittey\.com|steamcornmnuity\.com|csgogf05\.xyz|get-my-nitro\.com|stearncornmunity\.ru\.com|steamescommunity\.com|drop-nitro\.com|discorb\.gifts|streamcomunniity\.net\.ru|opencase\.space|stearncommunyti\.ru|stemcomnmuunity\.ru\.com|steamccommunyty\.ru|discord-bot\.ru|loot\.net\.ru|steamcommnity\.com|steam-community\.xyz|stermcommunnitty\.ru|discord-give\.ru|steeamcommunity\.ru\.com|lakskuns\.xyz|csgogf02\.xyz|steanconmunitly\.ru|staemcommunyti\.ru\.com|steamcommunly\.net\.ru|streamcommuinity\.com|steammcomunnity\.com|drop\.pp\.ru|steamcomnuty\.com|steamcomnmuunity\.ru\.com|steamcomnutiny\.ru\.com|disorc\.com|rust-llc\.com|streamcomunitly\.net\.ru|discordpp\.com|skins\.org\.ru|sterncomnurity\.one|disiscord\.com|discoerdapp\.com|discord-hypesquad\.com|steamcomrnlnuty\.site|discrods\.site|discord\.eu|discod\.fun|discord-steam\.com|steammcommunily\.net\.ru|dicsord\.space|discordgift\.com|steamscommunity\.ru|discorcl\.ru|jjdiscord\.com|navirolls\.org\.ru|steemcoommuntiy\.ru|stearmmcommuniity\.ru|staemcrornmmunity\.com\.profiles-75921098086\.me|steamcommunlty\.site|steamcommunilty\.it|steamc0munnity\.site|steamcomnumity\.com|steam-tradeoffer\.com|steamcommunjti\.com|stieamconnmunity\.com|dscordnitro\.xyz|rust-ltd\.com|steampoweread\.com|steampcwered\.com|gamzc-topz\.xyz|discorcl\.ru\.com|steamcomunnity\.ru\.com|dlscord\.cc|store\.stempowerd\.com|steamcomnmufly\.ru\.com|big\.org\.ru|stearncommunytiyu\.ru|steamcomnumity\.xyz|gift-discord\.online|steancommuuniliy\.ru\.com|discord-list\.cf|discordgamers\.co\.uk|steamsoftware\.info|discrdapp\.com|rl-promos\.com|fnatic-ro1ls\.ru\.com|store\.stampowered\.com|m\.setampowered\.com|steam-powered1\.xyz|disocrd\.tk|steamcammunitey\.com|stearncommmunity\.ru|dlscord\.cloud|pubggift93\.xyz|discord\.si|discord-nitro\.live|stermcomunniity\.ru|strempowered\.com|discorfd\.com|keydrop\.org\.ru|steamcommnnity\.net\.ru|steamcomnunllty\.net|diisccord\.club|steamcommunity\.live|steamcomnunilty\.com|steamcomnunlty\.ru|steamcomnunilty\.ru\.com|steamcomunyiti\.ru\.com|steampowered-swap\.xyz|steancomnurity\.xyz|discord-install\.com|navigg\.org\.ru|steampowerd\.com|stemcommunlity\.ru|steamcommuunity\.net\.ru|discorcl\.store|discords\.gifts|steamcommunity1\.com|steanncommunily\.com|steamcornmunily\.ru|discord-steam\.ru|streamcomnunity\.ru|jetcase\.fun|smeacommunity\.com\.au|disscord\.online|dlscord\.support|streamcommunity\.org\.ru|dlscord\.info|streamcomnuniity\.com|dlscord\.in|sleamcoommunity\.com|stearncommynitu\.ru\.com|dliscord\.us|get-nitro\.net|dlscordapp\.codes|discord\.es|steamsommunity\.ru|streamcormmunity\.com|steawcommunity\.net|disccor\.com|streamcomnunitly\.ru|steamcommyuinity\.net\.ru|sleamconmunlity\.com|natus-open\.net\.ru|steancommuiniliy\.ru\.com|staemcommnunity\.ru\.com|steancomnuilty\.ru\.com|steamcommunit\.org\.ru|comdiscord\.com|dfiscord\.com|steancomnunyti\.ru\.com|discorb\.blog|discord\.gq|steamcoomunjty\.com|discird\.gg|rl-purple\.com|steamcomumity\.com|free-niltross\.ru|eslgamescommunity\.com|discorcl\.site|best-cup\.com|stearncommunety\.com|stearncommmunity\.online|csgo-run\.site|robloxwheelspin\.com|steanmcommzunity\.ru|steamcomunity\.ru|steancomnunytu\.ru|discord-gifts\.org|dicsord\.gifts|giftdiscord\.online|steamcommunitey\.ru|sterncommynuty\.ru|steamconmunjty\.com|bitcoingenerator\.cash|steamcomuuniity\.com|steamcommunutty\.ru|steacommunty\.ru|discor\.de|fustcup\.ru|steamcommutiny\.xyz|discord-faq\.com|discord-nitro\.pro|discords\.us|discordservice\.com|discard\.gift|steamcamunity\.com|eslgamingworldwide\.net|steamcommunnitey\.com|steamcommunity\.trade|steamcomuninruty\.ru|dlscord\.org|ds-nitr\.xyz|steancommuinuty\.ru|discordgift\.pw|nitro-from-steam\.com|steamcommunutiy\.com|staerncoinunitiy\.me|steamcommunifly\.ru\.com|discord\.luxe|disclrd\.com|stearncornurniity\.xyz|summer-rust\.xyz|encesports\.xyz|steemcoomuntiy\.ru|steamconunity\.tk|steancommunity\.host|steamcammunity\.net|steamsomunity\.com|csgogf01\.xyz|sleammcommunnity\.ru|dircode\.ru|key-dr0p\.com|stearmcommuunity\.ru\.com|discord-give\.ru\.com|disco3d\.app|discordnitro\.info|steamncommunity\.ru|discordgg\.com|steamcommuniilty\.ru|steamcomnunuty\.ru|steamcorrnmunity\.ru|pubggf02\.xyz|discoed\.gg|mythicleagues\.xyz|sleamcomnnunily\.website|pubggift91\.xyz|cash\.pp\.ru|steamcomunnyti\.ru|discocord\.com|stearncomnunily\.com|steeamcommmunitty\.site|navigg\.ru|steamcammunity-profile\.ru|diiiscrod\.club|discorcl\.info|pubggift94\.xyz|discord-devs\.com|streamconnunity\.net\.ru|stiamcomynity\.com|drop\.org\.ru|staemcomnunyti\.ru|roll-skins\.ga|streamcornnunitly\.co|discord-gift\.info|steamcomunitu\.net\.ru|steamecommunlty\.com|cyber-csgo\.link|steamconnuniitty\.tk|stearncommunlty\.site|steamncommunitu\.co|discorld\.com|steancommunily\.ru|dicsord\.website|steamcommunillty\.ru|discord-gifts\.site|steamcommulty\.ru|disscords\.club|pubggf04\.xyz|price-claim\.xyz|steamcommumilty\.com|steamcommunlite\.com|steamcommonitey\.com|staemcomunyti\.ru|sleamcommuniitey\.ru\.com|playeslseries\.com|steamcommunity\.in|pubggf01\.xyz|dscord\.xyz|steancomnunlty\.ru|reports\.noodlesawp\.ru|steamcommunitly\.me|ds-nitro\.site|discordbotist\.com|steamgifts\.net\.ru|steamcommunieti\.ru|steamcommunrity\.com|steamcommuniry\.net\.ru|discordinfo\.com|steam-cammuneti\.com|dissord\.com|steannconnnunity\.com|dicord\.gift|discordgift\.ru|rl-garage\.space|steamcomnuenuity\.com|steamcommynity\.ru|gamzgss-top\.org\.ru|csgo4cases\.fun|steawpowered\.com|steancommunity\.pw|steamcomunnuity\.com|steamcommiunitty\.ru|discard\.xyz|disclord\.com|steamcommunltv\.buzz|discordgivenitro\.ru\.com|ddiscord\.com|fall500\.ru|steanmcomrninuty\.xyz|steamcomnunity\.org\.ru|steemcowwunity\.xyz|dicord\.space|steamcommunty\.pw|gleam\.su|2021cs\.net\.ru|discord-glft\.com|staemcoommunlty\.ru|2021y\.ru|driscord\.ru\.com|csgogf03\.xyz|steamcommunitie\.site|discortnitostem\.online|steamunlocked\.online|steamcommunitx\.ru\.com|discord\.co\.za|steamcommunitity\.com|drop-nitro\.fun|dliscrd\.one|streamcomnunyti\.xyz|steamaccount\.xyz|streanncomminity\.ru|steancommeuniliy\.ru\.com|discorrd\.com|steam-announcements1\.xyz|discordgame\.com|steamcommynlty\.ru|dlscord\.online|steamconmunlty\.com\.ru|steancomuniite-xuz\.ru|discordnitrogifts\.pl|natus-open\.org\.ru|luxerkils\.xyz|discrocl\.xyz|steamcommunllty\.ru|staemcoomuunity\.ru|sleamcommunlty\.space|discoed\.me|discordadp\.com|steamconmuniti\.ru|stearmcomrmunity\.com|streamcomunnity\.pp\.ua|luckydrop\.site|steamcommunitty\.top|steamscommunitey\.com|steancommuniite-xuz\.ru|steambrowser\.xyz|steampowered\.org|robuxfiends\.com|steancommynyty\.ru\.com|discorad\.com|robuxhelp\.com|steamcommuniltiy\.ru|pubggf18\.xyz|steam-power\.xyz|steam-povered\.xyz|okdiscord\.com|steamcomnunity\.com|discordl\.site|sleammcommunity\.ru|facepunch-award\.com|discorb\.gift|navi-winners\.org\.ru|streamcommuunilty\.ru\.com|steancommunyti\.ru\.com|disocr\.com|app-discord\.com|steamcommuntity\.com|doscord\.com|dlscord\.store|steamcommulnity\.com|discold\.online|pubggift87\.xyz|discord-nitro\.online|discordapp\.eu|stearamcomnunitu\.xyz|steamcommunityi\.com|stearncommunity\.link|steamcommnutly\.ru\.com|steamcormunity\.xyz|staemcoommuntiy\.ru|steamcommunylty\.ru|sttemcomnmuty\.ru\.com|streamcommunlty\.net|sleamcommunity\.org\.ru|stemcommyunity\.ru|steamconmunyty\.ru|steamcommuhuity\.com|starmcommunity\.net|fnatic\.team|steamcommunitte\.ru|steamcomrnunitu\.ru\.com|steamcomminutiu\.ru|farestonpw\.ru\.com|steamconnunirty\.ru|steamcomminutiiu\.ru|discordsite\.repl\.co|discordl\.pw|discordacc2\.repl\.co|steamdommunity\.com|discorcl\.fun|gamzgss-top\.xyz|discordaoo\.com|steamcommunhity\.com|steancommiuniliy\.ru\.com|steamcorrnunity\.org|discordlist\.gg|steamcomunlty\.ru\.com|steanncommity\.co|steamcommutinny\.ru\.com|steamcommunitey\.com|steamcomminytiy\.ru|steamcornmuniity\.net\.ru|xpro\.ws|steamcommunlte\.ru|streamcommuniliiy\.pp\.ru|csgo-cyber\.link|steamconnunitiy\.com|steamcommnunity\.com|disocrd\.gg|xpro\.gift|staermcrommunity\.me|discod\.gift|steamcomminyti\.ru|csgosell\.xyz|streamconmmunity\.ru\.com|facepunchltd\.com|discordbothost\.com|discoogs\.com|discordnitro\.store|pubgmobile365\.com|steamcomnunity\.ru|staemccommunnity\.net\.ru|steamcommunity\.ca|steemurl\.com|discordnitro\.su|steamcommytuniu\.com|steemcomunity\.me|steampowers\.org|sterncommunnity\.ru|dicsordnitro\.info|giftsdiscord\.fun|steamcomnmynitu\.com|streamcomunltyy\.org\.ru|gift-discord\.ru|streamcommuniity\.ru|steanpowered\.net\.ru|steamcommunityid\.ru|staermcrommunty\.me|sleamcommunitu\.net\.ru|steanmcommunity\.ru|stieamcommunitiy\.com|sleemcomnuniti\.xyz|steanncomunitly\.ru\.com|discord\.ru\.net|discordnitro\.altervista\.org|steamkommunity\.net\.ru|robloxstore\.co\.uk|steamcommunityz\.com|pubggift100\.xyz|stearmcommnity\.com|steemcommunity\.ru\.com|steemcomrnunity\.com|steamcomuunity\.ru\.com|pubggift99\.xyz|discordalt4\.repl\.co|discords-gifts\.ru|steancommunity\.cc|proz\.monster|pubggf15\.xyz|steamconnunity\.de|steamcomrnunity\.su|stearmcommuunity\.ru|steamconmnunity\.co|dlscord\.space|steamcommunity\.rest|2022yg\.com|steamcommnuninty\.ru\.com|discord-team\.com|cschecker\.ru|discoard\.com|discord-invite-link\.com|disord\.gifts|steamcammunuty\.com|discordist\.com|discord-app\.gifts|astresports\.xyz|steampowrd\.com|discord-develop\.com|steamcommunytiy\.tk|steancommunitiy\.ru|steancommuhity\.ru|facedrop\.one|steamcamunity\.xyz|giftsdiscord\.online|casesdrop\.xyz|steamcommunitym\.com|airdrop-nitro\.com|loot\.pp\.ru|steancomnunytu\.ru\.com|sleam-trade\.net\.ru|steancommuineliy\.ru\.com|discord-nitro\.co|nitro-airdrop\.org|steampoowered\.com|steamaccounts\.org|steamstore\.site|diiscordapp\.com|pubggift92\.xyz|streamcomunity\.fun|steamcommutiny\.ru|steamcommunityx\.com|steamcornmunity\.net\.ru|steamcommunety\.net\.ru|steamcommunityy\.online|giftdiscord\.info|steamecomunity\.com\.ru|dissord\.ru|discordbooster\.com|discordnitro\.space|g2ezports\.xyz|steamconnnnunity\.org\.ru|discorddrop\.com|streamcommuunnity\.com|steaimecommintliy\.com|steamconnnnunity\.net\.ru|discordnitro9\.repl\.co|steam-rep\.com|steamcommunyty\.ru\.com|steanncommnunyti\.com|steam-discord\.com|discrod\.pw|discord-boost\.com|steam-community\.net\.ru|steemcommunty\.ru|streamcommmumnity\.ru\.com|discord\.fit|disconrd\.com|steamcomynnitu\.net\.ru|disrcod\.gifts|steamncommunity\.pp\.ru|steamcoommunity\.ru\.com|stemcumnmunity\.com|stearncomnunity\.org|streamconnuity\.com|steamdocs\.xyz|disscord\.ru|discorcl\.art|discordapp\.top|steamcomnuntty\.ru\.com|stermmcomuniity\.ru|discold\.ru|steamcomnunitiy\.ru|steamcommunltyy\.com|stearncornmrunity\.ru\.com|streancommuniliy\.ru\.com|steamccommunity\.ru\.com|discord-free\.com|steamcamunnity\.xyz|rl-garage\.online|staempowered\.xyz|steamconnmunitu\.net\.ru|dicovrd\.com|steamswap\.xyz|steamcommulnt\.ru\.com|steamcommunitl\.net\.ru|discordd\.buzz|steamcommunnity\.com\.ru|steamcommunity\.eu|discordlive\.xyz|discorcd\.com|steamcommunyty\.com|steam-powered-games\.com|steamcommumtiy\.com|discordd\.gg|steancommuuniliiy\.ru\.com|pubggf06\.xyz|streamcommunityi\.ru|stemcommuniity\.ru|steam-community1\.xyz|steamcomminuly\.ru|skinsup\.monster|steamconmiunity\.ru|discrod\.gift|discurcd\.com|streamconnunitly\.com|discorrd\.ru|steamcommunityy\.ru|steamcomuniety\.ru|twitch\.rust-ltd\.com|steamconmunity\.co|discord\.foundation|streamcommunication\.com|steamcommunty\.ru\.com|stemcommounity\.ru\.com|rust-award\.com|steamm\.store|discordaop\.com|discordlist\.repl\.co|steancommunite\.site|luckygo\.ru\.com|steampwered\.com|stearmmcomuunity\.ru|steamcomunity\.com\.ru|steamcommunlty-proflle\.com\.ru|steamcummunityy\.pp\.ua|straemcommonlity\.com|steamoffered\.trade|cs-moneyy\.ru|discordgift\.site|skinup\.monster|steamcommlunity\.com|streamcommnnutiy\.com|nitro-discord\.org|hunts\.monster|steampoweredoffers\.xyz|steamecommunity\.pp\.ua|hyper-tournament\.xyz|naviskins\.xyz|discord-nitro\.club|staemcammunity\.com|steancommunnity\.co|discord-airdrop\.xyz|pubggift95\.xyz|steamcommunityc\.ru|stearncomrmunity\.com|steancommrnity\.com|steamcommunlity\.ru\.com|discordgifts\.ru|affix-cup\.link|steamcomnmutly\.ru\.com|discord-gifts\.me|sleamcommuniti\.xyz|steampowered-swap1\.xyz|steamncomnunlty\.com\.ru|steamscommynitu\.co|discordx\.ml|qcoldteam\.life|steamcomrninuty\.site|steamrommunity\.org\.ru|discord\.family|discord-nitrogift\.ru|steemcoommunlty\.ru|discordnitrogift\.ru|discord-nitro-free\.ru|sitemap\.onedrrive\.com|streamcomrnunity\.com|steam-discord\.ru|steampoweredswap\.xyz|steamcomuntty\.com|steamcornmunty\.com|stemcommunity\.ru|free-nitro\.ru|straemcomunnitry\.ru|beta\.discorder\.app|discordqpp\.com|discorg\.gg|stearncommiuty\.co|dicord\.site|staemcomminuty\.online|streamcomunltyy\.pp\.ru|steamcommunety\.ru|steamcomrnunity\.site|steemcommuntiy\.ru|loot-item\.xyz|dlscord\.shop|pubggift101\.xyz|discord-nitrodrop\.xyz|staemcommunlty\.ru|getskins\.monster|streamcomuniity\.cf|fnaticteam\.org\.ru|bycsdu\.cam|streamcommuniity\.ru\.com|steampowerewd\.com|discrod-nitro\.fun|stieamcomuniiti\.ru|dlscord\.net|free-dislcordnitrlos\.ru|steamcommunify\.com|steanconmunuty\.ru|diskord\.gg|steancomunyti\.ru\.com|csgogift45\.xyz|special4u\.xyz|dlscord\.live|keydropp\.one|steamcomnunitly\.tk|stearnpowered\.xyz|esportsfast\.pp\.ua|steamcornmnitu\.ru\.com|steamcommynitu\.ru|2discord\.ru|steam-power1\.xyz|steamcoummunity\.com|steamcomnunnirty\.ru|steanncommunitv\.com|m-discord\.pw|stieamcommunity\.org\.ru|steamcommunyty\.xyz|stearmcommunitty\.ru\.com|streamcommunity\.net\.ru|dlscord\.click|discord-gift\.us|steamcomnumilty\.com|disord\.co|rl-chaser\.com|steampoweredexchanges\.xyz|steamcommnuty\.site|steamcomnmuituy\.com|bycdu\.cam|steamsconmunity\.com|howls\.monster|stiemconnumity\.xyz|steamconnunity\.pp\.ru|stearmcornmunity\.ru|steamccommunity\.net|steam-powered\.xyz|stearmcommrunity\.com|staemcommuntly\.ru|steam4you\.online|diiscord\.com|discordapp\.ir|steamcommunitypubg\.com|dlscord\.site|steamcommunitlly\.ru\.com|steam-ru\.ru|discordapp\.org|natus-lootbox\.net\.ru|steamcommunnjty\.com|pubggift98\.xyz|discorb\.com|steamconmunyty\.com|steampoweredexchange\.xyz|csgogift47\.xyz|steamcommunity\.digital|steamcomunituy\.com|discordfrnitro\.site|steamconmunuty\.ru|steamcummunity\.com|steam-login1\.xyz|stleamcommuniity\.net|discordbeta\.com|discordtext\.com|discord404\.com|discordtts\.com|discordicon\.com|discordmac\.com|discordobs\.com|betadiscord\.com|discorcl\.shop|nitroosfree\.ru|steamcommrunitly\.com|nitrlooss-free\.ru|dlcordapp\.com|steamcommuynity\.ru\.com|steamcommnutry\.com|streamcormmunity\.ru\.com|steamconunlty\.ru|steanmcomumnity\.xyz|steamcommuntli\.ru|steamstorepowered\.com|discordgive\.ru\.com|discord\.limited|discordbots\.app|discord\.fyi|discord\.homes|discrordapp\.com|discord-nitro-free\.xyz|steamcommunity-trade\.xyz|steamcommunitie\.net|streamcommuniity\.org|steamconnunity\.net|streamcommunuity\.net|streamcomunnity\.xyz|steamcomity\.com|steamcoonmuntiy\.ru|steamcommunilty\.ru\.com|steampowred\.ru|discord2fa\.com|djiscord\.com|discokrd\.com|dciscord\.com|dxiscord\.com|diszcord\.com|diuscordapp\.com|d\.iscord\.xyz|output-nitro\.com|into-nitro\.com|nitroairdrop\.com|steamcomnunityprofile\.ru\.com|streamcommunicate\.ru|stream-community\.org|stewmpowered\.com|stemcommunilty\.ru|steancomnmunity\.ru|steancommunity\.net\.ru|steampewered\.com|diwcord\.com|sleamcommuntiy\.com|discorcl\.click|stearncornrnuity\.com|stemcornmunity\.com|discord-nitro\.click|discorcl-nitro\.site|discorcl-nitro\.ru|bitskeansell\.ru|discodrapp\.com|discrd\.js\.org|disbored\.com|biscord\.store|newdiscord\.online|discoed\.js\.org|discordsatus\.com|discordappporn\.chat|discord\.co\.in|discordapp\.support|discord-tech\.com|discorh\.js\.org|ww16\.discordcanary\.com|discordsex\.live|discord\.cc|disc\.gifts|discorddev\.com|discordtos\.com|discoredapp\.com|discor\.link|discordsearch\.co|discord-gift-nitro\.site|disdrop\.com\.br|discorddiscord\.com|dicord\.gg|discord-supports\.com|discordapp\.cc|discord-promo\.info|discord-events\.com|discordgiftss\.com|dioscord\.js\.org|xdiscord\.com|dicsord\.pl|dicrod\.com|diswcord\.com|fiscord\.com|discordstaff\.xyz|discordxsteam\.com|disco\.to|discords-nitro\.site|discird\.js\.org|discord-gift\.online|discod\.tech|discordf\.com|discort\.com|discosd\.com|dizscord\.com|discorrdapp\.com|discordboost\.net|discord-sup\.com|dijscord\.com|disocrd\.co|discordsnitro\.store|discourd\.com|discord-steam\.site|dscrd\.club|discordiscord\.js\.org|discrod\.gg|discord-canvas\.js\.org|discordapp\.gg|discordme\.me|discord\.tw|discord-games\.cf|dvscord\.js\.org|discord-verif\.ga|discord-partners\.com|dscord\.nl|discoerd\.com|discourd\.info|www\.discord-nitro\.net|discord-nitro\.shop|discford\.com|discordcreators\.net|discord\.ltd|ptbdiscord\.com|discord\.tools|discord-nitro\.website|discord-nitro\.gift|discordx\.link|duiscord\.com|discordko\.js\.org|dicsords\.ru|discolrd\.com|discord-nltro\.com|dlscord\.win|steamcoomunlty\.ru|steamcommumity\.net|stleanmcommunity\.ru|steamco\.ru|stearncommutiny\.ru|steamcommunility\.com|steamcommunnity\.ru\.com|steamcommunuty\.buzz|steamcommunitty\.com\.ru|steamcommuunity\.ru\.com|steawmcommunity\.net|sleamcomunity\.me|steamcomunity\.org\.ru|steamcornrnuity\.com|steancommunitiy\.com\.ru|steamcoommunlty\.ru|steamcommunti\.com|steamcommynitu\.xyz|steamcommunty\.buzz|steamcommunity\.steams\.ga|sleamcoommunlity\.com|stimcommunity\.ru|strearncomuniity\.ru\.com|steeamcommunnuity\.ru\.com|sieamcommunity\.org\.ru|stemcomuniti\.ru|steam-account\.ru\.com|streamcomulty\.net\.ru|steamcommunitj\.buzz|steamcronnmmuniry\.me|stjeamcomnunitiy\.ru|streamcormnmunity\.ru\.com|ssteamcommunity\.ru\.com|staemcoommunity\.ru|discord\.voto|sleamcommunytu\.ru|steamcommynitu\.net\.ru|steamcommunimty\.ru\.com|steamcommuity\.com|steamcomnunnlty\.ru|steamcodesgen\.com|sieamcommunity\.net\.ru|steamcommunity\.ru\.net|steamcommunutty\.com|streamcommmunlty\.ru\.com|stemconmumity\.ru|steamcommunitu\.icu|stemcommunite\.pp\.ru|steannconmunity\.com|steamecommunity\.net|steanncomnuniity\.xyz|steamcoommunity\.pp\.ru|steamnconmunity\.ru\.com|steammcommunnity\.ru|steampowered\.jcharante\.com|steamcommunidy\.com|streeamcommunuti\.ru|sleamcoommunlilty\.com|steamcommnunily\.xyz|sleamcummunity\.me|steampoiwered\.com|steamcommnunlty\.xyz|streamcomulty\.org\.ru|steamcommmunitty\.site|steamcommuniity\.com\.ru|steamcommunnitlly\.ru|sleamcommyunity\.com|steammcommuunityy\.ru\.com|ssteampowered\.com|stemcomnmunity\.com\.ru|steaimeecommunity\.com|steanncomunitty\.site|stjeamcomuniity\.ru|sleamcommuniity\.ru\.com|steamcommuunity\.pp\.ru|seancommunlty\.ru|streamcommunit\.ru\.com|seamcommunity\.com|streammcommunity\.ru|steamcommuniry\.ru|steamcommunrinty\.ru\.com|streamcommunicate\.ru|steamcommnunlty\.icu|steamcomrnuniti\.ru\.com|steamcornmunit\.ru\.com|steanncomnuniity\.online|steampoward\.com|steamcommuinty\.com\.ru|steamcommuntiy\.com|dlscord\.ink|gave-nitro\.com|discorcl\.gg|tiskorthepp\.gg|steamcornmunify\.ru\.com|discord-moderation\.com|discords-moderator\.com|discords-hypesquad\.com|streamcoommunity\.net|steamcommullty\.ru|stearncomminuty\.ru\.com|steamcommuntliy\.ru|stearmcommunity\.ru\.com|steamcommmunlity\.com|steamccommyunity\.com|sleamcomminity\.ru|stearncornmurnity\.ru\.com|steamcommunitytradeofter\.com|steamcomunnuty\.com|steamcommunitytradeofer\.com|steancomnunity\.com|steammatily\.online|steammatily\.ru|steeamcommunlty\.com|steanncomunitli\.ru\.com|sleamcomunitly\.co|steancommuncity\.ru|steamcommuity\.ru|streamcomuniitty\.ru\.com|steamcoommunuity\.com|steamcommunity-profiles\.ru\.com|steamcommurlity\.com|stemcornmunity\.ru|stleamcormunity\.ru\.com|steamcommuiti\.ru|discordglft\.ru|dicordgift\.ru\.com|discords-hypesquads\.com|discordnitrofree\.xyz|discordnitro-steam\.ru|discourd\.site|discordgiftis\.ru|sterncommunilty\.ru\.com|discords-moderation\.com|discords-developers\.com|discord-claim\.com|discord-stuff\.com|discord-give\.com|discocrd\.gift|discord\.gg/ig

const modChannels = ["449514127707078656", "866424900268589096", "769356439495901214", "591426310317015072", "533714761553281034", "591422940789211160", "591423157856895015", "844314485769371648", "846797227561058305"];
const alertChannel = "663419213918240800"; // #testing | mozzy server

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {

        const disabled = false;
        if (disabled) return;
        if (message.author.bot) return;

        const matchedContent = message.content.match(badWordsRegex);

        // Temp for when Zep dies
        if (!modChannels.includes(message.channel.id) && matchedContent) {
            await message.delete().catch(() => { });
            setTimeout(() => {
                client.channels.cache.get(alertChannel).send({ content: `\`[${moment.utc().format("YYYY-MM-DD HH:mm:ss UTC")}]\` ⛔ Detected bad content in <#${message.channel.id}> from <@${message.author.id}> (${message.author.id})\nMatched ${matchedContent.length > 1 ? "words" : "word"} \`${matchedContent.join("`, `")}\` in the message below:\n\`\`\`\n${message.content}\n\`\`\`\n${message.deleted ? "Actions taken: **delete, log**" : `Link: https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}\nAction taken: **log**`}`, allowedMentions: { parse: [] } }).then(msg => msg.suppressEmbeds(true));
                return;
            }, 200);
        }
    },
};