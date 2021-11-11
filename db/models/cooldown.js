const mongoose = require('mongoose');
const config = require('../../config');

let collectionName;
if (config.environment === "live") {
    collectionName = config.cooldownsCollectionName;
} else if (config.environment === "dev") {
    collectionName = config.cooldownsCollectionName_dev;
} else {
    console.log("No environment specified.");
}

const cooldownSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildName: String,
    guildId: String,
    username: String,
    userId: String,
    command: String,
    cooldownMessage: {
        Name: String,
        Platform: String,
        Game: String,
        Region: String,
        Description: String,
        Experience_Code: String
    },
    commandUsedTimestamp: Number,
    commandUsedDate: String,
    cooldownEndsAtTimestamp: Number,
    cooldownEndsDate: String,
});

module.exports = mongoose.model(collectionName, cooldownSchema, collectionName);