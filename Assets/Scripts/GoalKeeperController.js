var soccerBall:Transform;
// The speed when walking
var walkSpeed = 5.0;

// when pressing "Fire3" button (cmd) we start running
var runSpeed = 8.0;

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

function defendGoal(){
	//Set the point in the Area where will be the goalKeeper
	auxPoint = soccerBall.position;
	auxPoint.x = Mathf.Clamp(auxPoint.x,28,35);
	auxPoint.z = Mathf.Clamp(auxPoint.z,-8,8);
	auxPoint.y = 0;
	//Get the vector which has to follow the goalKeeper
	direction = auxPoint-transform.position;
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


function Start () {

}

function Update () {
	distanceBall=soccerBall.position-transform.position;
	//Debug.Log("distanceBall: "+distanceBall.sqrMagnitude);
	if (distanceBall.sqrMagnitude < 30)
		goToBall();
	else
		defendGoal();
}