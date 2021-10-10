# Simple Exchange

## Description

This repo is a simple practice with elliptic curve cryptography using js library "elliptic". It generates a few key pairs with a balance and use the public keys as addresses.
Users can check the balance of any address and send "amounts" to other addresses providing the private key that matches the sender address. The private key and the data sent to 
the server is used to create a digital signature wich is then verified using the public key (the sender address). 

The server side application uses express. The client side uses parcel and dom.

## Configuration

Download the repo, run `npm install` for the dependencies. Then run the server side app with `node .\server\index` (you can always use `nodemon`). Lastly run the client side
app with `npx parcel .\client\index.html`

