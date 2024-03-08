using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TargetReached : MonoBehaviour
{
      private readonly float targetScore = GameVariables.gameValues["targetScore"];
      [SerializeField] private float resetValue = 0;
      private ItemCollector itemCollector;
      private float currentScore;

      void Start()
      {
            itemCollector = GetComponent<ItemCollector>();
      }

      void Update()
      {
            currentScore = itemCollector.score;
            if (currentScore >= targetScore)
            {
                  string message = "target:reached";
                  WebSocketManager.Instance.SendMessageToServer(message);
                  // Debug.Log(message);

                  // reset score back to resetvalue
                  itemCollector.score = resetValue;
                  itemCollector.UpdateScoreText(resetValue);
            }
      }
}