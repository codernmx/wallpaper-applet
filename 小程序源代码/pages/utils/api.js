function t(t) {
    return [ t.getFullYear(), t.getMonth() + 1, t.getDate() ].map(e).join("");
}

function e(t) {
    return (t = t.toString())[1] ? t : "0" + t;
}

function a() {
    var t = wx.getStorageSync(l);
    return console.log("已用" + t), t;
}

function o() {
    wx.setStorage({
        key: l,
        data: 0
    });
}

function n() {
    return wx.getStorageSync("VIP");
}

function i(t) {
    wx.setStorage({
        key: "VIP",
        data: t
    });
}

var r = "Config",g = getApp(), l = "usedTime";

module.exports = {
    getSearchVideo: async function(t, e, a, o) {
		await uniCloud.callFunction({
			name: 'dynamic_api',
			data: {
				searchType: "getSearchVideo",
				keyword: t,
				search_type: 3,
				sort: "hot",
				page: e
			},
			success(t){
				wx.hideLoading(), t.result.data && t.result.data.data ? a(t.result.data.data.data_list) : o(t.result.data.errMsg);
			},
			fail(t){
				 wx.hideLoading(), o(0);
			}
		})
    },
    getSearchImg: async function(t, e, a, o) {
		await uniCloud.callFunction({
			name: 'dynamic_api',
			data: {
				searchType: "getSearchImg",
				keyword: t,
				sort: "hot",
				page: e
			},
			success(t){
				wx.hideLoading(), t.result.data && t.result.data.data ? a(t.result.data.data.data_list) : o(t.result.data.errMsg);
			},
			fail(t){
				 wx.hideLoading(), o(0);
			}})
        
    },
    getHeadCategory: async function(t, e) {
		await uniCloud.callFunction({
			name: 'dynamic_api',
			data: {
				searchType: "getHeadCategory"
			},
			success(a){
				wx.hideLoading(), a.result.data && a.result.data.data ? t(a.result.data.data.categoryList) : e("");
			},
			fail(t){
				 wx.hideLoading(), e(0);
			}})
    },
    getHead: function(t, e, a, o, n) {
        wx.request({
            url: "https://spare.maibaapp.com/bbs/newUgc/category/info/0/" + t + "/" + e + "/" + a,
            method: "GET",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(t) {
                wx.hideLoading(), t.data && t.data.data ? o(t.data.data.list) : n("");
            },
            fail: function(t) {
                wx.hideLoading(), n(0);
            }
        });
    },
    refreshUsedTimeAndDate: function() {
        wx.getStorage({
            key: "date",
            success: function(e) {
                e.data != t(new Date()) && (wx.setStorage({
                    key: "date",
                    data: t(new Date())
                }), o(), i(!1));
            },
            fail: function(e) {
                wx.setStorage({
                    key: "date",
                    data: t(new Date())
                }), o(), i(!1);
            }
        });
    },
    addUsedTime: function() {
        var t = a();
        t += 1, wx.setStorage({
            key: l,
            data: t
        });
    },
    canUse: function(t) {
        return !(!n() && a() >= g.globalData.COUNT && (wx.showModal({
            title: "",
            content: "今日赠送下载次数已用完，观看一小段广告解锁今日无限次下载",
            confirmText: "观看",
            confirmColor: "red",
            success: function(e) {
                e.confirm && t();
            }
        }), 1));
    },
    setVIP: i,
    getIsVIP: n
};