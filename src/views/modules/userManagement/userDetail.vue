<template>
  <div>
    <div class="diaBox">
      <div class="diaBoxLeft">
        <div class="diaBoxLeft_title" style="font-size: 14px;font-weight: bold;color: #4057CB;">基本信息</div>
        <div class="diaBoxLeft_mes">
          <el-avatar :size="110" :src="diaForm.avatarUrl" fit="cover" style="margin: 0px auto 30px;display: block;">
          </el-avatar>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">用户昵称</div>
            <div>{{ diaForm.nickName || '-' }}</div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">手机号码</div>
            <div>
              {{ diaForm.phone || '-' }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">是否认证</div>
            <div>
              {{ diaForm.legalizeFlg === 1 ? "是" : "否" }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">是否指导师</div>
            <div>
              {{ diaForm.tutorFlg === 1 ? "是" : "否" }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">邀请注册</div>
            <div>
              {{ diaForm.inviteNum || 0 }}人
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">TA邀请人</div>
            <div>
              {{ diaForm.inviteUserName || '-' }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">注册时间</div>
            <div>
              {{ diaForm.createDate || '-' }}
            </div>
          </div>

        </div>
        <div class="diaBoxLeft_title" style="font-size: 14px;font-weight: bold;color: #4057CB;">种子账户</div>
        <div class="diaBoxLeft_mes">
          <div class="box">
            <div style="margin:0 20px">
              <img src="../../../assets/img/icon333.png" alt="">
            </div>
            <div>
               <div style="display:flex;align-items: center;"> <img src="../../../assets/img/icon777.png" alt="" style="    margin: -8px 5px 0 -8px;">{{ diaForm.priceBalance ? diaForm.priceBalance : 0 }}</div>
     
              <div>可用种子</div>
            </div>
          </div>
        </div>
        <div class="diaBoxLeft_title" style="font-size: 14px;font-weight: bold;color: #4057CB;">消费数据</div>
        <div class="diaBoxLeft_mes" style="display: flex; flex-wrap: wrap;">
          <div class="box">
            <div style="margin:0 20px">
              <img src="../../../assets/img/icon111.png" alt="">
            </div>
            <div>
              <div>￥{{
                  diaForm.priceConsumption ? diaForm.priceConsumption : 0
              }}</div>
              <div> 累计消费</div>
            </div>
          </div>
          <div class="box">
            <div style="margin:0 20px">
              <img src="../../../assets/img/icon222.png" alt="">
            </div>
            <div>
              <div>￥{{
                 diaForm.priceRecharge ? diaForm.priceRecharge : 0
              }}</div>
              <div> 累计充值</div>
            </div>
          </div>
            <div class="box">
            <div style="margin:0 20px">
              <img src="../../../assets/img/icon666.png" alt="">
            </div>
            <div>
              <div>￥{{
                 diaForm.shoppingConsumption || 0
              }}</div>
              <div> 商品消费</div>
            </div>
          </div>
            <div class="box">
            <div style="margin:0 20px">
              <img src="../../../assets/img/icon444.png" alt="">
            </div>
            <div>
              <div style="display:flex;align-items: center;"> <img src="../../../assets/img/icon777.png" alt="" style="    margin: -8px 5px 0 -8px;">{{ diaForm.giftConsumption || 0 }}</div>
              <div> 礼物消费</div>
            </div>
          </div>
            <div class="box">
            <div style="margin:0 20px">
              <img src="../../../assets/img/icon555.png" alt="">
            </div>
            <div>
              <div style="display:flex;align-items: center;"> <img src="../../../assets/img/icon777.png" alt="" style="    margin: -8px 5px 0 -8px;">{{ diaForm.fansConsumption || 0 }}</div>
              <div> 加入粉丝团消费</div>
            </div>
          </div>
          
         
        </div>
      </div>
      <div class="diaBoxRight">
        <div style="display: flex;border-bottom: 2px solid #E4E7ED;">
          <el-tooltip effect="dark" content="充值记录" placement="top">
            <div class="diaBoxRight_tabBtns" @click="changeTbas(1)" :class="{ 'is-active': diaTbas === 1 }">
              充值记录
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="礼物记录" placement="top">
            <div class="diaBoxRight_tabBtns" @click="changeTbas(2)" :class="{ 'is-active': diaTbas === 2 }">
              礼物记录
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="商品记录" placement="top">
            <div class="diaBoxRight_tabBtns" @click="changeTbas(3)" :class="{ 'is-active': diaTbas === 3 }">
              商品记录
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="书籍记录" placement="top">
            <div class="diaBoxRight_tabBtns" @click="changeTbas(6)" :class="{ 'is-active': diaTbas === 6 }">
              书籍记录
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="粉丝团消费" placement="top">
            <div class="diaBoxRight_tabBtns" @click="changeTbas(5)" :class="{ 'is-active': diaTbas === 5 }">
              粉丝团消费
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="加入粉丝团" placement="top">
            <div class="diaBoxRight_tabBtns" @click="changeTbas(4)" :class="{ 'is-active': diaTbas === 4 }">
              加入粉丝团
            </div>
          </el-tooltip>
        </div>
        <el-form :inline="true" :style="{ margin: '20px 0' }" :model="diaSearchForm" @keyup.enter.native="queryPost_dia()"
          size="small" ref="searchForm" label-width="100px">
          <el-form-item label="支付方式" v-if="diaTbas === 1 && (isOpen || formItemCount > 1)" prop="payType">
            <el-select style="width: 180px" placeholder="请选择" v-model="diaSearchForm.payType" clearable>
              <el-option :value="1" label="微信"></el-option>
              <el-option :value="2" label="支付宝"></el-option>
              <el-option :value="3" label="人工充值"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="充值来源" v-if="diaTbas === 1 && (isOpen || formItemCount > 2)" prop="paySource">
            <el-select style="width: 180px" placeholder="请选择" v-model="diaSearchForm.paySource" clearable>
              <el-option :value="1" label="小程序端"></el-option>
              <el-option :value="2" label="大于众学"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="礼物" v-if="diaTbas === 2 && (isOpen || formItemCount >= 1)" prop="name">
            <el-input style="width: 180px" placeholder="请输入" v-model="diaSearchForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="消费来源" v-if="diaTbas === 2 &&( isOpen || formItemCount > 2)" prop="paySource">
            <el-select style="width: 180px" placeholder="请输入" v-model="diaSearchForm.paySource" clearable>
              <el-option :value="1" label="小程序端"></el-option>
              <el-option :value="2" label="大于众学"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="直播主题" v-if="diaTbas === 2 && (isOpen || formItemCount >= 3)">
            <el-input style="width: 180px" placeholder="请输入" v-model="diaSearchForm.liveTheme" clearable></el-input>
          </el-form-item>
          <el-form-item label="直播间ID" v-if="diaTbas === 2 && ( isOpen || formItemCount >= 4)">
            <el-input style="width: 180px" placeholder="请输入" v-model="diaSearchForm.liveId" clearable></el-input>
          </el-form-item>
          <el-form-item label="粉丝团名称" v-if="(diaTbas === 4 || diaTbas === 5) && (isOpen || formItemCount > 1)" prop="title">
            <el-input style="width: 180px" placeholder="请输入" v-model="diaSearchForm.title" clearable></el-input>
          </el-form-item>
          <el-form-item label="主播昵称" v-if="(diaTbas === 4 || diaTbas === 5) && (isOpen || formItemCount > 2)" prop="anchorName">
            <el-input style="width: 180px" placeholder="请输入" v-model="diaSearchForm.anchorName" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号码" v-if="(diaTbas === 4 || diaTbas === 5) && (isOpen || formItemCount > 3)" prop="phone">
            <el-input style="width: 180px" placeholder="请输入" v-model="diaSearchForm.phone" clearable></el-input>
          </el-form-item>
          <el-form-item label="订单编号" v-if="(diaTbas === 3 || diaTbas === 6) && (isOpen || formItemCount >= 1)" prop="id">
            <el-input style="width: 180px" placeholder="请输入" v-model="diaSearchForm.id" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品名称" v-if="diaTbas === 3 && (isOpen || formItemCount > 2)" prop="productName">
            <el-input style="width: 180px" placeholder="请输入" v-model="diaSearchForm.productName" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品类型" v-if="diaTbas === 3 && (isOpen || formItemCount >= 3)" prop="productType">
            <el-select @visible-change="getProductType" style="width: 180px" v-model="diaSearchForm.productType"
              placeholder="请选择" clearable>
              <el-option v-for="item in productTypeOptions" :key="item.productType" :value="item.productType"
                :label="item.productType"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否免费" v-if="diaTbas === 3 && (isOpen || formItemCount >= 4)" prop="isFree">
            <el-select style="width: 180px" placeholder="请选择" v-model="diaSearchForm.isFree" clearable>
              <el-option :value="0" label="否"></el-option>
              <el-option :value="1" label="是"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单状态" v-if="diaTbas === 6 && (isOpen || formItemCount >= 3)" prop="status">
            <el-select style="width: 180px" placeholder="请选择" v-model="diaSearchForm.status" clearable>
              <el-option :value="-1" label="待支付"></el-option>
              <el-option :value="1" label="已支付"></el-option>
              <el-option :value="2" label="已完成"></el-option>
              <el-option :value="3" label="退款中"></el-option>
              <el-option :value="4" label="已退款"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物流单号" v-if="diaTbas === 6 && (isOpen || formItemCount >= 4)" prop="courierNumber">
            <el-input style="width: 180px" placeholder="请输入" v-model="diaSearchForm.courierNumber" clearable></el-input>
          </el-form-item>
          <el-form-item label="物流状态" v-if="diaTbas === 6 && (isOpen || formItemCount >= 6)" prop="logisticsStatus">
            <el-select style="width: 180px" placeholder="请选择" v-model="diaSearchForm.logisticsStatus" clearable>
              <el-option :value="0" label="待发货"></el-option>
              <el-option :value="1" label="待收货"></el-option>
              <el-option :value="2" label="已收货"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联商品编号" v-if="(diaTbas === 3 || diaTbas === 6) && (isOpen || formItemCount > 5)" prop="linkedProductId">
            <el-input style="width: 180px" placeholder="请输入" v-model="diaSearchForm.linkedProductId" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="使用状态" v-if="diaTbas === 3 && (isOpen || formItemCount >= 6)" prop="useStatus">
            <el-select style="width: 180px" placeholder="请选择" v-model="diaSearchForm.useStatus" clearable>
              <el-option :value="0" label="未使用"></el-option>
              <el-option :value="1" label="已使用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="queryChaxun()">{{ $t("query") }}
            </el-button>
            <el-button size="mini" icon="el-icon-refresh" @click="mainReset">重置</el-button>
            <el-button size="mini" plain @click="open">
            <i :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              {{ isOpen ? "收起" : "展开" }}
            </el-button>
          </el-form-item>
        
          <div>
            <el-button size="mini"  v-if="diaTbas === 1" plain  @click="rechargeBtn" type="primary">充值</el-button>
          </div>

          <!-- 操作按钮 -->
          <div class="headerTool-handle-btns">
            <div class="headerTool--handle-btns-left">
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
        <el-table :data="diaDataList" v-loading="dataListLoading" ref="table"
          height="calc(calc(100vh - 50px - 36px - 30px - 45px - 90px - 47px) - 70px)">
          <template v-for="(label, prop) in diaTableTitle">
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              show-overflow-tooltip v-if="prop === 'paySource'">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.paySource === 1 ? "小程序端" : "大于众学" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              show-overflow-tooltip v-else-if="prop === 'payTypeUnit'">
              <template>
                <div>种子</div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              show-overflow-tooltip v-else-if="prop === 'payType' && diaTbas != 3 && diaTbas != 6 && diaTbas != 1">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.payType === 1 ? "种子" : '-'}}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              show-overflow-tooltip v-else-if="prop === 'payType' && diaTbas == 1">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.payType === 1 ? "微信" : scope.row.payType === 3 ? "人工充值" : '支付宝'}}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              show-overflow-tooltip v-else-if="prop === 'status' && diaTbas == 1">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.status === 1 ? "充值成功" : scope.row.status === -1 ? "已作废" : '充值失败'}}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              show-overflow-tooltip v-else-if="prop === 'userType'">
              <template slot-scope="scope">
                <div>
                  {{
                      scope.row.userType === 0
                        ? "普通用户"
                        : scope.row.userType === 1
                          ? "助手"
                          : "-"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              show-overflow-tooltip v-else-if="prop === 'shareType'">
              <template slot-scope="scope">
                <div>
                  {{
                      scope.row.shareType === 0
                        ? "预告分享"
                        : scope.row.shareType === 1
                          ? "直播邀请"
                          : scope.row.shareType === 2
                            ? "视频分享"
                            : "其他分享"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              show-overflow-tooltip v-else-if="prop === 'isFree'">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.isFree === 0 ? "否" : "是" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              show-overflow-tooltip v-else-if="prop === 'activeStatus'">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.activeStatus ? "已自用" : "未自用" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              show-overflow-tooltip v-else-if="prop === 'useStatus'">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.useStatus === 0 ? "未使用" : "已使用" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'productImage'">
              <template slot-scope="scope">
                <img :src="scope.row.productImage" style="width: 75px; height: 50px" alt="" />
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'shareState'" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.shareState === 0 ? "失败" : "成功" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'successEvent'" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  {{
                      scope.row.successEvent === 0
                        ? "新人注册"
                        : scope.row.successEvent === 1
                          ? "进入直播"
                          : scope.row.successEvent === 2
                            ? "预约直播"
                            : "观看视频"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'logisticsStatus'" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.refundStatus!=1">
                  {{
                      scope.row.logisticsStatus === 0
                        ? "待发货"
                        : scope.row.logisticsStatus === 1
                          ? "待收货"
                          : scope.row.logisticsStatus === 2
                            ? "已收货"
                            : "-"
                  }}
                </div>
                <div v-else>-</div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'liveId'" show-overflow-tooltip min-width="300">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.liveId}}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'createDate'" show-overflow-tooltip min-width="200">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.createDate}}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="120" :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'payPrice' && diaTbas===3">
              <template slot-scope="{ row }">
                <span v-if="row.statusStr && row.statusStr != '待支付'">{{ row.payPrice }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column width="120" :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'realPrice' && diaTbas===3">
              <template slot-scope="{ row }">
                <span v-if="row.statusStr && row.statusStr != '待支付'">{{ row.realPrice }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              min-width="120" show-overflow-tooltip v-else>
            </el-table-column>
            
          </template>
          <el-table-column v-if="diaTbas === 1 || diaTbas === 3 || diaTbas === 6" :label="$t('handle')" fixed="right" width="180px"
            header-align="center" align="center">
            <template slot-scope="scope">
              <el-button v-if="(diaTbas === 3 || diaTbas === 6) && scope.row.status == 1 || scope.row.status == 2" type="text" icon="el-icon-edit-outline"
                size="small" @click="applyRefund(scope.row)">申请退款</el-button>
              <el-button v-if="diaTbas === 3 " type="text" icon="el-icon-edit-outline"
                size="small" @click="applyInfo(scope.row)">查看明细</el-button>
              <el-button v-if="diaTbas === 1  && scope.row.payType==3 && scope.row.status != -1" type="text" icon="el-icon-circle-close"
                size="small" @click="cancelMoney(scope.row)">作废</el-button>
              <el-button v-if="diaTbas === 1 && scope.row.payType==3" type="text" icon="el-icon-edit-outline"
                size="small" @click="infoMoney(scope.row)">查看备注</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="page_dia" :page-sizes="[10, 20, 50, 100]" :page-size="limit_dia"
          :total="total_dia" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle_dia"
          @current-change="pageCurrentChangeHandle_dia">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="申请退款" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false"
      @close="closeRefundDialog" width="30%">
      <div class="dialog" style="display:flex;">
        <p style="width:80px; margin:0">退款原因</p>
        <el-input type="textarea" maxlength="150" show-word-limit :rows="6" placeholder="请输入" v-model="refundReason">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button :disabled="refundLoading" :loading="refundLoading" size="small" type="primary"
          @click="confirmHandle">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="订单详情" class="applyInfo" :visible.sync="applyInfoVisible" :close-on-click-modal="false" :close-on-press-escape="false"
      @close="closeApplyInfoialog" width="80%">
      <el-descriptions style="margin:20px 0 30px 0;font-size:24px"  :column="2" size="small" border>
          <el-descriptions-item>
              <template slot="label">
                  订单编号
              </template>
              {{applyForm.id}}
          </el-descriptions-item>
          <el-descriptions-item>
              <template slot="label">
                  商品名称
              </template>
             {{applyForm.productName}}
          </el-descriptions-item>
          <el-descriptions-item>
              <template slot="label">
                  应付金额
              </template>
              {{applyForm.price}}
          </el-descriptions-item>
          <el-descriptions-item>
              <template slot="label">
                  下单时间
              </template>
              {{applyForm.createDate || "-" }}
          </el-descriptions-item>
      </el-descriptions>

      <el-descriptions style="bordr:1px solid #f60" :contentStyle="rowCenter" :labelStyle="rowCenter" title="" direction="vertical" :column="6" border>
          <el-descriptions-item label="资金形式">现金</el-descriptions-item>
          <el-descriptions-item label="支付渠道">{{applyForm.payType}}</el-descriptions-item>
          <el-descriptions-item label="支付金额">{{applyForm.payPrice}}</el-descriptions-item>
          <el-descriptions-item label="支付状态">{{applyForm.payStatus==1 ? '已支付' : '待支付'}}</el-descriptions-item>
          <el-descriptions-item label="支付时间">{{applyForm.createDate}}</el-descriptions-item>
          <el-descriptions-item label="第三方流水单号">{{applyForm.orderId}}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog title="充值" :visible.sync="dialogRecharge" width="600px" top="100px">
        <div>
          <span style="width:80px">
            种子数量：
          </span>
          <el-input-number @blur="rechargeBlur()" step-strictly :step="1" v-model="rechargePrice" :min="1" :controls="false" label="请输入"></el-input-number>
        </div>
        <div style="display:flex;margin-top:20px">
          <span style="width:80px;">备注：</span>
          <el-input type="textarea"
              maxlength="150"
              show-word-limit
              :rows="6"
              placeholder="请输入备注"
              v-model="rechargeRemark">
          </el-input>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogRecharge = false">取消</el-button>
        <el-button size="small" type="primary" @click="rechargeAdd">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="rechargeType=='edit' ? '作废' : '查看备注'" :visible.sync="dialogRechargeRemove" width="600px" top="100px">
        <div style="display:flex;margin-top:20px">
          <span style="width:80px;">备注：</span>
          <el-input v-if="rechargeType=='edit'" type="textarea"
              maxlength="150"
              show-word-limit
              :rows="6"
              placeholder="请输入备注"
              v-model="rechargeRemark">
          </el-input>
          <span v-else>{{rechargeRemark}}</span>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="rechargeType=='edit'" size="small" @click="dialogRechargeRemove = false">取消</el-button>
        <el-button v-if="rechargeType=='edit'" size="small" type="primary" @click="rechargeRemove">确定</el-button>
        <el-button v-else size="small" type="primary" @click="dialogRechargeRemove = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUUID } from "@/utils";
import mixinViewModule from "@/mixins/view-module";
export default {
  name: "LiveWebmanageUserdetail",
  mixins: [mixinViewModule],
  data() {
    return {
      dialogVisible: false,
      applyInfoVisible:false,
      userId: "",
      diaForm: {},
      diaTbas: 1,
      diaSearchForm: {
        payType: "",
        paySource: "",
        name: "",
        title: "",
        anchorName: "",
        phone: "",
      },
      diaDataList: [],
      dataListLoading: false,
      diaTableTitle: {
        price: "充值种子",
        amount: "支付金额",
        payType: "支付方式",
        paySource: "充值来源",
        createDate: "充值时间",
      },
      page_dia: 1, // 当前页码
      limit_dia: 10, // 每页数
      total_dia: 0,
      productTypeOptions: [], //商品类型下拉选项
      refundReason: "",
      refundLoading: false,
      applyForm:{},//商品记录-查看明细
      rowCenter:{
        "text-align":"center",
      },

      //充值
      dialogRecharge:false,
      rechargePrice:1,
      rechargeRemark:"",
      dialogRechargeRemove:false,
      rechargeType:'edit',
      orderId:'',
    };
  },

  activated() {
    this.diaTbas=Number(sessionStorage.getItem("changeTbasUser"))
    this.userId = JSON.parse(window.localStorage.getItem("userDetailData")).id;
    this.$http
      .get(
        `/sys/manage/userDetail/${JSON.parse(window.localStorage.getItem("userDetailData")).id
        }`
      )
      .then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.diaForm = {
          ...res.data,
          ...JSON.parse(window.localStorage.getItem("userDetailData")),
          priceConsumption: res.data.priceRecharge + res.data.shoppingConsumption,
          // priceConsumption:res.data.priceConsumption,
        };
      })
      .catch(() => { });
    this.changeTbas(this.diaTbas);
  },
  destroyed() {
    sessionStorage.setItem("changeTbasUser",1)
  },
  methods: {
    changeTbas(n) {
      sessionStorage.setItem("changeTbasUser",n)
      this.diaTbas=Number(sessionStorage.getItem("changeTbasUser"))
      // this.diaTbas = n;
      this.isOpen = false
      this.tab=n
      this.diaSearchForm = {
        payType: "",
        paySource: "",
        name: "",
        title: "",
        anchorName: "",
        phone: "",
        useStatus: "",
        productName: "",
        linkedProductId: "",
        productType: "",
        isFree: "",
        id: "",
        liveTheme: "",
        liveId: "",
        status: "",
        courierNumber: "",
        logisticsStatus: "",
        linkedProductId: "",
      };
      this.applyForm={}
      this.diaDataList = [];
      this.total_dia = 0;
      this.page_dia = 1;
      switch (n) {
        case 1:
          this.diaTableTitle = {
            price: "充值种子",
            amount: "支付金额",
            payType: "支付方式",
            paySource: "充值来源",
            status: "充值状态",
            updateDate: "充值到账时间",
            createDate: "充值时间",
          };
          break;
        case 2:
          this.diaTableTitle = {
            name: "礼物名称",
            giftNum: "数量",
            price: "礼物单价",
            allPrice: "消费合计",
            payType: "支付方式",
            liveTheme: "直播间主题",
            liveId: "直播间ID",
            paySource: "消费来源",
            createDate: "创建时间",
          };
          break;
        case 3:
          this.diaTableTitle = {
            id: "订单编号",
            productType: "商品类型",
            productName: "商品名称",
            price: "应付金额",
            payPrice: "实付金额",
            realPrice: "实收金额",
            payType: "支付方式",
            payDate: "支付完成时间",
            statusStr: "订单状态",
            activeStatus: "自用状态",
            useStatus: "使用状态",
            consumptionSource: "消费来源",
            createDate: "下单时间",
          };
          break;
        case 4:
          this.diaTableTitle = {
            title: "粉丝团名称",
            anchorName: "主播",
            phone: "手机号码",
            userType: "粉丝团身份",
            createDate: "创建时间",
          };
          break;
        case 5:
          this.diaTableTitle = {
            title: "粉丝团名称",
            anchorName: "主播",
            phone: "手机号码",
            type: "消费类型",
            price: "支付金额",
            payTypeUnit: "支付方式",
            paySource: "消费来源",
            createDate: "创建时间",
          };
          break;
        case 6:
          this.diaTableTitle = {
            id: "订单编号",
            productType: "商品类型",
            productName: "商品名称",
            price: "销售价格",
            // productNum: "商品数量",
            num: "商品数量",
            payPrice: "支付金额",
            freight: "运费",
            payType: "支付方式",
            consumptionSource: "消费来源",
            payDate: "下单时间",
            courierNumber: "快递单号",
            statusStr: "订单状态",
            logisticsStatus: "物流状态",
            linkedProductId: "关联商品编号",
          };
          break;
        default:
          break;
      }

      this.queryPost_dia();
      
    },

    //获取种子数据
    getUserInfo(){
      this.$http
      .get(
        `/sys/manage/userDetail/${JSON.parse(window.localStorage.getItem("userDetailData")).id
        }`
      )
      .then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.diaForm = {
          ...res.data,
          ...JSON.parse(window.localStorage.getItem("userDetailData")),
          priceConsumption: res.data.priceRecharge + res.data.shoppingConsumption,
          // priceConsumption:res.data.priceConsumption,
        };
      })
      .catch(() => { });
    },

    query(){
      this.queryPost_dia()
    },
    // 获取跟进记录列表数据
    queryPost_dia() {
      let data, url;

      switch (this.diaTbas) {
        case 1:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            weixinUserId: this.userId,
            paySource: this.diaSearchForm.paySource,
            payType: this.diaSearchForm.payType,
          };
          url = "/sys/user/consumption/selectUserAddPage";
          break;
        case 2:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            weixinUserId: this.userId,
            paySource: this.diaSearchForm.paySource,
            name: this.diaSearchForm.name,
            liveTheme: this.diaSearchForm.liveTheme,
            liveId: this.diaSearchForm.liveId,
          };
          url = "/sys/user/consumption/selectUserGiftPage";
          break;
        case 3:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            weixinUserId: this.userId,
            useStatus: this.diaSearchForm.useStatus,
            productName: this.diaSearchForm.productName,
            linkedProductId: this.diaSearchForm.linkedProductId,
            productType: this.diaSearchForm.productType,
            isFree: this.diaSearchForm.isFree,
            id: this.diaSearchForm.id,
          };
          url = "/sys/management/user/product/userOrderWithDetailPage";
          break;
        case 4:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            weixinUserId: this.userId,
            phone: this.diaSearchForm.phone,
            anchorName: this.diaSearchForm.anchorName,
            title: this.diaSearchForm.title,
          };
          url = "/sys/manage/weixinUser/anchor/fans/anchorFansInfoPage";
          break;
        case 5:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            weixinUserId: this.userId,
            phone: this.diaSearchForm.phone,
            anchorName: this.diaSearchForm.anchorName,
            title: this.diaSearchForm.title,
          };
          url = "/sys/user/consumption/selectUserJoinFansPage";
          break;
        case 6:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            weixinUserId: this.userId,
            id: this.diaSearchForm.id,
            status: this.diaSearchForm.status,
            courierNumber: this.diaSearchForm.courierNumber,
            logisticsStatus: this.diaSearchForm.logisticsStatus,
            linkedProductId: this.diaSearchForm.linkedProductId
          };
          url = "/sys/management/user/product/userOrderWithBooksDetailPage";
          break;

        default:
          break;
      }
      this.dataListLoading = true
      this.$http
        .get(url, {
          params: data,
        })
        .then(({ data: res }) => {
          this.dataListLoading = false
          if (res.code !== 0) {
            this.diaDataList = [];
            this.total_dia = 0;
            return this.$message.error(res.msg);
          }
          this.diaDataList = res.data.list;
          this.total_dia = res.data.total;

          if (this.$refs.table) this.$refs.table.doLayout()
        })
        .catch(() => {
          this.dataListLoading = false
        });
    },
    // 下拉获取商品类型
    getProductType(type) {
      if (!type) return;
      this.$http
        .get("/sys/course/searchProductType")
        .then(({ data: res }) => {
          if (res.code == 0) {
            this.productTypeOptions = res.data;
          } else {
            this.productTypeOptions = [];
            return this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.productTypeOptions = [];
          this.$message.error(JSON.stringify(err));
        });
    },
    rechargeBlur(){
      console.log(this.rechargePrice);
      if(!this.rechargePrice){
        this.rechargePrice=1
      }
    },
    //充值
    rechargeBtn(){
      this.rechargePrice=1
      this.rechargeRemark=""
      this.dialogRecharge=true
    },
    //确定充值
    rechargeAdd(){
      // if(this.rechargePrice==0){
      //   return this.$message.error('充值种子数量需大于0')
      // }
      // if(this.rechargeRemark==0){
      //   return this.$message.error('充值种子数量需大于0')
      // }
      this.$http.post("/sys/user/consumption/addUserRecharge", {
        price: this.rechargePrice,
        remark: this.rechargeRemark,
        userId:this.userId
      }).then(({ data: res }) => {
        if (res.code != 0) return this.$message.error(res.msg)
        this.$message.success("充值成功")
        this.dialogRecharge = false
        this.query()
        this.getUserInfo()
      }).catch(err => {
        this.dialogRecharge = false
        this.$message.error(JSON.stringify(err))
      })
    },
    //充值-作废
    cancelMoney(row){
      this.rechargeType='edit'
      this.dialogRechargeRemove=true
      this.orderId=row.id
      this.rechargeRemark=row.remark
      
    },
    rechargeRemove(){
        this.$http.post("/sys/user/consumption/delUserRecharge", {
        remark: this.rechargeRemark,
        orderId:this.orderId
      }).then(({ data: res }) => {
        if (res.code != 0) return this.$message.error(res.msg)
        this.$message.success("作废成功")
        this.dialogRechargeRemove = false
        this.query()
        this.getUserInfo()
      }).catch(err => {
        this.dialogRechargeRemove = false
        this.$message.error(JSON.stringify(err))
      })
      this.dialogRechargeRemove=false
    },
    //充值-查看备注
    infoMoney(row){
      this.rechargeType='info'
      this.dialogRechargeRemove=true 
      this.rechargeRemark=row.remark
      this.orderId=row.id
    },
    applyRefund(row) {//申请退款
      // 书籍申请退款
      if (this.diaTbas == 3) return this.$message.warning("暂不支持该功能")
      this.refundInfo = row
      this.dialogVisible = true
    },
    //商品记录-查看明细
    applyInfo(data){
      this.applyInfoVisible=true
      this.$http.get("/sys/management/user/product/"+data.id, {
      }).then(({ data: res }) => {
        if (res.code != 0) return this.$message.error(res.msg)
        this.applyForm=res.data
      }).catch(err => {
        this.applyInfoVisible = false
        this.$message.error(JSON.stringify(err))
      })
    },
    //商品记录-关闭弹窗
    closeApplyInfoialog(){
      this.applyInfoVisible=false
    },
    // 取消退款申请
    closeRefundDialog() {
      this.refundInfo = {}
      this.refundLoading = false
      this.refundReason = ""
    },
    confirmHandle() {//确认退款
      this.refundLoading = true
      this.$http.post("/sys/management/user/product/startRefundApply", {
        id: this.refundInfo.id,
        refundReason: this.refundReason,
        uuid: getUUID()
      }).then(({ data: res }) => {
        this.refundLoading = false
        if (res.code != 0) return this.$message.error(res.msg)
        this.$message.success("申请退款成功，请等待审核")
        this.dialogVisible = false
        this.queryPost_dia()
      }).catch(err => {
        this.refundLoading = false
        this.$message.error(JSON.stringify(err))
      })
    },
    queryChaxun() {
      this.page_dia = 1;
      this.limit_dia = 10;
      this.queryPost_dia();
    },
    // 主页搜索重置
    mainReset() {
      this.diaSearchForm = {
        payType: "",
        paySource: "",
        name: "",
        title: "",
        anchorName: "",
        phone: "",
        useStatus: "",
        productName: "",
        linkedProductId: "",
        productType: "",
        isFree: "",
        liveId: "",
        liveTheme: "",
      }
      this.queryPost_dia();
    },

    // 重置搜索条件
    resetDataForm() {
      this.$refs.dataForm.resetFields();
      this.getDataList();
    },
    // 分页, 每页条数
    pageSizeChangeHandle_dia(val) {
      this.page_dia = 1;
      this.limit_dia = val;
      this.queryPost_dia();
    },
    // 分页, 当前页
    pageCurrentChangeHandle_dia(val) {
      this.page_dia = val;
      this.queryPost_dia();
    },
  },
};
</script>

<style lang="scss" scoped>
.diaBox {
  height: calc(calc(100vh - 50px - 36px) - 2px);
  position: relative;
  background: #fff;
}

.diaBoxLeft {
  position: absolute;
  top: 0;
  left: 0;
  width: 460px;
  bottom: 0;
  overflow: auto;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 1px rgba(17, 17, 17, 0.185);
}

.diaBoxRight {
  position: absolute;
  top: 0;
  right: 0;
  left: 480px;
  bottom: 0;
  overflow: auto;
  margin: 10px;
  padding: 10px 30px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 1px rgba(17, 17, 17, 0.185);
}

.diaBoxLeft_title {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-left: 10px;
  height: 50px;
}

.diaBoxLeft_mes {
  padding: 20px 10px;
  border-bottom: 1px solid #E2E5EA;

  .box {
    width: 190px;
    height: 80px;
    margin: 5px;
    background: #F5F7FA;
    display: flex;
    align-items: center;
  }
}


.diaBoxRight_tabBtns {
  border-width: 0px;
  margin-right: 50px;
  height: 45px;
  text-align: center;
  cursor: pointer;
  line-height: 45px;
  background: inherit;
  border: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  display: inline-block;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.is-active {
  color: #4057CB;
    bottom: -2px;
    position: relative;
  border-bottom:2px solid #4057CB;
 
}

.headerTool-handle-btns {
    display: flex;
    justify-content: space-between;
    .el-form-item{
      margin: 0;
    }
}
.applyInfo{
  /deep/.el-descriptions{
    box-shadow: 0 0 2px 2px #eee;
  }
}

</style>