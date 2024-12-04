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
          return 'NA';
        }
        return val;
      },
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#000'],
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
        shadeIntensity: 0,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 3,
              color: '#FF0000',
              name: '0-3'
            },
            {
              from: 3.01,
              to: 5,
              color: '#FFFF00',
              name: '4-5'
            },
            {
              from: 5.01,
              to: 7,
              color: '#0f965b',
              name: '6-7'
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
          fontSize: '14px',
          fontWeight: 'bold'
        },
        rotate: -45, // Rotate the labels for better readability
        maxHeight: 110 // Adjust maximum height of the label container
      },
    },
    yaxis: {
      type: 'category',
      categories: domains,
      labels: {
        style: {
          fontSize: '14px',
          fontWeight: 'bold'
        }
      }
    },
    grid: {
      padding: {
        right: 20,
        bottom: 50 // Add padding to the bottom to ensure full visibility
      }
    }
  };
  

  return (
    <div className='w-[100%] flex justify-center items-center m-auto mt-[30px]'>
      <ReactApexChart options={options} series={heatmapData} type="heatmap" width={900} height={500} />
    </div>
  );
};

export default Heatmap;
