const express = require('express');
const cors = require('cors');
const cookierParser = require('cookie-parser');
const allRoute = require('./src/routes/index.js');
const cron = require('node-cron');
const { backupMySQL } = require('./src/backup/backupDB.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors(
    {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }
));
app.use(cookierParser());

app.use('/api/v1/', allRoute);

cron.schedule('0 2 1 * *', () => {
    console.log('Backup MySQL dijalankan setiap 1 bulan');
    backupMySQL();
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});