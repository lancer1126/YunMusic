<template>
  <div class="login">
    <div class="section-1">
      <img src="/img/logos/netease-music.png" alt="" />
    </div>
    <div class="title">{{ $t("login.loginText") }}</div>
    <div class="section-2">
      <div v-show="mode === 'qrCode'">
        暂时关闭
        <!--        <div v-show="qrCodeSvg" class="qr-code-container">-->
        <!--          <img :src="qrCodeSvg" loading="lazy" alt="" />-->
        <!--        </div>-->
        <!--        <div class="qr-code-info">-->
        <!--          {{ qrCodeInfo }}-->
        <!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import NProgress from "nprogress";
import { mapMutations } from "vuex";
import { loginQrCodeKey, loginQrCodeCheck } from "@/api/auth";
import { setCookies } from "@/utils/auth";

export default {
  name: "Login",
  data() {
    return {
      mode: "qrCode",
      qrCodeSvg: "",
      qrCodeKey: "",
      processing: false,
      qrCodeCheckInterval: null,
      qrCodeInfo: "打开网易云音乐APP扫码登录",
    };
  },
  created() {
    this.getQrCodeKey();
  },
  beforeDestroy() {
    clearInterval(this.qrCodeCheckInterval);
  },
  methods: {
    ...mapMutations(["updateData"]),
    getQrCodeKey() {
      const qrCodeConfig = {
        width: 192,
        margin: 0,
        color: {
          dark: "#335eea",
          light: "#00000000",
        },
        type: "svg",
      };
      return loginQrCodeKey().then((resp) => {
        if (resp.code === 200) {
          this.qrCodeKey = resp.data.unikey;
          QRCode.toString(`https://music.163.com/login?codekey=${this.qrCodeKey}`, qrCodeConfig)
            .then((svg) => {
              this.qrCodeSvg = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              NProgress.done();
            });
        }
        this.checkQrCodeLogin();
      });
    },
    checkQrCodeLogin() {
      this.qrCodeCheckInterval = setInterval(() => {
        if (this.qrCodeKey === "") return;
        loginQrCodeCheck(this.qrCodeKey).then((resp) => {
          switch (resp.code) {
            case 800:
              this.getQrCodeKey();
              this.qrCodeInfo = "二维码已失效，请重新扫码";
              break;
            case 801:
              this.qrCodeInfo = "打开网易云音乐App扫码登录";
              break;
            case 802:
              this.qrCodeInfo = "扫描成功，请在手机上确认";
              break;
            case 803:
              this.qrCodeInfo = "登录成功，请稍等...";
              resp.code = 200;
              resp.cookie = resp.cookie.replace("HTTPOnly", "");
              clearInterval(this.qrCodeCheckInterval);
              this.handleLoginResponse(resp);
          }
        });
      }, 1000);
    },
    handleLoginResponse(resp) {
      if (!resp) {
        this.processing = false;
        return;
      }
      if (resp.code === 200) {
        setCookies(resp.cookie);
        this.updateData({ key: "loginMode", value: "account" });
        this.$router.push({ path: "/library" });
      } else {
        this.processing = false;
      }
    },
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
