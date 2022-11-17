<template>
    <div class="detalilBox">
        <el-form
            class="headerTool"
            :inline="true"
            :model="dataForm"
            ref="dataForm"
            size="small"
            label-width="100px"
            label-position="right"
            @keyup.enter.native="getDataList"
        >
            <el-form-item label="学员昵称" prop="nickName">
                <el-input size="small" style="width: 200px" v-model.trim="dataForm.nickName" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="问题描述" prop="content">
                <el-input size="small" style="width: 200px" v-model.trim="dataForm.content" placeholder="请输入" clearable></el-input>
            </el-form-item>
           <el-form-item>
                <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="getDataList"
                >查询</el-button
                >
                <el-button icon="el-icon-refresh" size="mini" @click="reset"
                >重置</el-button
                >
            </el-form-item>
        </el-form>

        <el-table max-height="500" v-loading="dataListLoading" :data="dataList" style="width: 100%">
            <el-table-column prop="nickName" align="center" label="用户昵称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="content" align="center" label="问题描述" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createDate" align="center" label="提问时间" show-overflow-tooltip></el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                align="center"
                width="160">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看详情</el-button>
                </template>
            </el-table-column>
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
</template>

<script>
export default {
    data(){
        return{
            diaForm:{},
            dataForm:{
                nickName:"",
                content:"",
            },
            dataListLoading:false,
            dataList:[],//带货商品列表

            page:1,//当前页
            limit:10,//当前条
            total:0,//当前总数
            
        }
    },
    activated () {
        this.dataForm.nickName=""
        this.dataForm.content=""
        this.diaForm = JSON.parse(window.localStorage.getItem("problemListDetailData"))
        this.getProblemList()
    },
    methods:{
        getProblemList(){
           this.dataList=[]
            this.$http
            .get("/sys/liveAsk/page", {
                params: this.$httpParams({
                    liveId:this.diaForm.id,
                    limit: this.limit,
                    page: this.page,
                    nickName:this.dataForm.nickName,
                    content:this.dataForm.content,
                    orderField:"create_date",
                    order:"desc"
                
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
        handleClick({ content }){
            this.$alert(content || '暂无详情', '提问详情', {
                confirmButtonText: '关闭',
                callback: action => {}
            });
        },
        //切换
        pageSizeChangeHandle(val){
            this.page = 1;
            this.limit = val;
            this.getProblemList();
        },
        pageCurrentChangeHandle(val){
            this.page = val;
            this.getProblemList();
        },
        //查询
        getDataList () {
            this.page = 1;
            this.getProblemList();
        },
        // 重置搜索条件
        reset() {
            this.$refs.dataForm.resetFields();
            this.getProblemList();
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
    .headerTool{
        margin-bottom: 20px;
    }
}
</style>