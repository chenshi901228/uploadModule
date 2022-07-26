<!--自定义表格组件-->

<template>
  <div>
    <el-table
      ref="table"
      v-loading="dataListLoading"
      :data="dataList"
      @selection-change="dataListSelectionChangeHandle"
      :height="height"
      style="width: 100%"
    >
      <el-table-column
        v-if="isSelection"
        type="selection"
        header-align="center"
        align="center"
        width="50"
        fixed="left"
      ></el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        v-for="item in items"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width || 120"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <!-- {{row[item.prop] || "-"}} -->
          <columnsCom :item="item" :row="row" />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('handle')"
        fixed="right"
        header-align="center"
        align="center"
        :width="action[0].width"
        v-if="action.length"
      >
        <template slot-scope="{ row }">
          <el-button
            v-for="item in action[0].actionList"
            :key="item.name"
            type="text"
            size="small"
            @click="item.handle(row)"
            :icon="item.icon"
            >{{ item.name || "action" }}</el-button
          >
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
  components: {
    // 自定义cell
    columnsCom: {
      props: {
        item: {
          type: Object,
          default: () => {},
        },
        row: {
          type: Object,
          default: () => {},
        },
      },
      template: `
        <img v-if="item.type == 'image'" :style="item.style" :src="row[item.prop] || defaultImg(item.defaultImg)"alt=""/>
        <span v-else-if="item.type == 'string'">{{item.render ? item.render() : ""}}</span>
        <span v-else>{{row[item.prop] || "-"}}</span>
      `,
      methods: {
        // 默认图片处理
        defaultImg(img) {
          return img || 'https://picsum.photos/400/300?random=1'
        }
      }
    },
  },
  props: {
    // 加载loading
    dataListLoading: {
      type: Boolean,
      default: false,
    },
    // 是否可选
    isSelection: {
      type: Boolean,
      default: false,
    },
    // table高度
    height: {
      type: Number,
      default: 300,
    },
    // 分页-当前页
    page: {
      type: Number,
      default: 1,
    },
    // 分页-每页数
    limit: {
      type: Number,
      default: 10,
    },
    // 分页-总条数
    total: {
      type: Number,
      default: 0,
    },
    // data数据列表
    dataList: {
      type: Array,
      default: () => [],
    },
    // table选项配置
    tableItem: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
    };
  },
  computed: {
    // tableItem选项
    items() { 
      return this.tableItem.filter((item) => !item.action);
    },
    // 操作---action:true
    action() {
      return this.tableItem.filter((item) => item.action);
    },
  },
  methods: {
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.$emit("pageSizeChangeHandle", val);
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.$emit("pageCurrentChangeHandle", val);
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      this.$emit("dataListSelectionChangeHandle", val);
    },
  },
};
</script>