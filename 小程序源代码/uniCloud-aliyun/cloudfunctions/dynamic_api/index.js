'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	// 创建回滚
	const transaction = await db.startTransaction()
	let searchType = event.searchType
	let params = {}
	let url = ''
	let updateTable = ''
	console.log(event)
	switch(searchType)
	{
	    case "getSearchVideo":
			updateTable = "dynamic_search_video"
			url = "https://search.hyhuo.com/so/tag"
			params = {
				
				method: "POST",
				dataType: 'json',
				data: {
					keyword: event.keyword,
					search_type: 3,
					sort: "hot",
					page: event.page
				},
				header: {
					"content-type": "application/x-www-form-urlencoded"
				}
			}
	       
	        break;
	    case "getSearchImg":
			updateTable = "dynamic_search_img"
			url = "https://search.hyhuo.com/search/image_tag"
	        params = {
				method: "POST",
				dataType: 'json',
				data: {
				    keyword: event.keyword,
				    sort: "hot",
				    page: event.page
				},
				header: {
				    "content-type": "application/x-www-form-urlencoded"
				}
			}
	        break;
	    case "getHeadCategory":
			updateTable = "dynamic_search_category"
			url = "https://spare.maibaapp.com/bbs/newUgc/category/list/0"
	        params = {
	    		method: "GET",
				dataType: 'json',
	    		header: {
	    		    "content-type": "application/x-www-form-urlencoded"
	    		}
	    	}
	        break;
		
	}
	if(url){
		const response = await uniCloud.httpclient.request(url, params);
		if(response.data && response.data.data){
			return response
		}
		
	}
	return {}
};
