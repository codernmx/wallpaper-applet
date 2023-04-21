'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const transaction = await db.startTransaction()
	var opt = event.option
	var data = event.data

	switch(opt)
		{
			case "get":
				let res_get = await db.collection('wx_coupons').orderBy("sort", "desc").get();
				if(!res_get.data){
					transaction.rollback(-100)
					return {
						success: false,
						msg: '获取失败'
					}
				}
				return {
						success: true,
						data: res_get.data
					}
			case "add":
				var res_add = await transaction.collection('wx_coupons').add(data)
				if(res_add.inserted === 0){
					// 用户增加CPS配置
					transaction.rollback(-100)
					return {
						success: false,
						msg: '异常错误'
					}
				}
				await transaction.commit()
				return {
					success: true
				}

			case "update":
				var couponId = event.couponId
				let res_update = await transaction.collection('wx_coupons').doc(couponId).update(data)
				if(res_update.updated === 0){
					//扣除积分失败
					transaction.rollback(-100)
					return {
						success: false,
						msg: '异常错误'
					}
				}
				await transaction.commit()
				return {
					success: true
				}

			case "delete":
				var couponId = event.couponId
				let res_delete = await transaction.collection("wx_coupons").doc(couponId).remove()
				if(res_delete.deleted === 0){
					return {
						success: false,
						msg: '删除失败'
					}
				}
				await transaction.commit()
				return {
					success: true
				}
		}
	
};
