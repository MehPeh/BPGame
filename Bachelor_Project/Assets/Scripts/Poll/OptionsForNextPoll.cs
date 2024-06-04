using System.IO;
using System.Collections.Generic;
using UnityEngine;
using Random = System.Random;
using Newtonsoft.Json.Linq;

public class OptionsForNextPoll : MonoBehaviour
{
      private static Dictionary<string, float> changeValues = new();
      private static int pollOptionAmount = 4; // Default value if not set in the configuration file

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

                  if (config.ContainsKey("poll_option_amount"))
                  {
                        pollOptionAmount = config["poll_option_amount"].ToObject<int>();
                        Debug.Log($"Poll option amount loaded successfully: {pollOptionAmount}");
                  }
                  else
                  {
                        Debug.LogWarning("No 'poll_option_amount' found in configuration file! Using default value: 4");
                  }
            }
            else
            {
                  Debug.LogError("Configuration file not found!");
            }
      }

      public static string GenerateNextPollOptions()
      {
            JObject pollOptions = new();
            HashSet<string> generatedCombinations = new();

            for (int i = 1; i <= pollOptionAmount; i++)
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

                  JObject option = new()
                  {
                        { randomGameValue, randomChangeValue }
                  };

                  pollOptions.Add($"option{i}", option);
            }

            JObject result = new()
            {
                  { "pollOptions", pollOptions }
            };

            string jsonResult = result.ToString(Newtonsoft.Json.Formatting.None);
            return jsonResult;
      }

      private static string GetRandomKey(Dictionary<string, float> dictionary)
      {
            Random random = new();
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
