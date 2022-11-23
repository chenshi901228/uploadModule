// 直播封面图

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__liveList">
      <el-form class="headerTool" :inline="true" :model="dataForm" ref="dataForm" size="small" label-width="100px"
        label-position="right" @keyup.enter.native="getDataList()">
        <el-form-item label="图片名称" prop="coverName" v-show="isOpen || formItemCount >= 1">
          <el-input size="small" :clearable="true" style="width: 200px" v-model="dataForm.coverName" placeholder="请输入">
          </el-input>
        </el-form-item>
        <el-form-item label="图片分类" prop="style" >
          <el-select 
            clearable
            v-model="dataForm.style"
            @change="styleInfo"
            placeholder="请选择">
            <el-option label="封面图" :value="'0'"></el-option>
            <el-option label="分享图" :value="'1'"></el-option>
            <el-option label="背景图" :value="'2'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片类型" prop="classification">
          <el-select 
            clearable
            v-model="dataForm.classification"
            :disabled="dataForm.style==''"
            placeholder="请先选择图片分类"
            
            >
            <el-option v-for="item in typeList" :key="item.id" :label="item.dictLabel" :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>

        <div class="headerTool-search-btns">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="getDataList">{{ $t("query") }}
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetDataForm()">{{ $t("reset") }}</el-button>
            <el-button size="mini" plain @click="open">
              <i :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              {{ isOpen ? "收起" : "展开" }}
            </el-button>
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <el-form-item>
              <el-button plain size="mini" icon="el-icon-delete" v-if="dataListSelections.length !== 0" type="danger"
                @click="deleteSelect()">批量删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button plain size="mini" icon="el-icon-delete" v-if="dataListSelections.length !== 0" type="danger"
                @click="deleteSelect()">批量删除</el-button>
              <el-button size="mini" icon="el-icon-plus" plain type="primary" @click="upImg">上传</el-button>
            </el-form-item>
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="small" icon="el-icon-refresh" circle @click="query"></el-button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" :height="siteContentViewHeight" style="width: 100%"
        ref="table">
        <!-- @selection-change="dataListSelectionChangeHandle" -->
        <!-- <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
          fixed="left"
        ></el-table-column> -->
        <el-table-column width="150" label="图片" prop="coverUrl" align="center">
          <template slot-scope="{ row }">
            <div>
              <img style="width: 80px; height: '80px'" class="frontCoverImg"
                :src="row.coverUrl || 'https://picsum.photos/400/300?random=1'" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="图片名称" prop="coverName" align="center">
        </el-table-column>
        <el-table-column label="图片分类" prop="style" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.style=='0'">封面图</span>
            <span v-if="row.style=='1'">分享图</span>
            <span v-if="row.style=='2'">背景图</span>
          </template>
        </el-table-column>
        <el-table-column label="图片类型" prop="classification" align="center">
          <template slot-scope="{ row }">
            <div v-if="row.style=='0'">
              <span v-for="(item,index) of coverList" :key="index">
                {{row.classification == item.dictValue ? item.dictLabel : ''}}
              </span>
            </div>
            <div v-else-if="row.style=='1'">
              <span v-for="(item,index) of shareList" :key="index">
                {{row.classification == item.dictValue ? item.dictLabel : ''}}
              </span>
            </div>
            <div v-else-if="row.style=='2'">
              <span v-for="(item,index) of settingList" :key="index">
                {{row.classification == item.dictValue ? item.dictLabel : ''}}
              </span>
            </div>
            <div v-else></div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center">
        </el-table-column>
        <!-- <el-table-column label="显示状态" prop="showStatus" align="center">
          <template slot-scope="scope" align="center">
            <span>{{ scope.row.showStatus === 0 ? "隐藏" : "显示" }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <!-- <el-button icon="el-icon-sort" v-if="scope.row.appointmentState !== 0" type="text" size="small"
              @click="showThis(scope.$index, scope.row)">{{ scope.row.showStatus === 0 ? "显示" : "隐藏" }}</el-button> -->
            <el-button v-if="scope.row.appointmentState !== 0" type="text" size="small" icon="el-icon-edit"
              @click="handle(scope.$index, scope.row)">编辑</el-button>
            <el-button v-if="scope.row.appointmentState !== 0" type="text" size="small" icon="el-icon-view"
              @click="showImg(scope.$index, scope.row)">查看</el-button>
            <!-- <el-button
              v-if="scope.row.appointmentState !== 0"
              type="text"
              size="small"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
        layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </div>
    <el-dialog title="删除" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="备注" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确认{{ showStatus === 0 ? "显示" : "隐藏" }}吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmShowState">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增 -->
    <el-dialog title="新增图片" :visible.sync="upImgDialog" width="40%">
      <el-form :model="imgForm" :rules="imgFormRules" ref="imgForm" label-width="100px" class="demo-ruleForm">
        <el-tabs v-if="imgForm" v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="封面图" name="0">
            <el-form-item label="图片类型" prop="classification" >
             <el-select 
                clearable
                v-model="imgForm.classification"
                placeholder="请选择"
                style="width: 60%">
                <el-option v-for="item in typeList" :key="item.id" :label="item.dictLabel" :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片名称" prop="name">
              <el-input placeholder="请输入" maxlength="15" v-model="imgForm.name" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="上传图片" prop="img">
              <el-upload :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove" :on-success="handleSuccess" :on-exceed="handleExceed1" :before-upload="beforeUpload" :limit="1" ref="upload"
                :class="imgForm.img.length !== 0 ? 'hide_box' : ''">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <div>图片尺寸大小为630px*347px，不得超过2M</div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="分享图" name="1">
            <el-form-item label="图片类型" prop="classification">
             <el-select 
                clearable
                v-model="imgForm.classification"
                placeholder="请选择"
                style="width: 60%">
                <el-option v-for="item in typeList" :key="item.id" :label="item.dictLabel" :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片名称" prop="name">
              <el-input placeholder="请输入" maxlength="15" v-model="imgForm.name" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="上传图片" prop="img" required>
              <el-upload :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove" :on-success="handleSuccess" :on-exceed="handleExceed1" :before-upload="beforeUpload" :limit="1" ref="upload1"
                :class="imgForm.img.length !== 0 ? 'hide_box' : ''">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <div>图片尺寸大小为460px*368px，不得超过2M</div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="背景图" name="2">
            <el-form-item label="图片类型" prop="classification">
             <el-select 
                clearable
                v-model="imgForm.classification"
                placeholder="请选择"
                style="width: 60%">
                <el-option v-for="item in typeList" :key="item.id" :label="item.dictLabel" :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片名称" prop="name">
              <el-input placeholder="请输入" maxlength="15" v-model="imgForm.name" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="上传图片" prop="img" required>
              <el-upload :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove" :on-success="handleSuccess" :on-exceed="handleExceed1" :before-upload="beforeUpload" :limit="1" ref="upload2"
                :class="imgForm.img.length !== 0 ? 'hide_box' : ''">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <div>图片尺寸大小为750px×1624px，不得超过2M</div>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="upImgDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="upImgMethod">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogImageVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>

    <el-dialog title="查看图片" :visible.sync="showImgDialog" width="40%">
      <el-form :model="bigImgForm" ref="imgForm" label-width="100px" class="demo-ruleForm">
        <el-tabs v-if="imgForm" v-model="activeName" type="card" @tab-click="InfoClick">
          <el-tab-pane label="封面图" name="0" :disabled="disabledType"></el-tab-pane>
          <el-tab-pane label="分享图" name="1" :disabled="disabledType"></el-tab-pane>
          <el-tab-pane label="背景图" name="2" :disabled="disabledType"></el-tab-pane>
        </el-tabs>
        <el-form-item label="图片名称" prop="name">
          <el-input disabled v-model="bigImgForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <el-image style="width: 146px; height: 146px" :src="bigUrl" :preview-src-list="srcList">
          </el-image>
        </el-form-item>
        <el-form-item>
          <span>点击可放大预览图片</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showImgDialog = false">取 消</el-button>
      </span>
    </el-dialog>


    <!-- 编辑 -->
    <!-- <el-dialog title="编辑图片" :visible.sync="editeImgDialog" width="30%">
      <el-form :model="editeImgForm" :rules="imgFormRules" ref="imgForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="上传" prop="img">
          <div v-if="editeUrl.length !== 0" style="position: relative; display: inline-block">
            <el-image style="width: 146px; height: 146px; margin-right: 0" :src="editeUrl"
              :preview-src-list="editeSrcList">
            </el-image>
            <el-tooltip effect="dark" content="删除" placement="top">
              <i class="el-icon-close" @click="remove" style="
                  position: absolute;
                  right: 5px;
                  top: 5px;
                  font-size: 12px;
                  color: #fff;
                  cursor: pointer;
                "></i>
            </el-tooltip>
          </div>
          <div v-if="editeUrl.length === 0">
            <el-upload :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview2"
              :on-remove="handleRemove2" :on-success="handleSuccess2" :on-exceed="handleExceed2" :limit="1"
              ref="upload2" :class="editeImgForm.img.length !== 0 ? 'hide_box' : ''">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <span>点击可看大图</span>
        </el-form-item>
        <el-form-item>
          <div>图片尺寸大小为630px*347px，不得超过2M</div>
        </el-form-item>
        <el-form-item label="封面图名称" prop="name">
          <el-input maxlength="15" v-model="editeImgForm.name" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="editeImgDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="editeImgMethod">确 定</el-button>
      </span>
    </el-dialog> -->
    <el-dialog title="编辑图片" :visible.sync="editeImgDialog" width="40%">
      <el-form :model="editeImgForm" :rules="imgFormRules" ref="imgForm" label-width="100px" class="demo-ruleForm">
        <el-tabs v-model="activeName" type="card" @tab-click="editClick">
          <el-tab-pane label="封面图" name="0" :disabled="disabledType">
            <el-form-item label="图片类型" prop="classification">
             <el-select 
                clearable
                @change="handleSelectChange"
                v-model="editeImgForm.classification"
                placeholder="请选择"
                style="width: 60%">
                <el-option v-for="item in typeList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片名称" prop="name">
              <el-input placeholder="请输入" maxlength="15" v-model="editeImgForm.name" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="上传图片" prop="img" required>
              <div v-if="editeUrl.length !== 0" style="position: relative; display: inline-block">
                <el-image style="width: 146px; height: 146px; margin-right: 0" :src="editeUrl"
                  :preview-src-list="editeSrcList">
                </el-image>
                <el-tooltip effect="dark" content="删除" placement="top">
                  <i class="el-icon-close" @click="remove" style="
                      position: absolute;
                      right: 5px;
                      top: 5px;
                      font-size: 12px;
                      color: #fff;
                      cursor: pointer;
                    "></i>
                </el-tooltip>
              </div>
              <div v-if="editeUrl.length === 0">
                <el-upload :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview2"
                  :on-remove="handleRemove2" :on-success="handleSuccess2" :before-upload="beforeUpload" :on-exceed="handleExceed2" :limit="1"
                  ref="upload2" :class="editeImgForm.img.length !== 0 ? 'hide_box' : ''">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item>
              <div>图片尺寸大小为630px*347px，不得超过2M</div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="分享图" name="1" :disabled="disabledType">
            <el-form-item label="图片类型" prop="classification">
             <el-select 
                clearable
                @change="handleSelectChange"
                v-model="editeImgForm.classification"
                placeholder="请选择"
                style="width: 60%">
                <el-option v-for="item in typeList" :key="item.id" :label="item.dictLabel" :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片名称" prop="name">
              <el-input placeholder="请输入" maxlength="15" v-model="editeImgForm.name" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="上传图片" prop="img" required>
              <div v-if="editeUrl.length !== 0" style="position: relative; display: inline-block">
                <el-image style="width: 146px; height: 146px; margin-right: 0" :src="editeUrl"
                  :preview-src-list="editeSrcList">
                </el-image>
                <el-tooltip effect="dark" content="删除" placement="top">
                  <i class="el-icon-close" @click="remove" style="
                      position: absolute;
                      right: 5px;
                      top: 5px;
                      font-size: 12px;
                      color: #fff;
                      cursor: pointer;
                    "></i>
                </el-tooltip>
              </div>
              <div v-if="editeUrl.length === 0">
                <el-upload :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview2"
                  :on-remove="handleRemove2" :on-success="handleSuccess2" :before-upload="beforeUpload" :on-exceed="handleExceed2" :limit="1"
                  ref="upload2" :class="editeImgForm.img.length !== 0 ? 'hide_box' : ''">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item>
              <div>图片尺寸大小为460px*368px，不得超过2M</div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="背景图" name="2" :disabled="disabledType">
            <el-form-item label="图片类型" prop="classification">
             <el-select 
                clearable
                @change="handleSelectChange"
                v-model="editeImgForm.classification"
                placeholder="请选择"
                style="width: 60%">
                <el-option v-for="item in typeList" :key="item.id" :label="item.dictLabel" :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片名称" prop="name">
              <el-input placeholder="请输入" maxlength="15" v-model="editeImgForm.name" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="上传图片" prop="img" required>
              <div v-if="editeUrl.length !== 0" style="position: relative; display: inline-block">
                <el-image style="width: 146px; height: 146px; margin-right: 0" :src="editeUrl"
                  :preview-src-list="editeSrcList">
                </el-image>
                <el-tooltip effect="dark" content="删除" placement="top">
                  <i class="el-icon-close" @click="remove" style="
                      position: absolute;
                      right: 5px;
                      top: 5px;
                      font-size: 12px;
                      color: #fff;
                      cursor: pointer;
                    "></i>
                </el-tooltip>
              </div>
              <div v-if="editeUrl.length === 0">
                <el-upload :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview2"
                  :on-remove="handleRemove2" :on-success="handleSuccess2" :before-upload="beforeUpload" :on-exceed="handleExceed2" :limit="1"
                  ref="upload2" :class="editeImgForm.img.length !== 0 ? 'hide_box' : ''">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item>
              <div>图片尺寸大小为750px×1624px，不得超过2M</div>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="editeImgDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="editeImgMethod">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditeImageVisible">
      <img width="100%" :src="dialogEditeImageUrl" alt="" />
    </el-dialog>
  </el-card>
</template>

<script>
import debounce from "lodash/debounce"
import mixinTableModule from "@/mixins/table-module";
import { getImageWH } from "@/utils"
import Cookies from "js-cookie";
import params from '../../sys/params.vue';
export default {
  components: { params },
  mixins: [mixinTableModule],
  data() {
    return {
      dataListLoading: false, // 数据列表，loading状态
      dataForm: {
        coverName: "",
        style:"",
        classification:"",
      },
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataList: [], // 数据列表
      dataListSelections: [], // 数据列表，多选项
      options: [],
      dialogFormVisible: false,
      ruleForm: {
        desc: "",
      },
      rules: {
        desc: [{ required: true, message: "请填写备注内容", trigger: "blur" }],
      },
      ids: [],
      dialogVisible: false,
      showStatus: 0,
      id: "",
      upImgDialog: false,
      dialogImageUrl: "",
      dialogImageVisible: false,
      uploadUrl: "",
      imgForm: {
        img: "",
        name: "",
        style:"",
        classification:"",
      },
      imgFormRules: {
        classification: [{ required: true, message: '请选择图片类型', trigger: 'blur' }],
        name: [{ required: true, message: "请输入图片名称", trigger: "blur" }],
        
      },
      showImgDialog: false,
      bigUrl: "",
      srcList: [],
      bigImgForm: {
        img: "",
        name: "",
      },
      editeImgDialog: false,
      editeImgForm: {
        img: "",
        name: "",
      },
      editeUrl: "",
      editeSrcList: [],
      dialogEditeImageVisible: false,
      dialogEditeImageUrl: "",
      editeId: "",

      activeName: '0',
      typeList:[],
      dictTypeId:"1594939357775560706",

      coverList:[],//类型-封面图
      shareList:[],//类型-分享图
      settingList:[],//类型-背景图

      disabledType:true,
    };
  },
  watch: {
    showImgDialog(n, o) {
      if (!n) {
        this.bigUrl = "";
        this.srcList = [];
      }
    },
    upImgDialog(n, o) {
      if (!n) {
        this.imgForm = {
          img: "",
          name: "",
          classification:"",
        };
        // 移除表单验证
        if(this.$refs.imgForm) this.$refs.imgForm.clearValidate() 
        this.$nextTick(() => {
          this.$refs.imgForm.clearValidate();
          this.$refs['upload'].clearFiles()
        })
      }
    },
    editeImgDialog(n, o) {
      if (!n) {
        this.editeImgForm.img = "";
        this.editeImgForm.name = "";
        this.editeImgForm.classification=""
        // 移除表单验证
        if(this.$refs.editeImgForm) this.$refs.editeImgForm.clearValidate() 
      }
    },
  },
  created() {
    this.uploadUrl = `${window.SITE_CONFIG["apiURL"]
      }/oss/file/upload?access_token=${Cookies.get("access_token")}`;
      this.getType1()
      this.getType2()
      this.getType3()
  },
  activated() {
    this.query();
  },
  methods: {
    //分类切换
    handleClick(tab, event) {
      this.imgForm.classification=""
      this.imgForm.img=""
      this.imgForm.name=""
      if(tab.name=='0'){
        this.dictTypeId='1594939357775560706'
        this.$nextTick(() => {
          this.$refs['upload'].clearFiles()
        })
      }else if(tab.name=='1'){
        this.dictTypeId='1594939674252574722'
        this.$nextTick(() => {
          this.$refs['upload1'].clearFiles()
        })
      }else if(tab.name=='2'){
        this.dictTypeId='1594939821380370434'
        this.$nextTick(() => {
          this.$refs['upload2'].clearFiles()
        })
      }
      this.getTypeList()
    },
    editClick(tab, event) {
      // this.editeImgForm.classification=""
      this.editeUrl = "";
      this.editeImgForm.img = "";
      // this.editeSrcList = [];
      if(tab.name=='0'){
        this.dictTypeId='1594939357775560706'
      }else if(tab.name=='1'){
        this.dictTypeId='1594939674252574722'
      }else if(tab.name=='2'){
        this.dictTypeId='1594939821380370434'
      }
      this.getTypeList()
    },
    InfoClick(){

    },
    //主列表图片类型
    styleInfo(){
      console.log(this.dataForm.style);
      if(this.dataForm.style=='0'){
        this.dictTypeId='1594939357775560706'
      }else if(this.dataForm.style=='1'){
        this.dictTypeId='1594939674252574722'
      }else if(this.dataForm.style=='2'){
        this.dictTypeId='1594939821380370434'
      }
      this.getTypeList()
    },
    handleSelectChange() {
      this.$forceUpdate()
    },
    getType1(){
      this.$http.get("/sys/dict/data/page", {
          params: {
              page: 1,
              limit: 100,
              dictTypeId:"1594939357775560706",
          },
      }).then(({ data: res }) => {
              if (res.code !== 0) {
                  this.companyList = [];
                  return this.$message.error(res.msg)
              }
              this.coverList=res.data.list 
          }).catch((err) => {
              this.companyList = []
              this.$message.error(JSON.stringify(err.message))
          });
    },
    getType2(){
      this.$http.get("/sys/dict/data/page", {
          params: {
              page: 1,
              limit: 100,
              dictTypeId:"1594939674252574722",
          },
      }).then(({ data: res }) => {
              if (res.code !== 0) {
                  this.companyList = [];
                  return this.$message.error(res.msg)
              }
              this.shareList=res.data.list 
          }).catch((err) => {
              this.companyList = []
              this.$message.error(JSON.stringify(err.message))
          });
    },
    getType3(){
      this.$http.get("/sys/dict/data/page", {
          params: {
              page: 1,
              limit: 100,
              dictTypeId:"1594939821380370434",
          },
      }).then(({ data: res }) => {
              if (res.code !== 0) {
                  this.companyList = [];
                  return this.$message.error(res.msg)
              }
              this.settingList=res.data.list 
          }).catch((err) => {
              this.companyList = []
              this.$message.error(JSON.stringify(err.message))
          });
    },
    // 上传前
    async beforeUpload(file) {
      let type = file.type ? file.type.split("/") : file.name.split(".");
      type = type[type.length - 1];
      let fileSize = file.size / 1024 / 1024 < 2;
      let res = await getImageWH(file)
      if(this.activeName=="0"){
        if(res && (Math.abs(res.width - 630) > 6 || Math.abs(res.height - 347) > 6) ) {
          this.$message.error(`图片尺寸大小为630px*347px`);
          return Promise.reject(false);
        }
      }else if(this.activeName=="1"){
        if(res && (Math.abs(res.width - 460) > 6 || Math.abs(res.height - 368) > 6) ) {
          this.$message.error(`图片尺寸大小为460px*368px`);
          return Promise.reject(false);
        }
      }else if(this.activeName=="2"){
        if(res && (Math.abs(res.width - 750) > 6 || Math.abs(res.height - 1624) > 6) ) {
          this.$message.error(`图片尺寸大小为750px*1624px`);
          return Promise.reject(false);
        }
      }
      
      if (!fileSize) {
        this.$message.error(`上传附件大小不能超过2M!`);
        return Promise.reject(false);
      }
    },
    handleExceed1(file, fileList) {
      if (fileList.length >= 1) {
        this.$message.warning("只能上传一张！");
      }
    },
    handleExceed2(file, fileList) {
      if (fileList.length >= 1) {
        this.$message.warning("只能上传一张！");
      }
    },
    //编辑图片
    editeImgMethod: debounce(function() {
      if (this.editeImgForm.classification=="") {
        this.$message.warning("请选择图片类型！");
      }else if (this.editeImgForm.img === "") {
        this.$message.warning("上传图片不能为空！");
      } else if (this.editeImgForm.name === "") {
        this.$message.warning("名字不能为空！");
      } else {
        this.$http
          .put("/sys/livecoverpicture", {
            coverName: this.editeImgForm.name,
            coverUrl: this.editeImgForm.img,
            classification:this.editeImgForm.classification,
            id: this.editeId,
            style:this.activeName,//图片分类
          })
          .then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg);
            } else {
              this.$message.success('修改图片成功')
              this.editeImgDialog = false;
              this.editeImgForm.img = "";
              this.editeImgForm.name = "";
              this.editeImgForm.classification=""
              this.editeUrl = "";
              this.query();
            }
          })
          .catch((err) => {
            throw err;
          });
      }
    }, 1500, { 'leading': true, 'trailing': false }),
    remove() {
      this.$confirm("确认删除图片", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editeUrl = "";
        this.editeImgForm.img = "";
        this.editeSrcList = [];
        this.$message.success("删除成功")
      }).catch(() => {
        this.$message.info("取消删除")
      })
    },
    handleRemove2(file, fileList) {
      this.editeImgForm.img = "";
    },
    handlePictureCardPreview2(file) {
      this.dialogEditeImageUrl = file.url;
      this.dialogEditeImageVisible = true;
    },
    handleSuccess2(response, file, fileList) {
      this.editeImgForm.img = response.data.url;
    },
    handleRemove(file, fileList) {
      this.imgForm.img = "";
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogImageVisible = true;
    },
    handleSuccess(response, file, fileList) {
      this.imgForm.img = response.data.url;
    },
    query() {
      this.dataListLoading = true;
      let dataObj = {};

      for (const key in this.dataForm) {
        if (this.dataForm[key] && this.dataForm[key].length !== 0) {
          dataObj[key] = this.dataForm[key];
        }
      }

      this.$http
        .get("/sys/livecoverpicture/page", {
          params: {
            page: this.page,
            limit: this.limit,
            ...dataObj,
          },
        })
        .then(({ data: res }) => {
          this.dataListLoading = false;
          if (res.code !== 0) {
            this.dataList = [];
            this.total = 0;
            return this.$message.error(res.msg);
          }
          this.dataList = res.data.list;
          this.total = res.data.total;
        })
        .catch((err) => {
          this.dataListLoading = false;
          throw err;
        });
    },
    //查看封面图
    showImg(index, row) {
      this.showImgDialog = true;
      this.$http
        .get(`/sys/livecoverpicture/${row.id}`)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.bigUrl = res.data.coverUrl;
          this.bigImgForm.name = res.data.coverName;
          this.activeName=(res.data.style).toString()
          this.srcList.push(res.data.coverUrl);
        })
        .catch((err) => {
          throw err;
        });
    },
    //上传封面图
    upImg() {
      this.upImgDialog = true;
      this.activeName="0"
      this.getTypeList()
    },
    //获取图片类型
    getTypeList(){
      this.$http.get("/sys/dict/data/page", {
          params: {
              page: 1,
              limit: 100,
              dictTypeId:this.dictTypeId,
          },
      }).then(({ data: res }) => {
              if (res.code !== 0) {
                  this.companyList = [];
                  return this.$message.error(res.msg)
              }
              this.typeList=res.data.list 
              
          }).catch((err) => {
              this.companyList = []
              this.$message.error(JSON.stringify(err.message))
          });
    },
    //上传图片
    upImgMethod: debounce(function() {
      if (this.imgForm.classification=="") {
        this.$message.warning("请选择图片类型！");
      }else if( this.imgForm.img === ""){
        this.$message.warning("上传图片不能为空！");
      } else if (this.imgForm.name === "") {
        this.$message.warning("名字不能为空！");
      } else {

        this.$http
          .post("/sys/livecoverpicture", {
            coverName: this.imgForm.name,
            coverUrl: this.imgForm.img,
            classification:this.imgForm.classification,//图片类型
            style:this.activeName,//图片分类
          })
          .then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg);
            } else {
              this.$message.success("新增图片成功");
              this.upImgDialog = false;
              this.imgForm.name = "";
              this.imgForm.classification=""
              this.$refs["upload"].clearFiles();
              this.query();
            }
          })
          .catch((err) => {
            throw err;
          });
      }
    }, 1500, { 'leading': true, 'trailing': false }),
    //显示与隐藏
    showThis(index, row) {
      this.dialogVisible = true;
      this.id = row.id;
      this.showStatus = row.showStatus;
    },
    //确认隐藏显示
    confirmShowState() {
      this.$http
        .post(
          `/sys/livecoverpicture/updateShowStatus`, {
          id: this.id,
          showStatus:
            this.showStatus === 1 ? "0" : "1"

        }
        )
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.dialogVisible = false;
            this.query();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    //编辑
    handle(index, row) {
      this.editeImgDialog = true;
      this.editeId = row.id;
      this.$http
        .get(`/sys/livecoverpicture/${row.id}`)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          if(res.data.style=='0'){
            this.dictTypeId='1594939357775560706'
          }else if(res.data.style=='1'){
            this.dictTypeId='1594939674252574722'
          }else if(res.data.style=='2'){
            this.dictTypeId='1594939821380370434'
          }
          this.getTypeList()
          this.editeUrl = res.data.coverUrl;
          this.editeImgForm.img = this.editeUrl;
          this.editeImgForm.name = res.data.coverName;
          this.activeName=(res.data.style).toString()
          this.editeImgForm.classification=res.data.classification.toString()
          this.editeSrcList.push(res.data.coverUrl);
          this.disabledType=true
          
          
        })
        .catch((err) => {
          throw err;
        });
    },
    //删除
    handleDelete(index, row) {
      this.dialogFormVisible = true;
      this.ids.push(row.id);
    },
    //批量删除
    deleteSelect() {
      this.dialogFormVisible = true;
      this.dataListSelections.forEach((v) => {
        this.ids.push(v.id);
      });
    },

    getDataList() {
      this.page = 1;
      this.query();
    },

    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.page = 1;
      this.limit = val;
      this.query();
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.page = val;
      this.query();
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      console.log(val);
      this.dataListSelections = val;
    },
    //删除
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http
            .delete("/sys/livecoverpicture", {
              data: { ids: this.ids, remark: this.ruleForm.desc },
            })
            .then(({ data: res }) => {
              if (res.code !== 0) {
                this.ids = [];
                this.ruleForm.desc = "";
                return this.$message.error(res.msg);
              }
              this.ids = [];
              this.ruleForm.desc = "";
              this.query();
              this.$message.success("删除成功!");
              this.dialogFormVisible = false;
            })
            .catch((err) => {
              throw err;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.mod-live__liveList {
  .frontCoverImg {
    width: 100%;
    height: 80px;
  }
}

/deep/.el-dialog {
  display: flex;
  display: -ms-flex;
  /* 兼容IE */
  flex-direction: column;
  -ms-flex-direction: column;
  /* 兼容IE */
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

/deep/.el-dialog .el-dialog__body {
  padding: 20px;
  /*这个不重要*/
  max-height: 75vh;
  flex: 1;
  -ms-flex: 1 1 auto;
  /* 兼容IE */
  overflow-y: auto;
  overflow-x: hidden;
}

/deep/.el-dialog__wrapper {
  overflow: hidden;
  /*隐藏ie和edge中遮罩的滚动条*/
}

/deep/.hide_box .el-upload--picture-card {
  display: none;
}

/deep/.el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
    background: #eee !important;
    color: #3558cc !important;
}
</style>