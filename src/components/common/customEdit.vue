<!-- 自定义编辑器组件 -->
<template>
    <div :style="{...mainStyle}">
        <Toolbar
            :style="{width: '100%', borderBottom: '1px solid #ccc', ...toolStyle}"
            :editor="editor"
            :defaultConfig="toolbarConfig"
            :mode="mode"
        />
        <Editor
            :style="{width: '100%', overflowY: 'hidden', ...editorStyle}"
            v-model="html"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
            @onChange="onChange"
        />
    </div>
</template>
<script>
import Cookies from "js-cookie";
import { getImageWH } from "@/utils/index";
import "@wangeditor/editor/dist/css/style.css";
// 获取工具栏配置--DomEditor.getToolbar(editor)
import { DomEditor } from '@wangeditor/editor'
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
export default {
    components: {
        Editor,
        Toolbar,
    },
    props: {
        // 外层容器style
        mainStyle: {
            type: Object,
            default: () => {
                return {
                    width: "1000px",
                    border: "1px solid #ccc"
                }
            }
        },
        // 工具栏style
        toolStyle: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 编辑区域style
        editorStyle: {
            type: Object,
            default: () => {
                return {
                    height: "400px"
                }
            }
        },
    },
    data() {
        const _this = this;
        // 自定义校验图片
        function customCheckImageFn(src, alt, url){
            console.log(src)
            if (!src) {
                return
            }
            if (src.indexOf('http') !== 0) {
                _this.$message.error('图片网址必须以 http/https 开头');
                return undefined
            }
            return true

            // 返回值有三种选择：
            // 1. 返回 true ，说明检查通过，编辑器将正常插入图片
            // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
            // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入。但不会提示任何信息
        };
        // 转换图片链接
        function customParseImageSrc(src) {
            
            return src
        };
        // 自定义校验视频
        function customCheckVideoFn(src) {
            if (!src) {
                return
            }
            if (src.indexOf('http') !== 0) {
                _this.$message.error('视频地址必须以 http/https 开头');
                return undefined
            }
            return true

            // 返回值有三种选择：
            // 1. 返回 true ，说明检查通过，编辑器将正常插入视频
            // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
            // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入。但不会提示任何信息
        };
        // 自定义转换视频
        function customParseVideoSrc(src) {
            return src
        };
        // 插入图片
        const insertImageHandle = {
            onInsertedImage(imageNode) {
                if (imageNode == null) return

                const { src, alt, url, href } = imageNode
                console.log('inserted image', src, alt, url, href)
            },
            checkImage: customCheckImageFn, // 也支持 async 函数
            parseImageSrc: customParseImageSrc, // 也支持 async 函数
        };
        // 插入视频
        const insertVideoHandle = {
            onInsertedVideo(videoNode) {
                if (videoNode == null) return

                const { src } = videoNode
                console.log('inserted video', src)
            },
            checkVideo: customCheckVideoFn, // 也支持 async 函数
            parseVideoSrc: customParseVideoSrc, // 也支持 async 函数
        }
        // 自定义图片上传方法
        const uploadImageHandle = {
            server: `${window.SITE_CONFIG["apiURL"]}/oss/file/upload?token=${Cookies.get("access_token")}`,
            // form-data fieldName ，默认值 'wangeditor-uploaded-image'
            fieldName: "file",

            // 单个文件的最大体积限制，默认为 2M
            maxFileSize: _this.imageUploadSize * 1024 * 1024, // 1M

            // 最多可上传几个文件，默认为 100
            maxNumberOfFiles: 2,

            // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
            allowedFileTypes: ["image/*"],

            // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
            // meta: {
            //     token: 'xxx',
            //     otherKey: 'yyy'
            // },

            // 将 meta 拼接到 url 参数中，默认 false
            metaWithUrl: false,

            // 自定义增加 http  header
            // headers: {
            //     Accept: 'text/x-json',
            //     otherKey: 'xxx'
            // },

            // 跨域是否传递 cookie ，默认为 false
            withCredentials: true,

            // 超时时间，默认为 10 秒
            timeout: 5 * 1000, // 5 秒
            // 自定义插入图片
            customInsert(res, insertFn) {
                // res 即服务端的返回结果
                if (_this.uploading) {
                    _this.uploading.close();
                    _this.uploading = null;
                }
                // 从 res 中找到 url alt href ，然后插图图片
                insertFn(res.data.url)
            },
            // 上传之前触发
            onBeforeUpload(file) {
                // 获取key
                let key = Object.keys(file)[0]
                // file 选中的文件，格式如 { key: file }
                if (file[key].data.size / 1024 / 1024 > _this.imageUploadSize) {
                    _this.$message.error(`上传图片大小不能超过${_this.imageUploadSize}M`);
                    return Promise.reject(false);
                }
                _this.uploading = _this.$loading({
                    lock: true,
                    text: "附件上传中",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                return file;
                // 可以 return
                // 1. return file 或者 new 一个 file ，接下来将上传
                // 2. return false ，不上传这个 file
            },
            // 上传进度的回调函数
            onProgress(progress) {
                // progress 是 0-100 的数字
                console.log('progress', progress)
            },
            // 单个文件上传成功之后
            onSuccess(file, res) {
                console.log(file,res)
                if (_this.uploading) {
                    _this.uploading.close();
                    _this.uploading = null;
                }
            },
            // 单个文件上传失败
            onFailed(file, res) {
                _this.$message.error(`${file.name} 上传失败,${res.msg}`);
                if (_this.uploading) {
                    _this.uploading.close();
                    _this.uploading = null;
                }
            },
            // 上传错误，或者触发 timeout 超时
            onError(file, err, res) {
                _this.$message.error(`${file.name} 上传出错,${err}`);
                if (_this.uploading) {
                    _this.uploading.close();
                    _this.uploading = null;
                }
            },
        };
        // 自定义视频上传方法
        const uploadVideoHandle = {
            server: `${window.SITE_CONFIG["apiURL"]}/oss/file/upload?token=${Cookies.get("access_token")}`,
            // form-data fieldName ，默认值 'wangeditor-uploaded-video'
            fieldName: "file",

            // 单个文件的最大体积限制，默认为 10M
            maxFileSize: _this.videoUploadSize * 1024 * 1024,

            // 最多可上传几个文件，默认为 5
            maxNumberOfFiles: 1,

            // 选择文件时的类型限制，默认为 ['video/*'] 。如不想限制，则设置为 []
            allowedFileTypes: ["video/mp4"],

            // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
            // meta: {
            //     token: 'xxx',
            //     otherKey: 'yyy'
            // },

            // 将 meta 拼接到 url 参数中，默认 false
            metaWithUrl: false,

            // 自定义增加 http  header
            // headers: {
            //     Accept: 'text/x-json',
            //     otherKey: 'xxx'
            // },

            // 跨域是否传递 cookie ，默认为 false
            withCredentials: true,

            // 超时时间，默认为 30 秒
            timeout: 15 * 1000, // 15 秒
            // 自定义插入视频
            customInsert(res, insertFn) {
                // res 即服务端的返回结果
                if (_this.uploading) {
                    _this.uploading.close();
                    _this.uploading = null;
                }
                // 从 res 中找到 url ，然后插入视频
                insertFn(res.data.url);
            },
            // 上传之前触发
            onBeforeUpload(file) {
                // 获取key
                let key = Object.keys(file)[0]
                // file 选中的文件，格式如 { key: file }
                if (file[key].data.size / 1024 / 1024 > _this.videoUploadSize) {
                    _this.$message.error(`上传视频大小不能超过${_this.videoUploadSize}M`);
                    return Promise.reject(false);
                }

                _this.uploading = _this.$loading({
                    lock: true,
                    text: "附件上传中",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                return file;
                // 可以 return
                // 1. return file 或者 new 一个 file ，接下来将上传
                // 2. return false ，不上传这个 file
            },
            // 单个文件上传成功之后
            onSuccess(file, res) {
                if (_this.uploading) {
                    _this.uploading.close();
                    _this.uploading = null;
                }
            },
            // 单个文件上传失败
            onFailed(file, res) {
                _this.$message.error(`${file.name} 上传失败,${res.msg}`);
                if (_this.uploading) {
                    _this.uploading.close();
                    _this.uploading = null;
                }
            },
            // 上传错误，或者触发 timeout 超时
            onError(file, err, res) {
                _this.$message.error(`${file.name} 上传出错,${err}`);
                if (_this.uploading) {
                    _this.uploading.close();
                    _this.uploading = null;
                }
            },
        };
        return {
            editor: null,
            html: "<p><br></p>",
            toolbarConfig: {
                excludeKeys: ["fullScreen", "blockquote", "emotion", "insertLink", "insertTable", "codeBlock", "todo","fontFamily"], //去掉不需要的功能
            },
            editorConfig: {
                placeholder: "请输入内容",
                MENU_CONF: {
                    uploadImage: uploadImageHandle, //图片上传配置
                    insertImage: insertImageHandle, //图片插入配置
                    uploadVideo: uploadVideoHandle, //视频上传配置
                    insertVideo: insertVideoHandle, //视频插入配置
                },
            },
            mode: "default", // or 'simple'
            videoUploadSize: 10, //视频上传大小限制
            imageUploadSize: 2, //图片上传大小限制
            uploading: null, //上传状态
            timer: null,
        };
    },
    destroyed() {
        if (this.editor == null) return
        this.editor.destroy() // 组件销毁时，及时销毁编辑器
    },
    methods: {
        onCreated(editor) {
            this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
        },
        // 编辑内容改变
        onChange(editor) {
            this.$emit("editChange", editor.getHtml())
        },
        // 设置编辑器内容
        setHTML(val) {
            this.editor.setHtml(val)
        },
        // 设置只读
        setReadOnly() {
            this.editor.disable()
        },
        // 获取当前编辑器内容
        getHTML() {
            let res = this.editor.getHtml()
            if(res == "<p><br></p>") return ""
            return res
        },
        // 清空编辑器
        resetHtml() {
            this.editor.setHtml('<p><br></p>')
        }
    },
};
</script>