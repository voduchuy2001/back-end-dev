import bcrypt from 'bcrypt';
const saltRounds = 10

const hashPassword = (userPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            await bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(userPassword, salt, function (err, hash) {
                    resolve(hash)
                });
            });
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    hashPassword,
}