const guildConfigs: { [key: string]: any } = {
  // Private server
  "99183009621622784": {
    levels: {
      // Admin
      "198831374667481088": 100,
    },
    plugins: {
      fnb: {
        overrides: [
          {
            level: ">=100",
            config: {
              can_create: true,
              can_category: true,
            },
          },
        ],
      },
    },
  },

  // BFD
  "140933721929940992": {
    levels: {
      // Admin
      "140941611415633920": 100,
      // Mod
      "174949751152836608": 70,
      // FNB Staff
      "907750002313539634": 60,
    },
    plugins: {
      fnb: {
        overrides: [
          {
            level: ">=60",
            config: {
              can_create: true,
              can_category: true,
            },
          },
        ],
      },
    },
  },
};

export const getGuildConfig = (id: string) => {
  return guildConfigs[id] ?? {};
};
