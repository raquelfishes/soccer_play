// SGUI.js
// You can assign here an object of type GUISkin, which sets the GUI style.
var gSkin : GUISkin;
private var isLoading = false;

// The variables responsible for storing the amount of goals from each team.
var teamAScore:int= 0;
var teamBScore:int = 0;
// A float which controls the elapsed time of the match.
var timer:float=0;

// Function to show the GUI of the game.
function OnGUI()
{
	// If gSkin variable is not null, change the style of GUI.
 if(gSkin)
		GUI.skin = gSkin;
	// Draw the area that will show the team name and score.
	GUI.Button( Rect( 15, 20, 225, 30), "", "button");
	// Name of the first team, "UCM"
	var message = "UCM ";
	// The score has 2-digits, so the amount of goals goes from 00 to 99.
	if (teamAScore < 10 )
		message+="0"+teamAScore;
	else message+= teamAScore;
	// UCM  00 x ..	
	message+=" x ";
	// UCM  00 x 00 URJC
	if (teamBScore < 10 )
		message+="0"+teamBScore+" URJ";
	else message+= teamBScore+" URJ";
	// Draw the timer area.
	GUI.Label ( Rect( 20, 20, 220, 35),message, "label");
	timer += Time.deltaTime;
	GUI.Button( Rect( Screen.width - 110, 20, 80, 30), "", "button");
	// Shows the timer.
	if( Mathf.Floor((timer - (Mathf.Floor(timer/60)*60))) < 5)
	GUI.Label ( Rect( Screen.width - 105, 20, 100, 35), "0"+Mathf.Floor(timer/60)+":0"+Mathf.Floor((timer - (Mathf.Floor(timer/60)*60))), "label");
	else
	GUI.Label ( Rect( Screen.width - 105, 20, 100, 35), "0"+Mathf.Floor(timer/60)+":"+Mathf.Floor((timer - (Mathf.Floor(timer/60)*60))), "label");
}
