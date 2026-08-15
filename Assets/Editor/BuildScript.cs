using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

public static class BuildScript
{
    public static void BuildWebGL()
    {
        string[] scenes = { "Assets/Scenes/Main.unity" };
        var options = new BuildPlayerOptions
        {
            scenes = scenes,
            locationPathName = "Builds/WebGL",
            target = BuildTarget.WebGL,
            options = BuildOptions.None
        };

        PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Disabled;
        PlayerSettings.WebGL.decompressionFallback = true;
        PlayerSettings.productName = "Drosophila Lab Simulator Prototype";
        PlayerSettings.companyName = "DaedalGames Prototype";

        BuildReport report = BuildPipeline.BuildPlayer(options);
        if (report.summary.result != BuildResult.Succeeded)
        {
            throw new System.Exception($"WebGL build failed: {report.summary.result}");
        }

        Debug.Log($"WebGL build succeeded: {report.summary.totalSize} bytes");
    }
}
