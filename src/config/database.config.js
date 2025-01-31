import mongoose from "mongoose";
import config from "./config";

(async () => {

    try {
        const db = await mongoose.connect(config.CONNECTION_STRING, {
            dbName: config.DATABASE,
        });
        console.log(`Database connected to: ${db.connection.name}`);
    } catch (error) {
        console.error(`Error: ${error}`);
    }

})();