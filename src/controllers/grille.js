const { Grille, Phrase } = require('../DB/sequelize');

// Créer une nouvelle grille pour un utilisateur spécifique
exports.createGrille = async (req, res) => {
    const UserId = req.params.userId;
    try {
        // Vérifier si l'utilisateur a déjà une grille en cours
        const existingGrille = await Grille.findOne({ where: { UserId, finished: false } });
        if (existingGrille) {
            return res.status(200).json({
                message: 'Grille en cours trouvée',
                data: existingGrille
            });
        }

        // Récupérer toutes les phrases de la base de données
        const phrases = await Phrase.findAll();

        // Sélectionner aléatoirement 25 phrases
        const selectedPhrases = phrases.sort(() => Math.random() - 0.5).slice(0, 25);

        // Créer les cases de la grille avec les IDs des phrases sélectionnées
        const caseGrille = selectedPhrases.map((phrase) => ({
            phraseId: phrase.id
        }));

        // Enregistrer la grille dans la base de données
        const grille = await Grille.create({
            case: caseGrille,
            UserId,
            validatedCases: Array(25).fill(false) // Initialiser avec un tableau de 25 false
        });

        // Envoyer la grille et les phrases sélectionnées au frontend
        res.status(201).json({
            message: 'La grille a bien été créée',
            data: {
                grille,
                selectedPhrases
            }
        });
    } catch (error) {
        console.error("Erreur lors de la création de la grille :", error);
        res.status(500).json({ error: "La grille n'a pas pu être créée." });
    }
};

// Récupérer la grille en cours d'un utilisateur spécifique
exports.getGrilleByUser = async (req, res) => {
    const UserId = req.params.userId;
    try {
        const grille = await Grille.findOne({ where: { UserId, finished: false } });
        if (!grille) {
            return res.status(404).json({ error: 'Grille non trouvée' });
        }
        res.status(200).json({ message: 'La grille a bien été trouvée', data: grille });
    } catch (error) {
        console.error("Erreur lors de la récupération de la grille :", error);
        res.status(500).json({ error: 'La grille n\'a pas pu être trouvée.' });
    }
};

// Récupérer une grille par ID
exports.getGrilleById = async (req, res) => {
    const id = req.params.id;
    try {
        const grille = await Grille.findByPk(id);
        if (!grille) {
            return res.status(404).json({ error: 'Grille non trouvée' });
        }
        res.status(200).json({ message: 'La grille a bien été trouvée', data: grille });
    } catch (error) {
        console.error("Erreur lors de la récupération de la grille :", error);
        res.status(500).json({ error: 'La grille n\'a pas pu être trouvée.' });
    }
};

// Mettre à jour une grille par ID
exports.updateGrille = async (req, res) => {
    const id = req.params.id;
    const { phraseId } = req.body; // L'ID de la phrase que l'utilisateur a validée
  
    try {
      // Trouver la grille par ID
      const grille = await Grille.findByPk(id);
      if (!grille) {
        return res.status(404).json({ error: 'Grille non trouvée' });
      }
  
      // Récupérer les cases de la grille
      const cases = grille.case;
      // Trouver l'index de la case à valider
      const caseIndex = cases.findIndex(c => c.phraseId === phraseId); 
  
      if (caseIndex === -1) {
        return res.status(400).json({ error: 'Phrase non trouvée dans la grille' });
      }
  
      // Mettre à jour le tableau des cases validées
      const updatedValidatedCases = [...grille.validatedCases];
      // Marquer la case correspondante comme validée
      updatedValidatedCases[caseIndex] = true; 
  
      // Mettre à jour la grille dans la base de données
      grille.validatedCases = updatedValidatedCases;

      // verification si fini
      for (let i = 0; i < 5; i++) {
        if (grille.validatedCases[i * 5] && grille.validatedCases[i * 5 + 1] && grille.validatedCases[i * 5 + 2] && grille.validatedCases[i * 5 + 3] && grille.validatedCases[i * 5 + 4]) {
          grille.finished = true;
          break;
        }
        if (grille.validatedCases[i] && grille.validatedCases[i + 5] && grille.validatedCases[i + 10] && grille.validatedCases[i + 15] && grille.validatedCases[i + 20]) {
          grille.finished = true;
          break;
        }
        if (grille.validatedCases[i] && grille.validatedCases[i + 6] && grille.validatedCases[i + 12] && grille.validatedCases[i + 18] && grille.validatedCases[i + 24]) {
          grille.finished = true;
          break;
        }
        if (grille.validatedCases[i] && grille.validatedCases[i + 4] && grille.validatedCases[i + 8] && grille.validatedCases[i + 12] && grille.validatedCases[i + 16]) {
          grille.finished = true;
          break;
        }
      
      }

      
  
      // Mettre à jour la grille dans la base de données
      
      await grille.save();
  
      res.status(200).json({ message: 'La grille a bien été modifiée', data: grille });
    } catch (error) {
      console.error("Erreur lors de la modification de la grille :", error);
      res.status(500).json({ error: 'La grille n\'a pas pu être modifiée.' });
    }
  };
  