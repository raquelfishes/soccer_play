// speed is the rate at which the object will rotate
var speed = 4.0;

function Update () {
    // Generate a plane that intersects the transform's position with an upwards normal.
    var playerPlane = new Plane(Vector3.up, transform.position);
   
    // Generate a ray from the cursor position
    var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	//var ray = Camera.main.ScreenPointToRay (Vector3(Input.GetAxis("Mouse X"), 0, Input.GetAxis("Mouse Y") ));

		Debug.DrawRay (ray.origin, ray.direction * 20, Color.yellow);
		


    // Determine the point where the cursor ray intersects the plane.
    // This will be the point that the object must look towards to be looking at the mouse.
    // Raycasting to a Plane object only gives us a distance, so we'll have to take the distance,
    //   then find the point along that ray that meets that distance.  This will be the point
    //   to look at.
    var hitdist = 0.0;
    // If the ray is parallel to the plane, Raycast will return false.
    if (playerPlane.Raycast (ray, hitdist)) {
        // Get the point along the ray that hits the calculated distance.
        var targetPoint = ray.GetPoint(hitdist);
       
        // Determine the target rotation.  This is the rotation if the transform looks at the target point.
        var targetRotation = Quaternion.LookRotation(targetPoint - transform.position);
       
        // Smoothly rotate towards the target point.
        transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, speed * Time.deltaTime);
    }
	
}