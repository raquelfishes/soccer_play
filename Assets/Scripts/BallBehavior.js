// BallBehavior.js
// Pointer to the player with the ball.
var myOwner:Transform;
// Store the starting position of the ball.
var iniPosition:Vector3;
// Pointer to the teams.
var teamA:Transform;
var teamB:Transform;
var canMove:boolean;
// Variable used in the function keepPosition, that keeps the ball in this position.
var lastPosition:Vector3;

var SFXVolume: float;
var SFXKick: AudioClip;
var SFXGoal: AudioClip;

// Function executed when initializing the object.
function Awake(){
	// Start position is set as the position of the ball in the Unity editor.
	iniPosition = transform.position; 
	// The ball can move.
	canMove = true;
	// Find the team objects.
	teamA = GameObject.FindWithTag ("BlueTeam").transform;
	teamB = GameObject.FindWithTag ("RedTeam").transform;
	lastPosition = iniPosition;
}

// Update function
function Update () {
	// Check if the ball can move.
	if ( !canMove ){
		keepPosition();
		return;
	}
	// If there is one player controlling the ball, the ball must remain in front of him.
	if(myOwner){
		transform.position = Vector3(0,transform.position.y,0) + Vector3(myOwner.position.x,0,myOwner.position.z) + myOwner.forward*2;					if(myOwner.GetComponent(CharacterController).velocity.sqrMagnitude > 10)
		transform.RotateAround (transform.position, myOwner.right, 5*Time.deltaTime * myOwner.GetComponent(CharacterController).velocity.sqrMagnitude);		
	}

}
// Goal function.
function OnGoal(){	
	// No player has control of the ball.
	Debug.Log("Goal BALL");
	myOwner = null;
	AudioSource.PlayClipAtPoint(SFXGoal, transform.position, SFXVolume);

	// Sets the linear velocity of the ball to zero.
	rigidbody.velocity = Vector3.zero;
	// Sets the angular velocity of the ball to zero.
	rigidbody.angularVelocity= Vector3.zero;	
	// Ball should keep the position until the players take their positions.
	canMove= true;
	// LastPosition is used in the function keepPosition, keeping the ball in one point
	transform.position = iniPosition;
	Debug.Log(lastPosition);
}
// Keeps the ball in the lastPosition point.
function keepPosition(){
	transform.position=lastPosition;
	rigidbody.velocity = Vector3.zero;
	rigidbody.angularVelocity= Vector3.zero;
}
// ThrowIn function
function OnThrowIn(){
	myOwner = null;
	rigidbody.velocity = Vector3.zero;
	rigidbody.angularVelocity= Vector3.zero;
	lastPosition = transform.position;
}

function Kicked () {
	AudioSource.PlayClipAtPoint(SFXKick, transform.position, SFXVolume);
}