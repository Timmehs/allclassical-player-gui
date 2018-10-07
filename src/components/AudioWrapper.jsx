import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import visualize from "../visualizer";

class AudioWrapper extends Component {
  constructor(props) {
    super(props);
    this.audioTag = createRef();
    this.playPause = this.playPause.bind(this);

    this.state = {
      playing: false
    };
  }

  componentDidUpdate(prevState) {
    this.audioTag.current.addEventListener("play", this.props.onPlay);
    this.audioTag.current.addEventListener("pause", this.props.onPause);
  }

  playPause() {
    const a = this.getAudioTag();
    let playing;

    if (a.paused) {
      this.visualize = this.visualize || visualize();
      a.play();
      playing = true;
    } else {
      a.pause();
      playing = false;
    }

    this.setState({ playing });
  }

  getAudioTag() {
    return this.audioTag.current;
  }

  setVolume(percent) {
    this.getAudioTag().volume = percent;
  }

  render() {
    const { src } = this.props;
    const btnText = this.state.playing ? "Stop" : "Play";
    return (
      <React.Fragment>
        <div className="uk-grid uk-grid-small">
          <div className="uk-width-1-4@s">
            <button
              className="uk-button uk-width-1-1 uk-button-default"
              onClick={this.playPause}
            >
              {btnText}
            </button>
          </div>
          <div style={{ display: "flex" }} className="uk-width-3-4@s">
            <input
              className="uk-range"
              type="range"
              width="50%"
              defaultValue={1}
              onChange={e => this.setVolume(e.target.value)}
              min="0"
              max="1"
              step="0.01"
            />
          </div>
        </div>
        <audio ref={this.audioTag} src={src} />
      </React.Fragment>
    );
  }
}

AudioWrapper.propTypes = {
  src: PropTypes.string.isRequired,
  onPlay: PropTypes.func,
  onPause: PropTypes.func
};

export default AudioWrapper;
