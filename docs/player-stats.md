# Player stats and the White Book

## Monthly stats

Each player can see their own stats for any calendar month on the Stats page (`/stats`, in the profile
menu). The API only returns the logged-in player's own stats.

- **Games:** games started in the month (UTC) that finished with a winner and had at least one other
  player. Draws, unfinished games and solo games don't count. Every game type counts.
- **Win reasons:** `power` (reached 15), `concede`, `remaining` (every opponent was eliminated:
  decked, left or disconnected) and `time` (time limit).
- **Dominant wins:** a win with 10 or more power more than the highest opponent, or a win some
  other way than reaching 15 (concession, opponents eliminated, time) with 10+ power while every
  opponent has 4 or less. It uses final power (`game_players.power`), so it covers every game. The
  rule is in [DominantWin.js](../server/services/DominantWin.js), once in JavaScript for stats and
  once in SQL for the White Book's rankings; `PlayerStats.spec.js` checks the two agree.
- **Hours played:** start to finish, capped at 3 hours a game.
- **Fastest win:** the fewest rounds in a win on power. Rounds come from the in-game stats, so only
  games since those were recorded count. Melee wins don't name an opponent.
- **Factions and agendas:** from `game_players.faction` and `agendas`, so they cover every game.
- **Decks:** from `game_players.deck_id`, which is only recorded for games since this was added, and
  only for the player's own decks (not standalone decks). Decks are kept by id and named when the
  stats are read, so a renamed deck shows its new name and a deleted one shows as "Deleted deck".
- **Opponents:** kept by user id and named when the stats are read (`UserStatsService.withNames()`),
  so a cached month or White Book page never shows an account that has since been disabled. Disabled opponents' games still count towards the totals. In melee, the
  nemesis is whoever won the most games the player was in.
- **In the game:** from `game_players.stats` ([GameStats.js](../server/game/GameStats.js)). Games
  without stats, or where manual actions were used, are left out, and the page says how many games
  the section covers.

The API only accepts months the player has games in. A month is cached in `user_monthly_stats` the
first time it is viewed once it has been over for a day.
The current month is always worked out live. Bump `SummaryVersion` in
[UserStatsService.js](../server/services/UserStatsService.js) whenever the summary changes, and old
rows are recomputed when next viewed.

## Deck records

The deck list (and so the deck picker in a game) shows each deck's record: its owner's finished games
with that deck, from `game_players.deck_id`, counted the same way as the stats page. Editing a deck
keeps its id, so the record carries on across edits. Only the owner sees it, and it is only worked out
for the deck list, not when a deck is loaded for a game.

## The White Book

The yearly report is called the White Book, and each player's report is their page in it. In the code it is still called Wrapped (`WrappedService`, `user_wrapped`, `npm run wrapped`).

Once a year each player with 10+ games gets a page in the White Book, worked out by a script because it ranks
players against each other. It covers 1 January up to the day the script runs (or `--to`), and is
saved in `user_wrapped`. The page is `/white-book/:year`, isn't linked from any menu, and needs a login
(logged-out visitors are sent to `/login?return=/white-book/:year` and back). It only shows snapshots of
the current `WrappedVersion` in [WrappedService.js](../server/services/WrappedService.js).

Each player only has one page. It can be seen, and is emailed, for two months after it was
generated (`AvailableForSql`); after that the page says it is no longer available. Generating
everyone's for a year deletes earlier years' snapshots.

Sharing a card renders it to a 1080×1920 PNG with `html-to-image`. Everything drawn into it must come
from this site, which is why card art uses `/img/cards/<code>.png`.

### The email

`npm run wrapped -- --email` emails players with a snapshot who haven't been emailed it yet, whose
account is verified and enabled, and who haven't turned off "Email me occasional updates" on their
profile (`users.email_updates`). Emails have an unsubscribe link (`/unsubscribe`, which asks first,
as link checkers open links) and `List-Unsubscribe` headers for one-click unsubscribing via
`POST /api/unsubscribe`. The token is an HMAC of the user id with `hmacSecret`. Account emails are
always sent.

Sending is resumable: `emailed_at` is set after each send, and re-generating snapshots keeps it. The
logo is `public/email/logo.png`, as built assets have hashed names. Needs `origin`, `hmacSecret` and
the SES settings.

### Sending it in December

```sh
# 1. Check the counts and a sample snapshot (changes nothing)
npm run wrapped -- --year 2026 --to 2026-12-15

# 2. Generate your own and look at /white-book/2026
npm run wrapped -- --year 2026 --to 2026-12-15 --user <username> --apply

# 3. Generate everyone's
npm run wrapped -- --year 2026 --to 2026-12-15 --apply

# 4. Save one email to look at, then send it to yourself
npm run wrapped -- --year 2026 --email --preview wrapped-email.html
npm run wrapped -- --year 2026 --email --user <username> --apply

# 5. Send everyone's (at most 10 a second by default)
npm run wrapped -- --year 2026 --email --apply
```
