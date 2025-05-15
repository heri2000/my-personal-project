import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { TDashboardStatistics } from '../api/dashboard';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardMemberCategoriesChart({ statistics } : { statistics: TDashboardStatistics }) {
  const under18Percent = 100 * statistics.ageGroups.under18 / statistics.totalMembers;
  const from19to25Percent = 100 * statistics.ageGroups.from19to25 / statistics.totalMembers;
  const from26to59Percent = 100 * statistics.ageGroups.from26to59 / statistics.totalMembers;
  const over60Percent = 100 * statistics.ageGroups.over60 / statistics.totalMembers;
  const unknownPercent = 100 * statistics.ageGroups.unknown / statistics.totalMembers;

  const data = {
    labels: [
      '<= 18',
      '19-25',
      '26-59',
      '>= 60',
      'Tak diketahui',
    ],
    datasets: [
      {
        label: 'Count',
        data: [
          statistics.ageGroups.under18,
          statistics.ageGroups.from19to25,
          statistics.ageGroups.from26to59,
          statistics.ageGroups.over60,
          statistics.ageGroups.unknown,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.75)',
          'rgba(54, 162, 235, 0.75)',
          'rgba(255, 99, 132, 0.75)',
          'rgba(255, 180, 75, 0.75)',
          'rgba(128, 128, 128, 0.75)',
          'rgba(153, 102, 255, 0.75)',
          'rgba(255, 159, 64, 0.75)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 180, 75, 1)',
          'rgba(128, 128, 128, 1)',
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
            <td>&lt;= 18 y.o.</td>
            <td>:</td>
            <td className="text-end">{statistics.ageGroups.under18}</td>
            <td className="text-end">{`(${under18Percent.toFixed(1)}%)`}</td>
          </tr>
          <tr>
            <td>19 - 25 y.o.</td>
            <td>:</td>
            <td className="text-end">{statistics.ageGroups.from19to25}</td>
            <td className="text-end">{`(${from19to25Percent.toFixed(1)}%)`}</td>
          </tr>
          <tr>
            <td>26 - 59 y.o.</td>
            <td>:</td>
            <td className="text-end">{statistics.ageGroups.from26to59}</td>
            <td className="text-end">{`(${from26to59Percent.toFixed(1)}%)`}</td>
          </tr>
          <tr>
            <td>&gt;= 60 y.o.</td>
            <td>:</td>
            <td className="text-end">{statistics.ageGroups.over60}</td>
            <td className="text-end">{`(${over60Percent.toFixed(1)}%)`}</td>
          </tr>
          <tr>
            <td>Tak diketahui</td>
            <td>:</td>
            <td className="text-end">{statistics.ageGroups.unknown}</td>
            <td className="text-end">{`(${unknownPercent.toFixed(1)}%)`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
