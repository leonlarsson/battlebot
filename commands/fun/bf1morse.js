const morse = require('morse-decoder');
const jmespath = require('jmespath');
const RegexEscape = require("regex-escape");
const json = require('../../assets/misc/bf1morse_locations');

module.exports = {
    name: "bf1morse",
    public: false,
    enabled: true,
    async execute(interaction) {

        // Get input and stage
        const input = interaction.options.getString("input");
        const stage = interaction.options.getString("stage");

        // Check input
        if (input.match(/[\r\n]+/)) return interaction.reply({ content: "⛔ Forbidden characters.", ephemeral: true });

        // Determines if the input is text or morse. Also creates inputType, "morse" or "string", which is used in the jmespath query.
        let isMorse;
        let inputType;
        input.startsWith(".") || input.startsWith("-") ? (isMorse = true, inputType = "morse") : (isMorse = false, inputType = "text");

        // If morse, get decoded input
        let inputAsText;
        if (isMorse) inputAsText = morse.decode(input);

        // If plaintext, get input as morse
        let inputAsMorse;
        if (!isMorse) inputAsMorse = morse.encode(input);

        // Determines which locations to search in. If stage is not specified, search for all. Also determines if to use text or morse locations.
        let str;
        if (stage) {

            str = JSON.stringify(jmespath.search(json, `*.*.*.cipher_${inputType}${stage}`)).replaceAll(`","`, "\n").replaceAll(`"],["`, "\n").replaceAll(",", "").replaceAll("[", "").replaceAll("]", "").replaceAll(`"`, "");

        } else {

            str = `${JSON.stringify(jmespath.search(json, `*.*.*.cipher_${inputType}1`)).replaceAll(`","`, "\n").replaceAll(`"],["`, "\n").replaceAll(",", "").replaceAll("[", "").replaceAll("]", "").replaceAll(`"`, "")}
${JSON.stringify(jmespath.search(json, `*.*.*.cipher_${inputType}2`)).replaceAll(`","`, "\n").replaceAll(`"],["`, "\n").replaceAll(",", "").replaceAll("[", "").replaceAll("]", "").replaceAll(`"`, "")}
${JSON.stringify(jmespath.search(json, `*.*.*.cipher_${inputType}3`)).replaceAll(`","`, "\n").replaceAll(`"],["`, "\n").replaceAll(",", "").replaceAll("[", "").replaceAll("]", "").replaceAll(`"`, "")}
${JSON.stringify(jmespath.search(json, `*.*.*.cipher_${inputType}4`)).replaceAll(`","`, "\n").replaceAll(`"],["`, "\n").replaceAll(",", "").replaceAll("[", "").replaceAll("]", "").replaceAll(`"`, "")}
${JSON.stringify(jmespath.search(json, `*.*.*.cipher_${inputType}5`)).replaceAll(`","`, "\n").replaceAll(`"],["`, "\n").replaceAll(",", "").replaceAll("[", "").replaceAll("]", "").replaceAll(`"`, "")}
${JSON.stringify(jmespath.search(json, `*.*.*.cipher_${inputType}6`)).replaceAll(`","`, "\n").replaceAll(`"],["`, "\n").replaceAll(",", "").replaceAll("[", "").replaceAll("]", "").replaceAll(`"`, "")}
${JSON.stringify(jmespath.search(json, `*.*.*.cipher_${inputType}7`)).replaceAll(`","`, "\n").replaceAll(`"],["`, "\n").replaceAll(",", "").replaceAll("[", "").replaceAll("]", "").replaceAll(`"`, "")}
${JSON.stringify(jmespath.search(json, `*.*.*.cipher_${inputType}8`)).replaceAll(`","`, "\n").replaceAll(`"],["`, "\n").replaceAll(",", "").replaceAll("[", "").replaceAll("]", "").replaceAll(`"`, "")}
${JSON.stringify(jmespath.search(json, `*.*.*.cipher_${inputType}9`)).replaceAll(`","`, "\n").replaceAll(`"],["`, "\n").replaceAll(",", "").replaceAll("[", "").replaceAll("]", "").replaceAll(`"`, "")}`

        }

        // Build initial regex
        const initialRegex = new RegExp("(?:(.*" + RegexEscape(input) + ".*))", "gi");

        // Get initial matches
        let matches = str.match(initialRegex);

        // Kaktus' fix: If no matches on initial regex, start removing characters and see if we have a match with fluff. Remove this entire block if this causes issues.
        noresult: if (matches === null) {

            let minimumChars;
            isMorse ? minimumChars = 15 : minimumChars = 5;

            let regex2;
            for (let i = 1; i < input.length - minimumChars; i++) {
                if (isMorse) {
                    regex2 = new RegExp("(?:(.*" + RegexEscape(input.slice(0, input.length - i)) + ".*))", "gi");
                } else {
                    regex2 = new RegExp("(?:(.*" + RegexEscape(input.slice(0, input.length - i)).replaceAll(" ", "") + ".*))", "gi");
                }
                const arr2 = str.match(regex2);
                if (arr2) {
                    matches = arr2;
                    break noresult;
                }
            }
        }

        // If no matches, return and notify.
        if (!matches) return interaction.reply({ content: `⛔ Found no matches for \`${input}\` in ${stage ? `stage ${stage}` : "all stages"}.\n${isMorse ? `Decoded: \`${inputAsText}\`` : `Encoded: \`${inputAsMorse}\``}`, ephemeral: true });

        // Since we have matches, get the amount of matches.
        const totalMatches = matches.length;

        // Join the matches with a newline
        matches = matches.join("\n");

        // Morse Replace
        // Amiens
        // 1-1
        matches = matches.replace(json.maps.amiens.location_1[`cipher_${inputType}1`], `(Stage 1) ${json.maps.amiens.location_1.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_1[`cipher_${inputType}2`], `(Stage 2) ${json.maps.amiens.location_1.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_1[`cipher_${inputType}3`], `(Stage 3) ${json.maps.amiens.location_1.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_1[`cipher_${inputType}4`], `(Stage 4) ${json.maps.amiens.location_1.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_1[`cipher_${inputType}5`], `(Stage 5) ${json.maps.amiens.location_1.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_1[`cipher_${inputType}6`], `(Stage 6) ${json.maps.amiens.location_1.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_1[`cipher_${inputType}7`], `(Stage 7) ${json.maps.amiens.location_1.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_1[`cipher_${inputType}8`], `(Stage 8) ${json.maps.amiens.location_1.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);

        // 1-2
        matches = matches.replace(json.maps.amiens.location_2[`cipher_${inputType}1`], `(Stage 1) ${json.maps.amiens.location_2.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_2[`cipher_${inputType}2`], `(Stage 2) ${json.maps.amiens.location_2.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_2[`cipher_${inputType}3`], `(Stage 3) ${json.maps.amiens.location_2.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_2[`cipher_${inputType}4`], `(Stage 4) ${json.maps.amiens.location_2.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_2[`cipher_${inputType}5`], `(Stage 5) ${json.maps.amiens.location_2.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_2[`cipher_${inputType}6`], `(Stage 6) ${json.maps.amiens.location_2.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_2[`cipher_${inputType}7`], `(Stage 7) ${json.maps.amiens.location_2.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_2[`cipher_${inputType}8`], `(Stage 8) ${json.maps.amiens.location_2.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);

        // 1-3
        matches = matches.replace(json.maps.amiens.location_3[`cipher_${inputType}1`], `(Stage 1) ${json.maps.amiens.location_3.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_3[`cipher_${inputType}2`], `(Stage 2) ${json.maps.amiens.location_3.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_3[`cipher_${inputType}3`], `(Stage 3) ${json.maps.amiens.location_3.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_3[`cipher_${inputType}4`], `(Stage 4) ${json.maps.amiens.location_3.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_3[`cipher_${inputType}5`], `(Stage 5) ${json.maps.amiens.location_3.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_3[`cipher_${inputType}6`], `(Stage 6) ${json.maps.amiens.location_3.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_3[`cipher_${inputType}7`], `(Stage 7) ${json.maps.amiens.location_3.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);
        matches = matches.replace(json.maps.amiens.location_3[`cipher_${inputType}8`], `(Stage 8) ${json.maps.amiens.location_3.plain_text_spaces}: ${json.maps.amiens.map_name} | ${json.maps.amiens.map_url}`);

        // Apremont
        // 2-1
        matches = matches.replace(json.maps.apremont.location_1[`cipher_${inputType}1`], `(Stage 1) ${json.maps.apremont.location_1.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_1[`cipher_${inputType}2`], `(Stage 2) ${json.maps.apremont.location_1.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_1[`cipher_${inputType}3`], `(Stage 3) ${json.maps.apremont.location_1.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_1[`cipher_${inputType}4`], `(Stage 4) ${json.maps.apremont.location_1.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_1[`cipher_${inputType}5`], `(Stage 5) ${json.maps.apremont.location_1.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_1[`cipher_${inputType}6`], `(Stage 6) ${json.maps.apremont.location_1.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_1[`cipher_${inputType}7`], `(Stage 7) ${json.maps.apremont.location_1.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_1[`cipher_${inputType}8`], `(Stage 8) ${json.maps.apremont.location_1.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);

        // 2-2
        matches = matches.replace(json.maps.apremont.location_2[`cipher_${inputType}1`], `(Stage 1) ${json.maps.apremont.location_2.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_2[`cipher_${inputType}2`], `(Stage 2) ${json.maps.apremont.location_2.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_2[`cipher_${inputType}3`], `(Stage 3) ${json.maps.apremont.location_2.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_2[`cipher_${inputType}4`], `(Stage 4) ${json.maps.apremont.location_2.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_2[`cipher_${inputType}5`], `(Stage 5) ${json.maps.apremont.location_2.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_2[`cipher_${inputType}6`], `(Stage 6) ${json.maps.apremont.location_2.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_2[`cipher_${inputType}7`], `(Stage 7) ${json.maps.apremont.location_2.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_2[`cipher_${inputType}8`], `(Stage 8) ${json.maps.apremont.location_2.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);

        // 3-3
        matches = matches.replace(json.maps.apremont.location_3[`cipher_${inputType}1`], `(Stage 1) ${json.maps.apremont.location_3.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_3[`cipher_${inputType}2`], `(Stage 2) ${json.maps.apremont.location_3.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_3[`cipher_${inputType}3`], `(Stage 3) ${json.maps.apremont.location_3.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_3[`cipher_${inputType}4`], `(Stage 4) ${json.maps.apremont.location_3.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_3[`cipher_${inputType}5`], `(Stage 5) ${json.maps.apremont.location_3.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_3[`cipher_${inputType}6`], `(Stage 6) ${json.maps.apremont.location_3.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_3[`cipher_${inputType}7`], `(Stage 7) ${json.maps.apremont.location_3.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);
        matches = matches.replace(json.maps.apremont.location_3[`cipher_${inputType}8`], `(Stage 8) ${json.maps.apremont.location_3.plain_text_spaces}: ${json.maps.apremont.map_name} | ${json.maps.apremont.map_url}`);

        // Varennes
        // 3-1
        matches = matches.replace(json.maps.varennes.location_1[`cipher_${inputType}1`], `(Stage 1) ${json.maps.varennes.location_1.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_1[`cipher_${inputType}2`], `(Stage 2) ${json.maps.varennes.location_1.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_1[`cipher_${inputType}3`], `(Stage 3) ${json.maps.varennes.location_1.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_1[`cipher_${inputType}4`], `(Stage 4) ${json.maps.varennes.location_1.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_1[`cipher_${inputType}5`], `(Stage 5) ${json.maps.varennes.location_1.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_1[`cipher_${inputType}6`], `(Stage 6) ${json.maps.varennes.location_1.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_1[`cipher_${inputType}7`], `(Stage 7) ${json.maps.varennes.location_1.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_1[`cipher_${inputType}8`], `(Stage 8) ${json.maps.varennes.location_1.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);

        // 3-2
        matches = matches.replace(json.maps.varennes.location_2[`cipher_${inputType}1`], `(Stage 1) ${json.maps.varennes.location_2.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_2[`cipher_${inputType}2`], `(Stage 2) ${json.maps.varennes.location_2.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_2[`cipher_${inputType}3`], `(Stage 3) ${json.maps.varennes.location_2.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_2[`cipher_${inputType}4`], `(Stage 4) ${json.maps.varennes.location_2.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_2[`cipher_${inputType}5`], `(Stage 5) ${json.maps.varennes.location_2.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_2[`cipher_${inputType}6`], `(Stage 6) ${json.maps.varennes.location_2.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_2[`cipher_${inputType}7`], `(Stage 7) ${json.maps.varennes.location_2.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_2[`cipher_${inputType}8`], `(Stage 8) ${json.maps.varennes.location_2.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);

        // 3-3
        matches = matches.replace(json.maps.varennes.location_3[`cipher_${inputType}1`], `(Stage 1) ${json.maps.varennes.location_3.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_3[`cipher_${inputType}2`], `(Stage 2) ${json.maps.varennes.location_3.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_3[`cipher_${inputType}3`], `(Stage 3) ${json.maps.varennes.location_3.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_3[`cipher_${inputType}4`], `(Stage 4) ${json.maps.varennes.location_3.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_3[`cipher_${inputType}5`], `(Stage 5) ${json.maps.varennes.location_3.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_3[`cipher_${inputType}6`], `(Stage 6) ${json.maps.varennes.location_3.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_3[`cipher_${inputType}7`], `(Stage 7) ${json.maps.varennes.location_3.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);
        matches = matches.replace(json.maps.varennes.location_3[`cipher_${inputType}8`], `(Stage 8) ${json.maps.varennes.location_3.plain_text_spaces}: ${json.maps.varennes.map_name} | ${json.maps.varennes.map_url}`);

        // Adriatic
        // 4-1
        matches = matches.replace(json.maps.adriatic.location_1[`cipher_${inputType}1`], `(Stage 1) ${json.maps.adriatic.location_1.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_1[`cipher_${inputType}2`], `(Stage 2) ${json.maps.adriatic.location_1.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_1[`cipher_${inputType}3`], `(Stage 3) ${json.maps.adriatic.location_1.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_1[`cipher_${inputType}4`], `(Stage 4) ${json.maps.adriatic.location_1.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_1[`cipher_${inputType}5`], `(Stage 5) ${json.maps.adriatic.location_1.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_1[`cipher_${inputType}6`], `(Stage 6) ${json.maps.adriatic.location_1.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_1[`cipher_${inputType}7`], `(Stage 7) ${json.maps.adriatic.location_1.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_1[`cipher_${inputType}8`], `(Stage 8) ${json.maps.adriatic.location_1.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);

        // 4-2
        matches = matches.replace(json.maps.adriatic.location_2[`cipher_${inputType}1`], `(Stage 1) ${json.maps.adriatic.location_2.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_2[`cipher_${inputType}2`], `(Stage 2) ${json.maps.adriatic.location_2.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_2[`cipher_${inputType}3`], `(Stage 3) ${json.maps.adriatic.location_2.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_2[`cipher_${inputType}4`], `(Stage 4) ${json.maps.adriatic.location_2.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_2[`cipher_${inputType}5`], `(Stage 5) ${json.maps.adriatic.location_2.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_2[`cipher_${inputType}6`], `(Stage 6) ${json.maps.adriatic.location_2.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_2[`cipher_${inputType}7`], `(Stage 7) ${json.maps.adriatic.location_2.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_2[`cipher_${inputType}8`], `(Stage 8) ${json.maps.adriatic.location_2.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);

        // 4-3
        matches = matches.replace(json.maps.adriatic.location_3[`cipher_${inputType}1`], `(Stage 1) ${json.maps.adriatic.location_3.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_3[`cipher_${inputType}2`], `(Stage 2) ${json.maps.adriatic.location_3.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_3[`cipher_${inputType}3`], `(Stage 3) ${json.maps.adriatic.location_3.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_3[`cipher_${inputType}4`], `(Stage 4) ${json.maps.adriatic.location_3.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_3[`cipher_${inputType}5`], `(Stage 5) ${json.maps.adriatic.location_3.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_3[`cipher_${inputType}6`], `(Stage 6) ${json.maps.adriatic.location_3.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_3[`cipher_${inputType}7`], `(Stage 7) ${json.maps.adriatic.location_3.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);
        matches = matches.replace(json.maps.adriatic.location_3[`cipher_${inputType}8`], `(Stage 8) ${json.maps.adriatic.location_3.plain_text_spaces}: ${json.maps.adriatic.map_name} | ${json.maps.adriatic.map_url}`);

        // Faw
        // 5-1
        matches = matches.replace(json.maps.faw.location_1[`cipher_${inputType}1`], `(Stage 1) ${json.maps.faw.location_1.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_1[`cipher_${inputType}2`], `(Stage 2) ${json.maps.faw.location_1.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_1[`cipher_${inputType}3`], `(Stage 3) ${json.maps.faw.location_1.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_1[`cipher_${inputType}4`], `(Stage 4) ${json.maps.faw.location_1.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_1[`cipher_${inputType}5`], `(Stage 5) ${json.maps.faw.location_1.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_1[`cipher_${inputType}6`], `(Stage 6) ${json.maps.faw.location_1.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_1[`cipher_${inputType}7`], `(Stage 7) ${json.maps.faw.location_1.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_1[`cipher_${inputType}8`], `(Stage 8) ${json.maps.faw.location_1.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);

        // 5-2
        matches = matches.replace(json.maps.faw.location_2[`cipher_${inputType}1`], `(Stage 1) ${json.maps.faw.location_2.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_2[`cipher_${inputType}2`], `(Stage 2) ${json.maps.faw.location_2.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_2[`cipher_${inputType}3`], `(Stage 3) ${json.maps.faw.location_2.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_2[`cipher_${inputType}4`], `(Stage 4) ${json.maps.faw.location_2.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_2[`cipher_${inputType}5`], `(Stage 5) ${json.maps.faw.location_2.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_2[`cipher_${inputType}6`], `(Stage 6) ${json.maps.faw.location_2.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_2[`cipher_${inputType}7`], `(Stage 7) ${json.maps.faw.location_2.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_2[`cipher_${inputType}8`], `(Stage 8) ${json.maps.faw.location_2.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);

        // 5-3
        matches = matches.replace(json.maps.faw.location_3[`cipher_${inputType}1`], `(Stage 1) ${json.maps.faw.location_3.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_3[`cipher_${inputType}2`], `(Stage 2) ${json.maps.faw.location_3.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_3[`cipher_${inputType}3`], `(Stage 3) ${json.maps.faw.location_3.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_3[`cipher_${inputType}4`], `(Stage 4) ${json.maps.faw.location_3.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_3[`cipher_${inputType}5`], `(Stage 5) ${json.maps.faw.location_3.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_3[`cipher_${inputType}6`], `(Stage 6) ${json.maps.faw.location_3.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_3[`cipher_${inputType}7`], `(Stage 7) ${json.maps.faw.location_3.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);
        matches = matches.replace(json.maps.faw.location_3[`cipher_${inputType}8`], `(Stage 8) ${json.maps.faw.location_3.plain_text_spaces}: ${json.maps.faw.map_name} | ${json.maps.faw.map_url}`);

        // Venetian
        // 6-1
        matches = matches.replace(json.maps.venetian.location_1[`cipher_${inputType}1`], `(Stage 1) ${json.maps.venetian.location_1.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_1[`cipher_${inputType}2`], `(Stage 2) ${json.maps.venetian.location_1.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_1[`cipher_${inputType}3`], `(Stage 3) ${json.maps.venetian.location_1.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_1[`cipher_${inputType}4`], `(Stage 4) ${json.maps.venetian.location_1.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_1[`cipher_${inputType}5`], `(Stage 5) ${json.maps.venetian.location_1.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_1[`cipher_${inputType}6`], `(Stage 6) ${json.maps.venetian.location_1.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_1[`cipher_${inputType}7`], `(Stage 7) ${json.maps.venetian.location_1.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_1[`cipher_${inputType}8`], `(Stage 8) ${json.maps.venetian.location_1.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);

        // 6-2
        matches = matches.replace(json.maps.venetian.location_2[`cipher_${inputType}1`], `(Stage 1) ${json.maps.venetian.location_2.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_2[`cipher_${inputType}2`], `(Stage 2) ${json.maps.venetian.location_2.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_2[`cipher_${inputType}3`], `(Stage 3) ${json.maps.venetian.location_2.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_2[`cipher_${inputType}4`], `(Stage 4) ${json.maps.venetian.location_2.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_2[`cipher_${inputType}5`], `(Stage 5) ${json.maps.venetian.location_2.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_2[`cipher_${inputType}6`], `(Stage 6) ${json.maps.venetian.location_2.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_2[`cipher_${inputType}7`], `(Stage 7) ${json.maps.venetian.location_2.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_2[`cipher_${inputType}8`], `(Stage 8) ${json.maps.venetian.location_2.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);

        // 6-3
        matches = matches.replace(json.maps.venetian.location_3[`cipher_${inputType}1`], `(Stage 1) ${json.maps.venetian.location_3.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_3[`cipher_${inputType}2`], `(Stage 2) ${json.maps.venetian.location_3.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_3[`cipher_${inputType}3`], `(Stage 3) ${json.maps.venetian.location_3.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_3[`cipher_${inputType}4`], `(Stage 4) ${json.maps.venetian.location_3.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_3[`cipher_${inputType}5`], `(Stage 5) ${json.maps.venetian.location_3.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_3[`cipher_${inputType}6`], `(Stage 6) ${json.maps.venetian.location_3.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_3[`cipher_${inputType}7`], `(Stage 7) ${json.maps.venetian.location_3.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);
        matches = matches.replace(json.maps.venetian.location_3[`cipher_${inputType}8`], `(Stage 8) ${json.maps.venetian.location_3.plain_text_spaces}: ${json.maps.venetian.map_name} | ${json.maps.venetian.map_url}`);

        // Jifar
        // 7-1
        matches = matches.replace(json.maps.jifar.location_1[`cipher_${inputType}1`], `(Stage 1) ${json.maps.jifar.location_1.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_1[`cipher_${inputType}2`], `(Stage 2) ${json.maps.jifar.location_1.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_1[`cipher_${inputType}3`], `(Stage 3) ${json.maps.jifar.location_1.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_1[`cipher_${inputType}4`], `(Stage 4) ${json.maps.jifar.location_1.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_1[`cipher_${inputType}5`], `(Stage 5) ${json.maps.jifar.location_1.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_1[`cipher_${inputType}6`], `(Stage 6) ${json.maps.jifar.location_1.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_1[`cipher_${inputType}7`], `(Stage 7) ${json.maps.jifar.location_1.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_1[`cipher_${inputType}8`], `(Stage 8) ${json.maps.jifar.location_1.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);

        // 7-2
        matches = matches.replace(json.maps.jifar.location_2[`cipher_${inputType}1`], `(Stage 1) ${json.maps.jifar.location_2.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_2[`cipher_${inputType}2`], `(Stage 2) ${json.maps.jifar.location_2.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_2[`cipher_${inputType}3`], `(Stage 3) ${json.maps.jifar.location_2.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_2[`cipher_${inputType}4`], `(Stage 4) ${json.maps.jifar.location_2.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_2[`cipher_${inputType}5`], `(Stage 5) ${json.maps.jifar.location_2.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_2[`cipher_${inputType}6`], `(Stage 6) ${json.maps.jifar.location_2.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_2[`cipher_${inputType}7`], `(Stage 7) ${json.maps.jifar.location_2.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_2[`cipher_${inputType}8`], `(Stage 8) ${json.maps.jifar.location_2.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);

        // 7-3
        matches = matches.replace(json.maps.jifar.location_3[`cipher_${inputType}1`], `(Stage 1) ${json.maps.jifar.location_3.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_3[`cipher_${inputType}2`], `(Stage 2) ${json.maps.jifar.location_3.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_3[`cipher_${inputType}3`], `(Stage 3) ${json.maps.jifar.location_3.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_3[`cipher_${inputType}4`], `(Stage 4) ${json.maps.jifar.location_3.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_3[`cipher_${inputType}5`], `(Stage 5) ${json.maps.jifar.location_3.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_3[`cipher_${inputType}6`], `(Stage 6) ${json.maps.jifar.location_3.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_3[`cipher_${inputType}7`], `(Stage 7) ${json.maps.jifar.location_3.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);
        matches = matches.replace(json.maps.jifar.location_3[`cipher_${inputType}8`], `(Stage 8) ${json.maps.jifar.location_3.plain_text_spaces}: ${json.maps.jifar.map_name} | ${json.maps.jifar.map_url}`);

        // Peronne
        // 8-1
        matches = matches.replace(json.maps.peronne.location_1[`cipher_${inputType}1`], `(Stage 1) ${json.maps.peronne.location_1.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_1[`cipher_${inputType}2`], `(Stage 2) ${json.maps.peronne.location_1.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_1[`cipher_${inputType}3`], `(Stage 3) ${json.maps.peronne.location_1.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_1[`cipher_${inputType}4`], `(Stage 4) ${json.maps.peronne.location_1.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_1[`cipher_${inputType}5`], `(Stage 5) ${json.maps.peronne.location_1.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_1[`cipher_${inputType}6`], `(Stage 6) ${json.maps.peronne.location_1.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_1[`cipher_${inputType}7`], `(Stage 7) ${json.maps.peronne.location_1.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_1[`cipher_${inputType}8`], `(Stage 8) ${json.maps.peronne.location_1.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);

        // 8-2
        matches = matches.replace(json.maps.peronne.location_2[`cipher_${inputType}1`], `(Stage 1) ${json.maps.peronne.location_2.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_2[`cipher_${inputType}2`], `(Stage 2) ${json.maps.peronne.location_2.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_2[`cipher_${inputType}3`], `(Stage 3) ${json.maps.peronne.location_2.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_2[`cipher_${inputType}4`], `(Stage 4) ${json.maps.peronne.location_2.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_2[`cipher_${inputType}5`], `(Stage 5) ${json.maps.peronne.location_2.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_2[`cipher_${inputType}6`], `(Stage 6) ${json.maps.peronne.location_2.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_2[`cipher_${inputType}7`], `(Stage 7) ${json.maps.peronne.location_2.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_2[`cipher_${inputType}8`], `(Stage 8) ${json.maps.peronne.location_2.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);

        // 8-3
        matches = matches.replace(json.maps.peronne.location_3[`cipher_${inputType}1`], `(Stage 1) ${json.maps.peronne.location_3.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_3[`cipher_${inputType}2`], `(Stage 2) ${json.maps.peronne.location_3.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_3[`cipher_${inputType}3`], `(Stage 3) ${json.maps.peronne.location_3.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_3[`cipher_${inputType}4`], `(Stage 4) ${json.maps.peronne.location_3.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_3[`cipher_${inputType}5`], `(Stage 5) ${json.maps.peronne.location_3.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_3[`cipher_${inputType}6`], `(Stage 6) ${json.maps.peronne.location_3.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_3[`cipher_${inputType}7`], `(Stage 7) ${json.maps.peronne.location_3.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);
        matches = matches.replace(json.maps.peronne.location_3[`cipher_${inputType}8`], `(Stage 8) ${json.maps.peronne.location_3.plain_text_spaces}: ${json.maps.peronne.map_name} | ${json.maps.peronne.map_url}`);

        // Canal
        // 9-1
        matches = matches.replace(json.maps.canal.location_1[`cipher_${inputType}1`], `(Stage 1) ${json.maps.canal.location_1.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_1[`cipher_${inputType}2`], `(Stage 2) ${json.maps.canal.location_1.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_1[`cipher_${inputType}3`], `(Stage 3) ${json.maps.canal.location_1.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_1[`cipher_${inputType}4`], `(Stage 4) ${json.maps.canal.location_1.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_1[`cipher_${inputType}5`], `(Stage 5) ${json.maps.canal.location_1.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_1[`cipher_${inputType}6`], `(Stage 6) ${json.maps.canal.location_1.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_1[`cipher_${inputType}7`], `(Stage 7) ${json.maps.canal.location_1.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_1[`cipher_${inputType}8`], `(Stage 8) ${json.maps.canal.location_1.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);

        // 9-2
        matches = matches.replace(json.maps.canal.location_2[`cipher_${inputType}1`], `(Stage 1) ${json.maps.canal.location_2.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_2[`cipher_${inputType}2`], `(Stage 2) ${json.maps.canal.location_2.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_2[`cipher_${inputType}3`], `(Stage 3) ${json.maps.canal.location_2.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_2[`cipher_${inputType}4`], `(Stage 4) ${json.maps.canal.location_2.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_2[`cipher_${inputType}5`], `(Stage 5) ${json.maps.canal.location_2.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_2[`cipher_${inputType}6`], `(Stage 6) ${json.maps.canal.location_2.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_2[`cipher_${inputType}7`], `(Stage 7) ${json.maps.canal.location_2.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_2[`cipher_${inputType}8`], `(Stage 8) ${json.maps.canal.location_2.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);

        // 9-3
        matches = matches.replace(json.maps.canal.location_3[`cipher_${inputType}1`], `(Stage 1) ${json.maps.canal.location_3.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_3[`cipher_${inputType}2`], `(Stage 2) ${json.maps.canal.location_3.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_3[`cipher_${inputType}3`], `(Stage 3) ${json.maps.canal.location_3.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_3[`cipher_${inputType}4`], `(Stage 4) ${json.maps.canal.location_3.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_3[`cipher_${inputType}5`], `(Stage 5) ${json.maps.canal.location_3.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_3[`cipher_${inputType}6`], `(Stage 6) ${json.maps.canal.location_3.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_3[`cipher_${inputType}7`], `(Stage 7) ${json.maps.canal.location_3.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);
        matches = matches.replace(json.maps.canal.location_3[`cipher_${inputType}8`], `(Stage 8) ${json.maps.canal.location_3.plain_text_spaces}: ${json.maps.canal.map_name} | ${json.maps.canal.map_url}`);

        // 10-1
        matches = matches.replace(json.maps.giantsshadow.location_1[`cipher_${inputType}9`], `(Stage 9) ${json.maps.giantsshadow.location_1.plain_text_spaces}: ${json.maps.giantsshadow.map_name} | ${json.maps.giantsshadow.map_url}`);

        // RESPONSES //

        // If there is only one match
        if (totalMatches === 1) {
            return interaction.reply({ content: `✅ Found one match for \`${input}\` in ${stage ? `stage ${stage}` : "all stages"}:\n${matches}\n${isMorse ? `Decoded: \`${inputAsText}\`` : `Encoded: \`${inputAsMorse}\``}` });
        }

        // If more than 10 matches
        if (totalMatches > 10) return interaction.reply({ content: `🕵️ Found more than 10 matches (${totalMatches}). Please input more to get a better match. For a better experience, use the website <https://leonlarsson.com/projects/bf1morse/>\n${isMorse ? `Decoded: \`${inputAsText}\`` : `Encoded: \`${inputAsMorse}\``}`, ephemeral: true });

        // If less than 10 matches
        return interaction.reply({ content: `✅ Found ${totalMatches} ${totalMatches > 1 ? "matches" : "match"} for \`${input}\` in ${stage ? `stage ${stage}` : "all stages"}:\`\`\`\n${matches}\n\`\`\`\n${isMorse ? `Decoded: \`${inputAsText}\`` : `Encoded: \`${inputAsMorse}\``}\nTo narrow down the results, give me more input. For a better experience, use the website: <https://leonlarsson.com/projects/bf1morse/>` });

    }
}