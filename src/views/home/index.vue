<template>
<div class="app-container">
    <h3>平台动态信息</h3>
    <div class="handle-box">
       <el-input
        v-model="searchInfo.operationObject"
        placeholder="操作对象"
        class="handle-input mr10"
        clearable
      ></el-input>
      <el-input
        v-model="searchInfo.description"
        placeholder="操作内容"
        class="handle-input mr10"
        clearable
      ></el-input>
       <el-button
          @click="handleResetSearch"
          type="primary"
          icon="el-icon-delete"
          >重置</el-button>
      <el-button
        @click="search"
        type="primary"
        icon="el-icon-search"
      >查询</el-button>
    </div>
    <!-- <div style="padding: 20px">
        <i class="el-icon-tickets"></i>
    <span>数据列表</span>
    </div> -->

    <el-card class="operate-container" shadow="never" style="margin-bottom: 20px">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#fff"
        :row-style="{height:'10px'}"
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column prop="id" label="编号" show-overflow-tooltip width="180" align="center"></el-table-column>
        <el-table-column prop="types" label="操作类型" show-overflow-tooltip width="180" align="center"></el-table-column>
        <el-table-column prop="operationObject" label="操作对象" show-overflow-tooltip width="180" align="center"></el-table-column>
        <el-table-column prop="description" label="操作内容" show-overflow-tooltip width="180" align="center"></el-table-column>
        <el-table-column prop="time" label="日期" show-overflow-tooltip width="180" align="center"></el-table-column>
        <el-table-column prop="user.username" label="操作人" show-overflow-tooltip width="180" align="center"></el-table-column>
  </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes,prev, pager, next,jumper"
        :page-sizes="[10, 50, 100]"
        :page-size="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :total="total"
      ></el-pagination>
    </div>
</div>
</template>

<script>
  import {getProjectdynamic} from '@/api/api'
  export default {
    data(){
      return {
         tableData: [],
         loading: true,
         currentPage: 1,
         pageSize: 10,
         total: 0,
         listQuery: {
            pageNum: 1,
            pageSize: 10
         },
         searchInfo1: '', //搜索信息，用户输入的
         searchInfo: {
             operationObject: '', 
             description: ''
             },
         searchs: {}, //最终确定的搜索信息，需要处理过
    }
},
    created(){
      this.loading = true;
      getProjectdynamic(this.listQuery).then(response => {
          this.loading = false;
          this.tableData = response.data;
          this.total = response.count;
        })
    },
    methods:{
        getdata(){
            this.loading = true;
            getProjectdynamic({ pageNum: this.currentPage, pageSize: this.pageSize, operationObject: 
            this.searchInfo.operationObject ,description: this.searchInfo.description }).then(response => {
               this.loading = false;
               this.tableData = response.data;
               this.total = response.count;
            //    console.log(response);
        })
        },
        // 搜索
        search () {
            this.currentPage = 1;
            this.searchs = this.searchInfo;
            this.getdata();
        },
        // 分页相关
       handleSizeChange (val) {
            this.currentPage = 1;
            this.pageSize = val;
            this.getdata();
       },
        handleCurrentChange (val) {
            this.currentPage = val;
            this.getdata();
       },

        handleResetSearch() {
            this.searchInfo.operationObject = '';
            this.searchInfo.description  = '';
      },


    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.mt10 {
  margin-top: 10px;
}

.handle-input {
  width: 200px;
  display: inline-block;
  margin-right: 10px;
}

.app-container{
    background-color: #fff;
    margin: 10px 10px 0;
    padding: 30px 30px 20px;
    min-width: 1000px;
}

.table {
  width: 100%;
  font-size: 14px;
  line-height: 30px;
}

</style>