const sendTokens = async (e) => {
  e.preventDefault();
  let address = document.forms[0].address.value;
  let amount = myWeb3.utils.toWei(document.forms[0].amount.value, "ether");

  if (amount <= 0) {
    alert("Amount must be greater than 0");
    return;
  }

  let trans = await contract.methods
    .transfer(address, amount)
    // default gas price in wei, 20 gwei in this case
    .send({ from: adminAddress, gasLimit: 900000, gasPrice: "20000000000" });

  const link = `https://ropsten.etherscan.io/tx/${trans.transactionHash}`;

  localStorage.setItem(`${trans.transactionHash}-Transfer`, `${link}`);

  alert("Transaction completed successfully !");

  window.location.replace("latestTransactions.html");
};