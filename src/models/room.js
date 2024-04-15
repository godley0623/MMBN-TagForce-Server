import mongoose from "mongoose";
const Schema = mongoose.Schema

const roomSchema = new Schema({
    roomKey: { type: String },
    player1: { type: Object },
    player2: { type: Object }
})

const room = mongoose.model('room', roomSchema);
export default room;