<script setup>
import { onMounted } from 'vue';
var text = '这是一段需要自动换行的文本，它会根据Canvas的宽度自动调整换行。这是一段需要自动换行的文本，它会根据Canvas的宽度自动调整换行。';
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split('');
  console.log('words: ', words);
  var line = '';

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n];
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth) {
      context.fillText(line, x, y);
      y += lineHeight;
      line = words[n];
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}
onMounted(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio;
  canvas.width = 500 * dpr;
  canvas.height = 500 * dpr;
  canvas.style.width = '500px';
  canvas.style.height = '500px'

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 500 * dpr, 500 * dpr);
  // 画一个文字
  ctx.font = `${16 * dpr}px Arial`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'white';
  var maxWidth = canvas.width - 16 * dpr;
  var lineHeight = 16 * dpr * 1.5; // 行高
  wrapText(ctx, text, 0, 0, maxWidth, lineHeight);

  setTimeout(() => {
    // const textWidth = ctx.measureText(text).width;
    // console.log('textWidth: ', textWidth / dpr);
  }, 100);
})
</script>

<template>
  <div>
    <div style="width: 500px;background-color: #000;color: #fff;text-align: left;">
      <!-- <span> -->
      {{ text }}
      <!-- </span> -->
    </div>
    <canvas id="canvas" width="500" height="500"></canvas>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
