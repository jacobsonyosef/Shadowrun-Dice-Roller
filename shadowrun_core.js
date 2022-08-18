var CRITICAL_GLITCH = -2;
var GLITCH = -1;
var NONE = 0;
var NORMAL = 1;

function random(a, b)
{
	return Math.floor(Math.random()*(b-a+1)+a);
}

function roll(numDice, ruleOfSix)
{
	var results = {"rolls": new Array(), "successes": 0, "ones": 0, "result": NONE};
	for (var i = 0; i < numDice; i++)
	{
		var roll = random(1, 6);
		results.rolls.push(roll);
		if (ruleOfSix && roll == 6)
			i--;
		if (roll > 4)
			results.successes++;
		else if (roll == 1)
			results.ones++;
	}
	
	setResult(results);
		
	return results;
}

function cloneResults(results)
{
	var clone = new Object();
	$.props(clone, results);
	clone.rolls = new Array();
	for (var i = 0; i < results.rolls.length; i++)
		clone.rolls[i] = results.rolls[i];
	return clone;
}

function rerollFailures(results)
{
	for (var i = 0; i < results.rolls.length; i++)
	{
		var roll = results.rolls[i];
		if (roll < 5)
		{
			if (roll == 1)
				results.ones--;
			roll = random(1, 6);
			results.rolls[i] = roll;
			if (roll > 4)
				results.successes++;
			else if (roll == 1)
				results.ones++;
		}
	}
	
	setResult(results);
		
	return results;
}

function setResult(results)
{
	if (results.ones * 2 >= results.rolls.length)
	{
		if (results.successes == 0)
			results.result = CRITICAL_GLITCH;
		else
			results.result = GLITCH;
	}
	else
		results.result = NORMAL;
}

function init(initScore, edge)
{
	var results = false;
	if (isNaN(edge))
		results = roll(initScore, false);
	else
		results = roll(initScore + edge, true);
	results.successes += initScore;
	return results;
}

function resultsToString(results)
{
	var str = results.rolls.join(", ") + "<br>";
	if (results.result == CRITICAL_GLITCH)
		str += "<b>CRITICAL GLITCH</b> ";
	else if (results.result == GLITCH)
		str += "<b>GLITCH</b> ";
	if (results.successes == 1)
		str += "1 hit";
	else
		str += results.successes + " hits";
	return str;
}