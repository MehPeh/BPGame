using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class PlayerLife : MonoBehaviour
{
      private Rigidbody2D rb;
      private Animator anim;

      [SerializeField] private AudioSource deathSoundEffect;

      private void Start()
      {
            rb = GetComponent<Rigidbody2D>();
            anim = GetComponent<Animator>();
      }
      private void OnCollisionEnter2D(Collision2D collision)
      {
            if(collision.gameObject.tag == "Trap")
            {
                  Die();
            }
      }
      private void Die()
      {
            // Disable the Rigidbody2D component
            rb.velocity = Vector2.zero; // Stop any remaining velocity
            rb.gravityScale = 0f; // Disable gravity if needed
            rb.simulated = false;
        
            anim.SetTrigger("Death");
            deathSoundEffect.Play();
            StartCoroutine(RestartLevelAfterDelay(0.8f));
      }

      private IEnumerator RestartLevelAfterDelay(float delay)
      {
            yield return new WaitForSeconds(delay);
            RestartLevel();
      }

      private void RestartLevel()
      {
            SceneManager.LoadScene(SceneManager.GetActiveScene().name);
      }
}
