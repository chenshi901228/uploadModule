<!-- 主播中心-主播详情 -->

<template>
  <div>
    <div class="diaBox">
      <div class="diaBoxLeft">
        <div class="diaBoxLeft_title">
          <span style="font-size: 14px;font-weight: bold;color: #4057CB;">主播信息</span>
          <el-button plain type="primary" size="mini" icon="el-icon-edit" @click="editeUserInfo">编辑</el-button>
        </div>
        <div class="diaBoxLeft_mes">
          <div class="avatar">
            <img :src="anchorDetails.avatarUrl || require('@/assets/img/default_avatar.png')" alt="">
            <div class="role">{{ anchorDetails.userType == 2 ? "企业" : "个人" }}</div>
          </div>
          <div style="width:50%;display: inline-block">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">主播昵称</div>
            <div>{{ anchorDetails.username || '-' }}</div>
          </div>
          <div style="width:50%;display: inline-block;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">真实姓名</div>
            <div>
              {{ anchorDetails.realName || '-' }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">身份证号</div>
            <div>
              {{ enCodeIdCard(anchorDetails.idCard) || '-' }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="color:#A8AAB3;margin-bottom: 10px;">主播简介</div>
            <div style="max-height:105px;overflow:auto;">
              {{ anchorDetails.introduce || '-' }}
            </div>
          </div>

        </div>

        <div class="diaBoxLeft_title" v-if="$hasPermission('anchor:bank:info')">
          <p style="font-size: 14px;font-weight: bold;color: #4057CB;">银行账户<span class="accountStatus"
              v-if="anchorDetails.haveApplyInfo && anchorDetails.userType == 2">核验中</span></p>
          <el-button plain type="primary" size="mini" @click="editeUserBank" icon="el-icon-edit">编辑</el-button>
        </div>
        <!-- 企业 -->
        <div class="diaBoxLeft_mes" v-if="anchorDetails.userType == 2 && $hasPermission('anchor:bank:info')">
          <div style="width:50%;display: inline-block;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">公司名称</div>
            <div>
              {{ anchorDetails.companyName || '-' }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">统一社会信用代码</div>
            <div>
              {{ anchorDetails.companyCreditCode || '-' }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">开户银行</div>
            <div>
              {{ anchorDetails.depositBank || '-' }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">账户名称</div>
            <div>
              {{ anchorDetails.accountName || '-' }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">银行账号</div>
            <div>
              {{ anchorDetails.bankAccount || '-' }}
            </div>
          </div>

        </div>
        <!-- 个人 -->
        <div class="diaBoxLeft_mes" v-else-if="anchorDetails.userType == 1 && $hasPermission('anchor:bank:info')">
          <div style="width:50%;display: inline-block;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">姓名</div>
            <div>
              {{ anchorDetails.realName || '-' }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">身份证号</div>
            <div>
              {{ enCodeIdCard(anchorDetails.idCard) || '-' }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">开户银行</div>
            <div>
              {{ anchorDetails.depositBank || '-' }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">支行名称</div>
            <div>
              {{ anchorDetails.branchName || '-' }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">账户名称</div>
            <div>
              {{ anchorDetails.accountName || '-' }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">银行账号</div>
            <div>
              {{ anchorDetails.bankAccount || '-' }}
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">开户行所在地</div>
            <div>
              {{ anchorDetails.address || '-' }}
            </div>
          </div>

        </div>
        <div class="diaBoxLeft_title" v-if="$hasPermission('anchor:amount:info')">
          <span style="font-size: 14px;font-weight: bold;color: #4057CB;">账户信息</span>
          <el-button plain type="primary" size="mini" @click="withdrawMoney" style="width:73px;background: rgb(64, 87, 203);
    color: #fff;">提现</el-button>
        </div>
        <div class="diaBoxLeft_mes" v-if="$hasPermission('anchor:amount:info')">
          <div style="width:50%;display: inline-block">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">累计收益</div>
            <div>
              ￥{{ anchorDetails.priceIncome ? anchorDetails.priceIncome : 0 }}元
            </div>
          </div>
          <div style="width:50%;display: inline-block">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">已提现金额</div>
            <div>
              ￥{{ anchorDetails.anchorWithdraw || 0 }}元
            </div>
          </div>
          <div style="width:50%;display: inline-block;margin: 20px 0 0;">
            <div style="    color:#A8AAB3;margin-bottom: 10px;">可提现余额</div>
            <div>
              ￥{{ anchorDetails.anchorBalance || 0 }}元
            </div>
          </div>

        </div>
      </div>
      <div class="diaBoxRight">
        <div style="display: flex;border-bottom: 2px solid #E4E7ED">
          <el-tooltip effect="dark" content="收益记录" placement="top" v-if="$hasPermission('anchor:gain:list')">
            <div class="diaBoxRight_tabBtns" @click="changeTbas(1)" :class="{ 'is-active': diaTbas === 1 }">
              收益记录
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="提现记录" placement="top" v-if="$hasPermission('anchor:withdraw:list')">
            <div class="diaBoxRight_tabBtns" @click="changeTbas(2)" :class="{ 'is-active': diaTbas === 2 }">
              提现记录
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="关注记录" placement="top">
            <div class="diaBoxRight_tabBtns" @click="changeTbas(3)" :class="{ 'is-active': diaTbas === 3 }">
              关注记录
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="粉丝团成员" placement="top">
            <div class="diaBoxRight_tabBtns" @click="changeTbas(4)" :class="{ 'is-active': diaTbas === 4 }">
              粉丝团成员
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="店铺" placement="top">
            <div class="diaBoxRight_tabBtns" @click="changeTbas(5)" :class="{ 'is-active': diaTbas === 5 }">
              店铺
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="推荐主播" placement="top">
            <div class="diaBoxRight_tabBtns" @click="changeTbas(6)" :class="{ 'is-active': diaTbas === 6 }">
              推荐主播
            </div>
          </el-tooltip>
        </div>
        <el-form :inline="true" label-position="left" :style="{ margin: '20px' }" :model="diaSearchForm" @keyup.enter.native="queryPost_dia()"
          size="small" ref="searchForm" label-width="100px">
          <el-form-item label="收益类型" v-if="diaTbas === 1" prop="type">
            <el-select placeholder="请选择" style="width: 180px" v-model="diaSearchForm.type" clearable>
              <el-option :value="1" label="直播间礼物"></el-option>
              <el-option :value="2" label="粉丝团"></el-option>
              <el-option :value="3" label="课程返利"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算时间" v-if="diaTbas === 1" prop="date">
            <el-date-picker placeholder="请选择" v-model="diaSearchForm.date" type="datetimerange" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="提现单号" v-if="diaTbas === 2" prop="code">
            <el-input style="width: 180px" placeholder="请输入" v-model="diaSearchForm.code" clearable></el-input>
          </el-form-item>
          <el-form-item label="银行账号" v-if="diaTbas === 2" prop="bankAccount">
            <el-input style="width: 180px" placeholder="请输入" v-model="diaSearchForm.bankAccount" clearable></el-input>
          </el-form-item>
          <el-form-item label="提现时间" v-if="diaTbas === 2" prop="date">
            <el-date-picker placeholder="请选择" v-model="diaSearchForm.date" type="daterange" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="提现状态" v-if="diaTbas === 2" prop="withdrawStatus">
            <el-select placeholder="请选择" style="width: 180px" v-model="diaSearchForm.withdrawStatus" clearable>
              <el-option :value="-1" label="驳回"></el-option>
              <el-option :value="1" label="审核中"></el-option>
              <el-option :value="2" label="核算中"></el-option>
              <el-option :value="3" label="到帐中"></el-option>
              <el-option :value="4" label="已到账"></el-option>
              <el-option :value="5" label="未到账"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item
                label="审批状态"
                v-if="diaTbas === 2"
                prop="approveStatus"
            >
                <el-select
                placeholder="请选择"
                style="width: 180px"
                v-model="diaSearchForm.approveStatus"
                clearable
                >
                <el-option :value="0" label="审批中"></el-option>
                <el-option :value="1" label="已通过"></el-option>
                <el-option :value="-1" label="未通过"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="支付状态" v-if="diaTbas === 2" prop="payStatus">
                <el-select
                placeholder="请选择"
                style="width: 180px"
                v-model="diaSearchForm.payStatus"
                clearable
                >
                <el-option :value="0" label="未支付"></el-option>
                <el-option :value="1" label="已支付"></el-option>
                <el-option :value="-1" label="支付失败"></el-option>
                </el-select>
            </el-form-item> -->
          <el-form-item label="用户昵称" v-if="diaTbas === 3 || diaTbas === 4" prop="userName">
            <el-input placeholder="请输入" style="width: 180px" v-model="diaSearchForm.userName" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品名称" v-if="diaTbas === 5" prop="productName">
            <el-input placeholder="请输入" style="width: 180px" v-model="diaSearchForm.productName" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号码" v-if="diaTbas === 3 || diaTbas === 4 || diaTbas === 6" prop="phone">
            <el-input placeholder="请输入" style="width: 180px" v-model="diaSearchForm.phone" clearable></el-input>
          </el-form-item>
          <el-form-item label="等级" v-if="diaTbas === 4" prop="level">
            <el-select placeholder="请选择" @visible-change="getFansLevels" style="width: 180px"
              v-model="diaSearchForm.level" clearable>
              <el-option v-for="item in fansLevelsOptions" :key="item" :value="item" :label="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="粉丝团身份" v-if="diaTbas === 4" prop="userType">
            <el-select placeholder="请选择" style="width: 180px" v-model="diaSearchForm.userType" clearable>
              <el-option :value="0" label="普通用户"></el-option>
              <el-option :value="1" label="助手"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主播昵称" v-if="diaTbas === 6" prop="anchorName">
            <el-input placeholder="请输入" style="width: 180px" v-model="diaSearchForm.anchorName" clearable></el-input>
          </el-form-item>
          <el-form-item label="推荐状态" v-if="diaTbas === 6" prop="delFlg">
            <el-select placeholder="请选择" style="width: 180px" v-model="diaSearchForm.delFlg" clearable>
              <el-option :value="0" label="已推荐"></el-option>
              <el-option :value="1" label="未推荐"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品类型" v-if="diaTbas === 5" prop="productType">
            <el-select @visible-change="getProductType" style="width: 180px" v-model="diaSearchForm.productType"
              placeholder="请选择" clearable>
              <el-option v-for="item in productTypeOptions" :key="item.productType" :value="item.productType"
                :label="item.productType"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否免费" v-if="diaTbas === 5" prop="isFree">
            <el-select placeholder="请选择" style="width: 180px" v-model="diaSearchForm.isFree" clearable>
              <el-option :value="0" label="否"></el-option>
              <el-option :value="1" label="是"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="上架状态" v-if="diaTbas === 5">
                <el-select
                placeholder="请选择"
                style="width: 180px"
                v-model="diaSearchForm.delFlg"
                clearable
                >
                <el-option :value="0" label="上架"></el-option>
                <el-option :value="1" label="下架"></el-option>
                </el-select>
            </el-form-item> -->
          <el-form-item>
            <el-button size="mini" icon="el-icon-search" type="primary" @click="queryPost_dia()">{{ $t("query") }}
            </el-button>
            <el-button size="mini" icon="el-icon-refresh" @click="mainReset">重置</el-button>
          </el-form-item>

          <div>
            <el-button size="mini" v-if="diaTbas === 5 && dataListSelections.length !== 0" type="danger" plain
              @click="deleteSelect()">批量下架</el-button>
            <el-button size="mini" v-if="diaTbas === 5" @click="updateProduct" type="primary" plain icon="el-icon-plus">
              上架商品</el-button>
            
            <el-button size="mini" v-if="diaTbas === 6 && dataListSelections.length !== 0" @click="deleteRecommend()"
              type="danger" plain icon="el-icon-delete">批量取消</el-button>
            <el-button size="mini" v-if="diaTbas === 6" @click="addRecommendShow" type="primary" plain
              icon="el-icon-plus">新增主播</el-button>

            <el-button size="mini" icon="el-icon-user" v-if="diaTbas === 4" plain @click="fansGroup" type="primary">群组
            </el-button>
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
        <el-table :data="diaDataList" v-loading="dataListLoading" style="width: 100%"
          height="calc(calc(100vh - 50px - 36px - 30px - 45px - 90px - 47px) - 80px)"
          @selection-change="dataListSelectionChangeHandle" ref="dataTable">
          <el-table-column type="selection" header-align="center" align="center" width="50" fixed="left"
            v-if="diaTbas === 5 || diaTbas === 6"></el-table-column>
          <template v-for="(label, prop) in diaTableTitle">
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-if="prop === 'amount'">
              <template slot-scope="{ row }">
                <span>{{ numberConvert(row.amount) }}</span>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'sumTax'">
              <template slot="header">
                税费
                <el-tooltip class="item" effect="dark" content="税费=增值税+附加税+个税" placement="bottom">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </template>
              <template slot-scope="{ row }">
                <span>{{ numberConvert(row.sumTax) }}</span>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center" width="150px"
              v-else-if="prop === 'addedValueTax'">
              <template slot-scope="{ row }">
                <span>{{ numberConvert(row.addedValueTax) }}</span>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center" width="150px"
              v-else-if="prop === 'additionalTax'">
              <template slot-scope="{ row }">
                <span>{{ numberConvert(row.additionalTax) }}</span>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center" width="150px"
              v-else-if="prop === 'personalIncomeTax'">
              <template slot-scope="{ row }">
                <span>{{ numberConvert(row.personalIncomeTax) }}</span>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'receivedAmount'">
              <template slot-scope="{ row }">
                <span v-if="row.withdrawStatus=='4'">{{ numberConvert(row.receivedAmount) }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'price'">
              <template slot-scope="{ row }">
                <span>{{ numberConvert(row.price) }}</span>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'paySource'">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.paySource === 1 ? "小程序" : "大于众学" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center" width="120"
              v-else-if="prop === 'productImage'">
              <template slot-scope="{ row }">
                <div>
                  <img style="width: 100%; height: 60px; object-fit: cover" class="productImage" :src="row.productImage"
                    alt="" />
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'type'">
              <template slot-scope="scope">
                <div>
                  {{
                      scope.row.type === 1
                        ? "直播间礼物"
                        : scope.row.type === 2
                          ? "粉丝团"
                          : "课程返利"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'approveStatus'">
              <template slot-scope="scope">
                <div>
                  {{
                      scope.row.approveStatus === 0
                        ? "审批中"
                        : scope.row.approveStatus === 1
                          ? "已通过"
                          : "未通过"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'confirmStatus'">
              <template slot-scope="scope">
                <div>
                  {{
                      scope.row.confirmStatus === 0
                        ? "待打款"
                        : scope.row.confirmStatus === 1 &&
                          scope.row.payStatus === 0
                          ? "到账中"
                          : scope.row.confirmStatus === 1 &&
                            scope.row.payStatus === 1
                            ? "已到账"
                            : "到账失败"
                  }}
                </div>
              </template>
            </el-table-column>

            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'userType' && diaTbas === 2">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.userType === 1 ? "个人" : "企业" }}
                </div>
              </template>
            </el-table-column>

            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'withdrawStatus' && diaTbas === 2">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.withdrawStatus === '-1' ? "--" : scope.row.withdrawStatus === '1' ? "审核中" :
                      scope.row.withdrawStatus === '2' ? "核算中" : scope.row.withdrawStatus === '3' ? "到帐中" :
                        scope.row.withdrawStatus === '4' ? "已到账" : scope.row.withdrawStatus === '5' ? "未到账" : "--"
                  }}
                </div>
              </template>
            </el-table-column>

            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'payType'">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.paySource === 1 ? "微信" : "支付宝" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'isFree'">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.isFree === 1 ? "是" : "否" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'avatarUrl'">
              <template slot-scope="scope">
                <img :src="
                  scope.row.avatarUrl ||
                  require('@/assets/img/default_avatar.png')
                " alt="" style="width: 60px; height: 60px; object-fit: cover" />
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center" width="100px"
              v-else-if="prop === 'userType'">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.userType === 1 ? "助手" : "普通用户" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'level'">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.level }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              v-else-if="prop === 'delFlg'">
              <template slot-scope="scope">
                <div v-if="diaTbas === 5">
                  上架
                </div>
                <div v-else>
                  {{ scope.row.delFlg === 1 ? "未推荐" : "已推荐" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="prop" :label="label" :key="prop" header-align="center" align="center"
              min-width="120" v-else show-overflow-tooltip>
            </el-table-column>
          </template>
          <el-table-column width="120" label="操作" fixed="right" header-align="center" align="center" v-if="
            diaTbas === 2 || diaTbas === 5 || diaTbas === 6 || diaTbas === 4
          ">
            <template slot-scope="scope">
              <!-- <el-button
                    v-if="diaTbas === 2"
                    type="text"
                    size="small"
                    icon="el-icon-view"
                    @click="previewInvoiceImg(scope.row)"
                    >查看发票</el-button
                > -->
              <el-button v-if="diaTbas === 2" type="text" size="small" icon="el-icon-view"
                @click="previewInvoice(scope.row.id, scope.row.withdrawStatus)">查看</el-button>
              <!-- <el-button
                    v-if="diaTbas === 2 && scope.row.approveStatus == 0"
                    type="text"
                    size="small"
                    icon="el-icon-upload2"
                    @click="updateInvoiceImg(scope.row)"
                    >重新上传</el-button
                > -->
              <el-button v-if="diaTbas === 5" type="text" size="small" icon="el-icon-delete"
                @click="downProduct(scope.row.id)">下架</el-button>
              <el-button v-if="diaTbas === 6" type="text" size="small" icon="el-icon-delete"
                @click="deleteRecommend(scope.row.id)">取消推荐</el-button>
              <el-button v-if="diaTbas === 4" type="text" size="small" :icon="
                scope.row.userType === 1
                  ? 'el-icon-delete'
                  : 'el-icon-plus'
              " @click="changePower(scope.row)">{{
    scope.row.userType === 1 ? "取消身份" : "授予身份"
}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="page_dia" :page-sizes="[10, 20, 50, 100]" :page-size="limit_dia"
          :total="total_dia" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle_dia"
          @current-change="pageCurrentChangeHandle_dia">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmDel">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 商品上架列表弹框 -->
    <el-dialog title="商品上架" :visible.sync="dialogUserFormVisible" width="70%" top="20px">
      <el-form :inline="true" :model="productForm" @keyup.enter.native="queryUserList()" size="small"
        label-width="100px">
        <el-form-item label="商品名称">
          <el-input style="width: 200px" v-model="productForm.productName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select @visible-change="getProductType" style="width: 200px" v-model="productForm.productType"
            placeholder="商品类型" clearable>
            <el-option v-for="item in productTypeOptions" :key="item.productType" :value="item.productType"
              :label="item.productType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-select style="width: 200px" v-model="productForm.isFree" clearable>
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="queryUserList">查询</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="reset('productForm')">重置</el-button>
        </el-form-item>

        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <el-form-item>
              <el-button plain size="mini" icon="el-icon-delete" v-if="dataListSelections.length !== 0" type="danger"
                @click="deleteSelect()">批量删除</el-button>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" plain icon="el-icon-plus" size="mini" v-if="dataListSelectionUsers.length !== 0"
                @click="upSelect()">批量上架</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-table v-loading="dataUserListLoading" :data="dataUserList" fit
        @selection-change="userListSelectionChangeHandle" style="width: 100%" max-height="500">
        <el-table-column type="selection" header-align="center" align="center" width="50" fixed="left">
        </el-table-column>
        <el-table-column width="100" label="商品图片" prop="productImage" align="center">
          <template slot-scope="{ row }">
            <div>
              <img style="width: 100%; height: 60px; object-fit: cover;" :src="
                row.productImage || require('@/assets/img/default_cover.jpg')
              " alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="productName" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productName || "--" }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          width="120"
          label="商品价格"
          prop="oldPrice"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.oldPrice || "--" }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="带货价格" prop="price" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.price || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品类型" prop="productType" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productType || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否免费" prop="isFree" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isFree === 1 ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上架状态" prop="delFlg" align="center">
          <template slot-scope="scope">
            <span> {{ scope.row.isAdd === 1 ? "上架" : "下架" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-goods" size="mini" type="text" @click="handleDeleteUser(scope.$index, scope.row)">
              上架</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 推荐主播列表弹框 -->
    <el-dialog title="推荐主播" :visible.sync="dialogRecommendVisible" width="70%" top="20px">
      <el-form size="small" :inline="true" :model="recommendForm" @keyup.enter.native="getRecommendList()"
        label-width="100px">
        <el-form-item label="主播昵称" prop="anchorName">
          <el-input style="width: 200px" v-model="recommendForm.anchorName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="anchorPhone">
          <el-input style="width: 200px" v-model="recommendForm.anchorPhone" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getRecommendList">查询</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="reset('recommendForm')">重置</el-button>
        </el-form-item>

        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <el-form-item>
              <el-button type="primary" plain icon="el-icon-plus" size="mini" v-if="
                recommendListSelections.length !== 0 && dialogRecommendVisible
              " @click="addRecommend()">批量添加</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-table v-loading="dataUserListLoading" :data="recommendList" fit
        @selection-change="recommendSelectionChangeHandle" style="width: 100%" max-height="500">
        <el-table-column type="selection" header-align="center" align="center" width="50" fixed="left">
        </el-table-column>
        <el-table-column width="100" label="主播头像" prop="avatarUrl" align="center">
          <template slot-scope="{ row }">
            <div>
              <img style="width: 60px; height: 60px; object-fit: cover" class="productImage" :src="
                row.avatarUrl || require('@/assets/img/default_avatar.png')
              " alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column width="150" label="主播昵称" prop="username" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.username || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="手机号码" prop="phone" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="推荐状态" prop="delFlg" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.delFlg === 0 ? "已推荐" : "未推荐" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-plus" size="mini" type="text" @click="addRecommend(scope.row.recommendAnchorId)">推荐
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 修改银行信息 -->
    <el-dialog title="编辑银行卡信息" :visible.sync="dialogVisible_editBank" width="600px">
      <el-form :model="bankForm" :rules="dataRule_bank" ref="bankForm_host" label-width="120px" size="small">
        <el-form-item label="开户银行" prop="depositBank">
          <el-autocomplete v-model="bankForm.depositBank" :fetch-suggestions="querySearchAsync" placeholder="开户银行"
            @select="handleSelect"></el-autocomplete>
        </el-form-item>
        <el-form-item label="支行名称">
          <el-input v-model="bankForm.branchName" placeholder="支行名称"></el-input>
        </el-form-item>
        <el-form-item label="开户行所在地" prop="address">
          <el-cascader :options="regionData" filterable style="width: 100%" v-model="bankForm.address"
            :props="{ label: 'name', value: 'id', children: 'children' }" :clearable="true" :placeholder="'请选择省/市/区县'">
          </el-cascader>
        </el-form-item>

        <el-form-item label="账户名称" prop="accountName">
          <el-input v-model="bankForm.accountName" placeholder="账户名称"></el-input>
        </el-form-item>
        <el-form-item label="银行账户" prop="bankAccount">
          <el-input v-model="bankForm.bankAccount" placeholder="银行账户"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible_editBank = false">取 消</el-button>
        <el-button size="small" type="primary" @click="subimtEditBank">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 提现 -->
    <el-dialog title="申请提现" :visible.sync="dialogVisible_withdraw" width="800px" top="20px"
      @close="closeWithdrawHandle">
      <el-form :model="withdrawForm" :rules="dataRule_withdraw" ref="withdrawForm_host" label-width="120px"
        size="small">
        <el-form-item label="可提现金额：">
          <div>{{ anchorDetails.anchorBalance || 0 }}</div>
        </el-form-item>
        <el-form-item label="申请提现金额：" prop="amount">
          <div style="display: inline-block">
            <el-input-number v-model="withdrawForm.amount" :controls="false" :precision="2" placeholder="请输入" :min="0">
            </el-input-number>
          </div>
          <span>（提现金额需大于100元）</span>
        </el-form-item>
        <el-form-item label="上传发票：">
          <el-upload class="uploadStyle" list-type="picture-card" :action="uploadUrl" :limit="invoiceLimit" multiple
            :file-list="withdrawForm.invoiceList" :before-upload="beforeUpload" :on-remove="onRemove"
            :on-exceed="uploadExceed" :on-error="uploadError" :before-remove="beforeRemove" :on-success="uploadSuccess"
            :on-preview="handlePictureCardPreview">
            <div class="uploadStyle-btn">
              <i class="el-icon-plus"></i>
              <span>{{ withdrawForm.invoiceList.length }} /
                {{ invoiceLimit }}</span>
            </div>
            <div class="el-upload__tip" slot="tip">注：点击图片可放大查看</div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible_Image">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <div class="withdraw_bank_info">
          <div class="header">提现至：</div>
          <div>开户银行：{{ anchorDetails.depositBank || '-' }}</div>
          <div>支行名称：{{ anchorDetails.branchName || '-' }}</div>
          <div>账号名称：{{ anchorDetails.accountName || '-' }}</div>
          <div>银行账户：{{ anchorDetails.bankAccount || '-' }}</div>
          <div>开户行所在地：{{ anchorDetails.address || '-' }}</div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible_withdraw = false">取 消</el-button>
        <el-button size="small" type="primary" @click="subimtWithdraw">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 发票预览 -->
    <el-dialog title="预览" :visible.sync="dialogVisible_preview" width="80%" top="20px">
      <div style="text-align: center">
        <img style="max-width: 100%" :src="dialogImageUrl" alt="" />
      </div>
    </el-dialog>
    <!-- 查看所有发票 -->
    <el-dialog title="查看发票" :visible.sync="dialogVisible_previewList" width="400px" top="20px">
      <div class="previewInvoiceList">
        <img @click="handlePictureCardPreview({ url: item })" v-for="item in previewInvoiceList" :key="item" :src="item"
          alt="" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="dialogVisible_previewList = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 重新上传 -->
    <el-dialog title="重新上传" :visible.sync="dialogVisible_updateInvoiceImg" @close="closeUpdateInvoiceImgHandle"
      width="400px" top="20px">
      <el-upload class="uploadStyle" list-type="picture-card" :action="uploadUrl" :limit="invoiceLimit" multiple
        :file-list="withdrawForm.invoiceList" :before-upload="beforeUpload" :on-remove="onRemove"
        :on-exceed="uploadExceed" :on-error="uploadError" :before-remove="beforeRemove" :on-success="uploadSuccess"
        :on-preview="handlePictureCardPreview">
        <div class="uploadStyle-btn">
          <i class="el-icon-plus"></i>
          <span>{{ withdrawForm.invoiceList.length }} / {{ invoiceLimit }}</span>
        </div>
        <div class="el-upload__tip" slot="tip">注：点击图片可放大查看</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible_updateInvoiceImg = false">取 消</el-button>
        <el-button size="small" type="primary" @click="updateInvoiceImgSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 改变身份 -->
    <el-dialog :title="userType === 0 ? '授予身份' : '取消身份'" :visible.sync="changePowerVisible" class="change-dialog">
      <el-form v-if="userType === 0" :model="powerform" ref="powerform" :rules="dataRule" size="small">
        <el-form-item label="粉丝团身份" label-width="120px" prop="power">
          <el-select v-model="powerform.power" placeholder="请选择">
            <el-option label="助手" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-else-if="userType === 1">确定取消粉丝团助手身份？</div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="changePowerVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmChangePower">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { treeDataTranslate, getUUID, enCodeIdCard, numberConvert } from "@/utils";
import Cookies from "js-cookie";
export default {
  name: "LiveWebmanageUserdetail",

  data() {
    // 验证提现金额
    let checkWithdraw = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error("请输入提现金额"));
      } else if (value > this.anchorDetails.anchorBalance) {
        callback(new Error("超过可提现金额"));
      } else {
        callback();
      }
    };
    return {
      userId: "",
      anchorDetails: {},
      diaTbas: 1,
      diaSearchForm: {
        payType: "",
        paySource: "",
        name: "",
        title: "",
        anchorName: "",
        userName: "",
        phone: "",
        userType: "",
        delFlg: "",
        productName: "",
        productType: "",
        isFree: "",
        type: "",
        bankAccount: "",
        approveStatus: "",
        payStatus: "",
        date: "",
        code: "",
        withdrawStatus: "",
      },
      productForm: {
        productName: "",
        productType: "",
        isFree: "",
      },
      // 推荐主播搜索
      recommendForm: {
        anchorName: "",
        anchorPhone: "",
      },
      dialogRecommendVisible: false, //推荐主播弹框
      recommendList: [], //推荐主播列表
      recommendListSelections: [], //推荐主播列表多选
      dataListSelections: [], // 数据列表，多选项
      diaDataList: [],
      diaTableTitle: {
        amount: "收益金额",
        type: "收益类型",
        detail: "收益描述",
        createDate: "结算时间",
      },
      page_dia: 1, // 当前页码
      limit_dia: 10, // 每页数
      total_dia: 0,
      ids: [],
      dialogVisible: false,
      dataListLoading: false,
      dataUserListLoading: false,
      userListPage: 1, // 当前页码
      userListLimit: 10, // 每页数
      dataUserList: [],
      dataUserListTotal: 0,
      dataListSelectionUsers: [],
      dialogUserFormVisible: false,

      // 修改银行卡信息
      dialogVisible_editBank: false,
      dialogVisible_withdraw: false, //提现弹窗
      dialogImageUrl: "",
      dialogVisible_Image: false,
      withdrawForm: {
        amount: 0,
        invoiceList: [], //发票上传图片
      },
      invoiceLimit: 9, //发票上传图片数量限制
      previewInvoiceList: [], //查看所有发票list
      dialogVisible_previewList: false,
      dialogVisible_updateInvoiceImg: false,
      updateInvoiceId: "", //重新上传发票的id
      dataRule_bank: {
        address: [
          { required: true, message: "请选择省/市/区县", trigger: "change" },
        ],
        depositBank: [
          { required: true, message: "请填写开户银行", trigger: "blur" },
        ],
        accountName: [
          { required: true, message: "请填写账户名称", trigger: "blur" },
        ],
        bankAccount: [
          { required: true, message: "请填写银行账户", trigger: "blur" },
        ],
      },
      dataRule_withdraw: {
        amount: [{ validator: checkWithdraw, trigger: "blur" }],
      },
      dialogVisible_preview: false,
      regionDataAll: [],
      regionData: [],
      bankForm: {},
      showBankDictListDialog: false,
      bankList: {
        dictValue: "",
        dictLabel: "",
      },
      dataBankListLoading: false,
      bankListSelectionUsers: [],
      dataBankList: [],
      bankListPage: 1,
      bankListlimit: 10,
      dataBankListTotal: 0,
      dictTypeId: "",
      restaurants: [],
      state: "",
      timeout: null,
      productTypeOptions: [], //商品类型下拉选项
      fansLevelsOptions: [], //粉丝等级options
      changePowerVisible: false,
      powerform: {
        power:''
      },
      userType: 0,
      changeUserTypeData: {},
      dataRule: {
        power: [
          { required: true, message: "请选择授权身份", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    uploadUrl() {
      return `${window.SITE_CONFIG["apiURL"]
        }/oss/file/upload?access_token=${Cookies.get("access_token")}`;
    },
  },

  activated() {
    this.userId = this.$store.state.user.id;
    this.$http
      .get("/sys/region/tree")
      .then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.regionData = treeDataTranslate(res.data);
        this.regionDataAll = res.data;
      })
      .catch(() => { });
    this.getAnchorInfo()
    this.getAccountAmount();
    // if (this.$hasPermission('anchor:gain:list')) {
    //   this.changeTbas(1);
    // } else if (this.$hasPermission('anchor:withdraw:list')) {
    //   this.changeTbas(2);
    // } else {
    //   this.changeTbas(3);
    // }
    this.changeTbas(this.diaTbas);
    this.queryBankList();
  },
  methods: {
    // 添加金额符号
    numberConvert(m) {
      return numberConvert(m)
    },
    // 身份证号码加密
    enCodeIdCard(val) {
      return enCodeIdCard(val)
    },
    //改变身份
    changePower(row) {
      if (this.$refs.powerform){
        this.$refs.powerform.resetFields();
      }
      this.userType = row.userType;
      this.powerform.power=''
      this.changePowerVisible = true;
      this.changeUserTypeData = row;
    },
    //确认改变身份
    confirmChangePower() {
      let flag = false;
      let data = {};
      data.id = this.changeUserTypeData.id;
      data.weixinUserId = this.changeUserTypeData.weixinUserId;
      data.anchorId = this.userId
      if (this.userType === 0) {
        this.$refs.powerform.validate((valid) => {
          if (valid) {
            data.userType = this.powerform.power;
            flag = true;
          }
        });
      } else if (this.userType === 1) {
        data.userType = 0;
        flag = true;
      }
      if (flag) {
        this.$http
          .post("/sys/manage/weixinUser/anchor/fans/setUserType", data)
          .then(({ data: res }) => {
            if (res.code == 0) {
              this.$message.success("修改成功");
              this.changePowerVisible = false;
              this.powerform.power = ""
              this.queryPost_dia();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            throw err;
          });
      }
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      this.bankForm.depositBank = item.value;
      this.bankForm.depositBankValue = item.dictValue;
    },
    //获取银行列表
    queryBankList() {
      this.$http
        .get("/sys/dict/data/page", {
          params: {
            page: this.bankListPage,
            limit: 100,
            dictTypeId: "1518837406719619074",
          },
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.restaurants = [];
          } else {
            res.data.list.forEach((v) => {
              this.restaurants.push({
                value: v.dictLabel,
                dictValue: v.dictValue,
              });
            });
          }
        })
        .catch((err) => {
          this.dataBankListLoading = false;
          throw err;
        });
    },
    // 获取用户详细信息
    getAnchorInfo() {
      this.$http.get(`/sys/anchor/info/getInfoWithAnchor`, { params: { anchorId: this.userId } }).then(({ data: res }) => {
        if (res.code !== 0) return this.$message.error(res.msg);

        this.anchorDetails = { ...this.anchorDetails, ...res.data };
      }).catch((err) => this.$message.error(JSON.stringify(err.message)));
    },
    // 获取用户账户金额信息
    getAccountAmount() {
      this.$http
        .get(`/sys/manage/userDetail/getWithAnchor`, { params: { anchorId: this.userId } })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return vm.$message.error(res.msg);
          }
          this.anchorDetails = {
            ...this.anchorDetails,
            priceIncome: res.data.priceIncome,
            anchorWithdraw: res.data.anchorWithdraw,
            anchorBalance: res.data.anchorBalance,
          };
        })
        .catch(() => { });
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    //确认下架
    confirmDel() {
      this.$http
        .delete("/sys/wxapp/anchorProduct", { data: this.ids })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.dialogVisible = false;
            this.diaSearchForm = {
              payType: "",
              paySource: "",
              name: "",
              title: "",
              anchorName: "",
              userName: "",
              phone: "",
              level: "",
              userType: "",
              delFlg: "",
              productName: "",
              productType: "",
              isFree: "",
              type: "",
              bankAccount: "",
              approveStatus: "",
              payStatus: "",
              date: "",
              code: "",
              withdrawStatus: ""
            };
            this.page_dia = 1; // 当前页码
            this.diaDataList = [];
            this.queryPost_dia();
            this.ids = [];
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    changeTbas(n) {
      this.diaTbas = n;
      this.page_dia = 1;
      this.diaSearchForm = {
        payType: "",
        paySource: "",
        name: "",
        title: "",
        anchorName: "",
        userName: "",
        phone: "",
        level: "",
        userType: "",
        delFlg: "",
        productName: "",
        productType: "",
        isFree: "",
        type: "",
        date: "",
        bankAccount: "",
        approveStatus: "",
        payStatus: "",
        date: "",
        code: "",
        withdrawStatus: ""
      };
      this.diaDataList = [];
      this.total_dia = 0;
      this.dataListSelections = [];
      switch (n) {
        case 1:
          this.diaTableTitle = {
            amount: "收益金额",
            type: "收益类型",
            detail: "收益描述",
            productType: "商品类型",
            weixinUserName: "购买人",
            createDate: "结算时间",
          };
          break;
        case 2:
          this.diaTableTitle = {
            id: "提现单号",
            amount: "提现金额",
            sumTax: "税费",
            addedValueTax: "本次代征增值税",
            additionalTax: "本次代征附加税",
            personalIncomeTax: "本次代征个税",
            receivedAmount: "到账金额",
            userType: "账户类型",
            accountName: "账户名称",
            bankAccount: "银行账号",
            depositBankName: "开户银行",
            branchName: "支行名称",
            address: "开户行所在地",
            createDate: "提现时间",
            // approveStatus: "审批状态",
            withdrawStatus: "提现状态",
          };
          break;
        case 3:
          this.diaTableTitle = {
            avatarUrl: "用户头像",
            userName: "用户昵称",
            phone: "手机号码",
            createDate: "关注时间",
          };
          break;
        case 4:
          this.diaTableTitle = {
            avatarUrl: "用户头像",
            userName: "用户昵称",
            phone: "手机号码",
            intimacyNum: "亲密度",
            level: "用户等级",
            userType: "粉丝团身份",
            createDate: "入团时间",
          };
          break;
        case 5:
          this.diaTableTitle = {
            productImage: "商品图片",
            productName: "商品名称",
            // oldPrice: "商品原价",
            price: "带货价格",
            productType: "商品类型",
            isFree: "是否免费",
            // id: "关联产品编号",
            updateDate: "上架时间",
            delFlg: "上架状态",
          };
          break;
        case 6:
          this.diaTableTitle = {
            avatarUrl: "主播头像",
            anchorName: "主播昵称",
            phone: "手机号码",
            createDate: "推荐时间",
            delFlg: "推荐状态",
          };
          break;

        default:
          break;
      }
      this.queryPost_dia();
    },

    query(){
      this.queryPost_dia()
    },

    // 获取跟进记录列表数据
    queryPost_dia() {
      let data, url;
      this.dataListLoading = true;

      switch (this.diaTbas) {
        case 1:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            anchorId: this.userId,
            type: this.diaSearchForm.type,
            startDate: this.diaSearchForm.date && this.diaSearchForm.date[0] || '',
            endDate: this.diaSearchForm.date && this.diaSearchForm.date[1] || '',
          };
          url = "/sys/anchorGain/page";
          break;
        case 2:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            anchorId: this.userId,
            code: this.diaSearchForm.code,
            bankAccount: this.diaSearchForm.bankAccount,
            withdrawStatus: this.diaSearchForm.withdrawStatus,
            // approveStatus: this.diaSearchForm.approveStatus,
            // payStatus: this.diaSearchForm.payStatus,
            startDate: this.diaSearchForm.date && this.diaSearchForm.date[0] || '',
            endDate: this.diaSearchForm.date && this.diaSearchForm.date[1] || '',
          };
          url = "/sys/anchorWithdraw/page";
          break;
        case 3:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            anchorId: this.userId,
            phone: this.diaSearchForm.phone,
            userName: this.diaSearchForm.userName,
          };
          url =
            "/sys/manage/weixinUser/anchor/attention/anchorAttentionWeixinUserInfoPage";
          break;
        case 4:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            anchorId: this.userId,
            phone: this.diaSearchForm.phone,
            level: this.diaSearchForm.level,
            userName: this.diaSearchForm.userName,
            userType: this.diaSearchForm.userType,
          };
          url =
            "/sys/manage/weixinUser/anchor/fans/achorFansWeixinUserInfoPage";
          break;
        case 5:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            anchorId: this.userId,
            productName: this.diaSearchForm.productName,
            productType: this.diaSearchForm.productType,
            isFree: this.diaSearchForm.isFree,
            // delFlg:this.diaSearchForm.delFlg,
          };
          url = "/sys/wxapp/anchorProduct/listWithAnchorIdPage";
          break;
        case 6:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            anchorId: this.userId,
            phone: this.diaSearchForm.phone,
            anchorName: this.diaSearchForm.anchorName,
            delFlg: this.diaSearchForm.delFlg,
          };
          url = "/sys/manage/anchor/recommend/listWithAnchorId";
          break;

        default:
          break;
      }
      this.$http
        .get(url, {
          params: this.$httpParams(data),
        })
        .then(({ data: res }) => {
          this.dataListLoading = false;

          if (res.code !== 0) {
            this.diaDataList = [];
            this.total_dia = 0;
            return this.$message.error(res.msg);
          }
          this.diaDataList = res.data.list;
          this.total_dia = res.data.total;
          if (this.$refs.dataTable) this.$refs.dataTable.doLayout(); //刷新table样式
        })
        .catch(() => {
          this.dataListLoading = false;
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
    // 获取粉丝等级
    getFansLevels(type) {
      if (!type) return;
      this.$http
        .get("/sys/sysfanslevel/getLevelList")
        .then(({ data: res }) => {
          if (res.code == 0) {
            this.fansLevelsOptions = res.data;
          } else {
            this.fansLevelsOptions = [];
            return this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.fansLevelsOptions = [];
          this.$message.error(JSON.stringify(err));
        });
    },
    // 主页搜索重置
    mainReset() {
      this.$refs.searchForm.resetFields();
      this.queryPost_dia();
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
    //下架商品
    downProduct(id) {
      this.$confirm("确认下架该商品?", "下架", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.ids = [];
          this.ids.push({ productId: id });
          this.confirmDel();
        })
        .catch(() => {
          this.$message.info("已取消操作");
        });
    },
    fansGroup() {
      this.$router.push({
        name: "preview-fansGroup-index",
        query: { anchorId: this.userId },
      });
    },
    //上架商品
    updateProduct() {
      this.dialogUserFormVisible = true;
      this.productForm = {
        productName: "",
        productType: "",
        isFree: "",
        id: "",
      };
      this.dataUserList = [];
      this.queryUserList();
    },
    //批量下架
    deleteSelect() {
      this.$confirm("确认下架商品?", "下架", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.dataListSelections.forEach((v) => {
            this.ids.push({ productId: v.id });
          });
          this.confirmDel();
        })
        .catch(() => {
          this.$message.info("已取消操作");
        });
    },
    //批量选择
    userListSelectionChangeHandle(val) {
      this.dataListSelectionUsers = val;
    },
    //获取未上架商品
    queryUserList() {
      this.dataUserListLoading = true;
      this.$http
        .get("/sys/wxapp/anchorProduct/listBySearch", {
          params: this.$httpParams({
            productName: this.productForm.productName,
            productType: this.productForm.productType,
            isFree: this.productForm.isFree,
            anchorId: this.userId,
          }),
        })
        .then(({ data: res }) => {
          this.dataUserListLoading = false;
          if (res.code !== 0) {
            this.dataUserList = [];
            return this.$message.error(res.msg);
          }
          this.dataUserList = res.data;
        })
        .catch((err) => {
          this.dataUserListLoading = false;
          throw err;
        });
    },
    // 推荐主播多选
    recommendSelectionChangeHandle(val) {
      this.recommendListSelections = val.map((item) => {
        return { recommendAnchorId: item.recommendAnchorId };
      });
    },
    // 获取未推荐的主播
    getRecommendList() {
      this.dataUserListLoading = true;
      this.$http
        .get("/sys/manage/anchor/recommend/listBySearch", {
          params: this.$httpParams({
            anchorName: this.recommendForm.anchorName,
            anchorPhone: this.recommendForm.anchorPhone,
            anchorId: this.userId,
          }),
        })
        .then(({ data: res }) => {
          this.dataUserListLoading = false;
          if (res.code !== 0) {
            this.recommendList = [];
            return this.$message.error(res.msg);
          }
          this.recommendList = res.data;
        })
        .catch((err) => {
          this.dataUserListLoading = false;
          throw err;
        });
    },
    // 添加主播列表弹框
    addRecommendShow() {
      this.recommendList = [];
      if (this.recommendListSelections.length)
        this.recommendListSelections = []; //清空多选
      this.dialogRecommendVisible = true;
      this.getRecommendList();
    },
    // 添加推荐主播-handle
    addRecommendHandle(data) {
      this.$http
        .post("/sys/manage/anchor/recommend", data)
        .then(({ data: res }) => {
          if (res.code == 0) {
            this.$message.success("添加推荐主播成功");
            this.dialogRecommendVisible = false;
            this.queryPost_dia();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    // 取消推荐主播-handle
    deleteRecommendHandle(data) {
      this.$http
        .delete("/sys/manage/anchor/recommend", { data })
        .then(({ data: res }) => {
          if (res.code == 0) {
            this.$message.success("取消推荐主播成功");
            this.queryPost_dia();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    // 添加推荐主播-confirm
    addRecommend(id) {
      if (!id) {
        //批量添加
        this.$confirm("确认推荐主播?", "推荐", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(() => {
            this.addRecommendHandle(this.recommendListSelections);
          })
          .catch(() => {
            this.$message.info("已取消操作");
          });
      } else {
        //单个操作
        this.$confirm("确认推荐主播?", "推荐", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(() => {
            this.addRecommendHandle([{ recommendAnchorId: id }]);
          })
          .catch(() => {
            this.$message.info("已取消操作");
          });
      }
    },
    // 取消推荐主播
    deleteRecommend(id) {
      if (!id) {
        //批量取消推荐
        this.$confirm("确认取消推荐主播?", "取消推荐", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(() => {
            let arr = this.dataListSelections.map((item) => {
              return { recommendAnchorId: item.id };
            });
            this.deleteRecommendHandle(arr);
          })
          .catch(() => {
            this.$message.info("已取消操作");
          });
      } else {
        //单个操作
        this.$confirm("确认取消推荐该主播?", "取消推荐", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(() => {
            this.deleteRecommendHandle([{ recommendAnchorId: id }]);
          })
          .catch(() => {
            this.$message.info("已取消操作");
          });
      }
    },

    //重置
    reset(name) {
      if (name == "productForm") {
        this.productForm = {
          productName: "",
          productType: "",
          isFree: "",
        };
        this.queryUserList();
      } else if (name == "recommendForm") {
        this.recommendForm = {
          anchorName: "",
          anchorPhone: "",
        };
        this.getRecommendList();
      }
    },
    //上架商品
    handleDeleteUser(index, row) {
      this.$confirm("确认上架该商品?", "上架", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          let ids = [];
          ids.push({ productId: row.id });
          this.$http
            .post("/sys/wxapp/anchorProduct", ids)
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.$message.success("上架成功!");
              this.queryUserList();
              this.dialogUserFormVisible = false;
              this.diaSearchForm = {
                payType: "",
                paySource: "",
                name: "",
                title: "",
                anchorName: "",
                userName: "",
                phone: "",
                level: "",
                userType: "",
                delFlg: "",
                productName: "",
                productType: "",
                isFree: "",
              };
              this.page_dia = 1; // 当前页码
              this.diaDataList = [];
              this.queryPost_dia();
            })
            .catch((err) => {
              throw err;
            });
        })
        .catch(() => {
          this.$message.info("已取消操作");
        });
    },
    //批量上架
    upSelect() {
      this.$confirm("确认上架商品?", "上架", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          let ids = [];
          this.dataListSelectionUsers.forEach((v) => {
            ids.push({ productId: v.id });
          });
          this.$http
            .post("/sys/wxapp/anchorProduct", ids)
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.$message.success("上架成功!");
              this.queryUserList();
              this.dialogUserFormVisible = false;
              this.diaSearchForm = {
                payType: "",
                paySource: "",
                name: "",
                title: "",
                anchorName: "",
                userName: "",
                phone: "",
                level: "",
                userType: "",
                delFlg: "",
                productName: "",
                productType: "",
                isFree: "",
              };
              this.page_dia = 1; // 当前页码
              this.diaDataList = [];
              this.queryPost_dia();
            })
            .catch((err) => {
              throw err;
            });
        })
        .catch(() => {
          this.$message.info("已取消操作");
        });
    },
    // 分页, 每页条数
    pageSizeChangeUserHandle(val) {
      this.userListPage = 1;
      this.userListLimit = val;
      this.queryUserList();
    },
    // 分页, 当前页
    pageCurrentChangeUserHandle(val) {
      this.userListPage = val;
      this.queryUserList();
    },
    //编辑主播信息
    editeUserInfo() {
      this.$router.push({ path: "/anchorManagement-anchorDetails-EditeUserInfo", query: { id: this.anchorDetails.weixinUserId },
      });
    },
    //编辑银行卡信息
    editeUserBank() {
      // 企业银行账号核验中不可编辑
      // if(this.anchorDetails.haveApplyInfo && this.anchorDetails.userType == 2) {
      //     return this.$confirm("您的银行账号正在核验中，不可操作编辑", "提示", {
      //         confirmButtonText: "确认",
      //         showCancelButton: false,
      //         showClose: false
      //     }).catch(() => {})
      // }


      // 有未到账的提现不可编辑
      if (this.anchorDetails.haveWithdraw) {
        return this.$confirm("您还有未到账的提现，暂不可编辑银行账户信息", "提示", {
          confirmButtonText: "确认",
          showCancelButton: false,
          showClose: false
        }).catch(() => { })
      }

      let url = `anchorManagement-anchorDetails-${this.anchorDetails.userType == 2 ? "editBankForEnterprise" : "editBankForPersonal"}`

      this.$router.push({ name: url })

      // this.dialogVisible_editBank = true;

      // this.bankForm = {
      //     depositBank: this.anchorDetails.depositBank ? this.anchorDetails.depositBank : "",
      //     branchName: this.anchorDetails.branchName ? this.anchorDetails.branchName : "",
      //     address: this.anchorDetails.province
      //     ? [this.anchorDetails.province, this.anchorDetails.city, this.anchorDetails.county]
      //     : [],
      //     accountName: this.anchorDetails.accountName ? this.anchorDetails.accountName : "",
      //     bankAccount: this.anchorDetails.bankAccount ? this.anchorDetails.bankAccount : "",
      // };

      // this.restaurants.forEach((v) => {
      //     if (
      //         this.anchorDetails.depositBank &&
      //         this.anchorDetails.depositBank === v.value
      //     ) {
      //         this.bankForm.depositBankValue = v.dictValue;
      //     }
      // });
    },
    subimtEditBank() {
      this.$refs.bankForm_host.validate((valid) => {
        if (valid) {
          let address = "";
          this.bankForm.address.forEach((i) => {
            this.regionDataAll.forEach((v) => {
              if (v.id === i) {
                address += `${v.name}/`;
              }
            });
          });
          this.restaurants.forEach((v) => {
            if (
              this.anchorDetails.depositBank &&
              this.anchorDetails.depositBank.length !== 0 &&
              this.anchorDetails.depositBank === v.value
            ) {
              this.bankForm.depositBankValue = v.dictValue;
            }
          });
          this.$confirm("确认信息已填写无误，确认提交", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$http
                .post(`sys/sysbankinfo/save`, {
                  // depositBank: this.bankForm.depositBank
                  //   ? this.bankForm.depositBank
                  //   : "",
                  depositBank: this.bankForm.depositBankValue
                    ? this.bankForm.depositBankValue
                    : "",
                  branchName: this.bankForm.branchName
                    ? this.bankForm.branchName
                    : "",
                  province:
                    this.bankForm.address.length > 0
                      ? this.bankForm.address[0]
                      : "",
                  address: address.slice(0, address.length - 1),
                  city:
                    this.bankForm.address.length > 0
                      ? this.bankForm.address[1]
                      : "",
                  county:
                    this.bankForm.address.length > 0
                      ? this.bankForm.address[2]
                      : "",
                  accountName: this.bankForm.accountName
                    ? this.bankForm.accountName
                    : "",
                  bankAccount: this.bankForm.bankAccount
                    ? this.bankForm.bankAccount
                    : "",
                  anchorInfoId: this.$store.state.user.id,
                })
                .then(({ data: res }) => {
                  if (res.code !== 0) {
                    return this.$message.error(res.msg);
                  }
                  this.$http
                    .get(`/sys/anchor/info/getInfoWithAnchor`, { params: { anchorId: this.userId } })
                    .then(({ data: res }) => {
                      if (res.code !== 0) {
                        return this.$message.error(res.msg);
                      }
                      this.anchorDetails = res.data;
                    });
                  this.dialogVisible_editBank = false;
                  this.$message.success("修改成功!");
                })
                .catch((error) => {
                  this.$message.error(error.msg || error.error);
                });
            })
            .catch((err) => {
              console.log(err);
              this.$message.info("已取消修改");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //提现
    withdrawMoney() {
      // 企业银行账号核验中不可申请提现
      if (this.anchorDetails.haveApplyInfo && this.anchorDetails.userType == 2) {
        return this.$confirm("您的银行账号正在核验中，不可申请提现", "提示", {
          confirmButtonText: "确认",
          showCancelButton: false,
          showClose: false
        }).catch(() => { })
      }

      this.$router.push({ path: 'anchorManagement-anchorDetails-withdraw' })

      // this.dialogVisible_withdraw = true;
    },
    // 关闭提现
    closeWithdrawHandle() {
      this.withdrawForm.amount = 0;
      this.withdrawForm.invoiceList = [];
      this.$refs.withdrawForm_host.clearValidate();
    },
    // 超出上传数量
    uploadExceed() {
      this.$message.error(`只能上传${this.invoiceLimit}张发票`);
    },
    // 图片上传成功的回调
    uploadSuccess(res, file, fileList) {
      if (res.code === 0) {
        this.withdrawForm.invoiceList = fileList;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 图片上传出错的回调
    uploadError(err, file) {
      this.$message.error("上传失败！");
    },
    // 图片上传之前的回调
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 20MB!");
      }
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      if (!isJPG) {
        this.$message.error("上传发票图片格式为 jpg,jpeg,png,gif");
      }
      return isJPG && isLt2M;
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible_preview = true;
    },
    // 删除之前
    beforeRemove() {
      return new Promise((resolve, reject) => {
        this.$confirm("是否删除图片?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
            reject();
          });
      });
    },
    // 移除文件
    onRemove(file, fileList) {
      this.withdrawForm.invoiceList = this.withdrawForm.invoiceList.filter(
        (item) => {
          if (item.uid && item.uid != file.uid) {
            return item;
          } else if (item.url != file.url) {
            return item;
          }
        }
      );
    },
    subimtWithdraw() {
      if (this.withdrawForm.invoiceList.length <= 0)
        return this.$message.error("请上传发票图片");
      this.$refs.withdrawForm_host.validate((valid) => {
        if (valid) {
          let imgUrls = this.withdrawForm.invoiceList.map((item) => {
            if (item.response) {
              return item.response.data.url;
            } else {
              return item.url;
            }
          });
          imgUrls = imgUrls.join(",");
          this.$http
            .post("/sys/anchorWithdraw", {
              amount: this.withdrawForm.amount,
              fileName: imgUrls,
              uuid: getUUID(),
            })
            .then(({ data: res }) => {
              if (res.code == 0) {
                this.$message.success("申请提现成功");
                this.dialogVisible_withdraw = false;
                this.getAccountAmount();
                this.queryPost_dia();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => { });
        }
      });
    },

    // 查看发票
    previewInvoiceImg({ fileName }) {
      this.previewInvoiceList = fileName ? fileName.split(",") : [];
      this.dialogVisible_previewList = true;
    },
    closeUpdateInvoiceImgHandle() {
      this.withdrawForm.invoiceList = [];
    },
    // 重新上传发票
    updateInvoiceImg(row) {
      this.dialogVisible_updateInvoiceImg = true;
      this.updateInvoiceId = row.id;
    },
    // 重新上传发票提交
    updateInvoiceImgSubmit() {
      let imgUrls = this.withdrawForm.invoiceList.map((item) => {
        if (item.response) {
          return item.response.data.url;
        } else {
          return item.url;
        }
      });
      imgUrls = imgUrls.join(",");
      this.$http
        .put("/sys/anchorWithdraw", {
          id: this.updateInvoiceId,
          fileName: imgUrls,
        })
        .then(({ data: res }) => {
          if (res.code == 0) {
            this.$message.success("重新上传成功");
            this.dialogVisible_updateInvoiceImg = false;
            this.queryPost_dia();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => { });
    },
    //查看提现详情
    previewInvoice(id, withdrawStatus) {
      this.$router.push({
        path: 'anchorManagement-anchorDetails-withdrawDetail',
        query: {
          id: id,
          withdrawStatus: withdrawStatus
        }
      })
    }
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

  .accountStatus {
    display: inline-block;
    line-height: 20px;
    padding: 0 6px;
    background: #E6A23C;
    color: #fff;
    margin-left: 10px;
  }
}

.diaBoxLeft_mes {
  padding: 0 10px 20px;
  border-bottom: 1px solid #E2E5EA;

  .avatar {
    width: 110px;
    height: 110px;
    position: relative;
    margin: 0 auto;
    margin-bottom: 30px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }

    .role {
      width: 94px;
      line-height: 26px;
      color: #fff;
      background: rgba(0, 0, 0, 0.7);
      text-align: center;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      font-size: 14px;
    }
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
  position: relative;
  bottom: -2px;
  border-bottom: 2px solid #4057CB;

}

/deep/.frontCoverImg {
  width: 100%;
  height: 80px;
}

/deep/.el-autocomplete {
  width: 100% !important;
}

.withdraw_bank_info {
  .header {
    width: 120px;
    text-align: right;
    padding-right: 12px;
  }

  &>div {
    margin-top: 10px;
  }

  &>div:not(:first-child) {
    text-indent: 120px;
  }
}

/deep/.uploadStyle {
  .el-upload--picture-card {
    width: 90px;
    height: 90px;
  }

  .el-upload-list--picture-card>li {
    width: 90px;
    height: 90px;
  }

  .el-progress {
    width: 90px;
    height: 90px;
  }

  .el-progress-circle {
    width: 100% !important;
    height: 100% !important;
  }

  .uploadStyle-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;

    span {
      line-height: normal;
      display: inline-block;
      margin-top: 10px;
    }
  }
}

.previewInvoiceList {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  img {
    width: 30%;
    height: 100px;
    object-fit: contain;
    margin-top: 10px;
    cursor: pointer;

    &:not(:nth-child(3n)) {
      margin-right: 5%;
    }

    &:hover {
      border: 1px solid #999;
    }
  }
}

/deep/.change-dialog {
  .el-dialog {
    width: 30%;
  }
}

.headerTool-handle-btns {
    display: flex;
    justify-content: space-between;
    .el-form-item{
      margin: 0;
    }
}
</style>