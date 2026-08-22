window.GAME_DATA = {
  traits: [
    {name:'Blue Light Switch', desc:'Optogenetic trigger. Great for dramatic videos.', tags:['light','neural'], weird:10, susp:2},
    {name:'Mushroom Body Boost', desc:'Memory circuit enhancement. Sounds respectable.', tags:['memory','neural'], cred:10, weird:10},
    {name:'Anxiety Loop', desc:'Repetitive avoidance behavior. Slightly cursed.', tags:['anxiety','loop'], weird:20, susp:5},
    {name:'Hyperactive Motor Circuit', desc:'Movement everywhere. Data everywhere. Noise everywhere.', tags:['hyperactive','motor'], ev:5, weird:10, susp:4},
    {name:'Sleep Deprivation', desc:'The flies should not be awake. Neither should you.', tags:['sleep','stress'], weird:20, cred:-5, susp:5},
    {name:'Wall Climber', desc:'Turns locomotion into a figure panel.', tags:['wall','motor'], hype:5, weird:8},
    {name:'Sugar Memory', desc:'Reward learning. Reviewers recognize this one.', tags:['sugar','memory','reward'], cred:10},
    {name:'Courtship Confusion', desc:'Social behavior goes sideways.', tags:['courtship','social'], weird:30, susp:10},
    {name:'Social Bias', desc:'A swarm is just a graph waiting to happen.', tags:['social','swarm'], hype:15, weird:5}
  ],
  phenomena: [
    {name:'Light-Induced Swarm Dance', tags:['light','hyperactive','social'], ev:20, weird:75, cred:35, hype:40, susp:15, visual:'flies circle under pulsing blue light', weakness:'mechanism'},
    {name:'Compulsive Foraging Spiral', tags:['sugar','anxiety','sleep'], ev:18, weird:80, cred:38, hype:35, susp:20, visual:'flies spiral around a sugar spot until everyone is uncomfortable', weakness:'control'},
    {name:'Romantic Misdirection', tags:['courtship','memory'], ev:22, weird:82, cred:32, hype:45, susp:25, visual:'flies court the wrong stimulus with worrying confidence', weakness:'ethics'},
    {name:'Collective False Memory', tags:['memory','social'], ev:15, weird:88, cred:45, hype:50, susp:20, visual:'the group returns to a reward that was never there', weakness:'replication'},
    {name:'Midnight Wall Parade', tags:['sleep','wall'], ev:25, weird:65, cred:42, hype:30, susp:12, visual:'sleep-deprived flies march across the chamber wall', weakness:'sample'},
    {name:'Phototactic Courtship Disaster', tags:['light','courtship'], ev:20, weird:85, cred:30, hype:55, susp:30, visual:'blue light turns courtship into a lab safety incident', weakness:'ethics'}
  ],
  fallback: {name:'Ambiguous Locomotor Weirdness', ev:15, weird:55, cred:30, hype:20, susp:10, visual:'flies move just oddly enough to tempt a bad abstract', weakness:'sample'},
  externalEvidence: {
    livedRows: {accepted:0, required:5},
    livedDesignChange: {accepted:0, required:1},
    playerSessions: {accepted:0, required:3},
    smeReviews: {accepted:0, required:1},
    followUpIssues: {accepted:0, required:'As needed'}
  },
  lab: {
    stocks: [
      {id:'cs', name:'Canton-S', genotype:'wild-type reference stock', marker:'none', backupCount:1, trust:92},
      {id:'w1118', name:'w1118', genotype:'w[1118]', marker:'white eyes', backupCount:1, trust:86},
      {id:'elav', name:'elav-GAL4 tester', genotype:'elav-GAL4 / CyO', marker:'curly wing balancer cue', backupCount:0, trust:78}
    ],
    vials: [
      {id:'V-001', stockId:'cs', setupDay:-18, adults:38, food:'good', labelCompleteness:100, contamination:'clear', status:'active'},
      {id:'V-002', stockId:'w1118', setupDay:-12, adults:25, food:'good', labelCompleteness:75, contamination:'clear', status:'active'},
      {id:'V-003', stockId:'elav', setupDay:-23, adults:44, food:'drying', labelCompleteness:50, contamination:'clear', status:'active'}
    ]
  }
};
