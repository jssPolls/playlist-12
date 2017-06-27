import alt from '../alt';

class AddCharacterActions {
  constructor() {
    this.generateActions(
      'addCharacterSuccess',
      'addCharacterFail',
      'updateName',
      'updateArtist',
      'updateGenre',
//       'updateBranch',
      'updateUrl',
      'invalidUrl',
      'invalidName',
      'invalidArtist'
    );
  }

  addCharacter(name, artist, genre, url) {
    $.ajax({
      type: 'POST',
      url: '/api/characters',
      data: { name: name, artist: artist, genre: genre, url }
    })
      .done((data) => {
        this.actions.addCharacterSuccess(data.message);
      })
      .fail((jqXhr) => {
        this.actions.addCharacterFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(AddCharacterActions);
