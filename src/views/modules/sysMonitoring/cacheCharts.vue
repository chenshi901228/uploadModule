<!-- 缓存监控 -->
<template>
    <el-card 
        shadow="never" 
        class="aui-card--fill" 
        v-loading="loading">
        <div class="mod-cacheCharts">
            <el-row :gutter="20">
                <el-col :span="24" class="card-box" style="margin-bottom: 20px">
                    <el-card>
                        <div slot="header"><span>基本信息</span></div>
                        <div class="el-table el-table--enable-row-hover el-table--medium">
                            <table cellspacing="0" style="width: 100%">
                            <tbody>
                                <tr>
                                <td class="el-table__cell is-leaf"><div class="cell">Redis版本</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.redis_version }}</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell">运行模式</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.redis_mode == "standalone" ? "单机" : "集群" }}</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell">端口</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.tcp_port }}</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell">客户端数</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.connected_clients }}</div></td>
                                </tr>
                                <tr>
                                <td class="el-table__cell is-leaf"><div class="cell">运行时间(天)</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.uptime_in_days }}</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell">使用内存</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.used_memory_human }}</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell">使用CPU</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ parseFloat(cache.info.used_cpu_user_children).toFixed(2) }}</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell">内存配置</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.maxmemory_human }}</div></td>
                                </tr>
                                <tr>
                                <td class="el-table__cell is-leaf"><div class="cell">AOF是否开启</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.aof_enabled == "0" ? "否" : "是" }}</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell">RDB是否成功</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.rdb_last_bgsave_status }}</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell">Key数量</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.dbSize">{{ cache.dbSize }} </div></td>
                                <td class="el-table__cell is-leaf"><div class="cell">网络入口/出口</div></td>
                                <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.instantaneous_input_kbps }}kps/{{cache.info.instantaneous_output_kbps}}kps</div></td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                    </el-card>
                </el-col>

                <el-col :span="12" class="card-box">
                    <el-card>
                        <div slot="header"><span>命令统计</span></div>
                        <div class="el-table el-table--enable-row-hover el-table--medium">
                            <div ref="commandstats" style="height: 420px" />
                        </div>
                    </el-card>
                </el-col>

                <el-col :span="12" class="card-box">
                    <el-card>
                        <div slot="header">
                            <span>内存信息</span>
                        </div>
                        <div class="el-table el-table--enable-row-hover el-table--medium">
                            <div ref="usedmemory" style="height: 420px" />
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>

<script>
import echarts from "echarts"
export default {
    data() {
        return {
            loading: false,
            // 统计命令信息
            commandstats: null,
            // 使用内存
            usedmemory: null,
            // cache信息
            cache: []
        }
    },
    activated() {
        this.getList();
    },
    methods: {
        /** 查缓存询信息 */
        getList() {
            this.loading = true
            this.$http.get("/sys/monitor/cache").then(({data: res}) => {
                
                this.loading = false

                if(res.code != 0) return this.$message.error(res.msg)
                this.cache = res.data;

                this.commandstats = echarts.init(this.$refs.commandstats, "macarons");
                this.commandstats.setOption({
                    tooltip: {
                        trigger: "item",
                        formatter: "{a} <br/>{b} : {c} ({d}%)",
                    },
                    series: [
                        {
                            name: "命令",
                            type: "pie",
                            roseType: "radius",
                            colorBy: "data",
                            radius: [15, 95],
                            center: ["50%", "38%"],
                            data: res.data.commandStats,
                            animationEasing: "cubicInOut",
                            animationDuration: 1000,
                        }
                    ]
                });

                // 内存配置-
                let max = this.cache.info.maxmemory_human
                max = this.calcMaxMemory(max)

                this.usedmemory = echarts.init(this.$refs.usedmemory, "macarons");
                this.usedmemory.setOption({
                    tooltip: {
                        formatter: "{b} <br/>{a} : " + this.cache.info.used_memory_human,
                    },
                    series: [
                        {
                            name: "峰值",
                            type: "gauge",
                            min: 0,
                            max,
                            detail: {
                                formatter: this.cache.info.used_memory_human,
                            },
                            data: [
                                {
                                    value: parseFloat(this.cache.info.used_memory_human),
                                    name: "内存消耗",
                                }
                            ]
                        }
                    ]
                });
            }).catch((err) => {
                this.loading = false
                this.$message.error(JSON.stringify(err))
            })
        },
        // 计算最大内存
        calcMaxMemory(num) {
            if(num.includes("G")) return parseInt(num) * 1024

            if(num.includes("M")) return parseInt(num)

            return parseInt(num)
        }
    }
};
</script>
