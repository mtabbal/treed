/** @jsx React.DOM */

var React = require('react')

var Textarea = module.exports = React.createClass({

  /*
  onKeyDown: function (e) {
    if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
      if (e.keyCode == 38 && this.props.goUp) {
        var l = this.getCursorLine()
        if (l === 0 || l === 1) {
          this.props.goUp()
          e.preventDefault()
        }
        return
      }
      if (e.keyCode === 40 && this.props.goDown) {
        var l = this.getCursorLine()
        if (l === -1 || l === 1) {
          this.props.goDown()
          e.preventDefault()
        }
        return
      }
    }
    if (this.props.onKeyDown) this.props.onKeyDown(e)
  },
  */

  // -1 at end
  // 0 at start
  // 1 no content
  // 2 selection not collapsed
  // 3 somewhere in the middle
  getCursorPos: function () {
    var a = this.refs.area.getDOMNode()
    if (a.selectionStart !== a.selectionEnd) {
      return 2
    }
    if (!a.value.length) return 1
    if (a.selectionStart === 0) return 0
    if (a.selectionStart === a.value.length) return -1
    return 3
  },

  // 0 == start
  // -1 == end
  // 1 == there's only one line
  // 2 == middle somewhere
  getCursorLine: function () {
    var s = this.refs.shadow.getDOMNode()
      , a = this.refs.area.getDOMNode()
      , lineHeight = this._fontSize / .875
    if (s.getBoundingClientRect().height <= lineHeight * 1.5) {
      // single line
      return 1
    }
    if (a !== document.activeElement) return 2
    if (a.selectionStart !== a.selectionEnd) return 2
    if (a.selectionStart === 0) return 0
    if (a.selectionEnd === this.props.value.length) return -1
    var t = s.firstChild.nodeValue
      , bt = this.props.value.slice(0, a.selectionStart)
      , at = this.props.value[a.selectionStart]
    if (at !== ' ' && at !== '\n' && at) {
      bt += this.props.value.slice(a.selectionStart).match(/[^\s]+/)[0]
    }
    s.firstChild.nodeValue = bt + ' '
    var h = s.getBoundingClientRect().height
    s.firstChild.nodeValue = t
    if (h <= lineHeight * 1.5) return 0
    var full = a.getBoundingClientRect().height
    if (full - lineHeight * .5 < h) {
      return -1
    }
  },

  resize: function () {
    var shadow = this.refs.shadow.getDOMNode()
      , area = this.refs.area.getDOMNode()
    var style = window.getComputedStyle(shadow)
    this._fontSize = parseInt(style.fontSize, 10)
    area.style.height = style.height
    // var h = this.refs.shadow.getDOMNode().getBoundingClientRect().height
    // if (h < this.props.fontSize / .875) h = this.props.fontSize / .875
    // this.refs.area.getDOMNode().style.height = h + 'px'
  },

  componentDidUpdate: function () {
    this.resize()
  },

  componentDidMount: function () {
    this.resize()
    window.addEventListener('resize', function () {
      this.resize()
    }.bind(this))
  },

  focus: function (start) {
    var inp = this.refs.area.getDOMNode()
      , pos = 0
    if (!start) pos = inp.value.length
    if (inp === document.activeElement) return
    inp.focus()
    inp.selectionStart = inp.selectionEnd = pos
  },

  render: function () {
    return <div className={
      'textarea-grow ' + this.props.className
    }>
      {
        this.transferPropsTo(<textarea
          ref='area'
          className='body_input'
          />)
      }
      <div
        ref='shadow'
        className='shadow'>
        {this.props.value + ' '}
      </div>
    </div>
  }
})
