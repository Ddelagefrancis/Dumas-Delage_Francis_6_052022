const Sauce = require('../models/Sauce');
const fs = require('fs');

// Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

// Modification d'une sauce 
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            const sauceObject = req.file ?
                {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : { ...req.body };

            fs.unlink(`images/${filename}`, () => {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
                    .catch(error => res.status(400).json({ error }));

            })

        })
        .catch(error => res.status(500).json({ error }));
};

// Suppression d'une sauce 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

// Récupérer une sauce 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => { res.status(200).json(sauce); })
        .catch((error) => {
            res.status(404).json({ error });
        });
};

// Récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Liker ou non une sauce
exports.likeDislikeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            switch (req.body.like) {

                // L'utilisateur aime la sauce
                case 1:
                    if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                        // on met a jour la BDD
                        Sauce.updateOne({ _id: req.params.id },
                            {
                                $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }
                            })
                            .then(() => {
                                res.status(201).json({ message: "La sauce a été likée !" });
                            })
                            .catch((error) => {
                                res.status(400).json({ error });
                            });
                    }
                    break;

                // Annulation du like par l'utilisateur
                case 0:
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        // on met a jour la BDD
                        Sauce.updateOne({ _id: req.params.id },
                            { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, }
                        )
                            .then(() => {
                                res.status(201).json({ message: "Le like de la sauce a été annulé !" });
                            })
                            .catch((error) => {
                                res.status(400).json({ error });
                            });
                    }
                    // Annulation du dislike 
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        // on met a jour la BDD
                        Sauce.updateOne({ _id: req.params.id },
                            { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, }
                        )
                            .then(() => {
                                res.status(201).json({ message: "Le dislike de la sauce a été annulé !" });
                            })
                            .catch((error) => {
                                res.status(400).json({ error });
                            });
                    }
                    break;

                // L'utilisateur n'aime pas la sauce 
                case -1:
                    if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                        // on met a jour la BDD
                        Sauce.updateOne({ _id: req.params.id },
                            { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, }
                        )
                            .then(() => {
                                res.status(201).json({ message: "La sauce a été dislikée !" });
                            })
                            .catch((error) => {
                                res.status(400).json({ error });
                            });
                    }
                    break;
            }
        })
        .catch((error) => {
            res.status(404).json({ error });
        });
};