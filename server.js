const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

app.use(express.urlencoded({extended: true}));
app.set('view engine','ejs');
app.set('views',__dirname+'/views');//이거 수정
app.engine('ejs', require('ejs').__express);//경로지정

var db
MongoClient.connect('mongodb+srv://jina26861:Pa55w.rd@cluster0.cpnf3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(에러,client){
    if (에러) return console.log(에러)
    db = client.db('todoapp')
    app.listen(8081, function(){
        console.log('server start')
    })
    
})


app.get('/', (요청,응답)=>{
    응답.send('8081 & todoapp is working....')
})
app.get('/write', (요청,응답)=>{
    응답.sendFile(__dirname + '/form.html')
})
app.post('/add', (요청,응답)=>{
    db.collection('count').findOne( {name:'게시물갯수'} , function(에러,result){
        if (에러) return console.log(에러)
        console.log(result.totalpost)
        var 총갯수 = result.totalpost

        db.collection('todolist').insertOne( {title:요청.body.title,date:요청.body.date,_id:총갯수+1} , function(에러,result){
            if (에러) return console.log(에러)
            console.log("저장완료")

            db.collection('count').updateOne( {name:'게시물갯수'} ,{ $inc:{totalpost:1}}, function(에러,result){
                if (에러) return console.log(에러)

                db.collection('todolist').find().toArray( function(에러, 결과){
                    응답.render('list.ejs', {posts: 결과})
                }) 
            })
       });
    });
})
app.get('/list', (요청,응답)=>{

})