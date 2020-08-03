const { FFMpegProgress } = require('ffmpeg-progress-wrapper');
const { promisify } = require('util')
const exec = require('child_process')
const os = require('os-utils');
const { printMetricsCPU, printMetricsGPU } = require("./printMetrics")
const { unit, numberThreadMax, timeAddProcess, timeCheckStable, speedCheck } = require('./config')
const timeOut = require("./timeout")
const getCpuUsage = () => new Promise((resolve, reject) => {
  os.cpuUsage(val => {
    resolve(val)
  })
})
async function benchmark_cpu(ffmpeg, inputFile, encoder, preset, output) {
  let number = 0
  const streamInput = new FFMpegProgress(`-stream_loop -1 -t 1800 -i ${inputFile} -c copy input_1080_20min.mp4`.split(' '), { cmd: ffmpeg });
  await timeOut(5000)
  for (let i = 0; i < numberThreadMax; ++i) {
    number = number + 1
    console.log("Start process: " + (i + 1))
    const startTime = Date.now()
    if (preset != "veryfast" && preset != "superfast" && preset != "medium") {
      console.log("Preset is not available with cpu benchmark!")
      exec.execSync("rm -f input_1080_20min.mp4")
      process.exit(0)
    }
    const process = new FFMpegProgress(`-re -i input_1080_20min.mp4 -c:v ${encoder} -preset ${preset} -c:a aac -f mpegts ${output}`.split(' '), { cmd: ffmpeg });
    process.on('progress', async (progress) => {
      console.log('Speed of ' + (i + 1) + ": " + progress.speed)
      try {
        const value = await getCpuUsage()
        if ((value > 0.7) === false & (Date.now() - startTime) < timeCheckStable || (progress.speed > speedCheck)) {
          console.log("CPU total usage: " + value * 100 + ' %')
          console.log("Number threads start: " + number)
          console.log("Thread: " + (i + 1))
        }
        if (value > 0.7) {
          if (preset == "veryfast") {
            const type = 'normal'
            printMetrics(type, unit, number)
          }
          if (preset == "superfast") {
            const type = 'big'
            printMetricsCPU(type, unit, number)
          }
          if (preset == "medium") {
            const type = 'small'
            printMetricsCPU(type, unit, number)
          }
        }
        if (((Date.now() - startTime) >= timeCheckStable & (progress.speed < speedCheck))) {
          if (preset == "veryfast") {
            const type = 'normal'
            printMetrics(type, unit, number)
          }
          if (preset == "superfast") {
            const type = 'big'
            printMetricsCPU(type, unit, number)
          }
          if (preset == "medium") {
            const type = 'small'
            printMetricsCPU(type, unit, number)
          }
        }
      } catch (error) {
        console.log(error)
        exec.execSync("rm -f input_1080_20min.mp4")
      }
    });
    await timeOut(timeAddProcess)
  }
}

async function benchmark_gpu(ffmpeg, inputFile, encoder, preset, output, deviceNumber) {
  let number = 0
  const streamInput = new FFMpegProgress(`-stream_loop -1 -t 1800 -i ${inputFile} -c copy input_1080_20min.mp4`.split(' '), { cmd: ffmpeg });
  for (let i = 0; i < numberThreadMax; ++i) {
    number = number + 1
    console.log("Start process: " + (i + 1))
    const startTime = Date.now()
    if (preset != "ll" && preset != "llhp" && preset != "llhq") {
      console.log("Preset is not available with gpu benchmark!")
      exec.execSync("rm -f input_1080_20min.mp4")
      process.exit(0)
    }
    const process = new FFMpegProgress(`-hwaccel cuvid -hwaccel_device ${deviceNumber} -c:v h264_cuvid -i input_1080_20min.mp4 -preset ${preset} -vcodec ${encoder} -acodec copy -f mpegts ${output}`.split(' '), { cmd: ffmpeg });
    process.on('progress', async (progress) => {
      console.log('Speed of ' + (i + 1) + ": " + progress.speed)
      try {
        const value = await getCpuUsage()
        if ((value > 0.7) === false & (Date.now() - startTime) >= timeCheckStable & (progress.speed < speedCheck) === false) {
          console.log("CPU total usage: " + value * 100 + ' %')
          console.log("Number threads start: " + number)
          console.log("Thread: " + (i + 1))
        }
        if (value > 0.7) {
          if (preset == 'll') {
            const type = 'normal'
            const numberThread = number - 1
            const unitBig = Math.floor((number - 1) * unit["1080p"] * 18 / 17) //llhq
            const unitNormal = (number - 1) * unit["1080p"]  //ll
            const unitSmall = Math.floor((number - 1) * unit["1080p"] * 16 / 17) //llhp
            printMetricsGPU(type, numberThread, unitBig, unitNormal, unitSmall)
          }
          if (preset == 'llhq') {
            const type = 'big'
            const numberThread = number - 1
            const unitBig = (number - 1) * unit["1080p"] //llhq
            const unitNormal = Math.floor((number - 1) * unit["1080p"] * 17 / 18)  //ll
            const unitSmall = Math.floor((number - 1) * unit["1080p"] * 16 / 18) //llhp
            printMetricsGPU(type, numberThread, unitBig, unitNormal, unitSmall)
          }
          if (preset == "llhp") {
            const type = 'small'
            const numberThread = number - 1
            const unitBig = Math.floor((number - 1) * unit["1080p"] * 18 / 16) //llhq
            const unitNormal = Math.floor((number - 1) * unit["1080p"] * 17 / 16)  //ll
            const unitSmall = (number - 1) * unit["1080p"] //llhp
            printMetricsGPU(type, numberThread, unitBig, unitNormal, unitSmall)
          }
        }
        if ((Date.now() - startTime) >= timeCheckStable & (progress.speed < speedCheck)) {
          if (preset == 'll') {
            const type = 'normal'
            const numberThread = number - 1
            const unitBig = Math.floor((number - 1) * unit["1080p"] * 18 / 17) //llhq
            const unitNormal = (number - 1) * unit["1080p"]  //ll
            const unitSmall = Math.floor((number - 1) * unit["1080p"] * 16 / 17) //llhp
            printMetricsGPU(type, numberThread, unitBig, unitNormal, unitSmall)
          }
          if (preset == 'llhq') {
            const type = 'big'
            const numberThread = number - 1
            const unitBig = (number - 1) * unit["1080p"] //llhq
            const unitNormal = Math.floor((number - 1) * unit["1080p"] * 17 / 18)  //ll
            const unitSmall = Math.floor((number - 1) * unit["1080p"] * 16 / 18) //llhp
            printMetricsGPU(type, numberThread, unitBig, unitNormal, unitSmall)
          }
          if (preset == "llhp") {
            const type = 'small'
            const numberThread = number - 1
            const unitBig = Math.floor((number - 1) * unit["1080p"] * 18 / 16) //llhq
            const unitNormal = Math.floor((number - 1) * unit["1080p"] * 17 / 16)  //ll
            const unitSmall = (number - 1) * unit["1080p"] //llhp
            printMetricsGPU(type, numberThread, unitBig, unitNormal, unitSmall)
          }
        }
      } catch (error) {
        exec.execSync("rm -f input_1080_20min.mp4")
        console.log(error)
      }
    })
    await timeOut(timeAddProcess)
  }
}

module.exports = { benchmark_cpu, benchmark_gpu }