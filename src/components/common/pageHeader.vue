<!--页头-->

<template>
    <div class="custom-pageHeader">
        <el-button size="small" type="text" icon="el-icon-back" @click="back">{{ navTitle }}</el-button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            navTitle: ""
        }
    },
    mounted(){
        this.navTitle = this.$router.history.current.meta.title || ""
    },
    methods: {
        back() {
            this.$router.back()
        }
    }
}
</script>
<style lang="scss" scoped>
    .custom-pageHeader{
        background-color: #fff;
        padding-left: 20px;
        line-height: 38px;
    }
</style>