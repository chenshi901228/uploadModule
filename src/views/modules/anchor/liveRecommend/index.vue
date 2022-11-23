<!-- 直播推荐 -->

<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-live__hotSearchConfig">
            <el-form
                class="headerTool"
                :inline="true"
                :model="dataForm"
                ref="dataForm"
                size="small"
                label-width="100px"
                label-position="right"
                @keyup.enter.native="getDataList">
                <el-form-item
                    label="直播主题"
                    prop="liveTheme"
                >
                    <el-input
                        style="width: 200px"
                        v-model.trim="dataForm.liveTheme"
                        placeholder="请输入"
                        clearable></el-input>
                </el-form-item>
                <el-form-item
                    label="主播"
                    prop="anchorUser"
                >
                    <el-input
                        style="width: 200px"
                        v-model.trim="dataForm.anchorUser"
                        placeholder="请输入"
                        clearable></el-input>
                </el-form-item>
                <el-form-item
                    label="直播类型"
                    prop="liveType"
                >
                    <el-select
                        style="width: 200px" 
                        v-model="dataForm.liveType" 
                        placeholder="请选择"
                        clearable>
                            <el-option 
                                v-for="item in typeList" 
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <div class="headerTool-search-btns">
                    <el-form-item>
                        <el-button
                            type="primary"
                            icon="el-icon-search"
                            size="mini"
                            @click="getDataList"
                            >{{ $t("query") }}</el-button
                        >
                        <el-button
                            icon="el-icon-refresh"
                            size="mini"
                            @click="resetDataForm()"
                            >{{ $t("reset") }}</el-button
                        >
                        <!-- <el-button size="mini" plain @click="open">
                        <i
                            :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                        ></i>
                        {{ isOpen ? "收起" : "展开" }}
                        </el-button> -->
                    </el-form-item>
                </div>

                <!-- 操作按钮 -->
                <div class="headerTool-handle-btns">
                    <div class="headerTool--handle-btns-left">
                        <el-form-item>
                            <el-button
                                size="mini"
                                icon="el-icon-plus"
                                type="primary"
                                plain
                                @click="add()"
                                >新增</el-button
                            >
                        </el-form-item>
                    </div>
                    <div class="headerTool--handle-btns-right">
                        <el-form-item>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="刷新"
                            placement="top"
                        >
                            <el-button
                            size="small"
                            icon="el-icon-refresh"
                            circle
                            @click="query"
                            ></el-button>
                        </el-tooltip>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <el-table
                v-loading="dataListLoading"
                :data="dataList"
                @selection-change="dataListSelectionChangeHandle"
                :height="siteContentViewHeight + 47"
                style="width: 100%"
                @cell-dblclick="dblclick"
            >
                <el-table-column
                    header-align="center"
                    align="center"
                    width="120"
                    label="序号">
                    <template slot-scope="{ row }">
                        <!-- <span>{{$index + 1}}</span> -->
                        <!-- 序号 -->
                        <div>
                            <el-input-number 
                                v-if="sortId === row.id && sortId !== ''"
                                size="mini"
                                v-model="sortVal"
                                placeholder="请输入"
                                @blur="sortId = ''"
                                :min="0"
                                :precision="0"
                                :controls="false"
                                :max="9999"
                                :id="'input' + row.id"
                                @keyup.enter.native="userSelect(row)"
                            ></el-input-number>
                            <span v-else>
                                {{ row.num || "--" }}
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    v-for="item in tableItem"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width || 120"
                    show-overflow-tooltip
                >
                    <template slot-scope="{ row }">
                        <!-- 封面图 -->
                        <div v-if="item.prop == 'frontCoverUrl'">
                            <img class="frontCoverImg" :src="row.frontCoverUrl || require('@/assets/img/default_cover.jpg')" alt="" />
                        </div>
                        <span v-else-if="item.prop == 'liveType'">{{row.liveType == 1 ? "直播列表" : "直播预告"}}</span>
                        <span v-else>{{row[item.prop]}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('handle')"
                    fixed="right"
                    header-align="center"
                    align="center"
                >
                    <template slot-scope="{ row, $index }">
                        <el-button
                            type="text"
                            size="small"
                            icon="el-icon-delete"
                            @click="deleteCount(row, $index + 1)">移除</el-button>
                        <!-- <el-button
                            type="text"
                            size="small"
                            icon="el-icon-sort-down"
                            @click="upOrDownHandle(row, -1, $index + 1)">下移</el-button>
                        <el-button
                            type="text"
                            size="small"
                            icon="el-icon-sort-up"
                            v-if="$index != 0"
                            @click="upOrDownHandle(row, 1, $index + 1)">上移</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <!-- <el-pagination
                background
                :current-page="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="pageSizeChangeHandle"
                @current-change="pageCurrentChangeHandle"
            >
            </el-pagination> -->
        </div>
    </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
export default {
    mixins: [mixinTableModule],
    data() {
        return {
            mixinTableModuleOptions: {
                getDataListURL: "/sys/liveList/liveRecommendAll", // 数据列表接口，API地址
                getDataListIsPage: false, //不需要分页
            },
            dataForm: {
                liveTheme: "",
                anchorUser: "",
                liveType: null
            },

            tableItem: [
                { prop: "frontCoverUrl", label: "直播宣传图" },
                { prop: "liveTheme", label: "直播主题" },
                { prop: "liveType", label: "直播类型" },
                { prop: "anchorUser", label: "主播" },
                { prop: "anchorTel", label: "手机号码", width: 150 },
                { prop: "startDate", label: "开播时间", width: 180 },
                { prop: "createDate", label: "创建时间", width: 180 },
            ],
            // 直播类型
            typeList: [
                { value: 0, label: "预告" },
                { value: 1, label: "直播" },
            ],
            sortVal: "",
            sortId: "",
        };
    },
    created() {
        // this.query()
    },
    activated() {
        this.query();
    },
    methods: {
        //   新增
        add() {
            this.$router.push({ name: "anchor-liveRecommend-recommendAdd" })
        },
        // 移除
        deleteCount(data, index) {
            this.$confirm(`确认移除推荐[${data.liveTheme}]?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                    this.$http.delete(`/sys/liveList/remove/${index}`).then(({data: res}) => {
                        if(res.code != 0) return this.$message.error(res.msg)
                        this.$message.success("移除推荐成功")
                        this.query()
                    }).catch(err => this.$message.error(JSON.stringify(err.message)))
                })
                .catch(() => {
                    this.$message.info("已取消操作");
                });
        },
        // 上移或下移
        upOrDownHandle(data, type, index) {
            this.$confirm(`确认${type == -1 ? "下移" : "上移"}推荐[${data.liveTheme}]?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                    this.$http.put(`/sys/liveList/${type == -1 ? "moveDown" : "moveUp"}/${index}`).then(({data: res}) => {
                        if(res.code != 0) return this.$message.error(res.msg)
                        this.$message.success("修改推荐成功")
                        this.query()
                    }).catch(err => this.$message.error(JSON.stringify(err.message)))
                })
                .catch(() => {
                    this.$message.info("已取消操作");
                });
        },
        //排序
        dblclick(row, column, cell, event) {
            this.sortId = row.id;
            this.sortVal = row.num;
            this.$nextTick(() => {
            let id = "#" + "input" + this.sortId;
            document.querySelector(id).focus();
            });
        },
        //回车确认
        userSelect(row) {
        if(!this.sortVal){
            return this.$message.warning('序号不能为空或0');
        }
        this.$http
            .put(`/sys/liveList/move?afterIndex=${row.num}&nowIndex=${this.sortVal}`).then(({ data: res }) => {
            if (res.code !== 0) {
                return this.$message.error(res.msg);
            } else {
                this.nowIndex = "";
                this.query();
            }
            })
            .catch((err) => {
            throw err;
            });
        },

    },
};
</script>
<style lang="scss" scoped>
.frontCoverImg {
    max-width: 100%;
    height: 60px;
    object-fit: cover;
}
/deep/.el-input-number.is-without-controls {
  .el-input {
    width: 100px;
  }
}
</style>