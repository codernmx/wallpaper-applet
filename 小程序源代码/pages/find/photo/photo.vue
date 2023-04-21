<template>
	<view>
		<block v-if="!item">
			<view class="cu-card case dynamic">
				<view class="cu-item shadow">
					<view class="image">
						<image mode="aspectFit" :src="src"></image>
					</view>
				</view>
			</view>
			<view class="bottom" :class="cssTran ? 'closeCss' : 'openCss'" v-if="!loadFlag">
				<view class="nav-box">
					<view class="nav-tab" @click="backClick">
						<u-icon name="/static/icon/back.png" :size="44"></u-icon>
						<text>返回</text>
					</view>
					<view class="nav-tab" @click="downloadTap()">
						<u-icon name="/static/icon/duihuan.png" :size="42"></u-icon>
						<text>下载头像</text>
					</view>
					<view class="nav-tab">
						<u-icon name="/static/icon/shares.png" :size="44"></u-icon>
						<text>分享</text>
						<button open-type="share"
							style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;"></button>
					</view>
				</view>
			</view>

		</block>
		<block v-else>
			<view class="cu-card dynamic">
				<view class="cu-item shadow" style="height:260px;">
					<view class="grid flex-sub col-1">
						<view class="bg-img only-img"
							:style="'background-image:url(' + item.card + ');text-align:center'">
							<view class="cu-avatar round lg"
								:style="'background-image:url(' + item.avatar + ');width:100px;height:100px;margin-top:100px'">
							</view>
							<view class="content flex-sub">
								<view>{{item.name}}</view>
							</view>
							<view class="text-content">{{item.memo}}</view>
						</view>
					</view>
				</view>
			</view>


			<view class="bottom" :class="cssTran ? 'closeCss' : 'openCss'" v-if="!loadFlag">
				<view class="nav-box">
					<view class="nav-tab" @click="backClick">
						<u-icon name="/static/icon/back.png" :size="44"></u-icon>
						<text>返回</text>
					</view>
					<view class="nav-tab" @click="copy(item.name)">
						<u-icon name="/static/icon/copy1.png" size="40"></u-icon>
						<text>复制网名</text>
					</view>
					<view class="nav-tab" @click="copy(item.memo)">
						<u-icon name="/static/icon/copy1.png" size="42">
						</u-icon>
						<text>复制签名</text>
					</view>
					<view class="nav-tab" @click="downloadTap()">
						<u-icon name="/static/icon/duihuan.png" :size="42"></u-icon>
						<text>下载套图</text>
					</view>
					<view class="nav-tab">
						<u-icon name="/static/icon/shares.png" :size="44"></u-icon>
						<text>分享</text>
						<button open-type="share"
							style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;"></button>
					</view>
				</view>
			</view>

			<!-- <view class="weui-footer_fixed-bottom">
				<view class="padding flex flex-direction">
					<button @tap="copy" class="cu-btn bg-blue lg" :data-content="item.name">复制网名</button>
					<button @tap="copy" class="cu-btn bg-green margin-tb-sm lg" :data-content="item.memo">复制签名</button>
					<button @tap="saveImg" class="cu-btn bg-pink margin-tb-sm lg" :data-avatar="item.avatar"
						:data-card="item.card">下载套图</button>
					<button @tap="fh" class="cu-btn bg-red margin-tb-sm lg" :data-avatar="item.avatar"
						:data-card="item.card">返回</button>
				</view>
			</view> -->
		</block>
		<models v-if="loginShow" title="为了更好的玩机体验，快去授权登录吧" btnText="授权登录" @getUserInfo="getUserInfo"
			@close="loginShow = false"></models>
		
		<models v-if="downShow" :title="downTitle" :btnText="'看广告领 '+adIntegral+' 积分'" :authorize="false"
			@close="downShow = false" @save="adClick"></models>
		
		<models v-if="signShow" :authorize="false" :title="signTitle" btnText="知道了" closeText=" "
			@save="signShow = false"></models>
		
		<models v-show="adShow" :authorize="false" :ad="true" title="已成功保存到相册，别忘了分享给朋友哦！" btnText="分享给好友"
			closeText="暂时不用" @save="adShow = false" @close="adShow = false"></models>
		<view class="loading_page" v-show="loadFlag">
			<image src="/static/loading/loading.gif"></image>
		</view>
	</view>
</template>

<script>
	let videoAd = null;
	export default {
		data() {
			return {
				loadFlag: true,
				cssTran: false,
				src: null,
				item: null,
				adIntegral: 0,
				downIntegral: 0,
				
				loadFlag: true,
				loginShow: false,
				downShow: false,
		
				gglist: []
			};
		},

		components: {},
		props: {},
		// src=http%3A%2F%2Felf-deco.img.maibaapp.com%2Fcontent%2Fugc%2Fprofile%2F14766855%2F554dc3e7813fe14460d1db4a9f4734f6.jpg
		// src=http%3A%2F%2Felf-deco.img.m…2F14766855%2F554dc3e7813fe14460d1db4a9f4734f6.jpg
		onLoad: function(n) {
			var that = this;
			var o = n.src;

			if (null != o && this.setData({
					src: decodeURIComponent(o)
				}), null != n.item) {
				var c = JSON.parse(n.item);
				this.setData({
					item: c
				});
			}	
			that.loadFlag = false
			
			that.getConfig()
		},
		onReady: function() {},
		onShow: function() {},
		onHide: function() {},
		onUnload: function() {},
		onPullDownRefresh: function() {},
		onReachBottom: function() {},
		onShareAppMessage: function() {
			var share = null != this.src ? {
				title: "你觉得这个头像怎么样？",
				path: "/pages/photo/photo?src=" + encodeURIComponent(this.src),
				imageUrl: this.src
			} : null != this.item ? {
				title:"【" + this.item.name + "】" + this.item.memo,
				path: "/pages/photo/photo?item=" + JSON.stringify(this.item)
			} : void 0;
			console.log(share)
			return share
		},
		methods: {
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
			fh: function() {
				uni.navigateBack();
			},
			backClick() {
				uni.navigateBack()
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
			async downloadTap() {
				var that = this
				if (!that.vuex_user) {
					that.loginShow = true
					return
				}
				console.log('that.downIntegral', that.downIntegral)
				if (that.downIntegral > 0) {
					var integral = that.vuex_user.integral
					if (integral < that.downIntegral) {
						that.downShow = true
						that.downTitle = "<p style='font-weight: 550;font-size: 16px;'>下载需要 " + that.downIntegral +
							" 积分</p><p style='padding-top: 10px;'>您当前仅有<span class='num'>" + integral +
							"</span>积分，无法下载当前作品，快去赚积分吧~</p>"
						return
					}else{
						uni.showLoading({
							mask: true,
							title: '保存中...'
						})
						let query = await uniCloud.callFunction({
							name: 'place_photo',
							data: {
								userId: that.vuex_user._id,
								integral: that.downIntegral,
								},
						})
						console.log(query)
						if (query.result.success) {
							// 下载成功 请求用户积分
							that.getUser()
							that.saveImg()
							uni.hideLoading()
						
						} else {
							uni.showToast({
								mask: true,
								icon: 'none',
								title: query.result.msg,
								duration: 1000
							})
							uni.hideLoading()
						}
						
						
					}
				}else{
						that.saveImg()
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
			saveClick(){
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
				}else{
					saveImg()
				}
			},
			saveImg: function() {
				var that = this
				var o = that.item?that.item.avatar:null
				var c = that.item?that.item.card:null
				var e = that.src
				null != o && (o = o.replace("http", "https"));
		
				null != c && (c = c.replace("http", "https"));
	
				null != e && (e = e.replace("http", "https")), uni.getSetting({
					success: function(t) {
						t.authSetting["scope.writePhotosAlbum"] ? (null != o && null != c && (uni
							.getImageInfo({
								src: o,
								success: function(t) {
									uni.saveImageToPhotosAlbum({
										filePath: t.path,
										success: function(t) {
											uni.showToast({
												title: "下载成功",
												icon: "success",
												image: "",
												duration: 1e3,
												mask: !0,
												success: function(
													t) {},
												fail: function(t) {},
												complete: function(
													t) {}
											});
										},
										fail: function(t) {},
										complete: function(t) {}
									});
								},
								fail: function(t) {},
								complete: function(t) {}
							}), uni.getImageInfo({
								src: c,
								success: function(t) {
									uni.saveImageToPhotosAlbum({
										filePath: t.path,
										success: function(t) {
											uni.showToast({
												title: "下载成功",
												icon: "success",
												image: "",
												duration: 1e3,
												mask: !0,
												success: function(
													t) {},
												fail: function(t) {},
												complete: function(
													t) {}
											});
										},
										fail: function(t) {},
										complete: function(t) {}
									});
								},
								fail: function(t) {},
								complete: function(t) {}
							})), null != e && uni.getImageInfo({
							src: e,
							success: function(t) {
								uni.saveImageToPhotosAlbum({
									filePath: t.path,
									success: function(t) {
										uni.showToast({
											title: "下载成功",
											icon: "success",
											image: "",
											duration: 1e3,
											mask: !0,
											success: function(t) {},
											fail: function(t) {},
											complete: function(t) {}
										});
									},
									fail: function(t) {},
									complete: function(t) {}
								});
							},
							fail: function(t) {},
							complete: function(t) {}
						})) : uni.authorize({
							scope: "scope.writePhotosAlbum",
							success: function() {
								null != o && null != c && (uni.getImageInfo({
									src: o,
									success: function(t) {
										uni.saveImageToPhotosAlbum({
											filePath: t.path,
											success: function(t) {
												uni.showToast({
													title: "下载成功",
													icon: "success",
													image: "",
													duration: 1e3,
													mask: !
														0,
													success: function(
														t
														) {},
													fail: function(
														t
														) {},
													complete: function(
														t
														) {}
												});
											},
											fail: function(t) {},
											complete: function(t) {}
										});
									},
									fail: function(t) {},
									complete: function(t) {}
								}), uni.getImageInfo({
									src: c,
									success: function(t) {
										uni.saveImageToPhotosAlbum({
											filePath: t.path,
											success: function(t) {
												uni.showToast({
													title: "下载成功",
													icon: "success",
													image: "",
													duration: 1e3,
													mask: !
														0,
													success: function(
														t
														) {},
													fail: function(
														t
														) {},
													complete: function(
														t
														) {}
												});
											},
											fail: function(t) {},
											complete: function(t) {}
										});
									},
									fail: function(t) {},
									complete: function(t) {}
								})), null != e && uni.getImageInfo({
									src: e,
									success: function(t) {
										uni.saveImageToPhotosAlbum({
											filePath: t.path,
											success: function(t) {
												uni.showToast({
													title: "下载成功",
													icon: "success",
													image: "",
													duration: 1e3,
													mask: !0,
													success: function(
														t
														) {},
													fail: function(
														t
														) {},
													complete: function(
														t
														) {}
												});
											},
											fail: function(t) {},
											complete: function(t) {}
										});
									},
									fail: function(t) {},
									complete: function(t) {}
								});
							},
							fail: function() {
								uni.showModal({
									title: "未授权",
									content: "请授权",
									showCancel: !0,
									cancelText: "取消",
									cancelColor: "",
									confirmText: "确定",
									confirmColor: "",
									success: function(t) {},
									fail: function(t) {},
									complete: function(t) {}
								});
							}
						});
					}
				});
			},
			copy: function(n) {
				uni.setClipboardData({
					data: n,
					success: function(t) {
						uni.showToast({
							title: "复制完成",
							icon: "success",
							image: "",
							duration: 1e3,
							mask: !0,
							success: function(t) {},
							fail: function(t) {},
							complete: function(t) {}
						});
					},
					fail: function(t) {},
					complete: function(t) {}
				});
			}
		}
	};
</script>
<style>
	.dynamic{
		margin-top: 20%;
	}
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
	.closeCss {
		animation-name: closeLinear;
		animation-duration: 0.8s;
		animation-iteration-count: 1;
		bottom: -52px;
	}
	.weui-footer {
		color: #999;
		font-size: 14px;
		text-align: center;
	}

	.weui-footer_fixed-bottom {
		position: fixed;
		bottom: .52em;
		left: 0;
		right: 0;
	}

	.weui-footer__links {
		font-size: 0;
	}

	.weui-footer__link {
		display: inline-block;
		vertical-align: top;
		margin: 0 .62em;
		position: relative;
		font-size: 14px;
		color: #586c94;
	}

	.weui-footer__link:before {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		width: 1px;
		bottom: 0;
		border-left: 1rpx solid #c7c7c7;
		color: #c7c7c7;
		left: -.65em;
		top: .36em;
		bottom: .36em;
	}

	.weui-footer__link:first-child:before {
		display: none;
	}

	.weui-footer__text {
		padding: 0 .34em;
		font-size: 12px;
	}
</style>
