var soccerBall:Transform;
// The speed when walking
var walkSpeed = 3.0;

// when pressing "Fire3" button (cmd) we start running
var runSpeed = 6.0;

var kickSpeed = 40;
var passSpeed = 20;


var rotateSpeed = 500.0;
var targetPoint:Transform;


var canMove:boolean = true;


// The last collision flags returned from controller.Move
private var collisionFlags : CollisionFlags; 

private var isControllable = true;

function Awake ()
{	
	soccerBall = GameObject.FindWithTag ("SoccerBall").transform;
	//targetPoint = soccerBall;
}

// This next function responds to the "HidePlayer" message by hiding the player. 
// The message is also 'replied to' by identically-named functions in the collision-handling scripts.
// - Used by the LevelStatus script when the level completed animation is triggered.

function HidePlayer()
{
	GameObject.Find("rootJoint").GetComponent(SkinnedMeshRenderer).enabled = false; // stop rendering the player.
	isControllable = false;	// disable player controls.
}

// This is a complementary function to the above. We don't use it in the tutorial, but it's included for
// the sake of completeness. (I like orthogonal APIs; so sue me!)

function ShowPlayer()
{
	GameObject.Find("rootJoint").GetComponent(SkinnedMeshRenderer).enabled = true; // start rendering the player again.
	isControllable = true;	// allow player to control the character again.
}

function Update() {	
	/*
	
	var direction = transform.position.forward;
	if (!playerHasTheBall() && !teamHasTheBall())
		direction = soccerBall.position - transform.position;
	else if (!isPC() && teamHasTheBall() )
		moveSpeed = 0;
	else
	{
		direction = targetPoint.position - transform.position;
		if (direction.sqrMagnitude < 400) kick();
		
		
	}
	*/

	if (canMove){
	
		direction = targetPoint.position - transform.position;
		direction.y = 0;
		
		if (direction.sqrMagnitude > 2){
		
			// Rotate towards the target
			transform.rotation = Quaternion.Slerp (transform.rotation, Quaternion.LookRotation(direction), rotateSpeed * Time.deltaTime);


			transform.eulerAngles = Vector3(0, transform.eulerAngles.y, 0);

			// Modify speed so we slow down when we are not facing the target
			var forward = transform.TransformDirection(Vector3.forward);
			var speedModifier = Vector3.Dot(forward, direction.normalized);
			speedModifier = Mathf.Clamp01(speedModifier);

			// Move the character
			direction = forward * runSpeed * speedModifier;
			GetComponent (CharacterController).SimpleMove(direction);	
			
			
		} else {
				ballDirection = soccerBall.position - transform.position;
				ballDirection.y = 0;
				transform.rotation = Quaternion.Slerp (transform.rotation, Quaternion.LookRotation(ballDirection), rotateSpeed * Time.deltaTime);
		
		
		}
	}

}

function OnControllerColliderHit (hit : ControllerColliderHit )
{
	
	if (hit.rigidbody == soccerBall.rigidbody){
		if (!playerHasTheBall() || soccerBall.rigidbody.GetComponent("BallBehavior").myOwner == null){
			soccerBall.rigidbody.GetComponent("BallBehavior").myOwner = transform;
			transform.parent.GetComponent(SoccerTeam).hasTheBall = true;
			soccerBall.SendMessage ("Kicked");
			transform.parent.GetComponent(SoccerTeam).opponentTeam.GetComponent(SoccerTeamPC).hasTheBall = false;
		}
	}
	
}

function playerHasTheBall():boolean{
	return (soccerBall.rigidbody.GetComponent("BallBehavior").myOwner == transform);

}

function Reset ()
{
	gameObject.tag = "Player";
}

function kick(kickTarget:Transform){
	var targetDir = kickTarget.position - transform.position;
	if (soccerBall.rigidbody.GetComponent("BallBehavior").myOwner == transform ){
			if( Vector3.Angle (transform.forward, targetDir) <130 ){
			
				soccerBall.rigidbody.GetComponent("BallBehavior").rigidbody.velocity =targetDir.normalized*kickSpeed;
				soccerBall.rigidbody.GetComponent("BallBehavior").myOwner = null;
				soccerBall.SendMessage ("Kicked");
			}			
	}

}

function pass(receiver:Transform){

		var targetDir = receiver.position - transform.position;
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

function teamHasTheBall():boolean{
	return transform.parent.GetComponent(SoccerTeam).hasTheBall;
}

function isPC():boolean{
	return transform.parent.GetComponent(SoccerTeam).isPC;
}


// Require a character controller to be attached to the same game object
@script RequireComponent(CharacterController)
@script AddComponentMenu("Third Person Player/PCThird Person Controller")
