const db = require("../db/config");

const favoriteModel = {};

favoriteModel.findAll = () => {
  return db.query(`SELECT * FROM userdata ORDER BY id ASC`);
};

favoriteModel.findFavByUserId = item => {
  return db.query(`SELECT *, items.unique_id AS id
  FROM (items
  INNER JOIN favorites ON items.unique_id = favorites.items_ref_item_id)
  WHERE
  favorites.user_ref_id = $1
  `, [item.user_id]);
};

favoriteModel.create = item => {
  return db.one(
    ` 
      INSERT INTO items (unique_id, collection_censored_name, track_censored_name, collection_view_url, currency, collection_price, wrapper_type, artist_name, artwork_url100)
      SELECT * FROM (SELECT $2, $3, $4, $5, $6, $7, $8, $9, $10) AS tmp 
      WHERE NOT EXISTS (
          SELECT unique_id FROM items WHERE unique_id = $2
      );
   
      INSERT INTO favorites (items_ref_item_id, user_ref_id)
      SELECT * FROM (SELECT $2, $1) AS tmp 
      WHERE NOT EXISTS (
          SELECT * FROM favorites WHERE items_ref_item_id = $2 AND user_ref_id = $1
      );
      
      SELECT * FROM items WHERE unique_id = $2;
    `,
    [
      item.user_id,
      item.uniqueId,
      item.collectionCensoredName,
      item.trackCensoredName,
      item.collectionViewUrl,
      item.currency,
      item.collectionPrice,
      item.wrapperType,
      item.artistName,
      item.artworkUrl100
    ]
  );
};

favoriteModel.destroy = item => {
  return db.none(
    `
      DELETE FROM favorites
      WHERE items_ref_item_id = $1 AND user_ref_id = $2;
      DELETE FROM items
        WHERE uniqueId NOT IN (SELECT favorites.items_ref_item_id 
                        FROM favorites);
    `,
    [item.uniqueId, item.userId]
  );
};

module.exports = favoriteModel;
