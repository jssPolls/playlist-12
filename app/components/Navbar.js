import React from 'react';
import {Link} from 'react-router';
import NavbarStore from '../stores/NavbarStore';
import NavbarActions from '../actions/NavbarActions';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = NavbarStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NavbarStore.listen(this.onChange);
    NavbarActions.getCharacterCount();

    let socket = io.connect();

    socket.on('onlineUsers', (data) => {
      NavbarActions.updateOnlineUsers(data);
    });

    $(document).ajaxStart(() => {
      NavbarActions.updateAjaxAnimation('fadeIn');
    });

    $(document).ajaxComplete(() => {
      setTimeout(() => {
        NavbarActions.updateAjaxAnimation('fadeOut');
      }, 750);
    });
  }

  componentWillUnmount() {
    NavbarStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();

    let searchQuery = this.state.searchQuery.trim();

    if (searchQuery) {
      NavbarActions.findCharacter({
        searchQuery: searchQuery,
        searchForm: this.refs.searchForm,
        history: this.props.history
      });
    }
  }

  render() {
    return (
      <nav className='navbar navbar-default navbar-static-top'>
        <div className='navbar-header'>
          <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar'>
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
          </button>
          <Link to='/' className='navbar-brand'>
            <span className={'triangles animated ' + this.state.ajaxAnimationClass}>
              <div className='tri invert'></div>
              <div className='tri invert'></div>
              <div className='tri'></div>
              <div className='tri invert'></div>
              <div className='tri invert'></div>
              <div className='tri'></div>
              <div className='tri invert'></div>
              <div className='tri'></div>
              <div className='tri invert'></div>
            </span>
            90's Playlist
            <span className='badge badge-up badge-danger'>{this.state.onlineUsers}</span>
          </Link>
        </div>
        <div id='navbar' className='navbar-collapse collapse'>
          <form ref='searchForm' className='navbar-form navbar-left animated' onSubmit={this.handleSubmit.bind(this)}>
            <div className='input-group'>
              <input type='text' className='form-control' placeholder={this.state.totalCharacters + ' characters'} value={this.state.searchQuery} onChange={NavbarActions.updateSearchQuery} />
              <span className='input-group-btn'>
                <button className='btn btn-default' onClick={this.handleSubmit.bind(this)}><span className='glyphicon glyphicon-search'></span></button>
              </span>
            </div>
          </form>
          <ul className='nav navbar-nav'>
            <li><Link to='/'>Home</Link></li>
              
            <li><Link to='/stats'>Stats</Link></li>
            <li><Link to='/add'>Add Another</Link></li>

            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Standings <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link to='/top'>Top Overall</Link></li>

                <li className='divider'></li>
                <li><Link to='/shame'>Hall of Shame</Link></li>
              </ul>
            </li>

            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>See Only<span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link to='/rock'>Rock</Link></li>

                <li className='/divider'></li>
                <li><Link to='/pop'>Pop</Link></li>
                <li className='/divider'></li>
                <li><Link to='/classical'>Classical</Link></li>
                <li className='/divider'></li>
                <li><Link to='/bollywood'>Bollywood</Link></li>
                <li className='/divider'></li>
                <li><Link to='/Hip-Hop'>Hip-Hop</Link></li>
              </ul>
            </li>
                        <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Pop <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link to='/pop'>All</Link></li>


              </ul>
            </li>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Classical <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link to='/classical'>All</Link></li>
                                 
              </ul>

            </li>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Rock <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link to='/rock'>All</Link></li>
                                 
              </ul>

            </li>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Hip-Hop <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link to='/hiphop'>All</Link></li>
                                 
              </ul>

            </li>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Bollywood <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link to='/bollywood'>All</Link></li>
                                 
              </ul>

            </li>

          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
