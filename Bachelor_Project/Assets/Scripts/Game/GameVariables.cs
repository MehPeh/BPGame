using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameVariables : MonoBehaviour
{
      // default variables
      private static readonly Dictionary<string, float> defaultGameValues = new()
      {
            { "playerGravityScale", 3f },
            { "playerJumpForce", 14f },
            { "playerMovementSpeed", 7f },
            { "targetScore", 10f },
            { "trapSpeed", 2f }
      };

      // changeable variables
      public static Dictionary<string, float> gameValues = new()
      {
            { "playerGravityScale", defaultGameValues["playerGravityScale"] },
            { "playerJumpForce", defaultGameValues["playerJumpForce"] },
            { "playerMovementSpeed", defaultGameValues["playerMovementSpeed"] },
            { "targetScore", defaultGameValues["targetScore"] },
            { "trapSpeed", defaultGameValues["trapSpeed"] }
      };

      // Reset variables to default values
      public static void ResetToDefaultValues()
      {
            gameValues["playerGravityScale"] = defaultGameValues["playerGravityScale"];
            gameValues["playerJumpForce"] = defaultGameValues["playerJumpForce"];
            gameValues["playerMovementSpeed"] = defaultGameValues["playerMovementSpeed"];
            gameValues["targetScore"] = defaultGameValues["targetScore"];
            gameValues["trapSpeed"] = defaultGameValues["trapSpeed"];
      }
}