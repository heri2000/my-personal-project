import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { TDashboardStatistics } from '../api/dashboard';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardMemberCategoriesChart({ statistics } : { statistics: TDashboardStatistics }) {
  const simpatisanPercent = 100 * statistics.categories.simpatisan / statistics.totalMembers;
  const umumPercent = 100 * statistics.categories.umum / statistics.totalMembers;
  const jemaatAnakPercent = 100 * statistics.categories.jemaatAnak / statistics.totalMembers;

  const data = {
    labels: ['Jemaat Anak', 'Simpatisan', 'Umum'],
    datasets: [
      {
        label: 'Jumlah',
        data: [
          statistics.categories.jemaatAnak,
          statistics.categories.simpatisan,
          statistics.categories.umum,
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
             <td>Simpatisan</td>
             <td>:</td>
             <td className="text-end">{statistics.categories.simpatisan}</td>
             <td className="text-end">{`(${simpatisanPercent.toFixed(1)}%)`}</td>
           </tr>
           <tr>
             <td>Umum</td>
             <td>:</td>
             <td className="text-end">{statistics.categories.umum}</td>
             <td className="text-end">{`(${umumPercent.toFixed(1)}%)`}</td>
           </tr>
           <tr>
             <td>Jemaat Anak</td>
             <td>:</td>
             <td className="text-end">{statistics.categories.jemaatAnak}</td>
             <td className="text-end">{`(${jemaatAnakPercent.toFixed(1)}%)`}</td>
           </tr>
         </tbody>
       </table>
     </div>
  );
}
