function showSection(section) {
    if (section === 'weather') {
        document.getElementById('weather-modal').classList.remove('hidden');
    } else {
        alert(section + ' 기능은 준비 중입니다.');
    }
}

function generateWeatherMarketing() {
    const type = document.getElementById('weather-select').value;
    const resultBox = document.getElementById('weather-result');

    let text = '';
    if (type === '비') text = `오늘 비가 옵니다 ☔\n\n"비 오는 날엔 따뜻한 국물이 생각나죠! 지금 방문하시면 따뜻한 차 서비스 드립니다."`;
    else if (type === '맑음') text = `오늘 날씨가 정말 좋네요! 🌞\n\n"맑은 하늘 아래에서 맛있는 식사 어떠세요? 테라스 자리 준비되어 있습니다!"`;
    else text = `오늘 ${type}입니다.\n\n${type}에 맞는 특별 프로모션을 준비했습니다!`;

    resultBox.innerHTML = text;
    resultBox.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('weather-modal').classList.add('hidden');
    document.getElementById('weather-result').classList.add('hidden');
}
