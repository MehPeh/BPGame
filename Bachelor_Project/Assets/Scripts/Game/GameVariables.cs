using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using Newtonsoft.Json.Linq;

public class GameVariables : MonoBehaviour
{
      private static Dictionary<string, float> defaultGameValues = new Dictionary<string, float>();
      public static Dictionary<string, float> gameValues = new Dictionary<string, float>();

      public void LoadGameValuesFromFile()
      {
            string filePath = Path.Combine(Application.dataPath, "Scripts", "configuration.json");
            Debug.Log($"Loading configuration file from: {filePath}");

            if (File.Exists(filePath))
            {
                  string json = File.ReadAllText(filePath);
                  JObject config = JObject.Parse(json);

                  if (config.ContainsKey("game_values"))
                  {
                        defaultGameValues = config["game_values"].ToObject<Dictionary<string, float>>();
                        gameValues = new Dictionary<string, float>(defaultGameValues);
                        Debug.Log("Game values loaded successfully.");
                  }
                  else
                  {
                        Debug.LogError("No 'game_values' section found in configuration file!");
                  }
            }
            else
            {
                  Debug.LogError("Configuration file not found!");
            }
      }

      // Reset variables to default values
      public static void ResetToDefaultValues()
      {
            foreach (var key in defaultGameValues.Keys)
            {
                  gameValues[key] = defaultGameValues[key];
            }
      }
}