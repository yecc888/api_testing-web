<template>
  <div class="app-container1">
    <el-form ref="apiForm"
             :model="apiForm"
             :rules="rules"
             label-width="100px"
             style="width:100% margin:auto">
        <div class="base2">
            <!-- <el-select v-model="apiForm.protocol"
                       filterable
                       placeholder="协议类型"
                       class="el-select1">
            <el-option v-for="(item,index) in protocolOption"
                         :key="index"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select> -->
            <el-select v-model="apiForm.method"
                       filterable
                       placeholder="请求方法"
                       class="el-select1">
            <el-option v-for="(item,index) in methodOption"
                         :key="index"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          <el-input placeholder="http://"
                    v-model="apiForm.url"
                    style="width:60%"
                    size="large"
                    clearable>
            </el-input>
            <el-button type="primary" size="medium"
                       :loading="sendloading"
                       @click="send()">
                <svg-icon icon-class="send"></svg-icon>
              Send
            </el-button>
          <!-- <el-button size="medium"
                     @click="save()"
                     type="primary">
        <svg-icon icon-class="play"></svg-icon>             
                     Save</el-button> -->
        </div>
      <el-collapse v-model="activeNames"
                   @change="handleChange">
        <div class="base3"
             style="margin-top:10px">
          <el-collapse-item name="2">
            <span  class="collapse-title" slot="title"> Headers</span>
            <div style="text-align: center;margin-bottom: 10px">
              <el-row >
                 <el-radio-group v-model="radioHeader"
                                @change="changeHandler">
                     <el-radio-button class="radio"
                                   label='1'>表单Form</el-radio-button>
                     <el-radio-button class="radio"
                                   label='2'>源数据Raw</el-radio-button>
                    </el-radio-group>
              </el-row>
            </div>
           <!-- <el-row style="width:50%">
  <el-col :span="8"><div class="headers">请求Headers参数</div></el-col>
  <el-col :span="8"><div class="headers">请求Headers参数值</div></el-col>
  <el-col :span="8"><div class="headers">操作</div></el-col>
         </el-row> -->
  <!-- <el-form-item v-for="(item,index) in apiForm.headers" :key='item.key'>
           <el-row :gutter="5">
  <el-col :span="8"><el-input v-model="item.name" size="small"></el-input></el-col>

  <el-col :span="8"><el-input v-model="item.value" size="small"></el-input></el-col>
  <el-col :span="8">
      <div  style="text-align: center;">
                  <el-button type="primary"
                             icon="el-icon-plus"
                             v-if="index===(apiForm.headers.length-1)"
                             @click="addHead">Add header</el-button>

                  <el-button type="danger"
                             icon="el-icon-delete"
                             @click.prevent="removeDomain(item)"
                            >删除
                  </el-button>
      </div>
  </el-col>
</el-row>
  </el-form-item> -->


            <el-table :data="apiForm.headers"
                      highlight-current-row
                      :class="radioHeader==='1'? 'form': 'raw'">
              <el-table-column label="Header名称"
                               align="center"
                               min-width="40%">
                <template slot-scope="scope">
                  <el-input style="width:200px"
                            v-model.trim="scope.row.name"
                            :value="scope.row.name"
                            clearable
                            placeholder="请输入内容"></el-input>
                  <el-select placeholder="head标签"
                             filterable
                             v-model="scope.row.name">
                    <el-option v-for="(item,index) in headertempOptions"
                               :key="index+''"
                               :label="item.name"
                               :value="item.name"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="Header内容"
                               align="center"
                               min-width="40%">
                <template slot-scope="scope">
                  <!-- <el-input v-model.trim="scope.row.value"
                               type="textarea"
                                autosize
                                clearable
                            :value="scope.row.value"
                            placeholder="请输入参数值"></el-input> -->
                  <el-autocomplete class="inline-input"
                                   style="width:100%"
                                   v-model="scope.row.value"
                                   :value="scope.row.value"
                                   :fetch-suggestions="querySearch"
                                   placeholder="请输入Header值"
                                   @select="handleSelect"></el-autocomplete>
                  <!-- <el-select
          v-model="scope.row.value"
          filterable
          remote
          :value="scope.row.value"
          reserve-keyword
          placeholder="请输入参数值"
          :remote-method="searchHeaderMethod"
          :loading="false">
          <el-option
            v-for="item in selectHeaderOptions"
            :key="item.productId"
            :label="item.value"
            :value="item.value">
            <span style="float: left">{{ item.value }}</span>
          </el-option>
        </el-select> -->
                </template>
              </el-table-column>
              <el-table-column label="操作"
                               align="center"
                               min-width="20%">
                <template slot-scope="scope">
                  <el-button type="primary"
                             v-if="scope.$index===(apiForm.headers.length-1)"
                             icon="el-icon-plus"
                             @click="addHead">Add header</el-button>

                  <el-button type="danger"
                             icon="el-icon-delete"
                             @click="delHead(scope.$index)">删除
                  </el-button>
                </template>

              </el-table-column>
            </el-table>
            <template>
              <!-- <el-card shadow='never'> -->
              <div style="margin-left:68px;width:900px">
                <el-input :class="radioHeader==='1'? 'raw': 'form'"
                          type="textarea"
                          :rows="5"
                          clearable
                          placeholder="请输入Headers{}"
                          v-model="headerRaw"></el-input>
                <!-- </el-card> -->
              </div>
            </template>
          </el-collapse-item>
        </div>
        <!-- /////////////////////////////////////////////////////////// -->
        <div class="base4"
             style="margin-top:10px">
          <el-collapse-item name="3">
            <span  class="collapse-title" slot="title"> Parameters</span>

            <div style="text-align: center;margin-bottom: 10px">
              <el-row>
                 <el-radio-group v-model="radioParam"
                                @change="changeHandlerP">
                     <el-radio-button class="radio"
                                   label='1'>表单Form</el-radio-button>
                     <el-radio-button class="radio"
                                   label='2'>源数据Raw</el-radio-button>
                    </el-radio-group>
              </el-row>
            </div>

            <el-table :data="apiForm.paramars"
                      highlight-current-row
                      :class="radioParam==='1'? 'form': 'raw'">
              <el-table-column label="参数名称"
                               align="center"
                               min-width="40%">
                <template slot-scope="scope">
                  <el-input style="width:200px"
                            v-model.trim="scope.row.name"
                            :value="scope.row.name"
                            clearable
                            placeholder="name"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="参数值"
                               align="center"
                               min-width="40%">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.value"
                            type="textarea"
                            autosize
                            clearable
                            :value="scope.row.value"
                            placeholder="value"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作"
                               align="center"
                               min-width="20%">
                <template slot-scope="scope">
                  <el-button type="primary"
                             v-if="scope.$index===(apiForm.paramars.length-1)"
                             icon="el-icon-plus"
                             @click="addParamas">Add parameter</el-button>

                  <el-button type="danger"
                             icon="el-icon-delete"
                             @click="delParamas(scope.$index)">删除
                  </el-button>
                </template>

              </el-table-column>
            </el-table>
            <template>
              <!-- <el-card shadow='never'> -->
              <div style="margin-left:68px;width:900px">
                <el-input :class="radioParam==='1'? 'raw': 'form'"
                          type="textarea"
                          :rows="5"
                          placeholder="请输入参数{}"
                          v-model="paramarsRaw"></el-input>
                <!-- </el-card> -->
              </div>
            </template>
          </el-collapse-item>
        </div>
        <!-- eee -->
        <div class="base5"
             style="margin-top:10px">
          <el-collapse-item name='4'>
            <span  class="collapse-title" slot="title"> Respones</span>
            <div class='respones-header'><span>Respones</span>s
                 <div :class="[isActive?'form':'raw']" style="float: right">
                     <span class="el-time">Elapsed time: {{res.time}}ms</span>
                 </div>
            </div>

            <div class="content">
              <div :class="[isActive?'raw':'form']">
                <p>Not available, a request has not been sent yet.</p>
              </div>
              <div :class="[isActive?'form':'raw']">
                <div :class="[statusCode?'response-status-line response-status-ok':'response-status-line response-status-failure']">
                  <div class="status">
                    <a>{{res.status_code}}</a>
                  </div>
                </div>
                <div class="layout-for-headers-and-body">
                  <div class="header"
                       style="width:35%">
                    <div class="header-title"><span>HEADERS</span></div>
                    <vue-json-editor v-model="res.response_header"
                                     :showBtns="false"
                                     lang="zh"
                                     @json-change="onJsonChange"></vue-json-editor>
                  </div>
                  <div class="middle"></div>
                  <div class="body"
                       style="width:65%">
                    <div class="body-title"><span>BODY</span></div>
                    <div style="margin-left:3px">
                      <vue-json-editor v-model="res.response_content"
                                       :showBtns="false"
                                       :mode="'code'"
                                       @json-change="onJsonChange"
                                       lang="zh"></vue-json-editor>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </el-collapse-item>
        </div>
      </el-collapse>
    </el-form>
  </div>
</template>

<script>
import {
  createInterface,
  updatInterface,
  getInterfaceList,
  getUserList,
  getModelList,
  getEnvList,
  getHeadertempList,
  getInterface,
  sendApi
} from '@/api/api'

import vueJsonEditor from 'vue-json-editor'
import { Message, MessageBox } from 'element-ui'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: ''
}

const defaultApi = {
//   id:null,
  name: null,
  url: '',
  method: '',
  protocol: '',
  status: null,
  sign: null,
  operator: null,
  model: null,
  env: null,
  desc: null,
  headers: [{ name: '', value: '', raw: '' }],
  paramars: [{ name: '', value: '', raw: '' }]
}

const defaultstatsuOptions = [
  { value: 1, label: '可用' },
  { value: 2, label: '禁用' }
]
const defaultsignOptions = [
  { value: 1, label: '不加密' },
  { value: 2, label: '加密' }
]
const defaultprotocolOption = [
  { value: 'HTTP', label: 'HTTP' },
  { value: 'HTTPS', label: 'HTTPS' },
]

const defaultmethodOption = [
  { value: 'POST', label: 'POST' },
  { value: 'GET', label: 'GET' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' }
]



export default {
  name: 'fasttest',
  components: {
    vueJsonEditor
  },
  data() {
    return {
      apiForm: Object.assign({}, defaultApi),
      statsuOptions: Object.assign({}, defaultstatsuOptions),
      signOptions: Object.assign({}, defaultsignOptions),
      operatorOptions: [],
      modelOptions: [],
      isEdit:true,
      evnOptions: [],
      headertempOptions: [],
      methodOption: Object.assign({}, defaultmethodOption),
      protocolOption: Object.assign({}, defaultprotocolOption),
      rules: {
          name: [
            {required: true, message: '接口名称必输', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          model: [{required: true, message: '所属模块必选', trigger: 'blur'}],
          env: [{required: true, message: '环境必选', trigger: 'blur'}],
          operator: [{required: true, message: '添加人必选', trigger: 'blur'}],
          method: [{required: true, message: '请求方法必选', trigger: 'blur'}],
          url: [{required: true, message: '请求路径必选', trigger: 'blur'}],


      },
      activeNames: ['1', '2', '3'], //折叠展示数量
      radioHeader: '1',
      radioParam: '1',
      headerRaw: '',
      paramarsRaw: null,
      statusCode: true,
      changeHeadValue: 1,
      changeParamValue: 1,
      res: {},
      isActive: false,
      sendloading: false,
      selectHeaderOptions: [],
      seachloding: true
    }
  },
  created() {
    this.getHeaderTemp()
    //   (this.radioHeader = '1')
    // 编辑获取接口信息
    // this.apiForm = Object.assign({},defaultApi)
    // if (this.isEdit) {
    //   getInterface(this.$route.query.id).then(respones => {
    //     this.apiForm = respones
    //     this.apiForm.operator = respones.operator.id
    //     this.apiForm.model = respones.model.id
    //     this.apiForm.env = respones.env.id
    //     this.headerRaw = respones.headers[0].raw
    //     this.paramarsRaw = respones.paramars[0].raw
    //     this.apiForm.response = ''
    //     // this.res = response.respones[0]
    //   })
    // }else{
    //         this.apiForm = Object.assign({},defaultApi)
    //         this.apiForm.headers = [{ name: '', value: '', raw: '' }]
    //         this.apiForm.paramars = [{ name: '', value: '', raw: '' }]

    // }
  },
  mounted() {
    this.selectHeaderOptions = this.getHeaderOptions()
  },

  methods: {
      // 快速测试
    send() {
      if (this.apiForm.url != '' && this.apiForm.method !== '') {
        this.sendloading = true
        this.doHeader() //处理请求头
        this.doParam() //处理请求参数
        sendApi(this.apiForm).then(respones => {
          this.res = respones
          this.isActive = true
          if (respones.status_code != 200 && respones.status_code!= 301&& respones.status_code!= 302) {
            this.statusCode = false
          } else {
            this.statusCode = true
          }
          this.sendloading = false
          this.activeNames = ['4']
        })
      } else if (this.apiForm.url != '' && this.apiForm.method !== ''&&this.apiForm.name!=='') {
        this.sendloading = true
        this.doHeader()
        this.doParam()
        let api_id = this.$route.query.id
        // this.id = api_id
        this.apiForm[id] = api_id
        sendApi(this.apiForm).then(respones => {
          this.res = respones
          this.isActive = true
          if (respones.status_code !== 200) {
            this.statusCode = false
          } else {
            this.statusCode = true
          }
          this.sendloading = false
          this.activeNames = ['4']
        })
      }
      else {
        this.$message({
          message: '请输入相关参数',
          type: 'warning'
        })
      }
    },
    onJsonChange(value) {
    //   console.log('value:', value)
    },

    removeDomain(item) {
        var index = this.apiForm.headers.indexOf(item)
        if (index !== -1) {
          this.apiForm.headers.splice(index, 1)
        }
        if (this.apiForm.headers.length === 0) {
        this.apiForm.headers.push({ name: '', value: '', raw: '' })
      }
      },

    doHeader() {
      if (this.changeHeadValue == 2) {
        let ss = [{ name: '', value: '', raw: this.headerRaw }]
        this.apiForm.headers = ss
      } else if (this.changeHeadValue == 1) {
        if (this.apiForm.headers[0].raw !== '') {
            this.apiForm.headers[0].raw = ''
        }
        // this.apiForm.headers[0].raw = ''
      }
    },

    doParam() {
      if (this.changeParamValue == 2) {
        let ss = [{ name: '', value: '', raw: this.paramarsRaw }]
        this.apiForm.paramars = ss
      } else if (this.changeParamValue == 1) {
        if (this.apiForm.paramars[0].raw !== ''){
            this.apiForm.paramars[0].raw = ''
        }
        //   this.apiForm.paramars[0].raw = ''
      }
    },

    save() {
      this.doHeader()
      this.doParam()
      if (this.isEdit) {
        this.$refs.apiForm.validate(valid => {
          if (valid) {
            updatInterface(this.$route.query.id, this.apiForm).then(
              response => {
                if ('id' in response) {
                  this.$message({
                    message: '修改成功！',
                    type: 'success',
                    center: true
                  })
                  this.$refs.apiForm.resetFields()
                  this.$router.back()
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
        this.$refs.apiForm.validate(valid => {
          if (valid) {
            createInterface(this.apiForm).then(response => {
              if ('id' in response) {
                this.$message({
                  message: '添加成功！',
                  type: 'success',
                  center: true
                })
                // this.dialogVisible = false
                // this.getData()
                this.$refs.apiForm.resetFields()
                this.$router.back()
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

    getHeaderOptions() {
      this.seachloding = true
      getHeadertempList({ pageNum: 1, pageSize: 100 }).then(response => {
        this.seachloding = false
        let headerList = response.data
        this.selectHeaderOptions = []
        for (let i = 0; i < headerList.length; i++) {
          let item = headerList[i]
          this.selectHeaderOptions.push({
            headerId: item.id,
            value: item.value
          })
        }
      })
    },

    searchHeaderMethod(query) {
      if (query !== '') {
        this.seachloding = true
        getHeadertempList({ value: query }).then(response => {
          this.seachloding = false
          let headerList = response.data
          this.selectHeaderOptions = []
          for (let i = 0; i < headerList.length; i++) {
            let item = headerList[i]
            this.selectHeaderOptions.push({
              headerId: item.id,
              value: item.value
            })
          }
        })
      } else {
        this.selectHeaderOptions = []
      }
    },

    querySearch(queryString, cb) {
      var selectHeaderOptions = this.selectHeaderOptions
      var results = queryString
        ? selectHeaderOptions.filter(this.createFilter(queryString))
        : selectHeaderOptions
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return selectHeaderOptions => {
        return (
          selectHeaderOptions.value
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    handleSelect(item) {
    //   console.log(item)
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.apiForm = Object.assign({}, defaultApi)
    },

    // 切换radio后的值，header
    changeHandler(value) {
      this.changeHeadValue = value
    },

    // 切换radio后的值，parama
    changeHandlerP(value) {
      this.changeParamValue = value
    },
    // 动态添加一行header
    addHead() {
      let headers = { name: '', value: '', raw: '' }
      this.apiForm.headers.push(headers)
    //   if (this.isEdit){}
    },
    // 动态删除一行header
    delHead(index) {
      this.apiForm.headers.splice(index, 1)
      if (this.apiForm.headers.length === 0) {
        this.apiForm.headers.push({ name: '', value: '', raw: '' })
      }
    },

    // 动态添加一行paramas
    addParamas() {
      let headers = { name: '', value: '', raw: '' }
      this.apiForm.paramars.push(headers)
    },
    // 动态删除一行paramas
    delParamas(index) {
      this.apiForm.paramars.splice(index, 1)
      if (this.apiForm.paramars.length === 0) {
        this.apiForm.paramars.push({ name: '', value: '', raw: '' })
      }
    },

    // getEnv() {
    //   if (!this.evnOptions.length) {
    //     getEnvList({ pageSize: 100 }).then(res => {
    //       this.evnOptions = res.data
    //     })
    //   } else {
    //     console.log('存在用户数据')
    //   }
    // },
    // getUser() {
    //   if (!this.operatorOptions.length) {
    //     getUserList({ pageSize: 100 }).then(res => {
    //       this.operatorOptions = res.data
    //     })
    //   } else {
    //     console.log('存在用户数据')
    //   }
    // },

    // getModel() {
    //   if (!this.modelOptions.length) {
    //     getModelList({ pageSize: 100 }).then(res => {
    //       this.modelOptions = res.data
    //     })
    //   } else {
    //     console.log('存在用户数据')
    //   }
    // },

    getHeaderTemp() {
      if (!this.headertempOptions.length) {
        getHeadertempList({ pageSize: 100 }).then(res => {
          this.headertempOptions = res.data
        })
      } else {
        console.log('存在用户数据')
      }
    },

    handleChange(val) {
    //   console.log(val)
    }
  }
}
</script>

<style>

.el-time{
    font-size: 9px;
    color: #888;
    padding: 0 15px 0 0;
    font-weight: 400;
    text-transform: capitalize;
}

.body-title {
  height: 31px;
  font-size: 12px;
  color: #444;
  margin: 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  align-items: center;
}

.middle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 5px;
  width: 1px;
  background-color: #eaeaea;
}

.header-title {
  height: 31px;
  font-size: 12px;
  color: #444;
  margin-left: 20px;
  margin-bottom: 15px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  align-items: center;
}

.layout-for-headers-and-body {
  display: flex;
  margin-top: 20px;
}

.status {
  padding-left: 20px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
  font-family: Consolas, Andale Mono, monospace !important;
}

.p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  margin: 0 0 10px;
  margin-left: 16px;
}

/* .note {
  display: block;
}

.note1 {
  display: none;
} */

.respones-header {
  display: block;
  font-weight: 700;
  font-size: 18px;
  color: #555;
  font-family: Roboto, DejaVu Sans Condensed, Helvetica Neue, Helvetica, Arial,
    sans-serif;
  margin-left: 16px;
  margin-bottom: 10px;
}

.response-status-line {
  color: #fff;
}
.response-status-line.response-status-ok {
  background-color: #17c5a6;
}

.response-status-line.response-status-failure {
  background-color: #fd3c3c;
}

.form {
  display: block;
}

.raw {
  display: none;
}

.base2 {
  background-color: white;
  margin-top: 10px;
}
.input-upp {
  text-transform: uppercase;
  width: 90px;
}

.el-select1 {
  display: inline-block;
  width: 10%;
}
.select-left {
  margin-left: auto;
  width: 110px;
}
.input10 {
  width: 90px;
  font-size: inherit;
  font-family: auto;
}

.input-width {
  width: 200px;
}

.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.app-container1 {
  width: 100%;
  padding: 20px;
  background-color: #f9fafc;
}

.box-card {
  width: 100%;
}

.el-collapse-item__arrow{
   float: left;
    margin-right: 22px;
    font-weight: 700;
    font-size: 18px;
    color: #555;

}
.collapse-title{
        /* margin-right: 22px; */
    font-weight: 700;
    font-size: 15px;
    
}


.el-row {
    margin-bottom: 10px;
  }

  .headers{
    font-weight: 700;
    text-align: center;
    font-size: 17px;
    background: #d3dce6;
}
</style>