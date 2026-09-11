const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const HISTORY_API_URL = "https://sunwinsaygex-8616.onrender.com/api/his";
const CACHE_TTL = 5000;

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

let cache = { history: [], lastFetch: 0 };

async function fetchHistory() {
    try {
        const res = await fetch(HISTORY_API_URL, {
            headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" },
            timeout: 10000
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.success || !Array.isArray(json.data)) throw new Error("Invalid data");
        cache.history = [...json.data].reverse();
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

app.get('/api/sun', async (req, res) => {
    try {
        const history = await getHistory();
        if (!history.length) return res.status(503).json({ error: "No data" });

        const last = history[0];
        const pred = patternPredict(history);

        res.json({
            phien: last.phien,
            xuc_xac_1: last.xuc_xac_1,
            xuc_xac_2: last.xuc_xac_2,
            xuc_xac_3: last.xuc_xac_3,
            tong: last.tong,
            ket_qua: last.ket_qua,
            phien_hien_tai: last.phien + 1,
            du_doan: pred.prediction,
            adm: "Duy Bảo"
        });
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
        name: "SunWin Predict API",
        adm: "Duy Bảo",
        endpoints: {
            predict: "/api/sun",
            history: "/api/history?limit=50",
            stats: "/api/stats",
            health: "/api/health"
        }
    });
});

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on port ${PORT}`);
    const h = await getHistory(true);
    console.log(`Loaded ${h.length} sessions`);
});
