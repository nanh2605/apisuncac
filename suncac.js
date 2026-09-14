const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const HISTORY_API_URL = "https://kwinstore.com/sunwin/tx/history/6510962597fde7c34586236827167b434fc246af9b55777c";
const CACHE_TTL = 5000;

// ============================================================
// [1] PATTERN DICTIONARY (từ thuattoan.js) - 250+ mẫu thủ công
// ============================================================
const PATTERN_DICT = {
  "TXT":{"prediction":"Xỉu","confidence":68},"TTXX":{"prediction":"Tài","confidence":87},
  "XXTXX":{"prediction":"Tài","confidence":59},"TTX":{"prediction":"Xỉu","confidence":73},
  "XTT":{"prediction":"Tài","confidence":92},"TXX":{"prediction":"Tài","confidence":55},
  "XTX":{"prediction":"Xỉu","confidence":81},"TXTX":{"prediction":"Tài","confidence":64},
  "XTXX":{"prediction":"Tài","confidence":77},"XXTX":{"prediction":"Tài","confidence":96},
  "TXTT":{"prediction":"Xỉu","confidence":71},"TTT":{"prediction":"Tài","confidence":83},
  "XXX":{"prediction":"Tài","confidence":52},"TXXT":{"prediction":"Tài","confidence":94},
  "XTXT":{"prediction":"Xỉu","confidence":63},"XXTT":{"prediction":"Tài","confidence":79},
  "XTTX":{"prediction":"Tài","confidence":88},"XTXTX":{"prediction":"Tài","confidence":75},
  "TTXXX":{"prediction":"Tài","confidence":61},"XTTXT":{"prediction":"Tài","confidence":69},
  "XXTXT":{"prediction":"Xỉu","confidence":84},"TXTTX":{"prediction":"Tài","confidence":53},
  "XTXXT":{"prediction":"Tài","confidence":91},"TTTXX":{"prediction":"Xỉu","confidence":72},
  "XXTTT":{"prediction":"Tài","confidence":65},"XTXTT":{"prediction":"Tài","confidence":97},
  "TXTXT":{"prediction":"Tài","confidence":56},"TTXTX":{"prediction":"Xỉu","confidence":78},
  "TXTTT":{"prediction":"Xỉu","confidence":62},"XXTXTX":{"prediction":"Tài","confidence":85},
  "XTXXTX":{"prediction":"Tài","confidence":74},"TXTTTX":{"prediction":"Tài","confidence":66},
  "TTTTXX":{"prediction":"Xỉu","confidence":89},"XTXTTX":{"prediction":"Tài","confidence":51},
  "XTXXTT":{"prediction":"Tài","confidence":82},"TXXTXX":{"prediction":"Tài","confidence":93},
  "XXTXXT":{"prediction":"Tài","confidence":76},"TXTTXX":{"prediction":"Xỉu","confidence":67},
  "TTTXTX":{"prediction":"Xỉu","confidence":58},"TTXTTT":{"prediction":"Tài","confidence":95},
  "TXXTTX":{"prediction":"Tài","confidence":54},"XXTTTX":{"prediction":"Tài","confidence":86},
  "XTTTTX":{"prediction":"Xỉu","confidence":70},"TXTXTT":{"prediction":"Tài","confidence":60},
  "TXTXTX":{"prediction":"Tài","confidence":80},"TTTTX":{"prediction":"Tài","confidence":90},
  "XXXTX":{"prediction":"Tài","confidence":84},"XTXXXT":{"prediction":"Tài","confidence":67},
  "XXTTXX":{"prediction":"Tài","confidence":79},"TTTXXT":{"prediction":"Xỉu","confidence":62},
  "XXTXXX":{"prediction":"Tài","confidence":91},"XTXTXT":{"prediction":"Tài","confidence":55},
  "TTXXTX":{"prediction":"Tài","confidence":88},"TTXXT":{"prediction":"Tài","confidence":77},
  "TXXTX":{"prediction":"Xỉu","confidence":69},"XTXXX":{"prediction":"Tài","confidence":83},
  "TTXT":{"prediction":"Xỉu","confidence":61},"TTTXT":{"prediction":"Xỉu","confidence":75},
  "TTTT":{"prediction":"Tài","confidence":94},"TTTTT":{"prediction":"Tài","confidence":57},
  "TTTTTT":{"prediction":"Xỉu","confidence":86},"TTTTTTT":{"prediction":"Tài","confidence":65},
  "TTTTTTX":{"prediction":"Xỉu","confidence":78},"TTTTTX":{"prediction":"Xỉu","confidence":53},
  "TTTTTXT":{"prediction":"Xỉu","confidence":89},"TTTTTXX":{"prediction":"Tài","confidence":70},
  "TTTTXT":{"prediction":"Xỉu","confidence":81},"TTTTXTT":{"prediction":"Tài","confidence":63},
  "TTTTXTX":{"prediction":"Xỉu","confidence":92},"TTTTXXT":{"prediction":"Xỉu","confidence":56},
  "TTTTXXX":{"prediction":"Tài","confidence":85},"TTTX":{"prediction":"Xỉu","confidence":74},
  "TTTXTT":{"prediction":"Tài","confidence":66},"TTTXTTT":{"prediction":"Xỉu","confidence":97},
  "TTTXTTX":{"prediction":"Xỉu","confidence":59},"TTTXTXT":{"prediction":"Tài","confidence":82},
  "TTTXTXX":{"prediction":"Tài","confidence":71},"TTTXXTT":{"prediction":"Tài","confidence":60},
  "TTTXXTX":{"prediction":"Tài","confidence":90},"TTTXXX":{"prediction":"Xỉu","confidence":64},
  "TTTXXXT":{"prediction":"Tài","confidence":87},"TTTXXXX":{"prediction":"Xỉu","confidence":76},
  "TTXTT":{"prediction":"Xỉu","confidence":93},"TTXTTTT":{"prediction":"Xỉu","confidence":68},
  "TTXTTTX":{"prediction":"Xỉu","confidence":80},"TTXTTX":{"prediction":"Tài","confidence":58},
  "TTXTTXT":{"prediction":"Tài","confidence":95},"TTXTTXX":{"prediction":"Xỉu","confidence":54},
  "TTXTXT":{"prediction":"Xỉu","confidence":83},"TTXTXTT":{"prediction":"Tài","confidence":72},
  "TTXTXTX":{"prediction":"Tài","confidence":61},"TTXTXX":{"prediction":"Xỉu","confidence":89},
  "TTXTXXT":{"prediction":"Tài","confidence":70},"TTXTXXX":{"prediction":"Xỉu","confidence":79},
  "TTXXTT":{"prediction":"Tài","confidence":57},"TTXXTTT":{"prediction":"Xỉu","confidence":84},
  "TTXXTTX":{"prediction":"Tài","confidence":67},"TTXXTXT":{"prediction":"Tài","confidence":96},
  "TTXXTXX":{"prediction":"Xỉu","confidence":51},"TTXXXT":{"prediction":"Xỉu","confidence":75},
  "TTXXXTT":{"prediction":"Tài","confidence":62},"TTXXXTX":{"prediction":"Tài","confidence":91},
  "TTXXXX":{"prediction":"Xỉu","confidence":73},"TTXXXXT":{"prediction":"Tài","confidence":82},
  "TTXXXXX":{"prediction":"Xỉu","confidence":66},"TXTTTT":{"prediction":"Xỉu","confidence":94},
  "TXTTTTT":{"prediction":"Xỉu","confidence":59},"TXTTTTX":{"prediction":"Xỉu","confidence":85},
  "TXTTTXT":{"prediction":"Xỉu","confidence":77},"TXTTTXX":{"prediction":"Tài","confidence":68},
  "TXTTXT":{"prediction":"Tài","confidence":86},"TXTTXTT":{"prediction":"Tài","confidence":55},
  "TXTTXTX":{"prediction":"Tài","confidence":74},"TXTTXXT":{"prediction":"Tài","confidence":92},
  "TXTTXXX":{"prediction":"Tài","confidence":63},"TXTXTTT":{"prediction":"Tài","confidence":81},
  "TXTXTTX":{"prediction":"Tài","confidence":70},"TXTXTXT":{"prediction":"Xỉu","confidence":89},
  "TXTXTXX":{"prediction":"Tài","confidence":58},"TXTXX":{"prediction":"Tài","confidence":97},
  "TXTXXT":{"prediction":"Tài","confidence":64},"TXTXXTT":{"prediction":"Tài","confidence":83},
  "TXTXXTX":{"prediction":"Xỉu","confidence":72},"TXTXXX":{"prediction":"Xỉu","confidence":61},
  "TXTXXXT":{"prediction":"Xỉu","confidence":90},"TXTXXXX":{"prediction":"Xỉu","confidence":53},
  "TXXTT":{"prediction":"Tài","confidence":87},"TXXTTT":{"prediction":"Tài","confidence":76},
  "TXXTTTT":{"prediction":"Tài","confidence":65},"TXXTTTX":{"prediction":"Tài","confidence":54},
  "TXXTTXT":{"prediction":"Xỉu","confidence":93},"TXXTTXX":{"prediction":"Xỉu","confidence":82},
  "TXXTXT":{"prediction":"Tài","confidence":71},"TXXTXTT":{"prediction":"Tài","confidence":60},
  "TXXTXTX":{"prediction":"Tài","confidence":95},"TXXTXXT":{"prediction":"Tài","confidence":84},
  "TXXTXXX":{"prediction":"Xỉu","confidence":73},"TXXX":{"prediction":"Tài","confidence":62},
  "TXXXT":{"prediction":"Tài","confidence":91},"TXXXTT":{"prediction":"Xỉu","confidence":57},
  "TXXXTTT":{"prediction":"Tài","confidence":86},"TXXXTTX":{"prediction":"Xỉu","confidence":75},
  "TXXXTX":{"prediction":"Xỉu","confidence":64},"TXXXTXT":{"prediction":"Tài","confidence":97},
  "TXXXTXX":{"prediction":"Xỉu","confidence":66},"TXXXX":{"prediction":"Xỉu","confidence":85},
  "TXXXXT":{"prediction":"Tài","confidence":74},"TXXXXTT":{"prediction":"Xỉu","confidence":63},
  "TXXXXTX":{"prediction":"Xỉu","confidence":92},"TXXXXX":{"prediction":"Tài","confidence":51},
  "TXXXXXT":{"prediction":"Xỉu","confidence":80},"TXXXXXX":{"prediction":"Xỉu","confidence":69},
  "XTTT":{"prediction":"Xỉu","confidence":88},"XTTTT":{"prediction":"Xỉu","confidence":77},
  "XTTTTT":{"prediction":"Tài","confidence":56},"XTTTTTT":{"prediction":"Tài","confidence":95},
  "XTTTTTX":{"prediction":"Tài","confidence":64},"XTTTTXT":{"prediction":"Tài","confidence":83},
  "XTTTTXX":{"prediction":"Xỉu","confidence":72},"XTTTX":{"prediction":"Tài","confidence":61},
  "XTTTXT":{"prediction":"Xỉu","confidence":90},"XTTTXTT":{"prediction":"Tài","confidence":59},
  "XTTTXTX":{"prediction":"Xỉu","confidence":78},"XTTTXX":{"prediction":"Tài","confidence":87},
  "XTTTXXT":{"prediction":"Tài","confidence":66},"XTTTXXX":{"prediction":"Tài","confidence":55},
  "XTTXTT":{"prediction":"Tài","confidence":94},"XTTXTTT":{"prediction":"Tài","confidence":73},
  "XTTXTTX":{"prediction":"Tài","confidence":82},"XTTXTX":{"prediction":"Xỉu","confidence":71},
  "XTTXTXT":{"prediction":"Tài","confidence":60},"XTTXTXX":{"prediction":"Xỉu","confidence":89},
  "XTTXX":{"prediction":"Xỉu","confidence":58},"XTTXXT":{"prediction":"Xỉu","confidence":97},
  "XTTXXTT":{"prediction":"Tài","confidence":76},"XTTXXTX":{"prediction":"Xỉu","confidence":65},
  "XTTXXX":{"prediction":"Tài","confidence":84},"XTTXXXT":{"prediction":"Xỉu","confidence":53},
  "XTTXXXX":{"prediction":"Tài","confidence":92},"XTXTTT":{"prediction":"Tài","confidence":81},
  "XTXTTTT":{"prediction":"Tài","confidence":70},"XTXTTTX":{"prediction":"Xỉu","confidence":99},
  "XTXTTXT":{"prediction":"Xỉu","confidence":68},"XTXTTXX":{"prediction":"Tài","confidence":87},
  "XTXTXTT":{"prediction":"Tài","confidence":56},"XTXTXTX":{"prediction":"Xỉu","confidence":95},
  "XTXTXX":{"prediction":"Tài","confidence":74},"XTXTXXT":{"prediction":"Tài","confidence":83},
  "XTXTXXX":{"prediction":"Tài","confidence":62},"XTXXTTT":{"prediction":"Tài","confidence":91},
  "XTXXTTX":{"prediction":"Xỉu","confidence":60},"XTXXTXT":{"prediction":"Tài","confidence":79},
  "XTXXTXX":{"prediction":"Tài","confidence":68},"XTXXXTT":{"prediction":"Xỉu","confidence":97},
  "XTXXXTX":{"prediction":"Tài","confidence":86},"XTXXXX":{"prediction":"Xỉu","confidence":75},
  "XTXXXXT":{"prediction":"Tài","confidence":64},"XTXXXXX":{"prediction":"Tài","confidence":93},
  "XXT":{"prediction":"Xỉu","confidence":82},"XXTTTT":{"prediction":"Tài","confidence":71},
  "XXTTTTT":{"prediction":"Xỉu","confidence":60},"XXTTTTX":{"prediction":"Tài","confidence":89},
  "XXTTTXT":{"prediction":"Xỉu","confidence":78},"XXTTTXX":{"prediction":"Xỉu","confidence":67},
  "XXTTX":{"prediction":"Tài","confidence":96},"XXTTXT":{"prediction":"Xỉu","confidence":55},
  "XXTTXTT":{"prediction":"Xỉu","confidence":94},"XXTTXTX":{"prediction":"Tài","confidence":73},
  "XXTTXXT":{"prediction":"Xỉu","confidence":62},"XXTTXXX":{"prediction":"Tài","confidence":81},
  "XXTXTT":{"prediction":"Tài","confidence":70},"XXTXTTT":{"prediction":"Tài","confidence":99},
  "XXTXTTX":{"prediction":"Xỉu","confidence":58},"XXTXTXT":{"prediction":"Tài","confidence":87},
  "XXTXTXX":{"prediction":"Tài","confidence":76},"XXTXXTT":{"prediction":"Xỉu","confidence":65},
  "XXTXXTX":{"prediction":"Xỉu","confidence":94},"XXTXXXT":{"prediction":"Tài","confidence":83},
  "XXTXXXX":{"prediction":"Tài","confidence":72},"XXXT":{"prediction":"Tài","confidence":61},
  "XXXTT":{"prediction":"Xỉu","confidence":90},"XXXTTT":{"prediction":"Xỉu","confidence":79},
  "XXXTTTT":{"prediction":"Xỉu","confidence":68},"XXXTTTX":{"prediction":"Xỉu","confidence":97},
  "XXXTTX":{"prediction":"Tài","confidence":56},"XXXTTXT":{"prediction":"Xỉu","confidence":85},
  "XXXTTXX":{"prediction":"Xỉu","confidence":74},"XXXTXT":{"prediction":"Tài","confidence":63},
  "XXXTXTT":{"prediction":"Tài","confidence":92},"XXXTXTX":{"prediction":"Xỉu","confidence":51},
  "XXXTXX":{"prediction":"Tài","confidence":80},"XXXTXXT":{"prediction":"Xỉu","confidence":69},
  "XXXTXXX":{"prediction":"Tài","confidence":98},"XXXX":{"prediction":"Tài","confidence":57},
  "XXXXT":{"prediction":"Xỉu","confidence":86},"XXXXTT":{"prediction":"Xỉu","confidence":75},
  "XXXXTTT":{"prediction":"Tài","confidence":64},"XXXXTTX":{"prediction":"Tài","confidence":93},
  "XXXXTX":{"prediction":"Tài","confidence":82},"XXXXTXT":{"prediction":"Tài","confidence":71},
  "XXXXTXX":{"prediction":"Tài","confidence":60},"XXXXX":{"prediction":"Tài","confidence":89},
  "XXXXXT":{"prediction":"Xỉu","confidence":78},"XXXXXTT":{"prediction":"Tài","confidence":67},
  "XXXXXTX":{"prediction":"Tài","confidence":96},"XXXXXX":{"prediction":"Tài","confidence":55},
  "XXXXXXT":{"prediction":"Tài","confidence":94},"XXXXXXX":{"prediction":"Tài","confidence":83}
};

// ============================================================
// [2] PATTERN_DATA (từ sun.win.py) - xác suất Tài/Xỉu theo chuỗi
// ============================================================
const PATTERN_DATA = {
  "tttt":{tai:73,xiu:27},"xxxx":{tai:27,xiu:73},"tttttt":{tai:83,xiu:17},
  "xxxxxx":{tai:17,xiu:83},"ttttx":{tai:40,xiu:60},"xxxxt":{tai:60,xiu:40},
  "ttttttx":{tai:30,xiu:70},"xxxxxxt":{tai:70,xiu:30},"ttxx":{tai:62,xiu:38},
  "xxtt":{tai:38,xiu:62},"ttxxtt":{tai:32,xiu:68},"xxttxx":{tai:68,xiu:32},
  "txx":{tai:60,xiu:40},"xtt":{tai:40,xiu:60},"txxtx":{tai:63,xiu:37},
  "xttxt":{tai:37,xiu:63},"tttxt":{tai:60,xiu:40},"xxxtx":{tai:40,xiu:60},
  "tttxx":{tai:60,xiu:40},"xxxtt":{tai:40,xiu:60},"txxt":{tai:60,xiu:40},
  "xttx":{tai:40,xiu:60},"ttxxttx":{tai:30,xiu:70},"xxttxxt":{tai:70,xiu:30},
  "tttttttt":{tai:88,xiu:12},"xxxxxxxx":{tai:12,xiu:88},"tttttttx":{tai:25,xiu:75},
  "xxxxxxxxt":{tai:75,xiu:25},"tttttxxx":{tai:35,xiu:65},"xxxxtttt":{tai:65,xiu:35},
  "ttttxxxx":{tai:30,xiu:70},"xxxxtttx":{tai:70,xiu:30},"txtxtx":{tai:68,xiu:32},
  "xtxtxt":{tai:32,xiu:68},"ttxtxt":{tai:55,xiu:45},"xxtxtx":{tai:45,xiu:55},
  "txtxxt":{tai:60,xiu:40},"xtxttx":{tai:40,xiu:60},"ttx":{tai:65,xiu:35},
  "xxt":{tai:35,xiu:65},"txt":{tai:58,xiu:42},"xtx":{tai:42,xiu:58},
  "tttx":{tai:70,xiu:30},"xxxt":{tai:30,xiu:70},"ttxt":{tai:63,xiu:37},
  "xxtx":{tai:37,xiu:63},"txxx":{tai:25,xiu:75},"xttt":{tai:75,xiu:25},
  "ttxtx":{tai:62,xiu:38},"xxtxt":{tai:38,xiu:62},"ttxxt":{tai:55,xiu:45},
  "xxttx":{tai:45,xiu:55},"tttttx":{tai:30,xiu:70},"xxxxxt":{tai:70,xiu:30},
  "tttttttx":{tai:20,xiu:80},"xxxxxxxt":{tai:80,xiu:20},"ttttttttx":{tai:15,xiu:85},
  "xxxxxxxxt2":{tai:85,xiu:15},"txtx":{tai:52,xiu:48},"xtxt":{tai:48,xiu:52},
  "txtxt":{tai:53,xiu:47},"xtxtx":{tai:47,xiu:53},"txtxtxt":{tai:57,xiu:43},
  "xtxtxtx":{tai:43,xiu:57},"ttxxttxx":{tai:38,xiu:62},"xxttxxtt":{tai:62,xiu:38},
  "ttxxxttx":{tai:45,xiu:55},"xxttxxxt":{tai:55,xiu:45},"ttxtxttx":{tai:50,xiu:50},
  "xxtxtxxt":{tai:50,xiu:50},"ttxttx":{tai:60,xiu:40},"xxtxxt":{tai:40,xiu:60},
  "ttxxtx":{tai:58,xiu:42},"ttxtxtx":{tai:62,xiu:38},"xxtxtxt":{tai:38,xiu:62},
  "ttxxtxt":{tai:55,xiu:45},"xxtxttx":{tai:45,xiu:55},"ttxtxxt":{tai:65,xiu:35},
  "ttxtxttx2":{tai:70,xiu:30},"ttxxtxtx":{tai:68,xiu:32},"xxtxtxtx":{tai:32,xiu:68},
  "ttxtxxtx":{tai:72,xiu:28},"ttxxtxxt":{tai:75,xiu:25}
};

const BIG_STREAK_DATA = {
  tai:{"3":{next_tai:65,next_xiu:35},"4":{next_tai:70,next_xiu:30},
       "5":{next_tai:75,next_xiu:25},"6":{next_tai:80,next_xiu:20},
       "7":{next_tai:85,next_xiu:15},"8":{next_tai:88,next_xiu:12},
       "9":{next_tai:90,next_xiu:10},"10+":{next_tai:92,next_xiu:8}},
  xiu:{"3":{next_tai:35,next_xiu:65},"4":{next_tai:30,next_xiu:70},
       "5":{next_tai:25,next_xiu:75},"6":{next_tai:20,next_xiu:80},
       "7":{next_tai:15,next_xiu:85},"8":{next_tai:12,next_xiu:88},
       "9":{next_tai:10,next_xiu:90},"10+":{next_tai:8,next_xiu:92}}
};

const SUM_STATS = {
  "3-10":{tai:0,xiu:100},"11":{tai:15,xiu:85},"12":{tai:25,xiu:75},
  "13":{tai:40,xiu:60},"14":{tai:50,xiu:50},"15":{tai:60,xiu:40},
  "16":{tai:75,xiu:25},"17":{tai:85,xiu:15},"18":{tai:100,xiu:0}
};

// ============================================================
// [3] PATTERN SHAPES + CORE BRAINS (từ ĐÃ GIẢI MÃ HÓA.html)
// ============================================================
const SHAPES = [
  [1,1],[2,2],[3,3],[4,4],[2,1],[1,2],[3,1],[1,3],[4,1],[1,4],[3,2],[2,3],[4,2],[2,4],
  [2,1,2],[1,2,1],[3,1,3],[1,3,1],[2,2,1],[1,1,2],[3,2,1],[1,2,3],[2,3,2],
  [3,3,1],[1,1,3],[2,1,1],[3,1,1],[1,1,1,2],[2,2,1,1],[3,2,2],[4,1,1]
];

// ============================================================
// HELPERS
// ============================================================
const opp = v => v === 'T' ? 'X' : 'T';
const clamp = (v,a,b) => v<a?a:(v>b?b:v);
const sig = z => 1/(1+Math.exp(-clamp(z,-30,30)));
const avg = a => a.reduce((x,y)=>x+y,0)/(a.length||1);

function rle(s) {
  const o = [];
  for (let i=0;i<s.length;i++) {
    if (o.length && o[o.length-1].v===s[i]) o[o.length-1].n++;
    else o.push({v:s[i],n:1});
  }
  return o;
}
function P(pick, strength) {
  if (!pick) return null;
  const s = clamp(strength==null?0.58:strength,0.5,0.95);
  return pick==='T' ? s : 1-s;
}

// Khớp shape trên RLE
function matchShape(s, shape) {
  const r = rle(s);
  if (r.length < shape.length + 1) return null;
  const closed = r.slice(0, r.length-1).map(x=>x.n);
  const cur = r[r.length-1];
  const need = shape.length;
  if (closed.length < need*2) return null;
  let cycles=0, idx=closed.length;
  while (idx-need>=0) {
    let ok=true;
    for (let j=0;j<need;j++) {
      const posInShape = (need-1-j+need*100)%need;
      if (closed[idx-1-j]!==shape[posInShape]) { ok=false; break; }
    }
    if (!ok) break;
    cycles++; idx-=need;
  }
  if (cycles<2) return null;
  const lastClosedPos = (closed.length-1)%need;
  const wantLen = shape[(lastClosedPos+1)%need];
  const strength = clamp(0.6+cycles*0.05,0.6,0.86);
  if (cur.n < wantLen) return {pick:cur.v,s:strength,cycles,want:wantLen};
  return {pick:opp(cur.v),s:strength,cycles,want:wantLen};
}

// ============================================================
// THUẬT TOÁN 1: PATTERN-BASED (từ sun.win.py)
// ============================================================
function findClosestPattern(input) {
  if (!input) return null;
  const keys = Object.keys(PATTERN_DATA).sort((a,b)=>b.length-a.length);
  for (const k of keys) if (input.endsWith(k)) return k;
  return null;
}

function analyzeBigStreak(history) {
  if (history.length < 2) return {prediction:null,confidence:0};
  let streak=1; const result = history[0].ket_qua;
  for (let i=1;i<history.length;i++) {
    if (history[i].ket_qua===result) streak++; else break;
  }
  if (streak>=3) {
    const key = streak<=9 ? String(streak) : "10+";
    const stats = BIG_STREAK_DATA[result==="Tài"?"tai":"xiu"][key];
    if (stats) {
      if (stats.next_tai > stats.next_xiu) return {prediction:"Tài",confidence:stats.next_tai};
      return {prediction:"Xỉu",confidence:stats.next_xiu};
    }
  }
  return {prediction:null,confidence:0};
}

function analyzeSumTrend(history) {
  if (!history.length) return {prediction:null,confidence:0};
  const stats = SUM_STATS[String(history[0].tong)];
  if (stats) {
    if (stats.tai===100) return {prediction:"Tài",confidence:95};
    if (stats.xiu===100) return {prediction:"Xỉu",confidence:95};
    if (stats.tai > stats.xiu) return {prediction:"Tài",confidence:stats.tai};
    return {prediction:"Xỉu",confidence:stats.xiu};
  }
  return {prediction:null,confidence:0};
}

function patternBasedPredict(history) {
  if (!history.length) return {prediction:"Tài",confidence:50};
  const streak = analyzeBigStreak(history);
  if (streak.prediction && streak.confidence>75) return streak;
  const sum = analyzeSumTrend(history);
  if (sum.prediction && sum.confidence>80) return sum;

  const elements = history.slice(0,15).map(s=>s.ket_qua==="Tài"?"t":"x");
  const key = findClosestPattern(elements.reverse().join(""));
  if (key) {
    const data = PATTERN_DATA[key];
    if (data.tai===data.xiu) {
      return history[0].tong>=11 ? {prediction:"Tài",confidence:55} : {prediction:"Xỉu",confidence:55};
    }
    if (data.tai > data.xiu) return {prediction:"Tài",confidence:data.tai};
    return {prediction:"Xỉu",confidence:data.xiu};
  }
  return history[0].tong>=11 ? {prediction:"Tài",confidence:55} : {prediction:"Xỉu",confidence:55};
}

// ============================================================
// THUẬT TOÁN 2: SUPER VI LONG - 15 TẦNG (từ apisun_predict.js)
// ============================================================
function superViLongAlgorithm(h, rawHistory) {
  if (h.length < 15) return -1;
  const pStr = h.slice(0, Math.min(30, h.length)).join('');
  let curStreak = 0;
  for (let i=0;i<h.length;i++) { if (h[i]===h[0]) curStreak++; else break; }

  // TẦNG 1: VIP 11
  let vip11Pred = -1;
  if (h.length>=2 && h[0]!==h[1]) vip11Pred = h[0];

  // TẦNG 2: FLASH
  let flashPred = -1;
  if (h.length>=2 && h.length<10) {
    flashPred = h[0]===h[1] ? h[0] : (h[0]===1?0:1);
    if (h.length>=3) {
      if (h[0]!==h[1] && h[1]!==h[2]) flashPred = h[0]===1?0:1;
      else if (h[0]===h[1] && h[1]===h[2]) flashPred = h[0];
    }
  }

  // TẦNG 3: TENSOR
  let tensorPred = -1;
  if (h.length>=25) {
    const b1 = h.slice(0,8).filter(x=>x===1).length;
    const b2 = h.slice(8,16).filter(x=>x===1).length;
    const b3 = h.slice(16,24).filter(x=>x===1).length;
    if (b1>5 && b2<3 && b3>5) tensorPred = 0;
    else if (b1<3 && b2>5 && b3<3) tensorPred = 1;
    if (Math.abs(b1-b2)<=1 && Math.abs(b2-b3)<=1 && curStreak>=2) tensorPred = h[0]===1?0:1;
  }

  // TẦNG 4: ELLIOT WAVE
  let elliotWavePred = -1;
  if (h.length>=15) {
    const waves = []; let wCount=1;
    for (let i=0;i<8;i++) {
      if (h[i]===h[i+1]) wCount++;
      else { waves.push(wCount); wCount=1; }
    }
    if (waves.length>=3 && waves[0]===1 && waves[1]===2 && waves[2]>=3) elliotWavePred = h[0]===1?0:1;
  }

  // TẦNG 5: POISSON
  let poissonPred = -1;
  if (h.length>=30) {
    const cT = h.slice(0,30).filter(x=>x===1).length;
    if (cT>=22 && h[0]===1) poissonPred = 0;
    else if (cT<=8 && h[0]===0) poissonPred = 1;
  }

  // TẦNG 6: CLUSTER
  let clusterPred = -1;
  if (h.length>=8) {
    const cs = h[0]*8+h[1]*4+h[2]*2+h[3]*1;
    if (cs===15 && curStreak===4) clusterPred = 0;
    else if (cs===0 && curStreak===4) clusterPred = 1;
  }

  // TẦNG 7: QUANTUM
  let quantumPred = -1;
  if (h.length>=25) {
    let qT=0, qX=0;
    for (let i=0;i<10;i++) {
      if (h[i]===h[i+5] && h[i]!==h[i+10]) {
        if (h[i]===1) qT++; else qX++;
      }
    }
    if (qT>=3 && h[0]===1) quantumPred = 0;
    else if (qX>=3 && h[0]===0) quantumPred = 1;
  }

  // TẦNG 8: VIP VI LONG
  let vipViLongPred = -1;
  if (h.length>=20) {
    let crossScore = 0;
    for (let i=0;i<8;i++) if (h[i]===h[i+2] && h[i+1]!==h[i]) crossScore++;
    if (crossScore>=5) vipViLongPred = h[0]===1?0:1;
    if (pStr.startsWith('1110111') || pStr.startsWith('0001000')) vipViLongPred = h[0];
  }

  // TẦNG 9: MARKOV 3D
  let markov3DPred = -1;
  if (h.length>=25) {
    const pattern3 = ""+h[2]+h[1]+h[0];
    let t1=0, t0=0;
    for (let i=3;i<h.length-3;i++) {
      if (""+h[i+2]+h[i+1]+h[i]===pattern3) {
        if (h[i-1]===1) t1++; else t0++;
      }
    }
    if (t1>t0 && t1>=2) markov3DPred = 1;
    else if (t0>t1 && t0>=2) markov3DPred = 0;
  }

  // TẦNG 10: GAUSSIAN
  let gaussianPred = -1;
  if (rawHistory && rawHistory.length>=15) {
    const sums = [];
    for (let i=0;i<15;i++) {
      const s = (rawHistory[i].xuc_xac_1||0)+(rawHistory[i].xuc_xac_2||0)+(rawHistory[i].xuc_xac_3||0);
      if (s>0) sums.push(s);
    }
    if (sums.length===15) {
      const mean = sums.reduce((a,b)=>a+b,0)/15;
      const v = sums.reduce((a,b)=>a+Math.pow(b-mean,2),0)/15;
      const sd = Math.sqrt(v);
      if (sd<1.8 && curStreak>=3) gaussianPred = h[0]===1?0:1;
      else if (sd>4.5) {
        if (mean>12) gaussianPred = 0;
        else if (mean<9) gaussianPred = 1;
      }
    }
  }

  // TẦNG 11: FRACTAL
  let fractalPred = -1;
  if (h.length>=20) {
    const curF = h.slice(0,4).join('');
    for (let i=4;i<h.length-4;i++) {
      if (h.slice(i,i+4).join('')===curF) { fractalPred = h[i-1]; break; }
    }
  }

  // CÂY ƯU TIÊN
  if (gaussianPred!==-1) return gaussianPred;
  if (markov3DPred!==-1) return markov3DPred;
  if (fractalPred!==-1) return fractalPred;
  if (vip11Pred!==-1) return vip11Pred;
  if (tensorPred!==-1) return tensorPred;
  if (poissonPred!==-1) return poissonPred;
  if (elliotWavePred!==-1) return elliotWavePred;
  if (clusterPred!==-1) return clusterPred;
  if (quantumPred!==-1) return quantumPred;
  if (vipViLongPred!==-1) return vipViLongPred;
  if (flashPred!==-1) return flashPred;

  const isPingPong = pStr.startsWith('1010') || pStr.startsWith('0101');
  if (curStreak>=3) return h[0];
  if (isPingPong) return h[0]===1?0:1;
  return h[0];
}

// ============================================================
// THUẬT TOÁN 3: SCORE-BASED (từ function predict.txt)
// ============================================================
function scoreBasedPredict(history, sumHistory) {
  if (history.length < 5) {
    const last = history[history.length-1];
    if (last===undefined) return {result:'TÀI',percent:50};
    return {result: last==='TÀI'?'XỈU':'TÀI', percent:52};
  }
  let score = 0;
  const last = history[history.length-1];

  // MARKOV
  const markov = {TT:0,TX:0,XX:0,XT:0};
  for (let i=1;i<history.length;i++) {
    const p = history[i-1], c = history[i];
    if (p==='TÀI'&&c==='TÀI') markov.TT++;
    else if (p==='TÀI'&&c==='XỈU') markov.TX++;
    else if (p==='XỈU'&&c==='XỈU') markov.XX++;
    else if (p==='XỈU'&&c==='TÀI') markov.XT++;
  }
  if (last==='TÀI') {
    const tot = markov.TT+markov.TX;
    if (tot>0) score += (0.5-markov.TT/tot)*1.5;
  } else {
    const tot = markov.XX+markov.XT;
    if (tot>0) score += (markov.XT/tot-0.5)*1.5;
  }

  // PATTERN 2-5
  const p2={},p3={},p4={},p5={};
  for (let i=2;i<=history.length;i++) {
    const h = history[i-1];
    const bit = h==='TÀI'?'T':'X';
    const k2 = history.slice(i-2,i).join('');
    if (!p2[k2]) p2[k2]={T:0,X:0}; p2[k2][bit]++;
    if (i>=3) { const k3=history.slice(i-3,i).join(''); if(!p3[k3])p3[k3]={T:0,X:0}; p3[k3][bit]++; }
    if (i>=4) { const k4=history.slice(i-4,i).join(''); if(!p4[k4])p4[k4]={T:0,X:0}; p4[k4][bit]++; }
    if (i>=5) { const k5=history.slice(i-5,i).join(''); if(!p5[k5])p5[k5]={T:0,X:0}; p5[k5][bit]++; }
  }
  const applyP = (m,k,w)=>{ if(m[k]){const t=m[k].T||0,x=m[k].X||0,tt=t+x; if(tt>0)score+=((x-t)/tt)*w;} };
  if (history.length>=2) applyP(p2, history.slice(-2).join(''), 1.3);
  if (history.length>=3) applyP(p3, history.slice(-3).join(''), 1.6);
  if (history.length>=4) applyP(p4, history.slice(-4).join(''), 1.1);
  if (history.length>=5) applyP(p5, history.slice(-5).join(''), 1.0);

  // AVG 5
  if (sumHistory.length>=5) {
    const a5 = sumHistory.slice(-5).reduce((a,b)=>a+b,0)/5;
    if (a5>10.5) score += 0.8; else if (a5<9.5) score -= 0.8;
  }
  // AVG 10 + STD
  if (sumHistory.length>=10) {
    const a10 = sumHistory.slice(-10).reduce((a,b)=>a+b,0)/10;
    if (a10>10.8) score += 0.6; else if (a10<9.2) score -= 0.6;
    const v = sumHistory.slice(-10).reduce((acc,val)=>acc+(val-a10)**2,0)/10;
    if (Math.sqrt(v)>3.5) score *= 0.9;
  }

  // STREAK
  let streak=1;
  for (let i=history.length-1;i>0;i--) {
    if (history[i]===history[i-1]) streak++; else break;
  }
  if (streak>=2) score += (last==='TÀI'?-1.2:1.2)*Math.min(streak,5)*0.5;

  // ZIGZAG
  if (history.length>=10) {
    let zz=true;
    for (let i=1;i<=7;i++) {
      if (history[history.length-i]===history[history.length-i-1]) { zz=false; break; }
    }
    if (zz) score += last==='TÀI'?1.0:-1.0;
  }

  // PHÂN BỐ 10
  const l10 = history.slice(-10);
  const t10 = l10.filter(x=>x==='TÀI').length;
  const x10 = l10.filter(x=>x==='XỈU').length;
  if (t10>=7) score -= 1.5;
  if (x10>=7) score += 1.5;

  const finalResult = score>=0 ? 'TÀI' : 'XỈU';
  let percent = 55 + Math.min(Math.abs(score)*4.0, 30);
  percent = Math.round(Math.min(85, percent));
  return {result: finalResult, percent};
}

// ============================================================
// THUẬT TOÁN 4: PATTERN DICT (từ thuattoan.js)
// ============================================================
function patternDictPredict(history) {
  if (!history.length) return {prediction:null,confidence:0,matched:null};
  const bits = history.map(s=>s.ket_qua==="Tài"?"T":"X");
  const str = bits.slice().reverse().join('');
  const keys = Object.keys(PATTERN_DICT).sort((a,b)=>b.length-a.length);
  for (const key of keys) {
    if (str.endsWith(key)) {
      const data = PATTERN_DICT[key];
      return {prediction:data.prediction,confidence:data.confidence,matched:key};
    }
  }
  return {prediction:null,confidence:0,matched:null};
}

// ============================================================
// THUẬT TOÁN 5: SHAPE-BASED (từ ĐÃ GIẢI MÃ HÓA.html - PATTERN SHAPES)
// ============================================================
function shapeBasedPredict(history) {
  if (history.length < 10) return {prediction:null,confidence:0,shape:null};
  const seq = history.map(s=>s.ket_qua==="Tài"?"T":"X"); // mới -> cũ
  // Đảo thành cũ -> mới cho matchShape
  const seqOldFirst = seq.slice().reverse();
  let best = null;
  for (const shape of SHAPES) {
    const m = matchShape(seqOldFirst, shape);
    if (m && (!best || m.cycles > best.cycles)) {
      best = {pick: m.pick, cycles: m.cycles, shape: shape.join('-'), s: m.s};
    }
  }
  if (best && best.cycles >= 2) {
    return {
      prediction: best.pick==='T'?'Tài':'Xỉu',
      confidence: Math.round(best.s * 100),
      shape: best.shape,
      cycles: best.cycles
    };
  }
  return {prediction:null,confidence:0,shape:null};
}

// ============================================================
// THUẬT TOÁN 6: CORE BRAINS (40+ từ ĐÃ GIẢI MÃ HÓA.html)
// ============================================================
function cyc(s, pat) {
  const r = rle(s), L = pat.length;
  if (r.length < Math.max(3, L+1)) return null;
  const cur = r[r.length-1];
  const look = Math.min(r.length-1, Math.max(L*2, 4));
  for (let phase=0; phase<L; phase++) {
    const wantCur = pat[phase];
    if (cur.n > wantCur+1) continue;
    let hit = 0;
    for (let j=1; j<=look; j++) {
      const idx = r.length-1-j;
      const want = pat[(phase-(j%L)+L)%L];
      if (r[idx].n !== want) break;
      hit++;
    }
    if (hit >= Math.max(2, L)) {
      const conf = 0.68 + Math.min(0.18, hit*0.025);
      return cur.n < wantCur ? {pick:cur.v, s:conf} : {pick:opp(cur.v), s:conf};
    }
  }
  return null;
}

function markovCore(s, o) {
  if (s.length < o+12) return null;
  const k = s.slice(-o).join('');
  const m = {T:0, X:0};
  for (let i=0;i+o<s.length;i++) {
    if (s.slice(i,i+o).join('')===k) m[s[i+o]]++;
  }
  const n = m.T+m.X;
  if (n<4) return null;
  if (m.T===m.X) return null;
  return P(m.T>m.X?'T':'X', 0.5+Math.abs(m.T-m.X)/(2*n));
}

function ngramCore(s, o) {
  if (s.length < o+15) return null;
  const k = s.slice(-o).join('');
  const m = {T:0, X:0};
  for (let i=0;i+o<s.length;i++) {
    if (s.slice(i,i+o).join('')===k) m[s[i+o]]++;
  }
  const n = m.T+m.X;
  if (n<3 || m.T===m.X) return null;
  return P(m.T>m.X?'T':'X', 0.55+Math.abs(m.T-m.X)/(2*n));
}

const CORES = {
  bet_streak: s => {
    const r = rle(s), l = r[r.length-1];
    if (!l || l.n < 3) return null;
    if (l.n >= 8) return P(opp(l.v), 0.62);
    return P(l.v, 0.55 + Math.min(0.22, l.n*0.045));
  },
  cau_1_1: s => {
    let c=0;
    for (let i=s.length-1;i>0 && s[i]!==s[i-1];i--) c++;
    if (c<3) return null;
    return P(opp(s[s.length-1]), 0.58+Math.min(0.2, c*0.03));
  },
  cau_2_2: s => cyc(s, [2,2]),
  cau_3_3: s => cyc(s, [3,3]),
  cau_2_1: s => cyc(s, [2,1]),
  cau_1_2: s => cyc(s, [1,2]),
  cau_3_1: s => cyc(s, [3,1]),
  cau_1_3: s => cyc(s, [1,3]),
  cau_2_1_2: s => cyc(s, [2,1,2]),
  cau_3_1_3: s => cyc(s, [3,1,3]),
  cau_1_2_1: s => cyc(s, [1,2,1]),
  cau_4_1: s => cyc(s, [4,1]),
  cau_1_1_2: s => cyc(s, [1,1,2]),
  cau_2_2_1: s => cyc(s, [2,2,1]),
  markov1: s => markovCore(s, 1),
  markov2: s => markovCore(s, 2),
  markov3: s => markovCore(s, 3),
  ngram4: s => ngramCore(s, 4),
  ngram5: s => ngramCore(s, 5),
  ngram6: s => ngramCore(s, 6),
  frequency: s => {
    const w = s.slice(-30), t = w.filter(x=>x==='T').length;
    const d = t/(w.length||1)-0.5;
    if (Math.abs(d)<0.08) return null;
    return P(d>0?'X':'T', 0.52+Math.min(0.2, Math.abs(d)));
  },
  momentum: s => {
    const a = s.slice(-8).filter(x=>x==='T').length/8;
    const b = s.slice(-20,-8).filter(x=>x==='T').length/12;
    if (Math.abs(a-b)<0.12) return null;
    return P(a>b?'T':'X', 0.53+Math.abs(a-b)*0.4);
  },
  mean_reversion: s => {
    const w = s.slice(-50); if (w.length<20) return null;
    const t = w.filter(x=>x==='T').length/w.length;
    if (t>0.62) return P('X', 0.6);
    if (t<0.38) return P('T', 0.6);
    return null;
  },
  bollinger: s => {
    const w = s.slice(-40); if (w.length<25) return null;
    const v = w.map(x=>x==='T'?1:0);
    const m = v.reduce((a,b)=>a+b,0)/v.length;
    const sd = Math.sqrt(v.reduce((a,b)=>a+(b-m)*(b-m),0)/v.length)||0.01;
    const lastM = v.slice(-6).reduce((a,b)=>a+b,0)/6;
    if (lastM>m+sd) return P('X', 0.62);
    if (lastM<m-sd) return P('T', 0.62);
    return null;
  },
  rsi: s => {
    const w = s.slice(-14); if (w.length<14) return null;
    const r = 100*w.filter(x=>x==='T').length/14;
    if (r>=72) return P('X', 0.63);
    if (r<=28) return P('T', 0.63);
    return null;
  },
  parity: s => {
    const r = rle(s).slice(-10); if (r.length<6) return null;
    const evens = r.filter(x=>x.n%2===0).length;
    const cur = r[r.length-1];
    if (evens>=r.length-2) return cur.n%2===1 ? P(cur.v, 0.6) : P(opp(cur.v), 0.6);
    return null;
  },
  poisson: s => {
    const r = rle(s); if (r.length<8) return null;
    const av = r.slice(-12).reduce((a,b)=>a+b.n,0)/Math.min(12, r.length);
    const cur = r[r.length-1];
    return cur.n >= av+1 ? P(opp(cur.v), 0.58) : P(cur.v, 0.54);
  },
  entropy_gate: s => {
    const w = s.slice(-24); if (w.length<24) return null;
    let flips=0;
    for (let i=1;i<w.length;i++) if (w[i]!==w[i-1]) flips++;
    const e = flips/(w.length-1);
    if (e>0.72) return P(opp(w[w.length-1]), 0.6);
    if (e<0.28) return P(w[w.length-1], 0.6);
    return null;
  },
  fibonacci: s => {
    const r = rle(s), fib = [1,2,3,5,8];
    if (r.length<4) return null;
    const l = r[r.length-1];
    return fib.indexOf(l.n)>=0 && l.n>=3 ? P(opp(l.v), 0.57) : null;
  },
  elliott: s => {
    const r = rle(s); if (r.length<8) return null;
    const w = r.slice(-5).map(x=>x.n);
    const up = w[0]<w[2] && w[2]<w[4];
    return up ? P(opp(r[r.length-1].v), 0.6) : null;
  },
  harmonic: s => {
    if (s.length<24) return null;
    for (let p=4;p<=12;p++) {
      let ok = true;
      for (let i=0;i<p*2;i++) {
        if (s[s.length-1-i] !== s[s.length-1-i-p]) { ok=false; break; }
      }
      if (ok) return P(s[s.length-p], 0.66);
    }
    return null;
  },
  mirror: s => {
    if (s.length<20) return null;
    const a = s.slice(-10).join('');
    const b = s.slice(-20,-10).reverse().join('');
    if (a===b) return P(opp(s[s.length-10]), 0.62);
    return null;
  },
  golden: s => {
    const r = rle(s); if (r.length<6) return null;
    const a = r[r.length-2].n, b = r[r.length-1].n;
    if (a>0 && Math.abs(b/a-1.618)<0.25) return P(opp(r[r.length-1].v), 0.58);
    return null;
  },
  anti_bait: s => {
    const r = rle(s); if (r.length<5) return null;
    const l3 = r.slice(-3).map(x=>x.n).join('');
    if (l3==='111' && r.length>=4 && r[r.length-4].n>=4) return P(r[r.length-4].v, 0.64);
    return null;
  },
  smart_breaker: s => {
    const r = rle(s), l = r[r.length-1];
    if (!l) return null;
    const av = r.slice(-15).reduce((a,b)=>a+b.n,0)/Math.min(15, r.length);
    if (l.n >= Math.max(4, av*2)) return P(opp(l.v), 0.68);
    return null;
  },
  contrarian: s => {
    const w = s.slice(-6); if (w.length<6) return null;
    const t = w.filter(x=>x==='T').length;
    if (t>=5) return P('X', 0.6);
    if (t<=1) return P('T', 0.6);
    return null;
  },
  shadow: s => {
    if (s.length<16) return null;
    const a = s.slice(-8).join('');
    let best = null;
    for (let i=0;i+8<s.length-8;i++) {
      if (s.slice(i,i+8).join('')===a) best = s[i+8];
    }
    return best ? P(best, 0.63) : null;
  },
  total_extreme: (s, t) => {
    if (!t.length) return null;
    const l = t[t.length-1];
    if (l>=16) return P('X', 0.6);
    if (l<=5) return P('T', 0.6);
    return null;
  },
  total_pivot: (s, t) => {
    if (t.length<12) return null;
    const m = avg(t.slice(-12));
    if (m>11.6) return P('X', 0.56);
    if (m<9.4) return P('T', 0.56);
    return null;
  },
  bayes: s => {
    if (s.length<30) return null;
    const pri = s.filter(x=>x==='T').length/s.length;
    const k2 = s.slice(-2).join('');
    const m = {T:1, X:1};
    for (let i=0;i+2<s.length;i++) {
      if (s.slice(i,i+2).join('')===k2) m[s[i+2]]++;
    }
    const pt = pri*m.T, px = (1-pri)*m.X, z = pt+px;
    return P(pt>px?'T':'X', 0.5+Math.abs(pt-px)/(2*z));
  },
  quantum: s => {
    const r = rle(s); if (r.length<10) return null;
    const s1 = r.slice(-3).reduce((a,b)=>a+b.n,0);
    const s2 = r.slice(-6,-3).reduce((a,b)=>a+b.n,0);
    if (s1===s2) return P(opp(r[r.length-1].v), 0.6);
    return null;
  },
  consensus_last: s => {
    const f = [5,10,20].map(n => {
      const w = s.slice(-n); if (w.length<n) return 0;
      const t = w.filter(x=>x==='T').length/n;
      return t>0.55?1:(t<0.45?-1:0);
    });
    const z = f[0]+f[1]+f[2];
    if (Math.abs(z)<2) return null;
    return P(z>0?'T':'X', 0.55+Math.abs(z)*0.03);
  }
};

// Chạy tất cả CORES và trả về pick từ consensus
function runAllCores(seq, totals) {
  const results = [];
  for (const [name, fn] of Object.entries(CORES)) {
    try {
      const out = fn(seq, totals);
      if (out && out.p) {
        results.push({name, pick: out.p, s: out.s, probT: out.p==='T'?out.s:1-out.s});
      }
    } catch(e) {}
  }
  if (!results.length) return null;
  // Vote có trọng số theo độ mạnh
  let scoreT = 0, scoreX = 0, totalW = 0;
  for (const r of results) {
    const w = r.s;
    if (r.pick==='T') scoreT += w; else scoreX += w;
    totalW += w;
  }
  const pick = scoreT >= scoreX ? 'T' : 'X';
  const raw = Math.max(scoreT, scoreX) / (totalW || 1);
  // raw 0.5..1 → conf 51..88
  let conf = Math.round(51 + (raw - 0.5) * 74);
  // Agreement bonus
  const agree = results.filter(r=>r.pick===pick).length;
  if (agree >= results.length * 0.7) conf += 4;
  conf = Math.max(51, Math.min(92, conf));
  return {prediction: pick==='T'?'Tài':'Xỉu', confidence: conf, cores: results.length, agree};
}

// ============================================================
// FUSION TỔNG - KẾT HỢP TẤT CẢ
// ============================================================
function finalPredict(history) {
  if (!history.length) return {prediction:"Tài", confidence:50};

  const hBits = history.map(s=>s.ket_qua==="Tài"?1:0);
  const hNames = history.map(s=>s.ket_qua==="Tài"?"TÀI":"XỈU");
  const hNamesOldFirst = [...hNames].reverse();
  const sumHistoryOldFirst = history.map(s=>s.tong).reverse();
  const seq = history.map(s=>s.ket_qua==="Tài"?"T":"X"); // mới -> cũ
  const totals = history.map(s=>s.tong);

  // 1. Pattern-based (sun.win.py)
  const rPattern = patternBasedPredict(history);

  // 2. Super Vi Long 15 tầng
  const rSuper = superViLongAlgorithm(hBits, history);
  const superPick = rSuper === -1 ? null : (rSuper === 1 ? "Tài" : "Xỉu");

  // 3. Score-based
  const rScore = scoreBasedPredict(hNamesOldFirst, sumHistoryOldFirst);
  const scorePick = rScore.result === "TÀI" ? "Tài" : "Xỉu";

  // 4. Pattern Dict
  const rDict = patternDictPredict(history);

  // 5. Shape-based
  const rShape = shapeBasedPredict(history);

  // 6. Core Brains (40+)
  const rCores = runAllCores(seq, totals);

  // ===== VOTING =====
  const votes = {Tài: 0, Xỉu: 0};
  const confs = [];
  const addVote = (pick, conf, weight, name) => {
    if (!pick) return;
    votes[pick] += weight;
    confs.push({pred: pick, conf, weight, name});
  };

  addVote(rPattern.prediction, rPattern.confidence, 1.0, "pattern");
  addVote(superPick, 75, 1.5, "superViLong");
  addVote(scorePick, rScore.percent, 1.2, "score");
  if (rDict.prediction) {
    const dw = 1.2 + (rDict.confidence/100)*1.3;
    addVote(rDict.prediction, rDict.confidence, dw, "dict");
  }
  if (rShape.prediction) {
    const sw = 1.3 + (rShape.cycles-2)*0.4;
    addVote(rShape.prediction, rShape.confidence, sw, "shape");
  }
  if (rCores) {
    const cw = 1.4 + (rCores.agree/Math.max(1,rCores.cores))*0.6;
    addVote(rCores.prediction, rCores.confidence, cw, "cores");
  }

  const finalPrediction = votes["Tài"] >= votes["Xỉu"] ? "Tài" : "Xỉu";

  // Confidence trung bình có trọng số
  let totW = 0, wConf = 0;
  for (const c of confs) { wConf += c.conf*c.weight; totW += c.weight; }
  let finalConfidence = totW>0 ? wConf/totW : 55;

  // Agreement bonus
  const agree = confs.filter(c=>c.pred===finalPrediction).length;
  if (agree >= 6) finalConfidence = Math.min(97, finalConfidence+12);
  else if (agree >= 5) finalConfidence = Math.min(94, finalConfidence+9);
  else if (agree >= 4) finalConfidence = Math.min(90, finalConfidence+6);
  else if (agree >= 3) finalConfidence = Math.min(85, finalConfidence+3);

  finalConfidence = Math.round(Math.max(50, Math.min(98, finalConfidence)));

  return {
    prediction: finalPrediction,
    confidence: finalConfidence,
    details: {
      pattern: rPattern.prediction,
      superViLong: superPick,
      scoreBased: scorePick,
      patternDict: rDict.prediction,
      dictMatched: rDict.matched,
      shapeBased: rShape.prediction,
      shapeMatched: rShape.shape,
      cores: rCores ? rCores.prediction : null,
      coresCount: rCores ? rCores.cores : 0,
      coresAgree: rCores ? rCores.agree : 0,
      votes: {Tài: +votes["Tài"].toFixed(2), Xỉu: +votes["Xỉu"].toFixed(2)}
    }
  };
}

// ============================================================
// CACHE & FETCH
// ============================================================
let cache = {history: [], lastFetch: 0};

async function fetchHistory() {
  try {
    const res = await fetch(HISTORY_API_URL, {
      headers: {"User-Agent": "Mozilla/5.0", "Accept": "application/json"},
      timeout: 10000
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.status !== "OK" || !Array.isArray(json.data)) throw new Error("Invalid data format");

    const mapped = json.data.map(item => ({
      phien: item["phiên"],
      xuc_xac_1: item.d1,
      xuc_xac_2: item.d2,
      xuc_xac_3: item.d3,
      tong: item["tổng"],
      ket_qua: item["kết quả"],
      timestamp: item.updatedAt
    }));

    cache.history = mapped;
    cache.lastFetch = Date.now();
    return cache.history;
  } catch (e) {
    console.error("Fetch error:", e.message);
    return cache.history;
  }
}

async function getHistory(force = false) {
  const now = Date.now();
  if (force || now - cache.lastFetch > CACHE_TTL || !cache.history.length) {
    await fetchHistory();
  }
  return cache.history;
}

// ============================================================
// ROUTES
// ============================================================
app.get('/api/sun', async (req, res) => {
  try {
    const history = await getHistory();
    if (!history.length) return res.status(503).json({error: "No data"});
    const last = history[0];
    const pred = finalPredict(history);
    res.json({
      phien: last.phien,
      xuc_xac_1: last.xuc_xac_1,
      xuc_xac_2: last.xuc_xac_2,
      xuc_xac_3: last.xuc_xac_3,
      tong: last.tong,
      ket_qua: last.ket_qua,
      phien_hien_tai: last.phien + 1,
      du_doan: pred.prediction,
      do_tin_cay: pred.confidence,
      adm: "Duy Bảo"
    });
  } catch (e) {
    res.status(500).json({error: e.message});
  }
});

app.get('/api/detail', async (req, res) => {
  try {
    const history = await getHistory();
    if (!history.length) return res.status(503).json({error: "No data"});
    res.json(finalPredict(history));
  } catch (e) {
    res.status(500).json({error: e.message});
  }
});

app.get('/api/history', async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const history = await getHistory();
  res.json({count: Math.min(limit, history.length), data: history.slice(0, limit)});
});

app.get('/api/stats', async (req, res) => {
  const history = await getHistory();
  const last20 = history.slice(0, 20);
  const tai = last20.filter(s => s.ket_qua === "Tài").length;
  const xiu = last20.length - tai;
  let streak = 0, streakResult = null;
  if (history.length) {
    streakResult = history[0].ket_qua;
    for (const s of history) { if (s.ket_qua === streakResult) streak++; else break; }
  }
  res.json({
    total: history.length, tai, xiu,
    tai_percent: ((tai / last20.length) * 100).toFixed(1),
    xiu_percent: ((xiu / last20.length) * 100).toFixed(1),
    streak: {result: streakResult, count: streak},
    last_phien: history[0]?.phien
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: "online",
    uptime: process.uptime(),
    cached: cache.history.length,
    last_fetch: cache.lastFetch ? new Date(cache.lastFetch).toISOString() : null
  });
});

app.get('/', (req, res) => {
  res.json({
    name: "SunWin Predict API - Full Fusion",
    adm: "Duy Bảo",
    endpoints: {
      predict: "/api/sun",
      detail: "/api/detail",
      history: "/api/history?limit=50",
      stats: "/api/stats",
      health: "/api/health"
    },
    algorithms: [
      "Pattern-based (sun.win.py)",
      "SuperViLong 15 tầng",
      "Score-based",
      "Pattern Dictionary (250+ mẫu)",
      "Shape-based (30+ khuôn cầu)",
      "Core Brains (40+ lõi)"
    ]
  });
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running on port ${PORT}`);
  const h = await getHistory(true);
  console.log(`Loaded ${h.length} sessions`);
  if (h.length) {
    const pred = finalPredict(h);
    console.log(`Prediction: ${pred.prediction} (${pred.confidence}%)`);
    console.log(`Details:`, JSON.stringify(pred.details, null, 2));
  }
});
