const express = require('express');
const SHA256 = require('crypto-js/sha256');
const app = express();
const cors = require('cors');
const port = 3042;

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

// const key = ec.genKeyPair();
// const privKey  = key.getPrivate().toString(16)//toHex;
// console.log("PrivateKey",privKey);
// const publicKey  = key.getPublic().encode('hex');
// console.log("PublicKey",publicKey.toUpperCase());
// const publicKey2 = ec.keyFromPrivate(privKey.toUpperCase()).getPublic().encode('hex')
// console.log("public",publicKey2)
initialAccounts = []
for (let i = 0; i < 3; i++) {
  let key = ec.genKeyPair()
  initialAccounts.push(key.getPublic().encode('hex').toUpperCase());
  console.log('privada',key.getPrivate().toString(16))
  console.log('publica',key.getPublic().encode('hex'))
}
const balances = {
  [initialAccounts[0]]: 100,
  [initialAccounts[1]]: 50,
  [initialAccounts[2]]: 75,
}
app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount,senderPrivateKey} = req.body;
  //signing with the private key
  let key = ec.keyFromPrivate(senderPrivateKey)
  const msgHash = SHA256(recipient + amount).toString()
  let signature = key.sign(msgHash.toString());
  signature= {
    r: signature.r.toString(16),
    s: signature.s.toString(16)
  }
  //verifying with the public key

  key = ec.keyFromPublic(sender,'hex')
  if (!key.verify(msgHash, signature)) return res.send({balance: balances[sender],message:'Invalid Private Key'})
  if (balances[sender]<amount) return res.send({ balance: balances[sender],message:"You don't have enough founds"})
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  console.log("Transfer complete, new balances \n",balances)


  res.send({ balance: balances[sender],message:'Transfer completed'});
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
