import alt from '../alt';

class CharacterListActions {
  constructor() {
    this.generateActions(
      'getCharactersSuccess',
      'getCharactersFail'
    );
  }

  getCharacters(payload) {
    let url = '/api/characters/top';
    let params = {
      genre: payload.genre,
      bloodline: payload.bloodline
    };

    if (payload.genre === 'Pop') {
      params.genre = 'Pop';
    } else if (payload.genre === 'Rock') {
      params.genre = 'Rock';
    } else if (payload.genre === 'Classical') {
      params.genre = 'Classical';
    } else if (payload.genre === 'Bollywood') {
      params.genre = 'Bollywood';
    } else if (payload.genre === 'Hip-Hop') {
      params.genre = 'Hip-Hop';
    }
    

    if (payload.category === 'shame') {
      url = '/api/characters/shame';
    }

    $.ajax({ url: url, data: params })
      .done((data) => {
        this.actions.getCharactersSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getCharactersFail(jqXhr);
      });
  }
}

export default alt.createActions(CharacterListActions);
