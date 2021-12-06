import Web3 from "web3";
import axios from "axios";
import Decimal from "decimal.js";

const abi = require("@/contract/abi.json");
const SuperAbi = require("@/contract/SuperAbi.json");

const web3 = new Web3("https://bsc-dataseed.binance.org/");

export async function getDailyTxn(today, now) {
  let query = `
  
  
  query ($network: EthereumNetwork!,

    $token: String!,
    $from: ISO8601DateTime,
    $till: ISO8601DateTime,
){
ethereum(network: $network){
dexTrades(options: { desc: "block.height"},
date: {since: $from till: $till }
exchangeName: {in:["Pancake","Pancake v2"]}
baseCurrency: {is: $token}){
transaction {
hash
}
smartContract{
address{
address
}
contractType
currency{
name
}}
tradeIndex
date {
date
}
block {
height
}
buyAmount
buyAmountInUsd: buyAmount(in: USD)
buyCurrency {
symbol
address
}
sellAmount
sellAmountInUsd: sellAmount(in: USD)
sellCurrency {
symbol
address
}
sellAmountInUsd: sellAmount(in: USD)
tradeAmount(in: USD)
transaction{
gasValue
gasPrice
gas
}}
}}`;

  let variables = {
    network: "bsc",
    token: "0x4B8f0bc4e86Ea14b0c22d356Af927bd7A43aC2c6",
    from: today,
    till: now,
    dateFormat: "%Y-%m-%d",
  };

  return await axios({
    method: "post",
    url: "https://graphql.bitquery.io",
    data: { query, variables },
    headers: {
      "X-API-KEY": "BQYuwBuluZ9md2ZfLfl8nVVXYj6eh5ay",
    },
  });
}

export async function getTokenTxs(wallet) {
  let query = `query($network: EthereumNetwork!, $address: String!, $wallet: String!) {
    ethereum(network: $network) {
        address(address: { is: $wallet }) {
            balances(currency: { is: $address }) {
                history {
                    value
                    transferAmount
                    timestamp
                    block
                }
                value
            }
        }
    }
  }
  `;
  let variables = {
    network: "bsc",
    wallet: wallet,
    address: "0x4B8f0bc4e86Ea14b0c22d356Af927bd7A43aC2c6",
  };
  return await axios({
    method: "post",
    url: "https://graphql.bitquery.io",
    data: { query, variables },
    headers: {
      "X-API-KEY": "BQYuwBuluZ9md2ZfLfl8nVVXYj6eh5ay",
    },
  });
}

export async function getAllTokenTxs() {
  let query = `{
    ethereum(network: bsc) {
      transfers(options: {desc: "block.timestamp.time", limit: 100000, offset: 0}, date: {since: "2021-05-25", till: null}, amount: {gt: 0}, currency: {is: "0x4B8f0bc4e86Ea14b0c22d356Af927bd7A43aC2c6"}) {
        block {
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
          }
          height
        }
        sender {
          address
          annotation
        }
        receiver {
          address
          annotation
        }
        transaction {
          hash
        }
        amount
        currency {
          symbol
        }
        external
      }
    }
  }`;
  return await axios({
    method: "post",
    url: "https://graphql.bitquery.io",
    data: { query },
    headers: {
      "X-API-KEY": "BQYuwBuluZ9md2ZfLfl8nVVXYj6eh5ay",
    },
  });
}

export async function getBUSDTxs(wallet) {
  let query = `
  query ($network: EthereumNetwork!,
          $address: String!,
          $limit: Int!,
          $offset: Int!,
          $currency: String!,
          
          $from: ISO8601DateTime,
          $till: ISO8601DateTime){
ethereum(network: $network){
transfers(options:{desc: "block.timestamp.time", limit: $limit, offset: $offset},
  date: {since: $from till: $till },
  amount: {gt: 0},
  currency: {is: $currency},
  sender: {is: $address},

  ) {

  block {
    timestamp {
      time (format: "%Y-%m-%d %H:%M:%S")
    }
    height
  }
  address: receiver {
    address
    annotation
  }
  currency {
    address
    symbol
  }
  amount
  transaction {
    hash
  }
  external
}
}
}`;
  let variables = {
    limit: 10000,
    offset: 0,
    network: "bsc",
    address: wallet,
    currency: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    from: null,
    till: null,
    dateFormat: "%Y-%m",
  };

  return await axios({
    method: "post",
    url: "https://graphql.bitquery.io",
    data: { query, variables },
    headers: {
      "X-API-KEY": "BQYuwBuluZ9md2ZfLfl8nVVXYj6eh5ay",
    },
  });
}

export function getRewardTotal(reward) {
  var total = 0;
  if (reward.data.data.ethereum.transfers.length != 0) {
    for (
      var idx = 0;
      idx <= reward.data.data.ethereum.transfers.length - 1;
      idx++
    ) {
      total += reward.data.data.ethereum.transfers[idx].amount;
    }
  } else {
    total = 0;
  }
  return total;
}

export async function getRewardTxs(wallet) {
  let query = `
  query ($network: EthereumNetwork!,
          $address: String!,
          $receiver: String!,
          $limit: Int!,
          $offset: Int!,
          $currency: String!,
          
          $from: ISO8601DateTime,
          $till: ISO8601DateTime){
ethereum(network: $network){
transfers(options:{desc: "block.timestamp.time", limit: $limit, offset: $offset},
  date: {since: $from till: $till },
  amount: {gt: 0},
  currency: {is: $currency},
  
  sender: {is: $address},
  receiver: {is: $receiver}

  ) {

  block {
    timestamp {
      time (format: "%Y-%m-%d %H:%M:%S")
    }
    height
  }
  address: receiver {
    address
    annotation
  }
  currency {
    address
    symbol
  }
  amount
  transaction {
    hash
  }
  external
}
}
}`;
  let variables = {
    limit: 10000,
    offset: 0,
    network: "bsc",
    address: "0x6FAacFe4Cd810c3387f9f8F07Dda79571ef4c068",
    currency: "BNB",
    receiver: wallet,
    from: null,
    till: null,
    dateFormat: "%Y-%m",
  };

  return await axios({
    method: "post",
    url: "https://graphql.bitquery.io",
    data: { query, variables },
    headers: {
      "X-API-KEY": "BQYuwBuluZ9md2ZfLfl8nVVXYj6eh5ay",
    },
  });
}
export async function outFlowTxs(wallet) {
  let query = `query ($network: EthereumNetwork!,
    $sender: String!,
    $offset: Int!
    $from: ISO8601DateTime,
    $till: ISO8601DateTime){
ethereum(network: $network){
transfers(options:{desc: "block.timestamp.time"  asc: "currency.symbol" offset: $offset},
date: {since: $from till: $till },
amount: {gt: 0},
sender: {is: $sender}) {

block {
timestamp {
time (format: "%Y-%m-%d %H:%M:%S")
}
height
}
address: receiver {
  address
  annotation
}
currency {
address
symbol
}
amount
transaction {
hash
}
external
}
}
}`;
  let variables = {
    offset: 0,
    network: "bsc",
    sender: wallet,
    currency: "",
    from: null,
    till: null,
    dateFormat: "%Y-%m",
  };

  return await axios({
    method: "post",
    url: "https://graphql.bitquery.io",
    data: { query, variables },
    headers: {
      "X-API-KEY": "BQY7MnGAC0IHnCjpq5n90aruOhBwBxsR",
    },
  });
}
export async function inFlowTxs(wallet) {
  let query = `query ($network: EthereumNetwork!,
    $address: String!,
    $offset: Int!
    $from: ISO8601DateTime,
    $till: ISO8601DateTime){
ethereum(network: $network){
transfers(options:{desc: "block.timestamp.time"  asc: "currency.symbol" offset: $offset},
date: {since: $from till: $till },
amount: {gt: 0},
receiver: {is: $address}) {

block {
timestamp {
time (format: "%Y-%m-%d %H:%M:%S")
}
height
}
address: sender {
address
annotation
}
currency {
address
symbol
}
amount
transaction {
hash
}
external
}
}
}
  `;
  let variables = {
    offset: 0,
    network: "bsc",
    address: wallet,
    from: null,
    till: null,
    dateFormat: "%Y-%m",
  };

  return await axios({
    method: "post",
    url: "https://graphql.bitquery.io",
    data: { query, variables },
    headers: {
      "X-API-KEY": "BQY7MnGAC0IHnCjpq5n90aruOhBwBxsR",
    },
  });
}

export async function getAllTxs(wallet) {
  let query = `query($network: EthereumNetwork!, $wallet: String!) {
    ethereum(network: $network) {
        address(address: { is: $wallet }) {
            balances {
                currency {
                  address
                  symbol
                  decimals
                  name
              }
              history {
                  value
                  transferAmount
                  timestamp
                  block
              }
              value
            }
        }
    }
  }
  `;
  let variables = {
    network: "bsc",
    wallet: wallet,
  };
  return await axios({
    method: "post",
    url: "https://graphql.bitquery.io",
    data: { query, variables },
    headers: {
      "X-API-KEY": "BQY7MnGAC0IHnCjpq5n90aruOhBwBxsR",
    },
  });
}

export async function getTokenBalanceWeb3(token, wallet, decimals) {
  try {
    var tokenInst = new web3.eth.Contract(SuperAbi, token);
    let val = await tokenInst.methods.balanceOf(wallet).call();
    return convertDecimal(val, decimals).toFixed(3);
  } catch (e) {
    console.log(e);
  }
}

export async function getTotalBNBRewarded(token) {
  try {
    var tokenInst = new web3.eth.Contract(SuperAbi, token);
    let val = await tokenInst.methods.getTotalDividendsDistributed().call();
    return val;
  } catch (e) {
    console.log(e);
  }
}

export async function getBnbToUsd() {
  return axios
    .get("https://api.binance.com/api/v3/avgPrice?symbol=BNBBUSD")
    .then((response) => {
      return response.data.price;
    })
    .catch((err) => {
      console.log(err);
    });
}

export async function getBurnt(token, decimals) {
  let burnt = await getTokenBalanceWeb3(
    token,
    "0x000000000000000000000000000000000000dead",
    decimals
  );

  if (burnt == 0) {
    burnt = await getTokenBalanceWeb3(
      token,
      "0x0000000000000000000000000000000000000001",
      decimals
    );
  }

  return burnt;
}

export async function getTokenTotalSupply(token, decimals) {
  try {
    var tokenInst = new web3.eth.Contract(SuperAbi, token);
    let supply = await tokenInst.methods.totalSupply().call();
    return convertDecimal(supply, decimals).toFixed();
  } catch (e) {
    console.log(e);
  }
}

export async function getTokenToBnb(pair, balance) {
  try {
    var pairContract = await new web3.eth.Contract(abi, pair);

    let token1Address = await pairContract.methods.token1().call();
    let token0Address = await pairContract.methods.token0().call();

    let token1Decimals = await getTokenDecimals(token1Address);
    let token0Decimals = await getTokenDecimals(token0Address);

    let reserves = await getReserves(pair);
    let reserve0 = parseFloat(
      convertDecimal(reserves.reserve0, token0Decimals).toFixed()
    );
    let reserve1 = parseFloat(
      convertDecimal(reserves.reserve1, token1Decimals).toFixed()
    );

    let val = 1 / (reserve1 / reserve0);

    let exchangeVal =
      reserve0 - (reserve0 * reserve1) / (parseFloat(balance) + reserve1);

    if (val > 1) {
      val = 1 / (reserve0 / reserve1);
      exchangeVal =
        reserve1 - (reserve0 * reserve1) / (parseFloat(balance) + reserve0);
    }
    return {
      price: val,
      exchangeVal: exchangeVal,
    };
  } catch (e) {
    console.log(e);
  }
}

export async function getReserves(pair) {
  try {
    var pairContract = await new web3.eth.Contract(abi, pair);
    return await pairContract.methods.getReserves().call();
  } catch (e) {
    console.log(e);
  }
}

export async function checkAddress(address) {
  if (
    address == "0x000000000000000000000000000000000000dead" ||
    address == "0x0000000000000000000000000000000000000001"
  ) {
    return false;
  }
  let valid = await web3.utils.isAddress(address);
  return valid;
}
export function convertDecimal(token_amount, token_decimal) {
  return new Decimal(token_amount).dividedBy(Decimal.pow(10, token_decimal));
}

export async function getTokenDecimals(address) {
  var contract = await new web3.eth.Contract(SuperAbi, address);

  return await contract.methods.decimals().call();
}
