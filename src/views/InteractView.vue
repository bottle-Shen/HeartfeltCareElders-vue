<script setup lang="ts">
onMounted(() => {
    const script = document.createElement("script");
    script.src = "https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.3/libs/cn/index.js";
    script.onload = () => {
        console.log("Script loaded successfully");
        cozeWebSDK()
    };
    script.onerror = () => {
        console.error("Failed to load script");
    };
    document.body.appendChild(script);
});

const cozeWebSDK = () => {
    new CozeWebSDK.WebChatClient({
    config: {
      bot_id: '7475470927577481225',
    },
    componentProps: {
      title: 'Coze',
    },
    auth: {
      type: 'token',
      token: 'pat_ipF9mac9DdsKhgusNYGUpbcfpU8Sr4Fbbv1Ybbd2VaDAw9h20TfHJGC3Q3tqLKy3',
      onRefreshToken: function () {
        return 'pat_ipF9mac9DdsKhgusNYGUpbcfpU8Sr4Fbbv1Ybbd2VaDAw9h20TfHJGC3Q3tqLKy3'
      }
    }
  });
}


</script>
<template>
    <div class="interact-page">
        社交互动区
    </div>
</template>

<style scoped lang="scss">

</style>