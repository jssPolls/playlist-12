import React from 'react';
import {Link} from 'react-router';
import FooterStore from '../stores/FooterStore'
import FooterActions from '../actions/FooterActions';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = FooterStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    FooterStore.listen(this.onChange);
    FooterActions.getTopCharacters();
  }

  componentWillUnmount() {
    FooterStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    let leaderboardCharacters = this.state.characters.map(function(character) {
      return (
        <li key={character.characterId}>
          <Link to={'/characters/' + character.characterId}>
            <img className='thumb-md' src={character.url} />
          </Link>
        </li>
      );
    });

    return (

      <footer>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-5'>
              <h3 className='lead'>Add your favourite songs from the 90's</h3>
              <p><strong></strong></p>
      <p>2k17</p>
           <p>Follow us on <a href="https://www.facebook.com/jsspolls/">Facebook</a></p>
              
            </div>
         </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
