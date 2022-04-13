<template>
    <el-select :size="size" :value="value+''" @input="$emit('input', $event)" :placeholder="placeholder" clearable>
        <el-option :label="data.dictLabel" v-for="data in dataList" :key="data.dictValue" :value ="data.dictValue">{{data.dictLabel}}</el-option>
    </el-select>
</template>
<script>
import { getDictDataList } from '@/utils'
export default {
  name: 'RenSelect',
  data () {
    return {
      dataList: getDictDataList(this.dictType)
    }
  },
  props: {
    value: {
      type: [Number, String],
      default: ""
    },
    size: {
      type: String,
      default: "small"
    },
    dictType: String,
    placeholder: String,
  }
}
</script>
