<template>
  <div>
    <h2 class="center-content">You need to connect wallet to continue</h2>
    <div class="center-content">
      <p>
        Please switch to
        <a
          href="https://docs.binance.org/smart-chain/wallet/metamask.html"
          target="_blank"
          >BSC network</a
        >
        to buy. <br />
      </p>
    </div>
    <div class="center-content">
      <button
        target="_blank"
        @click="$emit('connect-wallet')"
        class="connect-button"
      >
        Connect Wallet
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "WalletNotConnect",
};
</script>

<style scoped>
/* CSS */
.connect-button {
  align-items: center;
  background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
  border: 0;
  border-radius: 8px;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  box-sizing: border-box;
  color: #ffffff;
  display: flex;
  font-family: Phantomsans, sans-serif;
  font-size: 20px;
  justify-content: center;
  line-height: 1em;
  max-width: 100%;
  min-width: 140px;
  padding: 19px 24px;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  cursor: pointer;
}

.connect-button:active,
.connect-button:hover {
  outline: 0;
}

.airdrop h2 {
  font-size: 20px;
}

.airdrop .center-content {
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
}
@media (min-width: 768px) {
  .connect-button {
    font-size: 24px;
    min-width: 196px;
  }
}
</style>
