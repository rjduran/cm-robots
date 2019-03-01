using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System; // To use Serializable
using SocketIO;

// https://docs.unity3d.com/Manual/JSONSerialization.html

[Serializable]
public class MyClass
{
    public string hello;
}
public class MyRecClass
{
    public string raw;
    public string rawScaled;
}
public class MySendClass
{
    public float raw;
}

public class NetworkManager : MonoBehaviour {

    // define a new socket
    public SocketIOComponent socket;

    // make an instance of the MyClass
    MyClass myObject = new MyClass();

    // make an instance of the MyRecClass
    MyRecClass myRecObject = new MyRecClass();

    // make an instance of the MySendClass
    MySendClass mySendObject = new MySendClass();


    // GameObjects to manipulate
    // object to scale with physical input device (sensor)
    public GameObject myScaledObject;
    private Vector3 s;

    // object to use to drive physical output device (servo)
    public GameObject myServoObject;
    private Vector3 curPos;

    // Use this for initialization
    void Start () {
        
        // setup handler for messages from server using callback function
        socket.On("message", msgData);

        // receive sensor data and print it out to console
        socket.On("sensor", scaleObject);

    }

    // callback function for "message" handler
    void msgData(SocketIOEvent e) {

        // print to unity console the incoming message
        Debug.Log(e.data.ToString());
    }

    // callback function for "sensor" handler
    void scaleObject(SocketIOEvent e) {
        // print to unity console the incoming message
        Debug.Log(e.data.ToString());

        // unpack json data
        myRecObject = JsonUtility.FromJson<MyRecClass>(e.data.ToString());

        //Debug.Log(myRecObject.raw);
        //Debug.Log(myRecObject.rawScaled);

        float raw = float.Parse(myRecObject.raw); // convert string to float
        float rawScaled = float.Parse(myRecObject.rawScaled); // convert string to float

        // create a vector and update it with values from sensor
        //s = new Vector3(raw, raw, raw);
        s = new Vector3(rawScaled, rawScaled, rawScaled);
        //s = new Vector3(2.0f, 2.0f, 2.0f);

    }

   

    // Update is called once per frame
    void Update () {

        // update scale of myScaledObject
        myScaledObject.transform.localScale = s;

        // Create JSONObject to and send data to server when the 's' key is pressed
        if (Input.GetKeyDown(KeyCode.S)) {

            myObject.hello = "hello from unity";

            string s = JsonUtility.ToJson(myObject);
            JSONObject json = new JSONObject(s);
            socket.Emit("unity", json);
        }

        // watch for changes to myServoObject
        // when it changes, send an update over sockets
        // get current position of object
        curPos = myServoObject.transform.position;
        //Debug.Log(curPos);
        // put it into an object
        mySendObject.raw = curPos.x; // send the x coordinate
        //convert to json and send
        string cp = JsonUtility.ToJson(mySendObject);
        Debug.Log(cp);
        JSONObject json2 = new JSONObject(cp);
        socket.Emit("servo", json2);

        

    }
}
