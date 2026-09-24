/**
 * Programme du defi 90 jours : corps, eloquence, esprit.
 *
 * Tout le contenu du programme se modifie ICI. Les jours sont generes a partir
 * de modeles hebdomadaires qui montent en intensite semaine apres semaine et
 * phase apres phase : aucun jour n'est identique au precedent.
 */

export const TOTAL_DAYS = 90;

export type Pillar = "corps" | "eloquence" | "esprit";

export const pillars: Record<Pillar, { label: string; short: string; color: string }> = {
  corps: { label: "Corps", short: "Sport", color: "text-brand-400" },
  eloquence: { label: "Éloquence", short: "Parole", color: "text-sky-400" },
  esprit: { label: "Esprit", short: "Clarté", color: "text-emerald-400" },
};

export type Phase = {
  index: 0 | 1 | 2;
  name: string;
  start: number;
  end: number;
  goal: string;
};

export const phases: Phase[] = [
  {
    index: 0,
    name: "Fondations",
    start: 1,
    end: 30,
    goal: "Installer les habitudes. Le but n'est pas d'être fort, c'est d'être là tous les jours.",
  },
  {
    index: 1,
    name: "Construction",
    start: 31,
    end: 60,
    goal: "Monter l'intensité. Tu ne négocies plus avec toi-même, tu exécutes.",
  },
  {
    index: 2,
    name: "Transformation",
    start: 61,
    end: 90,
    goal: "Devenir la personne que tu construis. Les autres commencent à ne plus te reconnaître.",
  },
];

/** Regles quotidiennes, cochees en plus des 3 missions. */
export const dailyRules = [
  "7 h de sommeil minimum, couché avant 23 h 30",
  "2 litres d'eau",
  "Zéro réseau social avant midi",
  "10 pages de lecture (un vrai livre)",
  "Mode fantôme : tu n'annonces rien, tu montres à J90",
];

export const manifesto = [
  "Pendant 90 jours, tu disparais. Pas des gens que tu aimes : de tes anciennes habitudes.",
  "Tu ne racontes pas ton défi. Tu ne postes pas ta progression. Tu travailles en silence.",
  "Chaque jour : ton corps, ta parole, ta tête. Trois missions, pas une de moins.",
  "Tu peux rater un jour. Tu ne rates jamais deux jours de suite.",
  "À J90, tu reviens. Et personne ne te reconnaît.",
];

/* -------------------------------------------------------------------------- */
/*  CORPS                                                                     */
/* -------------------------------------------------------------------------- */

export type Mission = {
  pillar: Pillar;
  title: string;
  minutes: number;
  steps: string[];
  /** Duree du minuteur integre, en secondes. */
  timer?: number;
  /** Consigne mise en avant (sujet d'impro, question du journal...). */
  focus?: string;
  /** Liste dans laquelle tirer un autre sujet. */
  pool?: string[];
  tip?: string;
};

type Ctx = { phase: 0 | 1 | 2; week: number; n: number };

/** Repetitions : base de la phase + 2 par semaine ecoulee dans la phase. */
function reps(ctx: Ctx, bases: [number, number, number], perWeek = 2) {
  return bases[ctx.phase] + ctx.week * perWeek;
}

const sets = (ctx: Ctx) => [3, 4, 5][ctx.phase];

const warmup = "Échauffement 5 min : rotations articulaires, 30 jumping jacks, 10 squats lents";

const sportSessions: ((ctx: Ctx) => Mission)[] = [
  (c) => ({
    pillar: "corps",
    title: "Force — haut du corps",
    minutes: 35 + c.phase * 5,
    steps: [
      warmup,
      `${sets(c)} séries de ${reps(c, [8, 12, 16])} pompes (sur les genoux si besoin, jamais le dos creux)`,
      `${sets(c)} séries de ${reps(c, [8, 12, 15])} dips sur une chaise`,
      `${sets(c)} séries de ${reps(c, [6, 8, 12], 1)} pompes piquées (pike push-ups)`,
      `${sets(c)} × ${reps(c, [30, 45, 60], 5)} s de planche`,
      "Repos 60 à 90 s entre les séries",
    ],
    tip: "Note ton nombre de pompes. Dans 4 semaines tu compareras.",
  }),
  (c) => ({
    pillar: "corps",
    title: "Cardio",
    minutes: [25, 35, 40][c.phase],
    steps: [
      warmup,
      [
        `${20 + c.week * 2} min : alterne 1 min de course / 1 min de marche rapide`,
        `${25 + c.week * 2} min de course continue, à une allure où tu peux encore parler`,
        `10 min de course, puis ${6 + c.week} × (30 s de sprint / 90 s de marche), puis 5 min de course lente`,
      ][c.phase],
      "5 min de marche et d'étirements des mollets et des cuisses",
    ],
    tip: "Pas de course possible ? Corde à sauter ou montées d'escaliers, même durée.",
  }),
  (c) => ({
    pillar: "corps",
    title: "Force — bas du corps",
    minutes: 35 + c.phase * 5,
    steps: [
      warmup,
      `${sets(c)} séries de ${reps(c, [15, 20, 25])} squats (descends sous les genoux)`,
      `${sets(c)} séries de ${reps(c, [8, 10, 12])} fentes par jambe`,
      `${sets(c)} séries de ${reps(c, [15, 20, 20])} ponts fessiers${c.phase === 2 ? " sur une jambe" : ""}`,
      `${sets(c)} × ${reps(c, [30, 45, 60], 5)} s de chaise contre le mur`,
      c.phase > 0 ? `${sets(c)} séries de ${reps(c, [0, 10, 12])} squats sautés` : "Repos 60 à 90 s entre les séries",
    ],
  }),
  (c) => ({
    pillar: "corps",
    title: "Gainage & mobilité",
    minutes: 30,
    steps: [
      `${sets(c)} tours : planche ${reps(c, [30, 45, 60], 5)} s — planche latérale ${reps(c, [20, 30, 40], 5)} s par côté — ${reps(c, [15, 20, 25])} mountain climbers`,
      `${sets(c)} séries de ${reps(c, [10, 12, 15])} superman (dos)`,
      "10 min de mobilité : hanches (90/90), épaules, colonne (chat-vache), ischios",
    ],
    tip: "Le gainage protège ton dos et redresse ta posture. Ça se voit quand tu parles debout.",
  }),
  (c) => ({
    pillar: "corps",
    title: "Circuit full body",
    minutes: 30 + c.phase * 5,
    steps: [
      warmup,
      `${[3, 4, 5][c.phase]} tours, sans pause entre les exercices :`,
      `${reps(c, [8, 10, 12], 1)} burpees — ${reps(c, [15, 20, 25])} squats — ${reps(c, [8, 12, 15])} pompes — ${reps(c, [20, 30, 40])} crunchs`,
      "2 min de repos entre les tours",
    ],
    tip: "Chronomètre ton circuit. La semaine prochaine, bats ton temps.",
  }),
  (c) => ({
    pillar: "corps",
    title: "Endurance longue",
    minutes: [45, 45, 55][c.phase],
    steps: [
      [
        `${40 + c.week * 5} min de marche rapide (tu dois être légèrement essoufflé)`,
        `${30 + c.week * 3} min de course lente, sans t'arrêter`,
        `${40 + c.week * 3} min de course — objectif : 8 km avant J90`,
      ][c.phase],
      "Pas d'écouteurs une fois sur deux : laisse tes idées se ranger toutes seules",
    ],
  }),
  () => ({
    pillar: "corps",
    title: "Repos actif",
    minutes: 45,
    steps: [
      "30 min de marche dehors, sans téléphone à la main",
      "15 min d'étirements complets (tiens chaque position 30 s)",
      "Prends tes mesures si c'est dimanche : poids, tour de taille",
    ],
    tip: "Le muscle se construit pendant le repos. Ce jour-là compte autant que les autres.",
  }),
];

/* -------------------------------------------------------------------------- */
/*  ELOQUENCE                                                                 */
/* -------------------------------------------------------------------------- */

export const improvTopics = [
  "Le meilleur conseil qu'on m'ait donné",
  "Pourquoi le silence est une force",
  "Ce que je changerais dans l'école",
  "Un objet qui raconte ma vie",
  "Le courage, c'est quoi vraiment ?",
  "Mon plat préféré, vendu comme un produit de luxe",
  "Faut-il toujours dire la vérité ?",
  "La ville où j'aimerais vivre",
  "Ce que l'argent ne peut pas acheter",
  "Le jour où j'ai eu le plus peur",
  "Défends les lundis",
  "Une compétence que tout le monde devrait avoir",
  "Les réseaux sociaux nous rendent-ils plus seuls ?",
  "Mon héros, et pourquoi il n'est pas parfait",
  "Convaincs-moi de me lever à 6 h",
  "Ce que le sport m'apprend sur la vie",
  "Le métier le plus sous-estimé",
  "Une erreur qui m'a rendu meilleur",
  "Vends-moi un stylo",
  "Pourquoi les gens abandonnent leurs objectifs",
  "L'importance de la première impression",
  "Ce que je dirais à moi-même il y a 5 ans",
  "Le bonheur est-il un choix ?",
  "Un livre ou un film qui m'a changé",
  "Présente ton quartier comme un guide touristique",
  "Faut-il écouter ses émotions ?",
  "La discipline est plus importante que la motivation",
  "Ce que signifie être un homme ou une femme de parole",
  "Le talent n'existe pas",
  "Explique Internet à quelqu'un de 1900",
];

export const prepQuestions = [
  "Faut-il travailler par passion ou pour l'argent ?",
  "Le télétravail est-il un progrès ?",
  "Faut-il interdire le téléphone à l'école ?",
  "Vaut-il mieux être respecté ou aimé ?",
  "L'échec est-il nécessaire pour réussir ?",
  "Doit-on toujours finir ce qu'on commence ?",
  "Faut-il se fixer des objectifs ou des habitudes ?",
  "Est-ce qu'on peut changer vraiment en 90 jours ?",
  "La politesse est-elle une faiblesse ?",
  "Faut-il avoir un plan B ?",
  "Est-ce qu'on doit tout dire à ses amis ?",
  "La solitude est-elle nécessaire ?",
];

export const debateTopics = [
  "Il faut supprimer les notes à l'école",
  "Le sport devrait être obligatoire au travail",
  "L'intelligence artificielle va rendre les gens plus bêtes",
  "Il vaut mieux être généraliste que spécialiste",
  "On devrait tous vivre un an à l'étranger",
  "La ville est meilleure que la campagne",
  "Les influenceurs sont des modèles utiles",
  "Il faut toujours pardonner",
  "La semaine de 4 jours devrait être la norme",
  "Le luxe est inutile",
];

export const wordsOfTheDay: [string, string][] = [
  ["Pertinent", "qui convient exactement à la situation"],
  ["Nuancer", "exprimer les différences subtiles d'une idée"],
  ["Éloquent", "qui exprime avec force et aisance"],
  ["Paradoxe", "idée qui va contre le sens commun mais peut être vraie"],
  ["Pragmatique", "orienté vers l'action et les résultats concrets"],
  ["Inéluctable", "qu'on ne peut pas éviter"],
  ["Résilience", "capacité à rebondir après un choc"],
  ["Sagacité", "finesse d'esprit, perspicacité"],
  ["Tergiverser", "hésiter, retarder une décision"],
  ["Succinct", "bref et précis"],
  ["Prépondérant", "qui a le plus de poids"],
  ["Équivoque", "qui peut être compris de plusieurs façons"],
  ["Dissonance", "désaccord entre deux idées ou deux actes"],
  ["Probant", "qui prouve, qui convainc"],
  ["Latent", "présent mais caché, pas encore visible"],
  ["Ambivalent", "qui ressent deux choses contraires à la fois"],
  ["Exhaustif", "qui traite tout, complètement"],
  ["Tempérance", "maîtrise de soi, modération"],
  ["Fallacieux", "qui cherche à tromper"],
  ["Catalyseur", "ce qui déclenche ou accélère un changement"],
];

function pick<T>(list: T[], n: number, salt = 0) {
  return list[(n * 7 + salt) % list.length];
}

const speakSeconds = (c: Ctx) => [60, 120, 180][c.phase];

const eloquenceSessions: ((ctx: Ctx) => Mission)[] = [
  (c) => ({
    pillar: "eloquence",
    title: "Improvisation",
    minutes: 10,
    focus: pick(improvTopics, c.n),
    pool: improvTopics,
    timer: speakSeconds(c),
    steps: [
      "Lis le sujet, prends 30 s pour trouver ton angle (une idée, pas trois)",
      `Parle ${speakSeconds(c) / 60} min sans t'arrêter, debout, en te filmant`,
      "Règle : aucun « euh ». Si tu bloques, fais une pause silencieuse, puis repars",
      "Réécoute-toi une fois et note UNE chose à améliorer",
    ],
  }),
  (c) => ({
    pillar: "eloquence",
    title: "Lecture à voix haute",
    minutes: 10 + c.phase * 5,
    steps: [
      c.phase === 0
        ? "2 min avec un stylo entre les dents : articule chaque syllabe"
        : "2 min de virelangues : « Un chasseur sachant chasser doit savoir chasser sans son chien »",
      `${8 + c.phase * 4} min de lecture à voix haute d'un livre, lentement`,
      "Marque les pauses aux points. Monte le ton sur les mots importants",
      c.phase === 2
        ? "Lis un grand discours (Martin Luther King, Simone Veil, Churchill) comme si tu étais sur scène"
        : "Enregistre la dernière minute et écoute ton débit : trop rapide ?",
    ],
    tip: "La voix qui rassure est lente et posée. Ralentis de 20 %, tu paraîtras plus sûr de toi.",
  }),
  (c) => ({
    pillar: "eloquence",
    title: "Chasse aux tics de langage",
    minutes: 10,
    timer: 120,
    focus: pick(improvTopics, c.n, 3),
    pool: improvTopics,
    steps: [
      "Parle 2 min sur le sujet ci-dessous en t'enregistrant",
      "Réécoute et compte : « euh », « genre », « en fait », « du coup », « voilà »",
      "Note ton score dans ton journal. Recommence 2 min en visant la moitié",
      "Remplace chaque tic par un silence d'une seconde : le silence fait autorité",
    ],
  }),
  (c) => ({
    pillar: "eloquence",
    title: "Structurer sa pensée — méthode PREP",
    minutes: 10,
    focus: pick(prepQuestions, c.n),
    pool: prepQuestions,
    timer: 90 + c.phase * 30,
    steps: [
      "Point : donne ta réponse en une phrase",
      "Raison : pourquoi tu penses ça (une seule raison forte)",
      "Exemple : un fait, une histoire, un chiffre",
      "Point : reformule ta réponse pour conclure",
      "Écris le plan en 4 lignes, puis dis-le à voix haute sans lire",
    ],
    tip: "PREP marche partout : entretien, réunion, dispute. Ta pensée devient claire quand elle a une structure.",
  }),
  (c) => ({
    pillar: "eloquence",
    title: "Storytelling",
    minutes: 15,
    timer: 120 + c.phase * 60,
    steps: [
      "Choisis un vrai souvenir (un échec, une rencontre, un moment de bascule)",
      "Acte 1 — la situation : où, quand, qui. Acte 2 — le problème. Acte 3 — ce qui a changé",
      "Commence au milieu de l'action, pas par « alors, un jour… »",
      "Raconte-la à voix haute, avec des détails concrets (un bruit, une couleur, une phrase dite)",
      c.phase > 0 ? "Raconte cette histoire à quelqu'un aujourd'hui, pour de vrai" : "Filme-toi",
    ],
  }),
  (c) => {
    const [word, meaning] = pick(wordsOfTheDay, c.n);
    return {
      pillar: "eloquence",
      title: "Vocabulaire & clarté (technique Feynman)",
      minutes: 10,
      focus: `${word} — ${meaning}`,
      timer: 120,
      steps: [
        "Place le mot du jour dans 3 conversations aujourd'hui",
        "Choisis un sujet que tu maîtrises (ton métier, un sport, une passion)",
        "Explique-le en 2 min comme à un enfant de 12 ans : zéro jargon",
        "Là où tu bloques, c'est que tu ne comprends pas encore : creuse ce point",
      ],
    };
  },
  (c) => ({
    pillar: "eloquence",
    title: "Débat contre toi-même",
    minutes: 15,
    focus: pick(debateTopics, c.n),
    pool: debateTopics,
    timer: 60 + c.phase * 30,
    steps: [
      "Défends la position à fond pendant le temps du minuteur",
      "Relance le minuteur et attaque-la avec la même conviction",
      "Termine par ta vraie opinion, nuancée, en 30 s",
      c.phase === 2
        ? "Défi terrain : prends la parole au moins une fois devant un groupe cette semaine"
        : c.phase === 1
          ? "Défi terrain : appelle au lieu d'écrire un message aujourd'hui"
          : "Écris les 3 meilleurs arguments du camp adverse",
    ],
    tip: "Comprendre l'argument adverse mieux que ton adversaire : c'est ce qui rend imbattable.",
  }),
];

/* -------------------------------------------------------------------------- */
/*  ESPRIT                                                                    */
/* -------------------------------------------------------------------------- */

/** Un modele mental par semaine (13 semaines). */
export const mentalModels = [
  {
    name: "Ce qui dépend de moi",
    idea: "Sépare ce que tu contrôles (tes actes, tes efforts, tes réactions) de ce que tu ne contrôles pas. Mets 100 % de ton énergie dans la première colonne.",
  },
  {
    name: "Identité avant objectifs",
    idea: "Ne vise pas « perdre 5 kg », deviens « quelqu'un qui s'entraîne ». Chaque action est un vote pour la personne que tu deviens.",
  },
  {
    name: "Le vide-tête",
    idea: "Ton cerveau sert à avoir des idées, pas à les stocker. Tout ce qui tourne dans ta tête va sur papier, puis tu tries.",
  },
  {
    name: "La règle des deux jours",
    idea: "Tu peux rater une fois. Jamais deux. Une erreur est un accident, deux, c'est le début d'une nouvelle habitude.",
  },
  {
    name: "Les premiers principes",
    idea: "Face à un problème, demande-toi : qu'est-ce qui est vrai à coup sûr ? Reconstruis ton raisonnement à partir de là, pas à partir de ce que tout le monde fait.",
  },
  {
    name: "L'inversion",
    idea: "Au lieu de chercher comment réussir, demande-toi : qu'est-ce qui me ferait échouer à coup sûr ? Puis évite-le.",
  },
  {
    name: "Pensée de second ordre",
    idea: "Pose-toi toujours la question « et ensuite ? ». La première conséquence est souvent agréable, la deuxième décide de tout.",
  },
  {
    name: "Le biais de confirmation",
    idea: "Ton cerveau cherche les preuves qu'il a raison. Cette semaine, cherche activement ce qui prouve que tu as tort.",
  },
  {
    name: "La loi des 80/20",
    idea: "20 % de tes actions produisent 80 % de tes résultats. Identifie-les et coupe le reste sans culpabilité.",
  },
  {
    name: "Le pré-mortem",
    idea: "Imagine que ton projet a échoué dans 6 mois. Écris pourquoi. Tu viens de trouver les risques à traiter maintenant.",
  },
  {
    name: "La carte n'est pas le territoire",
    idea: "Ton idée d'une situation n'est pas la situation. Avant de juger, va vérifier sur le terrain.",
  },
  {
    name: "Le cercle de compétence",
    idea: "Sache précisément ce que tu sais et ce que tu ne sais pas. Reste humble à la frontière, agrandis-la chaque jour.",
  },
  {
    name: "Memento mori",
    idea: "Ton temps est limité. Pas pour faire peur : pour choisir. Qu'est-ce qui mérite vraiment tes prochaines heures ?",
  },
];

/** 30 questions de journal par phase, une par jour. */
export const journalPrompts: [string[], string[], string[]] = [
  [
    "Pourquoi je fais ce défi ? Écris la vraie raison, celle que tu ne dirais à personne.",
    "Qu'est-ce que j'ai évité de faire aujourd'hui, et pourquoi ?",
    "Quelles sont les 3 habitudes qui me font le plus de mal ?",
    "Qui sont les 5 personnes avec qui je passe le plus de temps ? Me tirent-elles vers le haut ?",
    "À quel moment de la journée ai-je eu le plus d'énergie ? Et le moins ?",
    "Qu'est-ce qui m'a énervé aujourd'hui ? Qu'est-ce que ça dit de moi ?",
    "Si ma vie continue exactement comme ça pendant 5 ans, où j'en serai ?",
    "Semaine 1 terminée. Qu'est-ce qui a été le plus dur ? Qu'est-ce qui a été plus facile que prévu ?",
    "Quelle excuse je me raconte le plus souvent ?",
    "Qu'est-ce que je fais pour être aimé plutôt que parce que j'en ai envie ?",
    "Combien de temps ai-je passé sur mon téléphone aujourd'hui ? Qu'est-ce que j'aurais pu faire à la place ?",
    "Quelle peur me retient le plus en ce moment ?",
    "Qu'est-ce que je sais faire mieux que la plupart des gens ?",
    "Quelle conversation difficile est-ce que je repousse ?",
    "Semaine 2. Quelle victoire, même petite, je veux retenir ?",
    "Qu'est-ce qui me fait perdre le fil de mes idées ? Le bruit, la fatigue, les écrans ?",
    "De quoi suis-je reconnaissant aujourd'hui ? 3 choses précises.",
    "Quelle croyance sur moi-même ai-je héritée de mon enfance ?",
    "Qu'est-ce que je ferais si je n'avais pas peur du regard des autres ?",
    "Qu'est-ce qui me donne l'impression d'être vivant ?",
    "Quel est le moment où j'ai été le plus fier de moi ? Pourquoi ?",
    "Semaine 3. Ma discipline tient-elle quand la motivation disparaît ?",
    "Quel projet ai-je abandonné ? Qu'est-ce qui s'est vraiment passé ?",
    "Comment je me parle quand je rate quelque chose ? Parlerais-je comme ça à un ami ?",
    "Qu'est-ce que je consomme (contenus, nourriture, gens) qui ne me nourrit pas ?",
    "À quoi ressemble ma journée idéale, heure par heure ?",
    "Qu'est-ce que je dois arrêter, commencer, continuer ?",
    "Qui je veux être à J90 ? Décris cette personne au présent.",
    "Qu'est-ce que ces 29 jours m'ont appris sur moi ?",
    "Écris une lettre à la personne que tu seras à J60.",
  ],
  [
    "Quelle décision importante dois-je prendre ? Écris les options sans les juger.",
    "Sur quel sujet ai-je une opinion forte sans vraiment le connaître ?",
    "Quel problème de ma vie puis-je décomposer en ses éléments les plus simples ?",
    "Qu'est-ce qui me ferait échouer à coup sûr dans ce défi ? Comment je l'évite ?",
    "Quelle décision récente ai-je prise sous le coup de l'émotion ?",
    "Et ensuite ? Prends une habitude actuelle et imagine ses conséquences dans 1 an, 5 ans.",
    "Semaine 5. Qu'est-ce que je fais maintenant sans y penser, qui me coûtait avant ?",
    "Sur quel sujet ai-je changé d'avis récemment ? Qu'est-ce qui m'a convaincu ?",
    "Quelle est la meilleure objection contre une de mes convictions ?",
    "Quelles sont les 20 % d'actions qui produisent 80 % de mes résultats ?",
    "Qu'est-ce que je peux supprimer de ma vie cette semaine ?",
    "Qu'est-ce que je crois vrai sans l'avoir vérifié ?",
    "Quelle idée m'obsède en ce moment ? Écris-la à fond, jusqu'au bout.",
    "Semaine 6. Où est-ce que je stagne ? Qu'est-ce que je change ?",
    "Quel conseil je donnerais à un ami dans ma situation ?",
    "Qu'est-ce que je fais par habitude et que personne ne remet en question ?",
    "Quelles sont mes 3 valeurs non négociables ? Ma semaine les a-t-elle respectées ?",
    "Quand ai-je eu tort pour la dernière fois ? Comment je l'ai vécu ?",
    "Qu'est-ce que j'ai appris aujourd'hui que je ne savais pas ce matin ?",
    "Imagine que mon projet principal a échoué dans 6 mois. Pourquoi ?",
    "Semaine 7. Qu'est-ce que mes proches ont remarqué, sans que je dise rien ?",
    "Qu'est-ce que je sais vraiment, et qu'est-ce que je fais semblant de savoir ?",
    "Quelle question devrais-je me poser plus souvent ?",
    "Qui admire-je pour sa façon de penser ? Qu'est-ce qu'il fait différemment ?",
    "Quel est mon plus grand gaspillage de temps ? Chiffre-le en heures par an.",
    "Qu'est-ce qui me rend calme ? Comment en mettre plus dans mes journées ?",
    "Qu'est-ce que je ferais avec une heure de plus par jour ?",
    "Semaine 8. Quelle est la chose la plus importante que j'ai comprise ce mois-ci ?",
    "Quelle version de moi a commencé ce défi ? En quoi est-elle différente de moi aujourd'hui ?",
    "Écris une lettre à la personne que tu seras à J90.",
  ],
  [
    "Qu'est-ce que la personne que je deviens ferait aujourd'hui ?",
    "Quel est le prochain grand défi que je veux relever après J90 ?",
    "De quoi ai-je encore besoin de me libérer ?",
    "Qu'est-ce que je veux que les gens ressentent après m'avoir parlé ?",
    "Quelle est ma mission pour les 12 prochains mois, en une phrase ?",
    "À qui dois-je dire merci ? Fais-le vraiment.",
    "Semaine 9. Qu'est-ce qui est devenu naturel ?",
    "Quelle peur ai-je affrontée depuis J1 ?",
    "Quelle routine vais-je garder à vie ?",
    "Qu'est-ce que je veux construire, qui me survivra ?",
    "Quel est mon rapport au confort aujourd'hui ?",
    "Qu'est-ce qui me rend unique dans ma façon de parler ?",
    "Qui dois-je devenir pour atteindre ce que je veux ?",
    "Qu'est-ce que je refuse désormais de tolérer ?",
    "Semaine 10. Où en est mon corps ? Mon énergie ? Mon sommeil ?",
    "Qu'est-ce que la discipline m'a donné que la motivation ne m'aurait jamais donné ?",
    "Quel conseil je donnerais à quelqu'un qui commence son J1 demain ?",
    "Quelle est l'histoire que je veux raconter sur ces 90 jours ?",
    "Qu'est-ce que je fais maintenant que je pensais impossible avant ?",
    "Quelles relations ai-je renforcées ? Lesquelles ai-je laissées partir ?",
    "Quelles sont mes nouvelles règles de vie ? Écris-en 5.",
    "Semaine 11. Si j'arrêtais tout demain, qu'est-ce qui resterait ?",
    "Qu'est-ce que je veux dire dans mon discours de J90 ?",
    "Quelle a été ma plus grande résistance intérieure ? Comment je l'ai dépassée ?",
    "Comment je vais protéger mes progrès quand le défi sera terminé ?",
    "Qu'est-ce qui me rend fier aujourd'hui, que personne ne voit ?",
    "Qu'est-ce que j'ai compris sur ma façon de penser ?",
    "Semaine 12. Relis ta réponse du J1. Qu'est-ce que tu ressens ?",
    "Écris le plan de tes 90 prochains jours.",
    "J90. Qui es-tu devenu ? Écris-le, puis dis-le à voix haute.",
  ],
];

const breathMinutes = (c: Ctx) => [5, 10, 15][c.phase];

function mindSession(c: Ctx, dayInPhase: number): Mission {
  return {
    pillar: "esprit",
    title: "Clarté mentale",
    minutes: 15 + breathMinutes(c),
    focus: journalPrompts[c.phase][dayInPhase],
    timer: breathMinutes(c) * 60,
    steps: [
      "Matin : écris tes 3 priorités du jour avant d'ouvrir ton téléphone",
      `${breathMinutes(c)} min de respiration : inspire 4 s, bloque 4 s, expire 4 s, bloque 4 s (minuteur)`,
      "Soir : réponds à la question du jour dans ton journal, 10 min, sans te relire",
      "Vide ta tête : tout ce qui tourne en boucle va dans l'onglet « Idées »",
    ],
  };
}

/* -------------------------------------------------------------------------- */
/*  JOURS                                                                     */
/* -------------------------------------------------------------------------- */

export type Day = {
  n: number;
  phase: Phase;
  weekOfChallenge: number;
  model: (typeof mentalModels)[number];
  missions: Mission[];
  checkin: boolean;
};

export const checkinDays = [1, 30, 60, 90];

export function phaseOf(n: number): Phase {
  return phases.find((p) => n >= p.start && n <= p.end) ?? phases[phases.length - 1];
}

export function getDay(n: number): Day {
  const day = Math.min(Math.max(Math.round(n), 1), TOTAL_DAYS);
  const phase = phaseOf(day);
  const dayInPhase = day - phase.start;
  const ctx: Ctx = { phase: phase.index, week: Math.floor(dayInPhase / 7), n: day };
  const slot = (day - 1) % 7;
  const weekOfChallenge = Math.floor((day - 1) / 7);

  const missions = [sportSessions[slot](ctx), eloquenceSessions[slot](ctx), mindSession(ctx, dayInPhase)];

  if (day === TOTAL_DAYS) {
    missions[1] = {
      pillar: "eloquence",
      title: "Le discours final",
      minutes: 30,
      focus: "Qui je suis devenu en 90 jours",
      timer: 300,
      steps: [
        "Écris le plan en PREP : ton point, pourquoi, 2 exemples concrets du défi, ta conclusion",
        "Répète 3 fois à voix haute",
        "Filme-le d'une traite, 5 min, debout, regard caméra",
        "Compare avec ta vidéo d'improvisation du J1",
      ],
    };
  }

  return {
    n: day,
    phase,
    weekOfChallenge,
    model: mentalModels[Math.min(weekOfChallenge, mentalModels.length - 1)],
    missions,
    checkin: checkinDays.includes(day),
  };
}

/* -------------------------------------------------------------------------- */
/*  BILANS                                                                    */
/* -------------------------------------------------------------------------- */

export const checkinFields = [
  { key: "poids", label: "Poids", unit: "kg" },
  { key: "taille", label: "Tour de taille", unit: "cm" },
  { key: "pompes", label: "Pompes max d'affilée", unit: "" },
  { key: "planche", label: "Planche max", unit: "s" },
  { key: "tics", label: "Tics en 2 min d'impro", unit: "" },
  { key: "energie", label: "Énergie", unit: "/10" },
  { key: "clarte", label: "Clarté mentale", unit: "/10" },
  { key: "confiance", label: "Confiance à l'oral", unit: "/10" },
] as const;

export type CheckinKey = (typeof checkinFields)[number]["key"];
