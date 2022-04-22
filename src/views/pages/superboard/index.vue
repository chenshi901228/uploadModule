<!-- 超级白板功能 -->
<template>
    <div 
        class="superboard"
        v-loading="loading"
        :element-loading-text="loadingText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <div id="superboard-content"></div>
        <div class="superboard-tool">
            <el-popover
                v-for="item in toolList" 
                :key="item.name" 
                placement="right"
                :visible-arrow="false"
                :popper-class="'superboard-tool-item-detail ' + (isHasTool(item) ? 'show' : 'hide')"
                trigger="click">
                <!-- 画笔 -->
                <div v-if="activeTool == 'pen'">
                    <div class="tool-color-select borderBottom">
                        <h3>笔触颜色</h3>
                        <ul>
                            <li 
                                v-for="item in colorOptions"
                                :key="item" 
                                @click="setBrushColor(item)"
                                :class="currBrushColor == item ? 'active' : ''"
                                :style="{ background: item }"></li>
                        </ul>
                    </div>
                    <div class="tool-size-pen">
                        <h3>笔触粗细</h3>
                        <ul>
                            <li
                                v-for="item in brushSizeList"
                                :key="item"
                                @click="setBrushSize(item)"
                                :class="currBrushSize == item ? 'active' : ''"
                                :style="{
                                    width: item + 'px',
                                    height: item + 'px',
                                }"></li>
                        </ul>
                    </div>
                </div>
                <!-- 文字 -->
                <div v-else-if="activeTool == 'text'">
                    <div class="tool-color-select borderBottom">
                        <h3>字体颜色</h3>
                        <ul>
                            <li 
                                v-for="item in colorOptions"
                                :key="item" 
                                @click="setBrushColor(item)"
                                :class="currBrushColor == item ? 'active' : ''"
                                :style="{ background: item }"></li>
                        </ul>
                    </div>
                    <div class="tool-size-font">
                        <h3>字体大小</h3>
                        <el-select v-model="currPencilSize" @change="setFontSize">
                            <el-option
                                v-for="item in pencilSizeList"
                                :key="item"
                                :label="item + '号'"
                                :value="item">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <!-- 图形 -->
                <div v-else-if="activeTool == 'graph'">
                    <div class="tool-graph-select borderBottom">
                        <h3>选择形状</h3>
                        <ol>
                            <li 
                                v-for="item in graphList" 
                                :key="item.type"
                                @click="setToolType(item.type)"
                                :class="currGraph == item.type ? 'active' : ''">
                                    <img :src="require('@/assets/icon/s_' + item.name + '.png')" alt="">
                            </li>
                        </ol>
                    </div>
                    <div class="tool-color-select">
                        <h3>形状颜色</h3>
                        <ul>
                            <li 
                                v-for="item in colorOptions"
                                :key="item" 
                                @click="setBrushColor(item)"
                                :class="currBrushColor == item ? 'active' : ''"
                                :style="{ background: item }"></li>
                        </ul>
                    </div>
                </div>
                <el-tooltip slot="reference" effect="dark" :content="item.des" placement="right">
                    <div 
                        :class="['superboard-tool-item', activeTool == item.name ? 'active' : '']" 
                        @click="selectTool(item)">
                            <img :src="require('@/assets/icon/s_' + item.name + '.png')" alt="">
                    </div>
                </el-tooltip>
            </el-popover>
        </div>
        <div class="superboard-pagination">
            <!-- 白板列表 -->
            <el-select v-model="whiteboardSelectValue" @change="switchWhitebopardHandle" placeholder="请选择">
                <el-option
                    v-for="item in whiteboardList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <!-- sheet列表 -->
            <el-select v-if="sheetShow" v-model="sheetListSelectValue" @change="switchSheetListHandle" placeholder="请选择">
                <el-option
                    v-for="item in sheetList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <!-- 分页 -->
            <div class="page-bar borderRight">
                <i class="el-icon-arrow-left" @click="previousPage"></i>
                <div class="page-center">{{currPage}} / {{pageCount}}</div>
                <i class="el-icon-arrow-right" @click="nextPage"></i>
            </div>
            <!-- 缩放 -->
            <div class="scale-bar">
                <i class="el-icon-minus" @click="setScaleFactor(false)"></i>
                <div class="page-center">{{currScale}}%</div>
                <i class="el-icon-plus" @click="setScaleFactor(true)"></i>
            </div>
        </div>
        <el-tooltip effect="dark" content="新建超级白板" placement="left">
            <img @click="uploadDialogVisible = true" class="superboard-create" src="@/assets/icon/s_create.png" alt="">
        </el-tooltip>
        <el-dialog
            title="选择要共享的内容"
            :visible.sync="uploadDialogVisible"
            center
            top="200px"
            width="30%">
                <div class="createWrap">
                    <el-button @click="createWhiteboardView" style="margin-right: 20px">互动白板</el-button>
                    <el-upload
                        action="customize"
                        :limit="1"
                        :file-list="fileList"
                        :http-request="uploadFile"
                        :show-file-list="false">
                        <el-button type="primary">共享文件</el-button>
                    </el-upload>
                </div>
        </el-dialog>
    </div>
</template>
<script>
import { ZegoSuperBoardManager } from "zego-superboard-web";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
export default {
    mounted() {
        let el = document.querySelector("#superboard-content")
        this.parentDomWidth = el.getBoundingClientRect().width.toFixed()
        this.parentDomHeight = el.getBoundingClientRect().height.toFixed()
        if(this.token) this.loginRoom()
    },
    destroyed() {
        // this.zegoSuperBoard.clear()
        this.logoutRoom()
    },
    
    props: {
        userInfo: {
            type: Object,
            default: {},
        },
    },
    computed: {
        token() {
            return this.userInfo.token
        } 
    },
    watch: {
        token(val) {
            if(val) this.loginRoom()
        }
    },
    data() {
        return {
            parentDomID: "superboard-content", //白板挂载容器
            parentDomWidth: 0, //白板容器设置宽度
            parentDomHeight: 0, //白板容器设置高度
            server: "wss://webliveroom467572390-api.imzego.com/ws",
            zg: null,
            zegoSuperBoard: null, //ZegoSuperBoard 实例
            zegoConfig: {
                fontFamily: 'system', // Superboard SDK 字体
                thumbnailMode: '1', // 缩略图清晰度 1: 普通 2: 标清 3: 高清
                pptStepMode: '1' // PPT 切页模式 1: 正常 2: 不跳转
            },
            fileList: [], //上传文件临时列表
            uploadFileTipsMap: { // 上传状态
                1: '上传中',
                2: '已上传',
                4: '排队中',
                8: '转换中',
                16: '转换成功',
                32: '转换失败',
                64: '取消上传'
            }, 
            loading: false,
            loadingText: "",
            // 白板绘制工具
            toolList: [
                {
                    type: null, //拖拽
                    name: "drag",
                    des: "拖拽"
                },
                {
                    type: "destroy", //销毁当前白板
                    name: "destroy",
                    des: "销毁"
                },
                {
                    type: "clear", //清空当前白板
                    name: "clear",
                    des: "清空"
                },
                {
                    type: "undo", //撤销操作
                    name: "undo",
                    des: "撤销"
                },
                {
                    type: "redo", //重做操作
                    name: "redo",
                    des: "重做"
                },
                {
                    type: 32, //选择
                    name: "select",
                    des: "选择"
                },
                {
                    type: 1, //画笔
                    name: "pen",
                    des: "画笔"
                },
                {
                    type: 2, //文本
                    name: "text",
                    des: "文本"
                },
                {
                    type: undefined, //图形
                    name: "graph",
                    des: "图形"
                },
                {
                    type: 64, //橡皮擦
                    name: "eraser",
                    des: "橡皮擦"
                },
            ],
            colorOptions: ["#000000", "#A4A4A4", "#FFFFFF", "#F9E435", "#FD7821", "#F64326", "#F7666B",
            "#37B142", "#1FE8E0", "#106BF9", "#6E45C5", "#794100"], //笔触颜色
            brushSizeList: [8, 12, 16], //笔触粗细
            pencilSizeList: [18, 24, 36, 48], //字号
            graphList: [
                {name: "line", type: 4}, 
                {name: "circle", type: 16},
                {name: "rect", type: 8},
            ], //默认图形
            currBrushSize: 8, //当前选中笔触粗细
            currBrushColor: "#F64326", //当前选中颜色
            currPencilSize: 18, //当前字号
            currGraph: 4, //当前选中图形-默认直线
            activeTool: "pen", //当前点击的工具-默认画笔
            whiteboardSelectValue: "", //当前白板
            whiteboardIndex: 1, //新建白板标识-名字
            whiteboardList: [], //白板列表
            pptStep: false, //ppt跳步
            thumbShow: false,//缩略图显示
            thumbModal: false,//缩略图弹框
            thumbList: [],//缩略图列表
            sheetList: [], //EXCEL sheet列表
            sheetListSelectValue: "", //当前sheet
            sheetShow: false, //是否显示sheet
            pageCount: 1, //总页数
            currPage: 1,  //当前页
            currScale: 100, //缩放
            uploadDialogVisible: false, //新建白板选择弹框
        };
    },
    methods: {
        /**
         * @description: 根据配置初始化 Express SDK
         */
        initExpressSDKConfig() {
            // 设置日志级别
            this.zg.setLogConfig({
                logLevel: "disable",
            });
            // 关闭 debug
            this.zg.setDebugVerbose(false);
        },

        /**
         * @description: 根据配置初始化 SuperBoard SDK
         */
        initSuperBoardSDKConfig() {
            // 设置字体
            if (this.zegoConfig.fontFamily === "ZgFont") {
                document.getElementById(this.parentDomID).style.fontFamily =
                this.zegoConfig.fontFamily;
            }
            // 设置动态 PPT 步数切页模式
            this.zegoSuperBoard.setCustomizedConfig(
                "pptStepMode",
                this.zegoConfig.pptStepMode
            );
            // 设置缩略图清晰度模式
            this.zegoSuperBoard.setCustomizedConfig(
                "thumbnailMode",
                this.zegoConfig.thumbnailMode
            );
            // 开启自定义光标
            this.zegoSuperBoard.enableCustomCursor(true);
        },
        // 初始化SDK
        async init() {
            this.zg = new ZegoExpressEngine(this.userInfo.appID, this.server);
            // 获取 ZegoSuperBoard 实例
            this.zegoSuperBoard = ZegoSuperBoardManager.getInstance();
            this.zegoSuperBoard.init(this.zg, {
                parentDomID: this.parentDomID, // 需要挂载的父容器 ID
                appID: this.userInfo.appID, // 申请到的 AppID
                userID: this.userInfo.userId, // 用户自定义生成的用户 ID
                token: this.token, // 登录房间需要用于验证身份的 Token
            });
            this.initExpressSDKConfig();
            this.initSuperBoardSDKConfig();
        },
        // 登陆房间
        async loginRoom() {
            if (!this.token) return;
            try {
                await this.init();
                let result = await this.zg.loginRoom(
                "superboard@" + this.userInfo.roomId,
                this.token,
                {
                    userID: this.userInfo.userId,
                    userName: this.userInfo.userId,
                }
                );
                if (result) {
                    this.onSuperBoardEventHandle(); //注册监听事件
                    this.attachActiveView(); //挂载白板
                }
            } catch (err) {
                console.error(err);
                this.$message.error(err);
            }
        },
        /**
         * 退出房间
         */
        logoutRoom(){
            // 退出房间
            this.zg.logoutRoom(this.roomId);
            this.whiteboardList = []
            this.whiteboardSelectValue = ""
            this.pageCount = 1
            this.currPage = 1
            this.currScale = 100
        },



        /**
         * @description: 创建普通白板
         */
        async createWhiteboardView() {
            this.uploadDialogVisible = false
            try {
                this.loadingText = "创建普通白板中"
                this.loading = true

                await this.zegoSuperBoard.createWhiteboardView({
                    name: "普通白板-" + this.whiteboardIndex++,
                    perPageWidth: this.parentDomWidth,
                    perPageHeight: this.parentDomHeight,
                    pageCount: 1 // 默认水平分页
                });


                // 查询、更新页面白板列表，创建成功后白板 SDK 内部会自动渲染
                this.querySuperBoardSubViewListHandle();

                this.loading = false
                // 隐藏打开缩略图弹框的按钮
                this.thumbShow = false
                this.$message.success("创建普通白板成功")
            } catch (errorData) {
                this.loading = false
                this.$message.error(errorData)
            }
        },
        /**
         * @description: 创建文件白板
         * @param {String} fileID 文件 ID
         */
        async createFileView(fileID) {
            try {
                this.loadingText = "创建文件白板中"
                this.loading = true
                await this.zegoSuperBoard.createFileView({
                    fileID
                });
                this.$message.success("创建成功")
                this.loading = false
                // 查询、更新页面白板列表，创建成功后白板 SDK 内部会自动渲染
                this.querySuperBoardSubViewListHandle();

                // 显示、隐藏打开缩略图弹框的按钮
                this.thumbShow = this.hasThumb()
            } catch (errorData) {
                this.loading = false
                this.$message.error(errorData)
            }
        },
        /**
         * @description: 选择静态、动态文件进行上传
         * @param {Number} renderType 渲染模式
         * @param {File} file 文件对象
         */
        uploadFile({file}) {
            this.uploadDialogVisible = false
            console.log(file)
            let type = file.name.split(".")
            type = type[type.length-1].toLocaleLowerCase()
            let renderType = ( type == "ppt"||type == "pptx" ) ? 6 : 3
            if (!file) return;
            //上传文件后转码后渲染模式类型，如果用户涉及到 iOS、Web、Windows、Mac、小程序各端的业务，推荐使用 VectorAndIMG 模式。
            this.zegoSuperBoard
                .uploadFile(file, renderType, (res) => {
                    if(!this.loading) {
                        this.loading = true
                    }
                    this.loadingText = this.uploadFileTipsMap[res.status] + (res.uploadPercent ? res.uploadPercent + '%' : '')
                })
                .then((fileID) =>{

                    this.loading = false

                    //上传成功清空上传列表 
                    this.fileList =[]
                    // 这里上传完成立即创建文件白板，开发者根据实际情况处理
                    this.createFileView(fileID);
                })
                .catch(err => {
                    this.loading = false
                    console.log(err)
                });
        },

        /**
         * @description: 初始化白板工具为画笔
         */
        initToolType() {
            var result = this.zegoSuperBoard.setToolType(1);
            console.warn('SuperBoard Demo initToolType', result);
            // 设置失败，直接返回
            if (!result) {
                this.$message.error("初始化白板工具失败")
            } else {
                // let el = document.querySelector(".tool-list .pencil-text-setting")
                // el.getElementsByTagName("p")[0].classList.add("active")
            }
        },
        /**
         * @description: 返回当前 ZegoSuperBoardSubView
         * @return {ZegoSuperBoardSubView|null}
        */
        getCurrentSuperBoardSubView() {
            var current = null;
            var superBoardView = this.zegoSuperBoard.getSuperBoardView();
            if (superBoardView) {
                current = superBoardView.getCurrentSuperBoardSubView();
            }
            console.warn('SuperBoard Demo getCurrentSuperBoardSubView', current);
            return current;
        },
        /**
         * @description: 判断当前文件是否可以切步，即是否是动态 PPT 文件白板、自定义 H5 白板
         * @description: fileType 为 512、4096 时可以切步
         * @return {Boolearn} true: 可以 false: 不可以
         */
        canJumpStep() {
            var current = this.getCurrentSuperBoardSubView();
            if (current) {
                var model = current.getModel();
                return model.fileType === 512 || model.fileType === 4096;
            } else {
                return false;
            }
        },
        /**
         * @description: 判断当前文件是否有缩略图
         * @description: fileType 为 1、8、512、4096 时存在缩略图
         * @return {Boolearn} true: 有 false: 无
         */
        hasThumb() {
            var current = this.getCurrentSuperBoardSubView();
            if (current) {
                var model = current.getModel();
                return model.fileType === 1 || model.fileType === 8 || model.fileType === 512 || model.fileType === 4096;
            } else {
                return false;
            }
        },


        // --------------------------------
        // ----------分页 start------------------
        // --------------------------------
        /**
         * @description:上一页
         */
        previousPage(){
            var zegoSuperBoardSubView = this.zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
            if (zegoSuperBoardSubView) {
                zegoSuperBoardSubView.flipToPrePage();
                this.currPage = zegoSuperBoardSubView.getCurrentPage();
            }
        },
        /**
         * @description:上一页
         */
        nextPage(){
            var zegoSuperBoardSubView = this.zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
            if (zegoSuperBoardSubView) {
                zegoSuperBoardSubView.flipToNextPage();
                this.currPage = zegoSuperBoardSubView.getCurrentPage();
            }
        },
        // --------------------------------
        // ----------分页 end------------------
        // --------------------------------


        
        /**
         * @description:放大/缩小
         * @param {Boolea} type true-放大，false-缩小
         */
        setScaleFactor(type){
            let step = 0.25
            let targetScale = this.currScale / 100
            if(!type && this.currScale == 100) return //如果已经100%缩小不作操作
            if(type && this.currScale == 300) return //如果已经300%放大不作操作
            if(type){
                targetScale += step
            }else{
                targetScale -= step
            }

            let zegoSuperBoardSubView = this.zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
            if (zegoSuperBoardSubView) {
                zegoSuperBoardSubView.setScaleFactor(targetScale);

                this.currScale = targetScale * 100
            }
        },




        /**
         * @description: 查询、更新页面当前 Excel sheet 列表
         * @return {Number} 当前挂载的 sheet index
         */
        getExcelSheetNameListHandle() {
            var sheetIndex = 0;
            var zegoSuperBoardSubView = this.getCurrentSuperBoardSubView();
            var zegoSuperBoardViewModel = zegoSuperBoardSubView.getModel();

            // 获取当前挂载的 sheetName
            var sheetName = zegoSuperBoardSubView.getCurrentSheetName();
            console.warn('SuperBoard Demo getCurrentSheetName', sheetName);

            // 获取 sheetList
            var zegoExcelSheetNameList = zegoSuperBoardSubView.getExcelSheetNameList();
            console.warn('SuperBoard Demo getExcelSheetNameListHandle', zegoExcelSheetNameList);
            this.sheetList = []
            // 获取当前 sheetName 对应 sheetIndex
            zegoExcelSheetNameList.forEach((element, index) => {
                element === sheetName && (sheetIndex = index);
            // 更新页面当前 Excel sheet 列表
                let obj = {}
                obj.label = element
                obj.value = index
                obj.uniqueID = zegoSuperBoardViewModel.uniqueID
                this.sheetList.push(obj)
            });
            console.warn('SuperBoard Demo getCurrentSheetIndex', sheetIndex);

            // // 更新页面当前选中的 sheet
            this.sheetListSelectValue = sheetIndex

            return sheetIndex;
        },
        /**
         * @description: 更新页面顶部白板列表下拉框选项
         * @param {Array} zegoSuperBoardSubViewModelList 白板列表
         */
        updateWhiteboardListDomHandle(zegoSuperBoardSubViewModelList) {
            let list = []
            zegoSuperBoardSubViewModelList.map(item=>{
                list.push({
                value: item.uniqueID,
                label: item.name
                })
            })
            this.whiteboardList = list
        },
        /**
         * @description: 查询、更新页面白板列表
         * @description: 这里不做渲染白板操作，只是用来更新页面，开发者可根据实际情况处理
         * @return {Object} { uniqueID: xx, sheetIndex: xx } 这里返回查询完成后，当前的 uniqueID，如果是 excel 白板，还返回 sheetIndex
         */
        async querySuperBoardSubViewListHandle() {
            var result = {
                uniqueID: 0,
                sheetIndex: 0
            };
            // 更新页面白板下拉框
            // 获取 model 列表
            var modelList = await this.zegoSuperBoard.querySuperBoardSubViewList();
            console.warn('SuperBoard Demo querySuperBoardSubViewList', modelList);
            this.updateWhiteboardListDomHandle(modelList)

            //  获取当前挂载的白板
            var zegoSuperBoardSubView = this.getCurrentSuperBoardSubView();
            if (zegoSuperBoardSubView) {
                // 当前有挂载白板
                var model = zegoSuperBoardSubView.getModel();
                this.pageCount = zegoSuperBoardSubView.getPageCount();
                this.currPage = zegoSuperBoardSubView.getCurrentPage();
                var uniqueID = model.uniqueID;
                var fileType = model.fileType;
                result.uniqueID = uniqueID;

                // 更新下拉框中当前选中白板
                this.whiteboardSelectValue = uniqueID

                // 判断是否显示页面上的切步按钮
                this.pptStep = this.canJumpStep()
                // 判断是否显示页面上的缩略图按钮
                this.thumbShow = this.hasThumb()
                // // 判断是否需要禁止点击工具
                // roomUtils.toggleDisabledDomHandle(fileType !== 512 && fileType !== 4096);
                if (fileType === 4) {
                    // excel 文件白板显示 sheet 下拉框
                    this.sheetShow = true
                    // 查询 sheet 列表
                    result.sheetIndex = this.getExcelSheetNameListHandle();

                    // 缓存当前 excel 白板 的 sheet
                    this.sheetListSelectValue = result.sheetIndex;
                } else {
                    // 非 excel 白板隐藏 sheet 下拉框
                    this.sheetShow = false
                }
            }else{
                this.whiteboardSelectValue = ""
                this.pageCount = 1
                this.currPage = 1
                this.currScale = 100
                this.sheetShow = false
                this.pptStep = false
                this.thumbShow = false
                this.sheetList = []
                this.sheetListSelectValue = ""
            }
            return result;
        },
        /**
         * @description: 登陆或刷新页面重新获取当前 SuperBoardSubView 并挂载，更新相关数据
         * @description: 需要业务层主动挂载，SDK 内部不会主动挂载当前 SuperBoardSubView
         */
        async attachActiveView() {
            // 查询当前白板列表
            var result = await this.querySuperBoardSubViewListHandle();
            console.warn("SuperBoard Demo attachActiveView", result);
            // 进房自动挂载最新白板
            if (result.uniqueID) {
                var superBoardView = this.zegoSuperBoard.getSuperBoardView();
                if (superBoardView) {
                    try {
                        await superBoardView.switchSuperBoardSubView(
                            result.uniqueID,
                            result.sheetIndex
                        );
                        await superBoardView.switchSuperBoardSubView(result.uniqueID);
                        var curView = superBoardView.getCurrentSuperBoardSubView();
                        var pageCount = curView.getPageCount();
                        var currPage = curView.getCurrentPage();
                        var curViewModel = curView.getModel();
                        console.warn(
                            "SuperBoard Demo attachActiveView",
                            pageCount,
                            currPage
                        );

                        // 缓存当前 excel 白板 的 sheet
                        if (curViewModel.fileType === 4) {
                            this.sheetListSelectValue = result.sheetIndex;
                        }
                        // 初始化白板工具
                        this.initToolType();
                    } catch (errorData) {
                        this.$message.success(errorData);
                    }
                }
            }else { //创建新白板
                // this.createWhiteboardView()
            }
        },

        /**
         * @description: 销毁白板
         * @param {String} type 1: 销毁当前白板 2: 销毁所有白板
         */
        async destroySuperBoardSubView(type) {
            if (type === 1) {
                var zegoSuperBoardSubView = this.getCurrentSuperBoardSubView();
                // 当前没有白板可以被删除
                if (!zegoSuperBoardSubView) return;

                try {
                    this.loadingText = "销毁白板中"
                    this.loading = true

                    await this.zegoSuperBoard.destroySuperBoardSubView(zegoSuperBoardSubView.getModel().uniqueID);
                    console.warn('===demo destroySuperBoardSubView');

                    this.loading = false
                    this.$message.success('销毁当前白板成功')
                    // 查询、更新页面白板列表，销毁成功后白板 SDK 内部会自动删除相关内容，并移除挂载的内容
                    this.querySuperBoardSubViewListHandle();
                } catch (errorData) {
                    this.loading = false
                    this.$message.success(errorData)
                }
            } else {
                try {
                    var modelList = await this.zegoSuperBoard.querySuperBoardSubViewList();
                    for (let index = 0; index < modelList.length; index++) {
                        const model = modelList[index];

                        this.loadingText = '销毁白板 ' + model.name + ' 中'
                        if(!this.loading) this.loading = true

                        console.warn('SuperBoard Demo destroySuperBoardSubView', model.name);
                        await this.zegoSuperBoard.destroySuperBoardSubView(model.uniqueID);
                        console.warn('SuperBoard Demo destroySuperBoardSubView suc', model.name);
                        this.$message.success('销毁白板 ' + model.name + ' 成功') 
                    }

                    this.loading = false
                    // 查询、更新页面白板列表，销毁成功后白板 SDK 内部会自动删除相关内容，并移除挂载的内容
                    this.querySuperBoardSubViewListHandle();
                } catch (errorData) {
                    this.loading = false
                    this.$message.error(errorData)
                }
            }
        },

        // 白板工具---------------

         /**
         * @description: 重置白板工具，在动态 PPT 白板、自定义 H5 白板切换到其他白板时，如何当前是点击工具，主动重置为画笔
         * @description: 这里只展示功能，开发者可根据实际情况设置
         * @param {Number} fileType 文件类型
         */
        resetToolTypeAfterSwitch(fileType) {
            fileType !== 512 && fileType !== 4096 && this.zegoSuperBoard.getToolType() === 256 && this.initToolType();
        },

        // 设置
        /**
         * @description: 设置画笔颜色
         * @param {String} color 画笔颜色
         * @param {Event} event event
         */
        setBrushColor(color){
            this.zegoSuperBoard.setBrushColor(color);
            // 更新页面上当前笔触颜色的样式
            this.currBrushColor = color
        },
        /**
         * @description: 设置画笔粗细
         * @param {Number} brushSize 画笔粗细
         */
        setBrushSize(brushSize){
            this.zegoSuperBoard.setBrushSize(brushSize);
            this.currBrushSize = brushSize
        },
        /**
         * 字号设置
         */
        setFontSize(size){
            this.currPencilSize = size
            this.zegoSuperBoard.setFontSize(size);
        },




        /**
         * @description: 撤销
         */
        undo() {
            var zegoSuperBoardSubView = this.zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
            zegoSuperBoardSubView && zegoSuperBoardSubView.undo();
        },

        /**
         * @description: 重做
         */
        redo() {
            var zegoSuperBoardSubView = this.zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
            zegoSuperBoardSubView && zegoSuperBoardSubView.redo();
        },
        /**
         * @description: 清空所有页
         */
        async clearAllPage() {
            var zegoSuperBoardSubView = this.zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
            zegoSuperBoardSubView && (await zegoSuperBoardSubView.clearAllPage());
        },
        /**
         * @description: 设置工具类型
         * @param {Number} toolType 工具类型
         */
        setToolType(toolType) {
            var zegoSuperBoardSubView = this.zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
            if (!zegoSuperBoardSubView) return;

            if (toolType === 256) {
                // 目标工具类型为 '点击'
                // 非动态 PPT、自定义 H5 不允许使用点击工具
                var zegoSuperBoardSubViewModel = zegoSuperBoardSubView.getModel();
                if (zegoSuperBoardSubViewModel.fileType !== 512 && zegoSuperBoardSubViewModel.fileType !== 4096) return;
            }

            if (toolType !== undefined) {
                // 目标工具类型为拖拽、画笔、选择工具、激光笔、文本、自定义图形、橡皮擦
                var result = this.zegoSuperBoard.setToolType(toolType);
                console.warn('result', result);
                // 设置失败，直接返回
                if (!result) return this.$message.error('设置失败');

                // 图形点击样式
                if(toolType === 8||toolType === 16||toolType === 4){
                    this.currGraph = toolType
                }

                if (toolType === 512) {
                    // 目标工具类型自定义图形
                    // 默认第一个自定义图形
                    if(!this.currCustomGraph){
                        this.setCustomGraph(this.customGraphList[0]);
                    }
                }
            } else {
                // 目标工具类型为 undefined，仅实现业务功能定义，实际 SDK 没有这个类型
                // 这里 toolType 为 undefined 表示是要选择图形: 矩形、椭圆、直线
                // 默认直线
                var result = this.zegoSuperBoard.setToolType(this.currGraph);
                console.warn('result', result);

                // 设置失败，直接返回
                if (!result) return this.$message.error('设置失败');
            }
        },


        // 判断点击的工具按钮是否有选择属性
        isHasTool(item) {
            let arr = ["destroy", "clear", "undo", "redo", "select"]
            if(arr.includes(item.name)) return false
            return true
        },

        // 选择白板工具
        selectTool({ name, type }) {
            if(name == "destroy") { //销毁当前白板
                this.destroySuperBoardSubView(1)
            }else if(name == "clear") { //清空白板
                this.clearAllPage()
            }else if(name == "undo") { //撤销
                this.undo()
            }else if(name == "redo") { //重做
                this.redo()
            }else {
                this.setToolType(type)
                this.activeTool = name
            }
        },



        // 白板分页相关----------
        /**
         * @description: 根据 uniqueID 获取指定 SuperBoardSubViewModel
         * @param {String} uniqueID 白板标识
         * @return {SuperBoardSubViewModel} SuperBoardSubViewModel
         */
        async getSuperBoardSubViewModelByUniqueID(uniqueID) {
            var modelList = await this.zegoSuperBoard.querySuperBoardSubViewList();
            var model;
            modelList.forEach((item) => {
                if (uniqueID === item.uniqueID) {
                    model = item;
                }
            });
            return model;
        },
        /**
         * @description: 根据目标 uniqueID 切换指定白板
         * @param {String} uniqueID uniqueID
         */
        async switchWhitebopardHandle(uniqueID) {
            var model = await this.getSuperBoardSubViewModelByUniqueID(uniqueID);
            var fileType = model.fileType;

            try {

                // 除去 excel 白板，其他白板第二个参数可忽略
                // excel 白板默认切换到第一个 sheet（SDK 内部没有记录上一次的下标）
                await this.zegoSuperBoard
                    .getSuperBoardView()
                    .switchSuperBoardSubView(uniqueID, fileType === 4 ? this.sheetListSelectValue || 0 : undefined);
                // 除去 excel 白板，隐藏页面 sheet 列表
                this.sheetShow = fileType === 4 ? true : false
                // excel 白板，更新页面 sheet 列表
                fileType === 4 && this.getExcelSheetNameListHandle();

                // 判断是否重置画笔工具
                this.resetToolTypeAfterSwitch(fileType);

                // 判断是否需要禁止点击工具
                // roomUtils.toggleDisabledDomHandle(fileType !== 512 && fileType !== 4096);

                // 判断是否显示页面上的切步按钮
                this.pptStep = this.canJumpStep()
                // 判断是否显示页面上的缩略图按钮
                this.thumbShow = this.hasThumb()

                // 更新页面上总页数、当前页
                var zegoSuperBoardSubView = this.getCurrentSuperBoardSubView();
                this.pageCount = zegoSuperBoardSubView.getPageCount();
                this.currPage = zegoSuperBoardSubView.getCurrentPage();

                this.$message.success('切换成功');
            } catch (errorData) {
                console.log(errorData)
                this.$message.error(errorData);
            }
        },
        /**
         * @description: 监听白板 sheet 下拉选择框
         * @description: 获取下拉框当前选中，开发者根据实际情况处理
         */
        async switchSheetListHandle(val){
            // 获取下拉框当前选中的值('uniqueID,sheetIndex')
            let uniqueID, sheetIndex
            uniqueID = this.sheetList[0].uniqueID
            sheetIndex = parseInt(val)
            try {

                await this.zegoSuperBoard.getSuperBoardView().switchSuperBoardSubView(uniqueID, +sheetIndex);

                // 缓存当前 excel 白板 的 sheet
                this.sheetListSelectValue = sheetIndex;

                this.$message.success('切换成功')
            } catch (errorData) {
                this.$message.error(errorData)
            }
        },







        // 监听白板回调
        onSuperBoardEventHandle() {
            // 监听错误回调，SDK 内部错误均通过此回调抛出，除了直接在接口中直接返回的错误外
            this.zegoSuperBoard.on("error", function (errorData) {
                // 错误码，错误提示语
                console.log(errorData.code, errorData.message);
            });

            // 监听白板翻页、滚动
            this.zegoSuperBoard.on(
                "superBoardSubViewScrollChanged",
                (uniqueID, page, step) => {
                // console.warn(
                //     "SuperBoard Demo superBoardSubViewScrollChanged",
                //     ...arguments
                // );
                var zegoSuperBoardSubView = this.getCurrentSuperBoardSubView();
                if (
                    zegoSuperBoardSubView &&
                    zegoSuperBoardSubView.getModel().uniqueID == uniqueID
                ) {
                    // 更新页面内容
                    this.currPage = page;
                }
                }
            );
            // 监听远端白板缩放
            this.zegoSuperBoard.on(
                "superBoardSubViewScaleChanged",
                (uniqueID, scale) => {
                // console.warn(
                //     "SuperBoard Demo uperBoardSubViewScaleChanged",
                //     uniqueID,
                //     scale
                // );
                // roomUtils.updateCurrScaleDomHandle(scale);
                }
            );

            // 监听远端新增白板
            this.zegoSuperBoard.on("remoteSuperBoardSubViewAdded", (uniqueID) => {
                // console.error("uniqueID", uniqueID);
                // console.warn(
                // "SuperBoard Demo remoteSuperBoardSubViewAdded",
                // ...arguments
                // );
                // 查询、更新页面白板列表，新增的白板 SDK 内部不会自动挂载
                this.querySuperBoardSubViewListHandle();
            });

            // 监听远端销毁白板
            this.zegoSuperBoard.on("remoteSuperBoardSubViewRemoved", (uniqueID) => {
                // console.warn(
                // "SuperBoard Demo remoteSuperBoardSubViewRemoved",
                // ...arguments
                // );
                // 查询、更新页面白板列表，销毁的白板 SDK 内部会自动销毁
                this.querySuperBoardSubViewListHandle();
            });

            // 监听远端切换白板
            this.zegoSuperBoard.on("remoteSuperBoardSubViewSwitched", (uniqueID) => {
                // console.warn(
                // "SuperBoard Demo remoteSuperBoardSubViewSwitched",
                // ...arguments
                // );
                // 查询、更新页面白板列表，切换的白板 SDK 内部会自动切换
                this.querySuperBoardSubViewListHandle();
            });

            // 监听远端切换 Excel Sheet
            this.zegoSuperBoard.on(
                "remoteSuperBoardSubViewExcelSwitched",
                (uniqueID, sheetIndex) => {
                // console.warn(
                //     "SuperBoard Demo remoteSuperBoardSubViewExcelSwitched",
                //     ...arguments
                // );
                // 查询、更新页面白板列表，切换的 Excel Sheet SDK 内部会自动切换
                this.querySuperBoardSubViewListHandle();
                }
            );

            // 监听远端白板权限变更
            this.zegoSuperBoard.on("remoteSuperBoardAuthChanged", (data) => {
                console.log(data.scale, data.scroll);
                // console.warn(
                // "SuperBoard Demo remoteSuperBoardAuthChanged",
                // ...arguments
                // );
                // 内部会自动更改为当前权限与对端同步
            });

            // 监听远端白板图元权限变更
            this.zegoSuperBoard.on("remoteSuperBoardGraphicAuthChanged", (data) => {
                // console.warn(
                // "SuperBoard Demo remoteSuperBoardGraphicAuthChanged",
                // ...arguments
                // );
                // 内部会自动更改为当前权限与对端同步
            });
        },
    },
};
</script>
<style lang="scss">
.superboard {
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
    #superboard-content {
        width: 100%;
        height: 100%;
    }
    .superboard-tool{
        max-height: 100%;
        overflow-y: auto;
        padding: 12px 8px;
        background-color: #535353;
        border-radius: 4px;
        position: absolute;
        left: 24px;
        top: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transform: translateY(-50%);
        &>span {
            position: relative;
            display: inline-block;
            &:not(:last-child)::after{
                content: "";
                width: 24px;
                height: 1px;
                position: absolute;
                left: 0;
                bottom: -11px;
                background: #676767;
            }
        }
        &>span:not(:last-child) {
            margin-bottom: 10px;
        }
        &>span:not(:first-child) {
            margin-top: 10px;
        }
        .superboard-tool-item {
            width: 24px;
            height: 24px;
            padding: 4px;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            
            &.active{
                background-color: #3C3C3C;
            }
            &:active{
                background-color: #3C3C3C;
            }
            &:hover{
                cursor: pointer;
            }
            img{
                width: 100%;
                max-height: 20px;
            }
        }
    }


    .superboard-pagination{
        padding: 10px 0;
        background: #535353;
        border-radius: 5px;
        position: absolute;
        top: 10px;
        left: 120px;
        // transform: translateX(-50%);
        display: flex;
        align-items: center;
        .borderRight{
            border-right: 1px solid #676767;
        }
        .el-select {
            width: 140px;
            border-right: 1px solid #676767;
            padding: 0 20px;
            .el-input__inner {
                height: 20px;
                background: transparent;
                border-color: transparent;
                border-radius: 0;
                color: #DFDFDF;
                font-size: 14px;
                line-height: 20px;
                padding-left: 0;
            }
            .el-input__icon {
                line-height: 20px;
            }
        }
        .page-bar,.scale-bar{
            padding: 0 20px;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #DFDFDF;
            i:hover{
                cursor: pointer;
            }
            .page-center{
                margin: 0 20px;
            }
        }
    }

    .superboard-create {
        width: 24px;
        position: absolute;
        right: 20px;
        top: 10px;
        cursor: pointer;
    }
    .createWrap {
        width: 100%;
        display: flex;
        justify-content: center;
    }
}
.el-popover {
    min-width: 80px;
}
.superboard-tool-item-detail{
    width: 80px;
    // height: 200px;
    padding: 0 6px;
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    background: #535353;
    border: none;
    font-size: 12px;
    color: #F0F0F0;
    &.hide{
        display: none;
    }
    &.show{
        display: block;
    }
    h3{
        text-align: center;
        margin: 0;
    }
    .borderBottom {
        border-bottom: 1px solid #676767;
    }
    ul{
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        li{
            list-style: none;
            &.active{
                border: 2px solid #fff;
            }
        }
    }
    ol{
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        li{
            list-style: none;
            &.active{
                background: #3C3C3C;
                border-radius: 5px;
            }
        }
    }
    .tool-color-select {
        padding: 10px 0;
        li{
            width: 16px;
            height: 16px;
            border-radius: 50%;
            margin-top: 10px;
            cursor: pointer;
            &:not(:nth-child(3n)) {
                margin-right: 10px;
            }
        }
    }
    .tool-size-pen {
        padding: 10px 0;
        ul{
            align-items: center;
            margin-top: 10px;
        }
        li{
            border-radius: 50%;
            background: #262626;
            cursor: pointer;
            &:not(:nth-child(3n)) {
                margin-right: 16px;
            }
        }
    }

    .tool-size-font {
        padding: 10px 0;
        .el-select {
            margin-top: 10px;
            .el-input__inner {
                height: 20px;
                background: #3C3C3C;
                border-color: transparent;
                border-radius: 0;
                color: #F0F0F0;
                font-size: 12px;
                line-height: 20px;
                padding-left: 6px;
            }
            .el-input__icon {
                line-height: 20px;
            }
        }
    }

    .tool-graph-select {
        padding: 10px 0;
        ol {
            justify-content: space-between;
        }
        li {
            width: 20px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 10px;
            img{
                width: 12px;
                height: 12px;
            }
        }
    }
}
</style>