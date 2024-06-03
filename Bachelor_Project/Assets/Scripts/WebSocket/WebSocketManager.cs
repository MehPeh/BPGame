using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using WebSocketSharp;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class WebSocketManager : MonoBehaviour
{
      private WebSocket ws;
      private string uniqueCode;

      private static WebSocketManager instance;

      public static WebSocketManager Instance
      {
            get
            {
                  if (instance == null)
                  {
                        var go = new GameObject("WebSocketManager");
                        instance = go.AddComponent<WebSocketManager>();
                  }
                  return instance;
            }
      }

      private void Start()
      {
            DontDestroyOnLoad(gameObject);

            // Initialize WebSocket connection to the server
            ws = new WebSocket("ws://localhost:3000");

            // Register event handlers
            ws.OnOpen += OnWebSocketOpen;
            ws.OnMessage += OnWebSocketMessage;

            // Connect to the WebSocket server
            ws.Connect();
      }

      private void OnWebSocketOpen(object sender, EventArgs e)
      {
            Debug.Log("WebSocket connection opened.");
            if (!string.IsNullOrEmpty(uniqueCode))
            {
                  // Send the unique code to the server with the specified format
                  SendMessageToServer(new JObject { { "uniqueCode", uniqueCode } }.ToString());
                  Debug.Log($"Sent unique code to server: {uniqueCode}");
            }
      }

      private void OnWebSocketMessage(object sender, MessageEventArgs messageEventArgs)
      {
            Debug.Log($"Message received from {((WebSocket)sender).Url}, Data: {messageEventArgs.Data}");
            HandleMessage(messageEventArgs.Data);
      }

      public void SetUniqueCode(string newCode)
      {
            uniqueCode = newCode;
      }

      private void HandleMessage(string message)
      {
            JObject jsonData;
            try
            {
                  jsonData = JObject.Parse(message);
            }
            catch (Exception ex)
            {
                  Debug.LogError($"Failed to parse message: {ex.Message}");
                  return;
            }

            if (jsonData.TryGetValue("state", out JToken stateToken))
            {
                  string state = stateToken.ToString();
                  Debug.Log($"Handler received data: {state} correctly");
            }
            else if (jsonData.TryGetValue("pollResult", out JToken pollResultToken))
            {
                  var pollResultObject = (JObject)pollResultToken;
                  foreach (var property in pollResultObject.Properties())
                  {
                        string key = property.Name;
                        string value = property.Value.ToString();

                        Debug.Log($"Poll result received: Key: {key}, Value: {value}");
                        float floatValue = OptionsForNextPoll.LookupChangeValue(value);
                        if (GameVariables.gameValues.ContainsKey(key))
                        {
                              GameVariables.gameValues[key] *= floatValue;
                              Debug.Log($"Multiplied {key} with {floatValue}");
                        }
                        else
                        {
                              Debug.LogError($"Key '{key}' not found in gameValues dictionary.");
                        }
                  }
            }
            else
            {
                  Debug.Log($"Unknown message format: {message}");
            }
      }

      public void SendMessageToServer(string jsonMessage)
      {
            if (ws?.IsAlive == true)
            {
                  ws.Send(jsonMessage);
                  Debug.Log($"Sent message to server: {jsonMessage}");
            }
      }

      private void OnDestroy()
      {
            // Close the WebSocket connection when the script is destroyed
            if (ws?.IsAlive == true)
            {
                  // Send a message to the server to set the unique code to null before closing the connection
                  SendMessageToServer(new JObject { { "uniqueCode", "null" } }.ToString());

                  // Reset the changed game variables
                  GameVariables.ResetToDefaultValues();

                  // Close the WebSocket connection
                  ws.Close();
                  Debug.Log("Sent message to set unique code to null, reset gamevalues and closed the connection.");
            }
      }
}