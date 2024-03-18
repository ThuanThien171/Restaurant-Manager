const fb = require('../config/configFirebase');
const db = require('../models/index');
const {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    listAll,
    uploadBytes,
} = require('firebase/storage');
//const { ref, set, onValue, update } = require('firebase/database');


//const usersRef = ref(db, '/users');

const fbController = (req, res) => {
    console.log(req.body);
    const storageRef = ref(fb, `Images/test.jpg`);
    const bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
    const uploadTask = uploadBytes(storageRef, bytes).then((snapshot) => { console.log("ok"); });
    res.send('ok');
}

const homeController = async (req, res) => {
    try {
        let data = await db.Area.findAll();
        res.render('test.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
    }

}

module.exports = { homeController, fbController };
