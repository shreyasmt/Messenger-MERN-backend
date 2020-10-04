// dependencies
import express from 'express'
import mongoose from 'mongoose'
import Pusher from 'pusher'
import cors from 'cors'
import Messages from './dbmessage.js'
//app config
const app = express()
const port = process.env.PORT || 9000

var pusher = new Pusher({
    appId: '1084576',
    key: '162c2b46604a8f0e412e',
    secret: 'bdafd5a6b13986393039',
    cluster: 'ap1',
    useTLS: true
  });

//middlewares
app.use(express.json())
app.use(cors())
//db config
const mongodb = 'mongodb+srv://admin:vTtCdc6jN9aQzF1b@cluster0.ku7il.mongodb.net/messenger?retryWrites=true&w=majority'
mongoose.connect(mongodb,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology:true
})

mongoose.connection.once('open',()=>{
    console.log('db connnected')
    const changestream = mongoose.connection.collection('messages').watch()
    changestream.on('change',(change)=>{
       pusher.trigger('messages','newMessage',{
           'change':change
       })
    })

})
//api routes
app.get('/',(req,res)=> res.status(200).send("hello!"))
app.post('/save/messages',(req,res)=>{
    const dbmessage = req.body
    Messages.create(dbmessage,(err,data)=>{err?res.status(500).send(err):res.status(201).send(data)})
})

app.get('/retrive/conversation',(req,res)=>{
    Messages.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            data.sort((b,a)=>{
                return a.timestamp - b.timestamp
            })
            res.status(201).send(data)
        }
    })
    
        
})

//listen

app.listen(port, ()=>console.log(`listening:${port}`))