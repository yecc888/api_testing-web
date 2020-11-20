import request from "@/utils/request";


//获取用例列表
export function getCaseList(params) {
  return request({
    url: "/api/case/",
    method: "get",
    params: params
  });
}

//新增用例
export function createCase(data) {
  return request({
    url: "/api/case/",
    method: "post",
    data: data
  });
}

//更新用例
export function updataCase(id, data) {
  return request({
    url: "/api/case/" + id + "/",
    method: "put",
    data: data
  });
}

//删除用例
export function delCase(id) {
  return request({
    url: "/api/case/" + id + "/",
    method: "delete"
  });
}


//获取分组列表
export function getaCaseGroupList(params) {
    return request({
      url: "/api/caseGroup/",
      method: "get",
      params: params
    });
  }
  
  //新增分组
  export function createCaseGroup(data) {
    return request({
      url: "/api/caseGroup/",
      method: "post",
      data: data
    });
  }
  
  //更新分组
  export function updataCaseGroup(id, data) {
    return request({
      url: "/api/caseGroup/" + id + "/",
      method: "put",
      data: data
    });
  }
  
  //删除分组
  export function delCaseGroup(id) {
    return request({
      url: "/api/caseGroup/" + id + "/",
      method: "delete"
    });
  }
  
  
//获取单个接口请求结果历史信息
export function getApiRespList(params) {
    return request({
      url: "/api/getApiResp/",
      method: "post",
      params: params
    });
  }

  //新增自定义函数
export function addCustomFunc(data) {
    return request({
      url: "/api/addFunc/",
      method: "post",
      data: data
    });
  }

  //获取单个指定的自定义函数
export function getCustomFunc(params) {
    return request({
      url: "/api/addFunc/",
      method: "get",
      params: params
    });
  }

  //获取全部自定义函数
export function getAllCustomFunc(params) {
    return request({
      url: "/api/editFunc/",
      method: "get",
      params: params
    });
  }



    //更新自定义函数
export function updataCustomFunc(id, data) {
        return request({
          url: "/api/editFunc/" + id + "/",
          method: "put",
          data: data
        });
      }
      
      //删除自定义函数
export function delCustomFunc(id) {
        return request({
          url: "/api/editFunc/" + id + "/",
          method: "delete"
        });
      }