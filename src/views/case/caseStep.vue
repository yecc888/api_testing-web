<template>
    <div class="app-container">
        <el-button @click="goBack">返回</el-button>

        <div style="border-bottom: 1px solid #d9d9d9">
        <p>wafafadfassafsafadfdf</p>
        </div>

        

    </div>
</template>

<script>
export default {
    name: 'addCaseStep',
    data(){
        return{
             caseId:null,
             casedata:null,
        }
    },
    methods:{
        getCaseId(){
        this.caseId = this.$route.params.caseId
        this.casedata = this.$route.params.casedata
        },
        goBack(){
            this.$router.go(-1)
        },
    },
    created(){
        this.getCaseId()
    },
}
</script>

<style>

</style>