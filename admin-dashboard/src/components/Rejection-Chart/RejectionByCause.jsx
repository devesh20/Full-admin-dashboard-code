import React,{ useState, useEffect } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import axios from 'axios';
// axios.defaults.baseURL = 'http://localhost:3000'
import { CircularProgress } from '@mui/joy';

const RADIAN = Math.PI / 180;
const COLORS = ['#00C49F', '#FFBB28', '#724296', '#f54a00', '#0088FE', '#FF8042', '#8884d8'];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function RejectionByCause() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
	  const endDate = new Date();
	  const startDate = new Date();
	  startDate.setDate(endDate.getDate() - 7);
	  try {
		const response = await axios.post("/api/reports/diecasting",
			{
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
			},
			{ withCredentials: true }
		);

		console.log("API response:", response.data);

		const data = response.data.data || response.data;

		if (!data || !Array.isArray(data)) {
			console.error("Invalid data format received:", data);
			setError("Invalid data format received from API");
			setChartData([]);
			return;
		}

		const groupedByCause = {};

		data.forEach(item => {
      const rawCause = item.rejectionCause || "Unknown";
      const cause = rawCause.trim().toLowerCase();
    
      if (!groupedByCause[cause]) {
        groupedByCause[cause] = {
          name: rawCause.trim(), // recharts expects a "name" field
          value: 0,    // recharts pie uses `value` as key
        };
      }
    
      groupedByCause[cause].value += Number(item.totalQuantityRejected) || 0;
    });
    
    const formattedData = Object.values(groupedByCause).filter(item => item.value > 0);
		console.log("Formatted chart data:", formattedData);
		setChartData(formattedData);
	} catch (error) {
        console.error("Failed to load rejection causes.");
        console.error("Error details:", error.response?.data || error.message);
        setError(`Failed to load rejection causes.`);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="lg:w-[20rem] md:w-[15rem] h-[22rem] sm:w-full bg-white p-4 rounded-sm border border-gray-200 flex flex-col">
      <strong className="text-gray-700 font-medium">Rejection Causes</strong>
      <div className="mt-3 w-full text-xs h-[22rem]">
        {loading ? (
          <div className="w-full h-64 flex items-center justify-center">
            <CircularProgress variant='soft' color="neutral" size='md' thickness={1} />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">{error}</div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">No rejection cause data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={({ chartWidth, chartHeight }) => Math.min(chartWidth, chartHeight) * 0.35}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default RejectionByCause;
