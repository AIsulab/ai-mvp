function generateRecommendation() {
    const weather = document.getElementById('weather').value;
    const situation = document.getElementById('situation').value.trim();

    if (!situation) {
        alert('현재 상황을 입력해주세요.');
        return;
    }

    const resultBox = document.getElementById('recommendation-result');
    const contentBox = document.getElementById('recommendation-content');

    let recommendation = '';

    if (weather === '비') {
        recommendation = `비 오는 날 추천 마케팅\n\n"비 오는 날엔 따뜻한 국물이 생각나죠!\n지금 방문하시면 따뜻한 차 서비스 + 인기 메뉴 10% 할인해드립니다."`;
    } else if (weather === '맑음') {
        recommendation = `맑은 날 추천 마케팅\n\n"오늘 날씨가 정말 좋네요!\n테라스에서 시원한 음료와 함께 맛있는 식사 어떠세요?"`;
    } else {
        recommendation = `${weather} 날 추천 마케팅\n\n"${weather}에 대비한 특별 프로모션을 준비했습니다!\n지금 방문하시면 혜택을 드려요."`;
    }

    // 상황에 따른 추가 문구
    if (situation.includes('손님') || situation.includes('매출')) {
        recommendation += `\n\n(현재 상황 반영) 매출 회복을 위한 타겟 마케팅으로 추천드려요.`;
    }

    contentBox.innerText = recommendation;
    resultBox.classList.remove('hidden');
}

function executeMarketing() {
    const resultBox = document.getElementById('execution-result');
    const contentBox = document.getElementById('execution-content');

    const effect = Math.floor(Math.random() * 15) + 15; // 15~30% 랜덤

    contentBox.innerHTML = `
        <div class="text-emerald-600 font-semibold mb-2">마케팅 실행 완료!</div>
        <div>예상 문의 증가: <span class="font-bold">+${effect}%</span></div>
        <div class="text-sm text-slate-500 mt-1">실제 실행 시 이 정도 효과가 있을 것으로 예상됩니다.</div>
    `;

    document.getElementById('recommendation-result').classList.add('hidden');
    resultBox.classList.remove('hidden');

    // 실행 내역 저장
    saveToHistory(effect);
}

function saveToHistory(effect) {
    let history = JSON.parse(localStorage.getItem('wai_history') || '[]');
    history.unshift({
        date: new Date().toLocaleDateString(),
        effect: effect
    });
    if (history.length > 5) history.pop();
    localStorage.setItem('wai_history', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const list = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('wai_history') || '[]');

    if (history.length === 0) {
        list.innerHTML = '<div class="text-slate-400">아직 실행한 마케팅이 없습니다.</div>';
        return;
    }

    list.innerHTML = history.map(item => `
        <div class="flex justify-between border-b pb-2">
            <span>${item.date}</span>
            <span class="text-emerald-600 font-medium">예상 효과 +${item.effect}%</span>
        </div>
    `).join('');
}

function regenerate() {
    document.getElementById('recommendation-result').classList.add('hidden');
}

function resetAll() {
    document.getElementById('execution-result').classList.add('hidden');
    document.getElementById('recommendation-result').classList.add('hidden');
    document.getElementById('situation').value = '';
}

window.onload = function () {
    loadHistory();
};
