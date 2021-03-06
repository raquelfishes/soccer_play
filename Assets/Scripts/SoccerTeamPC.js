﻿// SoccerTeam.js
// The player that is being controlled.
var controllingPlayer:Transform;
// The player that will give support for the player that is being controlled.
var supportingPlayer:Transform;
// The closest player to the Ball.
var playerClosestToBall:Transform;
// The player that will receive the pass.
var receivingPlayer:Transform;
// The opposing goal, it should be a GameObject.
var targetGoal:Transform;
// The team's goal, also a GameObject.
var homeGoal:Transform;
// True for Team controlled by the pc, false for controlling team for the user.
var isPC:boolean = true;
//  Is the team with the ball?
var hasTheBall:boolean;
// Pointer for the opposing team's GameObject.
var opponentTeam:Transform;
// Arrays of empty GameObjects representing the attack positions and defense.
var defendingTargets:Transform[];
var attackingTargets:Transform[];
// Pointer to the ball.
var soccerBall:Transform;
// Is the team in attacking?
var isAttacking:boolean;
// Is the team defending?
var isDefending:boolean;
// Should the ball be in the middle of the field?
var prepareForKickOff:boolean;
// The ball is in the lateral.
var prepareForThrowIn:boolean = false;
// Pointer to the team's players.
var players:Transform[];

function Awake(){
	// it looks for the object with the tag " SoccerBall " and associates the variable soccerBall to the returned object.
	soccerBall = GameObject.FindWithTag ("SoccerBall").transform;
	// When the game is begeining, the team is in the defense position.
	isAttacking = false;
	isDefending=true;
	// In the begining of the game, the players should goes to the kick off position.
	prepareForKickOff = true;	
	// Function that adds the script PCThirdPersonController to all players.
	setUpPlayers();
	// The game begins with RedTeam with the ball ownership.
	if(transform.tag == "RedTeam"){
		opponentTeam = GameObject.FindWithTag ("BlueTeam").transform;
		hasTheBall = true;	
	}
	else opponentTeam = GameObject.FindWithTag ("RedTeam").transform;	
	// find the closest player to the ball and associates him with the variable playerClosestToBall
	findClosestToBall();	
	controllingPlayer = playerClosestToBall;	
	// If the team is controlled by the user, controllingPlayer is controlled by the user.
	// Players assumes the defense position.
	defendingFormation();
}

function setUpPlayers(){

}
function defendingFormation(){
	var x = 0;
	for (var child : Transform in players) {
		if(child.name=="DefendPlayerLeftPC") child.GetComponent(DefenderController).targetPoint = defendingTargets[x];
		if(child.name=="DefendPlayerRightPC") child.GetComponent(DefenderController).targetPoint = defendingTargets[x];
		if(child.name=="FrontPlayerLeftPC") child.GetComponent(AttackerController).targetPoint = defendingTargets[x];
		if(child.name=="FrontPlayerRightPC") child.GetComponent(AttackerController).targetPoint = defendingTargets[x];
		x++;		
	}
}
function preparingFormation(){
	var x = 0;
	for (var child : Transform in players) {
		if(child.name=="DefendPlayerLeftPC") child.GetComponent(DefenderController).targetPoint = defendingTargets[x];
		if(child.name=="DefendPlayerRightPC") child.GetComponent(DefenderController).targetPoint = defendingTargets[x];
		if(child.name=="FrontPlayerLeftPC") child.GetComponent(AttackerController).targetPoint = defendingTargets[x];
		if(child.name=="FrontPlayerRightPC") child.GetComponent(AttackerController).targetPoint = defendingTargets[x];
		x++;
		
	}
}
function attackingFormation(){
	var x = 0;
	for (var child : Transform in players) {
		if(child.name=="DefendPlayerLeftPC") child.GetComponent(DefenderController).targetPoint = attackingTargets[x];
		if(child.name=="DefendPlayerRightPC") child.GetComponent(DefenderController).targetPoint = attackingTargets[x];
		if(child.name=="FrontPlayerLeftPC") child.GetComponent(AttackerController).targetPoint = attackingTargets[x];
		if(child.name=="FrontPlayerRightPC") child.GetComponent(AttackerController).targetPoint = attackingTargets[x];
		x++;	
	}
}
// Are all the players in their initial position?
function allPlayersAtHome():boolean{
	var x = 0;
	for (var child : Transform in players) {
		if ( ( child.position -  defendingTargets[x].position ).sqrMagnitude > 3 ) return false;
		x++;		
	}
	return true;
}
function Update () {	

	findClosestToBall();	
	// Verifies if it is in the kickOff state
	if (prepareForKickOff){
		// If it is the kick off state, it executes the actions of the state.
		// Send all players to preparing formation positions.
		preparingFormation();
		prepareForKickOff = false;
		controllingPlayer = playerClosestToBall;						
		soccerBall.GetComponent(BallBehavior).canMove = true;
		soccerBall.GetComponent(BallBehavior).myOwner = controllingPlayer;
		// If all the players are in their initial positions
		if ( allPlayersAtHome() )
		{		
			// If all the players of the opposing team are in their initial positions and the team is with the ball ownership, leaves the state
			// If some player of the opponent's team is with the ball, leaves the state
			if( (opponentTeam.GetComponent(SoccerTeam).allPlayersAtHome() && hasTheBall ) || soccerBall.GetComponent(BallBehavior).myOwner != null )
			{		
				
				prepareForKickOff = false;
				controllingPlayer = playerClosestToBall;						
				soccerBall.GetComponent(BallBehavior).canMove = true;
				controllingPlayer.GetComponent(AttackerController).kickOff = true;
				Debug.Log("pollitos");
			}
			else
			return;
		}
		else
		return;
	}	
	// Verifies if it is in the throw in state
	if(prepareForThrowIn){
		// If it is the throw in state, it executes the actions of the state.
		// Send all players to preparing formation positions.
		preparingFormation();
		// If the opponent is with the ball, leaves the state.
		if ( soccerBall.GetComponent(BallBehavior).myOwner != null )
		{
			prepareForThrowIn=false;
			//findClosestToBall();
			controllingPlayer = playerClosestToBall;
		}
		else
		return;	
	}	
	/*
	if (hasTheBall)
		attackingFormation();
	else
		defendingFormation();
		*/
	
}
function findClosestToBall(){
	var ballSqrDistance= Mathf.Infinity;
	for (var child : Transform in players) {
		newDistance = (child.position - soccerBall.position).sqrMagnitude;
		if (newDistance < ballSqrDistance){ 
			playerClosestToBall = child;
			ballSqrDistance = newDistance;
		}
	}
}

