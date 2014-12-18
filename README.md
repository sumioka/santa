santa
=====

サンタが壁を登ります！

サーバを起動
node app.js

以下をchromeで見る
http://localhost:3000/index.html
http://localhost:3000/unnei.html


shakeブランチをcloneした場合には、  
プロジェクタ画面で  
http://santajection.herokuapp.com/  
運営画面で  
http://santajection.herokuapp.com/unnei.html  
携帯ブラウザで  
http://santajection.herokuapp.com/shake.html

を起動すると、スマホを振ってサンタが登る




◆　端末へのインストール

fjcomponentManager
fjWristDeviceComponent
fjWristDeviceComponentApp
wearableフォルダのコピー


◆　実行手順

①ホームボタン長押し　　リストデバイス部品を選択
　（無かったら、アプリケーションから選んで選択）

②PCでunnei.htmlを確認し、initおよびconnectの表示がない
　場合は、端末のconnectボタンを押す

③端末で上からシャッターを下ろして、
　bluetoothが有効であることを確認する

④unnei.htmlがinitを表示していた場合、ガジェットの
　２ケタの数字を入れて、サブスクライブボタンを押して
　しばし待つ。　ポップアップメッセージを見て、
　接続されるまで１０秒ずつくらい待ちながらボタンを押す。
　（接続に成功した旨のメッセージが出る）
　
　
◆　注意事項
　暗転したら、ホームボタン長押し　⇒　リストデバイス部品を選択


