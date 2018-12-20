
const { addImg } = require("../dao/imgDao")

module.exports.addImg = async function (img) {
    return await addImg(img)
}