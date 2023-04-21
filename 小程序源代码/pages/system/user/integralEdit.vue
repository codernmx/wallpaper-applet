<template>
	<view v-if="vuex_user.system == 1">
		<u-navbar
		:is-back="true" 
		title="充值积分" 
		title-width="325" 
		title-color="#333333" 
		title-size="28" 
		:border-bottom="false"
		></u-navbar>
		<view class="top">
			<view class="icon u-flex u-row-center u-col-center u-p-t-20">
				<image src="../../../static/icon/jinbi.png"></image>
			</view>
			<view class="kapian u-flex-col u-row-center u-col-center u-p-t-30">
				<view class="name">{{name}}</view>
				<view class="price">{{userIntegral}}</view>
				<view class="shuom u-font-12 u-tips-color u-p-t-10">当前可用积分</view>
			</view>
		</view>
		<view class="u-p-l-40">
			<view class="u-font-18 u-m-t-80 u-m-b-50 title">后台充值积分</view>
			<view class="charge u-flex u-row-left u-flex-wrap">
				<view class="tab u-p-t-20 u-p-b-20 u-m-r-20" :class="payIntegral==item.integral?'pay_active':''" 
				v-for="(item,index) in chargeList" :key="index" 
				@click="payClick(item.integral)">
					<view class="price" v-if="item.integral!=0">{{item.integral}}<text class="u-font-14">分</text></view>
					<view class="price" v-if="item.integral==0">
						<text class="u-font-14">自定义</text>
					</view>
				</view>
			</view>
		</view>
		<view class="u-p-40 u-p-t-60">
			<view class="btn" hover-class="hover-class" hover-stay-time="50" @click="payit">充 值</view>
		</view>
		<u-modal v-model="editShow" title="自定义充值" :show-cancel-button="true" confirm-text="充值" confirm-color="#fcc600" content="content" :async-close="true"  @confirm="payit" negative-top="280">
			<view class="u-p-40">
	
				<view class="u-p-t-15">
					<u-input v-model="payIntegral" :border="true" border-color="#F7F7F7" :clearable="false" :height="80" placeholder="填写积分" type="number" />
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				editShow: false,
				name: '',
				userIntegral: 0,
				payPrice: 0,
				payIntegral: 0,
				chargeList: [{
					integral: 2,
				},{
					integral: 300,
				},{
					integral: 500,
				},{
					integral: 1000,
				},{
					integral: 3000,
				},{
					integral: 0,
				}],
				userId: ''
			}
		},
		async onLoad({userId}) {
			if(userId) this.userId = userId
			else this.userId = this.vuex_user._id
			this.getUser()
			this.payIntegral = this.chargeList[0].integral
		},
		methods: {
			async getUser(){
				let that = this
				let detail = await uniCloud.callFunction({
					name: 'query_map',
					data: {
						dbName: "wx_user",
						id: that.userId
					},
				})
				that.userIntegral = detail.result.integral
				that.name = detail.result.name
			},
			payClick(integral){
				let that = this
				console.log(integral)
				if(integral){
					that.payIntegral = parseInt(integral)
					that.editShow = false
				}else{
					that.editShow = true
				}
				
			},
			async payit(){
				let that = this
				that.payIntegral = parseInt(that.payIntegral)
				that.editShow = false
				if(!that.payIntegral){
					uni.showToast({
						icon: 'none',
						mask: true,
						title: '充值信息不完整',
						duration: 1000
					})
					return
				}
				uni.showLoading({
					mask: true,
					title: '正在充值...'
				})
		
				//支付成功
				let query = await uniCloud.callFunction({
					name: 'charge_add',
					data: {
						integral: that.payIntegral,
						userId: that.userId
					},
				})
				if(query.result.success){
					console.log(query.result)
					that.getUser()
				}
				uni.showToast({ 
					icon: 'none',
					mask: true, 
					title: query.result.msg,
					duration: 1000
				})
				that.payIntegral = 0
				
			}
		}
	}
</script>

<style lang="scss">
	.top{
		image{
			width: 120rpx;
			height: 120rpx;
		}
		.kapian{
			height: 240rpx;
			margin: -60rpx 40rpx 0 40rpx;
			background: linear-gradient(to bottom right, #6cb3ff, #866BF1);
			color: #FFFFFF;
			border-radius: 36rpx;
			box-shadow: 0px 10px 20px #a2beff;
			.price{
				font-size: 32px;
				font-weight: 700;
			}
			.shuom{
				color: #E5E5E5;
			}
		}
	}
	.title{
		border-left: 6rpx solid #648af1;
		padding-left: 15rpx;
		line-height: 34rpx;
		color: #808080;
	}
	.charge{
		.tab{
			text-align: center;
			box-shadow: 0px 4px 12px #e4edff;
			border-radius: 12rpx;
			width: 210rpx;
			margin-bottom: 20rpx;
			.price{
				font-size: 20px;
				color: #866BF1;
				font-weight: bold;
			}
			.num{
				// color: #866BF1;
				padding: 0 3rpx;
			}
			.shuom{
				color: #A8A8A8;
			}
		}
	}
	.pay{
		image{
			width: 60rpx;
			height: 60rpx;
		}
	}
	.pay_active{
		background: linear-gradient(to bottom right, #6cb3ff, #866BF1);
		.price{
			color: #FFFFFF!important;
		}
		.num{
			color: #FFFFFF!important;;
		}
		.shuom{
			color: #e8e8e8!important;
		}
	}
	
	.btn{
		font-size: 16px;
		background: linear-gradient(to bottom right, #6cb3ff, #866BF1);
		box-shadow: 0px 6px 12px #cadbff;
		color: #FFFFFF;
		border-radius: 40rpx;
		line-height: 86rpx;
		text-align: center;
	}
	.hover-class{
		transform:scale(0.92);
		transition: all 0.2s;
	}
</style>