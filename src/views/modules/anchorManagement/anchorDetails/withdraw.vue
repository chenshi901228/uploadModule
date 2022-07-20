// 申请提现

<template>
  <el-card shadow="never" class="aui-card--fill">
    <!-- <div class="mod-live__liveList">
        <el-form
        :model="withdrawForm"
        :rules="dataRule_withdraw"
        ref="withdrawForm_host"
        label-width="120px"
        size="small"
      >
        <el-form-item label="可提现金额：">
          <div>{{ anchorDetails.anchorBalance || 0 }}</div>
        </el-form-item>
        <el-form-item label="申请提现金额：" prop="amount">
          <div style="display: inline-block">
            <el-input-number
              v-model="withdrawForm.amount"
              :controls="false"
              :precision="2"
              placeholder="请输入"
              :min="0"
            >
            </el-input-number>
          </div>
          <span>（提现金额需大于100元）</span>
        </el-form-item>
        <el-form-item label="上传发票：">
          <el-upload
            class="uploadStyle"
            list-type="picture-card"
            :action="uploadUrl"
            :limit="invoiceLimit"
            multiple
            :file-list="withdrawForm.invoiceList"
            :before-upload="beforeUpload"
            :on-remove="onRemove"
            :on-exceed="uploadExceed"
            :on-error="uploadError"
            :before-remove="beforeRemove"
            :on-success="uploadSuccess"
            :on-preview="handlePictureCardPreview"
          >
            <div class="uploadStyle-btn">
              <i class="el-icon-plus"></i>
              <span
                >{{ withdrawForm.invoiceList.length }} /
                {{ invoiceLimit }}</span
              >
            </div>
            <div class="el-upload__tip" slot="tip">注：点击图片可放大查看</div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible_Image">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <div class="withdraw_bank_info">
          <div class="header">提现至：</div>
          <div>开户银行：{{ anchorDetails.depositBank || '-'  }}</div>
          <div>支行名称：{{ anchorDetails.branchName || '-'  }}</div>
          <div>账号名称：{{ anchorDetails.accountName || '-'  }}</div>
          <div>银行账户：{{ anchorDetails.bankAccount || '-'  }}</div>
          <div>开户行所在地：{{ anchorDetails.address || '-' }}</div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible_withdraw = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="subimtWithdraw"
          >确 定</el-button
        >
      </span>
    </div> -->
  </el-card>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
        withdrawForm: {
        amount: 0,
        invoiceList: [], //发票上传图片
      },
    };
  },
  watch: {
   
  },
  computed: {},
  created() {
    
  },
  methods: {
   
    
  },
};
</script>
<style lang="scss" scoped>
.mod-live__liveList {
  
}
</style>