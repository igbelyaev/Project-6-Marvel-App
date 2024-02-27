import { Component } from 'react/cjs/react.development';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import MarvelService from '../../services/MarvelService';
import './charInfo.scss';


class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    updateChar = () => {
        const {charId} = this.props;
        
        if (!charId) {
            return;
        }

        this.onCharLoading();
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)


    }

    onCharLoaded = (char) => {
        this.setState({char: char, loading: false, error: false})
    }
    
    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }
    
    onError = () => {
        this.setState({loading: false, error: true})
    }

    render() {
        const {char, loading, error} = this.state;

        const skeleton = char || loading || error ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;


        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }

    
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    let imgClassName = "char__basics__img";

    if (thumbnail == 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ||
        thumbnail == 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
        imgClassName = imgClassName + " of-con";
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} className={imgClassName}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description ? description : 'There is no additional info'}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {   comics.length ?
                    comics.map((item, i) => {
                        if (i < 10) {
                            return (
                                <li key={i} className="char__comics-item">
                                    {item.name}
                                </li>   
                            )
                        }
                        
                    }) : 'This character has no comics'
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;