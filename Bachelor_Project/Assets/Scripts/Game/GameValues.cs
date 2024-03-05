using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameValues : MonoBehaviour
{
      // all default values
      [SerializeField] public float playerGravityScale = 3f;
      [SerializeField] public float playerJumpForce = 14f;
      [SerializeField] public float playerMovementSpeed = 7f;
      [SerializeField] public short targetScoreToReach = 2;
      [SerializeField] public float trapSpeed = 2f;
}