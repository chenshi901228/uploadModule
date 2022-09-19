<!-- 物流信息/电子面单 -->

<template>
    <el-dialog 
        top="20px"
        :title="type == 1 ? '物流信息' : '电子面单'" 
        :visible.sync="show" 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="close"
        width="70%">
        <div style="text-align: center">
            <!-- 物流信息 -->
            <div class="logisticsProgress" v-if="type == 1" style="padding: 0 50px">
                <span v-if="!logisticsProgress.length">暂无物流信息</span>
                <el-steps v-else direction="vertical" :active="1">
                    <el-step 
                        :space="100"
                        :icon="setStepIcon(item.AcceptStation)"
                        :title="item.AcceptTime" 
                        :description="item.AcceptStation"
                        v-for="(item, index) in logisticsProgress" 
                        :key="index"></el-step>
                </el-steps>
            </div>
            <!-- 电子面单 -->
            <p style="display: inline-block;min-height:500px" v-if="type == 2 && template" v-html="template"></p>
            <p v-if="type == 2 && !template">暂无信息</p>

        </div>

        <template slot="footer">
            <el-button size="small" type="primary" @click="show = false">{{ $t('confirm') }}</el-button>
        </template>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            info: {},
            show: false,
            template: "", //电子面单模板
            logisticsProgress: [], //物流信息
            type: 1, // 1-物流信息，2-电子面单
        }
    },
    methods: {
        init(data, type) {
            this.info = data
            this.type = type
            this.show = true
            if(type == 1) {
                this.getInfo()
            }else {
                this.template = data.printTemplate
            }
        },
        // 获取物流信息
        getInfo() {
            this.$http.get(`/sys/weixinuserproductlogistics/queryLogisticsProgress/${this.info.id}`).then(({data: res}) => {
                if(res.code != 0) return this.$message.error(res.msg)

                let obj = JSON.parse(res.data || "")
                this.logisticsProgress = obj.Traces || []

            }).catch(err => {
                this.logisticsProgress = [] 
                this.$message.error(JSON.stringify(err))
            })
        },
        // 设置物流信息icon
        setStepIcon(str) {
            return "el-icon-circle-check"
        },
        close() {
            this.info = {}
            this.type = 1
            this.template = ""
            this.logisticsProgress = []
        }
    }
}
</script>