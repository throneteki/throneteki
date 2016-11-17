// // 01014 - Jousting Contest
// class JoustingContest {
//     constructor(player) {
//         this.player = player;
//         this.beforeChallengerSelected = this.beforeChallengerSelected.bind(this);
//     }

//     beforeChallengerSelected(game, player, card) {
//         if(player.cardsInChallenge.length !== 0 && !_.any(player.cardsInChallenge, c => {
//             return c.card.uuid === card.card.uuid;
//         })) {
//             game.canAddToChallenge = false;
//         }
//     }
// }
// plots['01014'] = {
//     register(game, player) {
//         var plot = new JoustingContest(player);

//         game.playerPlots[player.id] = plot;
//         game.on('beforeChallengerSelected', plot.beforeChallengerSelected);
//     },
//     unregister(game, player) {
//         game.removeListener('beforeChallengerSelected', game.playerPlots[player.id].beforeChallengerSelected);
//     }
// };

// // 01015 - Marched To The Wall
// class MarchedToTheWall {
//     constructor(player) {
//         this.player = player;
//         this.revealed = this.revealed.bind(this);
//         this.cardClicked = this.cardClicked.bind(this);
//         this.doneClicked = this.doneClicked.bind(this);
//     }

//     revealed(game, player) {
//         if(this.player !== player) {
//             return;
//         }

//         _.each(game.getPlayers(), p => {
//             p.menuTitle = 'Select a character to discard';
//             p.buttons = [
//                 { command: 'custom', text: 'Done', arg: '01015done' }
//             ];
//         });

//         game.pauseForPlot = true;
//         this.waitingForClick = true;
//         this.cardDiscarded = false;
//         _.each(game.getPlayers(), p => {
//             p.doneDiscard = false;
//         });
//     }

//     cardClicked(game, player, clicked) {
//         if(player.doneDiscard || !this.waitingForClick) {
//             return;
//         }

//         if(clicked.type_code !== 'character') {
//             return;
//         }

//         if(!_.any(player.cardsInPlay, card => {
//             return card.card.uuid === clicked.uuid;
//         })) {
//             return;
//         }

//         game.addMessage(player.name + ' discards ' + clicked.label);

//         player.discardCard(clicked, player.discardPile);
//         player.doneDiscard = true;

//         var stillToDiscard = _.find(game.getPlayers(), p => {
//             return !p.doneDiscard;
//         });

//         if(!stillToDiscard) {
//             this.waitingForClick = false;
//             game.playerRevealDone(player);
//         } else {
//             player.menuTitle = 'Waiting for oppoent to apply plot effect';
//             player.buttons = [];
//         }
//     }

//     doneClicked(game, player, arg) {
//         if(arg !== '01015done') {
//             return;
//         }

//         player.doneDiscard = true;

//         var stillToDiscard = _.find(game.getPlayers(), p => {
//             return !p.doneDiscard;
//         });

//         if(!stillToDiscard) {
//             this.waitingForClick = false;
//             if(!player.plotRevealed) {
//                 var otherPlayer = game.getOtherPlayer(player);

//                 if(otherPlayer) {
//                     game.playerRevealDone(otherPlayer);
//                 }
//             } else {
//                 game.playerRevealDone(player);
//             }
//         } else {
//             player.menuTitle = 'Waiting for oppoent to apply plot effect';
//             player.buttons = [];
//         }
//     }
// }
// plots['01015'] = {
//     register(game, player) {
//         var plot = new MarchedToTheWall(player);

//         game.playerPlots[player.id] = plot;

//         game.on('whenRevealed', plot.revealed);
//         game.on('cardClicked', plot.cardClicked);
//         game.on('customCommand', plot.doneClicked);
//     },
//     unregister(game, player) {
//         var plot = game.playerPlots[player.id];

//         game.removeListener('whenRevealed', plot.revealed);
//         game.removeListener('cardClicked', plot.cardClicked);
//         game.removeListener('customCommand', plot.doneClicked);
//     }
// };

// // 01016 - Marching Orders
// class MarchingOrders {
//     constructor(player) {
//         this.player = player;
//         this.beforeCardPlayed = this.beforeCardPlayed.bind(this);
//     }

//     beforeCardPlayed(game, player, card) {
//         if(this.player !== player) {
//             return;
//         }

//         if(card.type_code === 'event' || card.type_code === 'attachment' || card.type_code === 'location') {
//             game.stopCardPlay = true;
//         }
//     }
// }
// plots['01016'] = {
//     register(game, player) {
//         var plot = new MarchingOrders(player);

//         game.playerPlots[player.id] = plot;
//         game.on('beforeCardPlayed', plot.beforeCardPlayed);
//     },
//     unregister(game, player) {
//         game.removeListener('beforeCardPlayed', game.playerPlots[player.id].beforeCardPlayed);
//     }
// };

// // 01017 - Naval Superiority
// class NavalSuperority {
//     constructor(player) {
//         this.player = player;
//         this.beginMarshal = this.beginMarshal.bind(this);
//     }

//     cleanup() {
//         if(this.plot) {
//             this.plot = this.plotGold;
//             this.plot = undefined;
//             this.plotGold = undefined;
//         }
//     }

//     beginMarshal(game, player) {
//         if(this.player !== player) {
//             return;
//         }

//         var otherPlayer = game.getOtherPlayer(player);

//         if(!otherPlayer) {
//             return;
//         }

//         if(hasTrait(otherPlayer.activePlot.card, 'Kingdom') || hasTrait(otherPlayer.activePlot.card, 'Edict')) {
//             this.plot = otherPlayer.activePlot;
//             this.plotGold = otherPlayer.activePlot.gold;
//             otherPlayer.activePlot.card.income = 0;

//             game.addMessage(player.name + ' uses ' + player.activePlot.card.label + ' to reduce the gold value of '
//                 + otherPlayer.activePlot.card.label + ' to 0');
//         }
//     }
// }
// plots['01017'] = {
//     register(game, player) {
//         var plot = new NavalSuperority(player);

//         game.playerPlots[player.id] = plot;
//         game.on('beginMarshal', plot.beginMarshal);
//     },
//     unregister(game, player) {
//         var plot = game.playerPlots[player.id];

//         game.removeListener('beginMarshal', plot.beginMarshal);
//     }
// };

// // 01021 - Sneak Attack
// class SneakAttack {
//     constructor(player) {
//         this.player = player;
//         this.revealed = this.revealed.bind(this);
//     }

//     revealed(game, player) {
//         if(player !== this.player) {
//             return;
//         }

//         player.challenges.maxTotal = 1;

//         game.addMessage(player.name + ' uses ' + player.activePlot.card.label +
//             ' to make the maximum number of challenges able to be initiated by ' + player.name + ' this round be 1');
//     }
// }
// plots['01021'] = {
//     register(game, player) {
//         var plot = new SneakAttack(player);

//         game.playerPlots[player.id] = plot;
//         game.on('plotRevealed', plot.revealed);
//     },
//     unregister(game, player) {
//         game.removeListener('plotRevealed', game.playerPlots[player.id].revealed);
//     }
// };

// // 01022 - Summons
// class Summons {
//     constructor(player) {
//         this.player = player;
//         this.revealed = this.revealed.bind(this);
//         this.cardSelected = this.cardSelected.bind(this);
//     }

//     revealed(game, player) {
//         if(this.player !== player) {
//             return;
//         }

//         var characters = player.searchDrawDeck(10, card => {
//             return card.type_code === 'character';
//         });

//         var buttons = _.map(characters, card => {
//             return { text: card.label, command: 'custom', arg: card.uuid };
//         });

//         buttons.push({ text: 'Done', command: 'custom', arg: 'done' });

//         player.buttons = buttons;
//         player.menuTitle = 'Select a card to add to your hand';

//         game.pauseForPlot = true;
//     }

//     cardSelected(game, player, arg) {
//         if(this.player !== player) {
//             return;
//         }

//         if(arg === 'done') {
//             game.playerRevealDone(player);
//         }

//         var card = player.findCardByUuid(player.drawDeck, arg);

//         if(!card) {
//             return;
//         }

//         player.moveFromDrawDeckToHand(card);
//         player.shuffleDrawDeck();

//         game.addMessage(player.name + ' uses ' + player.activePlot.card.label + ' to reveal ' + card.label + ' and add it to their hand');

//         game.playerRevealDone(player);
//     }
// }
// plots['01022'] = {
//     register(game, player) {
//         var plot = new Summons(player);

//         game.playerPlots[player.id] = plot;
//         game.on('whenRevealed', plot.revealed);
//         game.on('customCommand', plot.cardSelected);
//     },
//     unregister(game, player) {
//         var plot = game.playerPlots[player.id];
//         game.removeListener('whenRevealed', plot.revealed);
//         game.removeListener('customCommand', plot.cardSelected);
//     }
// };
// // 03049 - The Long Winter
// class TheLongWinter {
//     constructor(player) {
//         this.player = player;
//         this.revealed = this.revealed.bind(this);
//         this.cardSelected = this.cardSelected.bind(this);
//         this.waitingForPlayers = {};
//     }

//     revealed(game, player) {
//         if(this.player !== player) {
//             return;
//         }

//         var anySummerPlots = false;

//         _.each(game.getPlayers(), p => {
//             if(!hasTrait(p.activePlot.card, 'Summer') && p.getTotalPower() > 0) {
//                 if(!_.any(p.cardsInPlay, card => {
//                     return card.power > 0;
//                 })) {
//                     game.addMessage(p.name + ' discards 1 power from their faction card from ' + player.activePlot.card.label);
//                     p.power--;
//                 } else {
//                     p.menuTitle = 'Select a card to discard power from';
//                     p.buttons = [
//                         { command: 'custom', text: 'Done', arg: '03049' }
//                     ];

//                     this.waitingForPlayers[p.id] = p;

//                     anySummerPlots = true;
//                 }
//             }
//         });

//         if(anySummerPlots) {
//             game.pauseForPlot = true;
//         }
//     }

//     cardSelected(game, player, card) {
//         if(!this.waitingForPlayers[player.id]) {
//             return;
//         }

//         var cardInPlay = _.find(player.cardsInPlay, c => {
//             return c.card.uuid === card.uuid;
//         });

//         if(!cardInPlay || cardInPlay.power === 0) {
//             return;
//         }

//         game.addMessage(player.name + ' discards 1 power form ' + cardInPlay.card.label + ' from ' + this.player.activePlot.card.label);
//         cardInPlay.power--;

//         delete this.waitingForPlayers[player.id];

//         if(!_.any(this.waitingForPlayers)) {
//             game.playerRevealDone(this.player);
//         }
//     }
// }
// plots['03049'] = {
//     register(game, player) {
//         var plot = new TheLongWinter(player);

//         game.playerPlots[player.id] = plot;
//         game.on('whenRevealed', plot.revealed);
//         game.on('cardClicked', plot.cardSelected);
//     },
//     unregister(game, player) {
//         var plot = game.playerPlots[player.id];

//         game.removeListener('whenRevealed', plot.revealed);
//         game.removeListener('cardClicked', plot.cardSelected);
//     }
// };

module.exports = plots;
