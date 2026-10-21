import fs from 'fs';
import path from 'path';
import BaseCard from '../../server/game/basecard.js';
import DrawCard from '../../server/game/drawcard.js';
import Effect from '../../server/game/effect.js';
import Game from '../../server/game/game.js';
import StateCheckAbility from '../../server/game/StateCheckAbility.js';

const repoRoot = path.join(import.meta.dirname, '../..');
const verifiedCodes = new Set(
    JSON.parse(fs.readFileSync(path.join(repoRoot, 'server/game/verifiedCards.json'), 'utf8'))
);

const state = (globalThis.__abilityCoverage ??= {
    patched: false,
    cards: [],
    resolved: new WeakSet(),
    applied: new WeakSet()
});

function countAbilities(card) {
    return {
        actions: card.abilities.actions.length,
        reactions: card.abilities.reactions.length,
        persistentEffects: card.abilities.persistentEffects.length,
        stateChecks: card.abilities.stateChecks.length
    };
}

function wrapTextProperties(cardClass) {
    const original = cardClass.prototype.setupCardTextProperties;
    cardClass.prototype.setupCardTextProperties = function (...args) {
        original.apply(this, args);
        this.textAbilityCounts = countAbilities(this);
        state.cards.push(this);
    };
}

function patch() {
    if (state.patched) {
        return;
    }
    state.patched = true;

    wrapTextProperties(BaseCard);
    wrapTextProperties(DrawCard);

    const emit = Game.prototype.emit;
    Game.prototype.emit = function (eventName, ...args) {
        if (eventName === 'onCardAbilityInitiated' && args[0]?.ability) {
            state.resolved.add(args[0].ability);
        }
        return emit.call(this, eventName, ...args);
    };

    const executeStateCheck = StateCheckAbility.prototype.executeHandler;
    StateCheckAbility.prototype.executeHandler = function (...args) {
        state.resolved.add(this);
        return executeStateCheck.apply(this, args);
    };

    for (const method of ['addTargets', 'updateAppliedTargets', 'reapply', 'setActive']) {
        const original = Effect.prototype[method];
        Effect.prototype[method] = function (...args) {
            const result = original.apply(this, args);
            if (this.appliedTargets.size > 0) {
                state.applied.add(this.effect);
            }
            return result;
        };
    }
}

function cardAbilities(card) {
    const start = card.textAbilityCounts;
    return [
        ...card.abilities.actions.slice(start.actions).map((ability) => ({
            kind: 'action',
            title: ability.title,
            covered: state.resolved.has(ability)
        })),
        ...card.abilities.reactions
            .slice(start.reactions)
            .filter((ability) => ability.abilitySourceType !== 'game')
            .map((ability) => ({
                kind: ability.eventType || 'triggered ability',
                title: ability.title,
                covered: state.resolved.has(ability)
            })),
        ...card.abilities.stateChecks.slice(start.stateChecks).map((ability) => ({
            kind: 'state check',
            covered: state.resolved.has(ability)
        })),
        ...card.abilities.persistentEffects.slice(start.persistentEffects).map((properties) => ({
            kind: 'persistent effect',
            covered: [properties.effect].flat(Infinity).every((effect) => state.applied.has(effect))
        }))
    ];
}

function specCardCodes(specPath) {
    const relative = path.relative(path.join(repoRoot, 'test/server/cards'), specPath);
    if (relative.startsWith('..')) {
        return [];
    }

    const implementation = path.join(
        repoRoot,
        'server/game/cards',
        relative.replace(/\.spec\.js$/, '.js')
    );
    if (!fs.existsSync(implementation)) {
        return [];
    }

    const source = fs.readFileSync(implementation, 'utf8');
    return [...source.matchAll(/\.code\s*=\s*'([^']+)'/g)].map((match) => match[1]);
}

export function uncoveredAbilities(specPath) {
    const codes = specCardCodes(specPath).filter((code) => verifiedCodes.has(code));
    const problems = [];

    for (const code of codes) {
        const instances = state.cards.filter((card) => card.cardData.code === code);
        if (instances.length === 0) {
            problems.push(`${code}: the spec never creates the card`);
            continue;
        }

        const byIndex = instances.map(cardAbilities);
        byIndex[0].forEach((ability, index) => {
            if (!byIndex.some((abilities) => abilities[index]?.covered)) {
                const name = ability.title ? ` "${ability.title}"` : '';
                problems.push(
                    `${instances[0].name} (${code}): ${ability.kind} ${index + 1}${name} never resolves`
                );
            }
        });
    }

    return problems;
}

export function install() {
    patch();

    beforeAll(() => {
        state.cards = [];
        state.resolved = new WeakSet();
        state.applied = new WeakSet();
    });

    afterAll(() => {
        const specPath = expect.getState().testPath;
        if (!specPath) {
            return;
        }

        const problems = uncoveredAbilities(specPath);
        if (problems.length > 0) {
            throw new Error(
                `This card is in verifiedCards.json, so its spec must resolve every ability:\n  ${problems.join('\n  ')}`
            );
        }
    });
}
