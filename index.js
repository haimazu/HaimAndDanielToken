let myWeb3;
let contract;

const contractAddress = "0x852Adfd0839fF2158B7C4309F3dB5a2F1da6B49F";
const walletAddress = "0xF1e0bdf94FB53f84B65E493c574434F7B01e50fB";
const adminAddress = "0xF1e0bdf94FB53f84B65E493c574434F7B01e50fB";

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

const checkBalance = async () => {
  try {
    // ETH balance
    const ETHBigNumber = await myWeb3.eth.getBalance(walletAddress);
    let ETHbalance = myWeb3.utils.fromWei(ETHBigNumber, "ether");
    // balance is rounded
    Number.isInteger(ETHbalance)
      ? ETHbalance
      : (ETHbalance = Number(ETHbalance).toFixed(4));

    // HAD balance
    const HADBigNumber = await contract.methods.balanceOf(walletAddress).call();
    let HADbalance = myWeb3.utils.fromWei(HADBigNumber);
    // balance is rounded
    Number.isInteger(HADbalance)
      ? HADbalance
      : (HADbalance = Number(HADbalance).toFixed(4));

    // show info-title
    document.getElementById("info-title").innerHTML = "<b>Owner info</b>";
    // show info
    document.getElementById(
      "info"
    ).innerHTML = `Owner Address: <b>${walletAddress}
        </b><br/>Owner Balances: <b>${ETHbalance}</b> ETH
        </b><br/><br/><b>${HADbalance}</b> HAD`;
  } catch (e) {
    console.log(e);
  }
};

const getStat = async () => {
  let s = await contract.methods.getStat().call();
  let stat = {
    Amount: parseInt(myWeb3.utils.fromWei(s[0], "wei")),
    Volume: parseFloat(myWeb3.utils.fromWei(s[1], "ether")),
  };
  document.getElementById(
    "stat"
  ).innerHTML = `<b>Amount:</b> ${stat.Amount} transfer/s<br/><b>Volume:</b> ${stat.Volume} HAD`;
  //console.log(stat);
};

const send = async (from, to, amount) => {
  let am = myWeb3.utils.toWei(amount.toString(), "ether");
  let trans = await contract.methods
    .transfer(to, am)
    .send({ from: from, gas: 500000, gasPrice: 1e6 });
  console.log(trans.transactionHash);
};

const connectMetamask = async () => {
  if (typeof web3 !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      // check if the current provider is metamask
      //console.log(web3.currentProvider.isMetaMask)
      // activate Metamask in the browser window
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // get web3 instance for the next usage
      myWeb3 = new Web3(window.ethereum);

      // contract
      contract = new myWeb3.eth.Contract(minABI, contractAddress);

      // check balance
      if (document.URL.includes("index.html")) {
        setInterval(() => {
          checkBalance();
        }, 2000);
      }

      if (document.URL.includes("latestTransactions.html")) {
        setInterval(() => {
          getStat();
        }, 2000);
      }
    } catch (e) {
      document.getElementById("info").innerText = "error connection";
      //console.log("error connection")
    }
  } else {
    document.getElementById("info").innerText = "web3 is not found";
    //console.log("web3 is not found")
  }
};

connectMetamask();
