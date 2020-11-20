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
                        label="模块名称：">
            <el-input v-model="listQuery.name"
                      class="input-width"
                      placeholder="模块名称"
                      clearable></el-input>
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
    <el-card class="operate-container"
             shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button type="primary"
                 icon="el-icon-plus"
                 style="float:right;margin-bottom:18px"
                 @click="handleAdd()">添加模块</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="modelTable"
                :data="list"
                style="width: 100%;"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="#fff"
                v-loading="listLoading"
                :row-style="{height:'10px'}"
                border>
        <el-table-column type="index"
                         label="序号"
                         width="50"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="name"
                         min-width="120"
                         label="模块名称"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="parent_model.name"
                         min-width="110"
                         label="上级模块"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="project.name"
                         min-width="100"
                         label="所属项目"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="model_owner"
                         min-width="120"
                         label="模块负责人"
                         show-overflow-tooltip
                         align="center">
        <template slot-scope="scope">{{scope.row.model_owner | formatUsers}}</template>
        </el-table-column>
        <el-table-column prop="desc"
                         min-width="110"
                         label="模块描述"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="m_time"
                         min-width="133"
                         label="更新时间"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="create_time"
                         min-width="133"
                         label="模块创建时间"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column label="操作"
                         width="180"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       icon="el-icon-edit"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button type="text"
                       icon="el-icon-delete"
                       class="red"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
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
    <el-dialog :title="`模块${isEdit?'编辑':'新增'}`"
               :visible.sync="dialogVisible"
               center
               @close="cancelEdit"
               width="40%">
      <el-form :model="modelPromotion"
               :rules="rules"
               ref="modelPromotion"
               label-width="150px"
               size="small">
        <el-form-item prop="name"
                      label="模块名称：">
          <el-input v-model="modelPromotion.name"
                    style="width: 250px"></el-input>
        </el-form-item>

        <el-form-item prop="project" label="所属项目：">
          <el-select v-model="modelPromotion.project"
                     clearable
                     placeholder="请选择所属项目 "
                     style="width: 250px">
            <el-option v-for="(item, index) in projectFomart"
                       :key="index"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>

        </el-form-item>
        <el-form-item  prop="model_owner" label="模块负责人：">
          <el-select v-model="modelPromotion.model_owner"
                     clearable
                     multiple  
                     placeholder="请选择模块负责人 "
                     style="width: 250px">
            <el-option v-for="item in userFomart"
                       :key="item.id"
                       :label="item.username"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
       
        <el-form-item label="上级模块：">
          <el-select v-model="modelPromotion.parent_model"
                     clearable
                     placeholder="请选择上级模块 "
                     style="width: 250px">
            <el-option v-for="(item, index) in parent_modelFomart"
                       :key="index"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="desc" label="模块描述：">
          <el-input v-model="modelPromotion.desc"
                    type="textarea"
                    :rows="4"
                    style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center;">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary"
                   @click="handleDialogConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getModelList, createModel, updataModel, delModel, getUserList, getProjectList } from '@/api/api'
import { formatDate } from '@/utils/date'
import { Message, MessageBox } from 'element-ui'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: '',
}
const defaultModelPromotion = {
  id: null,
  name: '',
  desc: null,
  project: null,
  model_owner: [],
  parent_model: null
}

export default {
  name: 'modelPromotionList',
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      searchs: {}, //最终确定的搜索信息，需要处理过
      listLoading: false,
      dialogVisible: false,
      userFomart: [],
      projectFomart: [],
      parent_modelFomart:[],
      modelPromotion: Object.assign({}, defaultModelPromotion),
      isEdit: false, // true编辑，false新增
      rules: {
        name: [
          { required: true, message: '模块名称不能为空', trigger: 'blur' },
          { max: 10, message: '最多可输入30个字符', trigger: 'blur' }
        ],
        project: [ { required: true, message: '项目必输', trigger: 'blur' } ],
        model_owner: [{ required: true, message: '模块负责人必输', trigger: 'blur' }],
        desc: [{ required: true, message: '环境描述必输', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.listLoading = true
    getModelList(this.listQuery).then(response => {
      this.listLoading = false
      this.list = response.data
      this.total = response.count
      this.parent_modelFomart = response.data
    })
  },
  filters: {
    formatDate(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    },

    // 处理用户显示
    formatUsers(val){
        let tt = [];
        for(var i =0;i<val.length;i++){
                let ss = val[i].username
                tt.push(ss)
        }
        return tt.join();
    }

  },
  methods: {
    getData() {
      this.listLoading = true
      getModelList({
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        name: this.listQuery.name
      }).then(response => {
        this.listLoading = false
        this.list = response.data
        this.total = response.count
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

    handleAdd() {
      this.dialogVisible = true
      this.loadUser()
      this.loadPorject()
      this.isEdit = false
      this.modelPromotion = Object.assign({}, defaultModelPromotion)
    },

    handleStatusChange(index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          updateStatus(row.id, { status: row.status }).then(response => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          })
          this.getData()
        })
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该模块?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delModel(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            center: true
          })
          this.getData()
        })
      })
    },
       formatId(val){
        let tt = [];
        for(var i =0;i<val.length;i++){
                let ss = val[i].id
                tt.push(ss)
        }
        return tt
    }
,
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.loadUser()
      this.loadPorject()
      this.isEdit = true
      this.modelPromotion = Object.assign({}, row)
      let dd = this.formatId(row.model_owner)
      this.modelPromotion.model_owner = dd
    },

    // 清空验证信息
    cancelEdit() {
      this.$refs.modelPromotion.clearValidate()
    },

    handleDialogConfirm() {
      if (this.isEdit) {
        this.$refs.modelPromotion.validate(valid => {
          if (valid) {
            updataModel(this.modelPromotion.id, this.modelPromotion).then(
              response => {
                if ('id' in response) {
                  this.$message({
                    message: '修改成功！',
                    type: 'success',
                    center: true
                  })
                  this.dialogVisible = false
                  this.getData()
                } else {
                  Message({
                    message: response.data,
                    type: 'error',
                    duration: 3 * 1000
                  })
                }
              }
            )
          } else {
            return false
          }
        })
      } else {
        this.$refs.modelPromotion.validate(valid => {
          if (valid) {
            createModel(this.modelPromotion).then(response => {
              if ('id' in response) {
                this.$message({
                  message: '添加成功！',
                  type: 'success',
                  center: true
                })
                this.dialogVisible = false
                this.getData()
              } else {
                Message({
                  message: response.data,
                  type: 'error',
                  duration: 3 * 1000
                })
              }
            })
          } else {
            return false
          }
        })
      }
    },

    loadUser () {
        if (!this.userFomart.length){
            getUserList({pageSize:100}).then (res =>{
                this.userFomart = res.data;
            })
        }else{
            console.log('存在用户数据')
        }
    },
    loadPorject () {
        if (!this.projectFomart.length){
            getProjectList({pageSize:100}).then(res =>{
                this.projectFomart = res.data
                console.log(this.projectFomart)
            })
        }else{
            console.log('已经存在项目')
        }
    } 
  }
}
</script>
<style></style>


