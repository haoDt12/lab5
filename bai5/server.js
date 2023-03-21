const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const multer = require('multer');

app.use(bodyParser.urlencoded({ extended: true }))

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let fileName = file.originalname;
        console.log(fileName);

        let arr = fileName.split('.');
        let newFileName = arr[0] + '-' + Date.now() + '.' + arr[1];

        cb(null,newFileName)
    }
})
let diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
      // Định nghĩa nơi file upload sẽ được lưu lại
      callback(null, "uploads");
    },
    filename: (req, file, callback) => {
      // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
      // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
      let math = "image/jpeg";
      if (math.indexOf(file.mimetype) === -1) {
        let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg.`;
        return callback(errorMess, null);
      }
      // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
      let filename = `${Date.now()}-hao-${file.originalname}`;
      callback(null, filename);
    }
  });
const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        // Nếu định dạng file không phải là JPEG, thực hiện đổi định dạng
        const newFile = file.originalname.replace(/\..+$/, '.jpg');
        file.originalname = newFile;
        cb(null, true);
    }
};

var upload = multer({ storage: storage , fileFilter:fileFilter})
var uploadmultiple = multer({ storage: storage})
let uploadFileJpeg = multer({storage: diskStorage}).single("myImgJpeg");
//Uploading multiple files  
app.post('/uploadmultiple', uploadmultiple.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})
app.post('/uploadChange', upload.array('myChangeImg'), function (req, res, next) {
     const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
});

app.post("/uploadJpeg", (req, res) => {
    // Thực hiện upload file, truyền vào 2 biến req và res
    uploadFileJpeg(req, res, (error) => {
      // Nếu có lỗi thì trả về lỗi cho client.
      // Ví dụ như upload một file không phải file ảnh theo như cấu hình của mình bên trên
      if (error) {
        return res.send(`Error when trying to upload: ${error}`);
      }
      // Không có lỗi thì lại render cái file ảnh về cho client.
      // Đồng thời file đã được lưu vào thư mục uploads
      res.send('Thành công')
    });
  });




app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});