<template>
	<view class="content">
		<view class="" v-show="!loadShow">
			<view class="vtop">
				<view class="title u-flex u-row-left u-p-l-40" :style="{marginTop: menuButtonInfo.top+'px'}">
					<text>心动发现</text>
					<u-icon class="u-p-l-15" name="/static/icon/share.png" size="40"></u-icon>
					<button open-type="share" style="position: absolute;top: 20rpx;left: 230rpx;width: 50rpx;height: 50rpx;opacity: 0;"></button>
				</view>
			</view>
			<view class="" :style="{height: 'calc('+menuButtonInfo.top+'px + 80rpx)'}"></view>
			
			<view class="u-p-l-25 u-p-r-25 u-p-t-25">
				<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d855730a-95c0-4eaa-b07c-8488bf7860a1/6c494b17-0b51-4183-b688-75b5b49751cc.png" style="width:700rpx;height: 343rpx" @click="gqsignClick"></image>
				<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d855730a-95c0-4eaa-b07c-8488bf7860a1/ffd133a7-1c0d-479b-b985-06480a4b72b1.png" style="width:700rpx;height: 343rpx" @click="txsignClick"></image>
				<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d855730a-95c0-4eaa-b07c-8488bf7860a1/bca3c009-2be2-4bf6-91bf-e6b80b281834.png" style="width:700rpx;height: 343rpx" @click="ttsignClick"></image>
				<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d855730a-95c0-4eaa-b07c-8488bf7860a1/d1e5c62f-0086-4e44-8840-288470ecefce.png" style="width:700rpx;height: 343rpx" @click="designClick"></image>
				<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d855730a-95c0-4eaa-b07c-8488bf7860a1/c485db37-820b-4959-a64e-b01b98bfba33.png" style="width:700rpx;height: 343rpx" @click="signClick"></image>
				<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-f9121d0f-d69d-40de-bfae-04510a892a7d/24f959c7-68d3-4a26-8e9b-862a387a99f8.png" style="width:700rpx;height: 343rpx" @click="adClick"></image>
				
				
			</view>
			
			<view class="" style="height: 180rpx;"></view>
		</view>
		<view class="loading_page" v-show="loadShow">
			<image src="/static/loading/loading.gif"></image>
		</view>
		
		<foo-bar @toIndex="toIndex" :home="2"></foo-bar>
		
		<models v-if="loginShow"
		title="授权登录探索更多精彩内容!"
		btnText="授权登录" 
		@getUserInfo="getUserInfo" 
		@close="loginShow = false"></models>
		
		<models v-if="signShow"
		:authorize="false" 
		:title="signTitle"
		btnText="知道了" 
		closeText=" " 
		@save="signShow = false"></models>
	</view>
</template>

<script>
	let videoAd = null;
	let menuButtonInfo = {};
	// 如果是小程序，获取右上角胶囊的尺寸信息，避免导航栏右侧内容与胶囊重叠(支付宝小程序非本API，尚未兼容)
	// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
	menuButtonInfo = uni.getMenuButtonBoundingClientRect();
	// #endif
	var app = getApp()
	
	import fooBar from  '@/components/fooBar/fooBar.vue'
	import models from '@/components/model/model.vue'
	export default {
		components:{
			fooBar,
			models
		},
		data() {
			return {
				menuButtonInfo: menuButtonInfo,
				loadShow: true,
				signShow: false,
				signTitle: '',
				isSign: false,
				// 登录弹窗
				loginShow: false
			}
		},
		async onLoad() {
			uni.hideTabBar()
			let that = this
			that.loadShow = false
			that.adLoad()
		},
		methods: {
			async toIndex(index){
				let that = this
				if(index == 0){
					uni.switchTab({
						url: '/pages/index/index'
					})
				}else if(index == 1){
					uni.switchTab({
						url: '/pages/center/center'
					})
				}else if(index == 3){
					uni.switchTab({
						url: '/pages/user/user'
					})
				}
			},
			designClick(){
				let that = this
				if(!that.vuex_user){
					that.loginShow = true
					return
				}
				uni.navigateTo({
					url: '/pages/find/design/design'
				})
			},
			txsignClick(){
				let that = this
				if(!that.vuex_user){
					that.loginShow = true
					return
				}
				uni.navigateTo({
					url: '/pages/find/profile/profile'
				})
			},
			ttsignClick(){
				let that = this
				if(!that.vuex_user){
					that.loginShow = true
					return
				}
				uni.navigateTo({
					url: '/pages/find/gallery/gallery'
				})
			},
			gqsignClick(){
				let that = this
				if(!that.vuex_user){
					that.loginShow = true
					return
				}
				uni.navigateTo({
					url: '/pages/find/dynamic/dynamic'
				})
			},
			async getSign(){
				let that = this
				const startTime = new Date(new Date().toLocaleDateString()).getTime()
				const endTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
				let query = await uniCloud.callFunction({
					name: 'sign_flag',
					data: {
						dbName: 'wx_sign',
						"userId": that.vuex_user._id,
						"startTime": startTime,
						"endTime": endTime
					},
				})
				if(query.result.success) that.isSign = true
				else that.isSign = false
			},
			async signClick(){
				var that = this
				if(!that.vuex_user){
					that.loginShow = true
					return
				}
				await that.getSign()
				if(that.isSign) {
					uni.showToast({
						icon: 'none',
						mask: true,
						title: '今日已签到',
						duration: 1500
					})
					return
				}
				
				uni.showLoading({
					mask: true,
					title: '签到中...'
				})
				let sign = await uniCloud.callFunction({
					name: 'sign_add',
					data: {
						"userId": that.vuex_user._id
					},
				})
				uni.hideLoading()
				if(sign.result.success){
					that.getUser()
					that.signTitle = "<p style='font-weight: 550;font-size: 16px;'>签到成功</p><p style='padding-top: 10px;'>获得<span class='num'>"+sign.result.integral+"</span>积分</p>"
					that.signShow = true
					that.isSign = true
				}else{
					uni.showToast({
						icon: 'none',
						mask: true,
						title: sign.result.msg,
						duration: 1500
					})
				}
			},
			luckClick(){
				let that = this
				if(!that.vuex_user){
					that.loginShow = true
					return
				}				
			},
			adClick(){
				var that = this
				if(!that.vuex_user){
					that.loginShow = true
					return
				}
				if (videoAd) {
					videoAd.show().catch(err => {
					// 失败重试
					// console.log("广告拉去失败")
					videoAd.load().then(() => videoAd.show())
					})
				}
			},
			adLoad(){
				var that = this
				if (wx.createRewardedVideoAd) {
					// 加载激励视频广告
					// #ifdef MP-QQ
					videoAd = wx.createRewardedVideoAd({
						adUnitId: that.vuex_qqUnitId
					});
					// #endif
					// #ifdef MP-WEIXIN
					videoAd = wx.createRewardedVideoAd({
						adUnitId: that.vuex_videoUnitId
					});
					// #endif
					//捕捉错误
					videoAd.onError(err => {
						// 进行适当的提示
						console.log('videoAd onError', err);
					});
					// 监听关闭
					videoAd.onClose(status => {
						if ((status && status.isEnded) || status === undefined) {
							// 正常播放结束，下发奖励
							if(that.vuex_user){
								that.userIntegral()
							}
						} else {
							// 播放中途退出，进行提示
							console.log('中途退出')
						}
					});
				}
			},
			async userIntegral(){
				var that = this
				uni.showLoading({
					mask: true,
					title: '正在拼命加载中...'
				})
				let data = await uniCloud.callFunction({
					name: 'user_integral',
					data: {
						userId: that.vuex_user._id
					},
				})
				uni.hideLoading()
				if(data.result.success){
					that.getUser()
					that.signTitle = "<p style='font-weight: 550;font-size: 16px;'>观看成功</p><p style='padding-top: 10px;'>获得<span class='num'>"+data.result.integral+"</span>积分</p>"
					that.signShow = true
				}
			},
			async getUser(){
				let that = this
				let detail = await uniCloud.callFunction({
					name: 'query_map',
					data: {
						dbName: "wx_user",
						id: that.vuex_user._id
					},
				})
				that.$u.vuex('vuex_user', detail.result)
			},
			
			
			// 登录
			getUserInfo(){
				var that = this
				// #ifdef MP-WEIXIN
				uni.getUserProfile({
					  desc: '个人登录，记录数据', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					  success(res) {
						  console.log(res)
						  that.name = res.userInfo.nickName; //昵称
						  that.avatar = res.userInfo.avatarUrl; //头像
						  that.wxlogin();
					  },
					  fail() {
						  console.log("获取用户信息失败");
					  }
					});
				// #endif
				// #ifdef MP-QQ
				uni.getUserInfo({
					// 获取信息成功
					success(res) {
						console.log(res)
						that.name = res.userInfo.nickName; //昵称
						that.avatar = res.userInfo.avatarUrl; //头像
						that.wxlogin();
					},
					fail() {
						console.log("获取用户信息失败");
					}
				});
				// #endif
			},
			//已经授权，自动登录
			async wxlogin() {
				let that = this;
				uni.showLoading({
					title: '登录中...'
				});
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						let code = loginRes.code;
						that.wxloginres(code);
					},
				});
				
			},
			//登录后提交服务器获取进一步信息
			async wxloginres(wxcode) {
				let that = this;
				
				var userId = uni.getStorageSync('userId')
				
				var mptype
				// #ifdef MP-WEIXIN
					mptype = 'wx'
				// #endif
				// #ifdef MP-QQ
					mptype = 'qq'
				// #endif
				
				let authorize = await uniCloud.callFunction({
					name: 'user_authorize',
					data: {
						name: that.name,
						avatar: that.avatar,
						mptype: mptype,
						code: wxcode,
						userId: userId,
					},
				})
				if(authorize.result.success){
					that.$u.vuex('vuex_user',authorize.result.data)
					that.getUser()
					uni.showToast({
						icon: 'none',
						mask: true,
						title: '登录成功，再次点击探索新功能吧！',
						duration: 1500
					})
					uni.removeStorageSync('userId')
				}else{
					uni.showToast({
						icon: 'none',
						mask: true,
						title: authorize.result.msg,
						duration: 1500
					})
				}
				that.loginShow = false
			},
		}
	}
</script>

<style lang="scss" scoped>
	.vtop{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background-color: #FFFFFF;
		z-index: 999999;
		.title{
			position: relative;
			color: #303030;
			font-size: 20px;
			line-height: 80rpx;
		}
	}
	.tab{
		background-image: linear-gradient(to top, #50e4c0 , #23ccbe);
		width: 690rpx;
		height: 300rpx;
		border-radius: 24rpx;
	}
</style>
