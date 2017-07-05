import React from 'react';
import StatsStore from '../stores/StatsStore'
import StatsActions from '../actions/StatsActions';

class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = StatsStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    StatsStore.listen(this.onChange);
    StatsActions.getStats();
  }

  componentWillUnmount() {
    StatsStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className='container'>
        <div className='panel panel-default'>
          <table className='table table-striped'>
            <thead>
            <tr>
              <th colSpan='2'>Stats</th>
            </tr>
            </thead>
            <tbody>


            <tr>
              <td>Rock</td>
              <td>{this.state.rockCount}</td>
            </tr>
            <tr>
              <td>Bollywood</td>
              <td>{this.state.bollywoodCount}</td>
            </tr>
            <tr>
              <td>Pop</td>
              <td>{this.state.popCount}</td>
            </tr>
            <tr>
              <td>Hip-Hop</td>
              <td>{this.state.hipCount}</td>
            </tr>
                  <tr>
              <td>Classical</td>
              <td>{this.state.classicalCount}</td>
            </tr>
            <tr>
              <td>Total number of songs</td>
              <td>{this.state.totalCount}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Stats;
