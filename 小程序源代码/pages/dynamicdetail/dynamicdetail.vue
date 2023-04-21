<template>
	<view class="">
		<video autoplay loop @tap="videoTap" controls="false" enableProgressGesture="false" objectFit="cover"
			showCenterPlayBtn="false" showFullscreenBtn="false" showPlayBtn="false" :src="videoSrc"></video>
		<view class="date-container">
			<text class="time">{{time}}</text>
			<text class="date">{{date}}</text>
			<text class="notice u-text-center">{{notice}}</text>
		</view>
		<view class="bottom" :class="cssTran ? 'closeCss' : 'openCss'" v-if="!loadFlag">
			<view class="nav-box">
				<view class="nav-tab" @click="backClick">
					<u-icon name="/static/icon/back.png" :size="44"></u-icon>
					<text>返回</text>
				</view>
				<view class="nav-tab" @click="downloadTap">
					<u-icon name="/static/icon/duihuan.png" :size="42"></u-icon>
					<text>下载</text>
				</view>
				<view class="nav-tab">
					<u-icon name="/static/icon/shares.png" :size="44"></u-icon>
					<text>分享</text>
					<button open-type="share"
						style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;"></button>
				</view>
			</view>
		</view>
		<models v-if="loginShow" title="为了更好的玩机体验，快去授权登录吧" btnText="授权登录" @getUserInfo="getUserInfo"
			@close="loginShow = false"></models>

		<models v-if="downShow" :title="downTitle" :btnText="'看广告领 '+adIntegral+' 积分'" :authorize="false"
			@close="downShow = false" @save="adClick"></models>

		<models v-if="signShow" :authorize="false" :title="signTitle" btnText="知道了" closeText=" "
			@save="signShow = false"></models>

		<models v-show="adShow" :authorize="false" :ad="true" title="已成功保存到相册，别忘了分享给朋友哦！" btnText="分享给好友"
			closeText="暂时不用" @save="adShow = false" @close="adShow = false"></models>
		<!-- 	<view class="bottom-container">
			<view @tap="downloadTap" class="download-container">
				下载壁纸
			</view>
		</view> -->
		<!-- <image @tap="backTap" class="back" src="/static/images/back.png"></image> -->
		<view class="loading_page" v-show="loadFlag">
			<image src="/static/loading/loading.gif"></image>
		</view>
	</view>
</template>

<script>
	import models from '@/components/model/model.vue'
	export default {
		data() {
			return {
				videoSrc: "",
				imgSrc: "",
				
				videoTitle: "",
				hideBtn: !1,
				cssTran: false,
				loadFlag: true,
				loginShow: false,
				downShow: false,

				adIntegral: 0,
				downIntegral: 0,


				downTitle: '',
				downBtn: '',
				adShow: false,
				notice: '更多动态壁纸请下载火萤视频壁纸'
			};
		},

		components: {
			models
		},
		props: {},
		onLoad: function(t) {
			var that = this;
			var e = decodeURIComponent(t.url);
			var imgSrc = decodeURIComponent(t.imgSrc);
			that.setData({
				videoSrc: e,
				imgSrc: imgSrc,
				videoTitle: t.title
			});
			that.getDate();
			that.getConfig();
			if (that.vuex_user) {
				that.getUser()
			}
			that.loadFlag = false
		},
		onShareAppMessage: function() {
			return {
				title: "精选高清手机壁纸，动态壁纸，头像",
				path: "pages/find/dynamic/dynamic"
			};
		},
		methods: {
			backTap: function(t) {
				uni.navigateBack({
					delta: 1
				});
			},
			videoTap: function(t) {
				this.setData({
					hideBtn: !this.hideBtn
				});
			},
			async getConfig() {
				let that = this
				let config = await uniCloud.callFunction({
					name: 'config_map',
					data: {
						'keys': ['downIntegral', 'adIntegral']
					},
				})
				if (config.result.success) {
					that.downIntegral = parseInt(config.result.data[0])
					that.adIntegral = parseInt(config.result.data[1])
				}
			},
			adClick() {
				var that = this
				if (!that.vuex_user) {
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
			adLoad() {
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
						console.log('videoAd onError', res);
					});
					// 监听关闭
					videoAd.onClose(status => {
						that.downShow = false
						if ((status && status.isEnded) || status === undefined) {
							// 正常播放结束，下发奖励
							if (that.vuex_user) {
								that.userIntegral()
							}
						} else {
							// 播放中途退出，进行提示
							console.log('中途退出')
						}
					});
				}
			},
			async userIntegral() {
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
				if (data.result.success) {
					that.getUser()
					that.signTitle =
						"<p style='font-weight: 550;font-size: 16px;'>观看成功</p><p style='padding-top: 10px;'>获得<span class='num'>" +
						data.result.integral + "</span>积分</p>"
					that.signShow = true
				}
			},
			async getUser() {
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
			getUserInfo() {
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
				if (authorize.result.success) {
					that.$u.vuex('vuex_user', authorize.result.data)
					// 登陆成功  获取收藏点赞
					uni.showToast({
						icon: 'none',
						mask: true,
						title: '登录成功',
						duration: 1500
					})
					uni.removeStorageSync('userId')
				} else {
					uni.showToast({
						icon: 'none',
						mask: true,
						title: authorize.result.msg,
						duration: 1500
					})
				}
				that.loginShow = false
			},
			async downloadTap() {
				var that = this
				if (!that.vuex_user) {
					that.loginShow = true
					return
				}
				if (that.downIntegral > 0) {
					var integral = that.vuex_user.integral
					if (integral < that.downIntegral) {
						that.downShow = true
						that.downTitle = "<p style='font-weight: 550;font-size: 16px;'>下载需要 " + that.downIntegral +
							" 积分</p><p style='padding-top: 10px;'>您当前仅有<span class='num'>" + integral +
							"</span>积分，无法下载当前作品，快去赚积分吧~</p>"
						return
					}
					uni.showLoading({
						mask: true,
						title: '保存中...'
					})

					let query = await uniCloud.callFunction({
						name: 'place_dynamic',
						data: {
							userId: that.vuex_user._id,
							integral: that.downIntegral,
							name: that.videoTitle,
							image: that.imgSrc,
							videoUrl: that.videoSrc.replace("http", "https"),
						},
					})
					if (query.result.success) {
						// 下载成功 请求用户积分
						that.getUser()
						that.save()
					} else {
						uni.showToast({
							mask: true,
							icon: 'none',
							title: query.result.msg,
							duration: 1000
						})
					}

				} else {
					that.save()
				}

			},
			save: function() {
				uni.showLoading({
					title: "下载中"
				});
				var t = this;
				uni.downloadFile({
					url: t.videoSrc.replace("http", "https"),
					success: function(t) {
						200 === t.statusCode && uni.saveVideoToPhotosAlbum({
							filePath: t.tempFilePath,
							success: function(t) {
								uni.hideLoading(), uni.showModal({
									content: "保存成功，请在相册中查看",
									confirmText: "知道了",
									showCancel: !1
								});
							}
						});
					}
				});
				uni.hideLoading()
			},
			getDate: function() {
				var t = new Date(),
					e = (t.getFullYear(), t.getMonth() + 1),
					o = t.getDate(),
					a = t.getHours(),
					n = t.getMinutes(),
					i = (t.getSeconds(), e + "月" + o + "日"),
					s = [a, n].map(this.formatNumber).join(":");
				console.log(i), console.log(s), this.setData({
					date: i,
					time: s
				});
			},
			formatNumber: function(t) {
				return (t = t.toString())[1] ? t : "0" + t;
			},
			backClick() {
				uni.navigateBack()
			},
			cssClick() {
				this.cssTran = !this.cssTran
			}
		}
	};
</script>
<style>
	.bottom {
		position: fixed;
		left: 4%;
		right: 0;
		width: 92%;
		height: 52px;
		box-shadow: 0 0px 8px rgba(0, 0, 0, 0.06);
		background: rgba(0, 0, 0, 0.94);
		border-radius: 49px;
		z-index: 10;
		opacity: 0.8;
	}

	.nav-tab {
		position: relative;
		width: 100%;
		height: 52px;
		font-size: 12px;
		color: #D8D8D8;
		font-weight: 400;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.nav-box {
		/* position: absolute; */
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		width: 100%;
		box-sizing: border-box;
	}

	.openCss {
		animation-name: openLinear;
		animation-duration: 0.8s;
		animation-iteration-count: 1;
		bottom: 40px;
	}

	@keyframes openLinear {
		0% {
			transform: translateY(92px);
		}

		100% {
			transform: translateY(0px);
		}
	}

	.closeCss {
		animation-name: closeLinear;
		animation-duration: 0.8s;
		animation-iteration-count: 1;
		bottom: -52px;
	}


	.container {
		position: relative;
	}

	.container,
	video {
		width: 100%;
		height: 100%;
	}

	video {
		position: absolute;
	}

	.bottom-container {
		width: 100%;
		position: absolute;
		bottom: 50rpx;
	}

	.bottom-container,
	.download-container {
		height: 100rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.download-container {
		width: 70%;
		color: #fff;
		font-size: 32rpx;
		border-radius: 50px;
		background: #000;
		opacity: .7;
		font-weight: 700;
	}

	.back {
		width: 45px;
		height: 45px;
		position: absolute;
		background-color: #fff;
		left: 40rpx;
		top: 80rpx;
		opacity: .7;
		border-radius: 500px;
	}

	.date-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 150rpx;
		opacity: .9;
	}

	.time {
		font-size: 120rpx;
		color: #fff;
	}

	.date {
		font-size: 40rpx;
		color: #fff;
	}

	.notice {
		font-size: 40rpx;
		color: #fff;
		align-items: center;
	}
</style>
