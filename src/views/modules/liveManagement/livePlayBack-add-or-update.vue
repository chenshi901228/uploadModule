<template>
    <el-dialog 
        :visible.sync="visible" 
        :title="!dataForm.id ? $t('add') : $t('update')" 
        :close-on-click-modal="false" 
        :close-on-press-escape="false">
    </el-dialog>
</template>