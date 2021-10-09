const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const key = ec.genKeyPair();
console.log("key",key);
const privKey  = key.getPrivate()//.toString(16)//toHex;
console.log("PrivateKey",privKey);
const publicKey  = key.getPublic().encode('hex');
console.log("PublicKey",publicKey);
const publicKey2 = ec.keyFromPrivate(privKey).getPublic().encode('hex')
console.log("public",publicKey2)
initialAccounts = []
for (let i = 0; i < 3; i++) {
  initialAccounts.push(ec.genKeyPair().getPublic().encode('hex'));
  
}
const balances = {
  [initialAccounts[0]]: 100,
  [initialAccounts[1]]: 50,
  [initialAccounts[2]]: 75,
}
console.log(balances)
app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount} = req.body;
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
