using UnityEngine;
using TMPro;

public class DisplayUniqueCodeInGame : MonoBehaviour
{
    public TextMeshProUGUI uniqueCodeText;

    private void Start()
    {
        // Retrieve the unique code from PlayerPrefs
        string uniqueCode = PlayerPrefs.GetString("UniqueCode", "DefaultUniqueCode");

        // Set the unique code to the TextMeshPro component's text
        uniqueCodeText.text = "Unique Code: " + uniqueCode;
    }
}