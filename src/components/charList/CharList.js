import { Component } from 'react/cjs/react.development';
import MarvelService from '../../services/MarvelService';
import CharListItem from '../charListItem/CharListItem';

import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';

class CharList extends Component {
        state = {
            list: []
        }
    

    marvelService = new MarvelService();

    componentDidMount() {
        this.getCharList();
    }

    listUpdate = (list) => {
        this.setState({list: list});
    }

    getCharList = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.listUpdate)
            .catch(this.onError);
    }

    
    render() {

        const data = this.state.list;

        const element = data.map(item => {
            const {id, ...itemProps} = item;
            

            return (
                <CharListItem 
                key={id}
                onCharSelected={() => this.props.onCharSelected(id)}
                {...itemProps}/>
            )

        })


        return (
            <div className="char__list">
                <ul className="char__grid">
                    {/* <li className="char__item">
                        <img src={abyss} alt="abyss"/>
                        <div className="char__name">Abyss</div>
                    </li> */}
                    {element}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
      
}

export default CharList;