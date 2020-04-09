/*
$(function(){
	$('a.disable').click(function(){
		return false;
	})
});
*/

/**
 * get_d()
 * @param api
 * @param param
 * @param done
 * @returns {*|jQuery}
 *
 * XMLHttpRequest.status は、HTTPステータス
 * textStatusは、エラー情報（timeout、error、parsererror等の文字列）
 * errorThrownは、例外情報
 */
function get_d(api, param, done) {

    var defer = $.Deferred();

    $.get(api,param)
        .done(function (data) {
            if (done) {
                done(data);
            }
            defer.resolve(); // 解決

        }).fail(function(jqXHR, textStatus, errorThrown){
            console.log("fail: get_d() = " + url);
            console.log("XMLHttpRequest : " + jqXHR.status);
            console.log("textStatus : " + textStatus);
            console.log("errorThrown : " + errorThrown);
            defer.reject(); // 却下
        });

    return defer.promise();
}

/**
 * post_d()
 * @param url
 * @param data
 * @param done
 * @returns {*|jQuery}
 *
 * XMLHttpRequest.status は、HTTPステータス
 * textStatusは、エラー情報（timeout、error、parsererror等の文字列）
 * errorThrownは、例外情報
*/
function post_d(url, data, done) {

    var defer = $.Deferred();

    var post_data = JSON.stringify(data);

    // POST通信実行
    $.ajax({
        type:"post",     // method = "POST"
        url: url,        // POST送信先のURL
        data: post_data, // JSONデータ本体
        contentType: 'application/json',    // リクエストの Content-Type
        dataType: "json",                   // レスポンスをJSONとしてパースする
        }).done(function(data) {
            if (done) {
                done(data);
            }
            defer.resolve(); // 解決

        }).fail(function(jqXHR, textStatus, errorThrown){
            console.log("fail: post_d() = " + url);
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            defer.reject(); // 却下
            alert("server error: pleasy try again later.");
        });

    return defer.promise();
}

/**
 * get()
 * @param url
 * @param param
 * @param done
 *
 * XMLHttpRequest.status は、HTTPステータス
 * textStatusは、エラー情報（timeout、error、parsererror等の文字列）
 * errorThrownは、例外情報
 */
function get(url, param, done) {

    /* GET通信実行 */
    $.get(url,param)
        .done(function (data) {
            if (done) {
                done(data);
            }
        }).fail(function(jqXHR, textStatus, errorThrown){
            console.log("fail: get(): url=" + url + ": params=" + JSON.stringify(param));
            console.log("XMLHttpRequest : " + jqXHR.status);
            console.log("textStatus : " + textStatus);
            console.log("errorThrown : " + errorThrown);
        });
}

/**
 * post
 * @param url
 * @param data
 * @param done
 *
 * XMLHttpRequest.status は、HTTPステータス
 * textStatusは、エラー情報（timeout、error、parsererror等の文字列）
 * errorThrownは、例外情報
 */
function post(url, data, done) {

    var post_data = JSON.stringify(data);

    /* POST通信実行 */
    $.ajax({
        type:"post",     // method = "POST"
        url: url,        // POST送信先のURL
        data: post_data, // JSONデータ本体
        contentType: 'application/json',    // リクエストの Content-Type
        dataType: "json",                   // レスポンスをJSONとしてパースする
        }).done(function(data) {
            if (done) {
                done(data);
            }
        }).fail(function(jqXHR, textStatus, errorThrown){
            console.log("fail: post() = " + url);
            console.log("XMLHttpRequest : " + jqXHR.status);
            console.log("textStatus : " + textStatus);
            console.log("errorThrown : " + errorThrown);
            alert("server error: pleasy try again later.");
        });
}
