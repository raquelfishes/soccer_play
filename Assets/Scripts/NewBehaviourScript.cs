using UnityEngine;
using System.Collections;
public class NewBehaviourScript : MonoBehaviour {
	System.IO.FileStream file;
	System.IO.StreamWriter writer;
	// Use this for initialization
	void Start () {
	// open the file
	file = System.IO.File.OpenWrite( "blah.txt" );
	// create a writer with that file
	writer = new System.IO.StreamWriter( file );
	writer.WriteLine( "Hello all you happy people!" );
	writer.WriteLine( 542 );
	writer.Close();
	}
	
	// Update is called once per frame
	void Update () {
	}
	
}