# 🎮 C Games

En liten samling minispel för barn, gjord för att spelas i webbläsaren på en
surfplatta eller telefon. Man tjänar **C Coins 🌙** i spelen och handlar kläder
och accessoarer till sin avatar i shoppen.

## Spelen

| Spel | Så spelar man | Belöning |
|---|---|---|
| 🌋 **Lava** | Styr avataren till ⭐ med pilarna utan att kliva i 🔥. En lava-ruta till för varje vinst. | +8 per vinst |
| 🧱 **Block Blast** | Välj en bit och tryck på brädet för att lägga den. Fyll hela rader eller kolumner för att rensa dem. | +2 per rensad linje, +5 bonus för flera samtidigt |
| 🎯 **Perfect Hit** | Tryck när den blå pricken är mitt i det gröna. Farten ökar för varje perfekt träff. | +15 perfekt, +8 i zonen |
| 🔤 **C-Ord** | Gissa ordet utifrån tre ledtrådar. | +10 per rätt ord |
| 🛍️ **Shop** | Köp hår, tröjor, hattar, glasögon och accessoarer. Det man köper tas på direkt. | – |

Mynt, köpta saker och rekord sparas i webbläsarens `localStorage` på den
enhet man spelar på.

## Kom igång

Kräver [Node.js](https://nodejs.org/) version 20.19+ eller 22.12+.

```bash
npm install && npm run dev
```

Öppna sedan adressen som visas i terminalen (oftast http://localhost:5173).

Övriga kommandon:

```bash
npm run build     # Bygger en produktionsversion till dist/
npm run preview   # Startar en lokal server som visar det byggda dist/
```

## Mappstruktur

```
c-games/
├── index.html            # Appens skal: topprad, meny och innehållsområde
├── vite.config.js        # base: './' så att bygget fungerar i en undermapp
├── public/               # Kopieras rakt in i dist/ (favicon, hemskärmsikon)
└── src/
    ├── main.js           # Startpunkt: kopplar ihop skärmar, router och mynträknare
    ├── router.js         # Hash-routing (#hem, #lava, …) och städning mellan skärmar
    ├── state.js          # Sparad speldata: mynt, avatar, inventory, highscores
    ├── items.js          # Shoppens varor (id, emoji, namn, pris, slot)
    ├── style.css         # All styling
    ├── games/            # Spelregler utan DOM – lätta att testa
    │   ├── lava.js
    │   ├── blockBlast.js
    │   ├── perfectHit.js
    │   ├── cOrd.js
    │   └── cOrdWords.js  # Ordbanken till C-Ord
    └── screens/          # En skärm per route, ritar och hanterar tryck
        ├── home.js
        ├── avatar.js     # Ritar avataren i lager
        ├── shop.js
        ├── lava.js
        ├── blockBlast.js
        ├── perfectHit.js
        └── cOrd.js
```

Varje skärm exporterar en `render…(container)`-funktion. Den kan returnera en
städfunktion som routern kör när man lämnar skärmen (för timers och
tangentbordslyssnare).

## Lägga till fler ord eller varor

- **Ord i C-Ord:** lägg till `{ word: 'ORD', clues: ['…', '…', '…'] }` i
  `src/games/cOrdWords.js`. Ordet skrivs med versaler.
- **Varor i shoppen:** lägg till en rad i `src/items.js`. `slot` ska vara en av
  `hair`, `top`, `hat`, `glasses` eller `accessory`.
