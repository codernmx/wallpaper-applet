import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let lifeData = {};

try {
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = uni.getStorageSync('lifeData');
} catch (e) {

}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = [
	'vuex_user', 
	'vuex_systemShow', 
	'vuex_writeShow', 
	'vuex_videoUnitId', 
	'vuex_customUnitId', 
	'vuex_qqRewardedVideoUnitId',
	'vuex_qqUnitId',
	'vuex_qqBannerUnitId',
	'vuex_indexColumn',
	'vuex_compressPicture',
	'vuex_isShenHe',
	'vuex_uiType',
	'vuex_load_image',
	'vuex_writeExam',
	'vuex_wxRewardedVideoUnitId',
	'vuex_isSign',
	 'vuex_templateId'
		];

// 保存变量到本地存储中
const saveLifeData = function(key, value){
	// 判断变量名是否在需要存储的数组中
	if(saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}
const store = new Vuex.Store({
	state: {
		// 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		// 加上vuex_前缀，是防止变量名冲突，也让人一目了然
		vuex_user: lifeData.vuex_user ? lifeData.vuex_user : '',
		vuex_writeExam: lifeData.vuex_writeExam ? lifeData.vuex_writeExam : '',
		vuex_qqRewardedVideoUnitId: lifeData.vuex_qqRewardedVideoUnitId ? lifeData.vuex_qqRewardedVideoUnitId : '',
		vuex_wxRewardedVideoUnitId: lifeData.vuex_wxRewardedVideoUnitId ? lifeData.vuex_wxRewardedVideoUnitId : '',
		vuex_templateId: lifeData.vuex_templateId ? lifeData.vuex_templateId : '',
		vuex_systemShow: lifeData.vuex_systemShow ? lifeData.vuex_systemShow : '',
		vuex_writeShow: lifeData.vuex_writeShow ? lifeData.vuex_writeShow : '',
		vuex_videoUnitId: lifeData.vuex_videoUnitId ? lifeData.vuex_videoUnitId : '',
		vuex_customUnitId: lifeData.vuex_customUnitId ? lifeData.vuex_customUnitId : '',
		vuex_bannerUnitId: lifeData.vuex_bannerUnitId ? lifeData.vuex_bannerUnitId : '',
		vuex_qqUnitId: lifeData.vuex_qqUnitId ? lifeData.vuex_qqUnitId : '',
		vuex_qqBannerUnitId: lifeData.vuex_qqBannerUnitId ? lifeData.vuex_qqBannerUnitId : '',
		vuex_indexColumn: lifeData.vuex_indexColumn ? lifeData.vuex_indexColumn : 4,
		vuex_compressPicture: lifeData.vuex_compressPicture==null? true: lifeData.vuex_compressPicture ,
		vuex_isShenHe: lifeData.vuex_isShenHe==null? true: lifeData.vuex_isShenHe,
		vuex_uiType: lifeData.vuex_uiType ? lifeData.vuex_uiType : 0,
		vuex_isSign: lifeData.vuex_isSign ? lifeData.vuex_isSign : false,
		vuex_load_image: lifeData.vuex_load_image ? lifeData.vuex_load_image : '/static/loading/loading.gif',
	},
	mutations: {
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if (len >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		}
	}
})

export default store
