import { aroundTheTable, tableRows } from '../../client/Components/GameBoard/seatOrder';

const seats = (count) =>
    Array.from({ length: count }, (_, index) => ({ name: `seat${index + 1}`, seatNo: index + 1 }));
const names = (players) => players.map((player) => player.name);

describe('aroundTheTable', () => {
    it('starts from the given player and goes down the seat numbers, wrapping round', () => {
        const players = seats(5);
        expect(names(aroundTheTable(players[2], players))).toEqual([
            'seat3',
            'seat2',
            'seat1',
            'seat5',
            'seat4'
        ]);
    });

    it('does not change the list it is given', () => {
        const players = seats(4);
        aroundTheTable(players[0], players);
        expect(names(players)).toEqual(['seat1', 'seat2', 'seat3', 'seat4']);
    });
});

describe('tableRows', () => {
    it('seats us at the bottom left with the rest going round the table', () => {
        const players = seats(4);
        const rows = tableRows(players[0], players);
        expect(names(rows.bottom)).toEqual(['seat1', 'seat4']);
        expect(names(rows.top)).toEqual(['seat2', 'seat3']);
    });

    it('leaves the bottom row a seat short with an odd number of players', () => {
        const players = seats(5);
        const rows = tableRows(players[0], players);
        expect(names(rows.bottom)).toEqual(['seat1', 'seat5']);
        expect(names(rows.top)).toEqual(['seat2', 'seat3', 'seat4']);
    });

    it('seats three players with one of us below and two across the table', () => {
        const players = seats(3);
        const rows = tableRows(players[1], players);
        expect(names(rows.bottom)).toEqual(['seat2']);
        expect(names(rows.top)).toEqual(['seat3', 'seat1']);
    });

    it('fills both rows with six players', () => {
        const players = seats(6);
        const rows = tableRows(players[0], players);
        expect(names(rows.bottom)).toEqual(['seat1', 'seat6', 'seat5']);
        expect(names(rows.top)).toEqual(['seat2', 'seat3', 'seat4']);
    });
});
