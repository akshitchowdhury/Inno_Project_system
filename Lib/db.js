const mongoose = require("mongoose")


const connectDB = async()=>{
    try {
        await mongoose.connect("mongodb+srv://raikamiryu:XdPL5daQZSQLMSxL@cluster0.yd53k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Mongo DB connected")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB;

// 