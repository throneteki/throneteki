const { flatMap } = require('../Array');

class DynamicKeywordsEffect {
    constructor({ game }) {
        this.game = game;
        this.duration = 'persistent';
        this.order = 999; // Apply this effect after all other keyword effects
        this.isStateDependent = true;

        this.graph = this.buildGraph();
        this.appliedKeywords = new Map();
    }

    isInActiveLocation() {
        return true;
    }

    addTargets() {}

    clearInvalidTargets() {}

    updateAppliedTargets() {}

    hasEnded() {
        return false;
    }

    cancel() {}

    setActive() {}

    reapply() {
        for (const [card, keywords] of this.appliedKeywords.entries()) {
            for (const keyword of keywords) {
                card.removeKeyword(keyword);
            }
        }

        this.graph = this.buildGraph();

        const cardToKeywordsMap = new Map();
        for (const card of this.graph.keys()) {
            const connectedSources = this.bfs(card);
            const keywords = new Set(flatMap(connectedSources, (source) => source.getKeywords()));
            cardToKeywordsMap.set(card, keywords);
        }

        for (const [card, keywords] of cardToKeywordsMap.entries()) {
            for (const keyword of keywords) {
                card.addKeyword(keyword);
            }
        }

        this.appliedKeywords = cardToKeywordsMap;
    }

    buildGraph() {
        const graph = new Map();
        const cardsWithDynamicKeywords = this.game.filterCardsInPlay(
            (card) => card.keywordSources.length > 0
        );
        const inPlayCards = this.game.filterCardsInPlay(() => true);
        for (const card of cardsWithDynamicKeywords) {
            const sources = inPlayCards.filter((inPlayCard) =>
                card.keywordSources.some((sourceFunc) => sourceFunc(inPlayCard))
            );
            graph.set(card, sources);
        }
        return graph;
    }

    bfs(startingNode) {
        const visited = new Map();
        const nodeQueue = [];

        visited.set(startingNode, true);
        nodeQueue.push(startingNode);

        while (nodeQueue.length > 0) {
            let currentNode = nodeQueue.shift();

            const sources = this.graph.get(currentNode) || [];

            for (const source of sources) {
                if (!visited.get(source)) {
                    visited.set(source, true);
                    nodeQueue.push(source);
                }
            }
        }

        return [...visited.keys()];
    }
}

module.exports = DynamicKeywordsEffect;
