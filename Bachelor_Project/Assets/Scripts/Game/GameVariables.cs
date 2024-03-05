using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameVariables : MonoBehaviour
{
      // default variables
      private static Dictionary<string, float> defaultValues = new Dictionary<string, float>()
      {
            { "playerGravityScale", 3f },
            { "playerJumpForce", 14f },
            { "playerMovementSpeed", 7f },
            { "scoreTarget", 2f },
            { "trapSpeed", 2f }
      };


      // changeable variables
      public static float playerGravityScale = defaultValues["playerGravityScale"];
      public static float playerJumpForce = defaultValues["playerJumpForce"];
      public static float playerMovementSpeed = defaultValues["playerMovementSpeed"];
      public static short scoreTarget = (short)defaultValues["scoreTarget"];
      public static float trapSpeed = defaultValues["trapSpeed"];

      // Reset variables to default values
      public static void ResetToDefaultValues()
      {
            playerGravityScale = defaultValues["playerGravityScale"];
            playerJumpForce = defaultValues["playerJumpForce"];
            playerMovementSpeed = defaultValues["playerMovementSpeed"];
            scoreTarget = (short)defaultValues["scoreTarget"];
            trapSpeed = defaultValues["trapSpeed"];
      }
}