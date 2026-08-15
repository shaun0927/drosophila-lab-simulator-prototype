using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class PrototypeGame : MonoBehaviour
{
    enum Phase { TraitSelection, Discovery, Assay, Figure, Reviewer, FinalChoice, Result }

    [Serializable]
    class Trait
    {
        public string Name;
        public string Flavor;
        public string[] Tags;
        public int Evidence, Weirdness, Credibility, Hype, Suspicion;
    }

    class Phenomenon
    {
        public string Name, Requires, Visual, ReviewerWeakness;
        public string[] Tags;
        public int Evidence, Weirdness, Credibility, Hype, Suspicion;
    }

    class Choice
    {
        public string Label, Detail;
        public int Time, Budget, Evidence, Weirdness, Credibility, Hype, Suspicion;
        public Action Extra;
    }

    readonly List<Trait> traits = new();
    readonly List<Phenomenon> phenomena = new();
    readonly List<Trait> selected = new();
    readonly List<string> log = new();

    Phase phase = Phase.TraitSelection;
    Phenomenon currentPhenomenon;
    string paperTitle = "Untitled Figure";
    string reviewerLine = "";
    string resultTitle = "";
    string resultBody = "";
    int time = 300, budget = 100;
    int evidence, weirdness, credibility, hype, suspicion;
    Vector2 traitScroll, logScroll;

    GUIStyle titleStyle, subtitleStyle, bodyStyle, smallStyle, buttonStyle, statStyle, panelStyle, selectedButtonStyle;
    Texture2D whiteTex;

    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
    static void Bootstrap()
    {
        if (FindObjectOfType<PrototypeGame>() == null)
            new GameObject("PrototypeGame").AddComponent<PrototypeGame>();
    }

    void Awake()
    {
        SeedData();
        AddLog("PI: We need a publishable behavior by midnight. Make the flies do something weird. Then make it look rigorous.");
    }

    void Start()
    {
        StartCoroutine(AutoDemo());
    }

    IEnumerator AutoDemo()
    {
        yield return new WaitForSeconds(1.5f);
        if (phase != Phase.TraitSelection || selected.Count > 0) yield break;
        selected.Clear();
        selected.Add(traits.First(t => t.Name == "Blue Light Switch"));
        selected.Add(traits.First(t => t.Name == "Hyperactive Motor Circuit"));
        selected.Add(traits.First(t => t.Name == "Social Bias"));
        AddLog("Auto-demo selected the recommended first-run combo.");
        CreateMutantLine();
    }

    void EnsureStyles()
    {
        if (whiteTex == null)
        {
            whiteTex = new Texture2D(1, 1);
            whiteTex.SetPixel(0, 0, Color.white);
            whiteTex.Apply();
        }
        if (titleStyle != null) return;

        titleStyle = new GUIStyle(GUI.skin.label) { fontSize = 30, fontStyle = FontStyle.Bold, normal = { textColor = new Color(.96f,.92f,.82f) } };
        subtitleStyle = new GUIStyle(GUI.skin.label) { fontSize = 17, fontStyle = FontStyle.Italic, normal = { textColor = new Color(.82f,.76f,.66f) } };
        bodyStyle = new GUIStyle(GUI.skin.label) { fontSize = 18, wordWrap = true, richText = true, normal = { textColor = new Color(.94f,.93f,.88f) } };
        smallStyle = new GUIStyle(GUI.skin.label) { fontSize = 14, wordWrap = true, richText = true, normal = { textColor = new Color(.78f,.84f,.78f) } };
        statStyle = new GUIStyle(GUI.skin.label) { fontSize = 16, fontStyle = FontStyle.Bold, alignment = TextAnchor.MiddleRight, normal = { textColor = new Color(.82f,.92f,1f) } };
        buttonStyle = new GUIStyle(GUI.skin.button) { fontSize = 15, wordWrap = true, alignment = TextAnchor.MiddleLeft, padding = new RectOffset(12,12,8,8) };
        selectedButtonStyle = new GUIStyle(buttonStyle) { normal = { textColor = new Color(.9f,1f,.65f) } };
        panelStyle = new GUIStyle(GUI.skin.box);
        panelStyle.normal.background = whiteTex;
        panelStyle.normal.textColor = Color.white;
    }

    void OnGUI()
    {
        try
        {
            OnGUIImpl();
        }
        catch (Exception ex)
        {
            if (whiteTex == null)
            {
                whiteTex = new Texture2D(1, 1);
                whiteTex.SetPixel(0, 0, Color.white);
                whiteTex.Apply();
            }
            GUI.color = new Color(.08f, .02f, .02f, 1);
            GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), whiteTex);
            GUI.color = Color.white;
            GUI.Label(new Rect(30, 30, Screen.width - 60, Screen.height - 60), "Prototype UI exception:\n" + ex);
        }
    }

    void OnGUIImpl()
    {
        EnsureStyles();
        DrawBackground();

        float w = Screen.width;
        float h = Screen.height;
        var header = new Rect(18, 14, w - 36, 92);
        var left = new Rect(18, 118, w * .60f - 28, h - 180);
        var right = new Rect(w * .60f + 6, 118, w * .40f - 24, h - 180);
        var footer = new Rect(18, h - 52, w - 36, 38);

        DrawPanel(header, new Color(.12f,.10f,.16f,.95f));
        GUI.Label(new Rect(header.x + 18, header.y + 10, header.width * .62f, 38), "Drosophila Lab Simulator", titleStyle);
        GUI.Label(new Rect(header.x + 20, header.y + 52, header.width * .62f, 28), "Publish or Perish — WebGL Vertical Slice", subtitleStyle);
        GUI.Label(new Rect(header.x + header.width * .58f, header.y + 12, header.width * .40f, 68), StatLine(), statStyle);

        DrawPanel(left, new Color(.09f,.10f,.12f,.96f));
        GUILayout.BeginArea(new Rect(left.x + 18, left.y + 16, left.width - 36, left.height - 32));
        DrawPhaseBody();
        GUILayout.EndArea();

        DrawPanel(right, new Color(.07f,.09f,.11f,.96f));
        GUILayout.BeginArea(new Rect(right.x + 18, right.y + 14, right.width - 36, 34));
        GUILayout.Label("Live Assay Chamber", subtitleStyle);
        GUILayout.EndArea();
        DrawChamber(new Rect(right.x + 18, right.y + 54, right.width - 36, right.height * .58f));
        GUILayout.BeginArea(new Rect(right.x + 18, right.y + right.height * .66f, right.width - 36, right.height * .30f));
        GUILayout.Label("Lab Log", subtitleStyle);
        logScroll = GUILayout.BeginScrollView(logScroll);
        GUILayout.Label(string.Join("\n", log.TakeLast(9)), smallStyle);
        GUILayout.EndScrollView();
        GUILayout.EndArea();

        DrawPanel(footer, new Color(.10f,.08f,.10f,.95f));
        GUI.Label(new Rect(footer.x + 16, footer.y + 8, footer.width - 32, footer.height - 12), "Core question: make the phenomenon more believable, or more sensational?", subtitleStyle);
    }

    void DrawBackground()
    {
        GUI.color = new Color(.055f,.06f,.07f,1);
        GUI.DrawTexture(new Rect(0,0,Screen.width,Screen.height), whiteTex);
        GUI.color = Color.white;
    }

    void DrawPanel(Rect r, Color c)
    {
        GUI.color = c;
        GUI.Box(r, GUIContent.none, panelStyle);
        GUI.color = Color.white;
    }

    string StatLine() => $"Time {time}s   Budget ${budget}\nEvidence {evidence} | Weird {weirdness} | Cred {credibility}\nHype {hype} | Suspicion {suspicion}";

    void DrawPhaseBody()
    {
        switch (phase)
        {
            case Phase.TraitSelection: DrawTraitSelection(); break;
            case Phase.Discovery: DrawDiscovery(); break;
            case Phase.Assay: DrawAssay(); break;
            case Phase.Figure: DrawFigure(); break;
            case Phase.Reviewer: DrawReviewer(); break;
            case Phase.FinalChoice: DrawFinalChoice(); break;
            case Phase.Result: DrawResult(); break;
        }
    }

    bool BigButton(string label, string detail)
    {
        return GUILayout.Button($"{label}\n<size=13><color=#c8c4b8>{detail}</color></size>", buttonStyle, GUILayout.MinHeight(54));
    }

    void DrawTraitSelection()
    {
        GUILayout.Label("<b>Step 1 — Select 3 traits</b>\nPI: “Make the flies do something weird. Then make it look rigorous.”\n\nGoal: discover one abnormal behavior, gather evidence, frame the figure, and submit before midnight.", bodyStyle);
        GUILayout.Label($"Selected traits: {selected.Count}/3  " + (selected.Count == 0 ? "[empty] [empty] [empty]" : string.Join("  |  ", selected.Select(t => t.Name))), subtitleStyle);
        if (GUILayout.Button("START RECOMMENDED FIRST RUN\nBlue Light + Hyperactive + Social Bias", selectedButtonStyle, GUILayout.Height(54)))
        {
            selected.Clear();
            selected.Add(traits.First(t => t.Name == "Blue Light Switch"));
            selected.Add(traits.First(t => t.Name == "Hyperactive Motor Circuit"));
            selected.Add(traits.First(t => t.Name == "Social Bias"));
            AddLog("Recommended first-run combo selected.");
            CreateMutantLine();
        }
        if (selected.Count == 3)
        {
            if (GUILayout.Button("CREATE MUTANT LINE → DISCOVER BEHAVIOR\nPossible behavior: ???", selectedButtonStyle, GUILayout.Height(62)))
                CreateMutantLine();
        }
        else
        {
            GUILayout.Label($"Select {3 - selected.Count} more trait(s) to unlock mutant creation.", smallStyle);
        }
        GUILayout.Space(6);

        for (int row = 0; row < 3; row++)
        {
            GUILayout.BeginHorizontal();
            for (int col = 0; col < 3; col++)
            {
                int idx = row * 3 + col;
                var trait = traits[idx];
                bool isSelected = selected.Contains(trait);
                string label = (isSelected ? "✓ " : "+ ") + trait.Name + "\n" + trait.Flavor;
                if (GUILayout.Button(label, isSelected ? selectedButtonStyle : buttonStyle, GUILayout.Height(58), GUILayout.ExpandWidth(true)))
                    ToggleTrait(trait);
            }
            GUILayout.EndHorizontal();
        }

        GUILayout.Space(8);
        GUI.enabled = selected.Count == 3;
        string detail = selected.Count == 3 ? "Possible behavior: ???" : $"Select {3 - selected.Count} more trait(s) to unlock";
        if (BigButton("Create Mutant Line", detail)) CreateMutantLine();
        GUI.enabled = true;
        GUILayout.Label("First-run suggestion: Blue Light Switch + Hyperactive Motor Circuit + Social Bias.", smallStyle);
    }

    void DrawDiscovery()
    {
        GUILayout.Label($"<b>NEW PHENOMENON DISCOVERED</b>\n\n<size=28>{currentPhenomenon.Name}</size>\n\nObserved visual: {currentPhenomenon.Visual}.\n\nNow decide whether to make this result believable or sensational.", bodyStyle);
        GUILayout.Space(12);
        if (BigButton("Proceed to Assays", "Collect evidence, hype, or control data")) phase = Phase.Assay;
    }

    void DrawAssay()
    {
        GUILayout.Label($"<b>Assay phase:</b> {currentPhenomenon.Name}\n\nMore evidence makes the claim believable. Flashier recordings make it publishable. Time and budget are limited. Choose one or more, then frame the figure.", bodyStyle);
        ChoiceButton(new Choice { Label="Quick Replicate", Detail="Fast n boost. Evidence +15, Suspicion +5", Time=-20, Budget=-5, Evidence=15, Suspicion=5, Extra=()=> AddLog("Quick replicate: the effect appears again, technically.") }, true);
        ChoiceButton(new Choice { Label="Careful Control", Detail="Safer science. Evidence +25, Credibility +20, Hype -5", Time=-45, Budget=-15, Evidence=25, Credibility=20, Hype=-5, Extra=()=> AddLog("Careful control: less exciting, more defensible.") }, true);
        ChoiceButton(new Choice { Label="Flashy Recording", Detail="Great GIF. Hype +25, Evidence +5, Suspicion +10", Time=-25, Budget=-10, Evidence=5, Hype=25, Suspicion=10, Extra=()=> AddLog("Flashy recording: the lab Slack loses its mind.") }, true);
        GUILayout.Space(10);
        if (BigButton("Frame the Figure", "Package the result as a paper claim")) phase = Phase.Figure;
    }

    void DrawFigure()
    {
        GUILayout.Label("<b>Figure framing.</b> Same behavior, different academic audacity. Choose how hard to sell the finding.", bodyStyle);
        ChoiceButton(new Choice { Label="Conservative Figure", Detail="Blue Light Modulates Locomotor Synchrony. Cred +25, Hype -10, Susp -10", Credibility=25, Hype=-10, Suspicion=-10, Extra=()=> paperTitle="Blue Light Modulates Locomotor Synchrony in Engineered Drosophila" });
        ChoiceButton(new Choice { Label="Big Claim Figure", Detail="A Neural Switch for Collective Decision-Making. Hype +30, Weird +10, Susp +20", Hype=30, Weirdness=10, Suspicion=20, Extra=()=> paperTitle="A Neural Switch for Collective Decision-Making in Drosophila" });
        ChoiceButton(new Choice { Label="Beautiful But Vague Figure", Detail="Emergent Behavioral Dynamics. Hype +20, Cred +5, Susp +10", Hype=20, Credibility=5, Suspicion=10, Extra=()=> paperTitle="Emergent Behavioral Dynamics in Engineered Flies" });
        ChoiceButton(new Choice { Label="Data Massage", Detail="Satirical risky option. Evidence +10, Cred +15, Susp +30", Evidence=10, Credibility=15, Suspicion=30, Extra=()=> paperTitle="Robust Evidence for Social Phototaxis in Drosophila" });
    }

    void DrawReviewer()
    {
        reviewerLine = PickReviewerLine();
        GUILayout.Label($"<b>Reviewer #2 attacks your framing:</b>\n\n<size=24>“{reviewerLine}”</size>\n\nRespond without destroying the claim.", bodyStyle);
        ChoiceButton(new Choice { Label="Add Speculative Model Diagram", Detail="Cred +10, Hype +5, Susp +10", Credibility=10, Hype=5, Suspicion=10, Extra=()=> AddLog("You add arrows. So many arrows.") });
        ChoiceButton(new Choice { Label="Weaken the Title", Detail="Cred +20, Hype -20, Susp -10", Credibility=20, Hype=-20, Suspicion=-10, Extra=()=> AddLog("The title becomes responsible. The PI sighs.") });
        ChoiceButton(new Choice { Label="Invoke Mushroom Body", Detail="Cred +5, Hype +5, Susp +5", Credibility=5, Hype=5, Suspicion=5, Extra=()=> AddLog("Mushroom body invoked. Reviewer confusion rises.") });
    }

    void DrawFinalChoice()
    {
        int acceptance = Mathf.Clamp((evidence + credibility - suspicion + 40) / 2, 5, 95);
        int viral = Mathf.Clamp((hype + weirdness - suspicion/2) / 2, 0, 95);
        int scandal = Mathf.Clamp(suspicion + hype/3 - evidence/3, 0, 95);
        GUILayout.Label($"<b>Final call before midnight.</b>\n\nPredicted acceptance: {acceptance}%\nPredicted viral chance: {viral}%\nPredicted scandal chance: {scandal}%\n\nSubmit now or risk one more polish pass?", bodyStyle);
        if (BigButton("Submit Manuscript", "End run and receive verdict")) Submit();
        ChoiceButton(new Choice { Label="Run One More Assay", Detail="Time -40, Budget -15, Evidence +20, Cred +5", Time=-40, Budget=-15, Evidence=20, Credibility=5, Extra=()=> AddLog("One more assay. It is always one more assay.") }, true);
        ChoiceButton(new Choice { Label="Polish Figure", Detail="Time -25, Hype +10, Cred +5", Time=-25, Hype=10, Credibility=5, Extra=()=> AddLog("The figure now looks 17% more inevitable.") }, true);
    }

    void DrawResult()
    {
        GUILayout.Label($"<b><size=28>{resultTitle}</size></b>\n\n<i>{paperTitle}</i>\n\n{resultBody}\n\nFinal stats:\nEvidence {evidence}\nWeirdness {weirdness}\nCredibility {credibility}\nHype {hype}\nSuspicion {suspicion}\n\nImpact Score: {ImpactScore()}", bodyStyle);
        GUILayout.Space(12);
        if (BigButton("Run Another Experiment", "Try different traits and chase another ending")) ResetRun();
    }

    void ChoiceButton(Choice c, bool stay = false)
    {
        if (!BigButton(c.Label, c.Detail)) return;
        time += c.Time; budget += c.Budget;
        AddStats(c.Evidence, c.Weirdness, c.Credibility, c.Hype, c.Suspicion);
        c.Extra?.Invoke();
        if (time <= 0 || budget <= 0) { Submit(); return; }
        if (!stay)
        {
            if (phase == Phase.Figure) phase = Phase.Reviewer;
            else if (phase == Phase.Reviewer) phase = Phase.FinalChoice;
        }
    }

    void DrawChamber(Rect r)
    {
        DrawPanel(r, new Color(.015f,.025f,.04f,1));
        if (currentPhenomenon == null)
        {
            GUI.Label(new Rect(r.x + 18, r.y + 18, r.width - 36, 80), "No mutant line yet.\nChoose traits to discover what the flies do.", bodyStyle);
            return;
        }
        GUI.color = new Color(.2f,.45f,1f,.22f + .12f * Mathf.Sin(Time.time * 3));
        GUI.DrawTexture(new Rect(r.x + r.width*.38f, r.y + 20, r.width*.24f, r.height - 40), whiteTex);
        GUI.color = Color.white;
        Vector2 center = new(r.x + r.width/2, r.y + r.height/2);
        for (int i = 0; i < 34; i++)
        {
            float a = Time.time * (currentPhenomenon.Name.Contains("Dance") ? 1.8f : 1f) + i * .57f;
            float radius = 58 + (i % 8) * 13;
            float x = Mathf.Cos(a + i) * radius + Mathf.Sin(a * .37f + i) * 25;
            float y = Mathf.Sin(a * 1.2f + i) * radius * .55f + Mathf.Cos(a * .21f + i) * 35;
            if (currentPhenomenon.Name.Contains("Wall")) { x = Mathf.Sin(a+i) * r.width*.42f; y = r.height*.34f * Mathf.Sign(Mathf.Sin(a*.35f+i)); }
            if (currentPhenomenon.Name.Contains("Spiral")) { float rr = (i*8 + (Time.time*30)%120); x = Mathf.Cos(a)*rr; y = Mathf.Sin(a)*rr*.55f; }
            Rect dot = new(center.x + x, center.y + y, 8, 8);
            GUI.color = i % 5 == 0 ? new Color(.35f,.65f,1f) : new Color(.92f,.84f,.38f);
            GUI.DrawTexture(dot, whiteTex);
        }
        GUI.color = Color.white;
        GUI.Label(new Rect(r.x + 14, r.y + r.height - 44, r.width - 28, 30), currentPhenomenon.Name + " — " + currentPhenomenon.Visual, smallStyle);
    }

    void ToggleTrait(Trait trait)
    {
        if (selected.Contains(trait))
        {
            selected.Remove(trait);
            return;
        }
        if (selected.Count < 3)
        {
            selected.Add(trait);
            AddLog("Trait selected: " + trait.Name + ".");
        }
    }

    void CreateMutantLine()
    {
        foreach (var t in selected) AddStats(t.Evidence, t.Weirdness, t.Credibility, t.Hype, t.Suspicion);
        time -= 35; budget -= 15;
        currentPhenomenon = ResolvePhenomenon();
        AddStats(currentPhenomenon.Evidence, currentPhenomenon.Weirdness, currentPhenomenon.Credibility, currentPhenomenon.Hype, currentPhenomenon.Suspicion);
        AddLog($"Mutant line created from {string.Join(" + ", selected.Select(t => t.Name))}.");
        AddLog($"NEW PHENOMENON: {currentPhenomenon.Name}.");
        phase = Phase.Discovery;
    }

    Phenomenon ResolvePhenomenon()
    {
        var tags = new HashSet<string>(selected.SelectMany(t => t.Tags));
        foreach (var p in phenomena)
            if (p.Tags.All(tag => tags.Contains(tag) || (tag == "social" && tags.Contains("swarm")))) return p;
        return new Phenomenon { Name="Ambiguous Locomotor Weirdness", Requires="unsupported trait mix", Tags=Array.Empty<string>(), Evidence=15, Weirdness=55, Credibility=30, Hype=20, Suspicion=10, Visual="flies move just oddly enough to tempt a bad abstract", ReviewerWeakness="sample" };
    }

    string PickReviewerLine()
    {
        if (evidence < 40) return "n=12 is not a sample size. It is a rumor.";
        if (paperTitle.Contains("Neural Switch")) return "Correlation is not neural circuitry.";
        if (suspicion > 55) return "Can anyone reproduce this, including you?";
        if (currentPhenomenon.ReviewerWeakness == "ethics") return "Why are the flies forming committees?";
        if (currentPhenomenon.ReviewerWeakness == "control") return "Where is the heat-control experiment?";
        return "This is interesting, but interesting is not a mechanism.";
    }

    void Submit()
    {
        if (currentPhenomenon == null) currentPhenomenon = ResolvePhenomenon();
        if (suspicion >= 80 || (weirdness >= 95 && credibility < 50)) { resultTitle = "ETHICS COMMITTEE SUMMONED"; resultBody = "The flies learned to attend the ethics meeting. This is bad for your methods section but excellent for the trailer."; }
        else if (evidence >= 60 && weirdness >= 70 && credibility >= 60 && suspicion < 40) { resultTitle = "BREAKTHROUGH"; resultBody = "A terrifyingly good paper. The PI smiles for the first time. Nobody knows what that means."; }
        else if (hype >= 70 && suspicion >= 60 && evidence < 70) { resultTitle = "REPLICATION CRISIS"; resultBody = "Everyone cited you for one week. Then someone repeated the assay."; }
        else if (credibility < 40 || evidence < 40) { resultTitle = "DESK REJECTED"; resultBody = "Reviewer #2 rejected it before becoming Reviewer #2."; }
        else if (evidence >= 70 && credibility >= 70 && weirdness < 50) { resultTitle = "SOLID BUT BORING"; resultBody = "Accepted in a respectable journal no one reads. A real career move."; }
        else if (hype >= 75 && suspicion < 60) { resultTitle = "VIRAL PREPRINT"; resultBody = "Your preprint goes viral. Three labs try to replicate it. None use the same flies."; }
        else { resultTitle = "MAJOR REVISION"; resultBody = "The dancing is undeniable. The interpretation is clinically unwell."; }
        AddLog("Phenomenon catalog updated: " + currentPhenomenon.Name + ".");
        phase = Phase.Result;
    }

    void ResetRun()
    {
        phase = Phase.TraitSelection; selected.Clear(); log.Clear(); currentPhenomenon = null; paperTitle = "Untitled Figure";
        time = 300; budget = 100; evidence = weirdness = credibility = hype = suspicion = 0;
        AddLog("PI: We need another publishable behavior. Ideally one that survives daylight.");
    }

    void AddStats(int ev, int weird, int cred, int hy, int susp)
    {
        evidence = Mathf.Clamp(evidence + ev, 0, 120);
        weirdness = Mathf.Clamp(weirdness + weird, 0, 120);
        credibility = Mathf.Clamp(credibility + cred, 0, 120);
        hype = Mathf.Clamp(hype + hy, 0, 120);
        suspicion = Mathf.Clamp(suspicion + susp, 0, 120);
    }

    int ImpactScore() => Mathf.RoundToInt(evidence * .25f + weirdness * .25f + credibility * .25f + hype * .25f - suspicion * .35f);
    void AddLog(string s) => log.Add("• " + s);

    void SeedData()
    {
        traits.AddRange(new[]
        {
            new Trait { Name="Blue Light Switch", Flavor="Optogenetic trigger. Great for dramatic videos.", Tags=new[]{"light","neural"}, Weirdness=10, Suspicion=2 },
            new Trait { Name="Mushroom Body Boost", Flavor="Memory circuit enhancement. Sounds respectable.", Tags=new[]{"memory","neural"}, Credibility=10, Weirdness=10 },
            new Trait { Name="Anxiety Loop", Flavor="Repetitive avoidance behavior. Slightly cursed.", Tags=new[]{"anxiety","loop"}, Weirdness=20, Suspicion=5 },
            new Trait { Name="Hyperactive Motor Circuit", Flavor="Movement everywhere. Data everywhere. Noise everywhere.", Tags=new[]{"hyperactive","motor"}, Evidence=5, Weirdness=10, Suspicion=4 },
            new Trait { Name="Sleep Deprivation", Flavor="The flies should not be awake. Neither should you.", Tags=new[]{"sleep","stress"}, Weirdness=20, Credibility=-5, Suspicion=5 },
            new Trait { Name="Wall Climber", Flavor="Turns locomotion into a figure panel.", Tags=new[]{"wall","motor"}, Hype=5, Weirdness=8 },
            new Trait { Name="Sugar Memory", Flavor="Reward learning. Reviewers recognize this one.", Tags=new[]{"sugar","memory","reward"}, Credibility=10 },
            new Trait { Name="Courtship Confusion", Flavor="Social behavior goes sideways.", Tags=new[]{"courtship","social"}, Weirdness=30, Suspicion=10 },
            new Trait { Name="Social Bias", Flavor="A swarm is just a graph waiting to happen.", Tags=new[]{"social","swarm"}, Hype=15, Weirdness=5 }
        });
        phenomena.AddRange(new[]
        {
            new Phenomenon { Name="Light-Induced Swarm Dance", Requires="light + hyperactive + social", Tags=new[]{"light","hyperactive","social"}, Evidence=20, Weirdness=75, Credibility=35, Hype=40, Suspicion=15, Visual="flies circle under pulsing blue light", ReviewerWeakness="mechanism" },
            new Phenomenon { Name="Compulsive Foraging Spiral", Requires="sugar + anxiety + sleep", Tags=new[]{"sugar","anxiety","sleep"}, Evidence=18, Weirdness=80, Credibility=38, Hype=35, Suspicion=20, Visual="flies spiral around a sugar spot until everyone is uncomfortable", ReviewerWeakness="control" },
            new Phenomenon { Name="Romantic Misdirection", Requires="courtship + memory", Tags=new[]{"courtship","memory"}, Evidence=22, Weirdness=82, Credibility=32, Hype=45, Suspicion=25, Visual="flies court the wrong stimulus with worrying confidence", ReviewerWeakness="ethics" },
            new Phenomenon { Name="Collective False Memory", Requires="memory + social", Tags=new[]{"memory","social"}, Evidence=15, Weirdness=88, Credibility=45, Hype=50, Suspicion=20, Visual="the group returns to a reward that was never there", ReviewerWeakness="replication" },
            new Phenomenon { Name="Midnight Wall Parade", Requires="sleep + wall", Tags=new[]{"sleep","wall"}, Evidence=25, Weirdness=65, Credibility=42, Hype=30, Suspicion=12, Visual="sleep-deprived flies march across the chamber wall", ReviewerWeakness="sample" },
            new Phenomenon { Name="Phototactic Courtship Disaster", Requires="light + courtship", Tags=new[]{"light","courtship"}, Evidence=20, Weirdness=85, Credibility=30, Hype=55, Suspicion=30, Visual="blue light turns courtship into a lab safety incident", ReviewerWeakness="ethics" }
        });
    }
}
