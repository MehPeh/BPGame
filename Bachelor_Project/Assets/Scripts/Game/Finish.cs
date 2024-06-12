using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Finish : MonoBehaviour
{
      private AudioSource finishSound;
      private bool levelCompleted = false;

      private void Start()
      {
            finishSound = GetComponent<AudioSource>();
      }

      private void OnTriggerEnter2D(Collider2D collision)
      {
            if (collision.gameObject.name == "Player" && !levelCompleted)
            {
                  Invoke("CompleteLevel", 2f);
                  finishSound.Play();
                  levelCompleted = true;
            }
      }

      private void CompleteLevel()
      {
            int currentSceneIndex = SceneManager.GetActiveScene().buildIndex;
            int nextSceneIndex = (currentSceneIndex + 1) % SceneManager.sceneCountInBuildSettings;

            if (currentSceneIndex == SceneManager.sceneCountInBuildSettings - 1)
            {
                  nextSceneIndex = 1;
            }

            SceneManager.LoadScene(nextSceneIndex);
      }
}