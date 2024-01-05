// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

import FlashyHooks from "flashy"
import ApexCharts from "../vendor/apexcharts.min.js"

const hooks = {
  Chart: {
        mounted() {
            const chartConfig = JSON.parse(this.el.dataset.config)
            const seriesData = JSON.parse(this.el.dataset.series)
            const categoriesData = JSON.parse(this.el.dataset.categories)
        
            const options = {
              chart: Object.assign({
                background: 'transparent',
              }, chartConfig),
              legend: {
                show: false
              },
              stroke: {
                curve: 'smooth',
                width: 3
              },
              series: seriesData,
              xaxis: {
                categories: categoriesData
              }
            }
        
            const chart = new ApexCharts(this.el, options);
            chart.render();
          }
  },
  Donut: {
      mounted() {
          const seriesData = JSON.parse(this.el.dataset.series)
          const seriesLabels = JSON.parse(this.el.dataset.labels)
      
          const options = {
            chart: {
              type: 'donut'
            },
            legend: {
              show: true,
              showForSingleSeries: false,
              showForNullSeries: true,
              showForZeroSeries: true,
              position: 'right',
              horizontalAlign: 'center', 
              floating: false,
              fontSize: '16px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 300
            },
            series: seriesData,
            labels: seriesLabels,
            plotOptions: {
              pie: {
                donut: {
                  size: 75,
                  labels: {
                    show: true,
                    value: {
                      show: true,
                      fontSize: '28px',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontWeight: 600,
                      offsetY: 16,
                    },
                    total: {
                      showAlways: true,
                      show: true,
                      label: 'Всего ISSI',
                      fontSize: '28px',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontWeight: 500
                    }
                  }
                }
              }
            },
            dataLabels: {
              enabled: false
            }
          }

          const chart = new ApexCharts(this.el, options);
          chart.render();
        }
  },
  Column: {
    mounted() {
        const categories = JSON.parse(this.el.dataset.categories)
        const series = JSON.parse(this.el.dataset.series)
        const height = JSON.parse(this.el.dataset.height)

        const options = {
          series: series,
        chart: {
          type: 'bar',
          height: height,
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: categories,
        },
        fill: {
          opacity: 1
        }
        }

        const chart = new ApexCharts(this.el, options);
        chart.render();

        this.handleEvent("update-dataset", data => {
          chart.updateSeries(data.dataset)
        })
      }
  },
  FlashyHooks
}

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}, hooks})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

window.addEventListener("phx:js-exec", ({ detail }) => {
  document.querySelectorAll(detail.to).forEach(el => {
    liveSocket.execJS(el, el.getAttribute(detail.attr))
  })
})


// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

