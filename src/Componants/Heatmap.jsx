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
      type: 'heatmap',
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px', // Adjust font size here
        fontWeight: 'bold', // Set font weight to bold
        colors: ['#000'] // Set font color to black
      }
    },
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 3.99,
              color: '#FF7F7F', // Light red for scores 0-3.99
              name: 'Low'
            },
            {
              from: 4,
              to: 5.99,
              color: '#faff72', // Light yellow for scores 6-7
              name: 'Medium'
            },
            {
              from: 6,
              to: 7,
              color: '#90ee90', // Light green for scores 4-5.99
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
