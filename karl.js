/*
	KARL module for Chataigne - Velours Devices

	KARL talks OSC through its configurator (KARL itself has no network).
	In the configurator: Connections > + Chataigne (sends to 12000, listens on
	12001), then Library > OSC surface makes a page per bank.

	From KARL, per bank:
	  /karl/<bank>/enc/<1-24>          0..1
	  /karl/<bank>/key/<edge>/<n>      1 pressed / on, 0 released / off
	  /karl/page <name>                the page on screen
	  /karl/resync                     the link to KARL came up
	To KARL: the same value addresses, plus <address>/name and
	<address>/color ("#RRGGBB"), and /karl/page <name or number>.
*/

// What was last sent to KARL, by address: sent again on /karl/resync, when
// KARL (re)connects and has forgotten names and colours. Kept as two arrays:
// the script engine has no for..in.
var sentAddresses = [];
var sentValues = [];

function init()
{
	sentAddresses = [];
	sentValues = [];
}

// ------------------------------------------------------------- from KARL

function oscEvent(address, args)
{
	if (local.parameters.logIncoming.get()) script.log("KARL " + address + " " + args);

	if (address == "/karl/resync")
	{
		resendAll();
		return;
	}
	if (address == "/karl/page")
	{
		if (args.length > 0) local.values.page.set("" + args[0]);
		return;
	}
	if (args.length == 0) return;

	var parts = address.split("/");
	// ["", "karl", bank, "enc", n] or ["", "karl", bank, "key", edge, n]
	if (parts.length < 5 || parts[1] != "karl") return;
	var bank = local.values.getChild("bank" + parts[2]);
	if (!bank) return;

	if (parts[3] == "enc" && parts.length == 5)
	{
		var encoder = bank.encoders.getChild("encoder" + parts[4]);
		if (encoder) encoder.set(args[0]);
	}
	else if (parts[3] == "key" && parts.length == 6)
	{
		var key = bank.keys.getChild(parts[4] + parts[5]);
		if (key) key.set(args[0] > 0.5);
	}
}

// --------------------------------------------------------------- to KARL

function send(address, value)
{
	var i = sentAddresses.indexOf(address);
	if (i < 0)
	{
		sentAddresses.push(address);
		sentValues.push(value);
	}
	else sentValues[i] = value;
	local.send(address, value);
}

function encoderAddress(bank, encoder)
{
	return "/karl/" + bank + "/enc/" + encoder;
}

function keyAddress(bank, edge, key)
{
	return "/karl/" + bank + "/key/" + edge + "/" + key;
}

var HEX = "0123456789ABCDEF";

function hex(component)
{
	var n = Math.round(Math.min(1, Math.max(0, component)) * 255);
	return HEX.charAt(Math.floor(n / 16)) + HEX.charAt(n % 16);
}

function colorString(color)
{
	return "#" + hex(color[0]) + hex(color[1]) + hex(color[2]);
}

function setEncoder(bank, encoder, value)		{ send(encoderAddress(bank, encoder), value); }
function setEncoderName(bank, encoder, name)	{ send(encoderAddress(bank, encoder) + "/name", "" + name); }
function setEncoderColor(bank, encoder, color)	{ send(encoderAddress(bank, encoder) + "/color", colorString(color)); }

// KARL reads numbers only: a key is 1 or 0.
function setKey(bank, edge, key, on)			{ send(keyAddress(bank, edge, key), on ? 1 : 0); }
function setKeyName(bank, edge, key, name)		{ send(keyAddress(bank, edge, key) + "/name", "" + name); }
function setKeyColor(bank, edge, key, color)	{ send(keyAddress(bank, edge, key) + "/color", colorString(color)); }

// A page name, or its number in KARL's list.
function goToPage(page)
{
	local.send("/karl/page", "" + page);
}

function resendAll()
{
	for (var i = 0; i < sentAddresses.length; i++) local.send(sentAddresses[i], sentValues[i]);
}
