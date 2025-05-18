import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { TDashboardStatistics } from '../api/dashboard';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardMemberCategoriesChart({ statistics } : { statistics: TDashboardStatistics }) {
  const associatePercent = 100 * statistics.categories.associate / statistics.totalMembers;
  const generalPercent = 100 * statistics.categories.general / statistics.totalMembers;
  const childPercent = 100 * statistics.categories.child / statistics.totalMembers;

  const data = {
    labels: ['Child', 'Associate', 'General'],
    datasets: [
      {
        label: 'Count',
        data: [
          statistics.categories.child,
          statistics.categories.associate,
          statistics.categories.general,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.75)',
          'rgba(54, 162, 235, 0.75)',
          'rgba(128, 128, 128, 0.75)',
          'rgba(255, 206, 86, 0.75)',
          'rgba(75, 192, 192, 0.75)',
          'rgba(153, 102, 255, 0.75)',
          'rgba(255, 159, 64, 0.75)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(128, 128, 128, 1)',
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
            <td>Associate</td>
            <td>:</td>
            <td className="text-end">{statistics.categories.associate}</td>
            <td className="text-end">{`(${associatePercent.toFixed(1)}%)`}</td>
          </tr>
          <tr>
            <td>General</td>
            <td>:</td>
            <td className="text-end">{statistics.categories.general}</td>
            <td className="text-end">{`(${generalPercent.toFixed(1)}%)`}</td>
          </tr>
          <tr>
            <td>Child</td>
            <td>:</td>
            <td className="text-end">{statistics.categories.child}</td>
            <td className="text-end">{`(${childPercent.toFixed(1)}%)`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
