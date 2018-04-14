(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("LokaliseCo", [], factory);
	else if(typeof exports === 'object')
		exports["LokaliseCo"] = factory();
	else
		root["LokaliseCo"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/extract-zip/index.js":
/*!*******************************************!*\
  !*** ./node_modules/extract-zip/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! fs */ "fs")
var path = __webpack_require__(/*! path */ "path")
var yauzl = __webpack_require__(/*! yauzl */ "./node_modules/yauzl/index.js")
var mkdirp = __webpack_require__(/*! mkdirp */ "mkdirp")
var concat = __webpack_require__(/*! concat-stream */ "concat-stream")
var debug = __webpack_require__(/*! debug */ "debug")('extract-zip')

module.exports = function (zipPath, opts, cb) {
  debug('creating target directory', opts.dir)

  if (path.isAbsolute(opts.dir) === false) {
    return cb(new Error('Target directory is expected to be absolute'))
  }

  mkdirp(opts.dir, function (err) {
    if (err) return cb(err)

    fs.realpath(opts.dir, function (err, canonicalDir) {
      if (err) return cb(err)

      opts.dir = canonicalDir

      openZip(opts)
    })
  })

  function openZip () {
    debug('opening', zipPath, 'with opts', opts)

    yauzl.open(zipPath, {lazyEntries: true}, function (err, zipfile) {
      if (err) return cb(err)

      var cancelled = false

      zipfile.readEntry()

      zipfile.on('close', function () {
        if (!cancelled) {
          debug('zip extraction complete')
          cb()
        }
      })

      zipfile.on('entry', function (entry) {
        if (cancelled) {
          debug('skipping entry', entry.fileName, {cancelled: cancelled})
          return
        }

        debug('zipfile entry', entry.fileName)

        if (/^__MACOSX\//.test(entry.fileName)) {
          // dir name starts with __MACOSX/
          zipfile.readEntry()
          return
        }

        var destDir = path.dirname(path.join(opts.dir, entry.fileName))

        mkdirp(destDir, function (err) {
          if (err) {
            cancelled = true
            zipfile.close()
            return cb(err)
          }

          fs.realpath(destDir, function (err, canonicalDestDir) {
            if (err) {
              cancelled = true
              zipfile.close()
              return cb(err)
            }

            var relativeDestDir = path.relative(opts.dir, canonicalDestDir)

            if (relativeDestDir.split(path.sep).indexOf('..') !== -1) {
              cancelled = true
              zipfile.close()
              return cb(new Error('Out of bound path "' + canonicalDestDir + '" found while processing file ' + entry.fileName))
            }

            extractEntry(entry, function (err) {
              // if any extraction fails then abort everything
              if (err) {
                cancelled = true
                zipfile.close()
                return cb(err)
              }
              debug('finished processing', entry.fileName)
              zipfile.readEntry()
            })
          })
        })
      })

      function extractEntry (entry, done) {
        if (cancelled) {
          debug('skipping entry extraction', entry.fileName, {cancelled: cancelled})
          return setImmediate(done)
        }

        if (opts.onEntry) {
          opts.onEntry(entry, zipfile)
        }

        var dest = path.join(opts.dir, entry.fileName)

        // convert external file attr int into a fs stat mode int
        var mode = (entry.externalFileAttributes >> 16) & 0xFFFF
        // check if it's a symlink or dir (using stat mode constants)
        var IFMT = 61440
        var IFDIR = 16384
        var IFLNK = 40960
        var symlink = (mode & IFMT) === IFLNK
        var isDir = (mode & IFMT) === IFDIR

        // Failsafe, borrowed from jsZip
        if (!isDir && entry.fileName.slice(-1) === '/') {
          isDir = true
        }

        // check for windows weird way of specifying a directory
        // https://github.com/maxogden/extract-zip/issues/13#issuecomment-154494566
        var madeBy = entry.versionMadeBy >> 8
        if (!isDir) isDir = (madeBy === 0 && entry.externalFileAttributes === 16)

        // if no mode then default to default modes
        if (mode === 0) {
          if (isDir) {
            if (opts.defaultDirMode) mode = parseInt(opts.defaultDirMode, 10)
            if (!mode) mode = 493 // Default to 0755
          } else {
            if (opts.defaultFileMode) mode = parseInt(opts.defaultFileMode, 10)
            if (!mode) mode = 420 // Default to 0644
          }
        }

        debug('extracting entry', { filename: entry.fileName, isDir: isDir, isSymlink: symlink })

        // reverse umask first (~)
        var umask = ~process.umask()
        // & with processes umask to override invalid perms
        var procMode = mode & umask

        // always ensure folders are created
        var destDir = dest
        if (!isDir) destDir = path.dirname(dest)

        debug('mkdirp', {dir: destDir})
        mkdirp(destDir, function (err) {
          if (err) {
            debug('mkdirp error', destDir, {error: err})
            cancelled = true
            return done(err)
          }

          if (isDir) return done()

          debug('opening read stream', dest)
          zipfile.openReadStream(entry, function (err, readStream) {
            if (err) {
              debug('openReadStream error', err)
              cancelled = true
              return done(err)
            }

            readStream.on('error', function (err) {
              console.log('read err', err)
            })

            if (symlink) writeSymlink()
            else writeStream()

            function writeStream () {
              var writeStream = fs.createWriteStream(dest, {mode: procMode})
              readStream.pipe(writeStream)

              writeStream.on('finish', function () {
                done()
              })

              writeStream.on('error', function (err) {
                debug('write error', {error: err})
                cancelled = true
                return done(err)
              })
            }

            // AFAICT the content of the symlink file itself is the symlink target filename string
            function writeSymlink () {
              readStream.pipe(concat(function (data) {
                var link = data.toString()
                debug('creating symlink', link, dest)
                fs.symlink(link, dest, function (err) {
                  if (err) cancelled = true
                  done(err)
                })
              }))
            }
          })
        })
      }
    })
  }
}


/***/ }),

/***/ "./node_modules/fd-slicer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/fd-slicer/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! fs */ "fs");
var util = __webpack_require__(/*! util */ "util");
var stream = __webpack_require__(/*! stream */ "stream");
var Readable = stream.Readable;
var Writable = stream.Writable;
var PassThrough = stream.PassThrough;
var Pend = __webpack_require__(/*! pend */ "./node_modules/pend/index.js");
var EventEmitter = __webpack_require__(/*! events */ "events").EventEmitter;

exports.createFromBuffer = createFromBuffer;
exports.createFromFd = createFromFd;
exports.BufferSlicer = BufferSlicer;
exports.FdSlicer = FdSlicer;

util.inherits(FdSlicer, EventEmitter);
function FdSlicer(fd, options) {
  options = options || {};
  EventEmitter.call(this);

  this.fd = fd;
  this.pend = new Pend();
  this.pend.max = 1;
  this.refCount = 0;
  this.autoClose = !!options.autoClose;
}

FdSlicer.prototype.read = function(buffer, offset, length, position, callback) {
  var self = this;
  self.pend.go(function(cb) {
    fs.read(self.fd, buffer, offset, length, position, function(err, bytesRead, buffer) {
      cb();
      callback(err, bytesRead, buffer);
    });
  });
};

FdSlicer.prototype.write = function(buffer, offset, length, position, callback) {
  var self = this;
  self.pend.go(function(cb) {
    fs.write(self.fd, buffer, offset, length, position, function(err, written, buffer) {
      cb();
      callback(err, written, buffer);
    });
  });
};

FdSlicer.prototype.createReadStream = function(options) {
  return new ReadStream(this, options);
};

FdSlicer.prototype.createWriteStream = function(options) {
  return new WriteStream(this, options);
};

FdSlicer.prototype.ref = function() {
  this.refCount += 1;
};

FdSlicer.prototype.unref = function() {
  var self = this;
  self.refCount -= 1;

  if (self.refCount > 0) return;
  if (self.refCount < 0) throw new Error("invalid unref");

  if (self.autoClose) {
    fs.close(self.fd, onCloseDone);
  }

  function onCloseDone(err) {
    if (err) {
      self.emit('error', err);
    } else {
      self.emit('close');
    }
  }
};

util.inherits(ReadStream, Readable);
function ReadStream(context, options) {
  options = options || {};
  Readable.call(this, options);

  this.context = context;
  this.context.ref();

  this.start = options.start || 0;
  this.endOffset = options.end;
  this.pos = this.start;
  this.destroyed = false;
}

ReadStream.prototype._read = function(n) {
  var self = this;
  if (self.destroyed) return;

  var toRead = Math.min(self._readableState.highWaterMark, n);
  if (self.endOffset != null) {
    toRead = Math.min(toRead, self.endOffset - self.pos);
  }
  if (toRead <= 0) {
    self.destroyed = true;
    self.push(null);
    self.context.unref();
    return;
  }
  self.context.pend.go(function(cb) {
    if (self.destroyed) return cb();
    var buffer = new Buffer(toRead);
    fs.read(self.context.fd, buffer, 0, toRead, self.pos, function(err, bytesRead) {
      if (err) {
        self.destroy(err);
      } else if (bytesRead === 0) {
        self.destroyed = true;
        self.push(null);
        self.context.unref();
      } else {
        self.pos += bytesRead;
        self.push(buffer.slice(0, bytesRead));
      }
      cb();
    });
  });
};

ReadStream.prototype.destroy = function(err) {
  if (this.destroyed) return;
  err = err || new Error("stream destroyed");
  this.destroyed = true;
  this.emit('error', err);
  this.context.unref();
};

util.inherits(WriteStream, Writable);
function WriteStream(context, options) {
  options = options || {};
  Writable.call(this, options);

  this.context = context;
  this.context.ref();

  this.start = options.start || 0;
  this.endOffset = (options.end == null) ? Infinity : +options.end;
  this.bytesWritten = 0;
  this.pos = this.start;
  this.destroyed = false;

  this.on('finish', this.destroy.bind(this));
}

WriteStream.prototype._write = function(buffer, encoding, callback) {
  var self = this;
  if (self.destroyed) return;

  if (self.pos + buffer.length > self.endOffset) {
    var err = new Error("maximum file length exceeded");
    err.code = 'ETOOBIG';
    self.destroy();
    callback(err);
    return;
  }
  self.context.pend.go(function(cb) {
    if (self.destroyed) return cb();
    fs.write(self.context.fd, buffer, 0, buffer.length, self.pos, function(err, bytes) {
      if (err) {
        self.destroy();
        cb();
        callback(err);
      } else {
        self.bytesWritten += bytes;
        self.pos += bytes;
        self.emit('progress');
        cb();
        callback();
      }
    });
  });
};

WriteStream.prototype.destroy = function() {
  if (this.destroyed) return;
  this.destroyed = true;
  this.context.unref();
};

util.inherits(BufferSlicer, EventEmitter);
function BufferSlicer(buffer) {
  EventEmitter.call(this);

  this.refCount = 0;
  this.buffer = buffer;
}

BufferSlicer.prototype.read = function(buffer, offset, length, position, callback) {
  var end = position + length;
  var delta = end - this.buffer.length;
  var written = (delta > 0) ? delta : length;
  this.buffer.copy(buffer, offset, position, end);
  setImmediate(function() {
    callback(null, written);
  });
};

BufferSlicer.prototype.write = function(buffer, offset, length, position, callback) {
  buffer.copy(this.buffer, position, offset, offset + length);
  setImmediate(function() {
    callback(null, length, buffer);
  });
};

BufferSlicer.prototype.createReadStream = function(options) {
  options = options || {};
  var readStream = new PassThrough(options);
  readStream.start = options.start || 0;
  readStream.endOffset = options.end;
  readStream.pos = readStream.endOffset || this.buffer.length; // yep, we're already done
  readStream.destroyed = false;
  readStream.write(this.buffer.slice(readStream.start, readStream.pos));
  readStream.end();
  readStream.destroy = function() {
    readStream.destroyed = true;
  };
  return readStream;
};

BufferSlicer.prototype.createWriteStream = function(options) {
  var bufferSlicer = this;
  options = options || {};
  var writeStream = new Writable(options);
  writeStream.start = options.start || 0;
  writeStream.endOffset = (options.end == null) ? this.buffer.length : +options.end;
  writeStream.bytesWritten = 0;
  writeStream.pos = writeStream.start;
  writeStream.destroyed = false;
  writeStream._write = function(buffer, encoding, callback) {
    if (writeStream.destroyed) return;

    var end = writeStream.pos + buffer.length;
    if (end > writeStream.endOffset) {
      var err = new Error("maximum file length exceeded");
      err.code = 'ETOOBIG';
      writeStream.destroyed = true;
      callback(err);
      return;
    }
    buffer.copy(bufferSlicer.buffer, writeStream.pos, 0, buffer.length);

    writeStream.bytesWritten += buffer.length;
    writeStream.pos = end;
    writeStream.emit('progress');
    callback();
  };
  writeStream.destroy = function() {
    writeStream.destroyed = true;
  };
  return writeStream;
};

BufferSlicer.prototype.ref = function() {
  this.refCount += 1;
};

BufferSlicer.prototype.unref = function() {
  this.refCount -= 1;

  if (this.refCount < 0) {
    throw new Error("invalid unref");
  }
};

function createFromBuffer(buffer) {
  return new BufferSlicer(buffer);
}

function createFromFd(fd, options) {
  return new FdSlicer(fd, options);
}


/***/ }),

/***/ "./node_modules/pend/index.js":
/*!************************************!*\
  !*** ./node_modules/pend/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = Pend;

function Pend() {
  this.pending = 0;
  this.max = Infinity;
  this.listeners = [];
  this.waiting = [];
  this.error = null;
}

Pend.prototype.go = function(fn) {
  if (this.pending < this.max) {
    pendGo(this, fn);
  } else {
    this.waiting.push(fn);
  }
};

Pend.prototype.wait = function(cb) {
  if (this.pending === 0) {
    cb(this.error);
  } else {
    this.listeners.push(cb);
  }
};

Pend.prototype.hold = function() {
  return pendHold(this);
};

function pendHold(self) {
  self.pending += 1;
  var called = false;
  return onCb;
  function onCb(err) {
    if (called) throw new Error("callback called twice");
    called = true;
    self.error = self.error || err;
    self.pending -= 1;
    if (self.waiting.length > 0 && self.pending < self.max) {
      pendGo(self, self.waiting.shift());
    } else if (self.pending === 0) {
      var listeners = self.listeners;
      self.listeners = [];
      listeners.forEach(cbListener);
    }
  }
  function cbListener(listener) {
    listener(self.error);
  }
}

function pendGo(self, fn) {
  fn(pendHold(self));
}


/***/ }),

/***/ "./node_modules/yauzl/index.js":
/*!*************************************!*\
  !*** ./node_modules/yauzl/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! fs */ "fs");
var zlib = __webpack_require__(/*! zlib */ "zlib");
var fd_slicer = __webpack_require__(/*! fd-slicer */ "./node_modules/fd-slicer/index.js");
var util = __webpack_require__(/*! util */ "util");
var EventEmitter = __webpack_require__(/*! events */ "events").EventEmitter;
var Transform = __webpack_require__(/*! stream */ "stream").Transform;
var PassThrough = __webpack_require__(/*! stream */ "stream").PassThrough;
var Writable = __webpack_require__(/*! stream */ "stream").Writable;

exports.open = open;
exports.fromFd = fromFd;
exports.fromBuffer = fromBuffer;
exports.fromRandomAccessReader = fromRandomAccessReader;
exports.dosDateTimeToDate = dosDateTimeToDate;
exports.ZipFile = ZipFile;
exports.Entry = Entry;
exports.RandomAccessReader = RandomAccessReader;

function open(path, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = null;
  }
  if (options == null) options = {};
  if (options.autoClose == null) options.autoClose = true;
  if (options.lazyEntries == null) options.lazyEntries = false;
  if (callback == null) callback = defaultCallback;
  fs.open(path, "r", function(err, fd) {
    if (err) return callback(err);
    fromFd(fd, options, function(err, zipfile) {
      if (err) fs.close(fd, defaultCallback);
      callback(err, zipfile);
    });
  });
}

function fromFd(fd, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = null;
  }
  if (options == null) options = {};
  if (options.autoClose == null) options.autoClose = false;
  if (options.lazyEntries == null) options.lazyEntries = false;
  if (callback == null) callback = defaultCallback;
  fs.fstat(fd, function(err, stats) {
    if (err) return callback(err);
    var reader = fd_slicer.createFromFd(fd, {autoClose: true});
    fromRandomAccessReader(reader, stats.size, options, callback);
  });
}

function fromBuffer(buffer, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = null;
  }
  if (options == null) options = {};
  options.autoClose = false;
  if (options.lazyEntries == null) options.lazyEntries = false;
  // i got your open file right here.
  var reader = fd_slicer.createFromBuffer(buffer);
  fromRandomAccessReader(reader, buffer.length, options, callback);
}

function fromRandomAccessReader(reader, totalSize, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = null;
  }
  if (options == null) options = {};
  if (options.autoClose == null) options.autoClose = true;
  if (options.lazyEntries == null) options.lazyEntries = false;
  if (callback == null) callback = defaultCallback;
  if (typeof totalSize !== "number") throw new Error("expected totalSize parameter to be a number");
  if (totalSize > Number.MAX_SAFE_INTEGER) {
    throw new Error("zip file too large. only file sizes up to 2^52 are supported due to JavaScript's Number type being an IEEE 754 double.");
  }

  // the matching unref() call is in zipfile.close()
  reader.ref();

  // eocdr means End of Central Directory Record.
  // search backwards for the eocdr signature.
  // the last field of the eocdr is a variable-length comment.
  // the comment size is encoded in a 2-byte field in the eocdr, which we can't find without trudging backwards through the comment to find it.
  // as a consequence of this design decision, it's possible to have ambiguous zip file metadata if a coherent eocdr was in the comment.
  // we search backwards for a eocdr signature, and hope that whoever made the zip file was smart enough to forbid the eocdr signature in the comment.
  var eocdrWithoutCommentSize = 22;
  var maxCommentSize = 0x10000; // 2-byte size
  var bufferSize = Math.min(eocdrWithoutCommentSize + maxCommentSize, totalSize);
  var buffer = new Buffer(bufferSize);
  var bufferReadStart = totalSize - buffer.length;
  readAndAssertNoEof(reader, buffer, 0, bufferSize, bufferReadStart, function(err) {
    if (err) return callback(err);
    for (var i = bufferSize - eocdrWithoutCommentSize; i >= 0; i -= 1) {
      if (buffer.readUInt32LE(i) !== 0x06054b50) continue;
      // found eocdr
      var eocdrBuffer = buffer.slice(i);

      // 0 - End of central directory signature = 0x06054b50
      // 4 - Number of this disk
      var diskNumber = eocdrBuffer.readUInt16LE(4);
      if (diskNumber !== 0) return callback(new Error("multi-disk zip files are not supported: found disk number: " + diskNumber));
      // 6 - Disk where central directory starts
      // 8 - Number of central directory records on this disk
      // 10 - Total number of central directory records
      var entryCount = eocdrBuffer.readUInt16LE(10);
      // 12 - Size of central directory (bytes)
      // 16 - Offset of start of central directory, relative to start of archive
      var centralDirectoryOffset = eocdrBuffer.readUInt32LE(16);
      // 20 - Comment length
      var commentLength = eocdrBuffer.readUInt16LE(20);
      var expectedCommentLength = eocdrBuffer.length - eocdrWithoutCommentSize;
      if (commentLength !== expectedCommentLength) {
        return callback(new Error("invalid comment length. expected: " + expectedCommentLength + ". found: " + commentLength));
      }
      // 22 - Comment
      // the encoding is always cp437.
      var comment = bufferToString(eocdrBuffer, 22, eocdrBuffer.length, false);

      if (!(entryCount === 0xffff || centralDirectoryOffset === 0xffffffff)) {
        return callback(null, new ZipFile(reader, centralDirectoryOffset, totalSize, entryCount, comment, options.autoClose, options.lazyEntries));
      }

      // ZIP64 format

      // ZIP64 Zip64 end of central directory locator
      var zip64EocdlBuffer = new Buffer(20);
      var zip64EocdlOffset = bufferReadStart + i - zip64EocdlBuffer.length;
      readAndAssertNoEof(reader, zip64EocdlBuffer, 0, zip64EocdlBuffer.length, zip64EocdlOffset, function(err) {
        if (err) return callback(err);

        // 0 - zip64 end of central dir locator signature = 0x07064b50
        if (zip64EocdlBuffer.readUInt32LE(0) !== 0x07064b50) {
          return callback(new Error("invalid ZIP64 End of Central Directory Locator signature"));
        }
        // 4 - number of the disk with the start of the zip64 end of central directory
        // 8 - relative offset of the zip64 end of central directory record
        var zip64EocdrOffset = readUInt64LE(zip64EocdlBuffer, 8);
        // 16 - total number of disks

        // ZIP64 end of central directory record
        var zip64EocdrBuffer = new Buffer(56);
        readAndAssertNoEof(reader, zip64EocdrBuffer, 0, zip64EocdrBuffer.length, zip64EocdrOffset, function(err) {
          if (err) return callback(err);

          // 0 - zip64 end of central dir signature                           4 bytes  (0x06064b50)
          if (zip64EocdrBuffer.readUInt32LE(0) !== 0x06064b50) return callback(new Error("invalid ZIP64 end of central directory record signature"));
          // 4 - size of zip64 end of central directory record                8 bytes
          // 12 - version made by                                             2 bytes
          // 14 - version needed to extract                                   2 bytes
          // 16 - number of this disk                                         4 bytes
          // 20 - number of the disk with the start of the central directory  4 bytes
          // 24 - total number of entries in the central directory on this disk         8 bytes
          // 32 - total number of entries in the central directory            8 bytes
          entryCount = readUInt64LE(zip64EocdrBuffer, 32);
          // 40 - size of the central directory                               8 bytes
          // 48 - offset of start of central directory with respect to the starting disk number     8 bytes
          centralDirectoryOffset = readUInt64LE(zip64EocdrBuffer, 48);
          // 56 - zip64 extensible data sector                                (variable size)
          return callback(null, new ZipFile(reader, centralDirectoryOffset, totalSize, entryCount, comment, options.autoClose, options.lazyEntries));
        });
      });
      return;
    }
    callback(new Error("end of central directory record signature not found"));
  });
}

util.inherits(ZipFile, EventEmitter);
function ZipFile(reader, centralDirectoryOffset, fileSize, entryCount, comment, autoClose, lazyEntries) {
  var self = this;
  EventEmitter.call(self);
  self.reader = reader;
  // forward close events
  self.reader.on("error", function(err) {
    // error closing the fd
    emitError(self, err);
  });
  self.reader.once("close", function() {
    self.emit("close");
  });
  self.readEntryCursor = centralDirectoryOffset;
  self.fileSize = fileSize;
  self.entryCount = entryCount;
  self.comment = comment;
  self.entriesRead = 0;
  self.autoClose = !!autoClose;
  self.lazyEntries = !!lazyEntries;
  self.isOpen = true;
  self.emittedError = false;

  if (!self.lazyEntries) self.readEntry();
}
ZipFile.prototype.close = function() {
  if (!this.isOpen) return;
  this.isOpen = false;
  this.reader.unref();
};

function emitErrorAndAutoClose(self, err) {
  if (self.autoClose) self.close();
  emitError(self, err);
}
function emitError(self, err) {
  if (self.emittedError) return;
  self.emittedError = true;
  self.emit("error", err);
}

ZipFile.prototype.readEntry = function() {
  var self = this;
  if (self.entryCount === self.entriesRead) {
    // done with metadata
    setImmediate(function() {
      if (self.autoClose) self.close();
      if (self.emittedError) return;
      self.emit("end");
    });
    return;
  }
  if (self.emittedError) return;
  var buffer = new Buffer(46);
  readAndAssertNoEof(self.reader, buffer, 0, buffer.length, self.readEntryCursor, function(err) {
    if (err) return emitErrorAndAutoClose(self, err);
    if (self.emittedError) return;
    var entry = new Entry();
    // 0 - Central directory file header signature
    var signature = buffer.readUInt32LE(0);
    if (signature !== 0x02014b50) return emitErrorAndAutoClose(self, new Error("invalid central directory file header signature: 0x" + signature.toString(16)));
    // 4 - Version made by
    entry.versionMadeBy = buffer.readUInt16LE(4);
    // 6 - Version needed to extract (minimum)
    entry.versionNeededToExtract = buffer.readUInt16LE(6);
    // 8 - General purpose bit flag
    entry.generalPurposeBitFlag = buffer.readUInt16LE(8);
    // 10 - Compression method
    entry.compressionMethod = buffer.readUInt16LE(10);
    // 12 - File last modification time
    entry.lastModFileTime = buffer.readUInt16LE(12);
    // 14 - File last modification date
    entry.lastModFileDate = buffer.readUInt16LE(14);
    // 16 - CRC-32
    entry.crc32 = buffer.readUInt32LE(16);
    // 20 - Compressed size
    entry.compressedSize = buffer.readUInt32LE(20);
    // 24 - Uncompressed size
    entry.uncompressedSize = buffer.readUInt32LE(24);
    // 28 - File name length (n)
    entry.fileNameLength = buffer.readUInt16LE(28);
    // 30 - Extra field length (m)
    entry.extraFieldLength = buffer.readUInt16LE(30);
    // 32 - File comment length (k)
    entry.fileCommentLength = buffer.readUInt16LE(32);
    // 34 - Disk number where file starts
    // 36 - Internal file attributes
    entry.internalFileAttributes = buffer.readUInt16LE(36);
    // 38 - External file attributes
    entry.externalFileAttributes = buffer.readUInt32LE(38);
    // 42 - Relative offset of local file header
    entry.relativeOffsetOfLocalHeader = buffer.readUInt32LE(42);

    self.readEntryCursor += 46;

    buffer = new Buffer(entry.fileNameLength + entry.extraFieldLength + entry.fileCommentLength);
    readAndAssertNoEof(self.reader, buffer, 0, buffer.length, self.readEntryCursor, function(err) {
      if (err) return emitErrorAndAutoClose(self, err);
      if (self.emittedError) return;
      // 46 - File name
      var isUtf8 = entry.generalPurposeBitFlag & 0x800
      try {
        entry.fileName = bufferToString(buffer, 0, entry.fileNameLength, isUtf8);
      } catch (e) {
        return emitErrorAndAutoClose(self, e);
      }

      // 46+n - Extra field
      var fileCommentStart = entry.fileNameLength + entry.extraFieldLength;
      var extraFieldBuffer = buffer.slice(entry.fileNameLength, fileCommentStart);
      entry.extraFields = [];
      var i = 0;
      while (i < extraFieldBuffer.length) {
        var headerId = extraFieldBuffer.readUInt16LE(i + 0);
        var dataSize = extraFieldBuffer.readUInt16LE(i + 2);
        var dataStart = i + 4;
        var dataEnd = dataStart + dataSize;
        var dataBuffer = new Buffer(dataSize);
        extraFieldBuffer.copy(dataBuffer, 0, dataStart, dataEnd);
        entry.extraFields.push({
          id: headerId,
          data: dataBuffer,
        });
        i = dataEnd;
      }

      // 46+n+m - File comment
      try {
        entry.fileComment = bufferToString(buffer, fileCommentStart, fileCommentStart + entry.fileCommentLength, isUtf8);
      } catch (e) {
        return emitErrorAndAutoClose(self, e);
      }

      self.readEntryCursor += buffer.length;
      self.entriesRead += 1;

      if (entry.uncompressedSize            === 0xffffffff ||
          entry.compressedSize              === 0xffffffff ||
          entry.relativeOffsetOfLocalHeader === 0xffffffff) {
        // ZIP64 format
        // find the Zip64 Extended Information Extra Field
        var zip64EiefBuffer = null;
        for (var i = 0; i < entry.extraFields.length; i++) {
          var extraField = entry.extraFields[i];
          if (extraField.id === 0x0001) {
            zip64EiefBuffer = extraField.data;
            break;
          }
        }
        if (zip64EiefBuffer == null) return emitErrorAndAutoClose(self, new Error("expected Zip64 Extended Information Extra Field"));
        var index = 0;
        // 0 - Original Size          8 bytes
        if (entry.uncompressedSize === 0xffffffff) {
          if (index + 8 > zip64EiefBuffer.length) return emitErrorAndAutoClose(self, new Error("Zip64 Extended Information Extra Field does not include Original Size"));
          entry.uncompressedSize = readUInt64LE(zip64EiefBuffer, index);
          index += 8;
        }
        // 8 - Compressed Size        8 bytes
        if (entry.compressedSize === 0xffffffff) {
          if (index + 8 > zip64EiefBuffer.length) return emitErrorAndAutoClose(self, new Error("Zip64 Extended Information Extra Field does not include Compressed Size"));
          entry.compressedSize = readUInt64LE(zip64EiefBuffer, index);
          index += 8;
        }
        // 16 - Relative Header Offset 8 bytes
        if (entry.relativeOffsetOfLocalHeader === 0xffffffff) {
          if (index + 8 > zip64EiefBuffer.length) return emitErrorAndAutoClose(self, new Error("Zip64 Extended Information Extra Field does not include Relative Header Offset"));
          entry.relativeOffsetOfLocalHeader = readUInt64LE(zip64EiefBuffer, index);
          index += 8;
        }
        // 24 - Disk Start Number      4 bytes
      }

      // validate file size
      if (entry.compressionMethod === 0) {
        if (entry.compressedSize !== entry.uncompressedSize) {
          var msg = "compressed/uncompressed size mismatch for stored file: " + entry.compressedSize + " != " + entry.uncompressedSize;
          return emitErrorAndAutoClose(self, new Error(msg));
        }
      }

      // validate file name
      if (entry.fileName.indexOf("\\") !== -1) return emitErrorAndAutoClose(self, new Error("invalid characters in fileName: " + entry.fileName));
      if (/^[a-zA-Z]:/.test(entry.fileName) || /^\//.test(entry.fileName)) return emitErrorAndAutoClose(self, new Error("absolute path: " + entry.fileName));
      if (entry.fileName.split("/").indexOf("..") !== -1) return emitErrorAndAutoClose(self, new Error("invalid relative path: " + entry.fileName));
      self.emit("entry", entry);

      if (!self.lazyEntries) self.readEntry();
    });
  });
};

ZipFile.prototype.openReadStream = function(entry, callback) {
  var self = this;
  if (!self.isOpen) return callback(new Error("closed"));
  // make sure we don't lose the fd before we open the actual read stream
  self.reader.ref();
  var buffer = new Buffer(30);
  readAndAssertNoEof(self.reader, buffer, 0, buffer.length, entry.relativeOffsetOfLocalHeader, function(err) {
    try {
      if (err) return callback(err);
      // 0 - Local file header signature = 0x04034b50
      var signature = buffer.readUInt32LE(0);
      if (signature !== 0x04034b50) return callback(new Error("invalid local file header signature: 0x" + signature.toString(16)));
      // all this should be redundant
      // 4 - Version needed to extract (minimum)
      // 6 - General purpose bit flag
      // 8 - Compression method
      // 10 - File last modification time
      // 12 - File last modification date
      // 14 - CRC-32
      // 18 - Compressed size
      // 22 - Uncompressed size
      // 26 - File name length (n)
      var fileNameLength = buffer.readUInt16LE(26);
      // 28 - Extra field length (m)
      var extraFieldLength = buffer.readUInt16LE(28);
      // 30 - File name
      // 30+n - Extra field
      var localFileHeaderEnd = entry.relativeOffsetOfLocalHeader + buffer.length + fileNameLength + extraFieldLength;
      var compressed;
      if (entry.compressionMethod === 0) {
        // 0 - The file is stored (no compression)
        compressed = false;
      } else if (entry.compressionMethod === 8) {
        // 8 - The file is Deflated
        compressed = true;
      } else {
        return callback(new Error("unsupported compression method: " + entry.compressionMethod));
      }
      var fileDataStart = localFileHeaderEnd;
      var fileDataEnd = fileDataStart + entry.compressedSize;
      if (entry.compressedSize !== 0) {
        // bounds check now, because the read streams will probably not complain loud enough.
        // since we're dealing with an unsigned offset plus an unsigned size,
        // we only have 1 thing to check for.
        if (fileDataEnd > self.fileSize) {
          return callback(new Error("file data overflows file bounds: " +
              fileDataStart + " + " + entry.compressedSize + " > " + self.fileSize));
        }
      }
      var readStream = self.reader.createReadStream({start: fileDataStart, end: fileDataEnd});
      var endpointStream = readStream;
      if (compressed) {
        var destroyed = false;
        var inflateFilter = zlib.createInflateRaw();
        readStream.on("error", function(err) {
          // setImmediate here because errors can be emitted during the first call to pipe()
          setImmediate(function() {
            if (!destroyed) inflateFilter.emit("error", err);
          });
        });

        var checkerStream = new AssertByteCountStream(entry.uncompressedSize);
        inflateFilter.on("error", function(err) {
          // forward zlib errors to the client-visible stream
          setImmediate(function() {
            if (!destroyed) checkerStream.emit("error", err);
          });
        });
        checkerStream.destroy = function() {
          destroyed = true;
          inflateFilter.unpipe(checkerStream);
          readStream.unpipe(inflateFilter);
          // TODO: the inflateFilter now causes a memory leak. see Issue #27.
          readStream.destroy();
        };
        endpointStream = readStream.pipe(inflateFilter).pipe(checkerStream);
      }
      callback(null, endpointStream);
    } finally {
      self.reader.unref();
    }
  });
};

function Entry() {
}
Entry.prototype.getLastModDate = function() {
  return dosDateTimeToDate(this.lastModFileDate, this.lastModFileTime);
};

function dosDateTimeToDate(date, time) {
  var day = date & 0x1f; // 1-31
  var month = (date >> 5 & 0xf) - 1; // 1-12, 0-11
  var year = (date >> 9 & 0x7f) + 1980; // 0-128, 1980-2108

  var millisecond = 0;
  var second = (time & 0x1f) * 2; // 0-29, 0-58 (even numbers)
  var minute = time >> 5 & 0x3f; // 0-59
  var hour = time >> 11 & 0x1f; // 0-23

  return new Date(year, month, day, hour, minute, second, millisecond);
}

function readAndAssertNoEof(reader, buffer, offset, length, position, callback) {
  if (length === 0) {
    // fs.read will throw an out-of-bounds error if you try to read 0 bytes from a 0 byte file
    return setImmediate(function() { callback(null, new Buffer(0)); });
  }
  reader.read(buffer, offset, length, position, function(err, bytesRead) {
    if (err) return callback(err);
    if (bytesRead < length) return callback(new Error("unexpected EOF"));
    callback();
  });
}

util.inherits(AssertByteCountStream, Transform);
function AssertByteCountStream(byteCount) {
  Transform.call(this);
  this.actualByteCount = 0;
  this.expectedByteCount = byteCount;
}
AssertByteCountStream.prototype._transform = function(chunk, encoding, cb) {
  this.actualByteCount += chunk.length;
  if (this.actualByteCount > this.expectedByteCount) {
    var msg = "too many bytes in the stream. expected " + this.expectedByteCount + ". got at least " + this.actualByteCount;
    return cb(new Error(msg));
  }
  cb(null, chunk);
};
AssertByteCountStream.prototype._flush = function(cb) {
  if (this.actualByteCount < this.expectedByteCount) {
    var msg = "not enough bytes in the stream. expected " + this.expectedByteCount + ". got only " + this.actualByteCount;
    return cb(new Error(msg));
  }
  cb();
};

util.inherits(RandomAccessReader, EventEmitter);
function RandomAccessReader() {
  EventEmitter.call(this);
  this.refCount = 0;
}
RandomAccessReader.prototype.ref = function() {
  this.refCount += 1;
};
RandomAccessReader.prototype.unref = function() {
  var self = this;
  self.refCount -= 1;

  if (self.refCount > 0) return;
  if (self.refCount < 0) throw new Error("invalid unref");

  self.close(onCloseDone);

  function onCloseDone(err) {
    if (err) return self.emit('error', err);
    self.emit('close');
  }
};
RandomAccessReader.prototype.createReadStream = function(options) {
  var start = options.start;
  var end = options.end;
  if (start === end) {
    var emptyStream = new PassThrough();
    setImmediate(function() {
      emptyStream.end();
    });
    return emptyStream;
  }
  var stream = this._readStreamForRange(start, end);

  var destroyed = false;
  var refUnrefFilter = new RefUnrefFilter(this);
  stream.on("error", function(err) {
    setImmediate(function() {
      if (!destroyed) refUnrefFilter.emit("error", err);
    });
  });
  refUnrefFilter.destroy = function() {
    stream.unpipe(refUnrefFilter);
    refUnrefFilter.unref();
    stream.destroy();
  };

  var byteCounter = new AssertByteCountStream(end - start);
  refUnrefFilter.on("error", function(err) {
    setImmediate(function() {
      if (!destroyed) byteCounter.emit("error", err);
    });
  });
  byteCounter.destroy = function() {
    destroyed = true;
    refUnrefFilter.unpipe(byteCounter);
    refUnrefFilter.destroy();
  };

  return stream.pipe(refUnrefFilter).pipe(byteCounter);
};
RandomAccessReader.prototype._readStreamForRange = function(start, end) {
  throw new Error("not implemented");
};
RandomAccessReader.prototype.read = function(buffer, offset, length, position, callback) {
  var readStream = this.createReadStream({start: position, end: position + length});
  var writeStream = new Writable();
  var written = 0;
  writeStream._write = function(chunk, encoding, cb) {
    chunk.copy(buffer, offset + written, 0, chunk.length);
    written += chunk.length;
    cb();
  };
  writeStream.on("finish", callback);
  readStream.on("error", function(error) {
    callback(error);
  });
  readStream.pipe(writeStream);
};
RandomAccessReader.prototype.close = function(callback) {
  setImmediate(callback);
};

util.inherits(RefUnrefFilter, PassThrough);
function RefUnrefFilter(context) {
  PassThrough.call(this);
  this.context = context;
  this.context.ref();
  this.unreffedYet = false;
}
RefUnrefFilter.prototype._flush = function(cb) {
  this.unref();
  cb();
};
RefUnrefFilter.prototype.unref = function(cb) {
  if (this.unreffedYet) return;
  this.unreffedYet = true;
  this.context.unref();
};

var cp437 = '\u0000☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ';
function bufferToString(buffer, start, end, isUtf8) {
  if (isUtf8) {
    return buffer.toString("utf8", start, end);
  } else {
    var result = "";
    for (var i = start; i < end; i++) {
      result += cp437[buffer[i]];
    }
    return result;
  }
}

function readUInt64LE(buffer, offset) {
  // there is no native function for this, because we can't actually store 64-bit integers precisely.
  // after 53 bits, JavaScript's Number type (IEEE 754 double) can't store individual integers anymore.
  // but since 53 bits is a whole lot more than 32 bits, we do our best anyway.
  var lower32 = buffer.readUInt32LE(offset);
  var upper32 = buffer.readUInt32LE(offset + 4);
  // we can't use bitshifting here, because JavaScript bitshifting only works on 32-bit integers.
  return upper32 * 0x100000000 + lower32;
  // as long as we're bounds checking the result of this function against the total file size,
  // we'll catch any overflow errors, because we already made sure the total file size was within reason.
}

function defaultCallback(err) {
  if (err) throw err;
}


/***/ }),

/***/ "./src/ts/api/languages.ts":
/*!*********************************!*\
  !*** ./src/ts/api/languages.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __webpack_require__(/*! ../services/request */ "./src/ts/services/request.ts");
var Languages = (function (_super) {
    __extends(Languages, _super);
    function Languages(token) {
        return _super.call(this, token) || this;
    }
    Languages.prototype.listSystemLanguages = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.get('language/listall')];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Languages.prototype.list = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.get('language/list', {
                            id: id
                        })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Languages.prototype.add = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('language/add', data)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Languages.prototype.setProperties = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('language/add', data)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Languages.prototype.remove = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('language/remove', data)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    return Languages;
}(request_1.Request));
exports.Languages = Languages;


/***/ }),

/***/ "./src/ts/api/projects.ts":
/*!********************************!*\
  !*** ./src/ts/api/projects.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __webpack_require__(/*! ../services/request */ "./src/ts/services/request.ts");
var extract = __webpack_require__(/*! extract-zip */ "./node_modules/extract-zip/index.js");
var os = __webpack_require__(/*! os */ "os");
var path = __webpack_require__(/*! path */ "path");
var http = __webpack_require__(/*! https */ "https");
var fs = __webpack_require__(/*! fs */ "fs");
var ExportEmpty;
(function (ExportEmpty) {
    ExportEmpty["empty"] = "empty";
    ExportEmpty["base"] = "base";
    ExportEmpty["skip"] = "skip";
})(ExportEmpty = exports.ExportEmpty || (exports.ExportEmpty = {}));
var ExportSort;
(function (ExportSort) {
    ExportSort["first_added"] = "first_added";
    ExportSort["last_added"] = "last_added";
    ExportSort["last_updated"] = "last_updated";
    ExportSort["a_z"] = "a_z";
    ExportSort["z_a"] = "z_a";
})(ExportSort = exports.ExportSort || (exports.ExportSort = {}));
var JavaPropertiesEncoding;
(function (JavaPropertiesEncoding) {
    JavaPropertiesEncoding["utf8"] = "utf-8";
    JavaPropertiesEncoding["latin1"] = "latin-1";
})(JavaPropertiesEncoding = exports.JavaPropertiesEncoding || (exports.JavaPropertiesEncoding = {}));
var Projects = (function (_super) {
    __extends(Projects, _super);
    function Projects(token) {
        return _super.call(this, token) || this;
    }
    Projects.prototype.list = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.get('project/list')];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.add = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('project/add', data)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('project/remove', { id: id })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.import = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data.file = fs.createReadStream(path.resolve(data.file));
                        return [4, this.post('project/import', data)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.export = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('project/export', data)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.uploadScreenShot = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('project/screenshot', data)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.createSnapshot = function (id, title) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('project/export', {
                            id: id,
                            title: title
                        })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.empty = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('project/export', {
                            id: id
                        })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.exportToPath = function (filesPath, data) {
        return __awaiter(this, void 0, void 0, function () {
            var tmpDir, exportData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tmpDir = os.tmpdir();
                        return [4, this.export(data)];
                    case 1:
                        exportData = _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (exportData.response.code === "200") {
                                    var tempFilePath_1 = path.resolve(tmpDir, data.id + ".zip");
                                    var file_1 = fs.createWriteStream(tempFilePath_1);
                                    http.get(exportData.bundle.full_file, function (res) {
                                        res.pipe(file_1);
                                        res.on('end', function () {
                                            extract(tempFilePath_1, { dir: path.resolve(filesPath) }, function (err) {
                                                resolve(exportData);
                                            });
                                        });
                                    });
                                }
                                else {
                                    console.error("Export error: " + exportData.response.code + " - " + exportData.response.message);
                                    reject(exportData.response);
                                }
                            })];
                }
            });
        });
    };
    return Projects;
}(request_1.Request));
exports.Projects = Projects;


/***/ }),

/***/ "./src/ts/api/strings.ts":
/*!*******************************!*\
  !*** ./src/ts/api/strings.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __webpack_require__(/*! ../services/request */ "./src/ts/services/request.ts");
var Strings = (function (_super) {
    __extends(Strings, _super);
    function Strings(token) {
        return _super.call(this, token) || this;
    }
    Strings.prototype.list = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('string/list/', params)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Strings.prototype.add = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('string/set', params)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Strings.prototype.remove = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('string/list/', params)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    return Strings;
}(request_1.Request));
exports.Strings = Strings;


/***/ }),

/***/ "./src/ts/index.ts":
/*!*************************!*\
  !*** ./src/ts/index.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var projects_1 = __webpack_require__(/*! ./api/projects */ "./src/ts/api/projects.ts");
var strings_1 = __webpack_require__(/*! ./api/strings */ "./src/ts/api/strings.ts");
var languages_1 = __webpack_require__(/*! ./api/languages */ "./src/ts/api/languages.ts");
var PluralFormat;
(function (PluralFormat) {
    PluralFormat["generic"] = "generic";
    PluralFormat["json_string"] = "json_string";
    PluralFormat["icu"] = "icu";
    PluralFormat["array"] = "array";
    PluralFormat["i18next"] = "i18next";
    PluralFormat["symfony"] = "symfony";
})(PluralFormat = exports.PluralFormat || (exports.PluralFormat = {}));
var PlaceholderFormat;
(function (PlaceholderFormat) {
    PlaceholderFormat["printf"] = "printf";
    PlaceholderFormat["ios"] = "ios";
    PlaceholderFormat["icu"] = "icu";
    PlaceholderFormat["net"] = "net";
    PlaceholderFormat["symfony"] = "symfony";
})(PlaceholderFormat = exports.PlaceholderFormat || (exports.PlaceholderFormat = {}));
var FileFormat;
(function (FileFormat) {
    FileFormat["android_sdk"] = "android_sdk";
    FileFormat["ios_sdk"] = "ios_sdk";
    FileFormat["xml"] = "xml";
    FileFormat["strings"] = "strings";
    FileFormat["csv"] = "csv";
    FileFormat["xlsx"] = "xlsx";
    FileFormat["po"] = "po";
    FileFormat["properties"] = "properties";
    FileFormat["json"] = "json";
    FileFormat["xliff"] = "xliff";
    FileFormat["plist"] = "plist";
    FileFormat["resx"] = "resx";
    FileFormat["js"] = "js";
    FileFormat["react_native"] = "react_native";
    FileFormat["symfony_xliff"] = "symfony_xliff";
    FileFormat["xlf"] = "xlf";
    FileFormat["php"] = "php";
    FileFormat["ini"] = "ini";
    FileFormat["ruby_yaml"] = "ruby_yaml";
    FileFormat["yaml"] = "yaml";
    FileFormat["stf"] = "stf";
    FileFormat["ts"] = "ts";
})(FileFormat = exports.FileFormat || (exports.FileFormat = {}));
var PlatformBitMask;
(function (PlatformBitMask) {
    PlatformBitMask[PlatformBitMask["IOS"] = 1] = "IOS";
    PlatformBitMask[PlatformBitMask["Android"] = 2] = "Android";
    PlatformBitMask[PlatformBitMask["Web"] = 4] = "Web";
    PlatformBitMask[PlatformBitMask["Other"] = 16] = "Other";
})(PlatformBitMask = exports.PlatformBitMask || (exports.PlatformBitMask = {}));
var LokaliseAPI = (function () {
    function LokaliseAPI(token) {
        this.projects = new projects_1.Projects(token);
        this.languages = new languages_1.Languages(token);
        this.strings = new strings_1.Strings(token);
    }
    return LokaliseAPI;
}());
exports.LokaliseAPI = LokaliseAPI;


/***/ }),

/***/ "./src/ts/services/request.ts":
/*!************************************!*\
  !*** ./src/ts/services/request.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var superagent = __webpack_require__(/*! superagent */ "superagent");
var request = __webpack_require__(/*! request */ "request");
var LOKALISE_API_URL = 'https://api.lokalise.co/api/';
var Request = (function () {
    function Request(token) {
        this.token = token;
    }
    Request.prototype.get = function (url, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            superagent.get(LOKALISE_API_URL + url)
                .query(__assign({ api_token: _this.token }, data))
                .end(function (err, res) {
                if (!err) {
                    resolve(res.body);
                }
                else {
                    reject(res);
                }
            });
        });
    };
    Request.prototype.post = function (url, data) {
        var _this = this;
        data = this.arrayPropsToJson(data);
        return new Promise(function (resolve, reject) {
            request.post({
                url: LOKALISE_API_URL + url,
                formData: __assign({ api_token: _this.token }, data)
            }, function (err, res, body) {
                if (!err) {
                    resolve(JSON.parse(body));
                }
                else {
                    reject(res);
                }
            });
        });
    };
    Request.prototype.arrayPropsToJson = function (data) {
        for (var key in data) {
            if (key === 'langs' ||
                key === 'filter' ||
                key === 'include_pids' ||
                key === 'include_tags' ||
                key === 'exclude_tags' ||
                key === 'tags' ||
                key === 'key_ids' ||
                key === 'iso' ||
                key === 'keys' ||
                key === 'data') {
                data[key] = JSON.stringify(data[key]);
            }
        }
        return data;
    };
    return Request;
}());
exports.Request = Request;


/***/ }),

/***/ "concat-stream":
/*!********************************!*\
  !*** external "concat-stream" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("concat-stream");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "mkdirp":
/*!*************************!*\
  !*** external "mkdirp" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mkdirp");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "request":
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),

/***/ "superagent":
/*!*****************************!*\
  !*** external "superagent" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("superagent");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map