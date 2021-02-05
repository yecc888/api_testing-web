<template>
  <div class="app-container">
    <el-col :span="6">
      <componenttree @handleNodeClick="getTableForm"></componenttree>
    </el-col>
    <el-col :span="18">
      <el-form :inline="true"
               size="small"
               class="form-class">
        <el-form-item label="用例名称">
          <el-input v-model="listQuery.name"
                    placeholder="输入用例名称"></el-input>
        </el-form-item>
        <el-form-item label="用例类型">
          <el-select clearable
                     v-model="listQuery.caseType"
                     placeholder="请选择">
            <el-option v-for="item in caseTypeOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用例状态">
          <el-select clearable
                     v-model="listQuery.caseStatus"
                     placeholder="请选择">
            <el-option v-for="item in caseStatusOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用例等级">
          <el-select clearable
                     v-model="listQuery.caseLevel"
                     placeholder="请选择">
            <el-option v-for="item in caseLevelOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="small"
                   @click="searchCase">搜索</el-button>
      </el-form>
      <el-card class="operate-container"
               shadow="never">
        <el-button type="primary"
                   icon="el-icon-plus"
                   style="float:right;margin-bottom:18px"
                   @click="handleAdd()">添加用例</el-button>
      </el-card>
      <el-table ref="caseTable"
                :data="tableForm"
                style="width: 100%;"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="#fff"
                v-loading="tableloading"
                @row-click="openDetails"
                @selection-change="handleSelectionChange"
                :row-style="{height:'10px'}"
                stripe>
        <el-table-column type="selection"
                         width="40">
        </el-table-column>
        <el-table-column prop="id"
                         min-width="40"
                         label="用例ID"
                         align="center"></el-table-column>
        <el-table-column prop="name"
                         min-width="80"
                         label="用例名称"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="caseType"
                         min-width="40"
                         label="用例类型"
                         show-overflow-tooltip
                         align="center">
          <template slot-scope="scope">{{scope.row.caseType | typeToString}}</template>
        </el-table-column>
        <el-table-column prop="caseStatus"
                         min-width="40"
                         label="用例状态"
                         show-overflow-tooltip
                         align="center">
          <template slot-scope="scope">{{scope.row.caseStatus | statusToString}}</template>
        </el-table-column>
        <el-table-column prop="caseLevel"
                         min-width="40"
                         label="用例等级"
                         show-overflow-tooltip
                         align="center">
          <template slot-scope="scope">{{scope.row.caseLevel | levelToString}}</template>
        </el-table-column>
        <el-table-column prop="case_result"
                         min-width="40"
                         label="用例结果"
                         show-overflow-tooltip
                         align="center">
        </el-table-column>
        <el-table-column prop="create_user.username"
                         min-width="40"
                         label="创建人"
                         show-overflow-tooltip
                         align="center">
        </el-table-column>
        <el-table-column prop="create_time"
                         min-width="80"
                         label="创建时间"
                         show-overflow-tooltip
                         align="center">
        </el-table-column>
        <el-table-column label="操作"
                         width="180"
                         align="center">
          <template slot-scope="scope">
            <el-tooltip content="执行测试用例" placement="top">              
            <el-button type="text"
                       icon="el-icon-s-promotion"
                       @click="handleUpdate(scope.$index, scope.row)">Send
            </el-button>
            </el-tooltip>
                <el-dropdown size="small">
                    <span class="el-dropdown-link">
                        更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>                    
                <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <el-button type="text"
                                icon="el-icon-document-copy"
                                @click="handleCopy(scope.$index, scope.row)">
                        复制
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.$index, scope.row)">
                        编辑
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                      </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </template>
        </el-table-column>
      </el-table>
      <el-button type="warning"
                 @click="cancelSelection()"
                 size="mini"
                 style="position: absolute;margin-top: 2px;">
        取消选择
      </el-button>
      <div style="float: right">
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
      <el-dialog :title="`用例${isEdit?'编辑':'新增'}`"
                 :visible.sync="dialogVisible"
                 @close="cancelEdit"
                 >
        <el-form :model="casePromotion"
                 :rules="rules"
                 ref="casePromotion"
                 size="small">
          <el-row>
          <el-col :span="12">
          <el-form-item prop="name"
                        label="用例名称：">
            <el-input v-model="casePromotion.name"
                      style="width: 250px"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="用例类型: " prop="caseType">
          <el-select clearable
                     v-model="casePromotion.caseType"
                     placeholder="请选择">
            <el-option v-for="item in caseTypeOptions"
                       :key="item.caseType"
                       :label="item.label"
                       :value="item.caseType">
            </el-option>
          </el-select>
        </el-form-item>
          </el-col>
        </el-row>
       <el-row>
        <el-col :span="12">
        <el-form-item label="用例状态: " prop="caseStatus">
          <el-select clearable
                     v-model="casePromotion.caseStatus"
                     placeholder="请选择">
            <el-option v-for="item in caseStatusOptions"
                       :key="item.caseStatus"
                       :label="item.label"
                       :value="item.caseStatus">
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="用例等级: " prop="caseLevel">
          <el-select clearable
                     v-model="casePromotion.caseLevel"
                     placeholder="请选择">
            <el-option v-for="item in caseLevelOptions"
                       :key="item.caseLevel"
                       :label="item.label"
                       :value="item.caseLevel">
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
       </el-row>
          <el-row>
          <el-form-item prop="case_group"
                        label="所属分组：">
            <el-select v-model="casePromotion.case_group" 
                       clearable
                       placeholder="请选择分组"
                       style="width: 250px">
              <el-option v-for="item in groupList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"></el-option>
            </el-select>

          </el-form-item>
          <el-form-item prop="model"
                        label="所属模块：">
            <el-select v-model="casePromotion.model"
                       clearable
                       placeholder="请选择"
                       style="width: 250px">
              <el-option v-for="item in modelList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          </el-row>
          <el-form-item label="用例描述：">
            <el-input v-model="casePromotion.comment"
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
    </el-col>
  </div>
</template>
<script>
import componenttree from './tree.vue'
import { getCaseList, createCase, updataCase, delCase,getCaseGroups } from '@/api/case'
import {getModelList} from '@/api/api'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: '',
  caseStatus: null,
  caseLevel: null,
  caseType: null,
  case_group: null
}

const defaultCase = {
  name: '',
  caseStatus: null,
  caseLevel: null,
  caseType: null,
  case_group: null,
  comment: null,
  env:null,
  model:null,
}

export default {
  name: 'cases',
  components: {
    componenttree: componenttree
  },
  data() {
    return {
      tableForm: null, //用例信息
      caseLevelOptions: [
        { caseLevel: 1, label: '高' },
        { caseLevel: 2, label: '中' },
        { caseLevel: 3, label: '低' }
      ],
      caseTypeOptions: [
        { caseType: 1, label: '功能测试' },
        { caseType: 2, label: '性能测试' },
        { caseType: 3, label: '安全性测试' },
        { caseType: 4, label: '其他' }
      ],
      caseStatusOptions: [
        { caseStatus:  1, label: '正常' },
        { caseStatus:  2, label: '待更新' },
        { caseStatus:  3, label: '已废弃' }
      ],
      tableloading: false,
      groupId: null,
      multipleSelection: [],
      listQuery: Object.assign({}, defaultListQuery),
      total: 0,
      dialogVisible: false,
      isEdit: false,
      casePromotion: Object.assign({},defaultCase),
      rules:{
        name: [
          { required: true, message: '用例名称不能为空', trigger: 'blur' },
          { max: 10, message: '最多可输入100个字符', trigger: 'blur' }
        ],
        caseStatus: [{ required: true, message: '不能为空', trigger: 'blur' },],
        caseLevel: [{ required: true, message: '不能为空', trigger: 'blur' },],
        caseType: [{ required: true, message: '不能为空', trigger: 'blur' },],
        case_group: [{ required: true, message: '不能为空', trigger: 'blur' },],
      },
      groupList: [],
      modelList: [],
      caseId: 0,
    }
  },
  filters: {
    typeToString(val) {
      switch (val) {
        case 1:
          return '功能测试'
          break
        case 2:
          return '性能测试'
        case 3:
          return '安全性测试'
        case 4:
          return '其他'
        default:
          return '其他'
      }
    },
    statusToString(val) {
      switch (val) {
        case 1:
          return '正常'
          break
        case 2:
          return '待更新'
        case 3:
          return '已废弃'
        default:
          return '正常'
      }
    },
    levelToString(val) {
      switch (val) {
        case 1:
          return '高'
          break
        case 2:
          return '中'
        case 3:
          return '低'
        default:
          return '中'
      }
    }
  },

  methods: {

      openDetails(row,event,column){
          if(event.label!=='操作'){
          let caseId = row.id
          this.$router.push({name:'addCaseStep',params:{caseId:caseId,casedata:row}})
          }

      },
    getTableForm(msg) {
      this.tableForm = msg.tableForm
      console.log(this.tableForm)
      this.groupId = msg.groupId
      this.total = msg.count
    },
    getCases() {
      this.tableloading = true
      this.listQuery.case_group = this.groupId
      getCaseList(this.listQuery).then(response => {
        this.tableloading = false
        this.tableForm = response.data
        this.total = response.count
      })
    },

    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.casePromotion = Object.assign({}, defaultCase)
    },
        //新增、修改用例
    handleDialogConfirm() {
      if (this.isEdit) {
        this.$refs.casePromotion.validate(valid => {
          if (valid) {
            updataCase(this.caseId, this.casePromotion).then(
              response => {
                if ('id' in response) {
                  this.$message({
                    message: '修改成功！',
                    type: 'success',
                    center: true
                  })
                  this.dialogVisible = false
                  this.getCases()
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
        this.$refs.casePromotion.validate(valid => {
          if (valid) {
            createCase(this.casePromotion).then(response => {
              if ('id' in response) {
                this.$message({
                  message: '添加成功！',
                  type: 'success',
                  center: true
                })
                this.dialogVisible = false
                this.getCases()
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

    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.casePromotion.name = row.name
      this.casePromotion.caseStatus = row.caseStatus
      this.casePromotion.caseLevel = row.caseLevel
      this.casePromotion.caseType = row.caseType
      this.casePromotion.case_group = row.case_group
      this.casePromotion.model = row.model
      this.casePromotion.comment= row.comment
      this.caseId = row.id

    },
        //用例复制
    handleCopy(index, row) {
      this.dialogVisible = true
      this.isEdit = false
      this.casePromotion.name = row.name
      this.casePromotion.caseStatus = row.caseStatus
      this.casePromotion.caseLevel = row.caseLevel
      this.casePromotion.caseType = row.caseType
      this.casePromotion.case_group = row.case_group
      this.casePromotion.model = row.model
      this.casePromotion.comment= row.comment
    },


      //删除用例
    handleDelete(index, row) {
      this.$confirm('是否要删除该环境?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCase(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            center: true
          })
          this.getCases()
        })
      }).catch(()=>{})
    },







    getGroupList(){
          getCaseGroups({pageSize:1000,pageNum:1}).then(res =>{
              this.groupList = res.data
          })
    },
    getModelLists(){
        getModelList({pageSize:1000,pageNum:1}).then(response => {
        this.modelList = response.data
        })
    },

    //搜索用例
    searchCase() {
      console.log(this.listQuery)
      this.getCases()
    },
    //取消全选
    cancelSelection() {
      this.$refs.caseTable.clearSelection()
    },

    // 全选后所有的数据
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    // 分页相关操作
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getCases()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getCases()
    },

    // 清空验证信息
    cancelEdit() {
      this.$refs.casePromotion.clearValidate()
    }
  },
  created() {

      getCaseList({pageSize:20,pageNum:1}).then(response => {
        this.tableloading = true
        this.tableForm = response.data
        this.total = response.count
        this.tableloading = false
      })

    this.groupId = null
    if(this.groupList.length!==1){
        this.getGroupList()
    }
    if(this.modelList.length!==1){
        this.getModelLists()
    }
  }
}
</script>

<style scoped>
.form-class {
  background-color: #f5f5f5;
  padding-top: 10px;
}

.el-dropdown-link {
cursor: pointer;
color: #409EFF;
}
.el-icon-arrow-down {
font-size: 12px;
}
</style>