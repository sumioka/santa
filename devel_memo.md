# config.js
デバッグレベルやサーバーアドレスなどの設定を行う

# サンタの移動通信
移動するcolorをtrueとしたsanta_keysをoptionsとして設定し送信．

```js
    var santa_keys = {};
    santa_keys[color] = true;
    SendMsg("santa", {method:"santa_move", options:{santa_keys:santa_keys}});
```

