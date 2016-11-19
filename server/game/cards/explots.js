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
