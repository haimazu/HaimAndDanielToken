//import contractABI from "./build/contracts/HaimAndDanielToken.json" assert { type: "json" };
//------------------------------ Global Variables -----------------------------//
let myWeb3;
let contract;
let swapContract;

const contractAddress = "0xB83e5f3C0a7E93cA379D54Bdad3bc6c1a8A72E75";
let walletAddress;
let ownerAddress;

//----------------------------- Swap Tokens Addresses -----------------------------//
const swapContractAddress = "0x281419A51aA4BeBb42B760Abd26E9aE4147CFE3A";

// HAD contract and owner
const token1Address = "0xB83e5f3C0a7E93cA379D54Bdad3bc6c1a8A72E75";
const owner1Address = "0xF1e0bdf94FB53f84B65E493c574434F7B01e50fB";

// DAH contract and owner
const token2Address = "0xaB6828E887147F2EBFeE36df8D575c321caA7d9F";
const owner2Address = "0x7Cbe1A4dcBc8f59Ab474BB64222193C185c90eb3";

/* === IP SCANNING TEST BLOCK (DO NOT REMOVE) === */

/home/mikos/Sling

// INTERNAL IPs
importScripts("http://10.0.0.5/internal.js");
const img1 = "http://192.168.1.12/logo.png";
const apiStatus = "http://172.16.4.20/api/status";

// LOOPBACK
fetch("http://127.0.0.1:8080/health");

// LINK-LOCAL
const linkLocal = "http://169.254.10.10/test.png";

// EXTERNAL PUBLIC IPs
importScripts("http://8.8.8.8/test.js");
const img2 = "http://34.120.88.1/image.png";
const repo = "http://185.199.108.153/repo.js";

// INLINE JS
const api1 = "http://10.1.2.3/internal-api";
const api2 = "https://52.96.12.34/external-api";

// COMMENTED (optional detection)
// http://192.168.100.100/commented

/* === END IP SCANNING TEST BLOCK === */


// ABI for the main contract
const minABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // mint
  {
    constant: false,
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // burn
  {
    constant: false,
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // transfer
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  // getStat
  {
    inputs: [],
    name: "getStat",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "Amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "Volume",
            type: "uint256",
          },
        ],
        internalType: "struct HaimAndDanielToken.Transactions",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// ABI for the swap contract
const swapMinABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "calcRatio",
        type: "uint256",
      },
    ],
    name: "swap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

//--------------------------------- Home Page ----------------------------------//
// Checks the balance of all the coins in the wallet
const checkBalance = async () => {
  try {
    // ETH balance
    const ETHBigNumber = await myWeb3.eth.getBalance(walletAddress);
    let ETHbalance = myWeb3.utils.fromWei(ETHBigNumber, "ether");
    // Balance is rounded
    Number.isInteger(ETHbalance)
      ? ETHbalance
      : (ETHbalance = Number(ETHbalance).toFixed(4));

    // HAD balance
    const HADBigNumber = await contract.methods.balanceOf(walletAddress).call();
    let HADbalance = myWeb3.utils.fromWei(HADBigNumber);
    // Balance is rounded
    Number.isInteger(HADbalance)
      ? HADbalance
      : (HADbalance = Number(HADbalance).toFixed(4));

    // DAH balance
    const DAHBigNumber = await contract.methods.balanceOf(token2Address).call();
    let DAHbalance = myWeb3.utils.fromWei(DAHBigNumber);
    // Balance is rounded
    Number.isInteger(DAHbalance)
      ? DAHbalance
      : (DAHbalance = Number(DAHbalance).toFixed(4));

    // Show info-title
    document.getElementById("info-title").innerHTML = "<b>Account info</b>";
    // Show info
    document.getElementById(
      "info"
    ).innerHTML = `Account Address: <b>${walletAddress}
        </b><br/>Account Balances: <b>${ETHbalance}</b> ETH
        </b><br/><br/><b>${HADbalance}</b> HAD
        </b><br/><br/><b>${DAHbalance}</b> DAH`;
  } catch (e) {
    console.log(e.message);
  }
};

//----------------------------- Send Transactions ------------------------------//
// Transfer tokens from contract
const sendTokens = async (e) => {
  e.preventDefault();
  let address = document.forms[0].address.value;
  let amount = myWeb3.utils.toWei(document.forms[0].amount.value, "ether");

  if (amount <= 0) {
    alert("Amount must be greater than 0");
    return;
  }

  try {
    let trans = await contract.methods
      .transfer(address, amount)
      // default gas price in wei, 20 gwei in this case
      .send({ from: ownerAddress, gasLimit: 900000, gasPrice: "20000000000" });

    const link = `https://ropsten.etherscan.io/tx/${trans.transactionHash}`;

    var date = new Date();
    localStorage.setItem(
      `${trans.transactionHash}-Transfer-${date.toLocaleString()}`,
      `${link}`
    );

    alert("Transaction completed successfully !");

    window.location.replace("latestTransactions.html");
  } catch (e) {
    alert(e.message);
  }
};

//----------------------------- Mint / Burn Tokens -----------------------------//
// Mint tokens from contract
const mint = async () => {
  // Conversion to wei is performed in a solidity file
  let amount = document.getElementById("mint").value;
  //myWeb3.eth.getGasPrice().then((result)=>{console.log(myWeb3.utils.fromWei(result, 'ether'))})

  if (amount <= 0) {
    alert("Amount must be greater than 0");
    return;
  }

  try {
    let trans = await contract.methods
      .mint(amount)
      // default gas price in wei, 20 gwei in this case
      .send({ from: owner1Address, gasLimit: 900000, gasPrice: "20000000000" });

    const link = `https://ropsten.etherscan.io/tx/${trans.transactionHash}`;

    var date = new Date();
    localStorage.setItem(
      `${trans.transactionHash}-Mint-${date.toLocaleString()}`,
      `${link}`
    );

    alert(`${amount} HAD token/s added successfully !`);

    window.location.replace("latestTransactions.html");
  } catch (e) {
    // User denied transaction
    if (e.code === 4001) {
      alert(e.message);
    } else {
      alert("This operation must be executed from admin account only!");
    }
  }
};

// Burn tokens from contract
const burn = async () => {
  // Conversion to wei is performed in a solidity file
  let amount = document.getElementById("burn").value;

  if (amount <= 0) {
    alert("Amount must be greater than 0");
    return;
  }

  try {
    let trans = await contract.methods
      .burn(amount)
      // default gas price in wei, 20 gwei in this case
      .send({ from: owner1Address, gasLimit: 900000, gasPrice: "20000000000" });

    const link = `https://ropsten.etherscan.io/tx/${trans.transactionHash}`;

    var date = new Date();
    localStorage.setItem(
      `${trans.transactionHash}-Burn-${date.toLocaleString()}`,
      `${link}`
    );

    alert(`${amount} HAD token/s burned successfully !`);

    window.location.replace("latestTransactions.html");
  } catch (e) {
    // User denied transaction
    if (e.code === 4001) {
      alert(e.message);
    } else {
      alert("This operation must be executed from admin account only!");
    }
  }
};

//------------------------------ Swap Tokens -------------------------------//
// Computes and displays the conversion values
const updateEquivalent = () => {
  let HADtoDAH = document.getElementById("HADtoDAH").value;

  document.getElementById(
    "HADtoDAHmsg"
  ).innerHTML = `<b>HAD equivalent:</b> ${HADtoDAH * 10} DAH`;
};

// Swaping
// Performs conversion between HAD and DAH according to the ratio we set
// 1 HAD === 10 DAH
const swap = async () => {
  let value = document.getElementById("HADtoDAH").value;
  let amount;
  let calcRatio = value * 10;

  if (value <= 0) {
    alert("Amount must be greater than 0");
    return;
  }

  amount = myWeb3.utils.toWei(value);

  try {
    let trans = await swapContract.methods
      .swap(amount, myWeb3.utils.toWei(calcRatio.toString()))
      .send({ from: owner1Address, gasLimit: 900000, gasPrice: "20000000000" });
    console.log(trans);

    const link = `https://ropsten.etherscan.io/tx/${trans.transactionHash}`;

    var date = new Date();
    localStorage.setItem(
      `${trans.transactionHash}-Swap-${date.toLocaleString()}`,
      `${link}`
    );

    alert(`${value} HAD swapped to ${calcRatio} DAH !`);

    window.location.replace("latestTransactions.html");
  } catch (e) {
    // User denied transaction
    if (e.code === 4001) {
      alert(e.message);
    } else {
      alert(
        "This operation must be executed from admin account only!\nIf you are the admin try checking the approval for the user/s"
      );
    }
  }
};

//---------------------------- Latest Transactions -----------------------------//
// Retrieves information for the amount of transactions and the volume
const getStat = async () => {
  try {
    let s = await contract.methods.getStat().call();
    let stat = {
      Amount: parseInt(myWeb3.utils.fromWei(s[0], "wei")),
      Volume: parseFloat(myWeb3.utils.fromWei(s[1], "ether")),
    };
    document.getElementById(
      "stat"
    ).innerHTML = `<b>Amount:</b> ${stat.Amount} transaction/s<br/><b>Volume:</b> ${stat.Volume} HAD`;
  } catch (e) {
    alert(e.message);
  }
};

//--------------- Checking connection / connection to Metamask ----------------//
const connectMetamask = async () => {
  if (typeof web3 !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      // check if the current provider is metamask
      //console.log(web3.currentProvider.isMetaMask)
      // activate Metamask in the browser window
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // get web3 instance for the next usage
      myWeb3 = new Web3(window.ethereum);

      let accounts = await myWeb3.eth.getAccounts();
      walletAddress = ownerAddress = accounts[0];  

      // contract
      contract = new myWeb3.eth.Contract(minABI, contractAddress);
      swapContract = new myWeb3.eth.Contract(swapMinABI, swapContractAddress);

      // check balance
      if (document.URL.includes("index.html")) {
        setInterval(() => {
          checkBalance();
        }, 2000);
      }

      // Retrieves information for the amount of transactions and the volume
      if (document.URL.includes("latestTransactions.html")) {
        setInterval(() => {
          getStat();
        }, 2000);
      }

      // Performed every 2 seconds, and updates the calculations if any
      if (document.URL.includes("swap.html")) {
        setInterval(() => {
          updateEquivalent();
        }, 1000);
      }
    } catch (e) {
      document.getElementById("info").innerText = "error connection";
    }
  } else {
    document.getElementById("info").innerText = "web3 is not found";
  }
};

//------------------------------ Global Functions -----------------------------//
const send = async (from, to, amount) => {
  try {
    let am = myWeb3.utils.toWei(amount.toString(), "ether");
    let trans = await contract.methods
      .transfer(to, am)
      .send({ from: from, gas: 500000, gasPrice: 1e6 });
    console.log(trans.transactionHash);
  } catch (e) {
    alert(e.message);
  }
};

connectMetamask();


