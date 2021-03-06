import React, { Component, Fragment } from "react";
import AudioWrapper from "./AudioWrapper";
import Parser from "icecast-parser";
import { nativeImage } from "electron";
import Segment from "./Segment";
import PlayerSettings from "./PlayerSettings";
import NowPlaying from "./NowPlaying";

const STREAMS = [
  {
    label: "ac96k AAC",
    value: "http://allclassical-ice.streamguys.com/ac96k"
  },
  {
    label: "ac96k MP3",
    value: "http://allclassical-ice.streamguys.com/ac96kmp3"
  },

  {
    label: "ac128kmp3",
    value: "http://allclassical-ice.streamguys.com/ac128kmp3"
  }
];

class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStream: STREAMS[2].value,
      titles: []
    };

    this.changeStream = this.changeStream.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onMetaData = this.onMetaData.bind(this);
    this.songChangeNotification = this.songChangeNotification.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onStop = this.onStop.bind(this);
    this.showSettings = this.showSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
  }

  changeStream(event) {
    this.metaDataParser = null;
    this.setState({
      currentStream: event.target.value,
      titles: [],
      showSettings: false
    });
  }

  onPlay(e) {
    const metaDataParser = new Parser({
      url: this.state.currentStream,
      keepListen: false, // don't listen radio station after metadata was received
      autoUpdate: true, // update metadata after interval
      metadataInterval: 5 // update metadata after 5 seconds
    });
    metaDataParser.on("metadata", this.onMetaData);
    this.metaDataParser = metaDataParser;
  }

  onMetaData(data) {
    if (!this.metaDataParser) return;
    if (this.state.titles[0] !== data.StreamTitle) {
      console.log("Song Change", data);
      this.songChangeNotification(data);
      console.log("New title", data.StreamTitle);
      this.setState({
        titles: [data.StreamTitle].concat(this.state.titles.slice(1))
      });
    }
  }

  songChangeNotification({ StreamTitle }) {
    const composer = StreamTitle.split(" - ")[0];
    const piece = StreamTitle.split(" - ")[1];
    new Notification(composer, {
      body: piece,
      silent: true,
      icon: nativeImage.createFromPath("../images/acico.png")
    });
  }

  onStop() {
    this.metaDataParser = null;
    this.setState({
      titles: []
    });
  }

  showSettings() {
    this.setState({
      showSettings: true
    });
  }

  closeSettings() {
    this.setState({
      showSettings: false
    });
  }

  render() {
    const { currentStream, player, titles, showSettings } = this.state;
    return (
      <Fragment>
        <div className="uk-padding">
          <h3> AllClassical Portland 89.9 FM </h3>
          <span className="settings-btn" onClick={() => this.showSettings()}>
            <i className="fas fa-cog fa-lg" />
          </span>
          <Segment>
            <AudioWrapper
              src={currentStream}
              onPlay={this.onPlay}
              onPause={this.onStop}
            />
          </Segment>
          <Segment>
            <NowPlaying titles={titles} />
          </Segment>
        </div>
        <PlayerSettings
          active={showSettings}
          close={() => this.closeSettings()}
        />
      </Fragment>
    );
  }
}
export { Player as default };
