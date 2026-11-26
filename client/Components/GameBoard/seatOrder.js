// Every player, starting from the given one and going on round the table in the order the melee table seats them
export const aroundTheTable = (from, players) => {
    const ordered = [...players].sort((a, b) => b.seatNo - a.seatNo);
    const start = Math.max(0, ordered.indexOf(from));
    return [...ordered.slice(start), ...ordered.slice(0, start)];
};

// The table as two rows, read left to right, each column a board above and a board below. We sit at the bottom
// left, and the rest follow round the table: along the bottom row, then back along the top. With an odd number of
// players the bottom row is a seat short at its end.
export const tableRows = (from, players) => {
    const order = aroundTheTable(from, players);
    const bottomCount = Math.floor(order.length / 2);
    return {
        top: order.slice(bottomCount).reverse(),
        bottom: order.slice(0, bottomCount)
    };
};
