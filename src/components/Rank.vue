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
          placeholder="0x123..."
          label="Wallet address"
          outlined
        ></v-text-field>
        <div>
          <v-btn
            :disabled="!wallet || loading"
            type="submit"
            @click="submitForm"
          >
            Find Rank
          </v-btn>
          <v-btn
            class="ml-3"
            type="submit"
            @click="clearWallet"
            :disabled="!wallet || loading"
          >
            Clear Data
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h4 class="mb-3 dark" v-if="!loading">Your SuperBNB Rank</h4>
        <div class="text-center" v-if="loading">
          <h4 class="my-3">Loading Rankings please wait...</h4>
        <v-progress-circular
      indeterminate
      color="amber"
    ></v-progress-circular>
      </div>
        <v-data-table
        v-if="!loading"
          dark
          class="elevation-1 mytable"
          :items-per-page="1"
          fixed-header
          :loading="loadingIsland"
          no-data-text="Enter Your Address Above..."
          loading-text="Scouring The Universe..."
          :headers="headers"
          :items="ranking"
          :item-class="row_classes"
          :footer-props="{
            'items-per-page-options': [1],
          }"
        >
        </v-data-table>
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script>
// import moment from "moment";
import { getAllTokenTxs } from "@/services/web3";

// import { getTokenBalanceWeb3 } from "../services/web3";
export default {
  data: () => ({
    headers: [
      {
        text: "Ranking",
        align: "start",
        value: "ranking",
      },
      {
        text: "Address",
        align: "start",
        sortable: false,
        value: "address",
      },
      { text: "Quantity", value: "balance", align: "end" },
      { text: "Percent of Supply", value: "percent", align: "end" },
    ],
    sorted: [],
    wallet: "",
    loading: false,
    loadingIsland: false,
    ranking: [],
  }),

  mounted() {
    this.loading = true;
    this.fetchIsland();
    if(localStorage.wallet) {
      this.wallet = localStorage.wallet.toLowerCase();
    }
  },
  methods: {
    row_classes(item) {
      return item.type;
    },
    async submitForm() {
      this.loadingIsland = true;
      this.ranking = [];
      let wallet = this.wallet.toLowerCase();
      localStorage.wallet = wallet.toLowerCase();
      this.loading = false;
      for (let i=0; i<this.sorted.length; i++){
          if (this.sorted[i].address === wallet) {
            this.ranking.push(this.sorted[i])
            this.loadingIsland = false;
            return;
          }
      }
      this.loadingIsland = false;
      return {
        ranking: this.ranking,
      }
    },
    clearWallet() {
      this.wallet = "";
      localStorage.wallet = ""
      this.ranking = [];
    },
    async fetchIsland() {
      let SuperBNBOut = await getAllTokenTxs();
      let addresses = [];
      SuperBNBOut.data.data.ethereum.transfers.map(async (txItem) => {
        let selltxRow = {
          address: txItem.sender.address,
          transferAmount: txItem.amount * -1,
        };

        addresses.push(selltxRow);

        let buytxRow = {
          address: txItem.receiver.address,
          transferAmount: txItem.amount,
        };

        addresses.push(buytxRow);
      });
      
      addresses = addresses.reduce((acc, item) => {
        const key = item.address;
        acc[key] = acc[key] || 0;
        acc[key] += item.transferAmount;
        return acc;
      }, Object.create(null));

      let mergedItems = [];

      Object.keys(addresses).forEach((key) => {
        mergedItems.push({
          address: key,
          balance: addresses[key],
        });
      });
      mergedItems.sort((a, b) => {
        return a.balance - b.balance;
      }).reverse();
      let rank = 1;
      const sorted = [];
     Object.keys(mergedItems).forEach((key) => {
       if(mergedItems[key].balance > 0){
        sorted.push({
          ranking: rank++,
          address: mergedItems[key].address,
          balance: (mergedItems[key].balance).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          percent: ((mergedItems[key].balance / 100000000000) * 100).toFixed(4) + "%",
        });
       }
      });
      this.sorted = sorted;
      if(localStorage.wallet) {
        this.submitForm();
      }
      this.loading = false;
    }
  },
};
</script>