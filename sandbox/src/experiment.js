import * as s from "nspect";
import * as p from "./preds";
import { attribute } from "./attributeSpec";

// const isAnswer = (x, getFrom) => {
//   const answer = getFrom("../answer");
//   return x === answer || `n'est pas la réponse (${answer})`;
// };

// const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

// const isTHEAnswer = async (x) => {
//   // console.log("Check isTHEAnswer");
//   await sleep(0);
//   const ansToTheUniverse = 42;
//   return x === ansToTheUniverse || "n'est pas LA réponse à l'Univers";
// };

const spec = s.spread(
  s.key((k) => k.length > 3 || "nom doit avoir plus de trois caractères"),
  {}
);
let value = { foo2: "bar" };

// const spec = attribute;

// let value = {
//   _id: "QX3sfTebY3HMcSRNT",
//   name: "Client",
//   abbr: "cli",
//   type: "STRING",
//   allowInput: false,
//   defaultValue: null,
//   choicesSort: {
//     by: "value",
//     direction: 1,
//   },
//   choices: [
//     {
//       _id: "Z4BgPWtnqAuPF9Puh",
//       value: "A.M MIDATECH, Sherbrooke",
//       nomenclatureValue: "",
//     },
//     {
//       _id: "8WBTwdYQAbnE2G7xv",
//       value: "ABB, Bromont",
//       nomenclatureValue: "",
//     },
//     {
//       _id: "g7Arxatk8a7zG87mk",
//       value: "ABS REMORQUES, Val-des-Sources",
//       nomenclatureValue: "",
//     },
//     // {
//     //   _id: "GjYzaBxtuDHWMLEbP",
//     //   value: "AGRILAIT, St-Guillaume",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "GGCiNENDGE2rCWSLQ",
//     //   value: "AGT ROBOTICS, Trois-Rivières",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "ZADHkw9K8NfaogcDv",
//     //   value: "AKZONOBEL, Warwick",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "m4r3r4dP4h9i55u9y",
//     //   value: "ALDES CANADA, St-Léonard-d'Aston",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "o9RZ48ipAhNDYMuwk",
//     //   value: "ALIMENTS TRANS-GRAS, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "9Q9dZmf7mAqPCSWef",
//     //   value: "ALUPRO, Ste-Julie",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "rgLxYKkFZNwz4Eeep",
//     //   value: "AMBRA, Trois-Rivières",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "Sbjz5DgKiScHZaNfT",
//     //   value: "ANDERSON GROUP",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "NpLWrGfNt9DXFKxwH",
//     //   value: "ARDOBEC, Val-des-Sources",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "pfvGSYgGTyyaggXuf",
//     //   value: "ASTOR, Laval",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "HK6Jow4vJ3jHgMyXr",
//     //   value: "ATC, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "2z2mEmWN9QQpTprsL",
//     //   value: "ATELIER BELANGER, Magog",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "sdsjXkbcpkagpSBe6",
//     //   value: "ATLANTIC COATED PAPERS, Windsor",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "CoNTw74QcWfuM95zw",
//     //   value: "AXIAL, Val-des-Sources",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "Dy9s5sPNvSQhkeEyX",
//     //   value: "BCI, La Guadeloupe",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "YPgjbkYqFAj7Nqwyx",
//     //   value: "BEAUBOIS, St-Georges",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "prMWGzLgGhcxDnGxa",
//     //   value: "BEAUCHEMIN INDUSTRIEL, Danville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "4kChEoPgdsoJtYAmj",
//     //   value: "BEAULIEU REVETEMENT, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "z2FZ64XhibpnsHBhw",
//     //   value: "BETON PROVINCIAL, Trois-Rivières",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "sfFyjnPLQXCBNfiYv",
//     //   value: "BOMBARDIER, Valcourt",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "QKxstcGqMTSugTNh8",
//     //   value: "BULL'S HEAD, Richmond",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "sEZJaMZRQww8c3zeP",
//     //   value: "CADORETTE, Granby",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "ZExAAikQ4a6cDhH59",
//     //   value: "CALIMACIL, Sherbrooke",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "z5eavPBNYXHR8FomG",
//     //   value: "CAMIONS LUSSIER-LUSSICAM, Sainte-Julie",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "4ZyydJKT6c7CHzr7E",
//     //   value: "CAN AM, Wickham",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "wAexSepodN5cca8Gk",
//     //   value: "CAN-AQUA, Laval",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "BrbbqeeLj7exFwNMP",
//     //   value: "CANCAD AND ASSOCIATES INC.",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "wcSqpnZ38DeP7aytu",
//     //   value: "CANLAK, Daveluyville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "dq4AtP7vKEfJJhuoJ",
//     //   value: "CAOUTCHOUC PRO-FLEX, St-Alphonse-de-Granby",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "eNYwt6m9trG9DTJNi",
//     //   value: "CASCADES CIP, Kingsey Falls",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "vebyuCd5iW6aBb2tu",
//     //   value: "CASCADES FORMAT-PAK, Kingsey Falls",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "jHP5FEff2qe2ikKxS",
//     //   value: "CASCADES INOPAK",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "7ogsGzXXy2AaY3we8",
//     //   value: "CASCADES MULTI-PRO, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "6ynWL3w828ZDYPDjb",
//     //   value: "CASCADES PLASTIQUE, Kingsey Falls",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "rHfCCzvNfbdgvamHR",
//     //   value: "CASCADES SONOCO, Berthier",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "nyXQiaym24k8BJ2xo",
//     //   value: "CASCADES SONOCO, Kingsey Falls",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "ituKQdQMwKrodrDTs",
//     //   value: "CIMENT RO-NO, Victoriaville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "SsHK88NfXYSDrN8B2",
//     //   value: "COLONIAL ÉLÉGANCE, Montréal",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "pRbdbEAosfutvARGN",
//     //   value: "COMPOSITE BHS, Sherbrooke",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "jEeuGikgJWZFKJ3rR",
//     //   value: "COOPER STANDARD, Sherbrooke",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "jTt7yR3pPwZ5rbPHZ",
//     //   value: "COURTVAL, Valcourt",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "zAtkNCyyuqAsneDnK",
//     //   value: "COUTURE & TURCOTTE",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "aFnW7vMHT3uMT6pbr",
//     //   value: "Cascades Papier Kingsey Falls",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "A4aNxjCpGttDu4MTw",
//     //   value: "DANA, Laval",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "q457xQz4EJ9hCwQjf",
//     //   value: "ECO-PAK, Valcourt",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "eXgCKWEH9WH3EyYQd",
//     //   value: "EDDYNET, St-Rémi-de-Tingwick",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "qkJWCT4uLaWhxQKvm",
//     //   value: "EMB, Québec",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "ThHLsDMFcaMZ7ojX9",
//     //   value: "ENOCAPSULE, Vaudreuil-Dorion",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "DjhmWZPcNdwWtw8Lh",
//     //   value: "ENTREPRISES CIRCÉ, Delson",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "jbGn4AftgFiELhL3b",
//     //   value: "EQUIPEMENTS SAGUENAY, Saguenay",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "sNZHK8d2J8XSgtNPt",
//     //   value: "ERABLIERE DES CHUTES",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "vQwzwWgsGE6dZSSrN",
//     //   value: "ESA, Sherbrooke",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "nSuQYaAx9GH5vFRwP",
//     //   value: "EUROSTYLE, Bromont",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "psNMGAuLaj3D2HiZv",
//     //   value: "EVERA, Montréal",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "YiLCas8b9ztga6t5v",
//     //   value: "FAB PSI, Windsor",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "MzhbP5gjN4XBot4nQ",
//     //   value: "FABPLUS, Warwick",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "2H4fT3aKn5hu5fFZq",
//     //   value: "FENETRE FORM-TECH, St-Rosaire",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "to5RNihoYQJ5Tr8cf",
//     //   value: "FORTIER 2000, St-Henri",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "b3XfYD9wDjsEzxivm",
//     //   value: "FROMAGES LATINO",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "NY87RWFZkdHA6TMva",
//     //   value: "GABION EXPRESS, Vallée-Jonction",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "9KXXfnv8aosjLxPKc",
//     //   value: "GAUTHIER CHARIOT ELEVATEUR, Warwick",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "WDmmm8w3btKgXa53v",
//     //   value: "GENYK, Shawinigan",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "ucexseZh4bETLL2Da",
//     //   value: "GIANT, Montréal",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "tQmdEgJ9uJ9KpoYKG",
//     //   value: "GLASS & MIRROR, Montréal",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "nGrr2nR8wTgygmnP7",
//     //   value: "GROUPE AXESS, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "Z4jtHLqs8qD9LWfbx",
//     //   value: "GROUPE CÔTÉ INOX, St-Lazare",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "kyW2dSa6v6863FWBq",
//     //   value: "GROUPE MBM, Acton Vale",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "HEs5nWxZjuHyXoagP",
//     //   value: "HERSHEY, Granby",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "nFHCzjwfykezaAJkM",
//     //   value: "IMPRIMERIE DOMINION, St-Hyacinthe",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "hEtaGyJLdDErSdDug",
//     //   value: "INDUSTRIE 3R, Danville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "kqmCmojB3FsgTfrmt",
//     //   value: "INDUSTRIES PRO-TAC, St-Célestin",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "SzufLmHJWxL79TsS6",
//     //   value: "INNOTEX, Richmond",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "Cqf4KugSLQs9GwgAg",
//     //   value: "INNOVAPLAS, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "Hz52GkkLsFqfutprc",
//     //   value: "INNOVATION M2, Lévis",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "JSwisgJ476xnmaZZq",
//     //   value: "INOX CONCEPT ESTRIE, Sherbrooke",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "iwFhzyyMhGJHZwgGa",
//     //   value: "INTROPAK, Sherbrooke",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "EY8y9G53jL2qgnRuK",
//     //   value: "ISE METAL, Windsor",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "25C9ejCEmRcoisv8u",
//     //   value: "JARDINS HATLEY",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "4wkMbQRtJGmriWbQc",
//     //   value: "JP METAL, QUÉBEC",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "8qJbpn6JYrsuyYGyy",
//     //   value: "JPS ÉLECTRONIQUE, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "CPJzNXcMRG7bAy8J5",
//     //   value: "KIMPEX, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "v2XbPEWSJqzFECYvx",
//     //   value: "LAURENTIDE RE/SOURCES, Victoriaville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "RNFiMFvDZsjB8atFe",
//     //   value: "LCN, St-Félix-de-Kingsey",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "LGuh3EFsQm5aiA7s7",
//     //   value: "LES PRODUITS THERMO CONCEPTS",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "GeoGdRM9qXqrGQyo4",
//     //   value: "LIPPERT PINTLEPIN, Sherbrooke",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "K9s4zAs36pb7mQXGH",
//     //   value: "LOGISTEC ARRIMAGE (Mtllink), Montréal",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "P8aMibYoh2uLAWmD4",
//     //   value: "LOOP CANADA, Terrebonne",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "xjzgRzzGQubDkaRg9",
//     //   value: "LÜ, Québec",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "KQ8BKcLZgN4tYTums",
//     //   value: "MAC METAL, Beloeil",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "e8Q3PKqnNbcbFGioM",
//     //   value: "MACHINERIES PRONOVOST, Saint-Tite",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "YsXWYCPFNcs9mudAS",
//     //   value: "MANUNOR, Sherbrooke",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "N3BQNsXizd3yiWGWv",
//     //   value: "MATREX, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "dznPKHAnx5TW8cZPi",
//     //   value: "MEDIATECH, Laval",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "4ynRijy2scJWMopDx",
//     //   value: "MEKANIKA, Ste-Marie-de-Beauce",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "Rq44ehLpwTE7gLuXz",
//     //   value: "MEUNERIE DUCHARME, St-Albert",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "aowpFXn32MSiCHSdv",
//     //   value: "MIRAZED, St-Hubert",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "WvCmBxidWcFNLwT4k",
//     //   value: "MMS LASER, Victoriaville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "c8pcmSwojPQEDZZXx",
//     //   value: "MÉTOSAK, Sherbrooke",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "72HyMAaQDr99XAG6R",
//     //   value: "NATURE FIBRES, Val-des-Sources",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "uwrHZZiucAHWLiQ3w",
//     //   value: "NORAMPAC Kingsey Falls",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "3kfCizLz2zSaZpLHc",
//     //   value: "NORDESCO, Montréal",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "KJDScyQib7YqxTGq2",
//     //   value: "NUTRI-OEUF, Ste-Hyacinthe",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "Z49cwAkJFDMjd3rK2",
//     //   value: "OPD, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "gQXypdKRaMBNZo26N",
//     //   value: "ORTHOCANADA, Gatineau",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "aX5R5QpvtPur9CRRS",
//     //   value: "PALETTES RESSOURCES",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "pDg5PpgEZcrmihP6r",
//     //   value: "PCS, Sherbrooke",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "k7gMfbXFAFPvjmyS3",
//     //   value: "PLACAGE LIGNUM, Victoriaville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "FHNyQW9Rw9TyLRKcA",
//     //   value: "PLASTIK MP, Richmond",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "6oNECqvSBmAHFESHN",
//     //   value: "PLASTITEL, Laval",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "xrz6BgCpm9mZQTKA4",
//     //   value: "PLIAGES APAULO, Waterville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "z8DNiqbDX3coxYb56",
//     //   value: "POWERFLOW, Magog",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "E2itofKNtdrqnri95",
//     //   value: "PREMIX GOLIATH, Saint-Elzéar",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "PkW4sjuYdTcD7vNeZ",
//     //   value: "PROAMPAC, Richmond",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "Sz6aKaAAgdXTkRunk",
//     //   value: "PRODUITS HÉVÉA, Richmond",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "ezW7MJYkYCeA7oNaa",
//     //   value: "RECYC PHP INC.",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "6LhYMXnmiB6atYQmD",
//     //   value: "RELIEF DESIGN, St-Louis-de-Blanford",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "L9BSbKyprTtt6JMEZ",
//     //   value: "REPARATEC DESIGN, Boucherville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "tAe4dhj4JhRcxMEDn",
//     //   value: "RÉNO DIRECT, Laval",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "Fiduz3hYPAxQrxaPv",
//     //   value: "SAIRA CANADA, Brossard",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "dJ7vLd2fEJniwhR6h",
//     //   value: "SAMAN, Victoriaville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "FefdJZv5C4SDJuB9H",
//     //   value: "SIEMENS, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "xLjwjjSbDt2jWBsgp",
//     //   value: "SIGNE HURTUBISE, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "QEYMj7p4WgjZB8j6W",
//     //   value: "SIXPRO, St-Clothilde-de-Horton",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "t8Fznnr6Hb8srgLmh",
//     //   value: "SODEL, St-Laurent",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "e5PQP2KDPv3kKXRiD",
//     //   value: "SOFT TEX PILLOWS, Magog",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "aii4qiSRJoxDHLNkn",
//     //   value: "SOUCY BARON, St-Jérôme",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "8os7rHPb95MaX7uFA",
//     //   value: "SOUCY BELGEN, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "ckwweDTT7cDtSd4BK",
//     //   value: "SOUCY CAOUTCHOUC, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "tqJXdScwMApNP6FF3",
//     //   value: "SOUCY INTERNATIONAL, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "yYkiKCyDZf4Ag8XqR",
//     //   value: "SOUCY PLASTIQUE, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "AkkzccK3j3F6D2r6S",
//     //   value: "SOUCY RIVALAIR, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "auyCYc88QTsDC2tTr",
//     //   value: "SPECVALVE, Val-des-Sources",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "gGxv8hGn2ByvhQvPx",
//     //   value: "SPICERS, Vaughan",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "6bkyruXc8NNyv5LMT",
//     //   value: "Scholer Industriel, Magog",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "xkSqTqpksyas6HwEQ",
//     //   value: "SÉCURIFORT, Tingwick",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "oKJHxrdRHsi9G5crG",
//     //   value: "TEAMCO, Warwick",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "XuRWcSr6icnQFxHtu",
//     //   value: "TERGEO, Danville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "tYK6dxAc4FsN6ywiG",
//     //   value: "THE COLOR GROUP, Sherbrooke",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "uf9ri55mEBxbpczty",
//     //   value: "TTI, Longueuil",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "NiPfEm9cJMyHEaJMw",
//     //   value: "Tables Modulaires Positionnelles, Drummondville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "n4cq6LGLCMCTrhHen",
//     //   value: "USINAGE PRO 24",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "DAEzdFTT2dLaLLF8v",
//     //   value: "USINAGE TIFO, Shawinigan",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "N3i34QWeZqzp5GoPj",
//     //   value: "VALMETAL, St-François-Xavier",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "eHcTSaiuWXeMENnsJ",
//     //   value: "WATERVILLE TG, Waterville",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "cqng6keqdCrN4dQYi",
//     //   value: "WETSTYLE MANUFACTURING, Beloeil",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "EkKHPCD4cWmwpPZ4g",
//     //   value: "Test de David",
//     //   nomenclatureValue: "",
//     // },
//     // {
//     //   _id: "cMn6wChrjW4vJLddd",
//     //   value: "Test 2 de David",
//     //   nomenclatureValue: "",
//     // },
//   ],
// };

s.check({
  // ensure: { defaultValue: 1 },
  // required: { choicesSort: s.opt({ by: 1 }) },
  // selection: { choices: 1 },
  spec,
  stopEarly: false,
  value,
})
  .then(console.log)
  .catch((res) => console.warn("An error occurred:", res));
