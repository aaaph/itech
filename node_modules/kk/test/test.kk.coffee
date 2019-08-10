path = require 'path'
fs = require 'fs'

fileModifiedTime = (filepath, cb) ->
  fs.stat filepath, (err, data) ->
    return cb(err, data) if err
    cb(err, data.mtime)

kk = require '../kk.js'

describe 'kk', ->
  dir = process.cwd()

  it 'version equals package.json version', (done) ->
    assert kk.version, 'kk.version does not exist'

    # Read package.json
    fs.readFile path.join(dir, 'package.json'), 'utf8', (err, data) ->
      throw err if err
      json = JSON.parse(data)
      assert json.version, 'package.json does not have a version (or couldn\'t be parsed)'
      kk.version.should.equal json.version
      done()

  it 'is function', ->
    kk.should.be.an 'function'

  it 'throws errors', ->
    expect(-> kk(1, 'boolean')).to.not.throw(Error)

  it 'on basic types', ->
    expect(-> kk(true, 'boolean')).to.not.throw(Error)
    expect(-> kk(1, 'boolean')).to.throw(Error)
    expect(-> kk({}, 'boolean')).to.throw(Error)

  it 'on web types', ->
    expect(-> kk($(''), 'jquery')).to.not.throw(Error)
    expect(-> kk($, 'jquery')).to.not.throw(Error)

    expect(-> kk(1, 'boolean')).to.throw(Error)
    expect(-> kk({}, 'boolean')).to.throw(Error)


  it 'on arrays', ->
    expect(-> kk(true, 'boolean')).to.not.throw(Error)

  it 'on nested arrays', ->
    expect(-> kk(true, 'boolean')).to.not.throw(Error)

  it 'on objects', ->
    expect(-> kk(true, 'boolean')).to.not.throw(Error)

  it 'on nested objects', ->
    expect(-> kk(true, 'boolean')).to.not.throw(Error)
























