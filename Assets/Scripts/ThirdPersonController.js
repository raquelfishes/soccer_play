var soccerBall:Transform;
var targetGoal:Transform;
// The speed when walking
var walkSpeed = 9.0;
// after trotAfterSeconds of walking we trot with trotSpeed
var trotSpeed = 10.0;


var kickSpeed = 40;
var passSpeed = 20;


// The gravity for the character
var gravity = 20.0;

var speedSmoothing = 10.0;
var rotateSpeed = 500.0;
var trotAfterSeconds = 3.0;


// The camera doesnt start following the target immediately but waits for a split second to avoid too much waving around.
private var lockCameraTimer = 0.0;

// The current move direction in x-z
private var moveDirection = Vector3.zero;
// The current vertical speed
private var verticalSpeed = 0.0;
// The current x-z move speed
private var moveSpeed = 0.0;

// The last collision flags returned from controller.Move
private var collisionFlags : CollisionFlags; 


// Is the user pressing any keys?
private var isMoving = false;
// When did the user start walking (Used for going into trot after a while)
private var walkTimeStart = 0.0;





private var isControllable = true;

function Awake ()
{
	moveDirection = transform.TransformDirection(Vector3.forward);
	targetGoal = transform.parent.GetComponent(SoccerTeam).targetGoal;
	soccerBall = GameObject.FindWithTag ("SoccerBall").transform;
	
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


function UpdateSmoothedMovementDirection ()
{
	var cameraTransform = Camera.main.transform;
	var grounded = IsGrounded();
	
	// Forward vector relative to the camera along the x-z plane	
	var forward = cameraTransform.TransformDirection(Vector3.forward);
	forward.y = 0;
	forward = forward.normalized;

	// Right vector relative to the camera
	// Always orthogonal to the forward vector
	var right = Vector3(forward.z, 0, -forward.x);

	var v = Input.GetAxisRaw("Vertical");
	var h = Input.GetAxisRaw("Horizontal");

	// Are we moving backwards or looking backwards
	if (v < -0.2)
		movingBack = true;
	else
		movingBack = false;
	
	var wasMoving = isMoving;
	isMoving = Mathf.Abs (h) > 0.1 || Mathf.Abs (v) > 0.1;
		
	// Target direction relative to the camera
	var targetDirection = h * right + v * forward;
	
	// Grounded controls
	if (grounded)
	{
		// Lock camera for short period when transitioning moving & standing still
		lockCameraTimer += Time.deltaTime;
		if (isMoving != wasMoving)
			lockCameraTimer = 0.0;

		// We store speed and direction seperately,
		// so that when the character stands still we still have a valid forward direction
		// moveDirection is always normalized, and we only update it if there is user input.
		if (targetDirection != Vector3.zero)
		{
			// If we are really slow, just snap to the target direction
			if (moveSpeed < walkSpeed * 0.9 && grounded)
			{
				moveDirection = targetDirection.normalized;
			}
			// Otherwise smoothly turn towards it
			else
			{
				moveDirection = Vector3.RotateTowards(moveDirection, targetDirection, rotateSpeed * Mathf.Deg2Rad * Time.deltaTime, 1000);
				
				moveDirection = moveDirection.normalized;
			}
		}
		
		// Smooth the speed based on the current target direction
		var curSmooth = speedSmoothing * Time.deltaTime;
		
		// Choose target speed
		//* We want to support analog input but make sure you cant walk faster diagonally than just forward or sideways
		var targetSpeed = Mathf.Min(targetDirection.magnitude, 1.0);
	
		// Pick speed modifier
		if (Time.time - trotAfterSeconds > walkTimeStart)
		{
			targetSpeed *= trotSpeed;
		}
		else
		{
			targetSpeed *= walkSpeed;
		}
		
		moveSpeed = Mathf.Lerp(moveSpeed, targetSpeed, curSmooth);
		
		// Reset walk time start when we slow down
		if (moveSpeed < walkSpeed * 0.3)
			walkTimeStart = Time.time;
	}
	

		
}


function ApplyGravity ()
{
	if (isControllable)	// don't move player at all if not controllable.
	{
		if (IsGrounded ())
			verticalSpeed = 0.0;
		else
			verticalSpeed -= gravity * Time.deltaTime;
	}
}




function Update() {

	
	if (!isControllable)
	{
		// kill all inputs if not controllable.
		Input.ResetInputAxes();
	}

	
	if (Input.GetButton ("Fire1"))
	{
		
		kick();
		
	}
	
	if (Input.GetButton ("Fire2"))
	{
		
		pass(targetGoal);
		
	}
	
	UpdateSmoothedMovementDirection();
	
	// Apply gravity
	// - extra power jump modifies gravity
	// - controlledDescent mode modifies gravity
	ApplyGravity ();
	
	// Calculate actual motion
	var movement = moveDirection * moveSpeed + Vector3 (0, verticalSpeed, 0);
	movement *= Time.deltaTime;
	
	// Move the controller
	var controller : CharacterController = GetComponent(CharacterController);

	collisionFlags = controller.Move(movement);
		
	transform.rotation = Quaternion.LookRotation(moveDirection);

}

function OnControllerColliderHit (hit : ControllerColliderHit )
{
//	Debug.DrawRay(hit.point, hit.normal);
	if (hit.moveDirection.y > 0.01) 
		return;
	wallJumpContactNormal = hit.normal;
	
	if (hit.rigidbody == soccerBall.rigidbody){
		if (!playerHasTheBall()){
			soccerBall.rigidbody.GetComponent("BallBehavior").myOwner = transform;
			transform.parent.GetComponent(SoccerTeam).hasTheBall = true;
			soccerBall.SendMessage ("Kicked");
			transform.parent.GetComponent(SoccerTeam).opponentTeam.GetComponent(SoccerTeam).hasTheBall = false;
		}

	}
	
}

function kick(){
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

function IsGrounded () {
	return (collisionFlags & CollisionFlags.CollidedBelow) != 0;
}

function playerHasTheBall():boolean{
	return (soccerBall.rigidbody.GetComponent("BallBehavior").myOwner == transform);

}


function Reset ()
{
	gameObject.tag = "Player";
}
// Require a character controller to be attached to the same game object
@script RequireComponent(CharacterController)
@script AddComponentMenu("Third Person Player/Third Person Controller")
