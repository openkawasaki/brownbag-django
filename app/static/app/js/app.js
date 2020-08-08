'use strict';

const app = new Vue({
    el: '#app',
    data: {
        displayName: '',
        userId: '',
        statusMessage: '',
        pictureUrl: '',
    },
    methods: {
        //プロフィール取得関数
        getProfile: async function(){
            const accessToken = liff.getAccessToken();
            const profile = await liff.getProfile();
            this.displayName = profile.displayName; //LINEの名前
            this.userId = profile.userId; //LINEのID
            this.pictureUrl = profile.pictureUrl; //LINEのアイコン画像
            this.statusMessage = profile.statusMessage; //LINEのステータスメッセージ
        },

        //ログアウト処理の関数
        logout: async function(){
            if (liff.isLoggedIn()){
                alert('ログアウトします。');
                liff.logout();
                window.location.reload();
            }
        },

        //QRコードの利用の関数
        QR: async function(){
            if(!liff.isInClient()) {
                alert('LINEから開いて下さい');
                return;
            }
            //QR読み込み
            const res = await liff.scanCode();
            //const msg = `読み取ったコードの中身は「${res.value}」です`;
            //alert(msg);

            //LINEにメッセージ送信の関数
            liff.sendMessages([{
                type: 'text',
                text: `QRコード=${res.value}: displayName=${this.displayName}: userID=${this.userId}`
            /*
            }, {
                type: 'sticker',
                packageId: '11537',
                stickerId: '52002735'
            */
            }]).then(function () {
                //window.alert("メッセージを送信しました。");
                liff.closeWindow();
            }).catch(function (error) {
                window.alert("Error sending message: " + error);
                liff.closeWindow();
            });
        }
    },

    //ページを開いた時に実行される
    mounted: async function() {
        const line_app_liffId = this.$el.getAttribute('line_app_liffId')
        // alert(liff.getOS());
        await liff.init({
            liffId: line_app_liffId
        });

        //LINE内のブラウザかどうか
        if(liff.isInClient()){
            console.log('LINE内のブラウザ');
            this.getProfile(); //LINE内で開いた場合は特にログイン処理なしで大丈夫
        }else{
        //外部ブラウザかどうか
            if(liff.isLoggedIn()){
                console.log('外部ブラウザ');
                this.getProfile();
            }else{
                liff.login();
            }
        }
    }
});