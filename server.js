const express = require('express');
const cors = require('cors');
const cookierParser = require('cookie-parser');
const allRoute = require('./src/routes/index.js');

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


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});