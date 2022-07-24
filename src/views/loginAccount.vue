<template>
  <div class="login">
    <div class="section-1">
      <img src="/img/logos/netease-music.png" alt="" />
    </div>
    <div class="title">{{ $t("login.loginText") }}</div>
    <div class="section-2">
      <div v-show="mode === 'qrCode'">
        <div v-show="qrCodeSvg" class="qr-code-container">
          <img :src="qrCodeSvg" loading="lazy" alt="" />
        </div>
        <div class="qr-code-info">
          {{ qrCodeInformation }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      mode: "qrCode",
      qrCodeSvg: "",
      qrCodeInformation: "打开网易云音乐APP扫码登录",
    };
  },
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.section-1 {
  margin-bottom: 16px;
  display: flex;
  align-content: center;
  img {
    height: 64px;
    margin: 20px;
  }
  .svg-icon {
    height: 24px;
    width: 24px;
    color: rgba(82, 82, 82, 0.28);
  }
}

.section-2 {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 48px;
  color: var(--color-text);
}

.qr-code-container {
  background-color: var(--color-primary-bg);
  padding: 24px 24px 21px 24px;
  border-radius: 1.25rem;
  margin-bottom: 12px;
}

.qr-code-info {
  color: var(--color-text);
  text-align: center;
  margin-bottom: 28px;
}
</style>
