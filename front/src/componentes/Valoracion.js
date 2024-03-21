function Valoracion(props) {
    const {valoracion, numReviews, caption} = props;
    return (
        <div className="valoracion">
            <span>
                <i 
                    className={
                        valoracion>=1 ? 
                            'fas fa-star':
                        valoracion>=0.5 ? 
                            'fas fa-star-half-alt': 
                            'far fa-star'
                    }
                />
            </span>
            <span>
                <i 
                    className={
                        valoracion>=2 ? 
                            'fas fa-star':
                        valoracion>=1.5 ? 
                            'fas fa-star-half-alt': 
                            'far fa-star'
                    }
                />
            </span>
            <span>
                <i 
                    className={
                        valoracion>=3 ? 
                            'fas fa-star':
                        valoracion>=2.5 ? 
                            'fas fa-star-half-alt': 
                            'far fa-star'
                    }
                />
            </span>
            <span>
                <i 
                    className={
                        valoracion>=4 ? 
                            'fas fa-star':
                        valoracion>=3.5 ? 
                            'fas fa-star-half-alt': 
                            'far fa-star'
                    }
                />
            </span>
            <span>
                <i 
                    className={
                        valoracion>=5 ? 
                            'fas fa-star':
                        valoracion>=4.5 ? 
                            'fas fa-star-half-alt': 
                            'far fa-star'
                    }
                />
            </span>

            {caption ? (
                <span>{caption}</span>
            ) : (
                <span>{' ' + numReviews + ' opiniones'}</span>
            )
        }
        </div>
    )
}

export default Valoracion;