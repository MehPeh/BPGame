using UnityEngine;

public class ConfigurationLoader : MonoBehaviour
{
      private void Awake()
      {
            // Find the OptionsForNextPoll component in the scene
            OptionsForNextPoll optionsForNextPoll = FindObjectOfType<OptionsForNextPoll>();

            if (optionsForNextPoll != null)
            {
                  optionsForNextPoll.LoadChangeValuesFromFile();
            }
            else
            {
                  Debug.LogError("OptionsForNextPoll script not found in the scene!");
            }
      }
}