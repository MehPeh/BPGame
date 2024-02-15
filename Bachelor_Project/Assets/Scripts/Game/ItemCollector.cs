using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ItemCollector : MonoBehaviour
{
    public int score = 0;
    [SerializeField] private Text collectablesText;
    [SerializeField] private AudioSource collectionSoundEffect;
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if(collision.gameObject.CompareTag("Collectables"))
        {
            Debug.Log("Item Destroyed");
            Destroy(collision.gameObject);
            score++;
            collectablesText.text = "Score: " + score;
            collectionSoundEffect.Play();
        }
    }
}
