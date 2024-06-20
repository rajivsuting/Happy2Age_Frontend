import React from 'react';
import ReactApexChart from 'react-apexcharts';

const Heatmap = ({ arr }) => {
  // Extract unique participants and domains
  const participants = [...new Set(arr?.map(item => item.participant))];
  const domains = [...new Set(arr?.map(item => item.domain))];

  // Transform data into heatmap format
  const heatmapData = domains.map(domain => {
    return {
      name: domain,
      data: participants.map(participant => {
        const item = arr.find(el => el.domain === domain && el.participant === participant);
        return {
          x: participant,
          y: item ? item.score : 0 // Default to 0 if no score is found
        };
      })
    };
  });

  const options = {
    chart: {
      height: 450,
      type: 'heatmap',
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 3,
              color: '#FF0000', // Light red for scores 0-3
              name: 'Low',
            },
            {
              from: 4,
              to: 5,
              color: '#00ff00', // Light green for scores 4-5
              name: 'Medium',
            },
            {
              from: 6,
              to: 7,
              color: '#ffff00', // Light yellow for scores 6-7
              name: 'High',
            },
          ],
        },
      },
    },
    xaxis: {
      type: 'category',
      categories: participants,
    },
    yaxis: {
      type: 'category',
      categories: domains,
    },
    title: {
      text: 'HeatMap Chart with Conditional Coloring',
    },
    grid: {
      padding: {
        right: 20,
      },
    },
  };

  return (
    <div>
      <ReactApexChart options={options} series={heatmapData} type="heatmap"  height={450} />
    </div>
  );
};

export default Heatmap;
