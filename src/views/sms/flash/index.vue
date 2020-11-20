<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <!-- <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button> -->
        <!-- <el-button
            @click="search"
            type="primary"
            icon="el-icon-search"
            size="small"
            style="float:right"
         >查询</el-button>
        <el-button
          @click="handleResetSearch"
          type="primary"
          style="float:right;margin-right: 15px"
          size="small"
          icon="el-icon-delete"
        >重置</el-button> -->
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" >
          <el-form-item label-width="140px" label="活动名称：">
            <el-input v-model="listQuery.name" class="input-width" placeholder="活动名称"  clearable></el-input>
          </el-form-item>
        <el-form-item label-width="88px" label="项目编号：">
            <el-input v-model="listQuery.sn" class="input-width" placeholder="项目编号" clearable></el-input>
        </el-form-item>
        <el-button
          @click="handleResetSearch"
          type="primary"
          size="small"
          icon="el-icon-delete"
        >重置</el-button>
          <el-button
            @click="search"
            type="primary"
            icon="el-icon-search"
            size="small"
         >查询</el-button>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button type="primary" icon="el-icon-plus" style="float:right;margin-bottom:18px"
      @click="handleAdd()" >添加项目</el-button>
      <!-- <el-button size="mini" class="btn-add" @click="handleShowSessionList()">秒杀时间段列表</el-button> -->
    </el-card>
    <div class="table-container">
      <el-table ref="flashTable"
                :data="list"
                style="width: 100%;"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="#fff"
                v-loading="listLoading" 
                :row-style="{height:'10px'}"
                border>
        <el-table-column type="index" label="序号" width="50" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="name" min-width="120" label="项目名称" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="sn" min-width="80" label="项目编号" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="open_time" min-width="100" label="项目开始日期" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="close_time" min-width="100" label="项目结束日期" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="desc" min-width="100" label="项目描述" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="members" min-width="100" label="项目成员" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="m_time" min-width="100" label="更新时间" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="create_time" min-width="100" label="项目创建时间" show-overflow-tooltip align="center"></el-table-column>
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="活动标题" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="活动状态" width="140" align="center">
          <template slot-scope="scope">{{scope.row |formatActiveStatus}}</template>
        </el-table-column>
        <el-table-column label="开始时间" width="140" align="center">
          <template slot-scope="scope">{{scope.row.startDate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="结束时间" width="140" align="center">
          <template slot-scope="scope">{{scope.row.endDate | formatDate}}</template>
        </el-table-column> -->
        <!-- <el-table-column label="上线/下线" width="200" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <!-- <el-button size="mini"
                       type="text"
                       @click="handleSelectSession(scope.$index, scope.row)">设置商品
            </el-button> -->
            <el-button
                       type="text"
                       icon="el-icon-edit"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button 
                       type="text"
                       icon="el-icon-delete"
                       class="red"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,50,100]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="添加项目"
      :visible.sync="dialogVisible"
      center
      width="40%">
      <el-form :model="flashPromotion"
               ref="flashPromotionForm"
               label-width="150px" size="small">
        <el-form-item label="项目名称：">
          <el-input v-model="flashPromotion.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="项目编号：">
          <el-input v-model="flashPromotion.sn" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="项目开始日期：">
          <el-date-picker
            v-model="flashPromotion.open_time"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目结束日期：">
          <el-date-picker
            v-model="flashPromotion.close_time"
            value-format="yyyy-MM-dd"
            type="date"
            :picker-options="pickerOptions"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目描述：">
          <el-input v-model="flashPromotion.desc" style="width: 250px"></el-input>
        </el-form-item>

        <el-form-item label="项目成员：">
          <el-input v-model="flashPromotion.members" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchList, updateStatus, deleteFlash, createFlash, updateFlash} from '@/api/flash';
  import {getProjectList, createProject, updataProject, delProject} from '@/api/api';
  import {formatDate} from '@/utils/date';
  import { Message, MessageBox } from 'element-ui';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    name: '',
    sn: ''
  };
  const defaultFlashPromotion = {
    id: null,
    name: null,
    sn: null,
    open_time: null,
    close_time: null,
    desc: null,
    members: null
  };
  export default {
    name: 'flashPromotionList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        searchs: {}, //最终确定的搜索信息，需要处理过
        listLoading: false,
        dialogVisible: false,
        flashPromotion: Object.assign({}, defaultFlashPromotion),
        isEdit: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
          }
    }},
    created() {
        this.listLoading = true;
        getProjectList(this.listQuery).then(response =>{
            this.listLoading = false;
            this.list = response.data;
            this.total = response.count;
        })
    },
    filters: {
      formatActiveStatus(row) {
        let nowTime = new Date().getTime();
        if (nowTime >= row.startDate && nowTime <= row.endDate) {
          return '活动进行中';
        } else if (nowTime > row.endDate) {
          return '活动已结束';
        } else {
          return '活动未开始';
        }
      },
      formatDate(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    methods: {
        getData(){
            this.listLoading= true;
            getProjectList({pageNum: this.listQuery.pageNum, pageSize: this.listQuery.pageSize, name: this.listQuery.name, 
            sn: this.listQuery.sn }).then(response =>{
                this.listLoading = false;
                this.list = response.data;
                this.total = response.count;
        })
        },
      
      // 重置
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },

      // 搜索
      search () {
        this.listQuery.pageNum = 1;
        this.searchs = this.listQuery;
        console.log(this.listQuery)
        this.getData();
        },
        // 分页相关操作
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getData();
      },

      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.flashPromotion = Object.assign({},defaultFlashPromotion);
      },

      handleStatusChange(index, row) {
        this.$confirm('是否要修改该状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatus(row.id, {status: row.status}).then(response => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });
          this.getData();
        });
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该项目?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delProject(row.id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getData();
          });
        });
      },
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.flashPromotion = Object.assign({},row);
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            updataProject(this.flashPromotion.id,this.flashPromotion).then(response => {
              if ('id' in response){
                this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getData();
              }else{
                Message({
                message: response.name[0],
                type: 'error',
                duration: 3 * 1000
                })
              }
            })
          } else {
            createProject(this.flashPromotion).then(response => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getData();
            })
          }
        })
      },
      handleSelectSession(index,row){
        this.$router.push({path:'/sms/selectSession',query:{flashPromotionId:row.id}})
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      }
    }
  }
</script>
<style></style>


