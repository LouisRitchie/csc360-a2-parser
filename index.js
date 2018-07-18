const ChartjsNode = require('chartjs-node')
const { exec } = require('child_process')

const dispatches = [0, 5, 10, 15, 20, 25]
const quantums = [50, 100, 250, 500]
// execute some bash as a child process.
const executeChild = command => exec(command, (err, stdout, stderr) => {})

const run_rrsim = () => quantums.map(qSize => dispatches.map(dSize => executeChild(`
  ../a3/simgen 2000 857455 | ../a3/rrsim --quantum ${qSize} --dispatch ${dSize} > ${qSize}-${dSize}.waiting.json && cp ${qSize}-${dSize}.waiting.json ${qSize}-${dSize}.turnaround.json
`)))

const comupute_results = () => {
  const timeData = {}
  quantums.map(qSize => {
    timeData[`q${qSize}`] = { waiting: [], turnaround: [] }
    dispatches.map(dSize => {
      executeChild(`
        vim -u generate_json.waiting.macros -s generate_json.vim ${qSize}-${dSize}.waiting.json
      `)
      executeChild(`
        vim -u generate_json.turnaround.macros -s generate_json.vim ${qSize}-${dSize}.turnaround.json
      `)

      setTimeout(() => {
        const waitingTimes = require(`./${qSize}-${dSize}.waiting.json`)
        const turnaroundTimes = require(`./${qSize}-${dSize}.turnaround.json`)

        timeData[`q${qSize}`].waiting.push(waitingTimes.reduce((acc, curr) => acc + curr) / waitingTimes.length)
        timeData[`q${qSize}`].turnaround.push(turnaroundTimes.reduce((acc, curr) => acc + curr) / turnaroundTimes.length)
      }, 15000)
    })
  })

  return timeData
}


function generate_chart(opts) {
  var chartNode = new ChartjsNode(600, 600)
  return chartNode.drawChart(opts).then(() => {
    return chartNode.getImageBuffer('image/png')
  }).then(buffer => {
    Array.isArray(buffer)
    return chartNode.getImageStream('image/png')
  }).then(streamResult => {
    streamResult.stream
    streamResult.length
    return chartNode.writeImageToFile('image/png', './testimage.png')
  })
}

const waitOptsFactory = timeData => ({
  type: 'line',
  data: {
    labels: [0, 5, 10, 20, 25],
    datasets: [
      {
        label: 'q=50',
        data: timeData.q50.waiting,
        borderColor: 'blue',
        borderWidth: 1,
        fill: false
      },
      {
        label: 'q=100',
        data: timeData.q100.waiting,
        borderColor: 'red',
        borderWidth: 1,
        fill: false
      },
      {
        label: 'q=250',
        data: timeData.q250.waiting,
        borderColor: 'green',
        borderWidth: 1,
        fill: false
      },
      {
        label: 'q=500',
        data: timeData.q500.waiting,
        borderColor: 'purple',
        borderWidth: 1,
        fill: false
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'hi'
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Average Turnaround Time (ticks)'
        },
        ticks: {
          beginAtZero:true
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Dispatch overhead (ticks)'
        },
        ticks: {
          beginAtZero:true
        }
      }]
    }
  }
})

const turnaround_opts = {
  type: 'line',
  data: {
    labels: [0, 5, 10, 20, 25],
    datasets: [
      {
        label: '# of Votes',
        data: [1, 3, 5, 8, 13],
        borderColor: 'blue',
        borderWidth: 1,
        fill: false
      },
      {
        label: '# of Votes',
        data: [2, 4, 6, 8, 11],
        borderColor: 'red',
        borderWidth: 1,
        fill: false
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'hi'
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Dispatch overhead'
        },
        ticks: {
          beginAtZero:true
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Dispatch overhead'
        },
        ticks: {
          beginAtZero:true
        }
      }]
    }
  }
}

// better grab on to something
run_rrsim()
setTimeout(() => {
  const timeData = comupute_results()
  generate_chart(waitOptsFactory(timeData))
}, 12000)
