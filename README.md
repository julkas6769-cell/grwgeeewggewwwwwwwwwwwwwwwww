# Krecik Bot

Wieloserwerowy bot Discord z ticketami, weryfikacją, powitaniami i pożegnaniami, śledzeniem zaproszeń, opiniami, regulaminem, cennikiem, blacklistą, rozliczeniami, restockami, dropami i konkursami. Dane oraz ustawienia każdego serwera są przechowywane osobno w `data/<ID_SERWERA>/`. Embedy mają żółty kolor. Obrazki można opcjonalnie dołączyć przy publikowaniu panelu.

## Uruchomienie

1. Skopiuj `.env.example` do `.env` i wpisz `DISCORD_TOKEN` oraz `CLIENT_ID` aplikacji Discord.
2. W Discord Developer Portal włącz intenty **Server Members**, **Message Content** i **Message Reactions**.
3. Zainstaluj zależności i zarejestruj globalne komendy:

   ```bash
   npm install
   npm run deploy
   npm start
   ```

Globalne komendy mogą pojawić się na serwerach z opóźnieniem po wdrożeniu. Dodaj bota na serwery ze scope'ami `bot` i `applications.commands` oraz uprawnieniami wymaganymi przez używane funkcje, m.in. zarządzaniem kanałami i rolami, odczytem historii, wysyłaniem wiadomości oraz zarządzaniem zaproszeniami.

## Konfiguracja serwera

Administrator konfiguruje każdy serwer niezależnie:

- `/ustaw-kanal` — kanały powitań, pożegnań, powiadomień o zaproszeniach, logów, regulaminu, opinii, restocków, legit-checków oraz kategorie ticketów.
- `/ustaw-kategorie` — ustawia kategorię ticketów po podaniu jej ID, także gdy Discord nie pokazuje kategorii na liście `/ustaw-kanal`.
- `/ustaw-role` — role supportu, weryfikacji, blacklisty, konkursów, restocków i obsługi poszczególnych typów ticketów.
- `/ustawienia` — podgląd zapisanych ustawień.

W `/ustaw-kanal` wybierz `typ` i wskaż `kanal`; pominięcie `kanal` usuwa wybrane ustawienie. Do kategorii użyj `/ustaw-kategorie typ id`: włącz tryb deweloperski w Discordzie, kliknij prawym przyciskiem kategorię, wybierz **Kopiuj ID**, a następnie wklej ID do komendy. Wybierz typ domyślny lub konkretny typ ticketu. W `/ustaw-role` pominięcie opcji `rola` usuwa to ustawienie. Bot musi mieć odpowiednie uprawnienia, a jego najwyższa rola musi znajdować się nad rolą weryfikacji.

## Panele

Panele można wysyłać komendami slash, m.in. `/ticket-panel`, `/weryfikacja-panel`, `/opinia-panel`, `/drop-panel`, `/legit`, `/panel-rozliczen`, `/regulamin-panel` i `/cennik panel`. Przy publikowaniu tych paneli oraz przy `/konkurs stworz` użyj opcjonalnego pola `obrazek`, aby dołączyć plik PNG, JPG, GIF, WebP lub AVIF. Bez załącznika panel zostanie wysłany bez grafiki. Dodatkowe skróty administracyjne `!hxw1`, `!hxw2`, `!hxw3`, `!legit` i `!regulamin` wymagają włączonego intentu **Message Content**.

Wszystkie dane funkcji — w tym zaproszenia, cenniki, konkursy, blacklisty, salda i dropy — są zapisywane oddzielnie dla każdego serwera w katalogu `data/`.
