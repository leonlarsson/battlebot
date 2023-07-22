/**
 * Gets a cooldown.
 * @param {string} userId The user id.
 * @param {string} command - The command name.
 */
export const getCooldown = async (userId, command) => {
    const url = new URL("https://battlebot-api.ragnarok.workers.dev");
    url.searchParams.set("env", process.env.ENVIRONMENT);
    url.searchParams.set("user", userId);
    url.searchParams.set("command", command);
    const res = await fetch(url.href, { 
        headers: { "API-KEY": process.env.COOLDOWN_API_KEY }
     });
    return await res.json();
};

/**
 * Sets a cooldown.
 * @param {string} userId The user id.
 * @param {string} command - The command name.
 * @param {number} expireAtTimestampMs - The timestamp to expire at (milliseconds).
 */
export const setCooldown = async (userId, command, expireAtTimestampMs) => {
    const url = new URL("https://battlebot-api.ragnarok.workers.dev");
    url.searchParams.set("env", process.env.ENVIRONMENT);
    url.searchParams.set("user", userId);
    url.searchParams.set("command", command);
    url.searchParams.set("expireAt", expireAtTimestampMs);
    const res = await fetch(url.href, { 
        method: "POST",
        headers: { "API-KEY": process.env.COOLDOWN_API_KEY }
    });
    return await res.json();
};

/**
 * Deletes a cooldown.
 * @param {string} userId The user id.
 * @param {string} command - The command name.
 */
export const deleteCooldown = async (userId, command) => {
    const url = new URL("https://battlebot-api.ragnarok.workers.dev");
    url.searchParams.set("env", process.env.ENVIRONMENT);
    url.searchParams.set("user", userId);
    url.searchParams.set("command", command);
    const res = await fetch(url.href, { 
        method: "DELETE",
        headers: { "API-KEY": process.env.COOLDOWN_API_KEY }
     });
    return await res.json();
};