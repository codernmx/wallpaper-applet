'use strict';
const db = uniCloud.database();
const MAX_LIMIT = 100
exports.main = async (event, context) => {
	
	let appIds = await db.collection('wx_config').where({'key': 'wxId'}).get()
	let appSecrets = await db.collection('wx_config').where({'key': 'wxSecret'}).get()
	if (appIds.data.length === 0 || appSecrets.data.length === 0) {
		return '未配置系统参数'
	}
	const APPID = appIds.data[0].val
	const APPSECRET = appSecrets.data[0].val
	var token = ''
	try {
		var url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
		const res = await uniCloud.httpclient.request(url,{
			method:"GET",
			contentType: 'json',
			dataType:"json"
		})
		var data = res.data
		if(!data.access_token){
			return '获取TOKEN失败'
		}
		token = data.access_token
	} catch (e) {
		console.log(e)
		return '异常错误'
	}
	
	let accessTokens = await db.collection('wx_config').where({'key': 'access_token'}).get()
	const _id = accessTokens.data[0]._id
	
	let result = await db.collection('wx_config').doc(_id).update({
		val: token
	})
	
	if(result.updated > 0){
		console.log('token更新成功')
	}
}