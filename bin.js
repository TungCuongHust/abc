const { benchmark_gpu, benchmark_cpu } = require('.')
const { program } = require('commander');
program
  .option('-m, --mode <type>', 'transcode mode: cpu or gpu (require)')
  .option('-f, --ffmpeg <type>', 'path to ffmpeg (require)')
  .option('-fi, --inputFile <type>', 'input File: video file 1080p to create udp thread 1080p (require)')
  .option('-e, --encoder <type>', 'encoder: libx264 or h264_nvenc (require)')
  .option('-p, --preset <type>', 'preset to transcode: cpu(medium, veryfast, superfast) or gpu(ll, llhp, llhq) (require)')
  .option('-o, --output <type>', 'output thread: udp thread (require)')
  .option('-n, --numberDevice <type>', 'gpu card number to benchmark')

program.parse(process.argv);
if (program.mode == undefined || program.ffmpeg == undefined || program.inputFile == undefined || program.encoder == undefined || program.preset == undefined || program.output == undefined) {
  console.log("Please input all the required parameters!")
  console.log("To see the required parameters, type --help")
  process.exit(1)
}
const mode = program.mode
const ffmpeg = program.ffmpeg
const inputFile = program.inputFile
const encoder = program.encoder
const preset = program.preset.toLowerCase()
const output = program.output
const numberDevice = program.numberDevice

if (mode.toLowerCase() == "cpu") {
  benchmark_cpu(ffmpeg, inputFile, encoder, preset, output)
}
if (mode.toLowerCase() == "gpu") {
  benchmark_gpu(ffmpeg, inputFile, encoder, preset, output, numberDevice)
}

