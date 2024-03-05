using UnityEngine;
using WebSocketSharp;

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
                        GameObject go = new GameObject("WebSocketManager");
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

            // Register an event handler for the WebSocket's OnOpen event
            ws.OnOpen += (sender, e) =>
            {
                  Debug.Log("WebSocket connection opened.");
                  if (!string.IsNullOrEmpty(uniqueCode))
                  {
                        // Send the unique code to the server with the specified format
                        string message = $"uniqueCode:{uniqueCode}";
                        ws.Send(message);
                        Debug.Log("Sent unique code to server: " + uniqueCode);
                  }
            };

            ws.OnMessage += (sender, e) =>
            {
                  Debug.Log("Message received from " + ((WebSocket)sender).Url + ", Data : " + e.Data);
            };

            // Connect to the WebSocket server
            ws.Connect();
      }

      public void SetUniqueCode(string newCode)
      {
            uniqueCode = newCode;
            // Debug.Log("Set the Unique code to: " + newCode);
      }

      public void SendMessageToServer(string message)
      {
            if (ws != null && ws.IsAlive)
            {
                  ws.Send(message);
                  Debug.Log("Sent message to server: " + message);
            }
      }

      private void OnDestroy()
      {
            // Close the WebSocket connection when the script is destroyed
            if (ws != null && ws.IsAlive)
            {
                  // Send a message to the server to set the unique code to null before closing the connection
                  string message = "uniqueCode:null";
                  ws.Send(message);

                  // Close the WebSocket connection
                  ws.Close();
                  Debug.Log("Sent message to set unique code to null and closed the connection.");
            }
      }
}
