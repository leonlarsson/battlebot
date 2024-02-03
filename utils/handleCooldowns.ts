export const getCooldown = async (userId: string, command: string) => {
  const url = new URL("https://battlebot-api.ragnarok.workers.dev");
  url.searchParams.set("env", process.env.ENVIRONMENT);
  url.searchParams.set("user", userId);
  url.searchParams.set("command", command);
  const res = await fetch(url.href, {
    headers: { "API-KEY": process.env.COOLDOWN_API_KEY },
  });
  return (await res.json()) as {
    cooldown: boolean;
    cooldownExpiresTimestamp: number;
  };
};

export const setCooldown = async (userId: string, command: string, expireAtTimestampMs: number) => {
  const url = new URL("https://battlebot-api.ragnarok.workers.dev");
  url.searchParams.set("env", process.env.ENVIRONMENT);
  url.searchParams.set("user", userId);
  url.searchParams.set("command", command);
  url.searchParams.set("expireAt", expireAtTimestampMs.toString());
  const res = await fetch(url.href, {
    method: "POST",
    headers: { "API-KEY": process.env.COOLDOWN_API_KEY },
  });
  return await res.json();
};

export const deleteCooldown = async (userId: string, command: string) => {
  const url = new URL("https://battlebot-api.ragnarok.workers.dev");
  url.searchParams.set("env", process.env.ENVIRONMENT);
  url.searchParams.set("user", userId);
  url.searchParams.set("command", command);
  const res = await fetch(url.href, {
    method: "DELETE",
    headers: { "API-KEY": process.env.COOLDOWN_API_KEY },
  });
  return await res.json();
};
