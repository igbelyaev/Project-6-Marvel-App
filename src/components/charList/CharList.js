import { Component } from 'react/cjs/react.development';
import MarvelService from '../../services/MarvelService';
import CharListItem from '../charListItem/CharListItem';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import PropTypes from 'prop-types';

import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';

class CharList extends Component {
        state = {
            list: [],
            loading: true,
            error: false,
            newItemLoading: false,
            offset: 210,
            charEnded: false
        }
    

    marvelService = new MarvelService();

    observer = new IntersectionObserver(([entry], observer) => {
        if (entry.isIntersecting) {
            this.observer.unobserve(entry.target);
            this.getCharList(this.state.offset);
        }
    }, {});    

    componentDidMount() {
        this.getCharList();
    }

    componentDidUpdate(prevProps) {
        const lastItem = document.querySelector('li.char__item:last-of-type');
        
        if (lastItem &&
            !this.state.newItemLoading &&
            this.props.charId === prevProps.charId &&
            !this.state.charEnded) {
            this.observer.observe(lastItem);
        }

    }

    onRequest = (offset) => {
        this.getCharList(offset)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    listUpdate = (newList) => {
        let ended = false;
        if (newList.length < 9) {
            ended = true;
        }

        this.setState(({offset, list}) => ({
            list: [...list, ...newList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }));



    }

    getCharList = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.listUpdate)
            .catch(this.onError);
    }

    
    render() {

        const {loading, error, offset, newItemLoading, charEnded} = this.state;

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
 
        const data = this.state.list;

        let element = data.map((item, i) => {
            const {id, ...itemProps} = item;

           return (
                <CharListItem 
                key={id}
                onCharSelected={() => this.props.onCharSelected(id)}
                {...itemProps}/>
            )

        })

        element = !(loading || error) ? element : null;

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {/* <li className="char__item">
                        <img src={abyss} alt="abyss"/>
                        <div className="char__name">Abyss</div>
                    </li> */}
                    {errorMessage}
                    {spinner}
                    {element}
                </ul>
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}
                    >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
      
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;