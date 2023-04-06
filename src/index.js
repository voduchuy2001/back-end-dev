import express from 'express';
import initAPIRoutes from './routes/api';
import bodyParser from 'body-parser';
import cors from "cors";
import database from "../src/config/database";

require('dotenv').config();
const app = express();
database();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

const port = process.env.PORT || 6969;

initAPIRoutes(app);
app.use((req, res) => {
    return res.status(404).json({msg: '404'});
});


app.listen(port, () => {
    console.log('Server is running on [http://localhost:' + port + ']');
})