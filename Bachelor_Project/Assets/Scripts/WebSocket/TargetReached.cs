using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using WebSocketSharp;

public class TargetReached : MonoBehaviour
{
    WebSocket ws;
    [SerializeField] private int targetScore = 10;
    private ItemCollector itemCollector;
    private int currentScore;

    void Start()
    {
        ws = new WebSocket("ws://localhost:8080");
        ws.OnMessage += (sender, e) =>
        {
            Debug.Log("Message received from " + ((WebSocket)sender).Url + ", Data : " + e.Data);
        };
        ws.Connect();
        itemCollector = GetComponent<ItemCollector>();
    }

    void Update()
    {
        if (ws == null)
        {
            return;
        }
        currentScore = itemCollector.score;
        if(currentScore >= targetScore)
        {
            ws.Send("Target score reached!");
            itemCollector.score = 0;
        }
    }
}