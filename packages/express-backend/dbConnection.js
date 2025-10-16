import mongoose from "mongoose";

mongoose.set("debug", true);


/// the <user> and <db_password> should be replaced with the user accessing it. 
/// TODO: Write short console script to get user info for db access (setup script login later)
const uri = "mongodb+srv://<user>:<db_password>@maincluster.vhzpshf.mongodb.net/?retryWrites=true&w=majority&appName=MainCluster";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

/// Connection issue to debug later !!!!!
async function runMongo() {
    try {
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log(error)
    } finally {
        await mongoose.disconnect()
    }
}

runMongo()

export default runMongo;
