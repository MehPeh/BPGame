using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class TargetGoal : MonoBehaviour
{
        private float targetGoal = GameVariables.gameValues["targetScore"];
        [SerializeField] private Text goalText;

        private void Start()
        {
                UpdateGoalText(targetGoal);
        }
        private void Update()
        {
                targetGoal = GameVariables.gameValues["targetScore"];
                UpdateGoalText(targetGoal);
        }
        public void UpdateGoalText(float number)
        {
            goalText.text = "Goal: " + number;
        }
}