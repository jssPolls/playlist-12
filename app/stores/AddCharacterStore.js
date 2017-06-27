import alt from '../alt';
import AddCharacterActions from '../actions/AddCharacterActions';

class AddCharacterStore {
  constructor() {
    this.bindActions(AddCharacterActions);
    this.name = '';
    this.artist = '';
    this.genre = '';
    this.helpBlock = '';
    this.nameValidationState = '';
    this.artistValidationState = '';
    this.genreValidationState = '';
//     this.branchValidationState = '';
    this.urlValidationState = '';
  }

  onAddCharacterSuccess(successMessage) {
    this.nameValidationState = 'has-success';
    this.helpBlock = successMessage;
  }

  onAddCharacterFail(errorMessage) {
    this.nameValidationState = 'has-error';
    this.helpBlock = errorMessage;
  }

  onUpdateName(event) {
    this.name = event.target.value;
    this.nameValidationState = '';
    this.helpBlock = '';
  }

  onUpdateArtist(event) {
    this.artist = event.target.value;
    this.artistValidationState = '';
  }
  
  onUpdateGenre(event) {
    this.genre = event.target.value;
    this.genreValidationState = '';
  }
  
//   onUpdateBranch(event) {
//     this.branch = event.target.value;
//     this.branchValidationState = '';
//   }
  
  onUpdateUrl(event) {
    this.url = event.target.value;
    this.urlValidationState = '';
  }

  onInvalidName() {
    this.nameValidationState = 'has-error';
    this.helpBlock = 'Please enter a character name.';
  }

  onInvalidArtist() {
    this.genderValidationState = 'has-error';
  }
  
  onInvalidUrl() {
    this.urlValidationState= 'has-error';
    this.helpBlock = 'Please enter an image url';
  }
}

export default alt.createStore(AddCharacterStore);
