<!-- 
 @component elementUI@2.7.2 Tree 组件二次开发
 -->
<template>
  <div>
    <!-- <el-row> -->
    <!-- <el-aside width="380px"
                  style="padding: 15px;"> -->
    <div v-loading="isLoading"
         class="comp-tree">
      <el-row>
        <el-col style="border:1px solid;border-color: #ffffff #ffffff rgb(234, 234, 234) #ffffff;padding:2px">
          <el-button style="float:right;"
                     type="primary"
                     size="small"
                     @click="handleAddTop">添加一级分组</el-button>
          <!-- tree -->
        </el-col>
      </el-row>
      <el-row>
            <el-input
            size="small"
            clearable
            prefix-icon="el-icon-search"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
            </el-input>
      </el-row>
      <el-row>
        <el-scrollbar>
          <el-tree ref="SlotTree"
                   :data="setTree"
                   :props="defaultProps"
                   @node-click="handleNodeClick"
                   :expand-on-click-node="true"
                   :highlight-current="true"
                   :filter-node-method="filterNode"
                   :node-key="NODE_KEY">
            <div class="comp-tr-node"
                 slot-scope="{ node, data }">
              <template>
                <!-- 名称： 新增节点增加class（is-new） -->
                <span :class="[data[NODE_KEY] < NODE_ID_START ? 'is-new' : '', 'comp-tr-node--name']">
                  {{ node.label }}
                </span>

                <!-- 按钮 -->
                <span class="comp-tr-node--btns">
                  <!-- 新增 -->
                  <el-button icon="el-icon-plus"
                             size="mini"
                             circle
                             type="primary"
                             @click="handleAdd(node, data)"></el-button>

                  <!-- 编辑 -->
                  <el-button icon="el-icon-edit"
                             size="mini"
                             circle
                             type="info"
                             @click="handleEdit(node, data)"></el-button>

                  <!-- 删除 -->
                  <el-button icon="el-icon-delete"
                             size="mini"
                             circle
                             type="danger"
                             @click="handleDelete(node, data)"></el-button>
                </span>
              </template>
            </div>
          </el-tree>
        </el-scrollbar>
        <el-dialog title="新增"
                   width="25%"
                   class="add-event-dialog"
                   :visible.sync="addEventdialogVisible"
                   @close="cancelEdit"
                   size="tiny">
          <el-form ref="initParam"
                   :model="initParam"
                   :rules="rules">
            <el-form-item label="分组名称"
                          prop="name">
              <el-input v-model="initParam.name"></el-input>
            </el-form-item>
            <el-form-item label="分组级别"
                          prop="level">
              <el-input v-model="initParam.level"></el-input>
            </el-form-item>
            <el-form-item v-if="showGroup"
                          label="上级分组"
                          prop="group">
              <el-input v-model="initParam.group"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer"
                class="dialog-footer">
            <el-button @click="addEventdialogVisible=false">取 消</el-button>
            <el-button v-if="editEventdialogVisible"
                       type="primary"
                       @click="updataChilren">确 定</el-button>
            <el-button v-else
                       type="primary"
                       @click="addTop">确 定</el-button>
          </span>
        </el-dialog>
      </el-row>
    </div>
    <div class="pagination-container">
      <el-pagination small
                     :hide-on-single-page="hasTwoPages"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     layout="prev, pager, next"
                     :current-page.sync="listQuery.pageNum"
                     :page-size="listQuery.pageSize"
                     :total="total">
      </el-pagination>
    </div>
    <!-- </el-aside> -->
    <!-- </el-row> -->
  </div>
</template>

<script>
import {
  getaCaseGroupList,
  createCaseGroup,
  updataCaseGroup,
  delCaseGroup,
  getaCaseByGroupId
} from '@/api/case'
const defaultForm = { name: '', level: null, group: null }
const defaultListQuery = {
  pageNum: 1,
  pageSize: 15
}
export default {
  name: 'componenttree',
  props: ['total1'], //获取父组件数据
  watch:{
      filterText(val){
          this.$refs.SlotTree.filter(val)
      }
  },
  data() {
    return {
      isLoading: false, // 是否加载
      addEventdialogVisible: false, //新增
      listQuery: Object.assign({}, defaultListQuery),
      editEventdialogVisible: false, //编辑
      setTree: [], // tree数据
      showGroup: false, //隐藏上级分组
      NODE_KEY: 'id', // id对应字段
      MAX_LEVEL: 2, // 设定最大层级
      NODE_ID_START: 0, // 新增节点id，逐次递减
      startId: null,
      groupId: 0,
      hasTwoPages: false,
      total: 10,
      count: 0,
      filterText: '',
      defaultProps: {
        // 默认设置
        children: 'groups',
        label: 'name'
      },
      initParam: Object.assign({}, defaultForm),
      childrenForm: Object.assign({}, defaultForm),
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { max: 20, message: '最多可输入20个字符', trigger: 'blur' }
        ],
        level: [{ required: true, message: 'level不能为空', trigger: 'blur' }]
      },
      tableForm: null
    }
  },
  created() {
    // 初始值
    this.startId = this.NODE_ID_START
    this.getgroups()
  },
  methods: {
    getgroups() {
      getaCaseGroupList({
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize
      }).then(res => {
        this.isLoading = true
        this.setTree = res.data
        this.isLoading = false
        this.total = res.count
        if (res.count > 10) {
          this.hasTwoPages = true
        } else {
          this.hasTwoPages = false
        }
      })
    },
     filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
    // 点击分组获取用例
    handleNodeClick(data) {
      let groupIds = data.id
      getaCaseByGroupId({ groupId: groupIds }).then(res => {
        this.tableForm = res.data

        //子组件数据通过emit发送给父组件
        let sendForm = {}
        sendForm['tableForm'] = this.tableForm
        sendForm['groupId'] = groupIds
        sendForm['count'] = res.count
        this.$emit('handleNodeClick', sendForm)
      })
    },
    senddata() {
      this.$emit('senddata', this.tableForm)
    },

    handleDelete(_node, _data) {
      // 删除节点
      //默认分组不允许删除
      if (_data.name == '默认分组') {
        this.$message.error('默认分组，不可删除！')
        return false
      }

      // 判断是否存在子节点
      if (_data.groups && _data.groups.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        // 删除操作
        let DeletOprate = () => {
          this.$nextTick(() => {
            if (this.$refs.SlotTree) {
              // this.$refs.SlotTree.remove(_data)
              delCaseGroup(_data.id).then(res => {
                this.getgroups()
              })
              this.$message.success('删除成功！')
            }
          })
        }
        // 二次确认
        let ConfirmFun = () => {
          this.$confirm('是否删除此节点？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              DeletOprate()
            })
            .catch(() => {})
        }
        // 判断是否新增： 新增节点直接删除，已存在的节点要二次确认
        _data[this.NODE_KEY] < this.NODE_ID_START ? DeletOprate() : ConfirmFun()
      }
    },
    // 清空验证信息
    cancelEdit() {
      this.$refs.initParam.clearValidate()
    },

    handleInput(_node, _data) {
      // 修改节点
      console.log(_node, _data)
      // 退出编辑状态
      if (_node.isEdit) {
        this.$set(_node, 'isEdit', false)
      }
    },

    // 分页相关操作
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getgroups()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getgroups()
    },

    handleEdit(_node, _data) {
      // 编辑节点
      // 设置编辑状态
      this.addEventdialogVisible = true
      this.editEventdialogVisible = true
      this.initParam.name = _data.name
      this.initParam.level = _data.level
      this.initParam.group = _data.group
      this.groupId = _data.id
    },
    handleAdd(_node, _data) {
      // 新增节点
      // 判断层级
      if (_node.level >= this.MAX_LEVEL) {
        this.$message.warning('当前已达到' + this.MAX_LEVEL + '级，无法新增！')
        return false
      }
      this.initParam = Object.assign({}, defaultForm)
      this.initParam.group = _data.id
      this.addEventdialogVisible = true
      this.editEventdialogVisible = false
      // 展开节点
      //   this.addChildren()
      console.log(this.initParam)
      if (!_node.expanded) {
        _node.expanded = true
      }
    },

    handleAddTop() {
      // 添加顶部节点
      this.addEventdialogVisible = true
      this.editEventdialogVisible = false
      this.initParam = Object.assign({}, defaultForm)
    },
    // 添加一级分组
    addTop() {
      this.$refs.initParam.validate(valid => {
        if (valid) {
          createCaseGroup(this.initParam).then(res => {
            this.$message({
              message: '添加成功！',
              type: 'success',
              center: true
            })
            this.addEventdialogVisible = false
            this.getgroups()
          })
        } else {
          return false
        }
      })
    },
    // 添加子分组
    addChildren() {
      this.$refs.initParam.validate(valid => {
        if (valid) {
          createCaseGroup(this.initParam).then(res => {
            this.$message({
              message: '添加成功！',
              type: 'success',
              center: true
            })
            this.addEventdialogVisible = false
            this.getgroups()
          })
        } else {
          return false
        }
      })
    },
    //更新分组
    updataChilren() {
      this.$refs.initParam.validate(valid => {
        if (valid) {
          updataCaseGroup(this.groupId, this.initParam).then(res => {
            this.$message({
              message: '修改成功！',
              type: 'success',
              center: true
            })
            this.addEventdialogVisible = false
            this.addEventdialogVisible = false
            this.getgroups()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* common */
// 显示按钮
.show-btns {
  opacity: 1;
}
/* common end */
.comp-tree {
  width: 100%;
  //   max-width: 700px;
  //   max-height: 80vh;
  padding: 2em;
  overflow: auto;
  // 顶部按钮
  .comp-tr-top {
    width: 100px;
    margin-bottom: 2em;
  }
  // 自定义节点
  .comp-tr-node {
    // label
    .comp-tr-node--name {
      display: inline-block;
      line-height: 40px;
      min-height: 40px;
      // 新增
      &.is-new {
        font-weight: bold;
      }
    }
    // button
    .comp-tr-node--btns {
      margin-left: 10px;
      opacity: 0;
      transition: opacity 0.1s;
      .el-button {
        transform: scale(0.8); // 缩小按钮
        & + .el-button {
          margin-left: -1px;
        }
      }
    }
  }
  // 高亮显示按钮
  .is-current {
    & > .el-tree-node__content {
      .comp-tr-node--btns {
        @extend .show-btns;
      }
    }
  }
  // 悬浮显示按钮
  .el-tree-node__content {
    &:hover {
      .comp-tr-node--btns {
        @extend .show-btns;
      }
    }
  }
}
</style>