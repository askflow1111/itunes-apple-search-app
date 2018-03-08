const favoriteModel = require("../models/favoriteModel");

const favoriteController = {};

favoriteController.show = (req, res) => {
  favoriteModel.findFavByUserId({
    user_id: req.body.user_id,
  })
    .then(item => {
      let obj = {};
      item.forEach(e => {
        e.uniqueId = e.unique_id;
        e.collectionCensoredName = e.collection_censored_name;
        e.trackCensoredName = e.track_censored_name;
        e.collectionViewUrl = e.collection_view_url;
        e.collectionPrice = e.collection_price;
        e.wrapperType = e.wrapper_type;
        e.artistName = e.artist_name;
        e.artworkUrl100 = e.artwork_url100;
        obj[e.id] = e
      })
      res.json({
        message: "ok",
        data: {
          data: obj
        }
      });
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

favoriteController.create = (req, res) => {
  favoriteModel.create({
    user_id: Number(req.body.user_id),
    uniqueId: Number(req.body.uniqueId),
    collectionCensoredName: req.body.collectionCensoredName,
    trackCensoredName: req.body.trackCensoredName,
    collectionViewUrl: req.body.collectionViewUrl,
    currency: req.body.currency,
    collectionPrice: req.body.collectionPrice,
    wrapperType: req.body.wrapperType,
    artistName: req.body.artistName,
    artworkUrl100: req.body.artworkUrl100

  })
    .then(data => {

      data.uniqueId = data.unique_id;
      data.collectionCensoredName = data.collection_censored_name;
      data.trackCensoredName = data.track_censored_name;
      data.collectionViewUrl = data.collection_view_url;
      data.collectionPrice = data.collection_price;
      data.wrapperType = data.wrapper_type;
      data.artistName = data.artist_name;
      data.artworkUrl100 = data.artwork_url100;

      res.json({
        message: "ok",
        data: {
          data
        }
      });
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

favoriteController.destroy = (req, res) => {
  favoriteModel.destroy({
    uniqueId: Number(req.body.uniqueId),
    userId: Number(req.body.user_id),
  })
    .then(response => {
      res.json({
        message: "item deleted successfully"
      });
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

module.exports = favoriteController;