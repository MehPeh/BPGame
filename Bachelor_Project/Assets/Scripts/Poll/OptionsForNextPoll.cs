using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Random = System.Random;

public class OptionsForNextPoll : MonoBehaviour
{
      private static readonly Dictionary<string, float> changeValues = new()
      {
            { "increasePlus", 1.5f },
            { "increase", 1.2f },
            { "decrease", 0.8f },
            { "decreasePlus", 0.66f }
      };

      public static void randomPollCombinationGenerator()
      {
            string randomGameValue = GetRandomKey(GameVariables.gameValues);
            string randomChangeValue = GetRandomKey(changeValues);

            string result = $"{randomGameValue}:{randomChangeValue}";
            Debug.Log(result);
      }

      private static string GetRandomKey(Dictionary<string, float> dictionary)
      {
            System.Random random = new System.Random();
            int randomIndex = random.Next(dictionary.Count);
            string[] keys = new string[dictionary.Count];
            dictionary.Keys.CopyTo(keys, 0);
            return keys[randomIndex];
      }
}
