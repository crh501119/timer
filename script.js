let slideStartTime;let totalStartTime;let slideTimes = [];let timerInterval;let isPaused = false;let pausedTime = 0;const bellSound = document.getElementById('bellSound');const testBtn = document.getElementById('testBtn');const body = document.body;function startTimer() {    if (!totalStartTime) { // 如果计时器是第一次开始        totalStartTime = new Date();        slideStartTime = new Date();    } else if (isPaused) { // 如果计时器是从暂停状态恢复        const now = new Date();        const pauseDuration = now - pausedTime;        totalStartTime = new Date(totalStartTime.getTime() + pauseDuration);        slideStartTime = new Date(slideStartTime.getTime() + pauseDuration);        isPaused = false;    }    timerInterval = setInterval(updateTimer, 10); // 更新频率为每10毫秒    document.getElementById('nextSlideBtn').disabled = false;    document.getElementById('startBtn').disabled = true;    document.getElementById('pauseBtn').disabled = false;    // 在计时器启动1分钟后禁用测试按钮    setTimeout(() => {        testBtn.disabled = true;    }, 60000);}function pauseTimer() {    clearInterval(timerInterval);    isPaused = true;    pausedTime = new Date();    document.getElementById('startBtn').disabled = false;    document.getElementById('pauseBtn').disabled = true;    document.getElementById('nextSlideBtn').disabled = true; // 暂停时禁用“下一张投影片”按钮}function updateTimer() {    const now = new Date();    const totalElapsedTime = now - totalStartTime;    const elapsedTime = now - slideStartTime;    // 计算分钟、秒和毫秒    const minutes = String(Math.floor(totalElapsedTime / 60000)).padStart(2, '0');    const seconds = String(Math.floor((totalElapsedTime % 60000) / 1000)).padStart(2, '0');    const milliseconds = String(Math.floor((totalElapsedTime % 1000) / 10)).padStart(2, '0');    // 更新显示的时间    document.getElementById('slideTimer').textContent = `${minutes}:${seconds}.${milliseconds}`;    // 5分钟后背景变为黄色    if (totalElapsedTime >= 300000 && totalElapsedTime < 360000) {        body.style.backgroundColor = 'yellow';    }    // 6分钟后背景变为粉红色    if (totalElapsedTime >= 360000) {        body.style.backgroundColor = 'pink';    }    // 在5分钟和6分钟时播放铃声    if (totalElapsedTime >= 300000 && totalElapsedTime < 300010) { // 5分钟时播放一次铃声        bellSound.play();    }    if (totalElapsedTime >= 360000 && totalElapsedTime < 360010) { // 6分钟时播放两次铃声        bellSound.play();        setTimeout(() => bellSound.play(), 500); // 500毫秒后再播放一次    }}function nextSlide() {    const now = new Date();    const slideElapsedTime = now - slideStartTime;    const totalElapsedTime = now - totalStartTime;    // 记录该投影片的时间和总时间    slideTimes.push({        slide: slideTimes.length,  // 这里的 slideTimes.length 自然从 0 开始        time: slideElapsedTime,        totalTime: totalElapsedTime    });    updateStatistics();    // 重置投影片开始时间，但总时间继续    slideStartTime = new Date();    document.getElementById('undoBtn').disabled = false; // 启用“按错了”按钮}function undoLastSlide() {    if (slideTimes.length === 0) return; // 如果还没有记录投影片时间，直接返回    const now = new Date();    const correctTime = now - slideStartTime;    // 修正最后一张投影片的时间    slideTimes[slideTimes.length - 1].time += correctTime;    slideTimes[slideTimes.length - 1].totalTime += correctTime;    updateStatistics();    // 重置投影片开始时间，以便继续计时    slideStartTime = new Date();}function updateStatistics() {    const statisticsList = document.getElementById('statisticsList');    statisticsList.innerHTML = '';    slideTimes.forEach((slideData) => {        const minutes = String(Math.floor(slideData.time / 60000)).padStart(2, '0');        const seconds = String(Math.floor((slideData.time % 60000) / 1000)).padStart(2, '0');        const milliseconds = String(Math.floor((slideData.time % 1000) / 10)).padStart(2, '0');        const totalMinutes = String(Math.floor(slideData.totalTime / 60000)).padStart(2, '0');        const totalSeconds = String(Math.floor((slideData.totalTime % 60000) / 1000)).padStart(2, '0');        const totalMilliseconds = String(Math.floor((slideData.totalTime % 1000) / 10)).padStart(2, '0');        const row = `<tr>            <td>${slideData.slide}</td>            <td>${minutes}:${seconds}.${milliseconds}</td>            <td>${totalMinutes}:${totalSeconds}.${totalMilliseconds}</td>        </tr>`;        statisticsList.insertAdjacentHTML('beforeend', row);    });}function sortTable(n) {    const table = document.getElementById("statisticsTable");    let switching = true;    let shouldSwitch, i;    let dir = "asc";     let switchCount = 0;        while (switching) {        switching = false;        const rows = table.rows;        for (i = 1; i < (rows.length - 1); i++) {            shouldSwitch = false;            const x = rows[i].getElementsByTagName("TD")[n];            const y = rows[i + 1].getElementsByTagName("TD")[n];            if (dir === "asc") {                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {                    shouldSwitch = true;                    break;                }            } else if (dir === "desc") {                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {                    shouldSwitch = true;                    break;                }            }        }        if (shouldSwitch) {            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);            switching = true;            switchCount++;        } else {            if (switchCount === 0 && dir === "asc") {                dir = "desc";                switching = true;            }        }    }}document.getElementById('startBtn').addEventListener('click', startTimer);document.getElementById('pauseBtn').addEventListener('click', pauseTimer);document.getElementById('nextSlideBtn').addEventListener('click', nextSlide);document.getElementById('undoBtn').addEventListener('click', undoLastSlide);