var express = require('express');
var router = express.Router();

var fs = require('fs');
var multer = require('multer');


const { addImg } = require("../service/imgservice")

// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
	destination: 'public/upload/',
	filename: function (req, file, cb) {
		// 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
		cb(null, Date.now() + "-" + file.originalname);
	}
});

// 创建文件夹
var createFolder = function (folder) {
	try {
		// 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
		// 如果文件路径不存在将会抛出错误"no such file or directory"
		fs.accessSync(folder);
	} catch (e) {
		// 文件夹不存在，以同步的方式创建文件目录。
		fs.mkdirSync(folder);
	}
};

var uploadFolder = 'public/upload/';
createFolder(uploadFolder);

// 创建 multer 对象
var upload = multer({
    limits: { //限制上传文件的大小和数量
        fileSize: 10 * 1024,
        files: 2
    },
    storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype == 'image/png') {
            cb(null, true)
        } else {
            cb(new Error("格式错误"), false)
        }
    }
})

/* POST upload listing. */
router.post('/', upload.single('file'), async function (req, res, next) {
	var file = req.file;
	console.log(file)
	if (!/jpg|jpeg|png/.test(file.mimetype)) {
		res.json({ res_code: '0', message: "Error:请上传正确的图片格式（jpg|jpeg|png）" })
	} else {
		const url = file.path.replace("public", "")
		res.json({ message: "上传成功", url })
		// res.send(await addImg({ url }))
	}
	// 接收文件成功后返回数据给前端
});

let moreUpLoad = upload.array("files")
router.post('/more', function (req, res, next) {
    moreUpLoad(req, res, err => {
        if (err) {
            res.send({
                code: 0,
                err: err.message
            })
        } else {
            res.send({
                code: 1,
                message: "sucess"
            })
        }
    })
})

// 导出模块（在 app.js 中引入）
module.exports = router;
