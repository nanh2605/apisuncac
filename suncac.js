const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const HISTORY_API_URL = "https://kwinstore.com/sunwin/tx/history/6510962597fde7c34586236827167b434fc246af9b55777c";
const CACHE_TTL = 5000;

// ==================== PATTERN DATA ====================
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
        "3": { next_tai: 65, next_xiu: 35 },
        "4": { next_tai: 70, next_xiu: 30 },
        "5": { next_tai: 75, next_xiu: 25 },
        "6": { next_tai: 80, next_xiu: 20 },
        "7": { next_tai: 85, next_xiu: 15 },
        "8": { next_tai: 88, next_xiu: 12 },
        "9": { next_tai: 90, next_xiu: 10 },
        "10+": { next_tai: 92, next_xiu: 8 }
    },
    "xiu": {
        "3": { next_tai: 35, next_xiu: 65 },
        "4": { next_tai: 30, next_xiu: 70 },
        "5": { next_tai: 25, next_xiu: 75 },
        "6": { next_tai: 20, next_xiu: 80 },
        "7": { next_tai: 15, next_xiu: 85 },
        "8": { next_tai: 12, next_xiu: 88 },
        "9": { next_tai: 10, next_xiu: 90 },
        "10+": { next_tai: 8, next_xiu: 92 }
    }
};

const SUM_STATS = {
    "3-10": { tai: 0, xiu: 100 },
    "11": { tai: 15, xiu: 85 },
    "12": { tai: 25, xiu: 75 },
    "13": { tai: 40, xiu: 60 },
    "14": { tai: 50, xiu: 50 },
    "15": { tai: 60, xiu: 40 },
    "16": { tai: 75, xiu: 25 },
    "17": { tai: 85, xiu: 15 },
    "18": { tai: 100, xiu: 0 }
};

// ==================== THUẬT TOÁN GỐC ====================
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
    const lastSum = history[0].tong;
    const stats = SUM_STATS[String(lastSum)];
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
    const patternStr = elements.reverse().join("");
    const key = findClosestPattern(patternStr);

    if (key) {
        const data = PATTERN_DATA[key];
        if (data.tai === data.xiu) {
            if (history[0].tong >= 11) return { prediction: "Tài", confidence: 55 };
            return { prediction: "Xỉu", confidence: 55 };
        }
        if (data.tai > data.xiu) return { prediction: "Tài", confidence: data.tai };
        return { prediction: "Xỉu", confidence: data.xiu };
    }

    if (history[0].tong >= 11) return { prediction: "Tài", confidence: 55 };
    return { prediction: "Xỉu", confidence: 55 };
}

// ==================== THUẬT TOÁN NÂNG CAO (15 TẦNG) ====================
// Map: 1 = Tài, 0 = Xỉu
function superViLongAlgorithm(history, rawHistory) {
    if (history.length < 15) return -1;

    const h = history;
    let pStr = h.slice(0, Math.min(30, h.length)).join('');
    let curStreak = 0;
    for (let i = 0; i < h.length; i++) {
        if (h[i] === h[0]) curStreak++;
        else break;
    }

    // TẦNG 1: VIP 11
    let vip11Pred = -1;
    if (h.length >= 2) {
        if (h[0] !== h[1]) vip11Pred = h[0];
    }

    // TẦNG 2: FLASH
    let flashPred = -1;
    if (h.length >= 2 && h.length < 10) {
        if (h[0] === h[1]) flashPred = h[0];
        else flashPred = h[0] === 1 ? 0 : 1;
        if (h.length >= 3) {
            if (h[0] !== h[1] && h[1] !== h[2]) flashPred = h[0] === 1 ? 0 : 1;
            else if (h[0] === h[1] && h[1] === h[2]) flashPred = h[0];
        }
    }

    // TẦNG 3: TENSOR
    let tensorPred = -1;
    if (h.length >= 25) {
        let block1 = h.slice(0, 8).filter(x => x === 1).length;
        let block2 = h.slice(8, 16).filter(x => x === 1).length;
        let block3 = h.slice(16, 24).filter(x => x === 1).length;
        if (block1 > 5 && block2 < 3 && block3 > 5) tensorPred = 0;
        else if (block1 < 3 && block2 > 5 && block3 < 3) tensorPred = 1;
        let diff1 = Math.abs(block1 - block2);
        let diff2 = Math.abs(block2 - block3);
        if (diff1 <= 1 && diff2 <= 1 && curStreak >= 2) tensorPred = h[0] === 1 ? 0 : 1;
    }

    // TẦNG 4: ELLIOT WAVE
    let elliotWavePred = -1;
    if (h.length >= 15) {
        let waves = [];
        let wCount = 1;
        for (let i = 0; i < 8; i++) {
            if (h[i] === h[i + 1]) wCount++;
            else { waves.push(wCount); wCount = 1; }
        }
        if (waves.length >= 3 && waves[0] === 1 && waves[1] === 2 && waves[2] >= 3) {
            elliotWavePred = h[0] === 1 ? 0 : 1;
        }
    }

    // TẦNG 5: POISSON
    let poissonPred = -1;
    if (h.length >= 30) {
        let countT_30 = h.slice(0, 30).filter(x => x === 1).length;
        if (countT_30 >= 22 && h[0] === 1) poissonPred = 0;
        else if (countT_30 <= 8 && h[0] === 0) poissonPred = 1;
    }

    // TẦNG 6: CLUSTER
    let clusterPred = -1;
    if (h.length >= 8) {
        let clusterScore = (h[0] * 8) + (h[1] * 4) + (h[2] * 2) + (h[3] * 1);
        if (clusterScore === 15 && curStreak === 4) clusterPred = 0;
        else if (clusterScore === 0 && curStreak === 4) clusterPred = 1;
    }

    // TẦNG 7: QUANTUM
    let quantumPred = -1;
    if (h.length >= 25) {
        let qTai = 0, qXiu = 0;
        for (let i = 0; i < 10; i++) {
            if (h[i] === h[i + 5] && h[i] !== h[i + 10]) {
                if (h[i] === 1) qTai++;
                else qXiu++;
            }
        }
        if (qTai >= 3 && h[0] === 1) quantumPred = 0;
        else if (qXiu >= 3 && h[0] === 0) quantumPred = 1;
    }

    // TẦNG 8: VIP VI LONG
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

    // TẦNG 9: MARKOV CHAIN 3D
    let markov3DPred = -1;
    if (h.length >= 25) {
        let pattern3 = "" + h[2] + h[1] + h[0];
        let t1 = 0, t0 = 0;
        for (let i = 3; i < h.length - 3; i++) {
            if ("" + h[i + 2] + h[i + 1] + h[i] === pattern3) {
                if (h[i - 1] === 1) t1++;
                else t0++;
            }
        }
        if (t1 > t0 && t1 >= 2) markov3DPred = 1;
        else if (t0 > t1 && t0 >= 2) markov3DPred = 0;
    }

    // TẦNG 10: GAUSSIAN NOISE FILTER
    let gaussianPred = -1;
    if (rawHistory.length >= 15) {
        let sums = [];
        for (let i = 0; i < 15; i++) {
            let s = (rawHistory[i].xuc_xac_1 || 0) + (rawHistory[i].xuc_xac_2 || 0) + (rawHistory[i].xuc_xac_3 || 0);
            if (s > 0) sums.push(s);
        }
        if (sums.length === 15) {
            let mean = sums.reduce((a, b) => a + b, 0) / 15;
            let variance = sums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 15;
            let stdDev = Math.sqrt(variance);
            if (stdDev < 1.8 && curStreak >= 3) gaussianPred = h[0] === 1 ? 0 : 1;
            else if (stdDev > 4.5) {
                if (mean > 12) gaussianPred = 0;
                else if (mean < 9) gaussianPred = 1;
            }
        }
    }

    // TẦNG 11: FRACTAL GEOMETRY
    let fractalPred = -1;
    if (h.length >= 20) {
        let currentFractal = h.slice(0, 4).join('');
        for (let i = 4; i < h.length - 4; i++) {
            if (h.slice(i, i + 4).join('') === currentFractal) {
                fractalPred = h[i - 1];
                break;
            }
        }
    }

    // CÂY ƯU TIÊN QUYẾT ĐỊNH
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

    let isPingPong = (pStr.startsWith('1010') || pStr.startsWith('0101'));
    if (curStreak >= 3) return h[0];
    if (isPingPong) return (h[0] === 1 ? 0 : 1);
    return h[0];
}

// ==================== THUẬT TOÁN SCORE-BASED (TỪ FILE function predict) ====================
function scorePredict(history, sumHistory) {
    if (history.length < 5) {
        const last = history[history.length - 1];
        if (last === undefined) return { result: 'TÀI', percent: 50 };
        const opposite = last === 'TÀI' ? 'XỈU' : 'TÀI';
        return { result: opposite, percent: 52 };
    }

    let score = 0;
    const last = history[history.length - 1];

    // MARKOV
    let markov = { TT: 0, TX: 0, XX: 0, XT: 0 };
    for (let i = 1; i < history.length; i++) {
        const prev = history[i - 1];
        const cur = history[i];
        if (prev === 'TÀI' && cur === 'TÀI') markov.TT++;
        else if (prev === 'TÀI' && cur === 'XỈU') markov.TX++;
        else if (prev === 'XỈU' && cur === 'XỈU') markov.XX++;
        else if (prev === 'XỈU' && cur === 'TÀI') markov.XT++;
    }

    if (last === 'TÀI') {
        const total = markov.TT + markov.TX;
        if (total > 0) {
            const pStay = markov.TT / total;
            score += (0.5 - pStay) * 1.5;
        }
    } else {
        const total = markov.XX + markov.XT;
        if (total > 0) {
            const pSwitch = markov.XT / total;
            score += (pSwitch - 0.5) * 1.5;
        }
    }

    // Pattern 2/3/4/5
    const pattern2 = {}, pattern3 = {}, pattern4 = {}, pattern5 = {};
    for (let i = 2; i <= history.length; i++) {
        const h = history[i - 1];
        const k2 = history.slice(i - 2, i).join('');
        const k3 = i >= 3 ? history.slice(i - 3, i).join('') : null;
        const k4 = i >= 4 ? history.slice(i - 4, i).join('') : null;
        const k5 = i >= 5 ? history.slice(i - 5, i).join('') : null;

        if (!pattern2[k2]) pattern2[k2] = { T: 0, X: 0 };
        pattern2[k2][h === 'TÀI' ? 'T' : 'X']++;

        if (k3) {
            if (!pattern3[k3]) pattern3[k3] = { T: 0, X: 0 };
            pattern3[k3][h === 'TÀI' ? 'T' : 'X']++;
        }
        if (k4) {
            if (!pattern4[k4]) pattern4[k4] = { T: 0, X: 0 };
            pattern4[k4][h === 'TÀI' ? 'T' : 'X']++;
        }
        if (k5) {
            if (!pattern5[k5]) pattern5[k5] = { T: 0, X: 0 };
            pattern5[k5][h === 'TÀI' ? 'T' : 'X']++;
        }
    }

    // Pattern 2
    if (history.length >= 2) {
        const key = history.slice(-2).join('');
        if (pattern2[key]) {
            const t = pattern2[key].T || 0, x = pattern2[key].X || 0;
            const total = t + x;
            if (total > 0) score += ((x - t) / total) * 1.3;
        }
    }
    // Pattern 3
    if (history.length >= 3) {
        const key = history.slice(-3).join('');
        if (pattern3[key]) {
            const t = pattern3[key].T || 0, x = pattern3[key].X || 0;
            const total = t + x;
            if (total > 0) score += ((x - t) / total) * 1.6;
        }
    }
    // Pattern 4
    if (history.length >= 4) {
        const key = history.slice(-4).join('');
        if (pattern4[key]) {
            const t = pattern4[key].T || 0, x = pattern4[key].X || 0;
            const total = t + x;
            if (total > 0) score += ((x - t) / total) * 1.1;
        }
    }
    // Pattern 5
    if (history.length >= 5) {
        const key = history.slice(-5).join('');
        if (pattern5[key]) {
            const t = pattern5[key].T || 0, x = pattern5[key].X || 0;
            const total = t + x;
            if (total > 0) score += ((x - t) / total) * 1.0;
        }
    }

    // AVG 5
    if (sumHistory.length >= 5) {
        const avg5 = sumHistory.slice(-5).reduce((a, b) => a + b, 0) / 5;
        if (avg5 > 10.5) score += 0.8;
        else if (avg5 < 9.5) score -= 0.8;
    }

    // AVG 10 + STD
    if (sumHistory.length >= 10) {
        const avg10 = sumHistory.slice(-10).reduce((a, b) => a + b, 0) / 10;
        if (avg10 > 10.8) score += 0.6;
        else if (avg10 < 9.2) score -= 0.6;

        const variance = sumHistory.slice(-10).reduce((acc, val) => acc + (val - avg10) ** 2, 0) / 10;
        const std = Math.sqrt(variance);
        if (std > 3.5) score *= 0.9;
    }

    // STREAK
    let streak = 1;
    for (let i = history.length - 1; i > 0; i--) {
        if (history[i] === history[i - 1]) streak++;
        else break;
    }
    if (streak >= 2) {
        const bonus = (last === 'TÀI' ? -1.2 : 1.2) * Math.min(streak, 5) * 0.5;
        score += bonus;
    }

    // ZIGZAG
    if (history.length >= 10) {
        let zigzag = true;
        for (let i = 1; i <= 7; i++) {
            if (history[history.length - i] === history[history.length - i - 1]) {
                zigzag = false;
                break;
            }
        }
        if (zigzag) score += last === 'TÀI' ? 1.0 : -1.0;
    }

    // PHÂN BỐ 10 PHIÊN
    const last10 = history.slice(-10);
    const t10 = last10.filter(x => x === 'TÀI').length;
    const x10 = last10.filter(x => x === 'XỈU').length;
    if (t10 >= 7) score -= 1.5;
    if (x10 >= 7) score += 1.5;

    // KẾT QUẢ
    const finalResult = score >= 0 ? 'TÀI' : 'XỈU';

    // CONFIDENCE
    let percent = 55 + Math.min(Math.abs(score) * 4.0, 30);
    percent = Math.round(Math.min(85, percent));

    return { result: finalResult, percent };
}

// ==================== FUSION: KẾT HỢP 3 THUẬT TOÁN ====================
function finalPredict(history) {
    if (!history.length) return { prediction: "Tài", confidence: 50 };

    // Chuẩn bị dữ liệu cho từng thuật toán
    // history[0] = mới nhất, nên đảo lại cho superViLongAlgorithm (cần mới nhất ở index 0)
    const hBits = history.map(s => s.ket_qua === "Tài" ? 1 : 0); // 1=Tài, 0=Xỉu, mới nhất ở [0]
    const hNames = history.map(s => s.ket_qua === "Tài" ? "TÀI" : "XỈU"); // mới nhất ở [0]
    // Đảo ngược để cũ → mới cho scorePredict
    const hNamesOldFirst = [...hNames].reverse();
    const sumHistory = history.map(s => s.tong); // mới nhất ở [0]
    const sumHistoryOldFirst = [...sumHistory].reverse();

    // 1. Thuật toán gốc (pattern-based)
    const patternResult = patternPredict(history);

    // 2. Thuật toán nâng cao 15 tầng
    const superResult = superViLongAlgorithm(hBits, history);
    const superPrediction = superResult === -1 ? null : (superResult === 1 ? "Tài" : "Xỉu");

    // 3. Thuật toán score-based
    const scoreResult = scorePredict(hNamesOldFirst, sumHistoryOldFirst);

    // ===== FUSION LOGIC =====
    // Đếm vote
    let votes = { "Tài": 0, "Xỉu": 0 };
    let confidences = [];

    // Pattern-based (weight 1.0)
    if (patternResult.prediction) {
        votes[patternResult.prediction] += 1.0;
        confidences.push({ pred: patternResult.prediction, conf: patternResult.confidence, weight: 1.0 });
    }

    // Super Vi Long (weight 1.5 - ưu tiên cao)
    if (superPrediction) {
        votes[superPrediction] += 1.5;
        confidences.push({ pred: superPrediction, conf: 75, weight: 1.5 });
    }

    // Score-based (weight 1.2)
    if (scoreResult.result) {
        const pred = scoreResult.result === "TÀI" ? "Tài" : "Xỉu";
        votes[pred] += 1.2;
        confidences.push({ pred, conf: scoreResult.percent, weight: 1.2 });
    }

    // Chọn kết quả có tổng weight cao nhất
    const finalPrediction = votes["Tài"] >= votes["Xỉu"] ? "Tài" : "Xỉu";

    // Tính confidence trung bình có trọng số
    let totalWeight = 0;
    let weightedConf = 0;
    for (const c of confidences) {
        weightedConf += c.conf * c.weight;
        totalWeight += c.weight;
    }
    let finalConfidence = totalWeight > 0 ? weightedConf / totalWeight : 55;

    // Nếu 2/3 thuật toán đồng ý → tăng confidence
    const agreeCount = confidences.filter(c => c.pred === finalPrediction).length;
    if (agreeCount === 3) finalConfidence = Math.min(90, finalConfidence + 10);
    else if (agreeCount === 2) finalConfidence = Math.min(85, finalConfidence + 5);

    // Clamp
    finalConfidence = Math.round(Math.max(50, Math.min(95, finalConfidence)));

    return {
        prediction: finalPrediction,
        confidence: finalConfidence,
        details: {
            pattern: patternResult.prediction,
            superViLong: superPrediction,
            scoreBased: scoreResult.result === "TÀI" ? "Tài" : "Xỉu",
            votes: votes
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

        if (json.status !== "OK" || !Array.isArray(json.data)) {
            throw new Error("Invalid data format");
        }

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

// Route debug xem chi tiết thuật toán
app.get('/api/detail', async (req, res) => {
    try {
        const history = await getHistory();
        if (!history.length) return res.status(503).json({ error: "No data" });
        const pred = finalPredict(history);
        res.json(pred);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/history', async (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const history = await getHistory();
    res.json({
        count: Math.min(limit, history.length),
        data: history.slice(0, limit)
    });
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
        tai: tai,
        xiu: xiu,
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
        name: "SunWin Predict API - Advanced Algorithm",
        adm: "Duy Bảo",
        endpoints: {
            predict: "/api/sun",
            detail: "/api/detail",
            history: "/api/history?limit=50",
            stats: "/api/stats",
            health: "/api/health"
        },
        algorithm: "Fusion 3 in 1: Pattern + SuperViLong(15 tầng) + Score-based"
    });
});

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on port ${PORT}`);
    const h = await getHistory(true);
    console.log(`Loaded ${h.length} sessions`);
    if (h.length) {
        const pred = finalPredict(h);
        console.log(`Prediction: ${pred.prediction} (${pred.confidence}%)`);
        console.log(`Details:`, JSON.stringify(pred.details));
    }
});
