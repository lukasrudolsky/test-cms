# Telegram CMS

Web bere texty a volitelne obrazky z `content/site-content.json`.
Telegram webhook je na `/api/telegram`.

## Env promenne

```bash
TELEGRAM_BOT_TOKEN=123456:...
TELEGRAM_ALLOWED_CHAT_ID=123456789
TELEGRAM_WEBHOOK_SECRET=nahodny-tajny-retezec
```

`TELEGRAM_ALLOWED_CHAT_ID` zjistis tak, ze docasne napises botovi a podivas se na update pres Telegram API, nebo mi ho posles a dopojim to.

## Nastaveni webhooku

Po nasazeni webu na verejnou URL:

```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -d "url=https://tvoje-domena.cz/api/telegram" \
  -d "secret_token=$TELEGRAM_WEBHOOK_SECRET"
```

Pro lokalni test je potreba tunel typu ngrok/cloudflared na `localhost:3001`.

## Prikazy v Telegramu

```text
/fields
/get hero.title
/set hero.title Novy headline
/set hero.title Radek 1\nRadek 2
/set nav.links Features|For Devs|Platform|Usecases|Pricing
/image images.hero https://example.com/hero.webp
/image images.connectScreen https://example.com/screen.png
```

Zmeny se zapisou do `content/site-content.json` a homepage se hned revaliduje.
