const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const HISTORY_API_URL = "https://kwinstore.com/sunwin/tx/history/6510962597fde7c34586236827167b434fc246af9b55777c";
const CACHE_TTL = 5000;

// ==================== PATTERN DICTIONARY (MỚI) ====================
const PATTERN_DICT = {
    "TXT": { "prediction": "Xỉu", "confidence": 68 },
    "TTXX": { "prediction": "Tài", "confidence": 87 },
    "XXTXX": { "prediction": "Tài", "confidence": 59 },
    "TTX": { "prediction": "Xỉu", "confidence": 73 },
    "XTT": { "prediction": "Tài", "confidence": 92 },
    "TXX": { "prediction": "Tài", "confidence": 55 },
    "XTX": { "prediction": "Xỉu", "confidence": 81 },
    "TXTX": { "prediction": "Tài", "confidence": 64 },
    "XTXX": { "prediction": "Tài", "confidence": 77 },
    "XXTX": { "prediction": "Tài", "confidence": 96 },
    "TXTT": { "prediction": "Xỉu", "confidence": 71 },
    "TTT": { "prediction": "Tài", "confidence": 83 },
    "XXX": { "prediction": "Tài", "confidence": 52 },
    "TXXT": { "prediction": "Tài", "confidence": 94 },
    "XTXT": { "prediction": "Xỉu", "confidence": 63 },
    "XXTT": { "prediction": "Tài", "confidence": 79 },
    "XTTX": { "prediction": "Tài", "confidence": 88 },
    "XTXTX": { "prediction": "Tài", "confidence": 75 },
    "TTXXX": { "prediction": "Tài", "confidence": 61 },
    "XTTXT": { "prediction": "Tài", "confidence": 69 },
    "XXTXT": { "prediction": "Xỉu", "confidence": 84 },
    "TXTTX": { "prediction": "Tài", "confidence": 53 },
    "XTXXT": { "prediction": "Tài", "confidence": 91 },
    "TTTXX": { "prediction": "Xỉu", "confidence": 72 },
    "XXTTT": { "prediction": "Tài", "confidence": 65 },
    "XTXTT": { "prediction": "Tài", "confidence": 97 },
    "TXTXT": { "prediction": "Tài", "confidence": 56 },
    "TTXTX": { "prediction": "Xỉu", "confidence": 78 },
    "TXTTT": { "prediction": "Xỉu", "confidence": 62 },
    "XXTXTX": { "prediction": "Tài", "confidence": 85 },
    "XTXXTX": { "prediction": "Tài", "confidence": 74 },
    "TXTTTX": { "prediction": "Tài", "confidence": 66 },
    "TTTTXX": { "prediction": "Xỉu", "confidence": 89 },
    "XTXTTX": { "prediction": "Tài", "confidence": 51 },
    "XTXXTT": { "prediction": "Tài", "confidence": 82 },
    "TXXTXX": { "prediction": "Tài", "confidence": 93 },
    "XXTXXT": { "prediction": "Tài", "confidence": 76 },
    "TXTTXX": { "prediction": "Xỉu", "confidence": 67 },
    "TTTXTX": { "prediction": "Xỉu", "confidence": 58 },
    "TTXTTT": { "prediction": "Tài", "confidence": 95 },
    "TXXTTX": { "prediction": "Tài", "confidence": 54 },
    "XXTTTX": { "prediction": "Tài", "confidence": 86 },
    "XTTTTX": { "prediction": "Xỉu", "confidence": 70 },
    "TXTXTT": { "prediction": "Tài", "confidence": 60 },
    "TXTXTX": { "prediction": "Tài", "confidence": 80 },
    "TTTTX": { "prediction": "Tài", "confidence": 90 },
    "XXXTX": { "prediction": "Tài", "confidence": 84 },
    "XTXXXT": { "prediction": "Tài", "confidence": 67 },
    "XXTTXX": { "prediction": "Tài", "confidence": 79 },
    "TTTXXT": { "prediction": "Xỉu", "confidence": 62 },
    "XXTXXX": { "prediction": "Tài", "confidence": 91 },
    "XTXTXT": { "prediction": "Tài", "confidence": 55 },
    "TTXXTX": { "prediction": "Tài", "confidence": 88 },
    "TTXXT": { "prediction": "Tài", "confidence": 77 },
    "TXXTX": { "prediction": "Xỉu", "confidence": 69 },
    "XTXXX": { "prediction": "Tài", "confidence": 83 },
    "TTXT": { "prediction": "Xỉu", "confidence": 61 },
    "TTTXT": { "prediction": "Xỉu", "confidence": 75 },
    "TTTT": { "prediction": "Tài", "confidence": 94 },
    "TTTTT": { "prediction": "Tài", "confidence": 57 },
    "TTTTTT": { "prediction": "Xỉu", "confidence": 86 },
    "TTTTTTT": { "prediction": "Tài", "confidence": 65 },
    "TTTTTTX": { "prediction": "Xỉu", "confidence": 78 },
    "TTTTTX": { "prediction": "Xỉu", "confidence": 53 },
    "TTTTTXT": { "prediction": "Xỉu", "confidence": 89 },
    "TTTTTXX": { "prediction": "Tài", "confidence": 70 },
    "TTTTXT": { "prediction": "Xỉu", "confidence": 81 },
    "TTTTXTT": { "prediction": "Tài", "confidence": 63 },
    "TTTTXTX": { "prediction": "Xỉu", "confidence": 92 },
    "TTTTXXT": { "prediction": "Xỉu", "confidence": 56 },
    "TTTTXXX": { "prediction": "Tài", "confidence": 85 },
    "TTTX": { "prediction": "Xỉu", "confidence": 74 },
    "TTTXTT": { "prediction": "Tài", "confidence": 66 },
    "TTTXTTT": { "prediction": "Xỉu", "confidence": 97 },
    "TTTXTTX": { "prediction": "Xỉu", "confidence": 59 },
    "TTTXTXT": { "prediction": "Tài", "confidence": 82 },
    "TTTXTXX": { "prediction": "Tài", "confidence": 71 },
    "TTTXXTT": { "prediction": "Tài", "confidence": 60 },
    "TTTXXTX": { "prediction": "Tài", "confidence": 90 },
    "TTTXXX": { "prediction": "Xỉu", "confidence": 64 },
    "TTTXXXT": { "prediction": "Tài", "confidence": 87 },
    "TTTXXXX": { "prediction": "Xỉu", "confidence": 76 },
    "TTXTT": { "prediction": "Xỉu", "confidence": 93 },
    "TTXTTTT": { "prediction": "Xỉu", "confidence": 68 },
    "TTXTTTX": { "prediction": "Xỉu", "confidence": 80 },
    "TTXTTX": { "prediction": "Tài", "confidence": 58 },
    "TTXTTXT": { "prediction": "Tài", "confidence": 95 },
    "TTXTTXX": { "prediction": "Xỉu", "confidence": 54 },
    "TTXTXT": { "prediction": "Xỉu", "confidence": 83 },
    "TTXTXTT": { "prediction": "Tài", "confidence": 72 },
    "TTXTXTX": { "prediction": "Tài", "confidence": 61 },
    "TTXTXX": { "prediction": "Xỉu", "confidence": 89 },
    "TTXTXXT": { "prediction": "Tài", "confidence": 70 },
    "TTXTXXX": { "prediction": "Xỉu", "confidence": 79 },
    "TTXXTT": { "prediction": "Tài", "confidence": 57 },
    "TTXXTTT": { "prediction": "Xỉu", "confidence": 84 },
    "TTXXTTX": { "prediction": "Tài", "confidence": 67 },
    "TTXXTXT": { "prediction": "Tài", "confidence": 96 },
    "TTXXTXX": { "prediction": "Xỉu", "confidence": 51 },
    "TTXXXT": { "prediction": "Xỉu", "confidence": 75 },
    "TTXXXTT": { "prediction": "Tài", "confidence": 62 },
    "TTXXXTX": { "prediction": "Tài", "confidence": 91 },
    "TTXXXX": { "prediction": "Xỉu", "confidence": 73 },
    "TTXXXXT": { "prediction": "Tài", "confidence": 82 },
    "TTXXXXX": { "prediction": "Xỉu", "confidence": 66 },
    "TXTTTT": { "prediction": "Xỉu", "confidence": 94 },
    "TXTTTTT": { "prediction": "Xỉu", "confidence": 59 },
    "TXTTTTX": { "prediction": "Xỉu", "confidence": 85 },
    "TXTTTXT": { "prediction": "Xỉu", "confidence": 77 },
    "TXTTTXX": { "prediction": "Tài", "confidence": 68 },
    "TXTTXT": { "prediction": "Tài", "confidence": 86 },
    "TXTTXTT": { "prediction": "Tài", "confidence": 55 },
    "TXTTXTX": { "prediction": "Tài", "confidence": 74 },
    "TXTTXXT": { "prediction": "Tài", "confidence": 92 },
    "TXTTXXX": { "prediction": "Tài", "confidence": 63 },
    "TXTXTTT": { "prediction": "Tài", "confidence": 81 },
    "TXTXTTX": { "prediction": "Tài", "confidence": 70 },
    "TXTXTXT": { "prediction": "Xỉu", "confidence": 89 },
    "TXTXTXX": { "prediction": "Tài", "confidence": 58 },
    "TXTXX": { "prediction": "Tài", "confidence": 97 },
    "TXTXXT": { "prediction": "Tài", "confidence": 64 },
    "TXTXXTT": { "prediction": "Tài", "confidence": 83 },
    "TXTXXTX": { "prediction": "Xỉu", "confidence": 72 },
    "TXTXXX": { "prediction": "Xỉu", "confidence": 61 },
    "TXTXXXT": { "prediction": "Xỉu", "confidence": 90 },
    "TXTXXXX": { "prediction": "Xỉu", "confidence": 53 },
    "TXXTT": { "prediction": "Tài", "confidence": 87 },
    "TXXTTT": { "prediction": "Tài", "confidence": 76 },
    "TXXTTTT": { "prediction": "Tài", "confidence": 65 },
    "TXXTTTX": { "prediction": "Tài", "confidence": 54 },
    "TXXTTXT": { "prediction": "Xỉu", "confidence": 93 },
    "TXXTTXX": { "prediction": "Xỉu", "confidence": 82 },
    "TXXTXT": { "prediction": "Tài", "confidence": 71 },
    "TXXTXTT": { "prediction": "Tài", "confidence": 60 },
    "TXXTXTX": { "prediction": "Tài", "confidence": 95 },
    "TXXTXXT": { "prediction": "Tài", "confidence": 84 },
    "TXXTXXX": { "prediction": "Xỉu", "confidence": 73 },
    "TXXX": { "prediction": "Tài", "confidence": 62 },
    "TXXXT": { "prediction": "Tài", "confidence": 91 },
    "TXXXTT": { "prediction": "Xỉu", "confidence": 57 },
    "TXXXTTT": { "prediction": "Tài", "confidence": 86 },
    "TXXXTTX": { "prediction": "Xỉu", "confidence": 75 },
    "TXXXTX": { "prediction": "Xỉu", "confidence": 64 },
    "TXXXTXT": { "prediction": "Tài", "confidence": 97 },
    "TXXXTXX": { "prediction": "Xỉu", "confidence": 66 },
    "TXXXX": { "prediction": "Xỉu", "confidence": 85 },
    "TXXXXT": { "prediction": "Tài", "confidence": 74 },
    "TXXXXTT": { "prediction": "Xỉu", "confidence": 63 },
    "TXXXXTX": { "prediction": "Xỉu", "confidence": 92 },
    "TXXXXX": { "prediction": "Tài", "confidence": 51 },
    "TXXXXXT": { "prediction": "Xỉu", "confidence": 80 },
    "TXXXXXX": { "prediction": "Xỉu", "confidence": 69 },
    "XTTT": { "prediction": "Xỉu", "confidence": 88 },
    "XTTTT": { "prediction": "Xỉu", "confidence": 77 },
    "XTTTTT": { "prediction": "Tài", "confidence": 56 },
    "XTTTTTT": { "prediction": "Tài", "confidence": 95 },
    "XTTTTTX": { "prediction": "Tài", "confidence": 64 },
    "XTTTTXT": { "prediction": "Tài", "confidence": 83 },
    "XTTTTXX": { "prediction": "Xỉu", "confidence": 72 },
    "XTTTX": { "prediction": "Tài", "confidence": 61 },
    "XTTTXT": { "prediction": "Xỉu", "confidence": 90 },
    "XTTTXTT": { "prediction": "Tài", "confidence": 59 },
    "XTTTXTX": { "prediction": "Xỉu", "confidence": 78 },
    "XTTTXX": { "prediction": "Tài", "confidence": 87 },
    "XTTTXXT": { "prediction": "Tài", "confidence": 66 },
    "XTTTXXX": { "prediction": "Tài", "confidence": 55 },
    "XTTXTT": { "prediction": "Tài", "confidence": 94 },
    "XTTXTTT": { "prediction": "Tài", "confidence": 73 },
    "XTTXTTX": { "prediction": "Tài", "confidence": 82 },
    "XTTXTX": { "prediction": "Xỉu", "confidence": 71 },
    "XTTXTXT": { "prediction": "Tài", "confidence": 60 },
    "XTTXTXX": { "prediction": "Xỉu", "confidence": 89 },
    "XTTXX": { "prediction": "Xỉu", "confidence": 58 },
    "XTTXXT": { "prediction": "Xỉu", "confidence": 97 },
    "XTTXXTT": { "prediction": "Tài", "confidence": 76 },
    "XTTXXTX": { "prediction": "Xỉu", "confidence": 65 },
    "XTTXXX": { "prediction": "Tài", "confidence": 84 },
    "XTTXXXT": { "prediction": "Xỉu", "confidence": 53 },
    "XTTXXXX": { "prediction": "Tài", "confidence": 92 },
    "XTXTTT": { "prediction": "Tài", "confidence": 81 },
    "XTXTTTT": { "prediction": "Tài", "confidence": 70 },
    "XTXTTTX": { "prediction": "Xỉu", "confidence": 99 },
    "XTXTTXT": { "prediction": "Xỉu", "confidence": 68 },
    "XTXTTXX": { "prediction": "Tài", "confidence": 87 },
    "XTXTXTT": { "prediction": "Tài", "confidence": 56 },
    "XTXTXTX": { "prediction": "Xỉu", "confidence": 95 },
    "XTXTXX": { "prediction": "Tài", "confidence": 74 },
    "XTXTXXT": { "prediction": "Tài", "confidence": 83 },
    "XTXTXXX": { "prediction": "Tài", "confidence": 62 },
    "XTXXTTT": { "prediction": "Tài", "confidence": 91 },
    "XTXXTTX": { "prediction": "Xỉu", "confidence": 60 },
    "XTXXTXT": { "prediction": "Tài", "confidence": 79 },
    "XTXXTXX": { "prediction": "Tài", "confidence": 68 },
    "XTXXXTT": { "prediction": "Xỉu", "confidence": 97 },
    "XTXXXTX": { "prediction": "Tài", "confidence": 86 },
    "XTXXXX": { "prediction": "Xỉu", "confidence": 75 },
    "XTXXXXT": { "prediction": "Tài", "confidence": 64 },
    "XTXXXXX": { "prediction": "Tài", "confidence": 93 },
    "XXT": { "prediction": "Xỉu", "confidence": 82 },
    "XXTTTT": { "prediction": "Tài", "confidence": 71 },
    "XXTTTTT": { "prediction": "Xỉu", "confidence": 60 },
    "XXTTTTX": { "prediction": "Tài", "confidence": 89 },
    "XXTTTXT": { "prediction": "Xỉu", "confidence": 78 },
    "XXTTTXX": { "prediction": "Xỉu", "confidence": 67 },
    "XXTTX": { "prediction": "Tài", "confidence": 96 },
    "XXTTXT": { "prediction": "Xỉu", "confidence": 55 },
    "XXTTXTT": { "prediction": "Xỉu", "confidence": 94 },
    "XXTTXTX": { "prediction": "Tài", "confidence": 73 },
    "XXTTXXT": { "prediction": "Xỉu", "confidence": 62 },
    "XXTTXXX": { "prediction": "Tài", "confidence": 81 },
    "XXTXTT": { "prediction": "Tài", "confidence": 70 },
    "XXTXTTT": { "prediction": "Tài", "confidence": 99 },
    "XXTXTTX": { "prediction": "Xỉu", "confidence": 58 },
    "XXTXTXT": { "prediction": "Tài", "confidence": 87 },
    "XXTXTXX": { "prediction": "Tài", "confidence": 76 },
    "XXTXXTT": { "prediction": "Xỉu", "confidence": 65 },
    "XXTXXTX": { "prediction": "Xỉu", "confidence": 94 },
    "XXTXXXT": { "prediction": "Tài", "confidence": 83 },
    "XXTXXXX": { "prediction": "Tài", "confidence": 72 },
    "XXXT": { "prediction": "Tài", "confidence": 61 },
    "XXXTT": { "prediction": "Xỉu", "confidence": 90 },
    "XXXTTT": { "prediction": "Xỉu", "confidence": 79 },
    "XXXTTTT": { "prediction": "Xỉu", "confidence": 68 },
    "XXXTTTX": { "prediction": "Xỉu", "confidence": 97 },
    "XXXTTX": { "prediction": "Tài", "confidence": 56 },
    "XXXTTXT": { "prediction": "Xỉu", "confidence": 85 },
    "XXXTTXX": { "prediction": "Xỉu", "confidence": 74 },
    "XXXTXT": { "prediction": "Tài", "confidence": 63 },
    "XXXTXTT": { "prediction": "Tài", "confidence": 92 },
    "XXXTXTX": { "prediction": "Xỉu", "confidence": 51 },
    "XXXTXX": { "prediction": "Tài", "confidence": 80 },
    "XXXTXXT": { "prediction": "Xỉu", "confidence": 69 },
    "XXXTXXX": { "prediction": "Tài", "confidence": 98 },
    "XXXX": { "prediction": "Tài", "confidence": 57 },
    "XXXXT": { "prediction": "Xỉu", "confidence": 86 },
    "XXXXTT": { "prediction": "Xỉu", "confidence": 75 },
    "XXXXTTT": { "prediction": "Tài", "confidence": 64 },
    "XXXXTTX": { "prediction": "Tài", "confidence": 93 },
    "XXXXTX": { "prediction": "Tài", "confidence": 82 },
    "XXXXTXT": { "prediction": "Tài", "confidence": 71 },
    "XXXXTXX": { "prediction": "Tài", "confidence": 60 },
    "XXXXX": { "prediction": "Tài", "confidence": 89 },
    "XXXXXT": { "prediction": "Xỉu", "confidence": 78 },
    "XXXXXTT": { "prediction": "Tài", "confidence": 67 },
    "XXXXXTX": { "prediction": "Tài", "confidence": 96 },
    "XXXXXX": { "prediction": "Tài", "confidence": 55 },
    "XXXXXXT": { "prediction": "Tài", "confidence": 94 },
    "XXXXXXX": { "prediction": "Tài", "confidence": 83 }
};

// ==================== PATTERN DATA (CŨ) ====================
const PATTERN_DATA = {
    "tttt": { tai: 73, xiu: 27 }, "xxxx": { tai: 27, xiu: 73 },
    "tttttt": { tai: 83, xiu: 17 }, "xxxxxx": { tai: 17, xiu: 83 },
    "ttttx": { tai: 40, xiu: 60 }, "xxxxt": { tai: 60, xiu: 40 },
    "ttttttx": { tai: 30, xiu: 70 }, "xxxxxxt": { tai: 70, xiu: 30 },
    "ttxx": { tai: 62, xiu: 38 }, "xxtt": { tai: 38, xiu: 62 },
    "ttxxtt": { tai: 32, xiu: 68 }, "xxttxx": { tai: 68, xiu: 32 },
    "txx": { tai: 60, xiu: 40 }, "xtt": { tai: 40, xiu: 60 },
    "txxtx": { tai: 63, xiu: 37 }, "xttxt": { tai: 37, xiu: 63 },
    "tttxt": { tai: 60, xiu: 40 }, "xxxtx": { tai: 40, xiu: 60 },
    "tttxx": { tai: 60, xiu: 40 }, "xxxtt": { tai: 40, xiu: 60 },
    "txxt": { tai: 60, xiu: 40 }, "xttx": { tai: 40, xiu: 60 },
    "ttxxttx": { tai: 30, xiu: 70 }, "xxttxxt": { tai: 70, xiu: 30 },
    "tttttttt": { tai: 88, xiu: 12 }, "xxxxxxxx": { tai: 12, xiu: 88 },
    "tttttttx": { tai: 25, xiu: 75 }, "xxxxxxxxt": { tai: 75, xiu: 25 },
    "tttttxxx": { tai: 35, xiu: 65 }, "xxxxtttt": { tai: 65, xiu: 35 },
    "ttttxxxx": { tai: 30, xiu: 70 }, "xxxxtttx": { tai: 70, xiu: 30 },
    "txtxtx": { tai: 68, xiu: 32 }, "xtxtxt": { tai: 32, xiu: 68 },
    "ttxtxt": { tai: 55, xiu: 45 }, "xxtxtx": { tai: 45, xiu: 55 },
    "txtxxt": { tai: 60, xiu: 40 }, "xtxttx": { tai: 40, xiu: 60 },
    "ttx": { tai: 65, xiu: 35 }, "xxt": { tai: 35, xiu: 65 },
    "txt": { tai: 58, xiu: 42 }, "xtx": { tai: 42, xiu: 58 },
    "tttx": { tai: 70, xiu: 30 }, "xxxt": { tai: 30, xiu: 70 },
    "ttxt": { tai: 63, xiu: 37 }, "xxtx": { tai: 37, xiu: 63 },
    "txxx": { tai: 25, xiu: 75 }, "xttt": { tai: 75, xiu: 25 },
    "ttxtx": { tai: 62, xiu: 38 }, "xxtxt": { tai: 38, xiu: 62 },
    "ttxxt": { tai: 55, xiu: 45 }, "xxttx": { tai: 45, xiu: 55 },
    "tttttx": { tai: 30, xiu: 70 }, "xxxxxt": { tai: 70, xiu: 30 },
    "tttttttx": { tai: 20, xiu: 80 }, "xxxxxxxt": { tai: 80, xiu: 20 },
    "ttttttttx": { tai: 15, xiu: 85 },
    "txtx": { tai: 52, xiu: 48 }, "xtxt": { tai: 48, xiu: 52 },
    "txtxt": { tai: 53, xiu: 47 }, "xtxtx": { tai: 47, xiu: 53 },
    "txtxtxt": { tai: 57, xiu: 43 }, "xtxtxtx": { tai: 43, xiu: 57 },
    "ttxxttxx": { tai: 38, xiu: 62 }, "xxttxxtt": { tai: 62, xiu: 38 },
    "ttxxxttx": { tai: 45, xiu: 55 }, "xxttxxxt": { tai: 55, xiu: 45 },
    "ttxtxttx": { tai: 50, xiu: 50 }, "xxtxtxxt": { tai: 50, xiu: 50 },
    "ttxttx": { tai: 60, xiu: 40 }, "xxtxxt": { tai: 40, xiu: 60 },
    "ttxxtx": { tai: 58, xiu: 42 },
    "ttxtxtx": { tai: 62, xiu: 38 }, "xxtxtxt": { tai: 38, xiu: 62 },
    "ttxxtxt": { tai: 55, xiu: 45 }, "xxtxttx": { tai: 45, xiu: 55 },
    "ttxtxxt": { tai: 65, xiu: 35 },
    "ttxtxttx": { tai: 70, xiu: 30 },
    "ttxxtxtx": { tai: 68, xiu: 32 }, "xxtxtxtx": { tai: 32, xiu: 68 },
    "ttxtxxtx": { tai: 72, xiu: 28 },
    "ttxxtxxt": { tai: 75, xiu: 25 }
};

const BIG_STREAK_DATA = {
    "tai": {
        "3": { next_tai: 65, next_xiu: 35 }, "4": { next_tai: 70, next_xiu: 30 },
        "5": { next_tai: 75, next_xiu: 25 }, "6": { next_tai: 80, next_xiu: 20 },
        "7": { next_tai: 85, next_xiu: 15 }, "8": { next_tai: 88, next_xiu: 12 },
        "9": { next_tai: 90, next_xiu: 10 }, "10+": { next_tai: 92, next_xiu: 8 }
    },
    "xiu": {
        "3": { next_tai: 35, next_xiu: 65 }, "4": { next_tai: 30, next_xiu: 70 },
        "5": { next_tai: 25, next_xiu: 75 }, "6": { next_tai: 20, next_xiu: 80 },
        "7": { next_tai: 15, next_xiu: 85 }, "8": { next_tai: 12, next_xiu: 88 },
        "9": { next_tai: 10, next_xiu: 90 }, "10+": { next_tai: 8, next_xiu: 92 }
    }
};

const SUM_STATS = {
    "3-10": { tai: 0, xiu: 100 }, "11": { tai: 15, xiu: 85 },
    "12": { tai: 25, xiu: 75 }, "13": { tai: 40, xiu: 60 },
    "14": { tai: 50, xiu: 50 }, "15": { tai: 60, xiu: 40 },
    "16": { tai: 75, xiu: 25 }, "17": { tai: 85, xiu: 15 },
    "18": { tai: 100, xiu: 0 }
};

// ==================== THUẬT TOÁN 1: PATTERN-BASED ====================
function findClosestPattern(input) {
    if (!input) return null;
    const keys = Object.keys(PATTERN_DATA).sort((a, b) => b.length - a.length);
    for (const key of keys) {
        if (input.endsWith(key)) return key;
    }
    return null;
}

function analyzeBigStreak(history) {
    if (history.length < 2) return { prediction: null, confidence: 0 };
    let streak = 1;
    const result = history[0].ket_qua;
    for (let i = 1; i < history.length; i++) {
        if (history[i].ket_qua === result) streak++;
        else break;
    }
    if (streak >= 3) {
        const key = streak <= 9 ? String(streak) : "10+";
        const stats = BIG_STREAK_DATA[result === "Tài" ? "tai" : "xiu"][key];
        if (stats) {
            if (stats.next_tai > stats.next_xiu) return { prediction: "Tài", confidence: stats.next_tai };
            return { prediction: "Xỉu", confidence: stats.next_xiu };
        }
    }
    return { prediction: null, confidence: 0 };
}

function analyzeSumTrend(history) {
    if (!history.length) return { prediction: null, confidence: 0 };
    const stats = SUM_STATS[String(history[0].tong)];
    if (stats) {
        if (stats.tai === 100) return { prediction: "Tài", confidence: 95 };
        if (stats.xiu === 100) return { prediction: "Xỉu", confidence: 95 };
        if (stats.tai > stats.xiu) return { prediction: "Tài", confidence: stats.tai };
        return { prediction: "Xỉu", confidence: stats.xiu };
    }
    return { prediction: null, confidence: 0 };
}

function patternPredict(history) {
    if (!history.length) return { prediction: "Tài", confidence: 50 };
    const streak = analyzeBigStreak(history);
    if (streak.prediction && streak.confidence > 75) return streak;
    const sum = analyzeSumTrend(history);
    if (sum.prediction && sum.confidence > 80) return sum;

    const elements = history.slice(0, 15).map(s => s.ket_qua === "Tài" ? "t" : "x");
    const key = findClosestPattern(elements.reverse().join(""));
    if (key) {
        const data = PATTERN_DATA[key];
        if (data.tai === data.xiu) {
            return history[0].tong >= 11
                ? { prediction: "Tài", confidence: 55 }
                : { prediction: "Xỉu", confidence: 55 };
        }
        if (data.tai > data.xiu) return { prediction: "Tài", confidence: data.tai };
        return { prediction: "Xỉu", confidence: data.xiu };
    }
    return history[0].tong >= 11
        ? { prediction: "Tài", confidence: 55 }
        : { prediction: "Xỉu", confidence: 55 };
}

// ==================== THUẬT TOÁN 2: SUPER VI LONG (15 TẦNG) ====================
function superViLongAlgorithm(history, rawHistory) {
    if (history.length < 15) return -1;
    const h = history;
    let pStr = h.slice(0, Math.min(30, h.length)).join('');
    let curStreak = 0;
    for (let i = 0; i < h.length; i++) {
        if (h[i] === h[0]) curStreak++;
        else break;
    }

    let vip11Pred = -1;
    if (h.length >= 2 && h[0] !== h[1]) vip11Pred = h[0];

    let flashPred = -1;
    if (h.length >= 2 && h.length < 10) {
        if (h[0] === h[1]) flashPred = h[0];
        else flashPred = h[0] === 1 ? 0 : 1;
        if (h.length >= 3) {
            if (h[0] !== h[1] && h[1] !== h[2]) flashPred = h[0] === 1 ? 0 : 1;
            else if (h[0] === h[1] && h[1] === h[2]) flashPred = h[0];
        }
    }

    let tensorPred = -1;
    if (h.length >= 25) {
        let b1 = h.slice(0, 8).filter(x => x === 1).length;
        let b2 = h.slice(8, 16).filter(x => x === 1).length;
        let b3 = h.slice(16, 24).filter(x => x === 1).length;
        if (b1 > 5 && b2 < 3 && b3 > 5) tensorPred = 0;
        else if (b1 < 3 && b2 > 5 && b3 < 3) tensorPred = 1;
        if (Math.abs(b1 - b2) <= 1 && Math.abs(b2 - b3) <= 1 && curStreak >= 2) {
            tensorPred = h[0] === 1 ? 0 : 1;
        }
    }

    let elliotWavePred = -1;
    if (h.length >= 15) {
        let waves = [], wCount = 1;
        for (let i = 0; i < 8; i++) {
            if (h[i] === h[i + 1]) wCount++;
            else { waves.push(wCount); wCount = 1; }
        }
        if (waves.length >= 3 && waves[0] === 1 && waves[1] === 2 && waves[2] >= 3) {
            elliotWavePred = h[0] === 1 ? 0 : 1;
        }
    }

    let poissonPred = -1;
    if (h.length >= 30) {
        let cT = h.slice(0, 30).filter(x => x === 1).length;
        if (cT >= 22 && h[0] === 1) poissonPred = 0;
        else if (cT <= 8 && h[0] === 0) poissonPred = 1;
    }

    let clusterPred = -1;
    if (h.length >= 8) {
        let cs = (h[0] * 8) + (h[1] * 4) + (h[2] * 2) + (h[3] * 1);
        if (cs === 15 && curStreak === 4) clusterPred = 0;
        else if (cs === 0 && curStreak === 4) clusterPred = 1;
    }

    let quantumPred = -1;
    if (h.length >= 25) {
        let qT = 0, qX = 0;
        for (let i = 0; i < 10; i++) {
            if (h[i] === h[i + 5] && h[i] !== h[i + 10]) {
                if (h[i] === 1) qT++;
                else qX++;
            }
        }
        if (qT >= 3 && h[0] === 1) quantumPred = 0;
        else if (qX >= 3 && h[0] === 0) quantumPred = 1;
    }

    let vipViLongPred = -1;
    if (h.length >= 20) {
        let crossScore = 0;
        for (let i = 0; i < 8; i++) {
            if (h[i] === h[i + 2] && h[i + 1] !== h[i]) crossScore++;
        }
        if (crossScore >= 5) vipViLongPred = h[0] === 1 ? 0 : 1;
        let primePattern = pStr.startsWith('1110111') || pStr.startsWith('0001000');
        if (primePattern) vipViLongPred = h[0];
    }

    let markov3DPred = -1;
    if (h.length >= 25) {
        let p3 = "" + h[2] + h[1] + h[0];
        let t1 = 0, t0 = 0;
        for (let i = 3; i < h.length - 3; i++) {
            if ("" + h[i + 2] + h[i + 1] + h[i] === p3) {
                if (h[i - 1] === 1) t1++;
                else t0++;
            }
        }
        if (t1 > t0 && t1 >= 2) markov3DPred = 1;
        else if (t0 > t1 && t0 >= 2) markov3DPred = 0;
    }

    let gaussianPred = -1;
    if (rawHistory.length >= 15) {
        let sums = [];
        for (let i = 0; i < 15; i++) {
            let s = (rawHistory[i].xuc_xac_1 || 0) + (rawHistory[i].xuc_xac_2 || 0) + (rawHistory[i].xuc_xac_3 || 0);
            if (s > 0) sums.push(s);
        }
        if (sums.length === 15) {
            let mean = sums.reduce((a, b) => a + b, 0) / 15;
            let v = sums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 15;
            let sd = Math.sqrt(v);
            if (sd < 1.8 && curStreak >= 3) gaussianPred = h[0] === 1 ? 0 : 1;
            else if (sd > 4.5) {
                if (mean > 12) gaussianPred = 0;
                else if (mean < 9) gaussianPred = 1;
            }
        }
    }

    let fractalPred = -1;
    if (h.length >= 20) {
        let curF = h.slice(0, 4).join('');
        for (let i = 4; i < h.length - 4; i++) {
            if (h.slice(i, i + 4).join('') === curF) { fractalPred = h[i - 1]; break; }
        }
    }

    if (gaussianPred !== -1) return gaussianPred;
    if (markov3DPred !== -1) return markov3DPred;
    if (fractalPred !== -1) return fractalPred;
    if (vip11Pred !== -1) return vip11Pred;
    if (tensorPred !== -1) return tensorPred;
    if (poissonPred !== -1) return poissonPred;
    if (elliotWavePred !== -1) return elliotWavePred;
    if (clusterPred !== -1) return clusterPred;
    if (quantumPred !== -1) return quantumPred;
    if (vipViLongPred !== -1) return vipViLongPred;
    if (flashPred !== -1) return flashPred;

    let isPingPong = pStr.startsWith('1010') || pStr.startsWith('0101');
    if (curStreak >= 3) return h[0];
    if (isPingPong) return h[0] === 1 ? 0 : 1;
    return h[0];
}

// ==================== THUẬT TOÁN 3: SCORE-BASED ====================
function scorePredict(history, sumHistory) {
    if (history.length < 5) {
        const last = history[history.length - 1];
        if (last === undefined) return { result: 'TÀI', percent: 50 };
        const opposite = last === 'TÀI' ? 'XỈU' : 'TÀI';
        return { result: opposite, percent: 52 };
    }

    let score = 0;
    const last = history[history.length - 1];

    let markov = { TT: 0, TX: 0, XX: 0, XT: 0 };
    for (let i = 1; i < history.length; i++) {
        const prev = history[i - 1], cur = history[i];
        if (prev === 'TÀI' && cur === 'TÀI') markov.TT++;
        else if (prev === 'TÀI' && cur === 'XỈU') markov.TX++;
        else if (prev === 'XỈU' && cur === 'XỈU') markov.XX++;
        else if (prev === 'XỈU' && cur === 'TÀI') markov.XT++;
    }

    if (last === 'TÀI') {
        const total = markov.TT + markov.TX;
        if (total > 0) score += (0.5 - markov.TT / total) * 1.5;
    } else {
        const total = markov.XX + markov.XT;
        if (total > 0) score += (markov.XT / total - 0.5) * 1.5;
    }

    const pattern2 = {}, pattern3 = {}, pattern4 = {}, pattern5 = {};
    for (let i = 2; i <= history.length; i++) {
        const h = history[i - 1];
        const k2 = history.slice(i - 2, i).join('');
        const k3 = i >= 3 ? history.slice(i - 3, i).join('') : null;
        const k4 = i >= 4 ? history.slice(i - 4, i).join('') : null;
        const k5 = i >= 5 ? history.slice(i - 5, i).join('') : null;
        const bit = h === 'TÀI' ? 'T' : 'X';

        if (!pattern2[k2]) pattern2[k2] = { T: 0, X: 0 };
        pattern2[k2][bit]++;
        if (k3) { if (!pattern3[k3]) pattern3[k3] = { T: 0, X: 0 }; pattern3[k3][bit]++; }
        if (k4) { if (!pattern4[k4]) pattern4[k4] = { T: 0, X: 0 }; pattern4[k4][bit]++; }
        if (k5) { if (!pattern5[k5]) pattern5[k5] = { T: 0, X: 0 }; pattern5[k5][bit]++; }
    }

    const applyPattern = (patternMap, key, weight) => {
        if (patternMap[key]) {
            const t = patternMap[key].T || 0, x = patternMap[key].X || 0;
            const total = t + x;
            if (total > 0) score += ((x - t) / total) * weight;
        }
    };

    if (history.length >= 2) applyPattern(pattern2, history.slice(-2).join(''), 1.3);
    if (history.length >= 3) applyPattern(pattern3, history.slice(-3).join(''), 1.6);
    if (history.length >= 4) applyPattern(pattern4, history.slice(-4).join(''), 1.1);
    if (history.length >= 5) applyPattern(pattern5, history.slice(-5).join(''), 1.0);

    if (sumHistory.length >= 5) {
        const avg5 = sumHistory.slice(-5).reduce((a, b) => a + b, 0) / 5;
        if (avg5 > 10.5) score += 0.8;
        else if (avg5 < 9.5) score -= 0.8;
    }

    if (sumHistory.length >= 10) {
        const avg10 = sumHistory.slice(-10).reduce((a, b) => a + b, 0) / 10;
        if (avg10 > 10.8) score += 0.6;
        else if (avg10 < 9.2) score -= 0.6;
        const v = sumHistory.slice(-10).reduce((acc, val) => acc + (val - avg10) ** 2, 0) / 10;
        if (Math.sqrt(v) > 3.5) score *= 0.9;
    }

    let streak = 1;
    for (let i = history.length - 1; i > 0; i--) {
        if (history[i] === history[i - 1]) streak++;
        else break;
    }
    if (streak >= 2) score += (last === 'TÀI' ? -1.2 : 1.2) * Math.min(streak, 5) * 0.5;

    if (history.length >= 10) {
        let zigzag = true;
        for (let i = 1; i <= 7; i++) {
            if (history[history.length - i] === history[history.length - i - 1]) { zigzag = false; break; }
        }
        if (zigzag) score += last === 'TÀI' ? 1.0 : -1.0;
    }

    const last10 = history.slice(-10);
    const t10 = last10.filter(x => x === 'TÀI').length;
    const x10 = last10.filter(x => x === 'XỈU').length;
    if (t10 >= 7) score -= 1.5;
    if (x10 >= 7) score += 1.5;

    const finalResult = score >= 0 ? 'TÀI' : 'XỈU';
    let percent = 55 + Math.min(Math.abs(score) * 4.0, 30);
    percent = Math.round(Math.min(85, percent));

    return { result: finalResult, percent };
}

// ==================== THUẬT TOÁN 4: PATTERN DICTIONARY (MỚI) ====================
function patternDictPredict(history) {
    if (!history.length) return { prediction: null, confidence: 0, matched: null };

    // Chuyển history thành chuỗi T/X, mới nhất ở đầu
    const bits = history.map(s => s.ket_qua === "Tài" ? "T" : "X");
    // Đảo lại để cũ → mới (để slice lấy pattern gần nhất ở cuối chuỗi)
    const str = bits.slice().reverse().join('');

    // Tìm pattern dài nhất khớp trong dictionary
    const keys = Object.keys(PATTERN_DICT).sort((a, b) => b.length - a.length);
    for (const key of keys) {
        if (str.endsWith(key)) {
            const data = PATTERN_DICT[key];
            return {
                prediction: data.prediction,
                confidence: data.confidence,
                matched: key
            };
        }
    }

    return { prediction: null, confidence: 0, matched: null };
}

// ==================== FUSION: KẾT HỢP 4 THUẬT TOÁN ====================
function finalPredict(history) {
    if (!history.length) return { prediction: "Tài", confidence: 50 };

    const hBits = history.map(s => s.ket_qua === "Tài" ? 1 : 0);
    const hNames = history.map(s => s.ket_qua === "Tài" ? "TÀI" : "XỈU");
    const hNamesOldFirst = [...hNames].reverse();
    const sumHistoryOldFirst = history.map(s => s.tong).reverse();

    // 1. Pattern-based (weight 1.0)
    const patternResult = patternPredict(history);

    // 2. SuperViLong (weight 1.5)
    const superResult = superViLongAlgorithm(hBits, history);
    const superPrediction = superResult === -1 ? null : (superResult === 1 ? "Tài" : "Xỉu");

    // 3. Score-based (weight 1.2)
    const scoreResult = scorePredict(hNamesOldFirst, sumHistoryOldFirst);
    const scorePrediction = scoreResult.result === "TÀI" ? "Tài" : "Xỉu";

    // 4. Pattern Dictionary (weight 2.0 - ưu tiên cao nhất vì confidence đã tinh chỉnh)
    const dictResult = patternDictPredict(history);

    // ===== VOTING =====
    let votes = { "Tài": 0, "Xỉu": 0 };
    let confidences = [];

    if (patternResult.prediction) {
        votes[patternResult.prediction] += 1.0;
        confidences.push({ pred: patternResult.prediction, conf: patternResult.confidence, weight: 1.0, name: "pattern" });
    }

    if (superPrediction) {
        votes[superPrediction] += 1.5;
        confidences.push({ pred: superPrediction, conf: 75, weight: 1.5, name: "superViLong" });
    }

    if (scorePrediction) {
        votes[scorePrediction] += 1.2;
        confidences.push({ pred: scorePrediction, conf: scoreResult.percent, weight: 1.2, name: "score" });
    }

    if (dictResult.prediction) {
        // Weight tỉ lệ với confidence của pattern (50-99% → weight 1.2 - 2.5)
        const dictWeight = 1.2 + (dictResult.confidence / 100) * 1.3;
        votes[dictResult.prediction] += dictWeight;
        confidences.push({ pred: dictResult.prediction, conf: dictResult.confidence, weight: dictWeight, name: "dict" });
    }

    // Chọn kết quả thắng
    const finalPrediction = votes["Tài"] >= votes["Xỉu"] ? "Tài" : "Xỉu";

    // Tính confidence trung bình có trọng số
    let totalWeight = 0, weightedConf = 0;
    for (const c of confidences) {
        weightedConf += c.conf * c.weight;
        totalWeight += c.weight;
    }
    let finalConfidence = totalWeight > 0 ? weightedConf / totalWeight : 55;

    // Agreement bonus
    const agreeCount = confidences.filter(c => c.pred === finalPrediction).length;
    if (agreeCount === 4) finalConfidence = Math.min(96, finalConfidence + 12);
    else if (agreeCount === 3) finalConfidence = Math.min(92, finalConfidence + 7);
    else if (agreeCount === 2) finalConfidence = Math.min(85, finalConfidence + 3);

    finalConfidence = Math.round(Math.max(50, Math.min(98, finalConfidence)));

    return {
        prediction: finalPrediction,
        confidence: finalConfidence,
        details: {
            pattern: patternResult.prediction,
            superViLong: superPrediction,
            scoreBased: scorePrediction,
            patternDict: dictResult.prediction,
            dictMatched: dictResult.matched,
            dictConfidence: dictResult.confidence,
            votes: {
                "Tài": +votes["Tài"].toFixed(2),
                "Xỉu": +votes["Xỉu"].toFixed(2)
            }
        }
    };
}

// ==================== CACHE & FETCH ====================
let cache = { history: [], lastFetch: 0 };

async function fetchHistory() {
    try {
        const res = await fetch(HISTORY_API_URL, {
            headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" },
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

// ==================== ROUTES ====================
app.get('/api/sun', async (req, res) => {
    try {
        const history = await getHistory();
        if (!history.length) return res.status(503).json({ error: "No data" });

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
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/detail', async (req, res) => {
    try {
        const history = await getHistory();
        if (!history.length) return res.status(503).json({ error: "No data" });
        res.json(finalPredict(history));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/history', async (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const history = await getHistory();
    res.json({ count: Math.min(limit, history.length), data: history.slice(0, limit) });
});

app.get('/api/stats', async (req, res) => {
    const history = await getHistory();
    const last20 = history.slice(0, 20);
    const tai = last20.filter(s => s.ket_qua === "Tài").length;
    const xiu = last20.length - tai;
    let streak = 0, streakResult = null;
    if (history.length) {
        streakResult = history[0].ket_qua;
        for (const s of history) {
            if (s.ket_qua === streakResult) streak++;
            else break;
        }
    }
    res.json({
        total: history.length,
        tai, xiu,
        tai_percent: ((tai / last20.length) * 100).toFixed(1),
        xiu_percent: ((xiu / last20.length) * 100).toFixed(1),
        streak: { result: streakResult, count: streak },
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
        name: "SunWin Predict API - Advanced Fusion",
        adm: "Duy Bảo",
        endpoints: {
            predict: "/api/sun",
            detail: "/api/detail",
            history: "/api/history?limit=50",
            stats: "/api/stats",
            health: "/api/health"
        },
        algorithms: [
            "Pattern-based (weight 1.0)",
            "SuperViLong 15 tầng (weight 1.5)",
            "Score-based (weight 1.2)",
            "Pattern Dictionary (weight 1.2-2.5)"
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
