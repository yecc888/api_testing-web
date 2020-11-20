import request from "@/utils/request";

//获取项目动态
export function getProjectdynamic(query) {
  return request({
    url: "/api/projectdynamic/",
    method: "get",
    params: query
  });
}

//获取项目列表
export function getProjectList(params) {
  return request({
    url: "/api/projects/",
    method: "get",
    params: params
  });
}

//新增项目
export function createProject(data) {
  return request({
    url: "/api/projects/",
    method: "post",
    data: data
  });
}

//更新项目
export function updataProject(id, data) {
  return request({
    url: "/api/projects/" + id + "/",
    method: "put",
    data: data
  });
}

//删除项目
export function delProject(id) {
  return request({
    url: "/api/projects/" + id + "/",
    method: "delete"
  });
}

//获取环境列表
export function getEnvList(params) {
  return request({
    url: "/api/envs/",
    method: "get",
    params: params
  });
}

//新增环境
export function createEnv(data) {
  return request({
    url: "/api/envs/",
    method: "post",
    data: data
  });
}

//更新环境
export function updataEnv(id, data) {
  return request({
    url: "/api/envs/" + id + "/",
    method: "put",
    data: data
  });
}

//删除环境
export function delEnv(id) {
  return request({
    url: "/api/envs/" + id + "/",
    method: "delete"
  });
}

//获取模块列表
export function getModelList(params) {
  return request({
    url: "/api/models/",
    method: "get",
    params: params
  });
}

//新增模块
export function createModel(data) {
  return request({
    url: "/api/models/",
    method: "post",
    data: data
  });
}

//更新模块
export function updataModel(id, data) {
  return request({
    url: "/api/models/" + id + "/",
    method: "put",
    data: data
  });
}

//删除模块
export function delModel(id) {
  return request({
    url: "/api/models/" + id + "/",
    method: "delete"
  });
}

// 获取用户列表
export function getUserList(params) {
  return request({
    url: "/api/users/",
    method: "get",
    params: params
  });
}

//新增用户
export function createUser(data) {
  return request({
    url: "/api/users/",
    method: "post",
    data: data
  });
}

//更新用户
export function updataUser(id, data) {
  return request({
    url: "/api/users/" + id + "/",
    method: "put",
    data: data
  });
}

//删除用户
export function delUser(id) {
  return request({
    url: "/api/users/" + id + "/",
    method: "delete"
  });
}

// 获取接口列表
export function getInterfaceList(params) {
  return request({
    url: "/api/interface/",
    method: "get",
    params: params
  });
}

// 获取单个接口列表
export function getInterface(id) {
  return request({
    url: "/api/interface/" + id + "/",
    method: "get"
  });
}

//新增接口
export function createInterface(data) {
  return request({
    url: "/api/interface/",
    method: "post",
    data: data
  });
}

//更新接口
export function updatInterface(id, data) {
  return request({
    url: "/api/interface/" + id + "/",
    method: "put",
    data: data
  });
}

//删除接口
export function delInterface(id) {
  return request({
    url: "/api/interface/" + id + "/",
    method: "delete"
  });
}

// 获取Header模板列表
export function getHeadertempList(params) {
  return request({
    url: "/api/headertemp/",
    method: "get",
    params: params
  });
}

//新增Header模板
export function createHeadertemp(data) {
  return request({
    url: "/api/headertemp/",
    method: "post",
    data: data
  });
}

//更新Header模板
export function updatHeadertemp(id, data) {
  return request({
    url: "/api/headertemp/" + id + "/",
    method: "put",
    data: data
  });
}

//删除Header模板
export function delHeadertemp(id) {
  return request({
    url: "/api/headertemp/" + id + "/",
    method: "delete"
  });
}

//快速测试接口
export function sendApi(data) {
  return request({
    url: "/api/send/",
    method: "post",
    data: data
  });
}

// 获取自定义变量
export function getCustomParaList(params) {
  return request({
    url: "/api/custom/parameters/",
    method: "get",
    params: params
  });
}

//新增自定义变量
export function createCustomPara(data) {
  return request({
    url: "/api/custom/parameters/",
    method: "post",
    data: data
  });
}

//更新自定义变量
export function updatCustomPara(id, data) {
  return request({
    url: "/api/custom/parameters/" + id + "/",
    method: "put",
    data: data
  });
}

//删除自定义变量
export function delCustomPara(id) {
  return request({
    url: "/api/custom/parameters/" + id + "/",
    method: "delete"
  });
}

// 获取mock接口
export function getMockInfoList(params) {
  return request({
    url: "/api/mockinfo/",
    method: "get",
    params: params
  });
}

//新增mock接口
export function createMockInfo(data) {
  return request({
    url: "/api/mockinfo/",
    method: "post",
    data: data
  });
}

//更新mock接口
export function updatMockInfo(id, data) {
  return request({
    url: "/api/mockinfo/" + id + "/",
    method: "put",
    data: data
  });
}

//部分更新mock接口
export function PatchUpdatMockInfo(id, data) {
    return request({
      url: "/api/mockinfo/" + id + "/",
      method: "patch",
      data: data
    });
  }


//删除mock接口
export function delMockInfo(id) {
  return request({
    url: "/api/mockinfo/" + id + "/",
    method: "delete"
  });
}
