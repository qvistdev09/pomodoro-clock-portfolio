import React from 'react';
import chime from './sounds/chime.wav';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.activeSession = false;
    this.pomodoring = false;
    this.intervalFunc = null;
    this.chime = new Audio(chime);
    this.chimeObject = null;
    this.state = {
      goingToBreak: true,
      breakLength: 5,
      sessionLength: 25,
      currentMinutes: 0,
      currentSeconds: 0,
    };
    this.changeLength = this.changeLength.bind(this);
    this.pomodoroStart = this.pomodoroStart.bind(this);
    this.pomodoroStop = this.pomodoroStop.bind(this);
    this.pomodoroReset = this.pomodoroReset.bind(this);
  }

  componentDidMount() {
    this.chimeObject = document.getElementById('beep');
  }

  pomodoroReset() {
    this.chimeObject.pause();
    this.chimeObject.currentTime = 0;
    this.activeSession = false;
    this.pomodoring = false;
    clearInterval(this.intervalFunc);
    this.setState({
      goingToBreak: true,
      breakLength: 5,
      sessionLength: 25,
      currentMinutes: 0,
      currentSeconds: 0,
    });
  }

  pomodoroStop() {
    this.pomodoring = false;
    clearInterval(this.intervalFunc);
  }

  pomodoroStart() {
    if (this.pomodoring) {
      this.pomodoroStop();
      return;
    }

    this.pomodoring = true;

    if (this.activeSession === false) {
      this.setState((state) => ({
        currentMinutes: state.sessionLength,
        currentSeconds: 0,
      }));

      this.activeSession = true;
    }

    // eslint-disable-next-line
    this.intervalFunc = setInterval(() => {
      this.setState((state) => ({
        currentSeconds: state.currentSeconds - 1,
      }));
      if (this.state.currentMinutes === 0 && this.state.currentSeconds < 0) {
        this.chimeObject.play();
        if (this.state.goingToBreak) {
          this.setState((state) => ({
            currentMinutes: state.breakLength,
            currentSeconds: 0,
            goingToBreak: false,
          }));
        } else {
          this.setState((state) => ({
            currentMinutes: state.sessionLength,
            currentSeconds: 0,
            goingToBreak: true,
          }));
        }
      } else if (this.state.currentSeconds < 0) {
        this.setState((state) => ({
          currentSeconds: 59,
          currentMinutes: state.currentMinutes - 1,
        }));
      }
    }, 1000);
  }

  changeLength(value, property) {
    if (this.pomodoring) {
      return;
    }
    this.activeSession = false;
    if (this.state[property] === 1 && value === -1) {
      return;
    }
    if (this.state[property] === 60 && value === 1) {
      return;
    }
    this.setState((state) => ({
      [property]: state[property] + value,
      goingToBreak: true,
    }));
  }

  render() {
    return (
      <div
        className={this.state.goingToBreak ? 'container' : 'container chill'}
      >
        <div className="grid-item m-small d-col" style={{ gridArea: 'title' }}>
          <h1>
            PO<span className="crazy1">M</span>O
            <span className="crazy2">D</span>ORO CLOCK
          </h1>
          <hr />
        </div>
        <div className="grid-item-grid m-small" style={{ gridArea: 'break' }}>
          <div className="grid-item align-end">
            <p id="break-label">Break Length</p>
          </div>
          <div className="grid-item">
            <i
              className="fas fa-chevron-circle-left clickable"
              onClick={() => this.changeLength(-1, 'breakLength')}
              id="break-decrement"
            ></i>
            <p className="length-nr" id="break-length">
              {this.state.breakLength}
            </p>
            <i
              className="fas fa-chevron-circle-right clickable"
              onClick={() => this.changeLength(1, 'breakLength')}
              id="break-increment"
            ></i>
          </div>
        </div>
        <div className="grid-item-grid m-small" style={{ gridArea: 'session' }}>
          <div className="grid-item align-end">
            <p id="session-label">Session Length</p>
          </div>
          <div className="grid-item">
            <i
              className="fas fa-chevron-circle-left clickable"
              onClick={() => this.changeLength(-1, 'sessionLength')}
              id="session-decrement"
            ></i>
            <p className="length-nr" id="session-length">
              {this.state.sessionLength}
            </p>
            <i
              className="fas fa-chevron-circle-right clickable"
              onClick={() => this.changeLength(1, 'sessionLength')}
              id="session-increment"
            ></i>
          </div>
        </div>
        <div className="grid-item-grid m-small" style={{ gridArea: 'timer' }}>
          <div className="grid-item align-end" id="timer-label">
            {this.state.goingToBreak ? 'Session' : 'Break'}
          </div>
          <div className="grid-item">
            <p className="timer" id="time-left">
              {this.pomodoring && this.state.currentMinutes > 9
                ? this.state.currentMinutes + ':'
                : this.pomodoring && this.state.currentMinutes < 10
                ? '0' + this.state.currentMinutes + ':'
                : !this.pomodoring && this.state.sessionLength < 10
                ? '0' + this.state.sessionLength + ':'
                : this.state.sessionLength + ':'}
              {!this.pomodoring
                ? '00'
                : this.state.currentSeconds < 10
                ? '0' + this.state.currentSeconds
                : this.state.currentSeconds}
            </p>
          </div>
          <audio src={this.chime.src} id="beep" />
        </div>
        <div className="grid-item m-small" style={{ gridArea: 'controls' }}>
          <i
            id="start_stop"
            className="fas fa-play clickable"
            onClick={this.pomodoroStart}
          ></i>
          <i className="fas fa-pause clickable" onClick={this.pomodoroStop}></i>
          <i
            id="reset"
            className="fas fa-redo-alt clickable"
            onClick={this.pomodoroReset}
          ></i>
        </div>
        <div className="grid-item m-small d-col" style={{ gridArea: 'cred' }}>
          <p className="cred">
            by{' '}
            <a
              href="https://github.com/qvistdev09"
              target="_blank"
              rel="noopener noreferrer"
            >
              qvistdev09
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default App;
