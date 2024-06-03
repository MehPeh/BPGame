using UnityEngine;

public class ConfigurationLoader : MonoBehaviour
{
      private void Awake()
      {
            LoadComponent<OptionsForNextPoll>(component => component.LoadChangeValuesFromFile());
            LoadComponent<GameVariables>(component => component.LoadGameValuesFromFile());
      }

      private void LoadComponent<ComponentType>(System.Action<ComponentType> loadAction) where ComponentType : MonoBehaviour
      {
            ComponentType component = FindObjectOfType<ComponentType>();
            if (component != null)
            {
                  loadAction(component);
            }
            else
            {
                  Debug.LogError($"{typeof(ComponentType).Name} script not found in the scene!");
            }
      }
}