import path from 'path';
import DeckBuilder from './DeckBuilder.js';
import { FillerPlotCard } from './setupTest.js';

const packsDirectory = path.join(import.meta.dirname, '../../throneteki-json-data/packs');

export const deckBuilder = new DeckBuilder();

await deckBuilder.loadCards(packsDirectory);
deckBuilder.cardsByCode[FillerPlotCard.code] = FillerPlotCard;
deckBuilder.cards.push(FillerPlotCard);
