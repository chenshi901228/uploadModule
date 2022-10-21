import Cookies from 'js-cookie'
import store from '@/store'

import flvJs from "flv.js" 

/**
 * 权限
 * @param {*} key
 */
export function hasPermission (key) {
  return window.SITE_CONFIG['permissions'].indexOf(key) !== -1 || false
}

/**
 * 获取字典数据列表
 * @param dictType  字典类型
 */
export function getDictDataList (dictType) {
  const type = window.SITE_CONFIG['dictList'].find((element) => (element.dictType === dictType))
  if (type) {
    return type.dataList
  } else {
    return []
  }
}

/**
 * 获取字典名称
 * @param dictType  字典类型
 * @param dictValue  字典值
 */
export function getDictLabel (dictType, dictValue) {
  const type = window.SITE_CONFIG['dictList'].find((element) => (element.dictType === dictType))
  if (type) {
    const val = type.dataList.find((element) => (element.dictValue === dictValue + ''))
    if (val) {
      return val.dictLabel
    } else {
      return dictValue
    }
  } else {
    return dictValue
  }
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  store.commit('resetStore')
  Cookies.remove('access_token')
  window.SITE_CONFIG['dynamicMenuRoutesHasAdded'] = false
}

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 获取svg图标(id)列表
 */
export function getIconList () {
  var res = []
  document.querySelectorAll('svg symbol').forEach(item => {
    res.push(item.id)
  })
  return res
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'pid') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (!temp[data[k][pid]] || data[k][id] === data[k][pid]) {
      res.push(data[k])
      continue
    }
    if (!temp[data[k][pid]]['children']) {
      temp[data[k][pid]]['children'] = []
    }
    temp[data[k][pid]]['children'].push(data[k])
    data[k]['_level'] = (temp[data[k][pid]]._level || 0) + 1
  }
  return res
}


/**
 * 请求参数处理,去掉空和null
 * 
 */
export function httpParams(obj) {
  for(let i in obj){
    if(obj[i] == null || ( obj[i] == "" && Object.prototype.toString.call(obj[i]) != "[object Number]" )){
      delete obj[i]
    }
  }
  return obj
}


/**
 * 视频大小转换
 * 
 */
 export function sizeTostr(size) {
  var data = "";
  if (size < 0.1 * 1024) { //如果小于0.1KB转化成B  
    data = size.toFixed(2) + "B";
  } else if (size < 0.1 * 1024 * 1024) {//如果小于0.1MB转化成KB  
    data = (size / 1024).toFixed(2) + "KB";
  } else if (size < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB  
    data = (size / (1024 * 1024)).toFixed(2) + "MB";
  } else { //其他转化成GB  
    data = (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }
  var sizestr = data + "";
  var len = sizestr.indexOf("\.");
  var dec = sizestr.slice(len + 1, 2);
  if (dec == "00") {//当小数点后为00时 去掉小数部分  
      return sizestr.substring(0, len) + sizestr.slice(len + 3, 2);
  }
  return sizestr;
} 
/**
 * @description: 获取图片的宽高
 * @param: file file对象 
 * 
 */
export function getImageWH(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = e => {
        const img = e.target.result;
        const image = new Image()
        image.src = img
        
        image.onload = _ => {
          resolve({width: image.width, height: image.height})
        }
        image.onerror = _ => {
          console.log(_)
          reject()
        }
    }
  })
}

/**
 * 附件下载
 * 
 */
export function downloadFileUrl(url) {
  return `${window.SITE_CONFIG['apiURL']}/oss/file/downloadNew?access_token=${Cookies.get('access_token')}&fileUrl=${url}`
  // let xhr = new XMLHttpRequest()
  // xhr.open("get", `${window.SITE_CONFIG['apiURL']}/oss/file/downloadNew?access_token=${Cookies.get('access_token')}&fileUrl=${url}`, true)
  // xhr.responseType = 'blob';    // 返回类型blob
  // xhr.onload = function () {
  //   if (xhr.readyState === 4 && xhr.status === 200) {
  //     let blob = this.response;
  //     // 转换一个blob链接
  //     let u = window.URL.createObjectURL(new Blob([blob]));
  //     let a = document.createElement('a');
  //     a.download = name || new Date().getTime() + "";
  //     a.href = u;
  //     a.style.display = 'none'
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //     // 释放
  //     window.URL.revokeObjectURL(u);
  //   }
  // };
  // xhr.onerror = function(){
  //   console.log('失败');
  // }
  // xhr.send()
}
// 获取视频时长
export function getVideoDuration(url) {
  let type = url.split(".")
  type = type[type.length - 1].toLocaleLowerCase()
  if(type == "mp4") {
    return new Promise((resolve, reject) => {
      let audio = new Audio(downloadFileUrl(url))
      audio.muted = true
      audio.addEventListener("loadedmetadata", () => {
        resolve(audio.duration || 0)
      })
      audio.muted = false
    })
  }
  if(type == "flv") {
    return new Promise((resolve, reject) => {
      let video = document.createElement("video")
      let flvPlayer
      if(flvJs.isSupported()) {
        flvPlayer = flvJs.createPlayer({
          type: 'flv',
          url: downloadFileUrl(url)
        });
        flvPlayer.attachMediaElement(video);
        flvPlayer.load();
        flvPlayer.on(flvJs.Events.MEDIA_INFO, (e)=>{
          resolve(e.duration / 1000 || 0)
          video.remove()
        })
      }
    })
  }
}


// 秒转00：00：00
export function secondToDate(value) {
  let theTime = parseInt(value);// 秒
  let middle = 0;// 分
  let hour = 0;// 小时

  if(theTime >= 60) {
    middle = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if(middle >= 60) {
        hour = parseInt(middle / 60);
        middle = parseInt(middle % 60);
    }
  }
  let result = parseInt(theTime) < 10 ? `0${parseInt(theTime)}` : parseInt(theTime) + "" ;
  if(middle > 0) {
    result = (parseInt(middle) < 10 ? `0${parseInt(middle)}` : parseInt(middle)) + ":" + result;
  }else {
    result = "00" + ":" + result;
  }
  if(hour > 0) {
    result = (parseInt(hour) < 10 ? `0${parseInt(hour)}` : parseInt(hour)) + ":" + result;
  }else {
    result = "00" + ":" + result;
  }
  return result;
}


// 身份证号码加密
export function enCodeIdCard(idCard) {
  if(!idCard) return ""
  idCard += ""
  return idCard.replace(/(.{6}).*(.{4})/, '$1********$2')
}

// 数字处理-返回string，m-源数字，sign-前缀符号，n-小数位
export function numberConvert(m, sign = "￥", n = 2) {
  if(Object.prototype.toString.call(m) == "[object Number]") {
    return m == 0 ? m : sign + m.toFixed(n)
  }else if(m == null){
    return "--"
  }else {
    return ""
  }
}
// 数量转换：超过1万，显示x.x万
export function numberChange(num, unit = "万") {
    if(num == null) num = 0
    num = Number(num)
    return (num / 10000) > 1 ? parseFloat((num / 10000)).toFixed(1) + unit :  num;
}

