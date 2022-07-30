<!-- 物流信息/电子面单 -->

<template>
    <el-dialog 
        top="20px"
        :title="title" 
        :visible.sync="show" 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="close"
        width="70%">

        <template slot="footer">
            <el-button size="small" type="primary" @click="show = false">{{ $t('confirm') }}</el-button>
        </template>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            title: "",
            info: {},
            show: false,
        }
    },
    methods: {
        init(data) {
            this.info = data
            this.show = true

            this.getInfo()
        },
        getInfo() {

            let url = "/sys/weixinuserproductlogistics/"

            this.$http.get(`/sys/weixinuserproductlogistics/queryLogisticsProgress/${this.info.id}`).then(({data: res}) => {
                if(res.code != 0) return this.$message.error(res.msg)




            }).catch(err => this.$message.error(JSON.stringify(err)))
        },
        close() {
            this.info = {}
        }
    }
}
</script>