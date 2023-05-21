const mongoose = require('mongoose');

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL,{
            useNewURLParser:true,
            useUnifiedTopology:true,
        })
        console.log(`DB connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit()
    }
}

module.exports = connectDB