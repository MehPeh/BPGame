using UnityEngine;
using TMPro;

public class DisplayUniqueCode : MonoBehaviour
{
      public UniqueCodeGenerator codeGenerator; // Reference to the CodeGeneratorHolder GameObject
      public TextMeshProUGUI uniqueCodeText; // Reference to the TextMeshPro component

      private void Start()
      {
            if (codeGenerator != null)
            {
                  if (uniqueCodeText != null)
                  {
                        // Generate the unique code from the UniqueCodeGenerator script
                        string uniqueCode = codeGenerator.GenerateCode();

                        // Set the generated unique code to the TextMeshPro component's text
                        uniqueCodeText.text = "Unique Code: " + uniqueCode;

                        // Set the unique code in the WebSocketManager
                        WebSocketManager.Instance.SetUniqueCode(uniqueCode);
                  }
                  else
                  {
                        Debug.LogWarning("Missing references in DisplayUniqueCode script. (uniqueCodeText)");
                  }

            }
            else
            {
                  Debug.LogWarning("Missing references in DisplayUniqueCode script. (codeGenerator)");
            }
      }
}