<template>
    <div class="detalilBox">
        <div>
            <div class="detalilBox-title">直播数据</div>
            <el-descriptions title="" :column="2" style="margin-left:40px">
                <el-descriptions-item label="直播主题">{{liveInfo.liveTheme}}</el-descriptions-item>
                <el-descriptions-item label="开播时间">{{liveInfo.startDate}}</el-descriptions-item>
                <el-descriptions-item label="下播时间">{{liveInfo.endDate}}</el-descriptions-item>
                <el-descriptions-item label="直播时长">{{liveInfo.liveTime || 0}}分钟</el-descriptions-item>
                <el-descriptions-item label="观看人数">{{liveInfo.audienceNum || 0}}</el-descriptions-item>
                <el-descriptions-item label="最高在线人数">{{liveInfo.maxOnlineNum || 0}}</el-descriptions-item>
                <el-descriptions-item label="累计点赞">{{liveInfo.giveLikeNum || 0}}</el-descriptions-item>
                <el-descriptions-item label="累计分享">{{liveInfo.shareNum ||0}}次</el-descriptions-item>
                <el-descriptions-item label="礼物收益">￥{{liveInfo.getReward&&liveInfo.getReward.toFixed(2) || 0}}</el-descriptions-item>
                <el-descriptions-item label="粉丝团收益">￥{{liveInfo.unionIncome&&liveInfo.unionIncome.toFixed(2) || 0}}</el-descriptions-item>
                <el-descriptions-item label="带货销售">￥{{liveInfo.commerceSale&&liveInfo.commerceSale.toFixed(2) || 0}}</el-descriptions-item>
            </el-descriptions>
        </div>
        <div>
            <div class="detalilBox-title">主播数据</div>
            <el-descriptions title="" :column="2" style="margin-left:40px">
                <el-descriptions-item label="新增用户">{{liveInfo.addUserNum || 0}}人</el-descriptions-item>
                <el-descriptions-item label="增加粉丝">{{liveInfo.addFansNum || 0}}人</el-descriptions-item>
                <el-descriptions-item label="礼物收入">￥{{liveInfo.rewardMoney&&liveInfo.rewardMoney.toFixed(2) || 0}}</el-descriptions-item>
                <el-descriptions-item label="带货收入">￥{{liveInfo.commerceIncome&&liveInfo.commerceIncome.toFixed(2) || 0}}</el-descriptions-item>
                <el-descriptions-item label="粉丝团收入">￥{{liveInfo.unionProfit&&liveInfo.unionProfit.toFixed(2) || 0}}</el-descriptions-item>
                <el-descriptions-item label="带货数量">{{liveInfo.commerceSaleNum || 0}}</el-descriptions-item>
                <el-descriptions-item label="直播预约人数">{{liveInfo.appointmentNum || 0}}</el-descriptions-item>
            </el-descriptions>
        </div>

        <div>
            <div class="detalilBox-title">带货详情</div>
            <el-table  @filter-change="filterChange" max-height="500" v-loading="dataListLoading" :data="dataList" style="width: 100%" ref="filterTable">
                <el-table-column type="selection" header-align="center" align="center" fixed="left"></el-table-column>
                <el-table-column prop="userName" align="center" label="购买人" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productType" align="center" label="商品类型" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productName" align="center" label="购买内容" show-overflow-tooltip></el-table-column>
                <el-table-column prop="price" align="center" label="应付金额" show-overflow-tooltip></el-table-column>
                <el-table-column prop="payPrice" align="center" label="实付金额" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.payStatus && scope.row.payStatus == 2">-</span>
                        <span v-else>{{scope.row.payPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="realPrice" align="center" label="实收金额" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.payStatus && scope.row.payStatus == 2">-</span>
                        <span v-else>{{scope.row.realPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    
                    align="center" 
                    label="支付状态" 
                    column-key="payStatus"
                    show-overflow-tooltip
                    :filter-multiple='false'
                    :filters="[{text: '待支付', value: '1'},{text: '已支付', value: '2'},{text: '已完成', value: '3'},{text: '退款中', value: '4'},{text: '已退款', value: '5'},]"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.payStatus == 2">待支付</span>
                        <span v-if="scope.row.payStatus == 1 && scope.row.useStatus==0 && scope.row.activeStatus==0 && (scope.row.refundStatus==0 || scope.row.refundStatus==-1)">已支付</span>
                        <span v-if="scope.row.payStatus == 1 && (scope.row.useStatus!=0 || scope.row.activeStatus!=0) && (scope.row.refundStatus==0 || scope.row.refundStatus==-1)">已完成</span>
                        <span v-if="scope.row.payStatus == 1 && scope.row.refundStatus==2">退款中</span>
                        <span v-if="scope.row.payStatus == 1 && scope.row.refundStatus==1">已退款</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column v-else prop="payStatus" align="center" label="支付状态" show-overflow-tooltip></el-table-column> -->
                <el-table-column prop="payDate" align="center" label="支付完成时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createDate" align="center" label="下单时间" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-pagination
                background
                :current-page="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="pageSizeChangeHandle"
                @current-change="pageCurrentChangeHandle"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            diaForm:{},
            liveInfo:{},//直播详情
            dataListLoading:false,
            dataList:[],//带货商品列表

            page:1,//商品页
            limit:10,//当前条
            total:0,//当前总数
            
            type:'',//支付状态
            list:[],//带货商品列表
        }
    },
    activated () {
        this.type=''
        this.list=[]
        this.diaForm = JSON.parse(window.localStorage.getItem("recordInfoDetailData"))
        this.getRecordInfo(this.diaForm.id)
        this.getRecordList(this.diaForm.id)
    },
    methods:{
        getRecordInfo(id){
            this.$http.get(`/sys/liveList/getLiveDetails?id=${id}`).then(({ data: res }) => {
                if (res.code !== 0) return this.$message.error(res.msg);
                this.liveInfo=res.data
            }).catch((err) => {
                this.assistantOptions = []
                this.$message.error(JSON.stringify(err.message))
            });
        },
        //获取带货商品列表
        getRecordList(id){
            this.dataList=[]
            this.$http
            .get("/sys/management/user/product/livePage", {
                params: this.$httpParams({
                    liveId:id,
                    limit: this.limit,
                    page: this.page,
                    type:this.type,
                
                }),
            }).then(({ data: res }) => {
                if (res.code !== 0) return this.$message.error(res.msg);
                this.dataList=res.data.list
                this.total=res.data.total
            }).catch((err) => {
                this.dataList = []
                this.$message.error(JSON.stringify(err.message))
            });
        },

        // filterHandler(value, row, column) {
        //     const property = column['property'];
        //   
        //     return row[property] === value;
        // },
        filterChange(column){
            if(column.payStatus[0] || this.type){
                this.type=column.payStatus[0]
                this.getRecordList(this.diaForm.id);
            }else{
                this.getRecordList(this.diaForm.id);
            }
            
        },

        //商品页面切换
        pageSizeChangeHandle(val){
            this.page = 1;
            this.limit = val;
            this.getRecordList(this.diaForm.id);
        },
        pageCurrentChangeHandle(val){
            this.page = val;
            this.getRecordList(this.diaForm.id);
        },
    },
}
</script>

<style lang="scss" scoped>
.detalilBox {
    height: 100%;
    background: #fff;
    min-height: calc(100vh - 50px - 38px);
    padding: 20px 30px;
    width: 100%;

    .detalilBox-title{
        height: 50px;
        width:100%;
        line-height: 50px;
        font-size: 20px;
        // font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #000000;
        margin-bottom: 15px;
        // border-bottom:1px solid #EBEEF5;
    }

    .detalilBox-content{
        // margin-left: 50px;
        display: flex;
        .contient-item{
            margin-right: 10px;
            margin-bottom: 15px;
            text-align:right;
            width: 120px
        }
        .contient-items{
            margin-right: 180px;
        }
    }
}
</style>