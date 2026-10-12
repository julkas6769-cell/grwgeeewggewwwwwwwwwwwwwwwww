const { AsyncLocalStorage } = require("node:async_hooks");
const fs = require("node:fs");
const path = require("node:path");

const context = new AsyncLocalStorage();
const configCache = new Map();
const storageRoot = path.join(__dirname, "data");
const defaults = {
  ticketCategoryId: "",
  ticketCategoryIds: {},
  ticketRoleIds: {},
  supportRoleId: "",
  verificationRoleId: "",
  logChannelId: "",
  inviteJoinChannelId: "",
  rulesChannelId: "",
  rulesProblemChannelId: "",
  vanityInviteCode: "",
  opinionCountChannelId: "",
  reactionCountChannelId: "",
  opinionCountChannelName: "opinie",
  reactionCountChannelName: "reakcje",
  reactionYesEmojiId: "",
  reactionNoEmojiId: "",
  restockChannelId: "",
  restockOrderChannelId: "",
  restockPingRoleId: "",
  blacklistRoleId: "",
  giveawayManagerRoleId: "",
  serverBrandName: "Krecik Bot",
  welcomeChannelId: "",
  leaveChannelId: "",
  legitCheckChannelId: "",
  panelColor: 0xffff00,
};

function currentGuildId() {
  return context.getStore();
}

function runForGuild(guildId, callback) {
  if (!guildId) {
    throw new Error("Nie można uruchomić obsługi serwera bez identyfikatora serwera.");
  }
  return context.run(guildId, callback);
}

function settingsFile(guildId) {
  return path.join(storageRoot, guildId, "settings.json");
}

function getGuildConfig(guildId = currentGuildId()) {
  if (!guildId) {
    throw new Error("Brak aktywnego kontekstu serwera podczas odczytu ustawień.");
  }

  if (configCache.has(guildId)) return configCache.get(guildId);

  const file = settingsFile(guildId);
  let saved = {};
  if (fs.existsSync(file)) {
    saved = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
      throw new Error(`Nieprawidłowy plik ustawień serwera: ${file}`);
    }
  }

  const config = {
    ...defaults,
    ...saved,
    ticketCategoryIds: { ...defaults.ticketCategoryIds, ...saved.ticketCategoryIds },
    ticketRoleIds: { ...defaults.ticketRoleIds, ...saved.ticketRoleIds },
    serverBrandName: "Krecik Bot",
    panelColor: 0xffff00,
  };
  configCache.set(guildId, config);
  return config;
}

function saveGuildConfig(config, guildId = currentGuildId()) {
  if (!guildId) {
    throw new Error("Brak aktywnego kontekstu serwera podczas zapisu ustawień.");
  }

  const file = settingsFile(guildId);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(config, null, 2));
  configCache.set(guildId, config);
}

function dataPath(filename) {
  const guildId = currentGuildId();
  if (!guildId) {
    throw new Error(`Brak aktywnego kontekstu serwera podczas dostępu do danych ${filename}.`);
  }
  if (path.basename(filename) !== filename) {
    throw new Error("Nieprawidłowa nazwa pliku danych.");
  }

  const directory = path.join(storageRoot, guildId);
  fs.mkdirSync(directory, { recursive: true });
  return path.join(directory, filename);
}

const config = new Proxy({}, {
  get(_target, key) {
    return getGuildConfig()[key];
  },
});

module.exports = {
  config,
  currentGuildId,
  dataPath,
  getGuildConfig,
  runForGuild,
  saveGuildConfig,
};
