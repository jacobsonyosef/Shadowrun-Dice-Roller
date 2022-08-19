const diceInputs = [];
const ruleInputs = [];
const labelInputs = [];
var diceVals;
var ruleVals;
var labelVals;

function ReadData()
{
	diceVals = JSON.parse(localStorage.getItem("diceVals"));
	ruleVals = JSON.parse(localStorage.getItem("ruleVals"));
	labelVals = JSON.parse(localStorage.getItem("labelVals"));
	
	// for (var i = 0; i < diceVals.length; i++)
		// console.log(diceVals[i]);	
	
	// for (var i = 0; i < ruleVals.length; i++)
		// console.log(ruleVals[i]);	
	
	// for (var i = 0; i < labelVals.length; i++)
		// console.log(labelVals[i]);
}

function WriteData() 
{
	localStorage.clear();
	const dies = [];
	const rules = [];
	const labels = [];
	for (var i = 0; i < diceInputs.length; i++)
	{
		dies.push(diceInputs[i].value);
		//console.log("added " + diceInputs[i].value);

		rules.push(ruleInputs[i].checked);
		//console.log("added " + ruleInputs[i].checked);

		labels.push(labelInputs[i].value);
		//console.log("added " + labelInputs[i].value);
	}
	
	// for (var i = 0; i < dies.length; i++)
		// console.log(dies[i]);	
	
	// for (var i = 0; i < rules.length; i++)
		// console.log(rules[i]);	
	
	// for (var i = 0; i < labels.length; i++)
		// console.log(labels[i]);
	
	localStorage.setItem("diceVals", JSON.stringify(dies));
	localStorage.setItem("ruleVals", JSON.stringify(rules));
	localStorage.setItem("labelVals", JSON.stringify(labels));
}

function trim(str)
{
	return str.replace(/^\s+|\s+$/g,"");
}

function setup()
{
	window.onunload = WriteData;
	$.create("input", $.id("reset"), {"type": "button", "value": "Clear Output"}).addEventListener("click", clearOutput, false);
	$.create("input", $.id("reset"), {"type": "button", "value": "+"}, {"marginLeft": "10px"}).addEventListener("click", makeRoller, false);
	//$.create("input", $.id("reset"), {"type": "button", "value": "Reset"}, {"marginLeft": "10px"}).addEventListener("click", reset, false);
	
	ReadData();
	var savedVals = 0;
	if (diceVals !== null)
		savedVals = diceVals.length;
	let max = (savedVals > 6) ? savedVals : 6;
	for (var i = 0; i < max; i++)
		makeRoller(i);
}

function makeRoller(i)
{
	var table = $.create("table", $.id("rollers"), false, {"width": "100%", "marginBottom": "20px"});
	var row1 = $.create("tr", table);
	$.create("td", row1, {"innerHTML": "Dice:"}, {"width": "15px"});
	
	var diceInput = $.create("input", $.create("td", row1, false, {"width": "45px"}), {"type": "text"}, {"width": "100%"});
	diceInputs.push(diceInput);
	if (diceVals !== null && diceVals.length > i)
		diceInput.value = diceVals[i];
	
	$.create("td", row1, {"innerHTML": "Reroll Sixes:"}, {"width": "75px"});
	var ruleInput = $.create("input", $.create("td", row1, false, {"width": "10px"}), {"type": "checkbox"}, {"width": "10px"});
	ruleInputs.push(ruleInput);
	if (ruleVals !== null && ruleVals.length > i)
		ruleInput.checked = ruleVals[i];
	
	var roll = $.create("td", row1, {"innerHTML": "<input type=\"button\" value=\"Roll\"/>"});
	var row2 = $.create("tr", table);
	var label = $.create("td", row2, {"innerHTML": "Label:"});
	var labelInput = $.create("input", $.create("td", row2, {"colSpan": 4}), {"type": "text"}, {"width": "100%"});
	labelInputs.push(labelInput);
	if (labelVals !== null && labelVals.length > i)
		labelInput.value = labelVals[i];
	
	roll.addEventListener("click", makeRoll(diceInput, labelInput, ruleInput), false);
}

function makeRoll(diceInput, labelInput, ruleInput)
{
	WriteData();
	return function()
	{
		var dice = parseInt(trim(diceInput.value));
		if (!isNaN(dice))
		{
			var ruleOfSix = ruleInput.checked;
			var result = roll(dice, ruleOfSix);
			result.dice = dice;
			result.label = trim(labelInput.value);
			output(result);
		}
	}
}

function output(result, isReroll)
{
	var output = $.id("output");
	var notEmpty = output.innerHTML != "";
	
	var span = $.create("span", output);
	
	if (notEmpty)
		span.innerHTML += "<br><br>";
	if (isReroll)
		span.innerHTML += "<b>REROLL FAILURES</b><br>";
	if (result.label != "")
		span.innerHTML += "<b>" + result.label + "</b><br>";
	span.innerHTML += resultsToString(result, true) + " on " + result.dice + (result.dice == 1 ? " die" : " dice ");
	if (!isReroll)
		$.create("a", span, {"innerHTML": "(reroll)", "className": "blue"}).addEventListener("click", makeReroll(result), false);
	output.scrollTop = output.scrollHeight;
}

function makeReroll(result)
{
	return function()
	{
		var newResult = cloneResults(result);
		rerollFailures(newResult);
		this.innerHTML = "";
		output(newResult, true);
	}
}

function reset()
{
	$.id("output").innerHTML = "";
	$.id("rollers").innerHTML = "";
	$.id("reset").innerHTML = "";
	setup();
}

function clearOutput()
{
	$.id("output").innerHTML = "";
}