'use strict';
const db = uniCloud.database();
const {
	authorization
} = require('api');
exports.main = async (event, context) => {
	var authorizationRes = true
	var dbName = event.dbName
	var id = event.id
	var data = {}
	let res = await authorization()
	console.log(res)
	if(res.success){
		authorizationRes = res.authorization
	}
	
	let result = await db.collection(dbName).doc(id).get();
	
	if(result.data.length > 0){
		data = result.data[0]
		if(!authorizationRes && data.images){
			data.images = ["https://vkceyugu.cdn.bspapp.com/VKCEYUGU-78520f1c-3663-464d-80c0-e3b6532e3958/7bdb4e36-54bd-4e28-ade3-1fd8e6d1ce56.jpg"]
		}
	}
	
	return data
};
