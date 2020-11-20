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
                        label="用户名称：">
            <el-input v-model="listQuery.username"
                      class="input-width"
                      placeholder="用户名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label-width="88px"
                        label="手机号：">
            <el-input v-model="listQuery.mobile"
                      class="input-width"
                      placeholder="手机号"
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
                 @click="handleAdd()">添加用户</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="userTable"
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
        <el-table-column prop="username"
                         min-width="140"
                         label="用户名称"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="mobile"
                         min-width="130"
                         label="手机号"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="email"
                         min-width="80"
                         label="邮箱"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="user_roles"
                         min-width="80"
                         label="用户类型"
                         show-overflow-tooltip
                         align="center">
          <!-- <template v-slot="scope">
          <span>{{scope.type | typeToString}}</span>
        </template> -->
          <template slot-scope="scope">{{scope.row.user_roles | roleToString}}</template>
        </el-table-column>
        <el-table-column prop="create_time"
                         min-width="133"
                         label="用户创建时间"
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
    <el-dialog :title="`用户${isEdit?'编辑':'新增'}`"
               :visible.sync="dialogVisible"
               center
               @close="cancelEdit"
               width="40%">
      <el-form :model="userPromotion"
               :rules="rules"
               ref="userPromotion"
               label-width="150px"
               size="small">
        <el-form-item prop="username"
                      label="用户名：">
          <el-input v-model="userPromotion.username"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item 
                      label="密码：">

          <el-input name="password"
                    :type="pwdType"
                    v-model="userPromotion.password"
                    autoComplete="on"
                    style="width: 250px"
                    placeholder="请输入密码">
            <span slot="prefix">
              <svg-icon icon-class="password"
                        class="color-main"></svg-icon>
            </span>
            <span slot="suffix"
                  @click="showPwd">
              <svg-icon icon-class="eye"
                        class="color-main"></svg-icon>
            </span>
          </el-input>

          <!-- <el-input v-model="userPromotion.password" show-password = "true" autocomplete = "on" type = "password"
                    style="width: 250px"></el-input> -->
        </el-form-item>

        <el-form-item prop="mobile"
                      label="手机号：">
          <el-input v-model="userPromotion.mobile"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="userPromotion.email"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item prop="user_roles"
                      label="用户类型：">
          <!-- <el-input v-model="userPromotion.type"
                    style="width: 250px"> -->
          <el-select v-model="userPromotion.user_roles"
                     clearable
                     placeholder="请选择用户类型 "
                     style="width: 250px">
            <el-option v-for="item in userOpt"
                       :key="item.type"
                       :label="item.label"
                       :value="item.type"></el-option>
          </el-select>
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
import { getUserList, createUser, updataUser, delUser } from '@/api/api'
import { formatDate } from '@/utils/date'
import { Message, MessageBox } from 'element-ui'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  username: '',
  mobile: null
}
const defaultuserPromotion = {
  id: null,
  username: '',
  mobile: null,
  password: null,
  email: null,
  user_roles: null
}

const userOpt = [
  { type: 1, label: '开发用户' },
  { type: 2, label: '测试用户' }
]

export default {
  name: 'userPromotionList',
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      pwdType: 'password',
      total: null,
      searchs: {}, //最终确定的搜索信息，需要处理过
      listLoading: false,
      dialogVisible: false,
      userPromotion: Object.assign({}, defaultuserPromotion),
      isEdit: false, // true编辑，false新增
      userOpt: userOpt,
      rules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' },
          { max: 10, message: '最多可输入30个字符', trigger: 'blur' }
        ],
        mobile: [{ required: true, message: '手机号必输', trigger: 'blur' },
        { min: 11,max:11, message: '输入11个数字', trigger: 'blur' }],
        user_roles: [
          { required: true, message: '用户类型必输', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码必输', trigger: 'blur' },
        { min: 6, message: '最少输入6个字符', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.listLoading = true
    getUserList(this.listQuery).then(response => {
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

    roleToString(val) {
      switch (val) {
        case 1:
          return '开发用户'
          break
        case 2:
          return '测试用户'
          break
        default:
          return '测试用户'
      }
    }
  },
  methods: {
    getData() {
      this.listLoading = true
      getUserList({
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        username: this.listQuery.username,
        mobile: this.listQuery.mobile
      }).then(response => {
        this.listLoading = false
        this.list = response.data
        this.total = response.count
      })
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
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
      this.userPromotion = Object.assign({}, defaultuserPromotion)
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
      this.$confirm('是否要删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            center: true
          })
          this.getData()
        })
      }).catch(()=>{})
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.flag = true
      this.userPromotion = Object.assign({}, row)
    },

    // 清空验证信息
    cancelEdit() {
      this.$refs.userPromotion.clearValidate()
    },

    handleDialogConfirm() {
      if (this.isEdit) {
        this.$refs.userPromotion.validate(valid => {
          if (valid) {
            updataUser(this.userPromotion.id, this.userPromotion).then(
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
        this.$refs.userPromotion.validate(valid => {
          if (valid) {
            createUser(this.userPromotion).then(response => {
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


