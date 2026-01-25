import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardCharts = ({ stats, viewsData, revenueData, trafficData }) => {
  // Options par défaut pour les graphiques RTL
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        rtl: true,
        textDirection: 'rtl',
      },
      title: {
        display: true,
        textDirection: 'rtl',
      },
    },
  };

  // Graphique des vues par jour
  const viewsChartData = {
    labels: viewsData?.labels || ['𞤀𞤢𞤸𞤢', '𞤀𞤭𞤲𞤭𞥄𞤲', '𞤚𞤢𞤤𞤭𞥄𞤲', '𞤀𞤪𞤦𞤢𞤲', '𞤀𞤭𞤥𞤭𞥄𞤲', '𞤚𞤭𞤥𞤭𞥄𞤲', '𞤔𞤭𞤥𞤭𞥄𞤲'],
    datasets: [
      {
        label: '𞤈𞤵𞤴𞤢𞥄𞤴 𞤫𞥊𞤲𞤣𞤫',
        data: viewsData?.data || [120, 190, 300, 500, 200, 300, 450],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const viewsOptions = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      title: {
        ...defaultOptions.plugins.title,
        display: true,
        text: '𞤈𞤵𞤴𞤢𞥄𞴴 𞤫𞥊𞤲𞤣𞤫 / 𞤴𞤮𞤪',
        font: { size: 16, family: 'Noto Sans Adlam' },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Graphique des revenus mensuels
  const revenueChartData = {
    labels: revenueData?.labels || ['𞤔𞤢𞤲𞤺𞤮𞤤', '𞤊𞤵𞤪𞤭𞥄𞤲', '𞤚𞤢𞤪𞤭𞥄𞤲', '𞤀𞤪𞤦𞤢𞤲', '𞤃𞤭𞥄𞤲', '𞤔𞤭𞤥𞤭𞥄𞤲'],
    datasets: [
      {
        label: '𞤈𞤭𞤲𞤢𞥄𞤲𞤭𞥄𞤲 (GNF)',
        data: revenueData?.data || [65000, 59000, 80000, 81000, 56000, 95000],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const revenueOptions = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      title: {
        ...defaultOptions.plugins.title,
        display: true,
        text: '𞤈𞤭𞤲𞤢𞥄𞤲𞤭𞥄𞤲 𞤥𞤢𞤲𞤧𞤭𞥄𞤲',
        font: { size: 16, family: 'Noto Sans Adlam' },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('fr-GN').format(value) + ' GNF';
          },
        },
      },
    },
  };

  // Graphique des sources de trafic
  const trafficChartData = {
    labels: trafficData?.labels || ['𞤁𞤫𞥄𞤪𞤭𞤳', '𞤐𞤢𞥄𞤴𞤭𞥄𞤲 𞤢𞤪𞤺𞤢𞥄𞤲𞤭𞤺', '𞤈𞤵𞤴𞤢𞥄𞴴 𞤫𞥊𞤲𞤣𞤫', '𞤈𞤭𞤲𞤢𞥄𞤲𞤭𞥄𞤲'],
    datasets: [
      {
        data: trafficData?.data || [3000, 2500, 2000, 1500],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(251, 146, 60)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const trafficOptions = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      title: {
        ...defaultOptions.plugins.title,
        display: true,
        text: '𞤔𞤭𞤥𞤢𞥄𞤲𞤭𞥄𞤲 𞤁𞤭𞤪𞤢𞥄𞤲𞤭𞤺',
        font: { size: 16, family: 'Noto Sans Adlam' },
      },
      legend: {
        position: 'right',
        rtl: true,
      },
    },
  };

  // Articles populaires (Bar Chart)
  const popularArticlesData = {
    labels: stats?.popularArticles?.map(article => article.title.slice(0, 20) + '...') || 
             ['𞤃𞤢𞤦𞤢𞤤 1', '𞤃𞤢𞤦𞤢𞤤 2', '𞤃𞤢𞤦𞤢𞤤 3', '𞤃𞤢𞤦𞤢𞤤 4', '𞤃𞤢𞤦𞤢𞤤 5'],
    datasets: [
      {
        label: '𞤈𞤵𞤴𞤢𞥄𞴴',
        data: stats?.popularArticles?.map(article => article.views) || [2500, 2100, 1800, 1500, 1200],
        backgroundColor: 'rgba(251, 146, 60, 0.8)',
        borderColor: 'rgb(251, 146, 60)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const popularArticlesOptions = {
    ...defaultOptions,
    indexAxis: 'y',
    plugins: {
      ...defaultOptions.plugins,
      title: {
        ...defaultOptions.plugins.title,
        display: true,
        text: '𞤃𞤢𞤦𞤢𞤤𞤫 𞤆𞤫𞥄𞤪𞤭𞥄𞤲',
        font: { size: 16, family: 'Noto Sans Adlam' },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Première ligne: Vues et Revenus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="h-80">
            <Line data={viewsChartData} options={viewsOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="h-80">
            <Bar data={revenueChartData} options={revenueOptions} />
          </div>
        </div>
      </div>

      {/* Deuxième ligne: Trafic et Articles Populaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="h-80">
            <Pie data={trafficChartData} options={trafficOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="h-80">
            <Bar data={popularArticlesData} options={popularArticlesOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
