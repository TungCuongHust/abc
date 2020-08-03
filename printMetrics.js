const exec = require('child_process')
function printMetricsCPU(type, unit, number) {
  console.log("-----------------------------------------------------")
  console.log(`Number_threads_1080p_${type}=${(number - 1)}`)
  console.log("Result_capacity_unit_big=" + Math.floor((number - 1) * unit["1080p"] * 8 / 7))
  console.log("Result_capacity_unit_normal=" + (number - 1) * unit["1080p"])
  console.log("Result_capacity_unit_small=" + Math.floor((number - 1) * unit["1080p"] * 1 / 3))
  console.log(`Result_average_capacity_all_unit=${Math.floor((Math.floor((number - 1) * unit["1080p"] * 8 / 7) + (number - 1) * unit["1080p"] + Math.floor((number - 1) * unit["1080p"] * 1 / 3)) / 3)}`)
  console.log("------------------------------------------------------")
  exec.execSync("rm -f input_1080_20min.mp4")
  process.exit(0)
}

function printMetricsGPU(type, number, unitBig, unitNormal, unitSmall) {
  console.log("-----------------------------------------------------")
  console.log(`Number_threads_1080p_${type}=${(number - 1)}`)
  console.log(`Result_capacity_unit_big=${unitBig}`)
  console.log(`Result_capacity_unit_normal=${unitNormal}`)
  console.log(`Result_capacity_unit_small=${unitSmall}`)
  console.log(`Result_average_capacity_all_unit=${Math.floor((unitBig + unitNormal + unitSmall) / 3)}`)
  console.log("------------------------------------------------------")
  exec.execSync("rm -f input_1080_20min.mp4")
  process.exit(0)
}

module.exports = { printMetricsCPU, printMetricsGPU }