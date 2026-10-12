require("dotenv").config();

const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

function createBlacklistCommand(name) {
  const command = new SlashCommandBuilder()
    .setName(name)
    .setDescription("Zarządza blacklistą Krecik Bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) => {
      subcommand
        .setName("dodaj")
        .setDescription("Dodaje użytkownika na blacklistę.")
        .addUserOption((option) =>
          option
            .setName("osoba")
            .setDescription("Osoba dodawana na blacklistę.")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("powod")
            .setDescription("Powód blacklisty.")
            .setRequired(false),
        );

      for (let index = 1; index <= 5; index += 1) {
        subcommand.addAttachmentOption((option) =>
          option
            .setName(`plik${index}`)
            .setDescription(`Opcjonalny dowód ${index}.`)
            .setRequired(false),
        );
      }

      return subcommand;
    })
    .addSubcommand((subcommand) =>
      subcommand
        .setName("usuń")
        .setDescription("Usuwa użytkownika z blacklisty.")
        .addUserOption((option) =>
          option
            .setName("osoba")
            .setDescription("Osoba usuwana z blacklisty.")
            .setRequired(true),
        ),
    );

  return command;
}

function createCennikCommand() {
  return new SlashCommandBuilder()
    .setName("cennik")
    .setDescription("Zarządza cennikiem Krecik Bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("panel")
        .setDescription("Wysyła panel cennika.")
        .addAttachmentOption((option) =>
          option.setName("obrazek").setDescription("Opcjonalny obrazek panelu.").setRequired(false),
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("dodaj")
        .setDescription("Dodaje nową kategorię do cennika.")
        .addStringOption((option) =>
          option.setName("klucz").setDescription("Identyfikator, np. cennik_robux.").setRequired(true),
        )
        .addStringOption((option) =>
          option.setName("nazwa").setDescription("Nazwa w menu, np. Robux.").setRequired(true),
        )
        .addStringOption((option) =>
          option.setName("tytul").setDescription("Tytuł cennika.").setRequired(true),
        )
        .addStringOption((option) =>
          option.setName("opis").setDescription("Opis w menu.").setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edytuj")
        .setDescription("Edytuje kategorię cennika.")
        .addStringOption((option) =>
          option.setName("klucz").setDescription("Identyfikator kategorii.").setRequired(true),
        )
        .addStringOption((option) =>
          option.setName("tytul").setDescription("Nowy tytuł.").setRequired(false),
        )
        .addStringOption((option) =>
          option.setName("nazwa").setDescription("Nowa nazwa w menu.").setRequired(false),
        )
        .addStringOption((option) =>
          option.setName("opis").setDescription("Nowy opis w menu.").setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("podglad")
        .setDescription("Pokazuje podgląd kategorii cennika.")
        .addStringOption((option) =>
          option.setName("klucz").setDescription("Identyfikator kategorii.").setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("usun")
        .setDescription("Usuwa kategorię z cennika.")
        .addStringOption((option) =>
          option.setName("klucz").setDescription("Identyfikator kategorii.").setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("lista")
        .setDescription("Wyświetla listę kategorii cennika."),
    );
}

function createRozliczeniaCommand() {
  return new SlashCommandBuilder()
    .setName("rozliczenia")
    .setDescription("Liczy zarobki sprzedawców z legit-checków.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((option) =>
      option
        .setName("dni")
        .setDescription("Z ilu ostatnich dni liczyć legit-checki. Domyślnie 7.")
        .setMinValue(1)
        .setMaxValue(90)
        .setRequired(false),
    )
    .addNumberOption((option) =>
      option
        .setName("prowizja")
        .setDescription("Ile procent sprzedawca oddaje Tobie. Domyślnie 15.")
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(false),
    )
    .addUserOption((option) =>
      option
        .setName("sprzedawca")
        .setDescription("Opcjonalnie policz tylko jednego sprzedawcę.")
        .setRequired(false),
    );
}

function createLegitCheckCommand() {
  return new SlashCommandBuilder()
    .setName("lc")
    .setDescription("Tworzy legit-check w aktualnym tickecie.");
}

function createResetSaldoCommand() {
  return new SlashCommandBuilder()
    .setName("reset-saldo")
    .setDescription("Resetuje saldo rozliczeń sprzedawców.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) =>
      option
        .setName("sprzedawca")
        .setDescription("Opcjonalnie zresetuj saldo tylko jednej osoby.")
        .setRequired(false),
    );
}

function createSettlementPanelCommand() {
  return new SlashCommandBuilder()
    .setName("panel-rozliczen")
    .setDescription("Wysyła panel rozliczeń dla sprzedawców Krecik Bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addAttachmentOption((option) =>
      option.setName("obrazek").setDescription("Opcjonalny obrazek panelu.").setRequired(false),
    );
}

function createRulesPanelCommand() {
  return new SlashCommandBuilder()
    .setName("regulamin-panel")
    .setDescription("Wysyła panel regulaminu Krecik Bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addAttachmentOption((option) =>
      option.setName("obrazek").setDescription("Opcjonalny obrazek panelu.").setRequired(false),
    );
}

function createChannelSettingsCommand() {
  const choices = [
    ["powitania", "Kanał powitań"],
    ["pozegnania", "Kanał pożegnań"],
    ["zaproszenia", "Powiadomienia o zaproszeniach"],
    ["logi", "Logi ticketów"],
    ["regulamin", "Kanał regulaminu"],
    ["problemy-regulamin", "Pytania o regulamin"],
    ["opinie", "Licznik opinii"],
    ["licznik-reakcji", "Licznik reakcji"],
    ["restock", "Ogłoszenia restock"],
    ["zamowienia", "Zamówienia restock"],
    ["legit-checki", "Kanał legit-checków"],
    ["kategoria-ticketow", "Domyślna kategoria ticketów"],
    ["kategoria-zakup", "Kategoria ticketów: zakup"],
    ["kategoria-partnerstwo", "Kategoria ticketów: partnerstwo"],
    ["kategoria-middleman", "Kategoria ticketów: middleman"],
    ["kategoria-pomoc", "Kategoria ticketów: pomoc"],
    ["kategoria-reklamacja", "Kategoria ticketów: reklamacja"],
    ["kategoria-oszust", "Kategoria ticketów: zgłoszenie oszustwa"],
  ];

  return new SlashCommandBuilder()
    .setName("ustaw-kanal")
    .setDescription("Ustawia kanały używane przez Krecik Bot na tym serwerze.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("typ")
        .setDescription("Funkcja, dla której ustawiasz kanał.")
        .setRequired(true)
        .addChoices(...choices.map(([value, name]) => ({ name, value }))),
    )
    .addChannelOption((option) =>
      option
        .setName("kanal")
        .setDescription("Kanał lub kategoria; pomiń, aby usunąć ustawienie.")
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.GuildCategory),
    );
}

function createCategorySettingsCommand() {
  const choices = [
    ["kategoria-ticketow", "Domyślna kategoria ticketów"],
    ["kategoria-zakup", "Kategoria ticketów: zakup"],
    ["kategoria-partnerstwo", "Kategoria ticketów: partnerstwo"],
    ["kategoria-middleman", "Kategoria ticketów: middleman"],
    ["kategoria-pomoc", "Kategoria ticketów: pomoc"],
    ["kategoria-reklamacja", "Kategoria ticketów: reklamacja"],
    ["kategoria-oszust", "Kategoria ticketów: zgłoszenie oszustwa"],
  ];

  return new SlashCommandBuilder()
    .setName("ustaw-kategorie")
    .setDescription("Ustawia kategorię ticketów, podając jej ID.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("typ")
        .setDescription("Wybierz domyślną kategorię lub kategorię typu ticketu.")
        .setRequired(true)
        .addChoices(...choices.map(([value, name]) => ({ name, value }))),
    )
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("ID kategorii na tym serwerze.")
        .setRequired(true),
    );
}

function createRoleSettingsCommand() {
  const choices = [
    ["support", "Rola supportu"],
    ["weryfikacja", "Rola nadawana po weryfikacji"],
    ["blacklist", "Rola blacklisty"],
    ["konkursy", "Zarządzanie konkursami"],
    ["restock", "Powiadomienia restock"],
    ["ticket-zakup", "Obsługa ticketów: zakup"],
    ["ticket-partnerstwo", "Obsługa ticketów: partnerstwo"],
    ["ticket-middleman", "Obsługa ticketów: middleman"],
    ["ticket-pomoc", "Obsługa ticketów: pomoc"],
    ["ticket-reklamacja", "Obsługa ticketów: reklamacja"],
    ["ticket-oszust", "Obsługa ticketów: zgłoszenie oszustwa"],
  ];

  return new SlashCommandBuilder()
    .setName("ustaw-role")
    .setDescription("Ustawia role używane przez Krecik Bot na tym serwerze.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("typ")
        .setDescription("Funkcja, dla której ustawiasz rolę.")
        .setRequired(true)
        .addChoices(...choices.map(([value, name]) => ({ name, value }))),
    )
    .addRoleOption((option) =>
      option
        .setName("rola")
        .setDescription("Rola; pomiń, aby usunąć ustawienie.")
        .setRequired(false),
    );
}

function createSettingsOverviewCommand() {
  return new SlashCommandBuilder()
    .setName("ustawienia")
    .setDescription("Pokazuje konfigurację Krecik Bot na tym serwerze.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
}

function createPanelCommand(name, description) {
  return new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addAttachmentOption((option) =>
      option.setName("obrazek").setDescription("Opcjonalny obrazek panelu.").setRequired(false),
    );
}

function createGiveawayCommand() {
  return new SlashCommandBuilder()
    .setName("konkurs")
    .setDescription("Zarządza konkursami Krecik Bot.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("stworz")
        .setDescription("Tworzy panel konkursu.")
        .addStringOption((option) =>
          option
            .setName("nagroda")
            .setDescription("Nagroda w konkursie.")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("zwyciezcy")
            .setDescription("Liczba zwyciezcow.")
            .setMinValue(1)
            .setMaxValue(20)
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("czas")
            .setDescription("Czas trwania, np. 30m, 2h, 1d.")
            .setRequired(true),
        )
        .addAttachmentOption((option) =>
          option.setName("obrazek").setDescription("Opcjonalny obrazek konkursu.").setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reroll")
        .setDescription("Losuje ponownie zwycięzców zakończonego konkursu.")
        .addStringOption((option) =>
          option
            .setName("id-wiadomosci")
            .setDescription("ID wiadomości konkursu.")
            .setRequired(true),
        ),
    );
}

const commands = [
  new SlashCommandBuilder()
    .setName("ticket-panel")
    .setDescription("Wysyła panel ticketów Krecik Bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addAttachmentOption((option) =>
      option.setName("obrazek").setDescription("Opcjonalny obrazek panelu.").setRequired(false),
    ),
  new SlashCommandBuilder()
    .setName("drop-panel")
    .setDescription("Wysyła panel dropów Krecik Bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addAttachmentOption((option) =>
      option.setName("obrazek").setDescription("Opcjonalny obrazek panelu.").setRequired(false),
    ),
  createChannelSettingsCommand(),
  createCategorySettingsCommand(),
  createRoleSettingsCommand(),
  createSettingsOverviewCommand(),
  createPanelCommand("weryfikacja-panel", "Wysyła panel weryfikacji Krecik Bot."),
  createPanelCommand("opinia-panel", "Wysyła panel opinii Krecik Bot."),
  createGiveawayCommand(),
  new SlashCommandBuilder()
    .setName("zapro")
    .setDescription("Pokazuje statystyki zaproszeń.")
    .addUserOption((option) =>
      option
        .setName("uzytkownik")
        .setDescription("Osoba, której zaproszenia chcesz sprawdzić.")
        .setRequired(false),
    ),
  new SlashCommandBuilder()
    .setName("legit")
    .setDescription("Wysyła panel reakcji legit Krecik Bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addAttachmentOption((option) =>
      option.setName("obrazek").setDescription("Opcjonalny obrazek panelu.").setRequired(false),
    ),
  createBlacklistCommand("blacklista"),
  createBlacklistCommand("bl"),
  createCennikCommand(),
  createRozliczeniaCommand(),
  createSettlementPanelCommand(),
  createRulesPanelCommand(),
  createLegitCheckCommand(),
  createResetSaldoCommand(),
  new SlashCommandBuilder()
    .setName("close")
    .setDescription("Zamyka aktualny ticket i wysyla transkrypt na logi."),
  new SlashCommandBuilder()
    .setName("claim")
    .setDescription("Przejmuje aktualny ticket jako support."),
].map((command) => command.toJSON());

async function main() {
  const { DISCORD_TOKEN, CLIENT_ID } = process.env;

  if (!DISCORD_TOKEN || !CLIENT_ID) {
    throw new Error("Uzupełnij DISCORD_TOKEN i CLIENT_ID w pliku .env.");
  }

  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

  console.log(`Zarejestrowano ${commands.length} globalnych komend dla serwerów bota.`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { commands };
