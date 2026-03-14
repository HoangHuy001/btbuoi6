const { generateKeyPairSync } = require('crypto');
const { writeFileSync, mkdirSync, existsSync } = require('fs');
const path = require('path');
const keysDir = path.join(__dirname, '..', 'keys');
if (!existsSync(keysDir)) mkdirSync(keysDir);

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
});

writeFileSync(path.join(keysDir, 'private.key'), privateKey);
writeFileSync(path.join(keysDir, 'public.key'), publicKey);
console.log('Generated RSA key pair at keys/private.key and keys/public.key');
