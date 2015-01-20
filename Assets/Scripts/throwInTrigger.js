var soccerBall:Transform;
var teamA:Transform;
var teamB:Transform;


function Awake(){
	soccerBall = GameObject.FindWithTag ("SoccerBall").transform;
	teamA = GameObject.FindWithTag ("BlueTeam").transform;
	teamB = GameObject.FindWithTag ("RedTeam").transform;

}

function OnTriggerEnter (other : Collider) {
	//Debug.Log("lateral");
	if(other.gameObject.layer==9){
		soccerBall.GetComponent (BallBehavior).OnThrowIn();		
		
		
		if ( teamA.GetComponent(SoccerTeam).hasTheBall == true ){
			teamA.GetComponent(SoccerTeam).hasTheBall = false;
			teamB.GetComponent(SoccerTeamPC).hasTheBall = true;
			
			teamA.GetComponent(SoccerTeam).prepareForThrowIn= true;	
			
		
		} else {
			teamA.GetComponent(SoccerTeam).hasTheBall = true;
			teamB.GetComponent(SoccerTeamPC).hasTheBall = false;
			
			teamB.GetComponent(SoccerTeamPC).prepareForThrowIn = true;	
			
		
		}
		
	}

			
	
}