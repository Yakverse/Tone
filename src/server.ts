import express from 'express';
import helmet from 'helmet';
import App from './main';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (_, res) => {
    res.send({ online: true })
})

app.listen(3000, () => {
    console.log('API listening at 3000')
    App // unnecessary
})