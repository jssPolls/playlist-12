import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';
import CharacterListStore from '../stores/CharacterListStore';
import CharacterListActions from '../actions/CharacterListActions';

class CharacterList extends React.Component {
  constructor(props) {
    super(props);
    this.state = CharacterListStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    CharacterListStore.listen(this.onChange);
    CharacterListActions.getCharacters(this.props.params);
  }

  componentWillUnmount() {
    CharacterListStore.unlisten(this.onChange);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.params, this.props.params)) {
      CharacterListActions.getCharacters(this.props.params);
    }
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    let charactersList = this.state.characters.map((character, index) => {
      return (

        <div key={character.characterId} className='list-group-item animated fadeIn'>
          <div className='media'>
            <span className='position pull-left'>{index + 1}</span>
            <div className='pull-left thumb-lg'>
              <Link to={'/characters/' + character.characterId}>
                <img className='media-object' src={character.url} />
              </Link>
            </div>
                var YouTube = React.createClass({
  render: function() {
    var videoSrc = {character.url} + 
        this.props.video + "?autoplay=" + 
        this.props.autoplay + "&rel=" + 
        this.props.rel + "&modestbranding=" +
        this.props.modest;
    return (
      <div className="container">
        <iframe className="player" type="text/html" width="20%" height="20%"
  src={videoSrc}
  frameborder="0"/>
      </div>
    );
  }
});

React.render(
  <YouTube video="mYFaghHyMKc" autoplay="0" rel="0" modest="1" />,
  document.body
);
            <div className='media-body'>
              <h4 className='media-heading'>
                <Link to={'/characters/' + character.characterId}>{character.name}</Link>
              </h4>
              <small>Artist: <strong>{character.artist}</strong></small>
              <br />
              <small>Genre: <strong>{character.genre}</strong></small>
              <br />
//               <small>Wins: <strong>{character.wins}</strong> Losses: <strong>{character.losses}</strong>Rating: <strong>{character.rating}</strong></small>
        <small>Youtube URL: <a>{character.url}</a></small>    
        </div>
          </div>
        </div>
      );
    });

    return (
      <div className='container'>
        <div className='list-group'>
          {charactersList}
        </div>
      </div>
    );
  }
}

export default CharacterList;
