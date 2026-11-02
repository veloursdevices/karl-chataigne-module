# KARL module for Chataigne

[KARL](https://veloursdevices.com) by Velours Devices as a control surface in
[Chataigne](https://benjamin.kuperberg.fr/chataigne): 24 knobs and 40 keys per
bank, and Chataigne can send names, colours and values back to KARL's screen,
rings and keys.

## Setup

KARL has no network: its OSC goes through the KARL configurator on the computer.

1. In the KARL configurator, open **Connections** and click **+ Chataigne**
   (sends to 12000, listens on 12001), then **Save targets**.
2. Open **Library > OSC surface**, pick bank 1 and click **Create page**. Make
   one page per bank you want (bank 2 for objects 7-12, and so on).
   **Save & send**.
3. In Chataigne, add the **KARL** module (Community Modules > Hardware). It
   listens on 12000 and sends to 127.0.0.1:12001. To install it by hand,
   download this repository and put its folder in
   `Documents/Chataigne/modules`, then restart Chataigne. If Chataigne runs on another
   computer, set that computer as the target's host in the configurator, and
   the configurator's computer as the module's output.

## Values (from KARL)

| Value | |
|---|---|
| `Page` | the page on KARL's screen |
| `Bank n > Encoders > Encoder 1-24` | 0-1, rows left to right, top row first |
| `Bank n > Keys > Top 1-12, Bottom 1-12, Left 1-8, Right 1-8` | on / off |

Values exist for banks 1-4. Commands reach any bank.

Keys toggle by default: each press changes the value once. A key that recalls
a snapshot therefore fires once per press. (A momentary surface page, built
with "momentary" ticked, sends on for press and off for release.)

## Commands (to KARL)

| Command | |
|---|---|
| Set Encoder, Set Key | moves the ring, lights the key (Set Key also updates the key's value here) |
| Set Encoder Name, Set Key Name | replaces the name on the screen |
| Set Encoder Color, Set Key Color | replaces the colour |
| Go To Page | a page name, or its number in KARL's list |
| Resend All | sends again every name, colour and value set so far |

KARL forgets names and colours when it restarts. The module sends them again
by itself when the configurator reconnects (`/karl/resync`), and KARL announces
each page it shows, so a mapping on `Page` can relabel a bank.

## OSC

Per bank `b`, both ways unless noted:

```
/karl/<b>/enc/<1-24>               0..1
/karl/<b>/key/<top|bottom|left|right>/<n>   1 / 0
/karl/<b>/enc/<n>/name  <string>    to KARL
/karl/<b>/enc/<n>/color "#RRGGBB"   to KARL   (same for keys)
/karl/page <name>                  from KARL when a page comes up
/karl/page <name | number>         to KARL: select a page
/karl/resync                       from KARL: the link came up
```

## Examples

Sessions for SPAT Revolution, L-ISA, d&b Soundscape (DS100) and CODA SPACE
HUB, built on those processors' own Chataigne modules:
https://github.com/veloursdevices/karl-chataigne-module/tree/main/examples

## License

MIT, see `LICENSE`.
