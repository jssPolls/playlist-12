import React from 'react';
import {Link} from 'react-router';
import HomeStore from '../stores/HomeStore'
import HomeActions from '../actions/HomeActions';
import {first, without, findWhere} from 'underscore';
const bgImgUrl = "https://raw.githubusercontent.com/jssPolls/popularities/master/home.jpg"

let imgUrl = 'images/berlin.jpg'
let styles = {
root: {

    background: 'url('+ bgImgUrl + ') noRepeat center center fixed',
    backgroundSize: 'cover',
}
};
var sectionStyle = {
  width: "100%",
  height: "130%",
  backgroundImage: 'url(' + bgImgUrl + ') noRepeat center center fixed',
  backgroundSize: 'cover'
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = HomeStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    HomeStore.listen(this.onChange);
    HomeActions.getTwoCharacters();
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleClick(character) {
    var winner = character.characterId;
    var loser = first(without(this.state.characters, findWhere(this.state.characters, { characterId: winner }))).characterId;
    HomeActions.vote(winner, loser);
  }

  render() {

    
    var characterNodes = this.state.characters.map((character, index) => {
      return (
        <div key={character.characterId} className={index === 0 ? 'col-xs-3 col-sm-3 col-md-2 col-md-offset-1' : 'col-xs-3 col-sm-3 col-md-2'}>
          <div className='thumbnail fadeInUp animated'>
//             <img onClick={this.handleClick.bind(this, character)} src={character.url}/>
             <iframe width="110" height="90" src="https://www.youtube.com/embed/BBnN5VLuxKw" frameborder="0"></iframe>

            <div className='caption text-center'>
              <ul className='list-inline'>
                <li><strong>Year:</strong> {character.artist}</li>
                <li><strong>Branch:</strong> {character.genre}</li>
              </ul>
              <h4>
                <Link to={'/characters/' + character.characterId}><strong>{character.name}</strong></Link>
              </h4>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className='container' style={ sectionStyle }>
        <div className='row'>
          {characterNodes}
        </div>
      </div>
    );
  }
}

export default Home;
