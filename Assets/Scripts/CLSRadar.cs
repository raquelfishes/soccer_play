using UnityEngine;  
using System;
  
  public class CLSRadar : MonoBehaviour
  {
    // expanded radar! by zumwalt, alteration of oPress's version which is
    // from the original javascript by PsychicParrot,
    // who in turn adapted it from a Blitz3d script found in the
    // public domain online somewhere ....
    //
    public Texture blip;
    public Texture radarBG;
    public Transform centerObject;
    public float mapScale = 0.3f;
    public Vector2 mapCenter;
    public float screenWidth=1024.0f;
    public float screenHeight=768.0f;
    public int mapLocation = 0;
    // 0 = upper left
    // 1 = upper right
    // 2 = lower left
    // 3 = lower right
    public string tagFilter = "enemy";
    public float maxDist = 200;

    /// <summary>
    /// Switch DrawRadar() to OnGui if you use this directly in a unity C# Script object outside of this class
    /// otherwise, within the OnGui() call DrawRadar() on the class object.
    /// </summary>
    public void DrawRadar()
    {
      //UnityEngine.GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, new Vector3(Screen.width / 600.0f, Screen.height / 450.0f, 1.0f));
      // Draw player blip (centerObject)
      switch (mapLocation)
      {
        case 0:
          UnityEngine.GUI.DrawTexture(new Rect(0, 0, radarBG.width,radarBG.height), radarBG);
          mapCenter = new Vector2(radarBG.width / 2, radarBG.height / 2);
          break;
        case 1:
          UnityEngine.GUI.DrawTexture(new Rect(screenWidth - radarBG.width, 0, radarBG.width, radarBG.height), radarBG);
          mapCenter = new Vector2(screenWidth-(radarBG.width / 2), radarBG.height / 2);
          break;
        case 2:
          UnityEngine.GUI.DrawTexture(new Rect(0,screenHeight-radarBG.height, radarBG.width, radarBG.height), radarBG);
          mapCenter = new Vector2(radarBG.width / 2, screenHeight-(radarBG.height / 2));
          break;
        case 3:
          UnityEngine.GUI.DrawTexture(new Rect(screenWidth - radarBG.width, screenHeight - radarBG.height, radarBG.width, radarBG.height), radarBG);
          mapCenter = new Vector2(screenWidth-(radarBG.width / 2),screenHeight-(radarBG.height / 2));
          break;
      }
     
      DrawBlipsFor(tagFilter);
    }

    private void DrawBlipsFor(string tagName)
    {
      // Find all game objects with tag
      GameObject[] gos = GameObject.FindGameObjectsWithTag(tagName);
      // Iterate through them
      foreach (GameObject go in gos)
      {
        drawBlip(go, blip);
      }
    }

    private void drawBlip(GameObject go, Texture aTexture)
    {
      Vector3 centerPos = centerObject.position;
      Vector3 extPos = go.transform.position;

      // first we need to get the distance of the enemy from the player
      float dist = Vector3.Distance(centerPos, extPos);

      float dx = centerPos.x - extPos.x; // how far to the side of the player is the enemy?
      float dz = centerPos.z - extPos.z; // how far in front or behind the player is the enemy?

      // what's the angle to turn to face the enemy - compensating for the player's turning?
      float deltay = Mathf.Atan2(dx, dz) * Mathf.Rad2Deg - 270 - centerObject.eulerAngles.y;

      // just basic trigonometry to find the point x,y (enemy's location) given the angle deltay
      float bX = dist * Mathf.Cos(deltay * Mathf.Deg2Rad);
      float bY = dist * Mathf.Sin(deltay * Mathf.Deg2Rad);

      bX = bX * mapScale; // scales down the x-coordinate by half so that the plot stays within our radar
      bY = bY * mapScale; // scales down the y-coordinate by half so that the plot stays within our radar

      if (dist <= maxDist)
      {
        // this is the diameter of our largest radar circle
        UnityEngine.GUI.DrawTexture(new Rect(mapCenter.x + bX, mapCenter.y + bY, 2, 2), aTexture);
      }
    }
  }