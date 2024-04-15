import mongoose from "mongoose";
const Schema = mongoose.Schema

const playerSchema = new Schema({
    roomKey: { type: String }
})

const Player = mongoose.model('player', playerSchema);
export default Player;