// goalTrigger.js
// The name of the team owning this goal, “TeamA” or “TeamB”, it has to be defined in the Unity Editor inspector area
var goalTeam:String;
var soccerBall:Transform;
var teamA:Transform;
var teamB:Transform;
function Awake(){
	soccerBall = GameObject.FindWithTag ("SoccerBall").transform;
	teamA = GameObject.FindWithTag ("BlueTeam").transform;
	teamB = GameObject.FindWithTag ("RedTeam").transform;

}
function OnTriggerEnter (other : Collider) {
Debug.Log("Goal");
	if(other.gameObject.layer==9){

		if ( goalTeam=="TeamA" ){
			Camera.main.GetComponent(SGUI).teamBScore=Camera.main.GetComponent(SGUI).teamBScore+1;
			teamA.GetComponent(SoccerTeam).hasTheBall = true;
			teamB.GetComponent(SoccerTeamPC).hasTheBall = false;
		} else {
			Camera.main.GetComponent(SGUI).teamAScore=Camera.main.GetComponent(SGUI).teamAScore+1;
			teamA.GetComponent(SoccerTeam).hasTheBall = false;
			teamB.GetComponent(SoccerTeamPC).hasTheBall = true;
		}
		
		soccerBall.GetComponent (BallBehavior).OnGoal();
		
		teamA.GetComponent(SoccerTeam).prepareForKickOff = false;		
		teamB.GetComponent(SoccerTeamPC).prepareForKickOff = false;		
	}	
}
