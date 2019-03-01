using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Oscillation1D : MonoBehaviour {

    public float amplitude = 1.0f; // Amplitude
    public float speed = 0.5f; // Speed
    private Vector3 startPos;

    // Use this for initialization
    void Start()
    {
        startPos = transform.position; // get current position
    }

    // Update is called once per frame
    void Update()
    {

        Vector3 v = startPos; // get starting position
        v.x = v.x + amplitude * Mathf.Sin(Time.time * speed); // change the x coordinate
        // v.x += amplitude * Mathf.Sin(Time.time * speed); // alt
        transform.position = v; //  update the position

    }
}
