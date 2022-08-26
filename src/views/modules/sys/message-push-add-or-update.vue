
<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="计划名称" prop="planName">
        <el-input v-model="ruleForm.planName" :disabled="isDisable" style="width:600px"></el-input>
      </el-form-item>
      <el-form-item label="配置KEY" prop="configurationKey">
        <el-input v-model="ruleForm.configurationKey" :disabled="isDisable" style="width:600px"></el-input>
      </el-form-item>
      <el-form-item label="推送类型">
        <el-select v-model="ruleForm.pushType" :disabled="isDisable" placeholder="推送类型">
          <el-option label="站内信" value="1"></el-option>
          <el-option label="短信" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="路由" prop="route">
        <el-input v-model="ruleForm.route" :disabled="isDisable" style="width:600px"></el-input>
      </el-form-item>
      <el-form-item label="推送图标" required>
        <upload :fileList="fileList" :limit="1" :disabled="isDisable" :multiple="false" @getImg="getImg"></upload>
      </el-form-item>
      <el-form-item label="推送标题" prop="pushTitle">
        <el-input v-model="ruleForm.pushTitle" :disabled="isDisable" style="width:600px"></el-input>
      </el-form-item>
      <el-form-item class="quill-editor" label="推送内容">
          <quill-editor v-model="ruleForm.pushContent" ref="myQuillEditor" style="width: 800px;"
            :options="editorOption" @change="onEditorChange($event)">
            <!-- 自定义toolar -->
            <div id="toolbar" slot="toolbar">
              <!-- Add a bold button -->
              <button class="ql-bold" title="加粗">Bold</button>
              <button class="ql-italic" title="斜体">Italic</button>
              <button class="ql-underline" title="下划线">underline</button>
              <button class="ql-strike" title="删除线">strike</button>
              <button class="ql-blockquote" title="引用"></button>
              <button class="ql-code-block" title="代码"></button>
              <button class="ql-header" value="1" title="标题1"></button>
              <button class="ql-header" value="2" title="标题2"></button>
              <!--Add list -->
              <button class="ql-list" value="ordered" title="有序列表"></button>
              <button class="ql-list" value="bullet" title="无序列表"></button>
              <!-- Add font size dropdown -->
              <select class="ql-header" title="段落格式">
                <option selected>段落</option>
                <option value="1">标题1</option>
                <option value="2">标题2</option>
                <option value="3">标题3</option>
                <option value="4">标题4</option>
                <option value="5">标题5</option>
                <option value="6">标题6</option>
              </select>
              <select class="ql-size" title="字体大小">
                <option value="10px">10px</option>
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px" selected>16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
              </select>
              <!-- <select class="ql-font" title="字体">
                <option value="SimSun">宋体</option>
                <option value="SimHei">黑体</option>
                <option value="Microsoft-YaHei">微软雅黑</option>
                <option value="KaiTi">楷体</option>
                <option value="FangSong">仿宋</option>
                <option value="Arial">Arial</option>
              </select> -->
              <!-- Add subscript and superscript buttons -->
              <select class="ql-color" value="color" title="字体颜色"></select>
              <select class="ql-background" value="background" title="背景颜色"></select>
              <select class="ql-align" value="align" title="对齐"></select>
              <button class="ql-clean" title="还原"></button>
              <!-- You can also add your own -->
            </div>
          </quill-editor>
          <!-- <span
            class="wordNumber"
            style="position: absolute; left: 730px; bottom: 40px"
            >{{ TiLength }}/2000</span
          > -->
        </el-form-item>
      <el-form-item label="动态组">
        <el-select v-model="ruleForm.dynamicGroupId" :disabled="isDisable"   placeholder="推送类型" >
          <el-option v-for="item in allDynamicGroup" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否定时"  prop="isTiming">
        <el-radio-group v-model="ruleForm.isTiming" >
          <el-radio label="1" :disabled="isDisable" >是</el-radio>
          <el-radio label="0" :disabled="isDisable" >否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="timing"  v-if="ruleForm.isTiming === '1'"  label="计划推送时间">
        <el-popover v-model="cronPopover">
          <cron v-show="!isDisable" @change="changeCron" @close="cronPopover=false" i18n="cn"></cron>
          <el-input slot="reference" @click="cronPopover=true" :disabled="isDisable" v-model="ruleForm.timing" :placeholder="$t('schedule.cronExpressionTips')"></el-input>
        </el-popover>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button size="small" :disabled="isDisable" type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </el-card>
</template>

<script>
import Upload from '@/components/upload/index'
import mixinTableModule from '@/mixins/table-module'
import { Quill, quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import '@/assets/font.css'
import { cron } from 'vue-cron'
// 自定义字体大小
const Size = Quill.import('attributors/style/size')
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px']
Quill.register(Size, true)

// 自定义字体类型
var fonts = [
  'SimSun',
  'SimHei',
  'Microsoft-YaHei',
  'KaiTi',
  'FangSong',
  'Arial',
  'Times-New-Roman',
  'sans-serif',
  '宋体',
  '黑体'
]
var Font = Quill.import('formats/font')
Font.whitelist = fonts
Quill.register(Font, true)

export default {
  mixins: [mixinTableModule],
  components: {
    Upload,
    quillEditor,
    cron
  },
  data () {
    return {
      editorOption: {
        placeholder: "请输入",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: "#toolbar",
          }
        }
      },
      cronPopover: false,
      ruleForm: {
        planName: '',
        pushContent: '',
        pushTitle: '',
        pushType: '',
        configurationKey: '',
        route: '',
        isTiming: '',
        timing: '',
        dynamicGroupId: ''
      },
      fileList: [], // 推送图标
      dialogImageUrl: '',
      dialogVisible: false,
      rules: {
        planName: [
          { required: true, message: '请输入计划名称', trigger: 'blur' }
        ],
        configurationKey: [
          { required: true, message: '请输入配置key', trigger: 'blur' }
        ],
        route: [
          { required: true, message: '请输入路由', trigger: 'blur' }
        ],
        pushTitle: [
          { required: true, message: '请输入推送标题', trigger: 'blur' }
        ],
        isTiming: [
          { required: true, message: '请选择是否定时', trigger: 'blur' }
        ],
        timing: [
          { required: true, message: '请选择计划推送时间', trigger: 'blur' }
        ]
      },
      imgSrc: '',
      allDynamicGroup: [] // 动态组
    }
  },
  created () {
  },
  activated () {
    // type:1详情，2 编辑 3新增
    // 进入页面根据状态 重新调用就接口
    if (this.$route.query.type === '1' || this.$route.query.type === '2') {
      this.$http.get(`/sys/syspush/${this.$route.query.id}`).then((res) => {
        res.data.data.isTiming = (res.data.data.isTiming).toString()
        this.ruleForm = { ...this.ruleForm, ...res.data.data }
        this.fileList = [
          {
            name: new Date().getTime(),
            url: res.data.data.pushIcon
          }
        ]
      })
    }
  },
  mounted () {
    this.$http.get('/sys/dynamicGroup/getAllDynamicGroupList').then((res) => {
      this.allDynamicGroup = res.data.data
    })
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (val.query.type === '3') { // 如果是新增清空
          const formName = 'ruleForm'
          this.$refs[formName].resetFields()
          this.fileList = []
          this.ruleForm.pushContent = ''
          this.ruleForm.pushType = ''
          this.allDynamicGroup = []
          this.ruleForm.dynamicGroupId = ''
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  computed: {
    isDisable () { // 如果是查看详情 禁用
      return this.$route.query.type === '1'
    }
  },
  methods: {
    // 头像上传
    getImg (imgList) {
      this.fileList = imgList
    },
    onEditorChange (e) {
      e.quill.deleteText(2000, 4)
      if (this.ruleForm.pushContent == "") {
        this.TiLength = 0
      } else {
        this.TiLength = e.quill.getLength() - 1
        this.$refs.ruleForm.clearValidate("liveIntroduce")
      }
    },
    changeCron (val) {
      this.ruleForm.timing = val
    },
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // this.$confirm('确认信息已填写无误，提交审批','提示',{
          //   confirmButtonText:'确认',
          //   cancelButtonText:'取消',
          // }).then(()=>{
          if (!this.fileList.length) return this.$message.error('请上传推送图标')
          const loading = this.$loading({
            lock: true,
            text: '信息修改中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          const params = {
            id: this.id,
            ...this.ruleForm,
            pushIcon: this.fileList[0].response ? this.fileList[0].response.data.url : this.fileList[0].url,
            dynamicGroupName: this.allDynamicGroup.find((item) => item.id === this.ruleForm.dynamicGroupId).name // 根据动态组id获取name
          }
          let result = null
          try {
            if (this.$route.query.type === '3') {
              result = await this.$http.post('/sys/syspush', params)
            } else {
              result = await this.$http.put('/sys/syspush', params)
            }
            const { data: res } = result
            if (res.code === 0) {
              this.$message.success('添加消息推送成功')
              this.resetForm(formName)
              this.fileList = []
              this.id = null
              this.closeCurrentTab()
            } else {
              this.$message.error(res.msg)
            }
            loading.close()
          } catch (e) {
            loading.close(e)
          }
          // this.$http.put('/sys/syspush', params).then(({ data: res }) => {
          //   if (res.code === 0) {
          //     this.$message.success('添加消息推送成功')
          //     this.resetForm(formName)
          //     this.fileList = []
          //     this.id = null
          //     this.closeCurrentTab()
          //   } else {
          //     this.$message.error(res.msg)
          //   }
          //   loading.close()
          // }).catch(err => {
          //   loading.close()
          //   console.log(err)
          // })
        } else {
          console.log('error submit!')
          return false
        }
      })
    },
    cancel () {
      this.$router.push('/sys-message-push')
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-live__liveList {
  .frontCoverImg {
    width: 100%;
    height: 80px;
  }
}
/deep/.el-input {
  width: 300px;
}
/deep/.el-textarea {
  width: 600px;
}
/deep/.el-textarea__inner {
  padding-bottom: 50px;
  padding-right: 60px;
}
/deep/.el-input__count {
  right: 30px;
}
</style>
