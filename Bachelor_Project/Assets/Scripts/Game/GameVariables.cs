using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameVariables : MonoBehaviour
{
      // default variables
      private static readonly Dictionary<string, float> defaultValues = new()
      {
            { "playerGravityScale", 3f },
            { "playerJumpForce", 14f },
            { "playerMovementSpeed", 7f },
            { "targetScore", 2f },
            { "trapSpeed", 2f }
      };

      // changeable variables
      public static Dictionary<string, float> gameValues = new()
      {
            { "playerGravityScale", defaultValues["playerGravityScale"] },
            { "playerJumpForce", defaultValues["playerJumpForce"] },
            { "playerMovementSpeed", defaultValues["playerMovementSpeed"] },
            { "targetScore", defaultValues["targetScore"] },
            { "trapSpeed", defaultValues["trapSpeed"] }
      };

      // Reset variables to default values
      public static void ResetToDefaultValues()
      {
            gameValues["playerGravityScale"] = defaultValues["playerGravityScale"];
            gameValues["playerJumpForce"] = defaultValues["playerJumpForce"];
            gameValues["playerMovementSpeed"] = defaultValues["playerMovementSpeed"];
            gameValues["targetScore"] = defaultValues["targetScore"];
            gameValues["trapSpeed"] = defaultValues["trapSpeed"];
      }
}