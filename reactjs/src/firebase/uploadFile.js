import { storage } from "./config";


async function uploadAvatar(image) {
    return new Promise(
        function (resolve, reject) {
            const storageRef = storage.ref();
            const uploadTask = storageRef.child(`/Images/AvatarImages/${image.name}`).put(image);

            uploadTask.on('state_changed',
                function (snapshot) {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log('Upload is ' + progress + '% done')
                },
                function error(err) {
                    console.log('error', err)
                    reject()
                },
                function complete() {
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        resolve(downloadURL)
                    })
                }
            )
        }
    )
}
export default uploadAvatar;
