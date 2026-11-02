# Example sessions

Checked in Chataigne 1.10.3 with simulated processors (every mapping loads and
sends the expected OSC). Not yet tried with the real processors: check ranges
and ports on yours before a show.

Open a session in Chataigne with the KARL module and the processor's own
community module installed (Community Modules: SPAT Revolution, L-ISA OSC,
d&b DS100, SPACE HUB Control). On KARL, make one OSC surface page per bank
(Library > OSC surface, banks 1 and 2).

One KARL bank (an OSC surface page) per 6 objects: bank 1 is objects 1-6,
bank 2 objects 7-12. Column = object.

| | SPAT Revolution | L-ISA | Soundscape (DS100) | SPACE HUB |
|---|---|---|---|---|
| knob row 1 | azimuth | pan | X (mapping 1) | azimuth |
| knob row 2 | elevation | width | Y | elevation |
| knob row 3 | distance 0-20 m | distance | spread | distance |
| knob row 4 | gain -60..+12 dB | elevation | En-Space send -60..+12 dB | level -60..+10 dB |
| top keys | mute, solo | solo | mute | mute, solo |
| right keys 1-8 | snapshot 1-8 | snapshot 1-8 | scene 1-8 | snapshot 1-8 |
| left keys 1, 2 | previous / next snapshot | same | previous / next scene | same |
| back to KARL | names, positions, gain, mute, solo | - | - | - |

KARL's labels are sent each time its page changes. Only the SPAT Revolution
module keeps per-source values from the start, so it is the only one whose
feedback (names, positions) can be mapped in a saved session; the others
create theirs as data arrives, or poll one object.

Ports, as the processors' modules set them: SPAT 8500 out / 8501 in (set the
same in SPAT's OSC preferences), L-ISA 8880 out / 9000 in, DS100 50010 out to
192.168.1.100 / 50011 in, SPACE HUB 9301 out / 9302 in (9001, the module's
default, is TotalMix's port in the KARL configurator).
