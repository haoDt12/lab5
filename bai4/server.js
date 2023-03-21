const express = require('express')
const app = express()
const port = 3030
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

var upload = multer({ storage: storage, limits:{fileSize: 1*1024*1024} }).single('myFile')

app.post('/uploadfile',function(req,res){
    upload(req,res,function(err){
        const file = req.file;
        if(err instanceof multer.MulterError){
            return res.send('Kích thước lớn hơn 1MB')
        }else if(!file){
            return res.send('Tệp không xác định')
        }
         res.send(file);
    })
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});