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
                        label="参数名称：">
            <el-input v-model="listQuery.name"
                      class="input-width"
                      placeholder="参数名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label-width="140px"
                        label="key值：">
            <el-tooltip content="key值取${__  }中的变量" placement="top" effect="light">
            <el-input v-model="listQuery.key"
                      class="input-width"
                      placeholder="key值"
                      clearable></el-input>
            </el-tooltip>
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
                 @click="handleAdd()">添加自定义参数</el-button>
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
                border
                class="table">
        <el-table-column type="index"
                         label="序号"
                         width="50"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="name"
                         min-width="120"
                         label="参数名称"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="key"
                         min-width="110"
                         label="KEY值"
                         show-overflow-tooltip
                         align="center">
        <template slot-scope="scope"> {{scope.row.key | formatkey}}</template>
        </el-table-column>
        <el-table-column prop="value"
                         min-width="100"
                         label="参数值"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="p_type"
                         min-width="120"
                         label="参数类型"
                         show-overflow-tooltip
                         align="center">
          <template slot-scope="scope">
         <el-tag type="" effect="light">
              {{scope.row.p_type | typeToString}}
         </el-tag></template>
        </el-table-column>
        <el-table-column prop="m_time"
                         min-width="133"
                         label="更新时间"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="create_time"
                         min-width="133"
                         label="创建时间"
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
    <el-dialog :title="`参数${isEdit?'编辑':'新增'}`"
               :visible.sync="dialogVisible"
               center
               @close="cancelEdit"
               width="40%">
      <el-form :model="modelPromotion"
               :rules="rules"
               ref="modelPromotion"
               label-width="150px"
               size="small">
        <el-form-item prop="p_type"
                      label="参数类型：">
          <el-select v-model="modelPromotion.p_type"
                     clearable
                     placeholder="请选择参数类型 "
                     style="width: 250px">
            <el-option v-for="item in p_typeOpt"
                       :key="item.type"
                       :label="item.label"
                       :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name"
                      label="参数名称：">
          <el-input v-model="modelPromotion.name"
                    style="width: 250px"></el-input>
        </el-form-item>

        <!-- <el-form-item prop="project" label="Key值：">
          <el-select v-model="modelPromotion.key"
                     clearable
                     placeholder="请选择所属项目 "
                     style="width: 250px">
            <el-option v-for="(item, index) in projectFomart"
                       :key="index"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item prop="key"
                      label="key值：">
          <el-input v-model="modelPromotion.key"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item v-if="modelPromotion.p_type==1|modelPromotion.p_type==null"
                      prop="value"
                      label="value：">
          <el-input v-model="modelPromotion.value"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item v-if="modelPromotion.p_type==2|modelPromotion.p_type==null"
                      prop="min"
                      label="最小值：">
          <el-input v-model="modelPromotion.min"
                    style="width: 250px"></el-input>
        </el-form-item>

        <el-form-item v-if="modelPromotion.p_type==2|modelPromotion.p_type==null"
                      prop="max"
                      label="最大值：">
          <el-input v-model="modelPromotion.max"
                    style="width: 250px"></el-input>
        </el-form-item>

        <el-form-item v-if="modelPromotion.p_type==6"
                      prop="str_type"
                      label="字符串类型：">
          <el-select v-model="modelPromotion.str_type"
                     clearable
                     placeholder="请选择字符串类型"
                     style="width: 250px">
            <el-option v-for="item in str_typeOpt"
                       :key="item.type"
                       :label="item.label"
                       :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="modelPromotion.p_type==null|modelPromotion.p_type==6"
                      prop="str_length"
                      label="字符串长度：">
          <el-input v-model="modelPromotion.str_length"
                    placeholder="请选字符串长度"
                    style="width: 250px"></el-input>
        </el-form-item>

        <el-form-item v-if="modelPromotion.p_type==5|modelPromotion.p_type==null"
                      prop="date_type"
                      label="日期时间格式：">
          <el-input v-model="modelPromotion.date_type"
                    placeholder="%H:%M:%S"
                    style="width: 250px"></el-input>
        </el-form-item>

        <el-form-item v-if="modelPromotion.p_type==4|modelPromotion.p_type==null"
                      prop="uuid_type"
                      label="UUID格式：">
          <el-input v-model="modelPromotion.uuid_type"
                    placeholder="UUID格式"
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
import {
  getCustomParaList,
  createCustomPara,
  updatCustomPara,
  delCustomPara
} from '@/api/api'
import { formatDate } from '@/utils/date'
import { Message, MessageBox } from 'element-ui'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: '',
  key: ''
}
const defaultModelPromotion = {
  id: null,
  name: '',
  p_type: null,
  key: null,
  value: null,
  max: null,
  min: null,
  date_type: null,
  str_type: null,
  str_length: null,
  uuid_type: null
}

//自定义参数类型
const p_typeOpt = [
  { type: 1, label: '常量' },
  { type: 2, label: '随机数' },
  { type: 3, label: '时间戳' },
  { type: 4, label: 'uuid' },
  { type: 5, label: '日期时间' },
  { type: 6, label: '字符串' }
]
//字符串格式
const str_typeOpt = [
  { type: 1, label: '小写字符串' },
  { type: 2, label: '大写字符串' },
  { type: 3, label: '小写混合字符串' },
  { type: 4, label: '大小写数字混合字符串' }
]

export default {
  name: 'customeParaList',
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      searchs: {}, //最终确定的搜索信息，需要处理过
      listLoading: false,
      dialogVisible: false,
      str_typeOpt: str_typeOpt,
      p_typeOpt: p_typeOpt,
      projectFomart: [],
      parent_modelFomart: [],
      modelPromotion: Object.assign({}, defaultModelPromotion),
      isEdit: false, // true编辑，false新增
      rules: {
        name: [
          { required: true, message: '参数名称不能为空', trigger: 'blur' },
          { max: 10, message: '最多可输入20个字符', trigger: 'blur' }
        ],
        key: [{ required: true, message: 'key必输', trigger: 'blur' }],
        p_type: [{ required: true, message: '参数类型必选', trigger: 'blur' }],
        desc: [{ required: true, message: '环境描述必输', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.listLoading = true
    getCustomParaList(this.listQuery).then(response => {
      this.listLoading = false
      this.list = response.data
      this.total = response.count
    })
  },
  filters: {
    typeToString(val) {
      switch (val) {
        case 1:
          return '常量'
          break
        case 2:
          return '随机数'
          break
        case 3:
          return '时间戳'
          break
        case 4:
          return 'uuid'
          break
        case 5:
          return '日期时间'
          break
        case 6:
          return '字符串'
          break
        default:
          return '字符串'
      }
    },
    formatkey(key){
        return '${__' + key +'}'
    },
  },
  methods: {
    getData() {
      this.listLoading = true
      getCustomParaList({
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        name: this.listQuery.name,
        key: this.listQuery.key
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
      this.$confirm('是否要删除该参数?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCustomPara(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            center: true
          })
          this.getData()
        })
      }).catch(()=>{})
    },
    formatId(val) {
      let tt = []
      for (var i = 0; i < val.length; i++) {
        let ss = val[i].id
        tt.push(ss)
      }
      return tt
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.modelPromotion = Object.assign({}, row)
    },

    // 清空验证信息
    cancelEdit() {
      this.$refs.modelPromotion.clearValidate()
    },

    handleDialogConfirm() {
      if (this.isEdit) {
        this.$refs.modelPromotion.validate(valid => {
          if (valid) {
            updatCustomPara(this.modelPromotion.id, this.modelPromotion).then(
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
            createCustomPara(this.modelPromotion).then(response => {
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
<style>
.table {
  width: 100%;
  font-size: 14px;
  line-height: 30px;
}
</style>


