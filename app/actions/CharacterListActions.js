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
      race: payload.race,
      bloodline: payload.bloodline
    };

    if (payload.category === 'Pop') {
      params.genre = 'Pop';
    } else if (payload.category === 'Rock') {
      params.genre = 'Rock';
    } else if (payload.category === 'Classical') {
      params.genre = 'Classical';
    } else if (payload.category === 'Bollywood') {
      params.genre = 'Bollywood';
    } else if (payload.category === 'Hip-Hop') {
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
