
<!-- 视频详情 -->

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div>111</div>
    <div>111</div>
    <div>111</div>
    <div>
      <el-image :src="src"></el-image>
    </div>
    <div>
      <el-image :src="src"></el-image>
    </div>
  </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
export default {
  mixins: [mixinTableModule],
  components: {},
  data() {
    return {
      src: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
    };
  },
  created() {},
  activated() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
</style>