<template>
	<view>
		<view class="tab-container" v-if="!vuex_isShenHe">
			<view @tap="searchTap" class="tab-item">
				<view class="img-container1">
					<image class="img" src="/static/images/item_search.png"></image>
				</view>
				<text>搜索</text>
			</view>
			<view @tap="dayTap" class="tab-item">
				<view class="img-container2">
					<image class="img" src="/static/images/item_hot.png"></image>
				</view>
				<text>每日精选</text>
			</view>
			<view @tap="chaoQingTap" class="tab-item">
				<view class="img-container3">
					<image class="img" src="/static/images/item_sixty.png"></image>
				</view>
				<text>60帧超清</text>
			</view>
			<view @tap="QLTap" class="tab-item">
				<view class="img-container4">
					<image class="img" src="/static/images/item_couple.png"></image>
				</view>
				<text>情侣壁纸</text>
			</view>
		</view>
		<scroll-view @refresherrefresh="refresh" class="scroll-body" enhanced="true" :lower-threshold="350"
			refresher-enabled="true" :refresher-triggered="refreshStatus" :scrollTop="scrollTop" scroll-y="true"
			show-scrollbar="false" :style="'height:' + scrollH">
			<block v-for="(item, index) in videos" :key="index">
				<view @tap="preview" class="grid-item" :data-item="item">
					<view class="g">
						<image class="photo" mode="aspectFill" :src="item.thumb_img"></image>
						<view class="info">
							<text class="title">{{item.title}}</text>
							<view class="count-container">
								<image class="iv" src="/static/images/play_num.png"></image>
								<text class="count">{{item.play_num}}</text>
							</view>
						</view>
					</view>
				</view>

			</block>
		</scroll-view>
	</view>
</template>

<script>
	var e,
		t = require("../../utils/api"),
		i = getApp(),
		a = null,
		o = "";

	export default {
		data() {
			return {
				videos: [],
				refreshStatus: !1,
				scrollTop: 0,
				hideGuide: !0,
				scrollH: "81%"
			};
		},

		components: {},
		props: {},
		onShow: function() {
			t.refreshUsedTimeAndDate();
		},
		onLoad: function() {
			this.initHideGuide();
			var that = this;
			uni.showLoading({
				title: "加载中..."
			});
			o = that.vuex_isShenHe ? "情侣壁纸" : "视频壁纸榜";
			e = 1;
			that.getSearchVideo();

		},
		async onReachBottom() {
			console.log('翻页', e)
			e += 1, this.getSearchVideo(), 3 == e && a && a.show().catch(function(e) {
				console.error(e);
			});
		},
		onShareAppMessage: function() {
			return {
				title: "海量高清手机壁纸，动态壁纸，情侣头像",
				path: "pages/find/dynamic/dynamic"
			};
		},
		methods: {
			getSearchVideo: function() {
				var i = this,
					a = this.videos;
				uni.showLoading({
					title: "加载中..."
				})
				t.getSearchVideo(o, e, function(t) {
					1 == e && (a = [], i.setData({
						scrollTop: 0
					}));
					for (var o = 0; o < t.length; o++) "1" != t[o].is_ads && a.push(t[o]);

					i.setData({
						videos: a,
						refreshStatus: !1
					}), uni.stopPullDownRefresh(), uni.hideLoading();
				}, function(e) {
					uni.stopPullDownRefresh(), uni.hideLoading();
				});
			},
			preview: function(e) {
				console.log('preview', e)
				var t = e.currentTarget.dataset.item.video_preview_url,
					i = e.currentTarget.dataset.item.thumb_img,
					title = e.currentTarget.dataset.item.title;
				uni.navigateTo({
					url: "/pages/dynamicdetail/dynamicdetail?url=" + encodeURIComponent(t) + "&imgSrc=" +
						encodeURIComponent(i) + "&title=" + title
				});
			},
			refresh: function(t) {
				console.log('刷新', e)
				e = 1, this.getSearchVideo(), this.setData({
					refreshStatus: !0
				});
			},
			onScrollToLower: function(t) {
				console.log('翻页', e)
				e += 1, this.getSearchVideo(), 3 == e && a && a.show().catch(function(e) {
					console.error(e);
				});
			},
			searchTap: function(e) {
				uni.navigateTo({
					url: "/pages/searchvideo/searchvideo"
				});
			},
			dayTap: function(t) {
				uni.showLoading({
					title: "加载中..."
				}), o = "精选", e = 1, this.getSearchVideo();
			},
			chaoQingTap: function(t) {
				uni.showLoading({
					title: "加载中..."
				}), o = "超清", e = 1, this.getSearchVideo();
			},
			QLTap: function(t) {
				uni.showLoading({
					title: "加载中..."
				}), o = "情侣壁纸", e = 1, this.getSearchVideo();
			},
			initHideGuide: function() {
				var e = this;
				uni.getStorage({
					key: "hideGuide",
					success: function(t) {
						e.setData({
							hideGuide: t.data
						}), e.hideGuide ? e.setData({
							scrollH: "88%"
						}) : e.setData({
							scrollH: "81%"
						});
					},
					fail: function(t) {
						e.setData({
							hideGuide: !1,
							scrollH: "81%"
						});
					}
				});
			},
			onShareTimeline: function() {
				return {
					path: '/pages/find/dynamic/dynamic',
					title: "海量高清手机壁纸，动态壁纸，情侣头像"
				};
			}
		}
	};
</script>
<style>
	.add_container {
		width: 100%;
		height: 6%;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #fffacd;
		margin-bottom: 10rpx;
		position: relative;
	}

	.add_container text {
		color: #333;
		font-size: 28rpx;
		margin-left: 10rpx;
	}

	.img_cancel {
		position: fixed;
		right: 30rpx;
		height: 45rpx;
		width: 45rpx;
	}

	.scroll-body {
		width: 100%;
	}

	.tab-container {
		height: 12%;
		width: 100%;
		flex-direction: row;
		box-sizing: border-box;
		padding-bottom: 10rpx;
		padding-top: 10rpx;
	}

	.tab-container,
	.tab-item {
		display: flex;
		align-items: center;
	}

	.tab-item {
		width: 25%;
		height: 100%;
		flex-direction: column;
		font-size: 25rpx;
		font-weight: 700;
		margin-top: 4rpx;
	}

	.img-container1 {
		background-color: #20b2aa;
	}

	.img-container1,
	.img-container2 {
		width: 80rpx;
		height: 80rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
	}

	.img-container2 {
		background-color: red;
	}

	.img-container3 {
		background-color: #87cefa;
	}

	.img-container3,
	.img-container4 {
		width: 80rpx;
		height: 80rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
	}

	.img-container4 {
		background-color: plum;
	}

	.img {
		width: 50rpx;
		height: 50rpx;
	}

	.search {
		width: 45rpx;
		height: 45rpx;
		margin-left: 30rpx;
	}

	.grid-item {
		margin: 10rpx 0 10rpx 20rpx;
		width: 46%;
		height: 617rpx;
		float: left;
	}

	.g {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.g,
	.photo {
		width: 100%;
		height: 100%;
	}

	.photo {
		border-radius: 8px;
	}

	.info,
	.photo {
		position: absolute;
	}

	.info {
		width: 100%;
		display: flex;
		flex-direction: column;
		bottom: 10rpx;
		padding-bottom: 10rpx;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.title {
		height: 40%;
		width: 100%;
		font-size: 26rpx;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		color: #fff;
		text-shadow: 0 0 2px #000;
		margin-bottom: 6rpx;
		margin-left: 2rpx;
	}

	.count-container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.count {
		font-size: 24rpx;
		color: #fff;
		text-shadow: 0 0 2px #000;
	}

	.iv {
		width: 36rpx;
		height: 36rpx;
		margin-right: 5rpx;
		box-shadow: 0 0 2px #fff;
		border-radius: 50px;
	}

	.adContainer {
		box-sizing: border-box;
		padding: 10rpx;
		width: 100%;
		float: left;
	}
</style>
