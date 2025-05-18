import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { TDashboardStatistics } from '../api/dashboard';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardMemberGenderChart({ statistics } : { statistics: TDashboardStatistics }) {
  const malePercent = 100 * statistics.male / statistics.totalMembers;
  const femalePercent = 100 * statistics.female / statistics.totalMembers;

  const data = {
    labels: ['Female', 'Male'],
    datasets: [
      {
        label: 'Count',
        data: [statistics.female, statistics.male],
        backgroundColor: [
          'rgba(255, 99, 132, 0.75)',
          'rgba(54, 162, 235, 0.75)',
          'rgba(255, 206, 86, 0.75)',
          'rgba(75, 192, 192, 0.75)',
          'rgba(153, 102, 255, 0.75)',
          'rgba(255, 159, 64, 0.75)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col justify-start items-center mb-8 w-full md:w-1/4">
      <Pie data={data} options={{ plugins: { legend: { position: 'bottom' } } }} />
      <table className="statistics_table w-full mb-2">
        <tbody>
          <tr>
            <td>Male</td>
            <td>:</td>
            <td className="text-end">{statistics.male}</td>
            <td className="text-end">{`(${malePercent.toFixed(1)}%)`}</td>
          </tr>
          <tr>
            <td>Female</td>
            <td>:</td>
            <td className="text-end">{statistics.female}</td>
            <td className="text-end">{`(${femalePercent.toFixed(1)}%)`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
