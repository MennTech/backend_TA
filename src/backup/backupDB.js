const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const backupMySQL = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const timestamp = `${year}-${month}-${day}_${hours}-${minutes}`;
    const backupFileName = `backup_${timestamp}.sql`;

    const backupDir = path.join(__dirname, 'files');
    const backupPath = path.join(backupDir, backupFileName);

    if(!fs.existsSync(backupDir)){
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const dbUser = process.env.DB_USERNAME;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;

    

    const command = `mysqldump -u ${dbUser} -p${dbPassword} ${dbName} > "${backupPath}"`;

    exec(command, (error) => {
        if(error){
            console.error(`Backup Gagal: ${error.message}`);
            return;
        }
        console.log(`Backup Berhasil: ${backupFileName}`);
    })
}

module.exports = { backupMySQL };