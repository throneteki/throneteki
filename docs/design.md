# Site design

How the site looks and why, for anyone building or changing a page in `client/`. The game board
follows the colour and type rules here but keeps its own layout (see [Exceptions](#exceptions)).

## The idea

The site is a hall in Westeros: the throne room art is always behind the content, and pages sit on
dark frames ruled like the cards. The theme comes from a few larger pieces:

- the **frame**, a printed rule with diamond corners, the way card frames are ruled
- the **banner nav**, where sections hang from a gold rod
- **Cinzel** headings, in gold within a page
- **game vocabulary**, such as the phase track for action windows and challenge icons on notices

Everything you click or type into stays plain and familiar: ordinary switches, solid buttons and
standard fields. Ornament goes on structure, never on controls.

## Avoid

These make the site look like a generic template. Don't use them:

- a coloured bar down the side of a box, row, notice or selected item
- a gradient that fades out behind a selected item
- a line that trails off after a heading
- a box around every group of settings; rows are ruled, not boxed
- rounded cards with a drop shadow as the default container
- small capitalised labels above headings
- solid blue title bars across the top of a panel, as the old site did
- light Bootstrap alert colours (pale green, pale cyan) on the dark site
- custom-styled switches, checkboxes or buttons. The phase track's diamond checkboxes are the one
  exception.

## Tokens

The tokens are set in [client/index.css](../client/index.css): Tailwind's `@theme` block holds our own tokens, and the `.dark` block sets HeroUI 3's theme variables (`--accent`, `--field-*`, `--focus`, `--link`). Use the
token names in class lists. Don't use raw hex values, `bg-black/N` opacities or Tailwind's default
greys in components.

### Colour

| Token          | Value                       | Use                                                            |
| -------------- | --------------------------- | -------------------------------------------------------------- |
| `accent`       | `#41658a`                   | The main colour: primary buttons, switches on, selection       |
| `accent-hover` | `#4a79ab`                   | Primary buttons on hover                                       |
| `banner-deep`  | `#284a70`                   | The lower end of the current banner                            |
| `banner-idle`  | `#23262d`                   | Banners that aren't current                                    |
| `gold`         | `#c9a45c`                   | Nav links, headings within a page, frame corners, links, focus |
| `gold-line`    | `rgba(201, 164, 92, 0.38)`  | The frame rule, table header rule, save bar rule               |
| `gold-hair`    | `rgba(201, 164, 92, 0.16)`  | Rules between rows                                             |
| `ink`          | `#ece6d8`                   | Text                                                           |
| `ink-dim`      | `#a8a194`                   | Descriptions, labels, table headers                            |
| `ink-faint`    | `#7d776c`                   | Hints under a setting, placeholders, quiet status text         |
| `frame`        | `rgba(10, 11, 15, 0.88)`    | The frame's fill                                               |
| `well`         | `rgba(255, 255, 255, 0.05)` | Fields                                                         |
| `quiet`        | `rgba(255, 255, 255, 0.07)` | Quiet buttons, hover on rows                                   |
| `danger`       | `#e57a72`                   | Danger text and destructive text actions                       |
| `danger-solid` | `#c0392b`                   | A destructive button in a confirm dialog                       |
| `warning`      | `#e0a526`                   | Unsaved changes, warnings                                      |
| `success`      | `#5fa777`                   | Confirmation text                                              |

There is one gold. The old orange `secondary` (`#da8a2a`) is retired, and its uses move to `gold`.

Faction colours (`baratheon` to `tyrell`) and challenge colours (`military`, `intrigue`, `power`)
are for game content only: cards, factions, decks and stats. Don't use them for interface states.

### Type

Three faces, all bundled in `client/assets/fonts`:

- **Cinzel** (600) for page titles, group headings, banner labels, phase names, table headers and
  dialog titles. Use title case, never all capitals, and never Cinzel for body text or buttons.
- **Poppins** for everything else.
- **thronesdb** for challenge, faction and card type icons.

| Class       | Size / line height  | Use                                      |
| ----------- | ------------------- | ---------------------------------------- |
| `text-xs`   | 0.75rem / 1.1rem    | Badges, timestamps                       |
| `text-sm`   | 0.85rem / 1.3rem    | Descriptions, hints, labels, table text  |
| `text-base` | 0.9375rem / 1.45rem | Body text, setting names, buttons        |
| `text-lg`   | 1.08rem / 1.4rem    | Group headings (Cinzel, `gold`)          |
| `text-xl`   | 1.25rem / 1.3rem    | Dialog titles                            |
| `text-2xl`  | 1.55rem / 1.2rem    | Page titles (Cinzel, `ink`)              |
| `text-3xl`  | 1.95rem / 1.15rem   | Large stats and the occasional hero line |

Use only the classes in this table. HeroUI 3 components use the same Tailwind sizes, so they match.

Keep running text to about 70 characters wide (`max-w-prose`). Give headings `text-balance`, and
use `tabular-nums` where numbers line up in a column.

### Shape and space

- **Radius:** `rounded` (4px) for buttons, fields and quiet surfaces. Frames and banners are square.
  Switches, avatars and seals are round. Don't use other radii.
- **Frame padding:** 32px across and 26px down (22px across at phone width).
- **Space between groups:** 30px. Between a group heading and its rows: 10px.
- **Rows:** 12px top and bottom, with a `gold-hair` rule between rows and above the first.
- **Page widths:** `narrow` 440px (login and other single forms), `normal` 940px (most pages),
  `wide` the full container (the deck editor, game lists and admin tables).

## Components

The shared components live in [client/Components/Site/](../client/Components/Site/). Build pages
from these rather than styling containers by hand.

### Page

`<Page size='narrow' | 'normal' | 'wide'>`. Centres the content at its width over the background
art.

### Frame

`<Frame title description actions footer>`. This is the one container. It is the `frame` fill with
a `gold-line` rule inset 6px and a small gold diamond at each corner.

- `title` is Cinzel `text-2xl`, left aligned. `description` is one sentence in `text-sm` `ink-dim`
  underneath it.
- `actions` sit to the right of the title: at most one primary button, plus quiet buttons.
- `footer` sits below a `gold-line` rule. The save bar goes here.

Don't nest a frame inside a frame. Inside a frame, use groups.

### Admin page

`<AdminPage section title description actions footer>` wraps every admin screen. It puts the banner
nav for the admin sections the user can see (from `AdminSections` in
[AdminPage.jsx](../client/pages/AdminPage.jsx)) above a wide frame, and hides the nav when there is
only one section. Page actions such as Add banner or Refresh go in `actions`. Admin lists are ruled
rows, not tables, with the item's state as tags and its row actions on the right.

### Banner nav

`<BannerNav items current>`. Use it for pages with sections, such as the profile, the deck editor
or the admin area. It goes above a frame: a gold rod, with one banner per section hanging from it.

- Banners are `banner-idle`, with Cinzel labels in `ink-dim`, 50px long, with a swallowtail end.
- The current banner is 66px long, `accent` fading to `banner-deep`, with a gold top edge and an
  `ink` label. Hovering lengthens a banner a little.
- Each banner is a real link with its own address (`/profile/gameplay`). It marks the current one
  with `aria-current='page'`.
- A section with unsaved changes shows a small gold diamond after its label.
- At phone width the row scrolls sideways and keeps the current banner in view.

### Group

`<Group title description>`. A Cinzel `text-lg` heading in `gold`, an optional `text-sm` `ink-faint`
description, then the content. There is no box around it.

### Setting row

`<SettingRow label hint control>`. The name in `text-base` `ink`, an optional hint underneath it in
`text-sm` `ink-faint`, and the control on the right. Rows stack with `gold-hair` rules between them.
The whole row is the control's label, so clicking anywhere on it toggles the switch.

### Choice tiles

For a choice between a few named options that read better side by side, such as card size or
background, use `RadioField` with a `RadioOption` per tile. Tiles have a `gold-hair` border and a
2px radius, and the selected one gets a `gold` border on the `quiet` fill. Put a preview of the
choice next to them when there is room, as the profile's Appearance section does.

### Switch

`<Toggle>` for a switch with a label, or `<SettingSwitch>` inside a setting row. Both wrap HeroUI's
`Switch` at size `sm` in the main colour. Leave its shape alone.

### Phase track

`<PhaseTrack windows value onChange>`. It shows the action windows in round order: Plot, Draw,
Marshaling, Challenges, Dominance, Standing, Taxation. Phase names are Cinzel `text-sm` `ink-dim` on
a `gold-line` track. Each window is a diamond checkbox under its phase, `accent` when on. A phase
with one window uses the phase name as its label. The three challenge windows stack under
Challenges with their own labels. At phone width the track turns into rows, one per phase.

The profile's Gameplay section and the in-game settings both use it, from the shared `ActionWindows`
list in [constants.js](../client/constants.js).

### Buttons

HeroUI `Button`, with the font and size from the theme and a 4px radius.

| Kind        | Props                                     | Use                                               |
| ----------- | ----------------------------------------- | ------------------------------------------------- |
| Primary     | `variant='primary'`                       | The one main action in a view: Save, Login, Block |
| Quiet       | `variant='tertiary'`                      | Everything else: Discard, Import, Cancel          |
| Danger text | `variant='ghost' className='text-danger'` | Destructive actions in a row: Unblock, Remove     |
| Danger      | `variant='danger'`                        | Confirming a destructive action, in a dialog only |

Use one primary button per view. Icons on buttons are optional, and an icon-only button needs an
`aria-label`.

### Fields

`<Field>`, `<TextAreaField>`, `<SelectField>`, `<ComboField>` and `<RadioField>`, which put HeroUI's
`TextField`, `Select`, `ComboBox` and `RadioGroup` together with a label above. The field is the `well`
fill with a faint border, and the border turns `gold-line` while you type. Errors go under the field
in `text-sm` `danger`.

### Notice

`<Notice kind='info' | 'success' | 'warning' | 'error'>`. A seal (a round
`gold-line` ring) holds an icon from the thronesdb font, with the message beside it in `text-sm`
`ink-dim`. It has no box and no coloured fill. Outside a frame, straight on the background art, pass
`isBoxed` so it gets the `frame` fill and a `gold-line` border.

| Kind      | Icon     | Icon colour |
| --------- | -------- | ----------- |
| `info`    | intrigue | `gold`      |
| `success` | power    | `gold`      |
| `warning` | military | `warning`   |
| `error`   | military | `danger`    |

Toasts use the same seal and colours on the `frame` fill.

### Tag

`<Tag tone>` labels a row's state: Private, Melee, Ended, Has errors. It is `text-xs` with a thin
border and no fill: `gold-hair` and `ink-faint` by default, or `warning` and `danger` tones for
states that need attention. Use it in place of HeroUI `Chip`.

### Save bar

`<SaveBar status dirty onDiscard>`, for forms that save together. It goes in the frame's footer:
status text on the left, then Discard (quiet) and Save changes (primary). The status reads "No
unsaved changes" in `ink-faint`, "You have unsaved changes" in `warning`, or names the sections with
errors in `danger`. Both buttons are disabled until something changes. Sections that save straight
away, such as Sessions and Block list, have no save bar.

### Tables

HeroUI `Table` with `variant='secondary'`; the theme CSS makes it rules only: Cinzel `text-sm` `ink-dim` headers above a `gold-line` rule, and `gold-hair` rules
between rows. No fills, stripes or boxes. Row actions go in the last column, aligned right, as
danger text or quiet buttons. Wide tables scroll sideways inside their own container.

A list people use on their phones (decks, games) shouldn't be a shrunken table. Pass `ReactTable` a
`renderCard` so each row becomes a ruled card below 640px: the key image on the left, the name in
`ink`, one line of detail in `ink-dim`, then status and dates in `text-xs` `ink-faint`. The name is
a button stretched over the card, so tapping anywhere opens it; checkboxes, chips and toggles sit
above it with `relative z-10`.

### Long text

Wrap help and policy text (About, How to play, Privacy) in `<div className='prose-site'>` inside a
frame, and write plain `h2`, `h3`, `p`, `ul` and `code` with no classes. Section headings are Cinzel
`text-lg` `gold` over a `gold-hair` rule, lines stop at about 72 characters, and links are `gold`
and underlined. Use `<section>` for each part, so the parts get more space between them than the
paragraphs inside them do.

### Pagination and avatars

`<Pager page total onChange>` for paging through a list, and `<UserAvatar username>` for a player's
avatar (the first letter of their name shows until the image loads).

### Empty, loading and error states

- **Empty:** one sentence in `text-sm` `ink-dim`, centred in the space where the content would be,
  saying what will appear and how to add the first one.
- **Loading:** `LoadingSpinner`, centred, in the same place.
- **Error:** a `Notice` with `kind='error'` that says what went wrong and what to do.

### Chat

`<ChatArea>` holds the lobby chat, the game chat and the pending game chat. It stays scrolled to
the newest message. Once you scroll up, a round pill on the `#0c0d11` fill with a `gold-line`
border appears above the input, reading "3 new messages" or "Jump to latest", and clicking it
scrolls back down. Messages are lines, not bubbles: avatar, name in `ink`, then the text. Your own
lines get a faint white tint.

### Dialogs

`<Dialog title footer>` (HeroUI's `Modal`), styled like a frame (rule and corners), with a Cinzel
`text-xl` title. `<ConfirmDialog>` covers yes/no questions; pass `isDestructive` when confirming
deletes something, so the confirm button is `danger`. Put the primary or danger action last.

## Phone width

Every page works at 390px wide:

- Banner nav scrolls sideways, and the current banner stays in view.
- The phase track turns into one row per phase.
- Setting rows keep the control on the right, and hints wrap.
- The save bar's status text takes its own line above the buttons.
- Tables scroll sideways inside their own container. The page never does.

## Accessibility

- Focus is a 2px `gold` outline, offset 2px or 3px, on everything you can focus.
- Text in `ink` and `ink-dim` meets 4.5:1 on the frame fill. `ink-faint` is for hints and secondary
  text only.
- Every control has a visible or `aria-label` label, and the phase track's checkboxes name their
  window.
- Transitions are short (150ms to 180ms) and turn off under `prefers-reduced-motion`.

## Exceptions

- **Game board:** uses the colours, type and buttons here, with its own layout, card piles and
  prompts. Frames and banner nav aren't used on the board. Its panels (the prompt, the game log,
  card pile popups, the stats bars) sit over the cards, so they use a near opaque `#0c0d11` fill
  (90% to 95%) with a `gold-line` border instead of a frame. Panel titles and the current phase are
  Cinzel `gold`. The game log marks rounds and phases with a centred Cinzel divider, and game
  alerts are a compact row with an icon rather than a notice. Popup titles name the whole pile and
  its owner: "northern_wolf's dead pile".
- **The White Book:** keeps its own book styling.
- **Card images:** shown as printed, with no frames or effects added.

## Checking a change

Compare before and after screenshots at 1440px and 390px for every page a design change touches,
including the profile sections.
