<script setup lang="ts">
import { onMounted, ref } from "vue";

const isMobile =
  /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
    navigator.userAgent
  );
const cvs = ref<HTMLCanvasElement>();
const cvsBox = ref<HTMLDivElement>();
let isDrawing = false;

onMounted(() => {
  if (!cvs.value || !cvsBox.value) return;
  cvs.value.width = cvsBox.value.clientWidth;
  isMobile ? (cvs.value.height = 300) : (cvs.value.height = 400);
  const ctx = cvs.value.getContext("2d");
  if (!ctx) return;
  // ctx.fillStyle = "gray";
  // ctx.fillRect(0, 0, cvs.value.width, cvs.value.height);

  if (isMobile) {
    const top = cvs.value.getBoundingClientRect().top;
    const left = cvs.value.getBoundingClientRect().left;
    cvs.value.addEventListener("touchstart", (e) => {
      e.preventDefault(); // 阻止浏览器默认事件，防止手写的时候拖动屏幕，重要
      const x = e.changedTouches[0].pageX - left;
      const y = e.changedTouches[0].pageY - top;
      isDrawing = true;
      ctx.beginPath();
      ctx.moveTo(Math.round(x), Math.round(y));
    });
    cvs.value.addEventListener("touchmove", (e) => {
      e.preventDefault(); // 阻止浏览器默认事件，防止手写的时候拖动屏幕，重要
      const x = e.changedTouches[0].pageX - left;
      const y = e.changedTouches[0].pageY - top;
      if (isDrawing) {
        ctx.lineTo(Math.round(x), Math.round(y));
        ctx.stroke();
      }
    });
    cvs.value.addEventListener("touchend", (e) => {
      e.preventDefault(); // 阻止浏览器默认事件，防止手写的时候拖动屏幕，重要
      isDrawing = false;
      ctx.closePath();
    });
  } else {
    cvs.value.addEventListener("mousedown", (e) => {
      isDrawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    });
    cvs.value.addEventListener("mousemove", (e) => {
      if (isDrawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
      }
    });
    cvs.value.addEventListener("mouseup", () => {
      isDrawing = false;
      ctx.closePath();
    });
  }
});

function reset() {
  if (!cvs.value) return;
  const ctx = cvs.value.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, cvs.value.width, cvs.value.height);
  // ctx.fillRect(0, 0, cvs.value.width, cvs.value.height);
}

const imgUrl = ref<string>();
function preserve() {
  if (!cvs.value) return;
  const dataURL = cvs.value.toDataURL();
  imgUrl.value = dataURL;
  reset();
}
</script>

<template>
  <div ref="cvsBox" style="border: 2px solid gray">
    <canvas ref="cvs"></canvas>
  </div>
  <div style="margin: 20px 0">
    <button @click="reset()">清除</button>
    <button @click="preserve()">生成图片</button>
  </div>
  <div v-if="imgUrl">
    <img
      style="width: 50%; border: 1px solid #ccc"
      :src="imgUrl"
      alt="图片加载失败"
    />
  </div>
</template>

<style scoped></style>
