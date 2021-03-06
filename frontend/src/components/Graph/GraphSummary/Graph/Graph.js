import React from 'react'
import { Line } from 'react-chartjs-2'
import PropTypes from 'prop-types'
import classes from './Graph.module.css'

const Graph = ({ isSavings, labels, data }) => {
  let graph

  if (isSavings) {
    graph = (
      <Line
        data={{
          labels: labels,
          datasets: [
            {
              label: 'Savings',
              data: data.savings,
              backgroundColor: ['rgba(101, 200, 255, 0.2)'],
              borderColor: ['#65C8FF'],
              borderWidth: 2,
              pointStyle: 'rectRounded',
              pointBackgroundColor: '#65C8FF',
              pointBorderColor: '#65C8FF',
              pointRadius: '4',
              pointHoverRadius: '10',
            },
          ],
        }}
        height={300}
        width={600}
        options={{
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: (value) => '$' + value,
                },
              },
            ],
          },
        }}
      />
    )
  } else {
    graph = (
      <Line
        data={{
          labels: labels,
          datasets: [
            {
              label: 'Income',
              data: data.income,
              backgroundColor: ['rgba(5, 242, 155, 0.2)'],
              borderColor: ['#05F29B'],
              borderWidth: 2,
              pointStyle: 'rectRounded',
              pointBackgroundColor: '#05F29B',
              pointBorderColor: '#05F29B',
              pointRadius: '4',
              pointHoverRadius: '10',
            },
            {
              label: 'Expenses',
              data: data.expenses,
              backgroundColor: ['rgba(255, 101, 101, 0.2)'],
              borderColor: ['#FF6565'],
              borderWidth: 2,
              pointStyle: 'rectRounded',
              pointBackgroundColor: '#FF6565',
              pointBorderColor: '#FF6565',
              pointRadius: '4',
              pointHoverRadius: '10',
            },
          ],
        }}
        height={370}
        width={600}
        options={{
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: (value) => '$' + value,
                },
              },
            ],
          },
        }}
      />
    )
  }

  return (
    <div className={isSavings ? classes.GraphSavings : classes.GraphYearly}>
      {graph}
    </div>
  )
}

Graph.propTypes = {
  isSavings: PropTypes.bool,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.object,
}

export default Graph
