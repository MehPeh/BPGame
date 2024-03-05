using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TargetReached : MonoBehaviour
{
      [SerializeField] private short targetScore = 10;
      [SerializeField] private short resetValue = 0;
      private ItemCollector itemCollector;
      private int currentScore;

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