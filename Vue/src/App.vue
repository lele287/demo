<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  hello();
});

function hello() {
  const ascii = `
--   __       ______   __       ______
--  /_/\\     /_____/\\ /_/\\     /_____/\\
--  \\:\\ \\    \\::::_\\/_\\:\\ \\    \\::::_\\/_
--   \\:\\ \\    \\:\\/___/\\\\:\\ \\    \\:\\/___/\\
--    \\:\\ \\____\\::___\\/_\\:\\ \\____\\::___\\/_
--     \\:\\/___/\\\\:\\____/\\\\:\\/___/\\\\:\\____/\\
--      \\_____\\/ \\_____\\/ \\_____\\/ \\_____\\/
--
`;
  console.log(`%c${ascii}`, "color:#00a1d6");
}
</script>

<template>
  <router-view />
</template>

<style scoped></style>
