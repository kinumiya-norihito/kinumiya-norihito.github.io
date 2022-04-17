const load = () => {
  const proButton = document.getElementById('processing'),
  importArea = document.getElementById('import'),
  exportArea = document.getElementById('export'),
  proce = () => {
    let importText = importArea.value, textList, returnText = m1 = m2 = m3 = m4 = '', lf = 0, prm, cnstrct,i=0,sp,ep,lv=0;
    //console.log('【原文】\n'+importText);

    //文字列の削除
    importText = importText.replace(/"[^"]*"/g,'');
    //console.log('【文字列削除】\n'+importText);

    //一行コメントを削除
    importText = importText.replace(/\/\/.*/g,'');
    //console.log('【一行コメント削除】\n'+importText);

    //複数行コメントを削除
    while((sp = importText.indexOf('/*'))>=0){
      ep = importText.indexOf('*/');
      importText = importText.replace(importText.substring(sp,ep+2),'');
    }
    //console.log('【複数行コメント削除】\n'+importText);

    //インデント除去
    //console.log('【インデント除去】\n'+importText);

    //改行を削除
    importText = importText.replace(/\n/g,'');
    //console.log('【改行を削除】\n'+importText);

    importText = importText.replace(/\{/g,'{\n');
    importText = importText.replace(/\}/g,'}\n');
    importText = importText.replace(/;/g,';\n');
    //console.log('【改行を復元】\n'+importText);

    while(importText[i]){
      switch(importText[i]){
        case '{':
          lv++;
          if(lv==2)sp=i;
          break;
        case '}':
          lv--;
          if(lv==1){
            ep=i+1;
            //console.log(importText.substring(sp,ep));
            importText = importText.replace(importText.substring(sp,ep),'');
            i = sp;
          }
          break;
        default:
      }
      i++;
    }
    //console.log('【lv2以上を削除】\n'+importText);
    importText = importText.replace(/{|}|;/g,'');
    importText = importText.replace(/\n+/g,'\n');
    importText = importText.replace(/\n( |\t)*/g,'\n');
    importText = importText.replace(/( |\t)*\n/g,'\n');

    //出てきた
    //console.log('【結果】\n'+importText);

    importText = importText.replace(/package .*\n/g,'');
    importText = importText.replace(/import .*\n/g,'');



    textList = importText.split('\n');
    for(i = 0; textList[i]; i++){
      //第一修飾子
      if(textList[i].indexOf('public ')>=0){
        m1='+';
        textList[i] = textList[i].replace(/public +/,'');
      }
      else if(textList[i].indexOf('protected ')>=0){
        m1='#';
        textList[i] = textList[i].replace(/protected +/,'');
      }
      else if(textList[i].indexOf('private ')>=0){
        m1='-';
        textList[i] = textList[i].replace(/private +/,'');
      }
      else{
        m1='~';
      }

      //第二修飾子
      if(textList[i].indexOf('static ')>=0){
        textList[i] = textList[i].replace(/static +/,'');
        m2='_';
      }
      else if(textList[i].indexOf('abstract ')>=0){
        textList[i] = textList[i].replace(/abstract +/,'');
        m2='/';
      }
      else{
        m2='';
      }

      if(textList[i].indexOf(')')>=0){
        //コンストラクタかメソッド
        if(lf!=2)returnText += '--\n';
        if(lf!=1)returnText += '--\n';
        //console.log(textList[i]);
        prm = textList[i].match(/\([^)]*\)/)[0];
        textList[i] = textList[i].replace(prm,'');
        prm = prm.replace(/\)|\(/g,'');
        prm = prm.replace(/ +,|, +/g,',');
        prm = prm.split(',');
        //console.log(textList[i],prm);
        if(textList[i].indexOf(textList[0])>=0){
          //コンストラクタ
          m3 ='';
          m4 = textList[i].match(/.+/)[0];
        }
        else{
          //メソッド
          m3 = ': '+textList[i].match(/^[^ ]+/)[0];
          m4 = textList[i].match(/[^ ]+$/)[0];
          //console.log(m4);
        }

        returnText += m2 + m1 + m4 + '(';
        //console.log(prm);
        for(let j=0;prm[j];j++){
          const param = prm[j].split(' ');
          returnText += param[1]+': '+param[0];
          returnText += (j+1)<prm.length?', ':'';
        }
        returnText += ')'+ m3 + m2;
        lf = 2;
      }
      else{
        //クラスかインターフェースかフィールド
        if(textList[i].indexOf('class ')>=0){
          //クラス
          textList[i] = textList[i].replace(/class +/,'');
          returnText += m2;
          returnText += textList[i].match(/^[^ ]+/);
          returnText += m2;
          lf = 0;
        }
        else if(textList[i].indexOf('interface ')>=0){
          //インターフェース
          textList[i] = textList[i].replace(/interface +/,'');
          returnText += '<<interface>>\n' + textList[i];
          lf = 0;
        }
        else{
          //フィールド
          if(lf==0)returnText += '--\n';
          m3 = textList[i].match(/^[^ ]+/)[0];
          m4 = textList[i].match(/[^ ]+$/)[0];
          returnText += m1+m4+': '+m3;
          lf = 1;
        }
      }
      //console.log([m1,m2,m3,m4]);
      returnText += '\n';

    }
    exportArea.value = returnText;
  };
  proButton.addEventListener('click',proce);
};

window.addEventListener("load",load,false);
