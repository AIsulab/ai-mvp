import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const forecastData = [
  { time: "06", temp: 18, rain: 10 },
  { time: "09", temp: 21, rain: 20 },
  { time: "12", temp: 24, rain: 40 },
  { time: "15", temp: 22, rain: 70 },
  { time: "18", temp: 19, rain: 85 },
  { time: "21", temp: 17, rain: 60 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-lg">
        <p className="text-[11px] font-semibold text-gray-900">{label}시</p>
        <p className="text-[10px] text-gray-500">기온: {payload[0].value}°C</p>
        <p className="text-[10px] text-gray-500">강수: {payload[1]?.value || 0}%</p>
      </div>
    );
  }
  return null;
};

export default function WeatherChart() {
  return (
    <div className="h-[160px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={forecastData} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#A1A1AA' }} />
          <YAxis yAxisId="temp" orientation="left" tick={{ fontSize: 10, fill: '#A1A1AA' }} domain={[15, 30]} />
          <YAxis yAxisId="rain" orientation="right" tick={{ fontSize: 10, fill: '#A1A1AA' }} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Bar yAxisId="temp" dataKey="temp" radius={[3, 3, 0, 0]} maxBarSize={20}>
            {forecastData.map((entry, index) => (
              <Cell key={index} fill={entry.temp > 23 ? '#F97316' : entry.temp < 19 ? '#3B82F6' : '#22C55E'} />
            ))}
          </Bar>
          <Bar yAxisId="rain" dataKey="rain" fill="#111827" fillOpacity={0.1} radius={[3, 3, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
