export const participantReportGraph = {
  partciipant: "mongoid",
  attendence: 8,
  TotalnumberOfSessions: 5,
  graphDetails: [
    {
      domainName: "motor skills1",
      average: 3,
      chortaverage: 2,
      numberOfSessions: 1,
    },
    {
      domainName: "motor skills2",
      average: 2,
      chortaverage: 5,
      numberOfSessions: 2,
    },
    {
      domainName: "motor skills3",
      average: 5,
      chortaverage: 3,
      numberOfSessions: 4,
    },
    {
      domainName: "motor skills4",
      average: 3,
      chortaverage: 2,
      numberOfSessions: 1,
    },
    {
      domainName: "motor skills5",
      average: 2,
      chortaverage: 5,
      numberOfSessions: 2,
    },
    {
      domainName: "motor skills6",
      average: 5,
      chortaverage: 3,
      numberOfSessions: 4,
    },
  ],
};

export const cohortDataForGraph = {
    cohort: "mongoid",
    attendence: 8,
    TotalnumberOfSessions: 5,
    graphDetails: [
      {
        domainName: "motor skills1",
        average: 3,
        numberOfSessions: 2,
      },
      {
        domainName: "motor skills2",
        average: 4,
        numberOfSessions: 1,
      },
      {
        domainName: "motor skills3",
        average: 5,
        numberOfSessions: 3,
      },
      {
        domainName: "motor skills4",
        average: 3,
        numberOfSessions: 2,
      },
      {
        domainName: "motor skills5",
        average: 4,
        numberOfSessions: 1,
      },
      {
        domainName: "motor skills6",
        average: 5,
        numberOfSessions: 3,
      },
    ]
  };



  import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

const BarChartComponent = ({ onRendered }) => {
  return (
    <div id="chart-container">
      <BarChart
        width={600}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        onClick={onRendered}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" fill="#8884d8" />
        <Bar dataKey="uv" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

// export default BarChartComponent;



// CaptureChart.js
import { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';

const CaptureChart = ({ onCapture }) => {
  const chartRef = useRef();

  useEffect(() => {
    const captureChartAsImage = async () => {
      if (chartRef.current) {
        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL('image/png');
        onCapture(imgData);
      }
    };

    captureChartAsImage();
  }, [chartRef, onCapture]);

  return <div ref={chartRef}><BarChartComponent /></div>;
};

// export default CaptureChart;



// MyDocument.js

import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 'auto',
  },
});

const MyDocument = ({ data, chartImage }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Title: {data.title}</Text>
        <Text>Content: {data.content}</Text>
      </View>
      {chartImage && (
        <View style={styles.section}>
          <Image src={chartImage} style={styles.image} />
        </View>
      )}
    </Page>
  </Document>
);

// export default MyDocument;











import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';

export const Cohortreport = () => {
  const [chartImage, setChartImage] = useState(null);

  const data = {
    title: 'Dynamic PDF Generation',
    content: 'This content is dynamically generated based on props.',
  };

  const handleCapture = (imgData) => {
    setChartImage(imgData);
  };
  return (
    <div>
      <h1>Generate PDF with Dynamic Data and Bar Chart</h1>
      <CaptureChart onCapture={handleCapture} />
      {chartImage && (
        <>
          {/* <PDFViewer width={600} height={800}>
            <MyDocument data={data} chartImage={chartImage} />
          </PDFViewer> */}
          <PDFDownloadLink document={<MyDocument data={data} chartImage={chartImage} />} fileName="dynamic.pdf">
            {({ blob, url, loading, error }) =>
              loading ? 'Loading document...' : 'Download now!'
            }
          </PDFDownloadLink>
        </>
      )}
    </div>
  )
}

export default Cohortreport