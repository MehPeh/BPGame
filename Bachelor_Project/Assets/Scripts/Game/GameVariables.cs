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
      public static float playerGravityScale = defaultValues["playerGravityScale"];
      public static float playerJumpForce = defaultValues["playerJumpForce"];
      public static float playerMovementSpeed = defaultValues["playerMovementSpeed"];
      public static short targetScore = (short)defaultValues["targetScore"];
      public static float trapSpeed = defaultValues["trapSpeed"];

      // Reset variables to default values
      public static void ResetToDefaultValues()
      {
            playerGravityScale = defaultValues["playerGravityScale"];
            playerJumpForce = defaultValues["playerJumpForce"];
            playerMovementSpeed = defaultValues["playerMovementSpeed"];
            targetScore = (short)defaultValues["targetScore"];
            trapSpeed = defaultValues["trapSpeed"];
      }
}