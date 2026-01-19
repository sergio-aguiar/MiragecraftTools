document.getElementById("calculateBtn").addEventListener("click", calculateOdds);

function calculateOdds() 
{
	let catchCombo = parseInt(document.getElementById("catchCombo").value);
	let resultDiv = document.getElementById("result");
	let hasError = false;

	resultDiv.innerHTML = "";

	if (isNaN(catchCombo) || catchCombo < 0) 
	{
		resultDiv.innerHTML += "Please enter a valid current Catch Combo.<br>";
		hasError = true;
	}

	if (hasError)
	{
		return;
	}

	let fullOdds = 10240;
	let output = "";
	
	let reducedOdds, shinyRolls;

	if (catchCombo > 319) 
	{
		shinyRolls = 10;
		reducedOdds = fullOdds / 10;
	}
	else if (catchCombo > 279) 
	{
		shinyRolls = 9;
		reducedOdds = fullOdds / 9;
	}
	else if (catchCombo > 239) 
	{
		shinyRolls = 8;
		reducedOdds = fullOdds / 8;
	}
	else if (catchCombo > 199) 
	{
		shinyRolls = 7;
		reducedOdds = fullOdds / 7;
	}
	else if (catchCombo > 159) 
	{
		shinyRolls = 6;
		reducedOdds = fullOdds / 6;
	}
	else if (catchCombo > 119) 
	{
		shinyRolls = 5;
		reducedOdds = fullOdds / 5;
	}
	else if (catchCombo > 79) 
	{
		shinyRolls = 4;
		reducedOdds = fullOdds / 4;
	}
	else if (catchCombo > 39) 
	{
		shinyRolls = 3;
		reducedOdds = fullOdds / 3;
	}
	else if (catchCombo > 19)
	{
		shinyRolls = 2;
		reducedOdds = fullOdds / 2;
	} 
	else 
	{
		shinyRolls = 1;
		reducedOdds = fullOdds;
	}

	let serverBooster = parseInt(document.getElementById("serverBooster").value);
	let gemBooster = parseInt(document.getElementById("gemBooster").value);
	let totalMultiplier = serverBooster * gemBooster;

	output += "<strong>Current shiny odds (not taking any Poké Snacks into account):</strong><br>";
	let finalOdds = reducedOdds / totalMultiplier;
	output += `You have a <strong>1 in ${finalOdds.toFixed(2)} (${shinyRolls} shiny roll${shinyRolls > 1 ? "s" : ""})</strong> chance of a shiny spawning for the species you are currently hunting!<br>`;
	
	resultDiv.innerHTML = output;
}
