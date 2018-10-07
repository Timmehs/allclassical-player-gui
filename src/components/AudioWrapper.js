import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'

class AudioWrapper extends Component {
  constructor(props) {
    super(props);
    this.audioTag = createRef();
    this.playPause = this.playPause.bind(this);

    this.state = {
      playing: false
    }
  }

  componentDidMount(prevState) {
    this.audioTag.current.addEventListener("play", this.props.onPlay);
    this.audioTag.current.addEventListener("pause", this.props.onPause);
  }


  playPause() {
    const a = this.getAudioTag()
    let playing
    
    if (a.paused) {
      a.play()
      playing = true
    } else {
      a.pause()
      playing = false
    }
    
    this.setState({ playing })
  }

  getAudioTag() { return this.audioTag.current }

  render() {
    const { src } = this.props;
    const btnText = this.state.playing ? "Stop" : "Play"
    return <p>
        <button className="uk-button uk-button-default" onClick={this.playPause}>
          {btnText}
        </button>
        <audio ref={this.audioTag} src={src} />
      </p>;
  }
}

AudioWrapper.propTypes = {
  src: PropTypes.string.isRequired,
  onPlay: PropTypes.func,
  onPause: PropTypes.func
}

export default AudioWrapper