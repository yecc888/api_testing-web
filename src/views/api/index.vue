<template> 
  <div class="app-container">
   <el-card class="filter-container"
             shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true"
                 :model="listQuery"
                 size="small">
          <el-form-item label-width="140px"
                        label="接口名称：">
            <el-input v-model="listQuery.name"
                      class="input-width"
                      placeholder="接口名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label-width="118px"
                        label="所属模块：">
            <el-select v-model="listQuery.model__name"
                       clearable
                       class="input-width"
                       placeholder="请选择模块 ">
              <el-option v-for="item in model_list"
                         :key="item.id"
                         :label="item.name"
                         :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-button @click="handleResetSearch"
                     type="primary"
                     size="small"
                     icon="el-icon-delete">重置</el-button>
          <el-button @click="search"
                     type="primary"
                     icon="el-icon-search"
                     size="small">查询</el-button>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
        <el-button type="primary"
                 icon="el-icon-plus"
                 style="float:right;margin-bottom:18px"
                 @click="handleAdd()">添加接口</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="apiTable"
                :data="list"
                style="width: 100%;"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="#fff"
                v-loading="listLoading"
                :row-style="{height:'10px'}"
                border>
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="接口ID"
                         width="50"
                         show-overflow-tooltip
                         align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
                         </el-table-column>
        <el-table-column prop="name"
                         min-width="120"
                         label="接口名称"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="url"
                         min-width="120"
                         label="接口路径"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="protocol"
                         min-width="60"
                         label="协议类型"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="method"
                         min-width="60"
                         label="请求方法"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column label="接口状态" width="60" align="center">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column label="加密状态" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sign | formatSign}}</template>
        </el-table-column>
                <el-table-column prop="model.name"
                         min-width="100"
                         label="所属模块"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <!-- <el-table-column prop="desc" label="接口描述" width="100" align="center"> -->
        </el-table-column>
        <el-table-column prop="m_time"
                         min-width="132"
                         label="更新时间"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="create_time"
                         min-width="132"
                         label="创建时间"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleView(scope.$index, scope.row)">复制</el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑</el-button>
            <el-button size="mini"
                       type="text"
                       class="red"
                       @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     layout="total, sizes,prev, pager, next,jumper"
                     :current-page.sync="listQuery.pageNum"
                     :page-size="listQuery.pageSize"
                     :page-sizes="[10,50,100]"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import apiDetail from './components/apiDetail'
  import { getInterfaceList,delInterface,getModelList } from '@/api/api';
  import {formatDate} from '@/utils/date';
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    name: null,
    model__name: null
  };
  
  export default {
    name:'apiList',
    data() {
      return {
        listQuery:Object.assign({},defaultListQuery),
        list:null,
        total:null,
        model_list :[],
        searchs: {},
        listLoading:false,
        isEdit:false
      }
    },
    created(){
        this.listLoading = true
        getInterfaceList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data
        this.total = response.count
    },
        this.getModel()
    )

},
    filters:{
      formatStatus(status){
        if(status===1){
          return '可用';
        }else if(status===1){
          return '禁用';
        }else{
          return '可用';
        }
      },
    formatSign(sign){
        if(sign===1){
          return '不加密';
        }else if(sign===2){
          return '加密';
        }else{
          return '不加密';
        }
      },
    },
    methods:{

     getData(){
         this.listLoading = true
         getInterfaceList({pageNum: this.listQuery.pageNum, model__name:this.listQuery.model__name,
         pageSize: this.listQuery.pageSize, name: this.listQuery.name}).then(response=>{
            this.listLoading = false
            this.list = response.data
            this.total = response.count
        })
        },
    getModel(){
        getModelList({pageNum: 1, pageSize: 100 }).then(response => {
        this.model_list = response.data
      })
    },
      // 重置
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    },

    // 搜索
    search() {
      this.listQuery.pageNum = 1
      this.searchs = this.listQuery
      console.log(this.listQuery)
      this.getData()
    },
    // 分页相关操作
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getData()
    },
      handleAdd(){
        this.$router.push({path: '/api/addApi'})
      },
      handleView(index, row) {
        this.$router.push({path: '/api/copyapi', query: {id: row.id}})
      },
      handleUpdate(index, row) {
        this.$router.push({path: '/api/updateApi', query: {id: row.id}})

      },
      handleDelete(index, row) {
        this.$confirm('是否进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delInterface(row.id).then(response=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getData();
          });
        }).catch(()=>{})
      },
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


