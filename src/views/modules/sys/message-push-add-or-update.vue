
<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
      size="small"
    >
      <el-form-item label-width="120px" label="计划名称" prop="planName">
        <el-input :maxlength="50" show-word-limit v-model="ruleForm.planName" :disabled="isDisable" style="width:600px" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label-width="120px" label="配置KEY" prop="configurationKey">
        <el-input :maxlength="50" show-word-limit v-model="ruleForm.configurationKey" :disabled="isDisable" style="width:600px" placeholder="请输入KEY" clearable></el-input>
      </el-form-item>
      <el-form-item label-width="120px" label="推送类型" prop="pushType">
        <el-select v-model="ruleForm.pushType" :disabled="isDisable" style="width:600px" placeholder="请选择" clearable>
          <el-option label="站内信" value="1"></el-option>
          <el-option label="短信" value="2"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="路由" prop="route">
        <el-input v-model="ruleForm.route" :disabled="isDisable" style="width:600px" placeholder="例如：http：//2376482" clearable></el-input>
      </el-form-item> -->
      <el-form-item label-width="120px" style="display:inline-block" label="跳转页面" prop="type" v-if="ruleForm.pushType=='1'">
        <el-select v-model="ruleForm.type" :disabled="isDisable" @clear="clearBtn" @change="selectPage" placeholder="请选择分类" clearable>
          <el-option
            v-for="item in pageType"
            :key="item.id"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="display:inline-block" prop="anchorId" v-if="ruleForm.pushType=='1'">
        <el-select v-if="selectType.type!=='other'" style="marginLeft:10px;width:300px;" :disabled="isDisable" v-model="ruleForm.anchorId" filterable remote reserve-keyword clearable
          placeholder="请输入选择主播" :remote-method="getAnchorInfo" :loading="loading" @change="changeAnchorId">
          <el-option v-for="item in anchorOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="display:inline-block" prop="pushBusines" v-if="ruleForm.pushType=='1'">
        <el-select v-if="selectType.type===0||selectType.type===1||selectType.type===2" style="marginLeft:10px;width:300px;" :disabled="isDisable" v-model="ruleForm.pushBusines" clearable
          :placeholder="selectType.type===0?'请选择直播':selectType.type===1?'请选择直播预告':'请选择短视频'" @change="changePushBusines">
          <el-option v-for="item in pushBusines" :key="item.id" :label="item.liveTheme" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="display:inline-block" prop="route" v-if="ruleForm.pushType=='1'">
        <el-input style="marginLeft:10px;width:300px;" v-if="selectType.type==='other'" v-model="ruleForm.route" :disabled="isDisable" placeholder="请输入路由" clearable></el-input>
      </el-form-item>
      <el-form-item style="display:inline-block" prop="parameter" v-if="ruleForm.pushType=='1'">
        <el-input style="marginLeft:10px;width:300px;" v-if="selectType.type==='other'" v-model="ruleForm.parameter" :disabled="isDisable" placeholder="请输入参数" clearable></el-input>
      </el-form-item>
      <el-form-item label-width="120px" label="推送图标" required v-if="ruleForm.pushType=='1'">
        <upload
          :fileList="fileList"
          :disabled="isDisable"
          :limit="1"
          :fileMaxSize="2"
          :fileType="['bmp', 'png', 'jpg', 'jpeg']"
          ref="uploadFile"
          @uploadSuccess="uploadSuccess"
          @uploadRemove="uploadRemove"
        ></upload>
        <p class="tips">图片大小必须小于2M,支持bmp、png、jpg、jpeg格式,尺寸为80px*80px</p>
      </el-form-item>
      <el-form-item label-width="120px" label="推送标题" prop="pushTitle">
        <el-input :maxlength="50" show-word-limit v-model="ruleForm.pushTitle" :disabled="isDisable" style="width:600px" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label-width="120px" class="quill-editor" label="推送内容" v-if="ruleForm.pushType=='1'" prop="pushContent">
          <quill-editor :disabled="isDisable" v-model="ruleForm.pushContent" ref="myQuillEditor" style="width: 800px;"
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
      <el-form-item label-width="120px" label="推送内容" v-if="ruleForm.pushType=='2'" prop="pushContent">
        <el-input
            style="width: 800px;"
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              :disabled="isDisable"
              maxlength='60'
              show-word-limit
              v-model="ruleForm.pushContent">
          </el-input>
      </el-form-item>
      <el-form-item label-width="120px" label="动态组" prop="dynamicGroupId">
        <el-select v-model="ruleForm.dynamicGroupId" :disabled="isDisable" style="width:600px" multiple :placeholder="isDisable?'':'请选择,可多选'" clearable>
          <el-option v-for="item in allDynamicGroup" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="120px" label="是否定时"  prop="isTiming">
        <el-radio-group v-model="ruleForm.isTiming" >
          <el-radio label="1" :disabled="isDisable" >是</el-radio>
          <el-radio label="0" :disabled="isDisable" >否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label-width="120px" prop="timing" v-if="ruleForm.isTiming === '1'" label="计划推送时间">
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
import Upload from "@/components/common/custom-upload"
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
        pushType: '1',
        configurationKey: '',
        route: '',
        isTiming: "0",
        timing: '',
        dynamicGroupId: [],
        pushBusines:'',
        anchorId:'',
        type:'',
        parameter:'',
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
        // type: [
        //   { required: true, message: '请选择分类', trigger: 'change' }
        // ],
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
      allDynamicGroup: [], // 动态组
      pageType:[],
      anchorOptions:[],
      loading:false,
      selectType:{
        url:'',
        type:'',
      },
      pushBusinesParams:{
        anchorId:'',
        type:'',
      },
      pushBusines:[],
      fileUrl:'',//图标
    }
  },
  created () {
  },
  activated () {
    this.getPageType()
    this.$http.get('/sys/dynamicGroup/getAllDynamicGroupList').then(({data: res}) => {
      this.allDynamicGroup = res.data
    })
    this.fileUrl=''
  },
  mounted () {
    
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
          this.ruleForm.dynamicGroupId = []
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
    selectPage(value){
      this.ruleForm.route = ''
      this.ruleForm.parameter = ''
      let obj = value&&JSON.parse(value)
      if(obj.url){
        this.selectType = obj
        this.pushBusinesParams.type = obj.type
        if(this.pushBusinesParams.anchorId&&this.pushBusinesParams.anchorId!='other'&&this.pushBusinesParams.anchorId!=''){
          this.getPushBusines()
        }
      }else{
        this.selectType.type = 'other'
      }
    },
    clearBtn(){
      this.ruleForm.route = ''
      this.ruleForm.parameter = ''
      this.selectType.type=''
      this.ruleForm.anchorId=""
    },
    changeAnchorId(value){
      this.pushBusinesParams.anchorId = value
      if(this.pushBusinesParams.anchorId&&this.pushBusinesParams.anchorId!='other'&&this.pushBusinesParams.anchorId!=''){
        this.getPushBusines()
      }
    },
    changePushBusines(value){
      this.ruleForm.pushBusines = value
    },

    // 输入选择主播
    getAnchorInfo(s) {
      if (s.trim() != "") {
        this.loading = true;
        this.$http
          .get("/sys/anchor/info/getSysAnchorInfos/" + s)
          .then(({ data: res }) => {
            this.loading = false;
            if (res.code == 0) {
              let arr = [];
              res.data.map((item) => {
                arr.push({
                  value: item.weixinUserId,
                  label: `主播：${item.username}  手机号：${item.phone}`,
                });
              });
              this.anchorOptions = arr;
            } else {
              this.anchorOptions = [];
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.anchorOptions = [];
            throw err;
          });
      } else {
        this.anchorOptions = [];
      }
    },
    getPageType(){
      this.$http.get('/sys/dict/data/page',{params:{dictTypeId:'1565870317622063106'}}).then(({data:res})=>{
        this.pageType = res.data.list
        // type:1详情，2 编辑 3新增
        // 进入页面根据状态 重新调用就接口
        if (this.$route.query.type === '1' || this.$route.query.type === '2') {
          this.$http.get(`/sys/syspush/${this.$route.query.id}`).then(({data:res}) => {
            res.data.isTiming = (res.data.isTiming).toString()
            if(res.data.parameter){
                res.data.parameter = res.data.parameter.split(',')
                let type = res.data.parameter[res.data.parameter.length-1]
                if(type!==''){
                  this.pageType.forEach(item=>{
                  if(JSON.parse(item.dictValue).type==type){
                      this.ruleForm.type = item.dictValue
                      this.selectType = JSON.parse(item.dictValue)
                    }
                  })
                  this.anchorOptions=[{label:res.data.anchorUser,value:res.data.parameter[0]}]
                  this.ruleForm.anchorId= res.data.parameter[0]
                  this.pushBusinesParams.type = this.selectType.type
                  this.pushBusinesParams.anchorId = res.data.parameter[0]
                  this.getPushBusines(()=>{
                    this.ruleForm.pushBusines = res.data.parameter[1]
                  })
                }else{
                  this.ruleForm.type = "{}"
                  this.ruleForm.parameter = res.data.parameter
                  this.selectType.type = 'other'
                }
            }else{

                  this.ruleForm.type = ""
                  this.ruleForm.parameter = res.data.parameter
                  this.selectType.type = ''
            }
           
            // 动态组id转array
            res.data.dynamicGroupId = res.data.dynamicGroupId ? res.data.dynamicGroupId.split(",") : []
            this.ruleForm = { ...this.ruleForm, ...res.data }
            this.fileList = [
              {
                name: new Date().getTime(),
                url: res.data.pushIcon
              }
            ]
          })
        }
      })
    },
    getPushBusines(cb){
      this.pushBusines = []
      this.ruleForm.pushBusines = ''
      this.$http.get('/sys/syspush/getPushBusines',{params:{...this.pushBusinesParams}}).then(({data:res})=>{
        this.pushBusines = res.data
        if(cb)cb()
      })
    },
    // 推送图标上传
    uploadSuccess(file) {
      this.fileList.push(file);
    },
    uploadRemove(file) {
      this.fileList = []
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
          if((this.selectType.type===0 || this.selectType.type!='') && this.selectType.type!='other'){
            if(!this.ruleForm.anchorId){
              return this.$message.warning("请选择主播")
            }
            if(this.selectType.type===0||this.selectType.type===1||this.selectType.type===2){
              if(!this.ruleForm.pushBusines){
                return this.$message.warning("请选择跳转具体目地")
              }
            }
            if(this.selectType.type===0||this.selectType.type===1||this.selectType.type===2){
              this.ruleForm.parameter = this.ruleForm.anchorId+','+this.ruleForm.pushBusines+','+this.selectType.type
            }else{
              this.ruleForm.parameter = this.ruleForm.anchorId+','+this.selectType.type
            }
            this.ruleForm.route = this.selectType.url
          }else if((this.selectType.type===0 || this.selectType.type!='') && this.selectType.type=='other'){
            if(!this.ruleForm.route){
              return this.$message.warning("请输入路由")
            }
            if(!this.ruleForm.parameter){
              return this.$message.warning("请输入参数")
            }
            this.ruleForm.parameter =this.ruleForm.parameter+','+5
          }else{
            this.ruleForm.parameter=""
          }
          if(this.ruleForm.pushType=='1'){
             if(!this.$refs.uploadFile.isUploadAll()) {
              return this.$message.warning("还有附件正在上传，请稍后")
            }
            if (!this.fileList.length) return this.$message.error('请上传推送图标')
            this.fileUrl=this.fileList[0].url
          }else{
            this.fileUrl=''
          }
          
          const loading = this.$loading({
            lock: true,
            text: '信息修改中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          // 动态组数据处理
          let dynamicGroupIds = this.ruleForm.dynamicGroupId.length ? this.ruleForm.dynamicGroupId.join(",") : ""
          let dynamicGroupNames = []
          if(this.ruleForm.dynamicGroupId.length) {
            this.ruleForm.dynamicGroupId.map(item => {
              this.allDynamicGroup.map(v => {
                if(item == v.id) {
                  dynamicGroupNames.push(v.name)
                }
              })
            })
          }
          dynamicGroupNames = dynamicGroupNames.join(",")
          if(this.ruleForm.isTiming=='0'){
            this.ruleForm.timing = ''
          }
          
          const params = {
            id: this.id,
            ...this.ruleForm,
            pushIcon: this.fileUrl,
            dynamicGroupId: dynamicGroupIds,
            dynamicGroupName: dynamicGroupNames
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
              if(this.$route.query.type === '2'){
                this.$message.success('修改消息推送成功')
              }else{
                this.$message.success('添加消息推送成功')
              }
              this.resetForm(formName)
              this.fileList = []
              this.id = null
              this.closeCurrentTab()
            } else {
              this.$message.error(res.msg)
            }
            loading.close()
          } catch (e) {
            console.log(e)
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
.tips {
    color: #666;
}
.mod-live__liveList {
  .frontCoverImg {
    width: 100%;
    height: 80px;
  }
}
</style>
