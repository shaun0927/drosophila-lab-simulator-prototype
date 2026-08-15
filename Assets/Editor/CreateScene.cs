using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

public static class CreateScene
{
    public static void CreateMain()
    {
        var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        var go = new GameObject("PrototypeGame");
        go.AddComponent<PrototypeGame>();
        EditorSceneManager.SaveScene(scene, "Assets/Scenes/Main.unity");
        Debug.Log("Created Assets/Scenes/Main.unity");
    }
}
