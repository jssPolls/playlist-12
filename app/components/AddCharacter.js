import React from 'react';
import AddCharacterStore from '../stores/AddCharacterStore';
import AddCharacterActions from '../actions/AddCharacterActions';

class AddCharacter extends React.Component {
  constructor(props) {
    super(props);
    this.state = AddCharacterStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    AddCharacterStore.listen(this.onChange);
  }

  componentWillUnmount() {
    AddCharacterStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();

    var name = this.state.name.trim();
    var artist = this.state.artist;
    var genre = this.state.genre;
    var url = this.state.url;
    var rating = 10;



    if (!name) {
      AddCharacterActions.invalidName();
      this.refs.nameTextField.focus();
    }

    if (!artist) {
      AddCharacterActions.invalidArtist();
    }
    
        if (!url) {
      AddCharacterActions.invalidUrl();
    }

    if (name && artist && genre && url) {
      AddCharacterActions.addCharacter(name, artist, genre, url);
    }
  }

  render() {
    return (
      <div className='container'>
        <div className='row flipInX animated'>
          <div className='col-sm-8'>
            <div className='panel panel-default'>
              <div className='panel-heading'>Add Character</div>
              <div className='panel-body'>
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <div className={'form-group ' + this.state.nameValidationState}>
                    <label className='control-label'>Song Name</label>
                    <input type='text' className='form-control' ref='nameTextField' value={this.state.name}
                           onChange={AddCharacterActions.updateName} autoFocus/>
                    <span className='help-block'>{this.state.helpBlock}</span>
                  </div>
                  <div className={'form-group ' + this.state.urlValidationState}>
                    <label className='control-label'>Youtube URL</label>  <p>(To add image: 1. Open FB profile pic in Browser 2. Click on View Full Size or Open image in new Tab 3. Copy URL)</p>
                    <input type='text' className='form-control' ref='urlTextField' value={this.state.url}
                           onChange={AddCharacterActions.updateUrl} autoFocus/>
                    <span className='help-block'>{this.state.helpBlock}</span>
                  </div>
                  <div className={'form-group ' + this.state.artistValidationState}>
                    <label className='control-label'>Artist</label>
                    <input type='text' className='form-control' ref='artistTextField' value={this.state.artist}
                           onChange={AddCharacterActions.updateArtist} autoFocus/>
                    <span className='help-block'>{this.state.helpBlock}</span>
                  </div>
                  <div className={'form-group ' + this.state.genderValidationState}>
                    <div className='radio radio-inline'>
                      <input type='radio' name='gender' id='female' value='Female' checked={this.state.gender === 'Female'}
                             onChange={AddCharacterActions.updateGender}/>
                      <label htmlFor='female'>Female</label>
                    </div>
                    <div className='radio radio-inline'>
                      <input type='radio' name='gender' id='male' value='Male' checked={this.state.gender === 'Male'}
                             onChange={AddCharacterActions.updateGender}/>
                      <label htmlFor='male'>Male</label>
                    </div>
                  </div>
                  <div className={'form-group ' + this.state.genreValidationState}>
                    <div className='radio radio-inline'>
                      <input type='radio' name='genre' id='Pop' value='Pop' checked={this.state.genre === 'Pop'}
                             onChange={AddCharacterActions.updateGenre}/>
                      <label htmlFor='Pop'>Pop</label>
                    </div>
                    <div className='radio radio-inline'>
                      <input type='radio' name='year' id='Rock' value='Rock' checked={this.state.genre === 'Rock'}
                             onChange={AddCharacterActions.updateGenre}/>
                      <label htmlFor='Rock'>Rock</label>
                    </div>
                    <div className='radio radio-inline'>
                      <input type='radio' name='year' id='Hip-Hop' value='Hip-Hop' checked={this.state.genre === 'Hip-Hop'}
                             onChange={AddCharacterActions.updateGenre}/>
                      <label htmlFor='Hip-Hop'>Hip-Hop</label>
                    </div>
                    <div className='radio radio-inline'>
                      <input type='radio' name='genre' id='Classical' value='Classical' checked={this.state.genre === 'Classical'}
                             onChange={AddCharacterActions.updateGenre}/>
                      <label htmlFor='Classical'>Classical</label>
                    </div>
                    <div className='radio radio-inline'>
                      <input type='radio' name='genre' id='Bollywood' value='Bollywood' checked={this.state.genre === 'Bollywood'}
                             onChange={AddCharacterActions.updateGenre}/>
                      <label htmlFor='Bollywood'>Bollywood</label>
                    </div>
                  </div>
                  <div>                  <button type='submit' className='btn btn-primary'>Submit</button>
</div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddCharacter;
