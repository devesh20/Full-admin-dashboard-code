import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { CircularProgress } from '@mui/joy';


// const data =
// [
//     { name: 'Jan', Produced: 500, Rejected: 350 },
//     { name: 'Feb', Produced: 480, Rejected: 320 },
//     { name: 'Mar', Produced: 510, Rejected: 300 },
//     { name: 'Apr', Produced: 550, Rejected: 280 },
//     { name: 'May', Produced: 530, Rejected: 260 },
//     { name: 'Jun', Produced: 520, Rejected: 250 },
//     { name: 'Jul', Produced: 540, Rejected: 270 },
//     { name: 'Aug', Produced: 560, Rejected: 240 },
//     { name: 'Sep', Produced: 550, Rejected: 230 },
//     { name: 'Oct', Produced: 570, Rejected: 220 },
//     { name: 'Nov', Produced: 580, Rejected: 210 },
//     { name: 'Dec', Produced: 590, Rejected: 200 }
//   ];

export default function RejectionChart() {
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

		const capitalize = (str) =>
			str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "Unknown";

		const sortedData = data.sort(
			(a, b) => new Date(a.createdAt) - new Date(b.createdAt)
		  );

		// Group by castingName (you can ignore rejectionCause for this chart)
		const groupedByCasting = {};

		sortedData.forEach((item) => {
			const name = capitalize(item.castingName?.trim());
	
			if (!groupedByCasting[name]) {
			  groupedByCasting[name] = {
				name,
				Produced: 0,
				Rejected: 0,
			  };
			}
			groupedByCasting[name].Produced += Number(item.totalQuantityProduced) || 0;
			groupedByCasting[name].Rejected += Number(item.totalQuantityRejected) || 0;
		});

		const formattedData = Object.values(groupedByCasting);
		console.log("Formatted chart data:", formattedData);
		setChartData(formattedData);
	} catch (error) {
        console.error("Failed to load rejection data for the past week.");
        console.error("Error details:", error.response?.data || error.message);
        setError(`Failed to load rejection data for the past week.`);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <strong className="text-gray-700 font-medium">Rejections : Past Week </strong>
      <div className="mt-3 w-full text-xs h-[22rem]">
        {loading ? (
          <div className="w-full h-64 flex items-center justify-center">
            <CircularProgress variant='soft' color="neutral" size='md' thickness={1} />
         </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            {error}
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            No rejection data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, wordBreak: 'break-all', whiteSpace: 'normal' }}
                interval={0}
                angle={0}
                textAnchor="middle"
                height={60}
                tickFormatter={(value) => value?.toUpperCase?.() || value}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              {/* <Bar dataKey="Produced" fill="#FF5733" /> */}
              <Bar 
              dataKey="Rejected" 
              shape={(props) => {
                const { index } = props;
                // Define an array of colors for each bar
                const colors = ["#FF5733", "#0047AB", "#28A745", "#FFC107", "#6C757D", "#17A2B8", "#8E44AD"];
                return <rect {...props} fill={colors[index % colors.length]} />;
              }} 
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
