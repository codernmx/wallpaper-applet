<template>
	<view>
		<view class="u-p-40 u-m-40" style="box-shadow: 0px 0px 20px #EFEFEF;border-radius: 16rpx;">
			<u-form ref="uForm" label-width="150">
				<view class="" style="border-bottom: 1rpx solid #F4F4F4">
					<u-input v-model="feed.opinion" type="textarea" :height="280" :auto-height="true" :maxlength="999" :clearable="false" placeholder="填写你的问题或意见建议（必填）" />
				</view>
				<view class="" style="border-bottom: 1rpx solid #F4F4F4">
					<u-form-item label="反馈用户" :border-bottom="false"><u-input v-model="vuex_user.name" disabled/></u-form-item>
				</view>
				<view class="" style="border-bottom: 1rpx solid #F4F4F4">
					<u-form-item label="您的姓名" :border-bottom="false"><u-input v-model="feed.name" :clearable="false" placeholder="填写您的姓名（必填）" /></u-form-item>
				</view>
				<view class="" style="border-bottom: 1rpx solid #F4F4F4;">
					<u-form-item label="手机号码" :border-bottom="false"><u-input v-model="feed.phone" :clearable="false" placeholder="填写您的手机号" /></u-form-item>
				</view>
				<view class="" style="border-bottom: 1rpx solid #F4F4F4;">
					<u-form-item label="微信/QQ" :border-bottom="false"><u-input v-model="feed.code" :clearable="false" placeholder="填写您的微信号/QQ号" /></u-form-item>
				</view>
			</u-form>
			<view class="u-light-color u-p-t-20 u-p-b-20 u-font-13">请留下你的联系方式，方便我们更快的联系到你并解决你的问题，感谢你的反馈！</view>
			<view class="u-p-t-40 u-p-b-40"><view class="btn" hover-class="hover-class" hover-stay-time="50" @click="submit">提 交</view></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				feed: {
					opinion: '',
					name: '',
					phone: '',
					code: '',
					user_id: ''
				},
			}
		},
		methods: {
			
			async submit() {
				var that = this;
				if (!that.feed.opinion) {
					that.$u.toast('请填写意见或者建议');
					return;
				}
				if (!that.feed.name) {
					that.$u.toast('请填写您的姓名');
					return;
				}
			
				uni.showLoading({
					mask: true,
					title: '正在拼命加载中...'
				});
				
				that.feed.user_id = that.vuex_user._id
				that.feed.user_name = that.vuex_user.name
			
				let query = await uniCloud.callFunction({
					name: 'query_edit',
					data: {
						dbName: 'wx_feed',
						filter: {
							_id: '-1'
						},
						addData: that.feed
					}
				});
				uni.hideLoading();
				if (query.result.success) {
					uni.showToast({
						icon: 'none',
						title: '反馈成功！',
						mask: true,
						duration: 2000
					});
					setTimeout(function() {
						uni.navigateBack();
					}, 2000);
				}else{
					uni.showToast({
						icon: 'none',
						title: query.result.msg,
						mask: true,
						duration: 1000
					});
				}
			},
		}
	}
</script>

<style lang="scss">
	.btn {
		font-size: 16px;
		background-image: linear-gradient(100deg, #fcfc44, #f8c93c);
		color: #333333;
		border-radius: 40rpx;
		line-height: 86rpx;
		text-align: center;
	}
	.hover-class {
		transform: scale(0.92);
		transition: all 0.2s;
	}
</style>