import mongoose from "mongoose";
import { environment, cooldownsCollectionName, cooldownsCollectionName_dev } from "../../config.js";

let collectionName;
if (environment === "live") {
    collectionName = cooldownsCollectionName;
} else if (environment === "dev") {
    collectionName = cooldownsCollectionName_dev;
} else {
    throw new Error('No environment variable found! Please set config.environment to "live" or "dev"!');
}

const cooldownSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildName: String,
    guildId: String,
    username: String,
    userId: String,
    command: String,
    commandUsedTimestamp: Number,
    commandUsedDate: String,
    cooldownEndsAtTimestamp: Number,
    cooldownEndsDate: String
});

export default mongoose.model(collectionName, cooldownSchema, collectionName);