import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const forecastData = [
  { time: "06시", temp: 18, rain: 10, emoji: "☀️" },
  { time: "09시", temp: 21, rain: 20, emoji: "⛅" },
  { time: "12시", temp: 24, rain: 40, emoji: "🌤️" },
  { time: "15시", temp: 22, rain: 70, emoji: "🌧️" },
  { time: "18시", temp: 19, rain: 85, emoji: "🌧️" },
  { time: "21시", temp: 17, rain: 60, emoji: "☁️" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-[12px] p-3 shadow-lg">
        <p className="text-xs font-semibold text-gray-900 mb-1">{label}</p>
        <p className="text-xs text-gray-500">기온: {payload[0].value}°C</p>
        <p className="text-xs text-primary">강수확률: {payload[1]?.value || 0}%</p>
      </div>
    );
  }
  return null;
};

export default function WeatherChart() {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={forecastData} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
          <YAxis yAxisId="temp" orientation="left" tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={[15, 30]} />
          <YAxis yAxisId="rain" orientation="right" tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Bar yAxisId="temp" dataKey="temp" radius={[4, 4, 0, 0]} maxBarSize={24}>
            {forecastData.map((entry, index) => (
              <Cell key={index} fill={entry.temp > 23 ? '#FF9A26' : entry.temp < 19 ? '#364cce' : '#33A927'} />
            ))}
          </Bar>
          <Bar yAxisId="rain" dataKey="rain" fill="#364cce" fillOpacity={0.3} radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
