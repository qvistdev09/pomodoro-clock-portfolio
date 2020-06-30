import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.activeSession = false;
    this.pomodoring = false;
    this.intervalFunc = null;
    this.state = {
      goingToBreak: true,
      breakLength: 2,
      sessionLength: 1,
      currentMinutes: 0,
      currentSeconds: 0,
    };
    this.changeLength = this.changeLength.bind(this);
    this.pomodoroStart = this.pomodoroStart.bind(this);
    this.pomodoroStop = this.pomodoroStop.bind(this);
    this.pomodoroReset = this.pomodoroReset.bind(this);
  }

  pomodoroReset() {
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
        if (this.state.goingToBreak) {
          this.setState((state) => ({
            currentMinutes: state.breakLength - 1,
            currentSeconds: 59,
            goingToBreak: false,
          }));
        } else {
          this.setState((state) => ({
            currentMinutes: state.sessionLength - 1,
            currentSeconds: 59,
            goingToBreak: true,
          }));
        }
      } else if (this.state.currentSeconds < 0) {
        this.setState((state) => ({
          currentSeconds: 59,
          currentMinutes: state.currentMinutes - 1,
        }));
      }
    }, 50);
  }

  changeLength(value, property) {
    if (this.pomodoring) {
      return;
    }
    this.activeSession = false;
    if (this.state[property] === 1 && value === -1) {
      return;
    }
    if (this.state[property] === 30 && value === 1) {
      return;
    }
    this.setState((state) => ({
      [property]: state[property] + value,
      goingToBreak: true,
    }));
  }

  render() {
    return (
      <div className="container">
        <div className="grid-item m-small d-col" style={{ gridArea: 'title' }}>
          <h1>POMODORO CLOCK</h1>
          <hr />
        </div>
        <div className="grid-item-grid m-small" style={{ gridArea: 'break' }}>
          <div className="grid-item align-end">
            <p>Break length</p>
          </div>
          <div className="grid-item">
            <i
              className="fas fa-chevron-circle-left clickable"
              onClick={() => this.changeLength(-1, 'breakLength')}
            ></i>
            <p className="length-nr">{this.state.breakLength}</p>
            <i
              className="fas fa-chevron-circle-right clickable"
              onClick={() => this.changeLength(1, 'breakLength')}
            ></i>
          </div>
        </div>
        <div className="grid-item-grid m-small" style={{ gridArea: 'session' }}>
          <div className="grid-item align-end">
            <p>Session length</p>
          </div>
          <div className="grid-item">
            <i
              className="fas fa-chevron-circle-left clickable"
              onClick={() => this.changeLength(-1, 'sessionLength')}
            ></i>
            <p className="length-nr">{this.state.sessionLength}</p>
            <i
              className="fas fa-chevron-circle-right clickable"
              onClick={() => this.changeLength(1, 'sessionLength')}
            ></i>
          </div>
        </div>
        <div className="grid-item-grid m-small" style={{ gridArea: 'timer' }}>
          <div className="grid-item align-end">Session</div>
          <div className="grid-item">
            <p className="timer">
              {this.pomodoring
                ? this.state.currentMinutes + ':'
                : this.state.sessionLength + ':'}
              {!this.pomodoring
                ? '00'
                : this.state.currentSeconds < 10
                ? '0' + this.state.currentSeconds
                : this.state.currentSeconds}
            </p>
          </div>
        </div>
        <div className="grid-item m-small" style={{ gridArea: 'controls' }}>
          <i className="fas fa-play clickable" onClick={this.pomodoroStart}></i>
          <i className="fas fa-pause clickable" onClick={this.pomodoroStop}></i>
          <i className="fas fa-redo-alt clickable" onClick={this.pomodoroReset}></i>
        </div>
        <div className="grid-item m-small d-col" style={{ gridArea: 'cred' }}>
          <p className="cred">
            by{' '}
            <a
              href="https://github.com/qvistsson"
              target="_blank"
              rel="noopener noreferrer"
            >
              Qvistsson
            </a>
          </p>
          <p className="cred">
            {this.state.goingToBreak ? 'Work time!' : 'Break!'}
          </p>
        </div>
      </div>
    );
  }
}

export default App;
