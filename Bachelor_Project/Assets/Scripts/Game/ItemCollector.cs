using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ItemCollector : MonoBehaviour
{
      private string playerPrefsKey = "PlayerScore";

      public short score = 0;
      [SerializeField] private Text collectablesText;
      [SerializeField] private AudioSource collectionSoundEffect;

      private void Start()
      {
            score = (short)PlayerPrefs.GetInt(playerPrefsKey, 0);
            UpdateScoreText(score);
      }

      private void OnTriggerEnter2D(Collider2D collision)
      {
            if (collision.gameObject.CompareTag("Collectables"))
            {
                  // Debug.Log("Item Destroyed");
                  Destroy(collision.gameObject);
                  score++;
                  UpdateScoreText(score);
                  collectionSoundEffect.Play();
            }
      }

      public void UpdateScoreText(short number)
      {
            collectablesText.text = "Score: " + number;
      }

      private void OnDestroy()
      {
            PlayerPrefs.SetInt(playerPrefsKey, score);
            PlayerPrefs.Save();
      }
}