<template>
  <!-- Breadcrumb Area Start -->
  <section class="breadcrumb-area help airdrop">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="container subscribe-box">
            <div
              class="signin-inner section-inner"
              :class="[
                topDivider && 'has-top-divider',
                bottomDivider && 'has-bottom-divider',
              ]"
            >
              <c-section-header
                tag="h1"
                :data="sectionHeader"
                class="center-content"
              />
              <div style="text-align: center">
                <b
                  >To get xBlade, please retweet this
                  <a
                    href="https://twitter.com/xbladecryptowar/status/1478642963257622528"
                    target="_blank"
                    >tweet</a
                  >
                  & follow
                  <a href="https://twitter.com/xbladecryptowar" target="_blank"
                    >xBlade Twitter</a
                  >
                  <br />
                  <!-- <a
                    href="https://twitter.com/elasticbitcoin/status/1366605459763826692"
                    target="_blank"
                    >Video tutorial to get xBlade</a
                  > -->
                </b>
              </div>

              <!-- <div v-if="!isSaleOver"> -->
              <div>
                <div v-if="userAccount">
                  <p class="center-content mt-0 mb-32">
                    Connected as
                    <a
                      target="_blank"
                      :href="`https://bscscan.com/address/${userAccount}`"
                      >{{ truncatedAddress }}</a
                    >
                  </p>
                  <div>
                    <sale-input-airdrop
                      @on-purchase="exchangeToken"
                      :sale-supply="saleSupply"
                      :participant-wait-time="participantWaitTime"
                      :sale-rate="saleRate"
                      :min-bid-amount="minBidAmount"
                      :max-bid-amount="maxBidAmount"
                      :user-account="userAccount"
                      :xbn-amounts="xbladeAmounts"
                    />
                  </div>
                </div>

                <div class="not-connect" v-else>
                  <wallet-not-connect @connect-wallet="connectWallet" />
                </div>
              </div>
            </div>
          </div>
          <!-- <sweet-modal id="modal" ref="success">
            <swal-html>
              <h1>Transaction submitted</h1>
              Thank you

              <div class="mt-32">
                <vue-goodshare-facebook
                  :quote="pageTitle"
                  :page_title="pageTitle"
                  :page_url="pageUrl"
                  has_icon
                  has_counter
                  title_social="Facebook"
                />
                <vue-goodshare-twitter
                  :page_title="pageTitle"
                  :page_url="pageUrl"
                  has_icon
                  title_social="Twitter"
                />
              </div>
            </swal-html>
          </sweet-modal> -->
        </div>
      </div>
    </div>
  </section>
  <!-- Breadcrumb Area End -->
  <section
    class="signin section illustration-section-01"
    :class="[hasBgColor && 'has-bg-color', invertColor && 'invert-color']"
  ></section>
  <!-- Help Section Start -->
  <transition name="modal">
    <modal v-if="showModal" @close="closeModal()">
      <template v-slot:header>Transaction submitted</template>
      <template v-slot:body>
        <div class="success">Thank you</div>
        <div class="mt-32">
          <vue-goodshare-facebook
            :quote="pageTitle"
            :page_title="pageTitle"
            :page_url="pageUrl"
            has_icon
            has_counter
            title_social="Facebook"
          />
          <vue-goodshare-twitter
            :page_title="pageTitle"
            :page_url="pageUrl"
            has_icon
            title_social="Twitter"
          />
        </div>
      </template>
    </modal>
  </transition>
</template>
<script>
import _ from "lodash";
import CSectionHeader from "@/components/SectionHeader.vue";
import VueGoodshareFacebook from "vue-goodshare/src/providers/Facebook.vue";
import VueGoodshareTwitter from "vue-goodshare/src/providers/Twitter.vue";
import SaleInputAirdrop from "@/components/SaleInputAirdrop";
import WalletNotConnect from "@/components/WalletNotConnect";
import { getWeb3Client } from "@/libs/web3";
import { claimAirdrop, getReturnAmount } from "@/libs/xdrop";
import { SectionProps } from "@/utils/SectionProps.js";
import emitter from "tiny-emitter/instance";
import { ref, onMounted } from "vue";
import modal from "@/components/elements/Modal.vue";
// import Swal from "sweetalert2";

export default {
  name: "AirDrop",
  components: {
    WalletNotConnect,
    CSectionHeader,
    VueGoodshareFacebook,
    VueGoodshareTwitter,
    SaleInputAirdrop,
    modal,
  },
  setup() {
    const success = ref(null);

    onMounted(() => {
      // the DOM element will be assigned to the ref after initial render
      console.log(success.value); // <div>This is a root element</div>
      // success.modal.open();
    });

    return {
      success,
    };
  },
  created() {
    // this.$emit('update:layout', CLayout);
    emitter.emit("updateWalletClient", () => {
      this.connectWallet();
    });

    // this.$refs.success.open();
    // this.$root.$emit("updateWalletClient", () => {
    //   this.connectWallet();
    // });
  },
  data() {
    return {
      sectionHeader: {
        title: "xBlade Airdrop",
        paragraph:
          "Fair $xBlade for everyone on a first-come-first-serve basis",
      },
      // contractFundBalance: 0,
      xbtBalance: 0,
      waitingTime: 0,
      userAccount: null,
      walletClient: {},
      showModal: false,
      xbladeAmounts: [20,50,100],
    };
  },
  mixins: [SectionProps],
  computed: {
    // isSaleOver() {
    //   const minAvailableSale = this.saleSupply / this.saleRate;
    //   return minAvailableSale < this.minBidAmount;
    // },
    pageTitle() {
      return "Get $xBlade Airdrop";
    },
    pageUrl() {
      return "https://cryptowar.network/airdrop";
    },
    truncatedAddress() {
      return _.truncate(this.userAccount || "", {
        length: 10,
      });
    },
    // totalPurchasedXBN() {
    //   return this.xbtBalance;
    // }
  },

  async mounted() {
    this.handlePageOnLoad();
  },

  methods: {
    async connectWallet() {
      await this.handleGetClient();
      await this.handleGetInitialData();
    },
    closeModal() {
      this.showModal = false;
    },
    async handleGetClient() {
      const walletClient = await getWeb3Client();
      this.walletClient = walletClient;
      // this.$set(this, "walletClient", walletClient);
    },

    async handleGetInitialData() {
      const accounts = await this.walletClient.web3Client.eth.getAccounts();
      this.userAccount = accounts.length > 0 ? accounts[0] : null;
      // this.$set(this, "userAccount", accounts.length > 0 ? accounts[0] : null);
      await this.fetchStatus();
      // this.subscribeOrderBook();
    },

    async handlePageOnLoad() {
      if (this.walletClient.web3Client) {
        await this.handleGetInitialData();
      }
    },
    async getSaleInfo() {
      const walletClient = this.walletClient;

      const XBNAmount1 = await getReturnAmount(
        walletClient.web3Client,
        "0x27a339d9b59b21390d7209b78a839868e319301b",
        0.002
      );
      // console.log(`XBN1 ${XBNAmount1}`)
      const XBNAmount2 = await getReturnAmount(
        walletClient.web3Client,
        "0x27a339d9b59b21390d7209b78a839868e319301b",
        0.007
      );
      const XBNAmount3 = await getReturnAmount(
        walletClient.web3Client,
        "0x27a339d9b59b21390d7209b78a839868e319301b",
        0.011
      );

      // console.info(XBNAmount1,XBNAmount2,XBNAmount3);
      this.xbladeAmounts[0]= XBNAmount1;
      this.xbladeAmounts[1]= XBNAmount2;
      this.xbladeAmounts[2]= XBNAmount3;
      console.log(`xbladeAmounts ${this.xbladeAmounts}`);
    },

    async fetchStatus() {
      // const walletClient = this.walletClient;

      this.getSaleInfo();
      // const v = this;
      // // this.getOrderBook();
      // setInterval(function() {
      //   v.fetchStatus();
      // }, 5000);

      // // Get balance
      // const xbtBalance = await getXBNBalance(walletClient.web3Client);
      // this.$set(this, 'xbtBalance', xbtBalance);
    },

    async exchangeToken(address, amount) {
      const walletClient = this.walletClient;
      let reseller = this.$route.query.r;
      if (reseller === "" || reseller === undefined) {
        reseller = "0x0000000000000000000000000000000000000000";
      }

      if (amount === 0) {
        amount = (Math.floor(Math.random() * Math.floor(12)) + 3) / 1000;
      }
      // console.log(`reseller ${reseller}`)

      await claimAirdrop(walletClient.web3Client, address, amount, reseller);
      this.showModal = true;
      await this.fetchStatus();
    },
  },
};
</script>
<style scoped>
.center-content {
  text-align: center;
}

.airdrop h2 {
  font-size: 20px;
}

.breadcrumb-area.airdrop {
  padding-top: 100px;
}
.hide-modal {
  display: none;
}
.success {
  margin-bottom: 20px;
  color: #00a2ff;
  font-size: 28px;
}
.subscribe-box{
  margin-bottom: 80px;
}

@media (max-width: 768px) {
  .subscribe-box {
    padding-left: 20px;
    padding-right: 20px;
  }
  .not-connect{
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .subscribe-box{
  margin-bottom: 100px;
}
}
</style>