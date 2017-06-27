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
        var videoSrc = "https://www.youtube.com/watch?v=FA3Co8pbNq0" + 
        this.props.video + "?autoplay=" + 
        this.props.autoplay + "&rel=" + 
        this.props.rel + "&modestbranding=" +
        this.props.modest;
    let charactersList = this.state.characters.map((character, index) => {
      var videoSrc = "https://www.youtube.com/watch?v=FA3Co8pbNq0"
      return (

        <div key={character.characterId} className='list-group-item animated fadeIn'>
          <div className='media'>
            <span className='position pull-left'>{index + 1}</span>
            <div className='media-body'>
            <div className='pull-left thumb-lg'>
        <iframe width="110" height="85" src="https://www.youtube.com/watch?v=YQHsXMglC9A" frameborder="0"></iframe>
            </div>
              <h4 className='media-heading'>
                <Link to={'/characters/' + character.characterId}>{character.name}</Link>
              </h4>
              <small>Artist: <strong>{character.artist}</strong></small>
              <br />
              <small>Genre: <strong>{character.genre}</strong></small>
              <br />
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
