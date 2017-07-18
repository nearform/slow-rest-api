'use strict'

const inherits = require('util').inherits
const EventEmitter = require('events').EventEmitter
const process = require('process')
const os = require('os')
const reInterval = require('reinterval')
const loopbench = require('loopbench')
const gcProfiler = require('gc-profiler')
const hyperid = require('hyperid')()

const net = require('net')
const ChildProcess = require('child_process').ChildProcess
const Timer = process.binding('timer_wrap').Timer
const FSEvent = process.binding('fs_event_wrap').FSEvent

function loadAvg (loadAvg) {
  return {
    '1m': loadAvg[0],
    '5m': loadAvg[1],
    '15m': loadAvg[2]
  }
}

function StatsProducer (optsArg) {
  if (!(this instanceof StatsProducer)) {
    return new StatsProducer(optsArg)
  }
  const opts = optsArg || {}
  this._opts = {
    loopbench: {
      sampleInterval: opts.eventLoopSampleInterval || 500,
      limit: opts.eventLoopLimit || 50
    },
    sampleInterval: opts.sampleInterval || 5,
    tags: opts.tags || []
  }
  this._probing = false
  this._loopbench = undefined
  this._gcProfiler = gcProfiler
  this._gcs = []
  this._statsEmitterID = hyperid()

  this._emitInterval = reInterval(() => this.emit('stats', this._regenerateStats()), this._opts.sampleInterval * 1000)
  this._emitInterval.clear()

  const handlesInfo = this._getHandlesInfo()
  this.stats = {
    timestamp: new Date(),
    id: this._statsEmitterID,
    tags: this._opts.tags,
    process: {
      title: process.title,
      pid: process.pid,
      release: process.release,
      versions: process.versions,
      argv: process.argv,
      execArgv: process.execArgv,
      execPath: process.execPath,
      cpuUsage: process.cpuUsage(),
      memoryUsage: process.memoryUsage(),
      // mainModule: process.mainModule,
      uptime: process.uptime(),
      handles: handlesInfo.handles,
      openServers: handlesInfo.openServers
    },
    system: {
      cpus: os.cpus(),
      uptime: os.uptime(),
      freemem: os.freemem(),
      loadavg: loadAvg(os.loadavg()),
      hostname: os.hostname(),
      platform: process.platform,
      arch: process.arch
    },
    eventLoop: {},
    gcRuns: []
  }
}

inherits(StatsProducer, EventEmitter)

StatsProducer.prototype.start = function () {
  if (this._probing) return

  this._probing = true

  this._loopbench = loopbench(this._opts.loopbench)

  this._gcProfiler.on('gc', (stats) => this._gcs.push(stats))

  this._emitInterval.reschedule(this._opts.sampleInterval * 1000)
}

StatsProducer.prototype.stop = function () {
  if (!this._probing) return

  // emit final stats
  this.emit('stats', this._regenerateStats())

  this._probing = false

  this._loopbench.stop()
  this._loopbench.removeAllListeners()
  this._loopbench = undefined

  this._gcProfiler.removeAllListeners()

  this._emitInterval.clear()
}

StatsProducer.prototype._regenerateStats = function () {
  // update meta
  this.stats.timestamp = new Date()

  this.stats.process.uptime = process.uptime()
  this.stats.process.cpuUsage = process.cpuUsage()
  this.stats.process.memoryUsage = process.memoryUsage()
  const handlesInfo = this._getHandlesInfo()
  this.stats.process.handles = handlesInfo.handles
  this.stats.process.openServers = handlesInfo.openServers
  this.stats.system.uptime = os.uptime()
  this.stats.system.freemem = os.freemem()
  this.stats.system.loadavg = loadAvg(os.loadavg())

  this.stats.eventLoop = {
    delay: this._loopbench.delay,
    limit: this._loopbench.limit,
    overLimit: this._loopbench.overLimit
  }

  this.stats.gcRuns = this._gcs.splice(0)

  return this.stats
}

StatsProducer.prototype._getHandlesInfo = function () {
  const handles = {
    sockets: 0,
    servers: 0,
    timers: 0,
    childProcesses: 0,
    fsWatchers: 0,
    other: 0
  }
  const openServers = []

  for (let handle of process._getActiveHandles()) {
    if (handle instanceof Timer) {
      const timerList = handle._list || handle
      let t = timerList._idleNext
      while (t !== timerList) {
        handles.timers++
        t = t._idleNext
      }
    } else if (handle instanceof net.Socket) {
      handles.sockets++
      openServers.push(handle.address())
    } else if (handle instanceof net.Server) {
      handles.servers++
    } else if (handle instanceof ChildProcess) {
      handles.childProcesses++
    } else if (handle instanceof EventEmitter && typeof handle.start === 'function' && typeof handle.close === 'function' && handle._handle instanceof FSEvent) {
      handles.fsWatchers++
    } else {
      handles.other++
    }
  }

  return {handles, openServers}
}

module.exports = StatsProducer
