'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	// 创建回滚
	const transaction = await db.startTransaction()
	
	let timeStamp = new Date().getTime()
	var integral = parseInt(event.integral)
	var userId = event.userId
	let coverName = event.name
	let coverImage = event.image
	let videoUrl = event.videoUrl
	try{

		// 查看是否曾经下载过
		var downloads = await db.collection('wx_order').where({
			'user_id': userId,
			'image': coverImage
		}).get()
		if(downloads.data.length > 0){
			// 有下载记录  不再扣除积分
			return {
				success: true,
				msg: '下载成功'
			}
		}else if(integral > 0){
			// 查询用户信息
			let users = await transaction.collection('wx_user').doc(userId).get()
			if(!users.data){
				// 用户信息错误，请重新登录
				transaction.rollback(-100)
				return {
					success: false,
					msg: '用户不存在'
				}
			}
			let user = users.data
			let userName = user.name
			// 判断积分
			let userIntegral = user.integral
			if(userIntegral < integral){
				// 积分不足
				transaction.rollback(-100)
				return {
					success: false,
					msg: '积分不足'
				}
			}
			
			// 用户扣除积分
			let userResult = await transaction.collection('wx_user').doc(userId).update({
				'integral': dbCmd.inc(-integral),
			})
			if(userResult.updated === 0){
				//扣除积分失败
				transaction.rollback(-100)
				return {
					success: false,
					msg: '异常错误'
				}
			}
			// 用户增加积分记录
			var recordUserResult = await transaction.collection('wx_record').add({
				'mode': 0,
				'name': '下载动态壁纸：'+coverName,
				'integral': integral,
				'user_id': userId,
				'time': timeStamp
			})
			if(recordUserResult.inserted === 0){
				// 用户积分记录增加失败
				transaction.rollback(-100)
				return {
					success: false,
					msg: '异常错误'
				}
			}
		}
		
		// 构建订单
		let order = {
			'user_id': userId,
			'integral': integral,
			'image': coverImage,
			'videoUrl': videoUrl,
			'order_type': 'dynamic',
			'time': timeStamp
		}
		
		var orderResult = await transaction.collection('wx_order').add(order)
		if(orderResult.inserted === 0){
			// 订单构建失败
			transaction.rollback(-100)
			return {
				success: false,
				msg: '异常错误'
			}
		}
		
		await transaction.commit()
		return {
			success: true,
			msg: '下载成功'
		}
	}catch(e){
		console.log(e)
		await transaction.rollback()
		return {
			success: false,
			msg: e
		}
	}
};
