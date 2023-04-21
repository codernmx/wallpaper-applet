<template>
	<view v-if="vuex_user.system == 1">
		<view class="u-p-40">
			<view  class="upload u-text-center">
				<text class="upload-text">上传配置</text>
			</view>
			<u-form ref="uForm" :model="upload">
				<view class="" style="border-bottom: 1rpx solid #F4F4F4;border-top: 1rpx solid #F4F4F4;">
					<u-form-item label="类型" :border-bottom="false">
						<u-radio-group v-model="uploadType" @change="radioGroupChange">
							<u-radio active-color="#fdc621" size="50" name="uniCloud">uniCloud</u-radio>
							<u-radio active-color="#fdc621" size="50" name="aliyun">阿里云OSS</u-radio>
							<u-radio active-color="#fdc621" size="50" name="qiniuyun">七牛云</u-radio>
						</u-radio-group>
					</u-form-item>
				</view>
				<view class="" style="border-bottom: 1rpx solid #F4F4F4;border-top: 1rpx solid #F4F4F4;" v-if="uploadType==='uniCloud'">
					<u-form-item label="链接" :border-bottom="false">
						<u-input v-model="banner.url" type="textarea" :height="40" :clearable="false" placeholder="跳转链接（不跳转填写/）"/>
					</u-form-item>
				</view>
				<view class="" style="border-bottom: 1rpx solid #F4F4F4;border-top: 1rpx solid #F4F4F4;" v-if="uploadType==='aliyun'">
					<u-form-item label="appid" :border-bottom="false">
						<u-input v-model="banner.appid" type="textarea" :height="40" :clearable="false" placeholder="小程序ID（不跳转填写/）"/>
					</u-form-item>
					<u-form-item label="路径" :border-bottom="false">
						<u-input v-model="banner.path" type="textarea" :height="40" :clearable="false" placeholder="跳转路径（不跳转填写/）"/>
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
				uploadId: '',
				upload: {},
				newUpload: {},
				iconList: [],
				uploadType: ''			}
		},
		async onLoad({id}) {
			var that = this;
			that.uploadId = id
			if(id!='-1') that.getConfig(id)
		},
		methods: {
			async getConfig(id){
				var that = this;
				let detail = await uniCloud.callFunction({
					name: 'query_map',
					data: {
						dbName: "wx_upload_config",
						id: id
					}
				})
				delete detail.result._id
				that.uploadType = detail.result.uploadType?detail.result.uploadType: ''
				console.log(that.uploadType)
				that.upload = detail.result
				that.newUpload = JSON.stringify(detail.result)
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
				if(!that.cps.minapp.appid){
					that.$u.toast("请填写标题");
					return;
				}
				
				if(!that.cps.minapp.appid | !that.cps.minapp.path){
					that.$u.toast("请填写完整小程序跳转路径");
					return;
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
						dbName: "wx_upload_config",
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
				this.uploadType = name;
		
			}
		}
	}
</script>

<style lang="scss">
	.upload {
		text-align: center;
	}
	.upload-text {
		font-size: 40rpx;
		font-weight: 800;
	}
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