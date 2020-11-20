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
                        label="项目名称：">
            <el-input v-model="listQuery.name"
                      class="input-width"
                      placeholder="活动名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label-width="88px"
                        label="项目编号：">
            <el-input v-model="listQuery.sn"
                      class="input-width"
                      placeholder="项目编号"
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
                 @click="handleAdd()">添加项目</el-button>
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
        <el-table-column type="index"
                         label="序号"
                         width="50"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="name"
                         min-width="120"
                         label="项目名称"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="sn"
                         min-width="80"
                         label="项目编号"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="open_time"
                         min-width="100"
                         label="项目开始日期"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="close_time"
                         min-width="100"
                         label="项目结束日期"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="desc"
                         min-width="100"
                         label="项目描述"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="members"
                         min-width="100"
                         label="项目成员"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="m_time"
                         min-width="100"
                         label="更新时间"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="create_time"
                         min-width="100"
                         label="项目创建时间"
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
    <el-dialog :title="`项目${isEdit?'编辑':'新增'}`"
               :visible.sync="dialogVisible"
               center
               @close="cancelEdit"
               width="40%">
      <el-form :model="projectPromotion"
               ref="projectPromotionForm"
               label-width="150px"
               :rules="rules"
               size="small">
        <el-form-item prop="name"
                      label="项目名称：">
          <el-input v-model="projectPromotion.name"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="项目编号：">
          <el-input v-model="projectPromotion.sn"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item prop="open_time"
                      label="项目开始日期：">
          <el-date-picker v-model="projectPromotion.open_time"
                          :picker-options="pickerOptions"
                          value-format="yyyy-MM-dd"
                          type="date"
                          placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="close_time"
                      label="项目结束日期：">
          <el-date-picker v-model="projectPromotion.close_time"
                          value-format="yyyy-MM-dd"
                          type="date"
                          :picker-options="pickerOptions"
                          placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目描述：">
          <el-input v-model="projectPromotion.desc"
                    style="width: 250px"></el-input>
        </el-form-item>

        <el-form-item label="项目成员：">
          <el-input v-model="projectPromotion.members"
                    style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false"
                   size="small">取 消</el-button>
        <el-button type="primary"
                   @click="handleDialogConfirm()"
                   size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getProjectList,
  createProject,
  updataProject,
  delProject
} from '@/api/api'
import { formatDate } from '@/utils/date'
import { Message, MessageBox } from 'element-ui'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: '',
  sn: ''
}
const defaultprojectPromotion = {
  id: null,
  name: null,
  sn: null,
  open_time: null,
  close_time: null,
  desc: null,
  members: null
}
export default {
  name: 'projectPromotionList',
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      searchs: {}, //最终确定的搜索信息，需要处理过
      listLoading: false,
      dialogVisible: false,
      projectPromotion: Object.assign({}, defaultprojectPromotion),
      isEdit: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      rules: {
        name: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' },
          { max: 10, message: '最多可输入100个字符', trigger: 'blur' }
        ],
        open_time: [
          { required: true, message: '开始日期必输', trigger: 'blur' }
        ],
        close_time: [{ required: true, message: '结束日必输', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.listLoading = true
    getProjectList(this.listQuery).then(response => {
      this.listLoading = false
      this.list = response.data
      this.total = response.count
    })
  },
  filters: {
    formatDate(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  methods: {
    getData() {
      this.listLoading = true
      getProjectList({
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        name: this.listQuery.name,
        sn: this.listQuery.sn
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
      this.isEdit = false
      this.projectPromotion = Object.assign({}, defaultprojectPromotion)
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
      this.$confirm('是否要删除该项目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delProject(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(()=>{})
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.projectPromotion = Object.assign({}, row)
    },
    handleDialogConfirm() {
      if (this.isEdit) {
        this.$refs.projectPromotionForm.validate(valid => {
          if (valid) {
            updataProject(this.projectPromotion.id, this.projectPromotion).then(
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
        this.$refs.projectPromotionForm.validate(valid => {
          if (valid) {
            createProject(this.projectPromotion).then(response => {
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
    // 清空验证信息
    cancelEdit() {
      this.$refs.projectPromotionForm.clearValidate()
    },

    qhandleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updataProject(this.projectPromotion.id, this.projectPromotion).then(
            response => {
              if ('id' in response) {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                })
                this.dialogVisible = false
                this.getData()
              } else {
                Message({
                  message: response.name[0],
                  type: 'error',
                  duration: 3 * 1000
                })
              }
            }
          )
        } else {
          createProject(this.projectPromotion).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.getData()
          })
        }
      })
    }
  }
}
</script>
<style></style>


