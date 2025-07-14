document.getElementById("calculateBtn").addEventListener("click", calculateOdds);

function calculateOdds() 
{
	let catchCombo = parseInt(document.getElementById("catchCombo").value);
	let lastShinyCombo = parseInt(document.getElementById("lastShinyCombo").value);
	let resultDiv = document.getElementById("result");
	let hasError = false;

	resultDiv.innerHTML = "";

	if (isNaN(catchCombo) || catchCombo < 0) 
	{
		resultDiv.innerHTML += "Please enter a valid current Catch Combo.<br>";
		hasError = true;
	}

	if (isNaN(lastShinyCombo) || lastShinyCombo < 0 || lastShinyCombo > catchCombo) 
	{
		resultDiv.innerHTML += "Please enter a valid Catch Combo value for your last shiny spawn.<br>";
		hasError = true;
	}

	if (hasError)
	{
		return;
	}

	let fullOdds = 10240;
	let output = "";
	
	let reducedOdds, shinyRolls;

	if (catchCombo - lastShinyCombo > 200)
	{
		shinyRolls = Math.min((catchCombo - lastShinyCombo - 200) * 0.05 + 6, 12);
		reducedOdds = fullOdds / shinyRolls;
	}
	else if (catchCombo > 99) 
	{
		shinyRolls = 6;
		reducedOdds = fullOdds / 6;
	}
	else if (catchCombo > 59) 
	{
		shinyRolls = 5;
		reducedOdds = fullOdds / 5;
	}
	else if (catchCombo > 39) 
	{
		shinyRolls = 4;
		reducedOdds = fullOdds / 4;
	}
	else if (catchCombo > 29) 
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

	output += "<strong>Without an active Shiny Boost:</strong><br>";
	output += `You have a <strong>1 in ${reducedOdds.toFixed(2)} (${shinyRolls} shiny roll${shinyRolls > 1 ? "s" : ""})</strong> chance of a shiny spawning for the species you are currently hunting!<br>`;
	output += "<br>"
	output += "<strong>With an active 2x Shiny Boost:</strong><br>";
	output += `You have a <strong>1 in ${(reducedOdds / 2).toFixed(2)} (${shinyRolls} shiny roll${shinyRolls > 1 ? "s" : ""})</strong> chance of a shiny spawning for the species you are currently hunting!<br>`;
	output += "<br>"
	output += "<strong>With an active 3x Shiny Boost:</strong><br>";
	output += `You have a <strong>1 in ${(reducedOdds / 3).toFixed(2)} (${shinyRolls} shiny roll${shinyRolls > 1 ? "s" : ""})</strong> chance of a shiny spawning for the species you are currently hunting!<br>`;

	resultDiv.innerHTML = output;
}
