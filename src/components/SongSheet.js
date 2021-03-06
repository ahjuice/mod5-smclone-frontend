import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ArrowLine from './ArrowLine';

class SongSheet extends React.Component {
  reduceDenominator(numerator, denominator) {
    let gcd = function gcd(a,b){
      return b ? gcd(b, a%b) : a;
    };
    gcd = gcd(numerator,denominator);
    const reducedDenominator = denominator/gcd;
    return reducedDenominator;
  }

  getNoteValue(reducedDenom) {
    if (reducedDenom === 4 || reducedDenom === 2 || reducedDenom === 1) {
      return 4;
    } else {
      return reducedDenom;
    }
  }

  buildLine(arrowLine, noteValue, totalBeatsElapsed) {
    const bpm = parseInt(this.props.currentSong.bpms['0'], 10);
    const offset = parseInt(this.props.currentSong.offset, 10);
    const triggerTime = this.props.globalOffset + offset + ((totalBeatsElapsed / bpm) * 60000 + this.props.songStartTime);

    return (
      <ArrowLine arrowLine={arrowLine} noteValue={noteValue} triggerTime={triggerTime} />
    );
  }

  buildMeasure(measure, measureBeatsElapsed) {
    const timeDivision = measure.length;

    return measure.map((arrowLine, idx) => {
      const noteValue = this.getNoteValue(this.reduceDenominator(idx, timeDivision));
      const beatIncrement = 4 / timeDivision;

      const currentMeasureBeatsElapsed = beatIncrement * idx;
      // const currentBeat = currentMeasureBeatsElapsed + beatIncrement;
      const totalBeatsElapsed = measureBeatsElapsed + currentMeasureBeatsElapsed;

      return this.buildLine(arrowLine, noteValue, totalBeatsElapsed);
    });
  }

  buildSongSheet() {
    const noteData = this.props.currentSong.notes[0].noteData;

    return noteData.map((measure, idx) => {
      const measureBeatsElapsed = idx * 4;

      return this.buildMeasure(measure, measureBeatsElapsed);
    });
  }

  render() {
    return (
      <div className='song-sheet'>
        {this.buildSongSheet()}
      </div>
    );
  }
}

SongSheet.propTypes = {
  currentSong: PropTypes.object,
  songStartTime: PropTypes.number,
  globalOffset: PropTypes.number
};

const mapStateToProps = (state) => {
  return {
    currentSong: state.currentSong,
    songStartTime: state.songStartTime,
    globalOffset: state.globalOffset
  };
};

export default connect(mapStateToProps)(SongSheet);
