import mongoose from 'mongoose'
const schema = mongoose.Schema({
    username: String,
    message: String,
    timestamp: String,
})

export default mongoose.model('messages', schema)
