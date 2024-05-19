import { React, Component} from 'react/cjs/react.development';
import { useRef } from 'react';
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

    itemRefs = [];
    // listRef = React.createRef();
    // listRef = useRef(null);
    

    marvelService = new MarvelService();

    observer = new IntersectionObserver(([entry], observer) => {
        if (entry.isIntersecting) {
            this.observer.unobserve(entry.target);
            this.getCharList(this.state.offset);
        }
    }, {});  
    
    getMap() {
        if (!this.listRef.current) {
            this.listRef.current = new Map();
        }
        return this.listRef.current;
    }

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

        console.log(this.itemRefs);

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

    setRef = ref => {
        console.log(ref);
        this.itemRefs.push(ref);
    };

    focusOnItem = (i) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[i].classList.add('char__item_selected');
        this.itemRefs[i].focus();
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
                // onClick={this.focusOnItem(i)}
                ref={this.setRef}
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