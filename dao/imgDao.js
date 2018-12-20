
const baseUrl = "http://39.104.121.78"

var mongoose = require("mongoose")
var fs = require("fs")

module.exports.addImg = async function (img) {
    let url = baseUrl + img.url.replace("public", "")
    mongoose.model("imgs")
        .create({ url })
    return await { message: "上传成功" }
}