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
          <el-form-item label-width="90px"
                        label="接口名称：">
            <el-input v-model="listQuery.name"
                      class="input-width"
                      placeholder="接口名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label-width="90px"
                        label="url：">
            <el-tooltip content="url值取【mock/】之后的内容" placement="top" effect="light">
            <el-input v-model="listQuery.url"
                      class="input-width"
                      placeholder="url"
                      clearable></el-input>
            </el-tooltip>
          </el-form-item>
            <el-form-item label-width="90px"
                        label="接口状态：">
            <el-select v-model="listQuery.status"
                     clearable
                     placeholder="请选择接口状态 "
                     style="width: 140px">
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
                 @click="handleAdd()">添加Mock接口</el-button>
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
                highlight-current-row:true
                class="table">
        <el-table-column type="index"
                         label="序号"
                         width="50"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="name"
                         min-width="120"
                         label="接口名称"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="url"
                         min-width="180"
                         label="Mock地址"
                         show-overflow-tooltip
                         align="center">
        <template slot-scope="scope"> {{scope.row.url | formatUrl}}</template>
        </el-table-column>
        <el-table-column prop="method"
                         min-width="70"
                         label="请求方法"
                         show-overflow-tooltip
                         align="center">
                        <template slot-scope="scope">
                        <el-tag type="success" effect="dark">
                            {{scope.row.method}}
                        </el-tag></template>
                         </el-table-column>
        <el-table-column prop="protocol"
                         min-width="80"
                         label="协议类型"
                         show-overflow-tooltip
                         align="center">
                <template slot-scope="scope">
                        <el-tag type="info" effect="dark">
                            {{scope.row.protocol}}
                        </el-tag></template>
        </el-table-column>
        <el-table-column prop="status"
                         min-width="70"
                         label="接口状态"
                         show-overflow-tooltip
                         align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === 1 ?'':'danger'" effect="dark">
                            {{scope.row.status | typeToString}}
                        </el-tag></template>
                         </el-table-column>
        <el-table-column prop="delay"
                         min-width="70"
                         label="延迟时间（秒）"
                         show-overflow-tooltip
                         align="center">
            <template slot-scope="scope">
                        <el-tag type="warning" effect="dark">
                            {{scope.row.delay}}
                        </el-tag></template>                 
                         </el-table-column>
        <el-table-column prop="mock_times"
                         min-width="60"
                         label="mock次数"
                         show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column prop="m_time"
                         min-width="100"
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
            <el-button type="success" round
                        size="mini"
                       @click="handleUpdateParam(scope.$index, scope.row)">
              入出参数设置
            </el-button>
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
               width="35%">
      <el-form :model="modelPromotion"
               :rules="rules"
               ref="modelPromotion"
               label-width="150px"
               size="small">
        <el-form-item prop="name"
                      label="接口名称：">
          <el-input v-model="modelPromotion.name"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item prop="protocol"
                      label="协议类型：">
            <el-select v-model="modelPromotion.protocol"
                     clearable
                     placeholder="请选择协议类型"
                     style="width: 250px">
            <el-option v-for="(item, index) in protocolOpt"
                       :key="index"
                       :label="item.label"
                       :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="method"
                      label="接口请求方法：">
         <el-select v-model="modelPromotion.method"
                     clearable
                     placeholder="请选择接口请求方法"
                     style="width: 250px">
            <el-option v-for="(item, index) in methodOpt"
                       :key="index"
                       :label="item.label"
                       :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status"
                      label="接口状态：">
          <el-select v-model="modelPromotion.status"
                     clearable
                     placeholder="请选择接口状态"
                     style="width: 250px">
            <el-option v-for="item in statusOpt"
                       :key="item.status"
                       :label="item.label"
                       :value="item.status"></el-option>
          </el-select>
        </el-form-item>
                <el-form-item prop="env" label="环境: ">
                  <el-select v-model="modelPromotion.env"
                             clearable
                             placeholder="请选择环境"
                             style="width: 250px">
                    <el-option v-for="(item, index) in evnOptions"
                               :key="index"
                               :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
        <el-form-item prop="url"
                      label="URL："
                      >
          <el-input v-model="modelPromotion.url" placeholder='输入URL，输入格式：login/'
                    style="width: 250px"></el-input>
        </el-form-item>

        <el-form-item prop="delay"
                      label="延迟时间（秒）：">
          <el-input v-model="modelPromotion.delay"
                    style="width: 250px"></el-input>
        </el-form-item>

        <el-form-item prop="body_type"
                      label="请求体类型：">
          <el-select v-model="modelPromotion.body_type"
                     clearable
                     placeholder="请选择请求体类型"
                     style="width: 250px">
            <el-option v-for="item in req_typeOpt"
                       :key="item.type"
                       :label="item.label"
                       :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="desc"
                      label="接口描述：">
          <el-input v-model="modelPromotion.desc"
                    type='textarea'
                    autosize
                    style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center;">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary"
                   @click="handleDialogConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="参数编辑"
               :visible.sync="paradialogVisible"
               width="60%">
    <el-collapse v-model="activeNames">
       <el-collapse-item title="请求头部编辑" name="1">
          <el-input v-model="modelPromotion.mock_headers"
                    type='textarea'
                    autosize
                    placeholder="请输入字典格式的请求头"
                    style="width: 80%;margin-left:40px"></el-input>
       </el-collapse-item> 
       <el-collapse-item v-if="modelPromotion.method=='GET'" title="请求参数编辑" name="2">
          <el-input v-model="modelPromotion.mock_param"
                    type='textarea'
                    autosize
                    placeholder="请输入字典格式的参数"
                    style="width: 80%;margin-left:40px"></el-input>
       </el-collapse-item>
       <el-collapse-item v-if="modelPromotion.method=='POST'" title="请求体" name="3">
          <el-input v-model="modelPromotion.mock_bodys"
                    type='textarea'
                    autosize
                    placeholder="请输入字典格式的请求体{}"
                    style="width: 80%;margin-left:40px"></el-input>
       </el-collapse-item>
       <el-collapse-item title="返回内容" name="4">
          <el-input v-model="modelPromotion.response_content"
                    type='textarea'
                    autosize
                    placeholder="请输入字典格式的返回内容{}"
                    style="width: 80%;margin-left:40px"></el-input>
       </el-collapse-item>
  </el-collapse>
    <div slot="footer" class="dialog-footer">
        <el-button @click="paradialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="patchParamas()">确 定</el-button>
     </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getMockInfoList,
  createMockInfo,
  updatMockInfo,
  delMockInfo,
  PatchUpdatMockInfo,
  getEnvList
} from '@/api/api'
import { formatDate } from '@/utils/date'
import { Message, MessageBox } from 'element-ui'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: '',
  url: '',
  status: null,
}
const defaultModelPromotion = {
  id: null,
  name: '',
  method: null,
  url: null,
  protocol: null,
  env: null,
  mock_param: null,
  body_type: null,
  mock_bodys: null,
  response_content: null,
  status: null,
  mock_headers: null,
  delay: 0
}

// 请求方法
const methodOpt = [ { type: 'GET', label: 'GET' }, { type: 'POST', label: 'POST' },]


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
const req_typeOpt = [
  { type: 'application/json', label: 'application/json' },
  { type: 'application/x-www-form-urlencoded', label: 'application/x-www-form-urlencoded' },
  { type: 'multipart/form-data', label: 'multipart/form-data' },
  { type: 'text/xml', label: 'text/xml' }
]
const statusOpt = [
  { status: 1, label: '可用' },
  { status: 2, label: '已禁用' }
]

// 协议类型
const protocolOpt = [ { type: 'HTTP', label: 'HTTP' }, { type: 'HTTPS', label: 'HTTPS' } ]


export default {
  name: 'apimock',
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      searchs: {}, //最终确定的搜索信息，需要处理过
      listLoading: false,
      dialogVisible: false,
      paradialogVisible:false,
      statusOpt: statusOpt,
      req_typeOpt: req_typeOpt,
      activeNames:['1','2','3','4'],
      p_typeOpt: p_typeOpt,
      methodOpt: methodOpt,
      protocolOpt: protocolOpt,
      evnOptions: [],
      modelPromotion: Object.assign({}, defaultModelPromotion),
      isEdit: false, // true编辑，false新增
      rules: {
        name: [
          { required: true, message: '参数名称不能为空', trigger: 'blur' },
          { max: 10, message: '最多可输入20个字符', trigger: 'blur' }
        ],
        url: [{ required: true, message: 'url必输', trigger: 'blur' }],
        method: [{ required: true, message: '请求方法必选', trigger: 'blur' }],
        status: [{ required: true, message: '接口状态', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getEnv(),
    this.listLoading = true
    getMockInfoList(this.listQuery).then(response => {
      this.listLoading = false
      this.list = response.data
      this.total = response.count
    })
  },
  filters: {
    typeToString(val) {
      switch (val) {
        case 1:
          return '可用'
          break
        case 2:
          return '已禁用'
          break
        default:
          return '可用'
      }
    },
    formatUrl(url){
        return process.env.BASE_API + '/' + 'mock/' + url
    },
  },
  methods: {
    getData() {
      this.listLoading = true
      getMockInfoList({
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        name: this.listQuery.name,
        url: this.listQuery.url,
        status: this.listQuery.status
      }).then(response => {
        this.listLoading = false
        this.list = response.data
        this.total = response.count
      })
    },

    getEnv() {
      if (!this.evnOptions.length) {
        getEnvList({ pageSize: 100 }).then(res => {
          this.evnOptions = res.data
        })
      } else {
        console.log('存在用户数据')
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
      this.$confirm('是否要删除该Mock接口?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMockInfo(row.id).then(response => {
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

    handleUpdateParam(index, row) {
      this.paradialogVisible = true
      this.isEdit = true
      this.modelPromotion = Object.assign({}, row)
    },


    // 清空验证信息
    cancelEdit() {
      this.$refs.modelPromotion.clearValidate()
    },
    patchParamas(){
            PatchUpdatMockInfo(this.modelPromotion.id, this.modelPromotion).then(
              response => {
                if ('id' in response) {
                  this.$message({
                    message: '修改成功！',
                    type: 'success',
                    center: true
                  })
                  this.paradialogVisible = false
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
    },

    handleDialogConfirm() {
      if (this.isEdit) {
        this.$refs.modelPromotion.validate(valid => {
          if (valid) {
            updatMockInfo(this.modelPromotion.id, this.modelPromotion).then(
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
            createMockInfo(this.modelPromotion).then(response => {
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


