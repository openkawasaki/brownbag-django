/**
 * 空文字チェック
 **/
function isEmpty(val) {
	return !val ?
		!(val===0 || val===false)? true : false
		:false;
}

