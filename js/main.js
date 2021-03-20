'use strict';

{
  function makeHeaders() {
    const source = [];
    for (let i = 0; i < 10; i++) {
      source[i] = i;
    }
    const headers = [];
    for (let i = 0; i < 10; i++) {
      headers[i] = source.splice(Math.floor(Math.random() * source.length), 1)[0];
    }
    return headers
  }

  //表見出しの作成
  function renderTableHeaders(rows, cols, calcType) {
    const coltitle = document.createElement('tr');
    const markbox = document.createElement('th');
    markbox.textContent = `${calcType}`;
    markbox.className = 'headers';
    coltitle.appendChild(markbox);

    for (let col = 0; col < 10; col++) {
      const th = document.createElement('th');
      th.textContent = rows[col];
      th.className = 'headers';
      coltitle.appendChild(th);
    }
    document.querySelector('thead').appendChild(coltitle);

    for (let row = 0; row < 10; row++) {
      const rowtitle = document.createElement('tr');
      rowtitle.id = `row${row}`;
      const th = document.createElement('th');
      th.textContent = cols[row];
      th.className = 'headers';
      rowtitle.appendChild(th);
      for (let i = 0; i < 10; i++) {
        const box = document.createElement('td');
        box.className = 'box';
        rowtitle.appendChild(box);
      }
      document.querySelector('tbody').appendChild(rowtitle);
      if (calcType === "×") {
        const targetElements = document.getElementsByClassName('headers');
        for (let i = 0; i < targetElements.length; i++) {
          targetElements[i].style.background = "skyblue";
        }
      };
    }
  }

  //表の計算結果出力
  function renderTableContents(results) {
    let targetElements = document.getElementsByClassName('box');
    for (let i = 0; i < 100; i++) {
      targetElements[0].remove();
    }
    for (let row = 0; row < 10; row++) {
      const tr = document.getElementById(`row${row}`);
      for (let col = 0; col < 10; col++) {
        const td = document.createElement('td');
        td.textContent = results[row][col];
        td.className = 'contents';
        tr.appendChild(td);
      }
    }
  }

  //画面リセット
  function resetTable() {
    location.reload();
    // let targetElements1 = document.getElementsByClassName('contents');
    // console.log(targetElements1);
    // for (let i = 0; i < 100; i++) {
    //   targetElements1[0].remove();
    // }
    // let targetElements2 = document.getElementsByClassName('headers');
    // console.log(targetElements2);
    // for (let i = 0; i < 21; i++) {
    //   targetElements2[0].remove();
    // }
  }

  //百マスオブジェクト
  class hyakumasu {
    constructor(mark) {
      this.calcType = mark;
      this.rows = makeHeaders();
      this.cols = makeHeaders();
      renderTableHeaders(this.rows, this.cols, this.calcType);
    }

    additon(rows, cols) {
      const results = [];
      for (let i = 0; i < 10; i++) {
        const rowResults = [];
        for (let j = 0; j < 10; j++) {
          rowResults.push(cols[i] + rows[j]);
        }
        results.push(rowResults);
      }
      return results
    }

    multiplication(rows, cols) {
      const results = [];
      for (let i = 0; i < 10; i++) {
        const rowResults = [];
        for (let j = 0; j < 10; j++) {
          rowResults.push(cols[i] * rows[j]);
        }
        results.push(rowResults);
      }
      return results
    }
  }


  // タイマー
  // 要素取得
  let timer = document.getElementById('timer');
  let start = document.getElementById('start');
  let stop = document.getElementById('stop');

  //百マスオブジェクト取得
  let masuResults = [];
  const createAddBtn = document.getElementById('createAdd');
  const createMulBtn = document.getElementById('createMul');
  const calculateBtn = document.getElementById('calculate');
  const resetBtn = document.getElementById('reset');

  createAddBtn.addEventListener('click', () => {
    const masu = new hyakumasu('+');
    masuResults = masu.additon(masu.rows, masu.cols);
    createAddBtn.disabled = true;
    createMulBtn.disabled = true;
    calculateBtn.disabled = false;
    resetBtn.disabled = true;
    start.disabled = false;
  });

  createMulBtn.addEventListener('click', () => {
    const masu = new hyakumasu('×');
    masuResults = masu.multiplication(masu.rows, masu.cols);
    createAddBtn.disabled = true;
    createMulBtn.disabled = true;
    calculateBtn.disabled = false;
    resetBtn.disabled = true;
    start.disabled = false;
  });


  calculateBtn.addEventListener('click', () => {
    renderTableContents(masuResults);
    masuResults = [];
    createAddBtn.disabled = true;
    createMulBtn.disabled = true;
    calculateBtn.disabled = true;
    resetBtn.disabled = false;
  });

  resetBtn.addEventListener('click', () => {
    resetTable();
    createAddBtn.disabled = false;
    createMulBtn.disabled = false;
    calculateBtn.disabled = true;
    resetBtn.disabled = true;
  });




  let startTime;  //クリック時の時間
  let elapsedTime = 0;  //経過時刻を更新するための変数。 初めはだから0で初期化

  let timerId;  //Timeoutの引数
  let timeToadd = 0; //タイマー一時停止用 

  //更新と表示
  function updateTimeText() {
    let m = Math.floor(elapsedTime / 60000); //m(分)
    let s = Math.floor(elapsedTime % 60000 / 1000);  //s(秒)
    let ms = elapsedTime % 1000; //ms(ミリ秒) 

    //文字列の末尾2桁を表示(slice)
    m = ('0' + m).slice(-2);
    s = ('0' + s).slice(-2);
    ms = ('0' + ms).slice(-3);
    //id timer部に表示
    timer.textContent = m + ':' + s + ':' + ms;
  }

  function countUp() {

    //timerId変数をsetTimeoutの返り値に
    timerId = setTimeout(function () {
      elapsedTime = Date.now() - startTime + timeToadd;  //経過時刻
      updateTimeText()
      countUp();
    }, 10);
  }

  //タイマースタート
  start.addEventListener('click', function () {
    startTime = Date.now();  //現在時刻
    //再帰的に使えるように関数を作る
    countUp();
    start.disabled = true;
    stop.disabled = false;
  });

  //タイマーストップ
  stop.addEventListener('click', function () {
    clearTimeout(timerId); //clearTimeoutの引数timerId
    //タイマーに表示される時間 elapsedTime = Date.now - startTime
    timeToadd += Date.now() - startTime;
    start.disabled = false;
    stop.disabled = true;
  });



}