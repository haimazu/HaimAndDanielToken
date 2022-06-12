const updateEquivalent = () => {
  let HADtoETH = document.getElementById("HADtoETH").value;
  let ETHtoHAD = document.getElementById("ETHtoHAD").value;

  document.getElementById(
    "HADtoETHmsg"
  ).innerHTML = `<b>HAD equivalent:</b> ${HADtoETH / 100} ETH`;

  document.getElementById(
    "ETHtoHADmsg"
  ).innerHTML = `<b>ETH equivalent:</b> ${ETHtoHAD * 100} HAD`;
};

const exchangeHADtoETH = () => {
  let HADtoETH = document.getElementById("HADtoETH").value;

  if (HADtoETH <= 0) {
    alert("Amount must be greater than 0");
    return;
  }

  alert(`${HADtoETH} HAD exchanged to ${HADtoETH / 100} ETH !`);
  // Redirect to home page to see the balance
  window.location.replace("index.html");
};

const exchangeETHtoHAD = () => {
  let ETHtoHAD = document.getElementById("ETHtoHAD").value;

  if (ETHtoHAD <= 0) {
    alert("Amount must be greater than 0");
    return;
  }

  alert(`${ETHtoHAD} ETH exchanged to ${ETHtoHAD * 100} HAD !`);
  // Redirect to home page to see the balance
  window.location.replace("index.html");
};

const callUpdate = () => {
  setInterval(() => {
    updateEquivalent();
  }, 2000);
};

callUpdate();
