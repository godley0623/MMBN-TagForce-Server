import express from 'express';

export const router = express.Router();
const version = "0.1.0";

const getVersion = (req, res) => {
    res.status(200).send( {message: version} );
}

const versionMatchCheck = (req, res) => {
    const gameVersion = req.body.version;

    if (gameVersion === version) {
        res.status(200).send( {message: true} );
    } else {
        res.status(200).send( {message: false} );
    }
}

router.get('/', getVersion);
router.post('/check', versionMatchCheck);