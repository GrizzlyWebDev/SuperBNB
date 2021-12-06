<template>
  <v-container class="my-5">
    <v-row>
      <v-col cols="12" md="6">
          <v-col cols="12">
            <v-card
              class="card-gradient"
              dark
              color="#cca701"
              elevation="10"
              :loading="loading"
            >
              <v-card-title class="headline font-weight-bold"
                >Current Price</v-card-title
              >
              <v-card-text class="c-card__text text-weight-600"
                >${{ current }}
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card
              class="card-gradient"
              dark
              color="#cca701"
              elevation="10"
              :loading="loading"
            >
              <v-card-title class="headline font-weight-bold"
                >Market Cap</v-card-title
              >
              <v-card-text class="c-card__text text-weight-600"
                >{{ cap }}
              </v-card-text>
            </v-card>
          </v-col>
      </v-col>
      <v-col cols="12" md="6">
          <v-col cols="12">
            <v-card
              class="card-gradient"
              dark
              color="#cca701"
              elevation="10"
              :loading="loading"
            >
              <v-card-title class="headline font-weight-bold"
                >Circulating Supply</v-card-title
              >
              <v-card-text class="c-card__text text-weight-600">{{
                circSup
              }}</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" >
            <v-card
              class="card-gradient"
              dark
              color="#cca701"
              elevation="10"
              :loading="loadingLiq"
            >
              <v-card-title class="headline font-weight-bold"
                >LP Balance
                <v-spacer></v-spacer>
                <v-btn
                  color="white"
                  icon
                  href="https://bscscan.com/address/0xf2e6f7B7D8CEF0787f243E5a7cd91766667Fefdb"
                  target="_blank"
                >
                  <v-icon>mdi-wallet-outline</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text class="c-card__text text-weight-600">{{
                balanceLiq
              }}</v-card-text>
            </v-card>
          </v-col>
        </v-col>
        <!-- <v-col cols="12" >
        <v-card
          class="card-gradient"
          dark
          color="#cca701"
          elevation="10"
          :loading="loadingMarket"
        >
          <v-card-title class="headline font-weight-bold"
            >Marketing Wallet Balance
            <v-spacer></v-spacer>
            <v-btn
              color="white"
              icon
              @click="fetchMarketing"
              :disabled="loadingMarket"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn
              color="white"
              icon
              href="https://bscscan.com/address/0x00E10Bd9F25cBDcAFdea47e668b515a118Ce5378"
              target="_blank"
            >
              <v-icon>mdi-wallet-outline</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="c-card__text text-weight-600"
            >{{ balanceMarketing }}
          </v-card-text>
        </v-card>
      </v-col>
      
          <v-col cols="12">
            <v-card
              class="card-gradient"
              dark
              color="#cca701"
              elevation="10"
              :loading="loadingBNB"
            >
              <v-card-title class="headline font-weight-bold"
                >Total BNB Rewarded</v-card-title
              >
              <v-card-text class="c-card__text text-weight-600">
                {{ BNB }} (${{USDTotal}})
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
     
      <v-col cols="12" >
        <v-card
          class="card-gradient"
          dark
          color="#cca701"
          elevation="10"
          :loading="loadingDiv"
        >
          <v-card-title class="headline font-weight-bold"
            >Reward Wallet Balance
            <v-spacer></v-spacer>
            <v-btn color="white" icon @click="fetchDiv" :disabled="loadingDiv">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn
              color="white"
              icon
              href="https://bscscan.com/address/0x6FAacFe4Cd810c3387f9f8F07Dda79571ef4c068"
              target="_blank"
            >
              <v-icon>mdi-wallet-outline</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="c-card__text text-weight-600"
            >{{ balanceDiv }}
          </v-card-text>
        </v-card> -->
        <v-col cols="12">
        <h4 class="my-6">Rewards Transactions</h4>
        <v-data-table
          dark
          class="elevation-1 mytable"
          @click:row="handleClick"
          :items-per-page="6"
          fixed-header
          :loading="loadingDiv"
          :headers="headersIsland"
          :items="divTxsData"
          :item-class="row_classes"
          :footer-props="{
            'items-per-page-options': [6],
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
  getBurnt,
  outFlowTxs,
  convertDecimal,
} from "@/services/web3";

export default {
  data: () => ({
    infoIcon: mdiInformationOutline,
    headersIsland: [
      {
        text: "Block",
        align: "start",
        sortable: false,
        value: "block",
      },
      { text: "Amount", value: "transferAmount", align: "end" },
      { text: "Currency", value: "currency" },
      { text: "To", value: "addr" },
      { text: "Date", value: "timestamp", align: "end" },
    ],
    
    burnt: 0,
    burntPerc: 0,
    balance: 0,
    balanceMarketing: 0,
    balanceDiv: 0,
    balanceLiq: 0,
    BNB: 0,
    buy: false,
    circSup: 0,
    loading: false,
    loadingBNB: false,
    loadingDiv: false,
    loadingMarket: false,
    loadingLiq: false,
    balanceUsd: 0,
    wallet: "0x4B8f0bc4e86Ea14b0c22d356Af927bd7A43aC2c6",
    earned: 0,
    earnedUsd: 0,
    cap: 0,
    current: 0,
    transactionBalance: null,
    txs: [],
    marketingTxsData: [],
    DivTxsData: [],
    USDTotal: 0,
    resetTxs: false,
  }),

  mounted() {
    this.wallet = "0x4B8f0bc4e86Ea14b0c22d356Af927bd7A43aC2c6";
    this.fetchData();
    this.fetchDiv();
    this.fetchLiq();
    
  },
  
  methods: {
    
    row_classes(item) {
      return item.type;
    },
    handleClick(row) {
      window.open("https://bscscan.com/tx/" + row.hash);
    },

    
    

    async fetchData() {
      let vm = this;
      if (!this.wallet) {
        this.wallet = "0x4B8f0bc4e86Ea14b0c22d356Af927bd7A43aC2c6";
      }

      this.loading = true;
      let balance = await getTokenBalanceWeb3(
        "0x4B8f0bc4e86Ea14b0c22d356Af927bd7A43aC2c6",
        vm.wallet,
        18
      );
      let earned = 0;
      if (balance) {
        earned = parseFloat(balance);
      } else {
        earned = 0;
      }
      let tokenData = await this.getTokenData(balance, earned);
      this.balanceUsd = tokenData.balanceUsd;
      this.balance = tokenData.balance;
      this.burnt = vm.numberWithCommas(tokenData.burnt);
      this.burntPerc =
        parseFloat((tokenData.burnt / tokenData.supply) * 100).toFixed(2) + "%";
      this.cap = tokenData.cap;
      this.circSup = tokenData.circSup;
      this.current = tokenData.current;
      this.earned = tokenData.earned;
      this.earnedUsd = tokenData.earnedUsd;
      this.loading = false;
    },

    async fetchDiv() {
      this.loadingDiv = true;
      let divTxsData = [];
      let divOut = await outFlowTxs(
        "0x6FAacFe4Cd810c3387f9f8F07Dda79571ef4c068"
      );
      divOut.data.data.ethereum.transfers.map(async (mtxItem) => {
        let mtxRow = {
          type: "sell",
          hash: mtxItem.transaction.hash,
          transferAmount: parseFloat(mtxItem.amount * -1).toFixed(6),
          timestamp: mtxItem.block.timestamp.time,
          block: mtxItem.block.height,
          currency: mtxItem.currency.symbol,
          addr: mtxItem.address.address,
        };
        divTxsData.push(mtxRow);
      });
      let divTable = divTxsData.sort(function (a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      this.divTxsData = divTable;
      this.loadingDiv = false;
    },
    async fetchLiq() {
      this.loadingLiq = true;
        
        let BNBBal = await this.axios({
          method: "get",
          url: "https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0xe9e7cea3dedca5984780bafc599bd69add087d56&address=0xf2e6f7B7D8CEF0787f243E5a7cd91766667Fefdb&apikey=ZVGVYZ9BHGS3H9CA1MRGMH7R3Z95CNRHRM",
          crossDomain: true,
        });
        BNBBal = await convertDecimal(BNBBal.data.result, 18).toFixed(2);
        let balance = await getTokenBalanceWeb3(
          "0x4B8f0bc4e86Ea14b0c22d356Af927bd7A43aC2c6",
          "0xf2e6f7B7D8CEF0787f243E5a7cd91766667Fefdb",
          18
        );
        let earned = parseFloat(balance);
        let tokenData = await this.getTokenData(balance, earned);
        let SuperBNBToUsd = tokenData.balanceUsdNum;
        let bnbToUsd = await getBnbToUsd();
        let LiqBalance = await this.axios({
          method: "get",
          url: "https://api.bscscan.com/api?module=account&action=balance&address=0xf2e6f7B7D8CEF0787f243E5a7cd91766667Fefdb&tag=latest&apikey=H1FRA29QZXTVNEZV1QZTDNYJJP6E3ZUS2V",
        });
        LiqBalance = await convertDecimal(LiqBalance.data.result, 18).toFixed(
          2
        );
        let totalUsd = +BNBBal + LiqBalance * bnbToUsd;
        this.balanceLiq = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(parseFloat(+SuperBNBToUsd + totalUsd).toFixed(2));
        this.loadingLiq = false;
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
      let earnedUsd = 0;
      if (earned) {
        earnedUsd = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format((earned * tokenToUsd).toFixed(2));
      }

      return {
        decimals: decimals,
        balance: vm.numberWithCommas(balance),
        burnt: burnt,
        circSup: vm.numberWithCommas(circSup),
        earned: vm.numberWithCommas(parseFloat(earned).toFixed(3)),
        earnedNum: earned,
        earnedUsd: earnedUsd,
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
