$(function() {



  // 診断テストページで、部品を色々追加
  let num_bar;
  let num_barNum = ["0%"];
  let q_list = $(".questions li");
  load();
  $(window).on("load resize", function() {load();});
  $(".questions li:not(:first-child)").css({display: "none"});
  $(".questions li").addClass("opas");

  // プログレスバーを追加
  if($(".questions").length){
    $('body').prepend('<div class="progress-bar"><span></span></div>');
  }
  q_list.each(function(i) {
    q_list.eq(i).find(".select").addClass("s-" + i);

    // 型を変更する「String()」について https://hajimete.org/jquery-string-from-number
    num_barNum.push(100 / (q_list.length-1) * (String(i+1)) + "%");
    if(i != q_list.length-1) {
      // 問題の数「Q,1、Q,2、Q,3、Q,4、Q,5....」を追加
      q_list.eq(i).prepend('<p>Q,' + String(i+1) + '</p>');

      // 各問題に[Yes]、[No]ボタンを追加ボタンのテキストを変更する場合はコチラを修正してください
      // 各問題のボタンのテキストを変更
      if(i == 0) {
         q_list.eq(0).append('<div class="select"><p>子連れファミリー</p><p>大人</p></div>');
       } else if(i == 1) {
         q_list.eq(1).append('<div class="select"><p>室内</p><p>屋外</p></div>');
       } else if(i == 2) {
         q_list.eq(2).append('<div class="select"><p>アクティブ</p><p>ゆったり</p></div>');
       } else {
         q_list.eq(i).append('<div class="select"><p>電車・バス</p><p>車</p></div>');
       }
    }
    if(i != 0) {
      q_list.eq(i).addClass("right");

      // 2問目以降の「←戻る」ボタンを追加
      q_list.eq(i).append('<div class="back-list">&#x2B05; 戻る</div>');
    }
  });






  // 診断テストページで、「Yes」または「No」を押した時
  // 回答ボタンを３つ以上設置する場合は、CSSとココの処理を変更します
  let num = 0;
  // 回答を入れる配列を初期化
  let result = [];
  $(".select p").on("click", function() {
    let btn = $(this);
    // Yesなら"1"、Noなら"2"を格納
    // 回答ボタンを３つ以上設置する場合は３つ目が"3"、４つ目が"4"、５つ目が"5"...と入ります
    let selectNum = $(".questions li:eq("+num+") .select p").index(this) + 1;
    // 押された値を配列に格納
    // 回答ボタンを３つ以上設置する場合は「else if(selectNum ==...」に適切な値を追加してください
    if(selectNum == 1) { result.push("Y"); }
    else if(selectNum == 2) { result.push("N"); }
    // else if(selectNum == 3) { result.push("Other3"); }
    // else if(selectNum == 4) { result.push("Other4"); }
    // else if(selectNum == 5) { result.push("Other5"); }
    // 次の質問へ進むアニメーション
    $(".progress-bar > span").css({width: num_barNum[num+1]});
    btn.addClass("click");
    setTimeout(function() {
      q_list.eq(num).addClass("left");
      setTimeout(function() {
        q_list.eq(num).hide();
        q_list.eq(num + 1).show();
        btn.removeClass("click");
        setTimeout(function() {
          q_list.eq(num + 1).removeClass("right");
          num++
        },40);
      },360);
    },260);
  });




  // 診断テストページで、「←戻る」を押した時
  $(".back-list").on("click", function() {
    // 配列から最後の値を削除
    result.pop();
    // 前の質問へ戻るアニメーション
    $(".progress-bar > span").css({width: num_barNum[num-1]});
    q_list.eq(num).addClass("right");
    setTimeout(function() {
      q_list.eq(num).hide();
      num = num-1;
      q_list.eq(num).show();
      setTimeout(function() {
        q_list.eq(num).removeClass("left");
      },40);
    },360);
  });




  // 「結果を表示する」ボタンを押した時
  $(".questions .send a").on("click", function() {
    // jsonを利用して回答の配列をローカルストレージに格納
    let json = JSON.stringify(result, undefined, 1);
    localStorage.setItem('ansewer', json);
  });




  // 診断テスト結果
  if($(".ansewer").length) {
    let json = localStorage.getItem('ansewer');
    let ansewer = JSON.parse(json);


      // No.1
    if(ansewer[0] == ['Y'] && ansewer[1] == ['Y'] && ansewer[2] == ['Y'] && ansewer[3] == ['Y']) {
      // １と２と３と４の質問がYes
      $(".ansewer__title").text(" “子連れファミリー・室内・アクティブ・電車バス”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html(" VS PARK（越谷レイクタウン）<br> 狭山スキー場（西武園ゆうえんち）<br> ボーネルランド(さいたま新都心) ");

      // No.2
    } else if(ansewer[0] == ['Y'] && ansewer[1] == ['Y'] && ansewer[2] == ['Y'] && ansewer[3] == ['N']) {
      // １と２と３の質問がYes
      // ４の質問がNo
      $(".ansewer__title").text(" “子連れファミリー・室内・アクティブ・車”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html("ASOBooN（川口）<br> パティオ（深谷）");

      // No.3
    } else if(ansewer[0] == ['Y'] && ansewer[1] == ['Y'] && ansewer[2] == ['N'] && ansewer[3] == ['Y']) {
      // １と２と４の質問がYes
      // ３の質問がNo
      $(".ansewer__title").text(" “子連れファミリー・室内・ゆったり・電車バス”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html(" 鉄道博物館(大宮) <br> ロッテ工場（武蔵浦和） ");

      // No.4
    } else if(ansewer[0] == ['Y'] && ansewer[1] == ['Y'] && ansewer[2] == ['N'] && ansewer[3] == ['N']) {
      // １と２の質問がYes
      // ３と４の質問がNo
      $(".ansewer__title").text(" “子連れファミリー・室内・ゆったり・車”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html(" 角川ミュージアム（所沢） <br> お風呂cafe（大宮） ");

      // No.5
    } else if(ansewer[0] == ['Y'] && ansewer[1] == ['N'] && ansewer[2] == ['Y'] && ansewer[3] == ['Y']) {
      // １と３と４の質問がYes
      // ２の質問がNo
      $(".ansewer__title").text(" “子連れファミリー・屋外・アクティブ・電車バス”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html(" 森林公園(滑川町) <br> 東武動物公園（宮代町） ");

      // No.6
    } else if(ansewer[0] == ['Y'] && ansewer[1] == ['N'] && ansewer[2] == ['Y'] && ansewer[3] == ['N']) {
      // １と３の質問がYes
      // ２と４の質問がNo
      $(".ansewer__title").text(" “子連れファミリー・屋外・アクティブ・車”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html("むさしの村(加須市) <br> 東武動物公園(宮代町) ");

      // No.7
    } else if(ansewer[0] == ['Y'] && ansewer[1] == ['N'] && ansewer[2] == ['N'] && ansewer[3] == ['Y']) {
      // １と４の質問がYes
      // ２と３の質問がNo
      $(".ansewer__title").text(" “子連れファミリー・屋外・ゆったり・電子バス”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html("ムーミンバレーパーク（飯能） <br> こども自然動物公園（東松山） ");

      // No.8
    } else if(ansewer[0] == ['Y'] && ansewer[1] == ['N'] && ansewer[2] == ['N'] && ansewer[3] == ['N']) {
      // １の質問がNo
      // ２と３と４の質問がNo
      $(".ansewer__title").text(" “子連れファミリー・屋外・ゆったり・車”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html(" こども自然動物公園（東松山） <br> サイボク（日高市） ");

      // No.9
    } else if(ansewer[0] == ['N'] && ansewer[1] == ['Y'] && ansewer[2] == ['Y'] && ansewer[3] == ['Y']) {
      // ２と３と４の質問がYes
      // １の質問がNo
      $(".ansewer__title").text(" “大人・室内・アクティブ・電車バス”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html(" VS PARK（越谷レイクタウン）<br> フライステーション（越谷）");

      // No.10
    } else if(ansewer[0] == ['N'] && ansewer[1] == ['Y'] && ansewer[2] == ['Y'] && ansewer[3] == ['Y']) {
      // ２と３の質問がYes
      // １と４の質問がNo
      $(".ansewer__title").text(" “大人・室内・アクティブ・車”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html("トランポリン AIR JOY（川越）<br> クライミングジムZERO（さいたま）");

      // No.11
    } else if(ansewer[0] == ['N'] && ansewer[1] == ['Y'] && ansewer[2] == ['N'] && ansewer[3] == ['Y']) {
      // ２と４の質問がYes
      // １と３の質問がNo
      $(".ansewer__title").text(" “大人・室内・ゆったり・電車バス”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html(" 角川武蔵ミュージアム（所沢） <br> おふろcafe（大宮） ");

      // No.12
    } else if(ansewer[0] == ['N'] && ansewer[1] == ['Y'] && ansewer[2] == ['N'] && ansewer[3] == ['N']) {
      // ２の質問がYes
      // １と３と４の質問がNo
      $(".ansewer__title").text(" “大人・室内・ゆったり・車”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html(" 越谷レイクタウン（越谷） <br> 角川ミュージアム（所沢） <br> お風呂cafe（大宮） ");

      // No.13
    } else if(ansewer[0] == ['N'] && ansewer[1] == ['N'] && ansewer[2] == ['Y'] && ansewer[3] == ['Y']) {
      // ３と４の質問がYes
      // １と２の質問がNo
      $(".ansewer__title").text(" “大人・屋外・アクティブ・電車バス”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html(" 西武園ゆうえんち(狭山) <br> フォレストアドベンチャー（秩父）<br> 東武動物公園（宮代町） ");

      // No.14
    } else if(ansewer[0] == ['N'] && ansewer[1] == ['N'] && ansewer[2] == ['Y'] && ansewer[3] == ['N']) {
      // ３の質問がYes
      // １と２と４の質問がNo
      $(".ansewer__title").text(" “大人・屋外・アクティブ・車”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html(" フォレストアドベンチャー（秩父）<br> 東武動物公園（宮代町） <br> 長瀞ライン下り（秩父）");

      // No.15
    } else if(ansewer[0] == ['N'] && ansewer[1] == ['N'] && ansewer[2] == ['N'] && ansewer[3] == ['Y']) {
      // ４の質問がYes
      // １と２と３の質問がNo
      $(".ansewer__title").text(" “大人・屋外・ゆったり・電子バス”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html(" 三井アウトレットパーク（入間） <br> ムーミンバレーパーク（飯能） <br> 小江戸・菓子屋横丁（川越） <br> 鉄道博物館（大宮） ");

      // No.16
    } else if(ansewer[0] == ['N'] && ansewer[1] == ['N'] && ansewer[2] == ['N'] && ansewer[3] == ['N']) {
      // １と２と３と４の質問がNo
      $(".ansewer__title").text(" “大人・屋外・ゆったり・車”を選んだあなたにおすすめなスポットは…… ");
      $(".ansewer__txt").html(" 三井アウトレットパーク（入間） <br> サイボク（日高市） ");


    } else {
      // 質問の結果が書かれていない時
      $(".ansewer__title").text("結果が有りません");
      $(".ansewer__txt").html("「 "+ansewer+" 」の時の結果を書いてください");
    }
  }  




});


function load() {
	// 初回読み込み時と読み込み完了後、ウィンドウサイズの変更の時
  var q_height = [];
  $(".questions li").each(function(i){
    q_height.push(Number($(".questions li").eq(i).css('height').slice(0,-2)) + 54);
  });
	// 質問全体で一番高さの有るコンテンツに合わせて高さ調整
  // 最大数を取得する「Math.max.apply(null,value)」について https://hajimete.org/jquery-get-the-maximum-and-minimum-values
  $(".questions").css({height: Math.max.apply(null,q_height)});
}
