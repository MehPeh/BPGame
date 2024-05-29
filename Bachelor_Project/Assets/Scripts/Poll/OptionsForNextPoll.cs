using System.IO;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Random = System.Random;
using Newtonsoft.Json.Linq;

public class OptionsForNextPoll : MonoBehaviour
{
      private static Dictionary<string, float> changeValues = new();

      public void LoadChangeValuesFromFile()
      {
            string filePath = Path.Combine(Application.dataPath, "Scripts", "configuration.json");
            Debug.Log($"Loading configuration file from: {filePath}");

            if (File.Exists(filePath))
            {
                  string json = File.ReadAllText(filePath);
                  JObject config = JObject.Parse(json);

                  if (config.ContainsKey("changes"))
                  {
                        changeValues = config["changes"].ToObject<Dictionary<string, float>>();
                        Debug.Log("Change values loaded successfully.");
                  }
                  else
                  {
                        Debug.LogError("No 'changes' section found in configuration file!");
                  }
            }
            else
            {
                  Debug.LogError("Configuration file not found!");
            }
      }

      public static string GenerateNextPollOptions()
      {
            JObject pollOptions = new JObject();

            HashSet<string> generatedCombinations = new HashSet<string>();

            for (int i = 1; i <= 4; i++)
            {
                  string randomGameValue;
                  string randomChangeValue;
                  string combination;

                  do
                  {
                        randomGameValue = GetRandomKey(GameVariables.gameValues);
                        randomChangeValue = GetRandomKey(changeValues);
                        combination = $"{randomGameValue},{randomChangeValue}";
                  } while (generatedCombinations.Contains(combination));

                  generatedCombinations.Add(combination);

                  JObject option = new JObject
                  {
                        { randomGameValue, randomChangeValue }
                  };

                  pollOptions.Add($"option{i}", option);
            }

            JObject result = new JObject
            {
                  { "pollOptions", pollOptions }
            };

            string jsonResult = result.ToString(Newtonsoft.Json.Formatting.None);
            // Debug.Log(jsonResult);

            return jsonResult;
      }

      private static string GetRandomKey(Dictionary<string, float> dictionary)
      {
            System.Random random = new System.Random();
            int randomIndex = random.Next(dictionary.Count);
            string[] keys = new string[dictionary.Count];
            dictionary.Keys.CopyTo(keys, 0);
            return keys[randomIndex];
      }

      public static float LookupChangeValue(string stringValue)
      {
            if (changeValues.ContainsKey(stringValue))
            {
                  return changeValues[stringValue];
            }
            else
            {
                  Debug.LogError($"Value '{stringValue}' not found in changeValues dictionary.");
            return 1f;
            }
      }
}