var soccerBall:Transform;
var teamA:Transform;
var teamB:Transform;



function Awake(){
	soccerBall = GameObject.FindWithTag ("SoccerBall").transform;
	teamA = GameObject.FindWithTag ("BlueTeam").transform;
	teamB = GameObject.FindWithTag ("RedTeam").transform;

}


function OnTriggerEnter (other : Collider) {

	if(other.gameObject.layer==9){

		if ( !teamA.GetComponent(SoccerTeam).hasTheBall ){

			teamA.GetComponent(SoccerTeam).hasTheBall = true;
			teamB.GetComponent(SoccerTeam).hasTheBall = false;
		} else {

			teamA.GetComponent(SoccerTeam).hasTheBall = false;
			teamB.GetComponent(SoccerTeam).hasTheBall = true;
		}
		
		soccerBall.GetComponent (BallBehavior).OnGoal();
		
		teamA.GetComponent(SoccerTeam).prepareForKickOff = true;
		
		teamB.GetComponent(SoccerTeam).prepareForKickOff = true;	
		
			
	}
	
}