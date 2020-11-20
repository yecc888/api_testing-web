<template>
<div>
    <el-form :inline="true" class="demo-form-inline search-style form-class" size="small">
        <el-form-item label="函数文件名称" label-width="100px">
            <el-autocomplete
                class="inline-input"
                v-model="fileName"
                :fetch-suggestions="querySearch"
                placeholder="输入函数文件名称，xx.py"
                ></el-autocomplete>
            
            <!-- <el-input v-model="fileName" placeholder="输入函数文件名称，xx.py" size="small"> </el-input> -->
        </el-form-item>
        <el-button-group>
            <el-button type="primary" @click="loadFunc" size="small">加载文件</el-button>
            <el-button type="success" @click="add" size="small">创建</el-button>
            <el-button type="danger" @click="del" size="small">删除</el-button>
        </el-button-group>
        <el-form-item label="函数名称" label-width="80px">
                <el-input v-model="funName" placeholder="函数名称" size="small"> </el-input>
        </el-form-item>
        <el-button-group>
            <el-button type="primary" @click="loadFunc" size="small">DEBUG</el-button>
            <el-button type="success" @click="edit" size="small">更新</el-button>
        </el-button-group>
    </el-form>
    <el-row>
        <el-col :span="16" style="border:3px solid rgb(189, 189, 189)" >
            <el-container>
               <editor
                            style="font-size: 15px"
                            v-model="content"
                            @init="editorInit"
                            lang="python"
                            theme="monokai"
                            width="100%"
                            height="810px"
                            :options="{
                                 enableSnippets:true,
                                 enableBasicAutocompletion: true,
                                 enableLiveAutocompletion: true,
                                tabSize:2,
                                fontSize:20,
                                 showPrintMargin:false,
                             }"
                    >
                    </editor>
        </el-container>
        </el-col>
        <el-col :span="8" style="padding-left:10px;background-color: rgb(234, 234, 234);height:815px ">
                <div style="font-weight: 700;color: gray;font-size:14px;margin-top: 2px;">
                    测试结果：
                </div>
                <pre style="white-space: pre-wrap;word-wrap: break-word;padding-left:10px;">{{this.funcResult}}
                </pre>
        </el-col>
    </el-row>

</div>
</template>

<script>

import {addCustomFunc,getCustomFunc,updataCustomFunc,delCustomFunc,getAllCustomFunc} from '@/api/case'

const defaultfuncForm = {
    fileName: '',
    content: ''
}

export default {
    name:'customfunc',
    components: {
        editor: require('vue2-ace-editor')
    },
    data(){
        return {
            fileName: '',
            funName:'',
            funcResult: '',
            content:'',
            funcId:null,
            funcForm : Object.assign({},defaultfuncForm),
            allFuncForms: [],
        }
    },
    created(){

    },


    methods:{
        editorInit(){
                require('brace/ext/language_tools');
                require('brace/mode/python');
                require('brace/theme/monokai');
                // require('brace/snippets/python');
        },

        querySearch(queryString, cb) {
            var allFuncForms = this.allFuncForms;
            var results = queryString ? allFuncForms.filter(this.createFilter(queryString)) : allFuncForms;
            // 调用 callback 返回建议列表的数据
            cb(results)
        },

        createFilter(queryString) {
            return (allFuncForm) => {
            return (allFuncForm.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },

        loadAll(){
            getAllCustomFunc({pageSize:100,pageNum:1}).then(response =>{
                let dd = response.data;
                for (var i=0;i < dd.length; i++){
                      let item = dd[i];
                      this.allFuncForms.push({value:item.fileName})
                }
            })

        },

        loadFunc(){
            if (!this.fileName){
                this.$message({
                    message: '请先输入函数文件名称',
                    type: 'warning',
                    showClose: true
                });
                return
            }
            getCustomFunc({fileName:this.fileName}).then(response =>{
                // this.$message({
                //     message: '加载成功',
                //     type: 'success',
                //     showClose: true,
                // });
                if(response.count==1){
                    this.content = response.data[0]['content']
                    this.funcId = response.data[0].id
                }
                else{
                    this.$message({
                        message: response.data[0],
                        type: 'error',
                        showClose: true,
                    });
                }
              })
        },
        getfun(vla){
            getCustomFunc({fileName:val}).then(response =>{
                this.content = response.data[0]['content']                
            })
        },

        add(){
            if (!this.fileName || !this.content){
                this.$message({
                    message: '请先输入函数文件名称和具体函数内容,在创建！！',
                    type: 'warning',
                    showClose: true
                });
                return
            }
            this.funcForm.fileName = this.fileName
            this.funcForm.content = this.content
            addCustomFunc(this.funcForm).then(respones =>{
                this.$message({
                    message:'创建成功',
                    type: 'success',
                    center: true
                })
            })
        },
        // 编辑
        edit(){
            this.funcForm.fileName = this.fileName
            this.funcForm.content = this.content
            if(this.fileName && this.content){
            updataCustomFunc(this.funcId,this.funcForm).then(response =>{
                this.$message({
                    message: '更新成功',
                    type: 'success'
                })
            })}
            else{
                return false
            }

        },

        // 删除
        del(){
            this.$confirm('是否要删除该文件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'}).then(() =>{
                if(this.funcId){
                    delCustomFunc(this.funcId).then(response =>{
                        this.fileName = ''
                        this.content = ''
                        this.funcId = ''
                    })
                }
                else{
                    return false
                }
                }).catch(()=>{})
                    },
                
    },
    mounted(){
        this.loadAll()
        // console.log(this.allFuncForm)
    },

}
</script>
<style scoped>
.form-class {
    background-color: #f5f5f5;
    padding-top: 10px;
}
</style>