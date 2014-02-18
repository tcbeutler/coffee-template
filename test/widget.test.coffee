assert = require 'assert'

describe 'widget', ->
  Widget = require '../lib/widget'
  widget = new Widget 'value';

  it 'has an attr value', ->
    assert.equal widget.attr, 'value'