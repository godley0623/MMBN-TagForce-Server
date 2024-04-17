import express from 'express';
import Player from "../models/player.js";
import Room from "../models/room.js";

export const router = express.Router();
const players = {};
const rooms = {};

const playerExample = {
    roomKey: "123-45-678-9",
    name: "John Doe",
}

const roomExample = {
    roomKey: "123-45-678-9",
    player1: {},
    player2: {},
}

const addPlayer = async (req, res) => {
    const { roomKey } = req.body;
    try {
        await Player.create( {roomKey: roomKey} );
        res.status(200).send({message: `Player Added in room: ${roomKey}`});
    } catch (err) {
        res.status(404).send({message: `"roomKey" key was not found in body`});
    }
}

const getAllPlayers = async (req, res) => {
    try {
        const response = await Player.find({});
        res.status(200).send(response);
    } catch (err) {
        res.status(404).send( {message: "Players in queue could not be found"} );
    }
}

const getAllRooms = async (req, res) => {
    try {
        const response = await Room.find({});
        res.status(200).send(response);
    } catch (err) {
        res.status(404).send( {message: "The list of rooms could not be found"} );
    }
}

const findPlayer = async (req, res) => {
    const { roomKey } = req.body;
    try {
        const response = await Player.findOne( {roomKey: roomKey} );
        if (response) {
            await Player.findOneAndDelete( {roomKey: roomKey} );
            await Room.create( {
                roomKey: roomKey,
                player1: {state: "Idle"},
                player2: {state: "Idle"}
            } );
            res.status(200).send( {message: true} );
        } else {
            res.status(404).send( {message: "Room was not found"} );
        }
    } catch (err) {
        res.status(404).send( {message: "Connection Error has occured"} );
    }
}

const findRoom = async (req, res) => {
    const { roomKey } = req.body;
    try {
        const response = await Room.findOne( {roomKey: roomKey} );
        if (response) {
            res.status(200).send({message: true});
        } else {
            res.status(200).send({message: "Room does not exist"});
        }
    } catch (err) {
        res.status(404).send({message: "Connection Error has occured"});
    }
}

const getPlayerState = (req, res) => {
    const { roomKey } = req.body;

    if (roomKey in rooms) {
        const playerState = {
            "player1": rooms[roomKey]["player1"]["state"],
            "player2": rooms[roomKey]["player2"]["state"]
        };
        res.status(200).send(playerState);
    } else {
        res.status(200).send( {message: "failed"} );
    }
}

const updatePlayerState = (req, res) => {
    const { roomKey, player, state } = req.body;
    
    if (roomKey in rooms) {
        rooms[roomKey][player]["state"] = state;
        res.status(200).send( {message: "player updated"} );
    } else {
        res.status(200).send( {message: "room not found"} );
    }
}

const deletePlayer = async (req, res) => {
    const { roomKey } = req.body;
    try {
        await Player.findOneAndDelete( {roomKey: roomKey} );
        res.status(200).send( {message: "player was removed from host queue"} );
    } catch (err) {
        res.status(404).send( {message: "player was not found in host queue"} );
    }
}

const deleteRoom = async (req, res) => {
    const { roomKey } = req.body;
    try {
        await Room.findOneAndDelete( {roomKey: roomKey} );
        res.status(200).send( {message: "Room was removed from the database"} );
    } catch (err) {
        res.status(404).send( {message: "Room was not found in database"} );
    }
}

const updateRoom = async (req, res) => {
    const { roomKey, player, type, data } = req.body;
    let d;
    try {
       if (data.includes("int[]")){
            let stringData = data.slice(5);
            let arrayData = stringData.split(",");
            for (let i = 0; i<arrayData.length; i++) {
                arrayData[i] = Number(arrayData[i]);
            }
            d = arrayData;
        }

        const filter = { roomKey: roomKey };
        const set = `${player}.${type}`;
        const update = { $set: {} };
        update["$set"][set] = d;
        await Room.findOneAndUpdate(filter, update);
        res.status(200).send( {message: "room updated"} );
    } catch (err) {
        res.status(404).send( {message: "Connection Error occured"} );
    }
}

const characterCheck = async (req, res) => {
    const { roomKey, player } = req.body;
    try {
        const response = await Room.findOne( {roomKey: roomKey} );
        if (response[player]["characters"].length > 0) {
            res.status(200).send( {message: true} );
        }
    } catch (err) {
        res.status(404).send( {message: "Connection Error occured"} );
    }
}

const getPlayerData = (req, res) => {
    const { roomKey, player, type } = req.body;

    if (roomKey in rooms) {
        res.status(200);
        res.send(rooms[roomKey][player][type]);
    } else {
        res.status(200).send( {message: "room does not exist"} );
    }
}

router.get("/getAllPlayers", getAllPlayers);
router.get("/getAllRooms", getAllRooms);
router.post("/getState", getPlayerState);
router.post("/getPlayerData", getPlayerData);
router.post("/characterCheck", characterCheck);
router.post("/addPlayer", addPlayer);
router.post("/findPlayer", findPlayer);
router.post("/findRoom", findRoom);
router.post("/updateRoom", updateRoom);
router.post('/updateState', updatePlayerState);
router.post("/deletePlayer", deletePlayer);
router.post("/deleteRoom", deleteRoom);