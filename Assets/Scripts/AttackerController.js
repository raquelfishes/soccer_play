var soccerBall:Transform;
var targetGoal:Transform;
var otherAttacker:Transform;
var attackTarget:Transform;
// The speed when walking
var walkSpeed = 2.0;

// when pressing "Fire3" button (cmd) we start running
var runSpeed = 4.5;

var kickSpeed = 40;
var passSpeed = 20;


var rotateSpeed = 500.0;
var targetPoint:Transform;

var kickOff:boolean = false;

function Awake ()
{	
	soccerBall = GameObject.FindWithTag ("SoccerBall").transform;
	//targetPoint = soccerBall;
}

function Start () {

}

function playerHasTheBall():boolean{
	return (soccerBall.rigidbody.GetComponent("BallBehavior").myOwner == transform);
}

function teamHasTheBall():boolean{
	return transform.parent.GetComponent(SoccerTeamPC).hasTheBall;
}

function ballInMyField():boolean{
	return soccerBall.position.x>0;
}

function isNearestPlayer():boolean{
	return transform.parent.GetComponent(SoccerTeamPC).playerClosestToBall==transform;
}

function tooFar():boolean{
	return (transform.position-targetGoal.position).magnitude>20;
}

function pass(){
	Debug.Log("pass");
	var targetDir = otherAttacker.position - transform.position;
	if (soccerBall.rigidbody.GetComponent("BallBehavior").myOwner == transform ){
		if( Vector3.Angle (transform.forward, targetDir) <130 ){
			soccerBall.rigidbody.GetComponent("BallBehavior").rigidbody.velocity = targetDir.normalized*passSpeed;
			soccerBall.rigidbody.GetComponent("BallBehavior").myOwner = null;
		}
		else soccerBall.rigidbody.GetComponent("BallBehavior").rigidbody.velocity = transform.TransformDirection(Vector3(0,0,passSpeed));
		soccerBall.SendMessage ("Kicked");
		soccerBall.rigidbody.GetComponent("BallBehavior").myOwner = null;
	}
}

function goToGoal(){
	Debug.Log("goToGoal");
	direction = targetGoal.position-transform.position;
	direction.y = 0;
	// Rotate towards the target
	transform.rotation = Quaternion.Slerp (transform.rotation, Quaternion.LookRotation(direction), rotateSpeed * Time.deltaTime);
	transform.eulerAngles = Vector3(0, transform.eulerAngles.y, 0);
	// Modify speed so we slow down when we are not facing the target
	var forward = transform.TransformDirection(Vector3.forward);
	var speedModifier = Vector3.Dot(forward, direction.normalized);
	speedModifier = Mathf.Clamp01(speedModifier);
	
	direction = forward * runSpeed * speedModifier;
	//Debug.Log("Direction goalkeeper: "+direction);
	GetComponent (CharacterController).SimpleMove(direction);
}

function kick(){
Debug.Log("Kick");
	var targetDir = targetGoal.position - transform.position;
	if (soccerBall.rigidbody.GetComponent("BallBehavior").myOwner == transform ){
		if( Vector3.Angle (transform.forward, targetDir) <150 )			
			soccerBall.rigidbody.GetComponent("BallBehavior").rigidbody.velocity = (targetGoal.position - transform.position).normalized*kickSpeed;			
		else			
			soccerBall.rigidbody.GetComponent("BallBehavior").rigidbody.velocity = transform.TransformDirection(Vector3(0,0,kickSpeed));
			
		soccerBall.SendMessage ("Kicked");
		soccerBall.rigidbody.GetComponent("BallBehavior").myOwner = null;
	}
}

function waitBall(){
Debug.Log("WaitBall");
	direction = attackTarget.position-transform.position;
	direction.y = 0;
	transform.rotation = Quaternion.Slerp (transform.rotation, Quaternion.LookRotation(direction), rotateSpeed * Time.deltaTime);
	transform.eulerAngles = Vector3(0, transform.eulerAngles.y, 0);
	
	//Check if the goalKeeper  has to walk to get him position or he has reached it
	if (direction.magnitude>.1f){
	// Modify speed so we slow down when we are not facing the target
	var forward = transform.TransformDirection(Vector3.forward);
	var speedModifier = Vector3.Dot(forward, direction.normalized);
	speedModifier = Mathf.Clamp01(speedModifier);
	
	direction = forward * walkSpeed * speedModifier;
		GetComponent (CharacterController).SimpleMove(direction);
	}
}

function goToBall(){
	Debug.Log("goToBall");
	//Debug.Log("targetPoint.position: "+soccerBall.position);
	direction = soccerBall.position-transform.position;
	direction.y = 0;
	// Rotate towards the target
	transform.rotation = Quaternion.Slerp (transform.rotation, Quaternion.LookRotation(direction), rotateSpeed * Time.deltaTime);
	transform.eulerAngles = Vector3(0, transform.eulerAngles.y, 0);
	// Modify speed so we slow down when we are not facing the target
	var forward = transform.TransformDirection(Vector3.forward);
	var speedModifier = Vector3.Dot(forward, direction.normalized);
	speedModifier = Mathf.Clamp01(speedModifier);
	
	direction = forward * runSpeed * speedModifier;
	//Debug.Log("Direction goalkeeper: "+direction);
	GetComponent (CharacterController).SimpleMove(direction);
}

function Update () {
	if (teamHasTheBall()){
	//Attack states
		if(playerHasTheBall()){
		distanceOther = otherAttacker.position - targetGoal.position;
		distanceMy = transform.position -targetGoal.position;
		if (tooFar() && distanceOther.magnitude<distanceMy.magnitude)
			pass();
		else if (tooFar())
			goToGoal();
		else
			kick();
		}
		else
			if (isNearestPlayer())
				goToBall();
			else
				waitBall();
	}
	else{
	//Defend states
		if (isNearestPlayer())
			goToBall();
		else
			waitBall();
			
	}
}

function OnControllerColliderHit (hit : ControllerColliderHit )
{
	
	if (hit.rigidbody == soccerBall.rigidbody){
		if (!playerHasTheBall() || soccerBall.rigidbody.GetComponent("BallBehavior").myOwner == null){
			soccerBall.rigidbody.GetComponent("BallBehavior").myOwner = transform;
			transform.parent.GetComponent(SoccerTeamPC).hasTheBall = true;
			soccerBall.SendMessage ("Kicked");
			transform.parent.GetComponent(SoccerTeamPC).opponentTeam.GetComponent(SoccerTeam).hasTheBall = false;
		}
	}
}