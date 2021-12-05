<template>
  <v-container class="my-5">
    <v-row class="justify-center">
      <v-col
        cols="12"
        class="
          d-md-flex
          justify-space-between
          align-center
          text-center text-md-right
        "
      >
        <v-text-field
          dark
          class="w-300 mr-md-5 pb-md-0 mb-md-0 mb-5"
          name="wallet"
          hide-details
          v-model="wallet"
          placeholder="0x..."
          label="Wallet address"
          outlined
        ></v-text-field>
        <div>
          <v-btn
            :disabled="!wallet || loading"
            type="submit"
            @click="submitForm"
          >
            Get values
          </v-btn>
          <v-btn
            class="ml-3"
            type="submit"
            @click="reloadTxs"
            :disabled="!wallet || loading"
          >
            Clear Data
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="5">
        <v-row>
          <v-col cols="12">
            <v-card
              class="card-gradient"
              dark
              color="#cca701"
              elevation="10"
              :loading="loading"
            >
              <v-card-title class="headline font-weight-bold"
                >SuperBNB Total Balance
              </v-card-title>
              <v-card-text class="c-card__text text-weight-600"
                >{{ balance }}
              </v-card-text>
              <v-card-text class="c-card__text"
                >{{ balanceUsd }}
                <span class="paragraph">*</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" >
              <v-card
                class="card-gradient"
                dark
                color="#cca701"
                elevation="10"
                :loading="loading"
              >
                <v-card-title class="headline font-weight-bold">
                  BNB Dividends
              </v-card-title>
                <v-card-text class="c-card__text text-weight-600"
                  >{{ earned }}
                </v-card-text>
                <v-card-text class="c-card__text"
                  >${{ earnedUsd }}
                  <span class="paragraph">*</span></v-card-text
                >
              </v-card>
            </v-col>
            <v-col cols="12" md="6" >
              <v-card
                class="card-gradient"
                dark
                color="#cca701"
                elevation="10"
                :loading="loading"
              >
                <v-card-title class="headline font-weight-bold">
                  Last Dividend
              </v-card-title>
                <v-card-text class="c-card__text text-weight-600"
                  >{{ latestReward }}
                </v-card-text>
                <v-card-text v-if="{ earned } !== 0" class="c-card__text text-weight-600">
                  <a 
                  :href ="url"
                  target="_blank"
                  >View Transaction
                  </a>
                </v-card-text>
                
                
              </v-card>
         </v-col>
      </v-row>
        <v-row>
          <v-col>
            <p class="caption text-start">
              **Values shown here are estimated and may differ from PancakeSwap,
              since your price may be impacted by higher fees depending on your
              exchange value.**
            </p>
            <p class="caption text-start">
              For details, see PancakeSwap price impact.
            </p>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="7">
        <h4 class="mb-3 dark">Your Recent Transactions</h4>
        <v-data-table
          dark
          class="elevation-1 mytable"
          @click:row="handleClick"
          :items-per-page="5"
          fixed-header
          :loading="loading"
          :headers="headers"
          :items="txs"
          :item-class="row_classes"
          :footer-props="{
            'items-per-page-options': [5],
          }"
        >
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiInformationOutline } from "@mdi/js";

import {
  getBnbToUsd,
  getTokenBalanceWeb3,
  getTokenTotalSupply,
  getTokenToBnb,
  getRewardTxs,
  getRewardTotal,
  inFlowTxs,
  outFlowTxs,
  getBurnt,
  checkAddress,
} from "@/services/web3";

export default {
  data: () => ({
    infoIcon: mdiInformationOutline,
    headers: [
      {
        text: "Block",
        align: "start",
        sortable: false,
        value: "block",
      },
      { text: "Amount", value: "transferAmount", align: "end" },
      { text: "Currency", value: "currency" },
      { text: "Date", value: "timestamp", align: "end" },
    ],
    balance: 0,
    amount: null,
    amountPAT: 0,
    loading: false,
    balanceUsd: 0,
    wallet: "",
    url: "",
    latestReward: "",
    earned: 0,
    earnedUsd: 0,
    cap: 0,
    current: 0,
    transactionBalance: null,
    txs: [],
    resetTxs: false,
  }),

  mounted() {
    if(localStorage.wallet) {
      this.wallet = localStorage.wallet;
      this.submitForm();
    }
  },
  methods: {
    row_classes(item) {
      return item.type;
    },
    clearCalc() {
      this.amount = null;
      this.amountPAT = 0;
    },
    handleClick(row) {
      window.open("https://bscscan.com/tx/" + row.hash);
    },
    getPrice() {
      if(this.current) {
        this.amountPAT = this.numberWithCommas((this.amount / this.current).toFixed(2));
      } else {
        alert("enter wallet to fetch price first");
      }
      
    },
    submitForm() {
      this.txs = [];
      this.balance = "No Data Available";
      this.balanceUsd = "No Data Available";
      this.earned = "No Data Available";
      this.earnedUsd = "No Data Available";
      this.resetTxs = "true";
      this.loading = true;
      this.fetchData();
      this.fetchTxs();
      localStorage.wallet = this.wallet;
    },
    reloadTxs() {
      this.txs = [];
      this.txsCharity = [];
      this.wallet = "";
      this.balance = "No Data Available";
      this.balanceUsd = "No Data Available";
      this.balanceCharity = "No Data Available";
      this.earned = "No Data Available";
      this.earnedUsd = "No Data Available";
      this.latestReward = "No Data Available";
      this.url="https://bscscan.com";
      localStorage.wallet = '';
    },
    async fetchTxs() {
      if (!this.wallet) {
        localStorage.wallet = "";
        return;
      }
        localStorage.wallet = this.wallet;

        this.loading = true;
        let txs = await inFlowTxs(this.wallet);
       
          let txsData = [];
            txs.data.data.ethereum.transfers.map(async (txItem) => {
              let txRow = {
                  type: "buy",
                  hash: txItem.transaction.hash,
                  transferAmount: this.numberWithCommas(parseFloat(txItem.amount).toFixed(2)),
                  timestamp: txItem.block.timestamp.time,
                  block: txItem.block.height,
                  currency: txItem.currency.symbol,
                }
              txsData.push(txRow);
            });
        let txsOut = await outFlowTxs(this.wallet);
          txsOut.data.data.ethereum.transfers.map(async (txItem) => {
              let txRow = {
                  type: "sell",
                  hash: txItem.transaction.hash,
                  transferAmount: this.numberWithCommas(parseFloat(txItem.amount *-1).toFixed(2)),
                  timestamp: txItem.block.timestamp.time,
                  block: txItem.block.height,
                  currency: txItem.currency.symbol,
                }
              txsData.push(txRow);
            });
            let txsTable = txsData.sort(function (a, b) {
              return new Date(b.timestamp) - new Date(a.timestamp);
            });
            this.txs = txsTable;
    },
    async fetchData() {
      let vm = this;
      if (!this.wallet) {
        localStorage.wallet = "";
        return;
      }

      let valid = await checkAddress(this.wallet);
      if (valid) {
        localStorage.wallet = this.wallet.toLowerCase();
        this.loading = true;
            let balance = await getTokenBalanceWeb3(
              "0x4B8f0bc4e86Ea14b0c22d356Af927bd7A43aC2c6",
              vm.wallet.toLowerCase(),
              18
            );
            let reward = await getRewardTxs(this.wallet.toLowerCase());
            if (reward.data.data.ethereum.transfers.length != 0){
              this.latestReward = (reward.data.data.ethereum.transfers[0].block.timestamp.time);
              let latestTxnHash = (reward.data.data.ethereum.transfers[0].transaction.hash);
              this.url = ("https://bscscan.com/tx/" + latestTxnHash);
            } else {
              this.latestReward = "No data Available";
              this.latestTxnHash ="";
              this.url = ("https://bscscan.com/token/0x6FAacFe4Cd810c3387f9f8F07Dda79571ef4c068?a=" + this.wallet);
            }
            let earned = await getRewardTotal(reward);
            let tokenData = await this.getTokenData(balance, earned);
            let bnbToUsd = await getBnbToUsd();
            this.earnedUsd = this.numberWithCommas(parseFloat(earned * bnbToUsd).toFixed(2));
            this.balanceUsd = tokenData.balanceUsd;
            this.balance = tokenData.balance;
            this.cap = tokenData.cap;
            this.current = tokenData.current;
            this.earned = tokenData.earned;
            this.loading = false;
          } else {
            this.loading = false;
            return;
          }
    },
    
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    async getTokenData(balance, earned) {
      let vm = this;
      let decimals = 18;

      let bnbToUsd = await getBnbToUsd();
      let token = "0x4B8f0bc4e86Ea14b0c22d356Af927bd7A43aC2c6";
      let pair = "0xf2e6f7B7D8CEF0787f243E5a7cd91766667Fefdb";

      let supply = await getTokenTotalSupply(token, decimals);

      let tokenToBnbResp = await getTokenToBnb(pair, balance);

      let tokenToBnb = tokenToBnbResp.price;
      let exchangeVal = tokenToBnbResp.exchangeVal;

      if (tokenToBnb == null) {
        return;
      }

      let tokenToUsd = tokenToBnb * bnbToUsd;

      let balanceUsd = (balance * tokenToUsd).toFixed(2);

      let exchangeValUsdt = exchangeVal * 0.98 * bnbToUsd;

      if (exchangeValUsdt > balanceUsd) {
        exchangeValUsdt = balanceUsd;
      }

      let exchangeValUsdtFormated = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(parseFloat(exchangeValUsdt).toFixed(2));

      let burnt = await getBurnt(token, decimals);
      let circSup = parseFloat(supply) - parseFloat(burnt);
      let cap =
        (parseFloat(supply) - parseFloat(burnt)) *
        parseFloat(tokenToBnb) *
        parseFloat(bnbToUsd);
      

      return {
        decimals: decimals,
        balance: vm.numberWithCommas(balance),
        burnt: burnt,
        circSup: vm.numberWithCommas(circSup),
        earned: vm.numberWithCommas(parseFloat(earned).toFixed(3)),
        earnedNum: earned,
        earnedUsd: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(earned),
        currentBal: balance,
        exchangeValUsdt: exchangeValUsdtFormated,
        balanceUsd: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(balanceUsd),
        balanceUsdNum: balanceUsd,
        current: (tokenToBnb * bnbToUsd * 1).toFixed(10),
        cap: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(cap),
        address: token,
        supply: supply,
      };
    },
  },
};
</script>
