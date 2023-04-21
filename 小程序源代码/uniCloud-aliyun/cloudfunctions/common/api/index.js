'use strict';
const db = uniCloud.database();
async function authorization() {
  let wxAppIds
  let wxAppId
  let qqAppIds
  let qqAppId
  let authorizationIds
  let authorizationId
  authorizationIds = await db.collection('wx_config').where({'key': 'authorizationId'}).get()
  wxAppIds = await db.collection('wx_config').where({'key': 'wxId'}).get()
  qqAppIds = await db.collection('wx_config').where({'key': 'qqId'}).get()

  if (wxAppIds.data.length === 0 && qqAppIds.data.length === 0) {
  	return {
  		success: false,
  		msg: '未配置登录参数'
  	}
  }
  if(authorizationIds.data.length === 0){
	  authorizationId = 'no_authorization'
  }else{
	  authorizationId = authorizationIds.data[0].val
  }
  if(wxAppIds.data.length!=0){
	  wxAppId = wxAppIds.data[0].val
  }
  if(qqAppIds.data.length!=0){
  	  qqAppId = qqAppIds.data[0].val
  }
  
  let url = "https://wallpaper.fkvip.club/wallpaper_authorization/"
  let params = {
  	method: "POST",
	contentType: 'json',
	dataType: 'json',
  	data: {
  	    'wxAppId': wxAppId,
  	    'qqAppId': qqAppId,
  	    'authorizationId': authorizationId
  	},
  	header: {
  	    "content-type": "application/json"
  	}
  }
  const response = await uniCloud.httpclient.request(url, params);
  if(response.data){
		console.log('response.data', response.data)
		return response.data
  }else{
	  return {
	  	success: false,
	  	msg: '访问失败'
	  }
  }
}
module.exports = {
	authorization
}
