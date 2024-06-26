import React from 'react';
import { Component } from 'react/cjs/react.development';
import './charListItem.scss';

// const CharListItem = (props) => {
//     const {name, thumbnail, onCharSelected} = props;
//     let imgClassName = "";
//     let liClassName = "char__item";

//     if (thumbnail == 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
//         imgClassName += " of-con";
//         liClassName += " pt-off";
//     }

//     return (
//         <li className={liClassName} onClick={onCharSelected}>
//             <img className={imgClassName} src={thumbnail} alt="abyss"/>
//             <div className="char__name">{name}</div>
//         </li>
//     )
// }

class CharListItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {name, thumbnail, onCharSelected, clickMe} = this.props;
        let imgClassName = "";
        let liClassName = "char__item";

        if (thumbnail == 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgClassName += " of-con";
            liClassName += " pt-off";
        }

        return (
            <li className={liClassName} onClick={onCharSelected}>
                <img className={imgClassName} src={thumbnail} alt="abyss"/>
                <div className="char__name">{name}</div>
            </li>
        )}   
}

export default CharListItem;