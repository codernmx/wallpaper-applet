<template>
	<view v-if="vuex_user.system == 1">
		<view class="u-p-40">
			<u-form ref="uForm" :model="cps">
				<view class="u-p-b-20 u-flex u-row-left u-col-top">
					<u-upload ref="uUpload"
					action="" max-count="1" 
					:file-list="cpsId!='-1'?iconList:''" 
					:auto-upload="false" 
					uploadText="上传图片"
					width="200" 
					height="200" 
					:max-count="1"
					:maxSize="1024 * 500" 
					:show-progress="false" 
					:size-type="['compressed']" 
					:source-type="['album']" 
					:multiple="false"
					del-icon="close" 
					del-bg-color="#ff7c7c" 
					del-color="#FFFFFF" 
					:limitType="['png', 'jpg', 'jpeg']" 
					></u-upload>
					<!-- <view class="" @click="chooseImage()">
						<view class="img-bg u-flex-col u-row-center u-col-center" v-if="!imgPath">
							<u-icon name="plus" size="36" color="#606266"></u-icon>
							<view class="u-p-t-20 u-font-12 u-content-color">上传封面图</view>
						</view>
						<view class="img" v-else>
							<image class="img-bg" :src="imgPath"></image>
							<view class="u-delete-icon" @click.stop="delImage">
								<u-icon class="u-icon" name="close" size="20" color="#FFFFFF"></u-icon>
							</view>
						</view>
					</view> -->
					<view class="u-p-l-20 u-p-t-20">
						<view class="u-font-12">注意事项：</view>
						<view class="u-font-12 u-tips-color u-p-t-15">比例：750 x 750</view>
						<view class="u-font-12 u-tips-color u-p-t-15">大小：500kb</view>
					</view>
				</view>
				<view class="" style="border-bottom: 1rpx solid #F4F4F4;border-top: 1rpx solid #F4F4F4;">
					<u-form-item label="标题" :border-bottom="false">
						<u-input v-model="cps.name" type="textarea" :height="60" :clearable="false" placeholder="CPS显示标题"/>
					</u-form-item>
				</view>
				<view class="" style="border-bottom: 1rpx solid #F4F4F4;border-top: 1rpx solid #F4F4F4;">
					<u-form-item label="描述" :border-bottom="false">
						<u-input v-model="cps.desc" type="textarea" :height="60" :clearable="false" placeholder="CPS描述"/>
					</u-form-item>
				</view>
				<view class="" style="border-bottom: 1rpx solid #F4F4F4;border-top: 1rpx solid #F4F4F4;">
					<u-form-item label="提示" :border-bottom="false">
						<u-input v-model="cps.tip" type="textarea" :height="60" :clearable="false" placeholder="CPS页面提示文字"/>
					</u-form-item>
				</view>
				<view class="" style="border-bottom: 1rpx solid #F4F4F4;border-top: 1rpx solid #F4F4F4;">
					
					<u-form-item label="角标" :border-bottom="false"><u-switch :height="40" slot="right" v-model="showbord"></u-switch></u-form-item>
				</view>
				<view class="" style="border-bottom: 1rpx solid #F4F4F4;border-top: 1rpx solid #F4F4F4;">
					<u-form-item label="appid" :border-bottom="false">
						<u-input v-model="minapp.appid" type="textarea" :height="60" :clearable="false" placeholder="小程序ID（不跳转填写/）"/>
					</u-form-item>
					<u-form-item label="路径" :border-bottom="false">
						<u-input v-model="minapp.path" type="textarea" :height="90" :clearable="false" placeholder="跳转路径（不跳转填写/）"/>
					</u-form-item>
				</view>
				<view class="" style="border-bottom: 1rpx solid #F4F4F4;border-top: 1rpx solid #F4F4F4;">
					<u-form-item label="类型" :border-bottom="false">
						<u-radio-group v-model="cpsType" @change="radioGroupChange">
							<u-radio active-color="#fdc621" size="50" name="ele">ele</u-radio>
							<u-radio active-color="#fdc621" size="50" name="meituan">meituan</u-radio>
							<u-radio active-color="#fdc621" size="50" name="jd">jd</u-radio>
							<u-radio active-color="#fdc621" size="50" name="qt">其他</u-radio>
						</u-radio-group>
					</u-form-item>
				</view>
				<view class="" style="border-bottom: 1rpx solid #F4F4F4;border-top: 1rpx solid #F4F4F4;" v-if="cpsType==='qt'">
					<u-form-item label="其他" :border-bottom="false">
						<u-input v-model="qtCpsType" type="textarea" :height="60" :clearable="false" placeholder="其他cps类型,如:sn,pdd,dd等"/>
					</u-form-item>
				</view>
				<view  style="border-bottom: 1rpx solid #F4F4F4;border-top: 1rpx solid #F4F4F4;">
					<u-form-item label="背景" :border-bottom="false">
						<u-input :height="60" :clearable="false"  placeholder="请输入RGB颜色" v-model="cpsStyle" type="text"></u-input>
						<button slot="right" :style="`background-color:` + cpsStyle" size="mini" @click="openPickerColor">选择</button>
					</u-form-item>
				</view>
				<view class="" style="border-bottom: 1rpx solid #F4F4F4;border-top: 1rpx solid #F4F4F4;">
					<u-form-item label="排序" :border-bottom="false">
						<u-input v-model="cps.sort" type="number" :height="60" :clearable="false" placeholder="排序，数字越大越靠前"/>
					</u-form-item>
				</view>
			</u-form>
			<view class="u-p-t-40">
				<view class="btn" hover-class="hover-class" hover-stay-time="50" @click="submit">发 布</view>
			</view>
		</view>
		<t-color-picker ref="colorPicker" :color="color" @confirm="confirm"></t-color-picker>
	</view>
</template>

<script>
	import tColorPicker from '@/components/t-color-picker/t-color-picker.vue'
	export default {
		components: {
		            tColorPicker
		        },
		data() {
			return {
				iconStyle: {
					fontSize: '12px',
					color: '#D8D8D8'
				},
				customStyle: {
					backgroundImage: 'linear-gradient(to right, #FCEF59 , #F8D246)',
					color: "#333333"
				},
				minapp: {},
				cpsId: '',
				cps: {},
				newCps: {},
				iconList: [],
				cpsType: '',
				qtCpsType: '',
				cpsStyle: '',
				color: {r: 255,g: 0,b: 0,a: 0.6},
				showbord: true
			}
		},
		async onLoad({id}) {
			var that = this;
			that.cpsId = id
			if(id!='-1') that.getBanner(id)
		},
		methods: {
			async getBanner(id){
				var that = this;
				let detail = await uniCloud.callFunction({
					name: 'query_map',
					data: {
						dbName: "wx_coupons",
						id: id
					}
				})
				delete detail.result._id
				
				that.iconList.push({url: detail.result.icon})
				console.log(detail.result)
				that.cpsType = detail.result.platform?detail.result.platform: ''
				console.log(that.cpsType)
				that.cps = detail.result
				that.cpsStyle = detail.result.style
				that.newCps = JSON.stringify(detail.result)
			},
			async submit() {
				var that = this
				var imgs = that.$refs.uUpload.lists;
				if(!that.cps.name){
					that.$u.toast("请填写标题");
					return;
				}
				if(!that.cps.desc){
					that.$u.toast("请填写描述");
					return;
				}
				if(!that.cps.tip){
					that.$u.toast("请填写提示");
					return;
				}
		
				
				if(!that.minapp.appid | !that.minapp.path){
					that.$u.toast("请填写完整小程序跳转路径");
					return;
				}else{
					that.cps.minapp = that.minapp
				}
				if(!that.cps.sort){
					that.$u.toast("请填写排序");
					return;
				}
				
				that.cps.sort = parseInt(that.cps.sort)
				if(that.qtCpsType){
					that.cps.platform = that.qtCpsType
				}else{
					that.cps.platform = that.cpsType
				}
				that.cps.style = that.cpsStyle
				if(that.showbord){
					that.cps.border = "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-3fghygksin4v59ee5a/616cd130-548f-11eb-8ff1-d5dcf8779628.png"
				}else{
					that.cps.border = ""
				}
				
				if(that.cpsId != '-1' && that.iconList[0] && imgs[0].url === that.iconList[0].url && JSON.stringify(that.cps)===that.newCps){
					that.$u.toast("请修改内容后再提交");
					return;
				}
				
				uni.showLoading({
					mask: true,
					title: '正在拼命加载中...'
				})
	
				if(that.cpsId == '-1' || (imgs.length > 0 && that.iconList[0] && imgs[0].url != that.iconList[0].url)){
					var path = imgs[0].url
					var extension = path.substring(path.lastIndexOf('.') + 1)
					var random = String(Math.random()*100000).split('.')[0]
					var now = new Date()
					var year = now.getFullYear()
					var month = (now.getMonth() + 1) < 10?'0'+(now.getMonth() + 1):(now.getMonth() + 1)
					var day = now.getDate() < 10?'0'+now.getDate():now.getDate()
					var hours = now.getHours() < 10?'0'+now.getHours():now.getHours()
					var minutes = now.getMinutes() < 10?'0'+now.getMinutes():now.getMinutes()
					var seconds = now.getSeconds() < 10?'0'+now.getSeconds():now.getSeconds()
					
					var cloudPath = 'banner_'+year+month+day+hours+minutes+seconds+'_'+random+'.'+extension
					await uniCloud.uploadFile({
					    filePath: path,
						cloudPath: cloudPath
					}).then(async res => {
						console.log(res)
						await uniCloud.getTempFileURL({
							fileList: [res.fileID]
						}).then(res => {
							console.log(res)
							if(res.fileList.length > 0){
								that.cps.icon = res.fileList[0].tempFileURL
							}else{
								that.$u.toast("图片上传失败");
								return;
							}
						});
					})
				}
				
				
				let query = await uniCloud.callFunction({
					name: 'query_edit',
					data: {
						dbName: "wx_coupons",
						filter: {
							'_id': that.cpsId
						},
						addData: that.cps,
						upData: that.cps
					},
				})
				if(query.result.success){
					setTimeout(function(){
						uni.navigateBack()
					},1000)
					uni.setStorageSync("update_cps_flag", 1)
				}
				uni.showToast({
					icon: 'none',
					title: query.result.msg,
					mask: true,
					duration: 1000
				})
			},
			chooseImage() {
				var rectWidth = 350, rectHeight = 146, destWidth = 700, destHeight = 294
				this.$u.route({
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					params: {
						rectWidth: rectWidth,
						rectHeight: rectHeight,
						destWidth: destWidth,
						destHeight: destHeight,
						fileType: 'jpg',
					}
				})
			},
			delImage(type){
				this.imgPath = ''
			},
			radioGroupChange(name) {
				console.log('name', name)
				if(name!="qt"){
					this.cpsType = name;
				}
			},
			openPickerColor(n){
				this.$refs.colorPicker.open();
			},
			confirm(e) {
				var that = this
				that.cpsStyle = e.hex
			}
		}
	}
</script>

<style lang="scss">
	.btn{
		font-size: 16px;
		background-image: linear-gradient(100deg, #FCEF59 , #f8d319);
		color: #333333;
		border-radius: 40rpx;
		line-height: 86rpx;
		text-align: center;
	}
	.hover-class{
		transform:scale(0.92);
		transition: all 0.2s;
	}
	
	
	.img{
		position: relative;
	}
	.img-bg{
		width: 400rpx;
		height: 167rpx;
		background: #f4f5f6;
		border-radius: 10rpx;
		margin: 10rpx;
	}
	.u-delete-icon{
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		z-index: 10;
		background-color: rgba(255,255,255,0.35);
		border-radius: 100rpx;
		width: 44rpx;
		height: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>