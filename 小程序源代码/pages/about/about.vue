<template>
	<view>
		<u-navbar
		:is-back="true" 
		title="关于我们" 
		title-width="325" 
		title-color="#333333" 
		title-size="28" 
		:border-bottom="false"
		></u-navbar>
		<view class="top u-flex-col u-col-center u-p-t-80">
			<image src="../../static/logo.png"></image>
			<view class="name u-p-t-30 u-font-18">星潮图馆</view>
			<view class="u-tips-color u-font-14 u-p-t-15">-星芒网络科技-</view>
			<view class="u-tips-color u-font-14 u-p-t-15">V2.5.0</view>
		</view>
		<view class="menu u-m-l-40 u-m-r-40 u-m-t-40 border-box">
			<view class="u-flex u-row-between u-p-30 border-bottom" hover-class="hover-class1" hover-stay-time="50" @click="agreementClick">
				<view class="u-p-l-20">用户协议</view>
				<view class="arror-right"></view>
			</view>
			<view class="u-flex u-row-between u-p-30 border-bottom" hover-class="hover-class1" hover-stay-time="50" @click="policyClick">
				<view class="u-p-l-20">隐私政策</view>
				<view class="arror-right"></view>
			</view>
			<view class="u-flex u-row-between u-p-30 border-bottom" hover-class="hover-class1" hover-stay-time="50" @click="gengxinClick">
				<view class="u-p-l-20">更新日志</view>
				<view class="arror-right"></view>
			</view>
		</view>
		<view class="bottom u-p-40 u-text-center u-font-12 u-tips-color">
			免责声明：内容来源于网络，如涉及版权问题，请随时联系告知！
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			agreementClick(){
				uni.navigateTo({
					url: '/pages/about/agreement'
				})
			},
			gengxinClick(){
				uni.navigateTo({
					url: '/pages/about/gengxin'
				})
			},
			policyClick(){
				uni.navigateTo({
					url: '/pages/about/policy'
				})
			}
		},
		
	}
</script>

<style lang="scss">
	.bottom{
		position: fixed;
		bottom: 40rpx;
	}
	.name{
		font-weight: 550;
	}
	image{
		width: 180rpx;
		height: 180rpx;
		border-radius: 180rpx;
	}
	.border-box{
		box-shadow: 0 0px 24px rgba(231, 231, 231, 0.6);
		border-radius: 16rpx;
	}
	.menu{
		image{
			width: 38rpx;
			height: 38rpx;
		}
	}
	.border-bottom{
		border-bottom: 1rpx solid #F6F6F6;
		position: relative;
	}
	.hover-class1{
		background-color: #F8F8F8;
	}
	.arror-right{
		width: 15rpx;
		height: 15rpx;
		border-top: 3rpx solid #a9acb3;
		border-right: 3rpx solid #a9acb3;
		transform: rotate(45deg);
	}
</style>
