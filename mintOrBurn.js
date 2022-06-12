// Calculating the total transaction, fee = Gas limit * (Base fee + Tip)

const mint = async () => {
  let amount = document.getElementById("mint").value;
  //myWeb3.eth.getGasPrice().then((result)=>{console.log(myWeb3.utils.fromWei(result, 'ether'))})

  if (amount <= 0) {
    alert("Amount must be greater than 0");
    return;
  }

  let trans = await contract.methods
    .mint(amount)
    // default gas price in wei, 20 gwei in this case
    .send({ from: adminAddress, gasLimit: 900000, gasPrice: "20000000000" });

  const link = `https://ropsten.etherscan.io/tx/${trans.transactionHash}`;
 
  localStorage.setItem(`${trans.transactionHash}-Mint`, `${link}`);

  alert(`${amount} HAD token/s added successfully !`);

  window.location.replace("latestTransactions.html");
};

const burn = async () => {
  let amount = document.getElementById("burn").value;

  if (amount <= 0) {
    alert("Amount must be greater than 0");
    return;
  }

  let trans = await contract.methods
    .burn(amount)
    // default gas price in wei, 20 gwei in this case
    .send({ from: adminAddress, gasLimit: 900000, gasPrice: "20000000000" });

  const link = `https://ropsten.etherscan.io/tx/${trans.transactionHash}`;

  localStorage.setItem(`${trans.transactionHash}-Burn`, `${link}`);

  alert(`${amount} HAD token/s burned successfully !`);

  window.location.replace("latestTransactions.html");
};