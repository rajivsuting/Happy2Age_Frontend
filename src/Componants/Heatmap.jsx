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
          y: item ? item.score : null // Default to 0 if no score is found
        };
      })
    };
  });

  const options = {
    chart: {
      type: 'heatmap',
    },
    dataLabels: {
      enabled: true,
      formatter: function(val, opts) {
        if (val === null) {
          return 'No score';
        }
        return val;
      },
      style: {
        fontSize: '14px', // Adjust font size here
        fontWeight: 'bold', // Set font weight to bold
        colors: ['#000'] // Set font color to black
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          if (val === null) {
            return 'No score';
          }
          return val;
        }
      }
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0, // Disable shading intensity
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 3,
              color: '#FF0000', // Solid red for scores 0-3
              name: 'Low'
            },
            {
              from: 3.01,
              to: 5,
              color: '#FFFF00', // Solid yellow for scores 3.01-5
              name: 'Medium'
            },
            {
              from: 5.01,
              to: 7,
              color: '#008000', // Solid green for scores 5.01-7
              name: 'High'
            }
          ]
        }
      }
    },
    xaxis: {
      type: 'category',
      categories: participants,
      labels: {
        style: {
          fontSize: '14px', // Adjust font size for participants here
          fontWeight: 'bold' // Set font weight to bold for participants
        }
      }
    },
    yaxis: {
      type: 'category',
      categories: domains,
      labels: {
        style: {
          fontSize: '14px', // Adjust font size for domains here
          fontWeight: 'bold' // Set font weight to bold for domains
        }
      }
    },
    grid: {
      padding: {
        right: 20
      }
    }
  };

  return (
    <div className='w-[100%] flex justify-center items-center m-auto mt-[30px]'>
      <ReactApexChart options={options} series={heatmapData} type="heatmap" width={700} height={400} />
    </div>
  );
};

export default Heatmap;
