using UnityEngine;
using TMPro;
using WebSocketSharp;

public class DisplayUniqueCode : MonoBehaviour
{
    public UniqueCodeGenerator codeGenerator; // Reference to the CodeGeneratorHolder GameObject
    public TextMeshProUGUI uniqueCodeText; // Reference to the TextMeshPro component
    private WebSocket ws;


    private void Start()
    {
        if (codeGenerator != null && uniqueCodeText != null)
        {
            // Generate the unique code from the UniqueCodeGenerator script
            string uniqueCode = codeGenerator.GenerateCode();

            // Set the generated unique code to the TextMeshPro component's text
            uniqueCodeText.text = "Unique Code: " + uniqueCode;

            // Initialize WebSocket connection to the server
            ws = new WebSocket("ws://localhost:8080");

            // Register an event handler for the WebSocket's OnOpen event
            ws.OnOpen += (sender, e) =>
            {
                // Send the unique code to the server with the specified format
                string message = $"gameUniqueCode:{uniqueCode}";
                ws.Send(message);
                Debug.Log("Sent unique code to server: " + uniqueCode);
            };

            // Connect to the WebSocket server
            ws.Connect();
        }
        else
        {
            Debug.LogWarning("Missing references in DisplayUniqueCode script.");
        }
    }

    // private void OnDestroy()
    // {
        // Close the WebSocket connection when the script is destroyed
        // if (ws != null && ws.IsAlive)
        // {
            // ws.Close();
        // }
    // }
}
