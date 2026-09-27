// Ordbank för C-Ord. Orden skrivs med versaler; ledtrådarna går från
// allmän till mer specifik.
export const WORDS = [
  { word: 'KATT', clues: ['Ett djur', 'Kan jama', 'Har fyra ben'] },
  { word: 'SOLEN', clues: ['Syns på dagen', 'Ger ljus', 'Finns på himlen'] },
  { word: 'MÅNEN', clues: ['Syns på natten', 'Rund ibland', 'Kretsar runt jorden'] },

  // Djur
  { word: 'HUND', clues: ['Ett djur', 'Kan skälla', 'Gillar att gå på promenad'] },
  { word: 'KO', clues: ['Ett djur på bondgården', 'Säger mu', 'Ger oss mjölk'] },
  { word: 'HÄST', clues: ['Ett stort djur', 'Man kan rida på den', 'Äter hö'] },
  { word: 'FISK', clues: ['Bor i vattnet', 'Kan simma', 'Har fenor'] },
  { word: 'FÅGEL', clues: ['Ett djur', 'Har fjädrar', 'Kan flyga'] },

  // Väder och natur
  { word: 'REGN', clues: ['Väder', 'Kommer från molnen', 'Gör marken blöt'] },
  { word: 'SNÖ', clues: ['Väder', 'Är vit och kall', 'Man kan bygga gubbar av den'] },
  { word: 'REGNBÅGE', clues: ['Syns på himlen', 'Har många färger', 'Kommer ofta efter regn'] },
  { word: 'TRÄD', clues: ['Växer i skogen', 'Har löv eller barr', 'Fåglar bygger bo i det'] },
  { word: 'BLOMMA', clues: ['Växer i trädgården', 'Kan vara röd eller gul', 'Bina gillar den'] },

  // Mat
  { word: 'ÄPPLE', clues: ['En frukt', 'Kan vara rött eller grönt', 'Växer på träd'] },
  { word: 'BANAN', clues: ['En frukt', 'Är gul', 'Apor gillar den'] },
  { word: 'GLASS', clues: ['Något gott att äta', 'Är kall', 'Äts ofta på sommaren'] },
  { word: 'MJÖLK', clues: ['Något att dricka', 'Är vit', 'Kommer från kon'] },
  { word: 'BRÖD', clues: ['Mat', 'Bakas i ugnen', 'Man brer smör på det'] },

  // Saker hemma
  { word: 'STOL', clues: ['Finns hemma', 'Man sitter på den', 'Har ofta fyra ben'] },
  { word: 'SÄNG', clues: ['Finns hemma', 'Man sover i den', 'Har kudde och täcke'] },
  { word: 'LAMPA', clues: ['Finns hemma', 'Ger ljus', 'Man tänder den när det är mörkt'] },
  { word: 'BOK', clues: ['Har många sidor', 'Man kan läsa den', 'Finns på biblioteket'] },
  { word: 'SKED', clues: ['Finns i köket', 'Man äter soppa med den', 'Ligger bredvid gaffeln'] },
];
