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
                        label="用例名称：">
            <el-input v-model="listQuery.name"
                      class="input-width"
                      placeholder="用例名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label-width="118px"
                        label="用例状态：">
            <el-select v-model="listQuery.status"
                       clearable
                       class="input-width"
                       placeholder="请选择用例状态 ">
              <el-option v-for="item in statusOpt"
                         :key="item.status"
                         :label="item.label"
                         :value="item.status"></el-option>
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
    <el-card class="operate-container"
             shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button type="primary"
                 icon="el-icon-plus"
                 style="float:right;margin-bottom:18px"
                 @click="handleAdd()">添加环境</el-button>
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
                         min-width="140"
                         label="环境名称"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="host"
                         min-width="130"
                         label="IP/域名"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="port"
                         min-width="80"
                         label="端口"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="type"
                         min-width="80"
                         label="环境类型"
                         show-overflow-tooltip
                         align="center">
          <!-- <template v-slot="scope">
          <span>{{scope.type | typeToString}}</span>
        </template> -->
          <template slot-scope="scope">{{scope.row.type | typeToString}}</template>
        </el-table-column>
        <el-table-column prop="status"
                         min-width="80"
                         label="环境使用状态"
                         show-overflow-tooltip
                         align="center">
          <template slot-scope="scope">{{scope.row.status | statusToString}}</template>

        </el-table-column>
        <el-table-column prop="desc"
                         min-width="110"
                         label="环境描述"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="m_time"
                         min-width="133"
                         label="更新时间"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="create_time"
                         min-width="133"
                         label="环境创建时间"
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
    <el-dialog :title="`环境${isEdit?'编辑':'新增'}`"
               :visible.sync="dialogVisible"
               center
               @close="cancelEdit"
               width="40%">
      <el-form :model="flashPromotion"
               :rules="rules"
               ref="flashPromotion"
               label-width="150px"
               size="small">
        <el-form-item prop="name"
                      label="环境名称：">
          <el-input v-model="flashPromotion.name"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item prop="host" label="IP/域名：">
          <el-input v-model="flashPromotion.host"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="端口：">
          <el-input v-model="flashPromotion.port"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="环境类型：">
          <!-- <el-input v-model="flashPromotion.type"
                    style="width: 250px"> -->
          <el-select v-model="flashPromotion.type"
                     clearable
                     placeholder="请选择环境类型 "
                     style="width: 250px">
            <el-option v-for="item in typtOpt"
                       :key="item.type"
                       :label="item.label"
                       :value="item.type"></el-option>
          </el-select>

        </el-form-item>
        <el-form-item prop="status" label="环境使用状态：">
          <!-- <el-input v-model="flashPromotion.status"
                    style="width: 250px"></el-input> -->
          <el-select v-model="flashPromotion.status"
                     clearable
                     placeholder="请选择环境状态 "
                     style="width: 250px">
            <el-option v-for="item in statusOpt"
                       :key="item.status"
                       :label="item.label"
                       :value="item.status"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="环境描述：">
          <el-input v-model="flashPromotion.desc"
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
import { getEnvList, createEnv, updataEnv, delEnv } from '@/api/api'
import { formatDate } from '@/utils/date'
import { Message, MessageBox } from 'element-ui'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: '',
  status: null
}
const defaultFlashPromotion = {
  id: null,
  name: '',
  status: null,
  host: null,
  port: null,
  desc: null,
  type: null
}

const typtOpt = [
  { type: 1, label: '开发环境' },
  { type: 2, label: '测试环境' },
  { type: 3, label: '预发布环境' },
  { type: 4, label: '生产环境' }
]
const statusOpt = [
  { status: 1, label: '已禁用' },
  { status: 2, label: '未禁用' }
]
export default {
  name: 'caseList',
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      searchs: {}, //最终确定的搜索信息，需要处理过
      listLoading: false,
      dialogVisible: false,
      flashPromotion: Object.assign({}, defaultFlashPromotion),
      isEdit: false, // true编辑，false新增
      typtOpt: typtOpt,
      statusOpt: statusOpt,
      rules: {
        name: [
          { required: true, message: '环境名称不能为空', trigger: 'blur' },
          { max: 10, message: '最多可输入10个字符', trigger: 'blur' }
        ],
        status: [ { required: true, message: '环境状态必输', trigger: 'blur' } ],
        type: [{ required: true, message: '环境类型必输', trigger: 'blur' }],
        host: [{ required: true, message: 'IP/域名必输', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.listLoading = true
    getEnvList(this.listQuery).then(response => {
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
    },
    typeToString(val) {
      switch (val) {
        case 1:
          return '开发环境'
          break
        case 2:
          return '测试环境'
          break
        case 3:
          return '预发布环境'
          break
        case 4:
          return '生产环境'
          break
        default:
          return '测试环境'
      }
    },
    statusToString(val) {
      switch (val) {
        case 1:
          return '已禁用'
          break
        case 2:
          return '未禁用'
          break
        default:
          return '未禁用'
      }
    }
  },
  methods: {
    getData() {
      this.listLoading = true
      getEnvList({
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        name: this.listQuery.name,
        status: this.listQuery.status
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
    //   console.log(this.listQuery)
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
      this.flag = false
      this.flashPromotion = Object.assign({}, defaultFlashPromotion)
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
      this.$confirm('是否要删除该环境?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delEnv(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            center: true
          })
          this.getData()
        })
      })
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.flag = true
      this.flashPromotion = Object.assign({}, row)
    },

    // 清空验证信息
    cancelEdit() {
      this.$refs.flashPromotion.clearValidate()
    },

    handleDialogConfirm() {
      if (this.isEdit) {
        this.$refs.flashPromotion.validate(valid => {
          if (valid) {
            updataEnv(this.flashPromotion.id, this.flashPromotion).then(
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
        this.$refs.flashPromotion.validate(valid => {
          if (valid) {
            createEnv(this.flashPromotion).then(response => {
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
    }
  }
}
</script>
<style></style>


