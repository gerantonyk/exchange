import "./index.scss";


const server = "http://localhost:3042";

document.getElementById("exchange-address").addEventListener('input', ({ target: {value} }) => {
  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value.toUpperCase()}`).then((response) => {
    return response.json();
  }).then(({balance }) => {
    document.getElementById("balance").innerHTML = balance
    
  });
});

document.getElementById("transfer-amount").addEventListener('click', () => {
  const sender = document.getElementById("exchange-address").value.toUpperCase();
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value.toUpperCase();
  const senderPrivateKey = document.getElementById("exchange-privateKey").value.toUpperCase();
  //tengo que hacer la parte de la firma digital y mandarla al back
  // const key = ec.keyFromPrivate(senderPrivateKey)
  // const msgHash = SHA256(recipient + amount)
  // console.log(recipient + amount)
  // const signature = key.sign(msgHash.toString());
  console.log( sender, amount, recipient, senderPrivateKey)
  if (!sender) return alert('Your address cannot be empty')
  if (!senderPrivateKey) return alert('Your private key cannot be empty')
  if (!amount) return alert('Amount cannot be empty')
  if (!recipient) return alert('Recipient cannot be empty')
  const body = JSON.stringify({
    sender, amount, recipient, senderPrivateKey
  });

  const request = new Request(`${server}/send`, { method: 'POST', body });

  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    return response.json();
  }).then(({message, balance }) => {
    document.getElementById("balance").innerHTML = balance;
    console.log(message);
    if (message) alert(message);
  });
});
