const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const keyspath = path.join(__dirname, '../keys/');
const pubilcKey = fs.readFileSync(`${keyspath}public.pem`, 'utf8')
const privateKey = fs.readFileSync(`${keyspath}private.key`, 'utf8')
const jwtService = {
    generate: (payload) => {
        return jwt.sign(payload, privateKey.toString(), {
            algorithm: 'RS256',
            subject: 'data',
            allowInsecureKeySizes: true,
            issuer: 'happiestminds.com',
            expiresIn: '24h',
            
        })
    },
    verify: (token) => {
        return jwt.verify(token, pubilcKey.toString(), { algorithms:['RS256'] })
    }
}
module.exports = { jwtService }

// try {
//     const token = jwtService.generate({
//         name: "mantu pani"
//     })
    
//     const data = jwtService.verify(token)
    
//     console.log(token, data);
// } catch (error) {
//     console.log(error);
// }